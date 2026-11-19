"""Shared hard-surface geometry, PBR palette and preview studio for Pale assets."""
import math
from functools import partial

import bpy
import bmesh
from mathutils import Vector


class Assembly:
    """Accumulate solid shells, keeping subsystem meshes editable in the master."""
    def __init__(self, name, prefix, scale, materials, collection):
        self.prefix, self.scale = prefix, scale
        self.materials, self.collection = materials, collection
        self.name = name
        self.vertices, self.faces, self.finishes = [], [], []

    def solid(self, rings, mat, close=False):
        # Ring loft. Closing the axial profile produces hollow collars and bells.
        base = len(self.vertices)
        n = len(rings[0])
        for ring in rings:
            self.vertices.extend(tuple(self.scale * v for v in p) for p in ring)
        def face(indices):
            self.faces.append(tuple(base + i for i in indices))
            self.finishes.append(mat)
        for j in range(len(rings) if close else len(rings)-1):
            k = (j+1) % len(rings)
            for i in range(n):
                h = (i+1) % n
                face((j*n+i, j*n+h, k*n+h, k*n+i))
        if not close:
            face(reversed(range(n)))
            face(range((len(rings)-1)*n, len(rings)*n))

    def hull(self, stations, mat, y=0, z=0):
        # Octagonal pressure shell with broad flats and bevelled shoulders.
        rings = []
        for x, w, h in stations:
            rings.append([(x, y+a*w, z+b*h) for a,b in
                          [(1,.63),(.68,1),(-.68,1),(-1,.63),(-1,-.63),(-.68,-1),(.68,-1),(1,-.63)]])
        self.solid(rings, mat)

    def panel(self, x, y, z, l, w, h, mat, bevel=.12):
        d = min(bevel, l*.2, w*.25, h*.25)
        self.hull([(x-l/2,w/2-d,h/2-d),(x-l/2+d,w/2,h/2),
                   (x+l/2-d,w/2,h/2),(x+l/2,w/2-d,h/2-d)], mat, y,z)

    def turned(self, profile, mat, y=0, z=0, sides=32, closed=False):
        self.solid([[(x,y+r*math.cos(i*math.tau/sides),z+r*math.sin(i*math.tau/sides))
                     for i in range(sides)] for x,r in profile],mat,closed)

    def rod(self, a, b, radius, mat, sides=6):
        a,b=Vector(a),Vector(b)
        axis=(b-a).normalized()
        u=axis.cross(Vector((0,0,1)) if abs(axis.z)<.9 else Vector((0,1,0))).normalized()
        v=axis.cross(u)
        ring=[radius*(u*math.cos(i*math.tau/sides)+v*math.sin(i*math.tau/sides)) for i in range(sides)]
        self.solid([[p+d for d in ring] for p in (a,b)],mat)

    def build(self):
        mesh=bpy.data.meshes.new(self.prefix+"-"+self.name)
        mesh.from_pydata(self.vertices,[],self.faces)
        slots=list(dict.fromkeys(self.finishes))
        for mat in slots:
            mesh.materials.append(self.materials[mat])
        for poly,mat in zip(mesh.polygons,self.finishes):
            poly.material_index=slots.index(mat)
        bm=bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
        bm.to_mesh(mesh)
        bm.free()
        obj=bpy.data.objects.new(mesh.name,mesh)
        self.collection.objects.link(obj)
        return obj


def geometry_kit(prefix, scale, collection):
    materials = {}


    def finish(name, color, metal, rough):
        material = bpy.data.materials.new(prefix + "-" + name)
        material.diffuse_color = (*color, 1)
        material.use_nodes = True
        shader = material.node_tree.nodes.get("Principled BSDF")
        for socket, value in [("Base Color", (*color, 1)), ("Metallic", metal), ("Roughness", rough)]:
            shader.inputs[socket].default_value = value
        materials[name] = material


    finish("chalk", (.72, .69, .60), .23, .54)
    finish("porcelain", (.89, .87, .77), .17, .42)
    finish("ash", (.30, .31, .29), .55, .48)
    finish("graphite", (.072, .085, .086), .67, .42)
    finish("iron", (.20, .226, .226), .80, .35)
    finish("carbon", (.026, .035, .037), .24, .69)
    finish("oxide", (.345, .115, .046), .46, .49)
    finish("brass", (.52, .34, .135), .67, .38)
    finish("glass", (.035, .078, .088), .53, .18)
    return partial(Assembly, prefix=prefix, scale=scale, materials=materials, collection=collection), materials


def make_studio(scene, scale, samples):
    world=bpy.data.worlds.new("neutral-studio")
    scene.world=world
    world.use_nodes=True
    nodes=world.node_tree.nodes
    bg=nodes.get("Background")
    bg.inputs[0].default_value=(.50,.56,.65,1)
    bg.inputs[1].default_value=.37
    path=nodes.new("ShaderNodeLightPath")
    mix=nodes.new("ShaderNodeMixShader")
    backdrop=nodes.new("ShaderNodeBackground")
    backdrop.inputs[0].default_value=(.015,.022,.027,1)
    links=world.node_tree.links
    links.new(path.outputs["Is Camera Ray"],mix.inputs[0])
    links.new(bg.outputs[0],mix.inputs[1])
    links.new(backdrop.outputs[0],mix.inputs[2])
    links.new(mix.outputs[0],nodes.get("World Output").inputs["Surface"])
    def softbox(name,location,color,power,size):
        light=bpy.data.lights.new(name,"AREA")
        light.energy=power*scale**2
        light.shape="DISK"
        light.size=size*scale
        light.color=color
        obj=bpy.data.objects.new(name,light)
        scene.collection.objects.link(obj)
        obj.location=Vector(location)*scale
        obj.rotation_euler=(-obj.location).to_track_quat("-Z","Y").to_euler()
    softbox("studio-key",(-28,-41,60),(1,.90,.76),110000,48)
    softbox("studio-rim",(6,29,38),(.77,.86,1),120000,55)
    softbox("studio-fill",(37,-42,-13),(.80,.85,.9),34000,37)
    camera=bpy.data.cameras.new("inspection-lens")
    obj=bpy.data.objects.new("inspection-camera",camera)
    scene.collection.objects.link(obj)
    scene.camera=obj
    scene.render.engine="CYCLES"
    scene.cycles.device="CPU"
    scene.cycles.samples=samples
    scene.cycles.use_denoising=True
    scene.render.image_settings.file_format="PNG"
    scene.render.resolution_percentage=100
    return obj


def frame(camera, direction, width, height, roll=0, *, collection, scale, scene):
    from mathutils import Quaternion
    forward=-Vector(direction).normalized()
    rotation=forward.to_track_quat("-Z","Y") @ Quaternion((0,0,1),roll)
    right=rotation @ Vector((1,0,0))
    up=rotation @ Vector((0,1,0))
    points=[obj.matrix_world @ v.co for obj in collection.objects if obj.type=="MESH" for v in obj.data.vertices]
    xs=[p.dot(right) for p in points]
    ys=[p.dot(up) for p in points]
    focus=right*((min(xs)+max(xs))/2)+up*((min(ys)+max(ys))/2)
    camera.location=focus-forward*180*scale
    camera.rotation_euler=rotation.to_euler()
    camera.data.type="ORTHO"
    camera.data.ortho_scale=max(max(xs)-min(xs),(max(ys)-min(ys))*width/height)*1.13
    camera.data.clip_end=400*scale
    scene.render.resolution_x=width
    scene.render.resolution_y=height


