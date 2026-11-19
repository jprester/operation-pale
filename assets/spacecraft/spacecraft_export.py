"""Blender export for rigid, palette-based spacecraft with named subsystem nodes."""
import json
import struct
import tempfile
import zlib
from pathlib import Path

import bpy


def palette_image(folder, name, rgb, nonlinear):
    """Write one texel per finish. Colour is sRGB; metallic/roughness are linear."""
    def encode(value):
        if nonlinear:
            value = 12.92*value if value < .0031308 else 1.055*value**(1/2.4)-.055
        return max(0, min(255, round(value*255)))

    def chunk(kind, data):
        return (struct.pack(">I", len(data)) + kind + data
                + struct.pack(">I", zlib.crc32(kind+data)))

    row = bytes(encode(channel) for pixel in rgb for channel in pixel)
    header = struct.pack(">IIBBBBB", len(rgb), 1, 8, 2, 0, 0, 0)
    file = folder / (name + ".png")
    file.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header)
                     + chunk(b"IDAT", zlib.compress(b"\0"+row)) + chunk(b"IEND", b""))
    image = bpy.data.images.load(str(file))
    if not nonlinear:
        image.colorspace_settings.name = "Non-Color"
    image.pack()
    return image


def palette_material(name, finishes, folder):
    records = []
    for material in finishes.values():
        shader = material.node_tree.nodes.get("Principled BSDF")
        records.append({
            "name": material.name,
            "linearBaseColor": list(shader.inputs["Base Color"].default_value)[:3],
            "roughness": shader.inputs["Roughness"].default_value,
            "metallic": shader.inputs["Metallic"].default_value,
        })
    colors = palette_image(folder, name+"-base", [r["linearBaseColor"] for r in records], True)
    orm = palette_image(folder, name+"-orm", [(1,r["roughness"],r["metallic"]) for r in records], False)
    material = bpy.data.materials.new(name+"-palette")
    material.use_nodes = True
    tree = material.node_tree
    shader = tree.nodes.get("Principled BSDF")
    split = tree.nodes.new("ShaderNodeSeparateColor")
    for image, dest in [(colors,shader.inputs["Base Color"]), (orm,split.inputs[0])]:
        node = tree.nodes.new("ShaderNodeTexImage")
        node.image = image
        node.interpolation = "Closest"
        node.extension = "EXTEND"
        tree.links.new(node.outputs["Color"], dest)
    tree.links.new(split.outputs["Green"],shader.inputs["Roughness"])
    tree.links.new(split.outputs["Blue"],shader.inputs["Metallic"])
    return material, records, (colors, orm)


def export_asset(path, collection, finishes, *, version, generator):
    """Swap only mesh data for export. Preserve authored hierarchy, pivots and instances."""
    path.parent.mkdir(parents=True, exist_ok=True)
    objects = [obj for obj in collection.objects if obj.type == "MESH"]
    sources = {obj: obj.data for obj in objects}
    ids = {mat:i for i,mat in enumerate(finishes.values())}
    copies = {}
    bpy.context.view_layer.update()
    points = [obj.matrix_world @ v.co for obj in objects for v in obj.data.vertices]
    bounds = [round(max(p[i] for p in points)-min(p[i] for p in points), 4) for i in (0,2,1)]
    with tempfile.TemporaryDirectory() as tmp:
        material, records, images = palette_material(path.stem, finishes, Path(tmp))
        try:
            for obj, source in sources.items():
                if source not in copies:
                    mesh = source.copy()
                    uv = mesh.uv_layers.new(name="finish-index")
                    for face in mesh.polygons:
                        column = ids[source.materials[face.material_index]]
                        for loop in face.loop_indices:
                            uv.data[loop].uv = ((column+.5)/len(ids), .5)
                        face.material_index = 0
                    mesh.materials.clear()
                    mesh.materials.append(material)
                    copies[source] = mesh
                obj.data = copies[source]
            bpy.ops.object.select_all(action="DESELECT")
            for obj in collection.objects:
                obj.select_set(True)
            bpy.ops.export_scene.gltf(filepath=str(path), use_selection=True, export_format="GLB",
                                      export_yup=True, export_animations=False,
                                      export_cameras=False, export_lights=False)
        finally:
            for obj, source in sources.items():
                obj.data = source
            for mesh in copies.values():
                bpy.data.meshes.remove(mesh)
            bpy.data.materials.remove(material)
            for image in images:
                bpy.data.images.remove(image)

    # Count instantiated primitives as well as unique buffer geometry from the emitted GLB.
    binary = path.read_bytes()
    length = struct.unpack_from("<I", binary, 12)[0]
    gltf = json.loads(binary[20:20+length])
    meshes = gltf["meshes"]
    def triangles(mesh):
        return sum(gltf["accessors"][p["indices"]]["count"]//3 for p in mesh["primitives"])
    systems = []
    for node in gltf["nodes"]:
        if "mesh" in node:
            mesh = meshes[node["mesh"]]
            systems.append({"node":node["name"], "mesh":node["mesh"],
                            "localPivotMetres":node.get("translation",[0,0,0]),
                            "triangles":triangles(mesh), "primitives":len(mesh["primitives"])})
    metadata = {
        "asset":path.stem, "version":version, "status":"proposed visual design and scale",
        "axes":{"up":"+Y","bow":"+X"}, "dimensionsMetresXYZ":bounds,
        "root":next(n["name"] for n in gltf["nodes"] if "children" in n),
        "subsystems":systems, "palette":records,
        "materials":[m["name"] for m in gltf["materials"]],
        "stats":{"uniqueMeshes":len(meshes),"meshNodes":len(systems),
                 "uniqueTriangles":sum(triangles(m) for m in meshes),
                 "visibleTriangles":sum(s["triangles"] for s in systems),
                 "opaqueDrawsPerPass":sum(s["primitives"] for s in systems),
                 "bytes":len(binary)},
        "dependencies":{"generator":generator,"exporter":"assets/spacecraft/spacecraft_export.py",
                        "blender":bpy.app.version_string,"externalRuntimeFiles":[],
                        "embeddedImages":[i["name"] for i in gltf["images"]],
                        "requiredExtensions":gltf.get("extensionsRequired",[])},
    }
    path.with_suffix(".json").write_text(json.dumps(metadata, indent=2)+"\n")
