# Spacecraft asset handoff

The development inspector accepts a local, self-contained GLB. Run `npm run dev`, open `/dev/models` on the printed local URL and choose **Local GLB**. The file stays in the browser. The inspector frames its bounding box and displays its original XYZ dimensions in metres. Orbit and pan to check the silhouette, toggle the grid, and compare studio reflections with raking sunlight. The ochre cube measures one metre on each side. Grid spacing adapts to the model and is printed below the viewport.

**Use manifest** returns to the registered Caravan source. With an empty source, or while a file loads or fails, the inspector shows the procedural Caravan. Its proportions are an artistic proxy. Obtain approved dimensions separately before interpreting a model as canonical.

## Authoring conventions

| Property | Convention |
| --- | --- |
| Units | Metric in Blender, unit scale 1. One Blender unit and one exported scene unit represent one metre. |
| Axes | In Blender, point the bow along +X and dorsal surfaces along +Z. Export with +Y Up. In Three.js the bow remains +X and dorsal is +Y. |
| Origin | Centre the main hull around the asset root at world (0, 0, 0). Keep child pivots at hinges and deployment joints. |
| Transforms | Use an identity root, unit scale and positive scale throughout the hierarchy. Set the actual dimensions before export. |
| Naming | Use lowercase kebab-case for files, for example `caravan-v001.glb`. Use stable descriptive names such as `caravan-root`, `caravan-hull` and `caravan-array-port`. Prefix material and texture names with the asset name. |
| Ownership | Record author, revision, reference dimensions and texture provenance alongside the source project. Label illustrative dimensions and unapproved designs as proposed. |

## Export from Blender

1. Keep an editable .blend master outside the public web directory. In a working copy, select the render meshes and their root. Check scene units and dimensions, then use **Object → Apply → Rotation & Scale** on static mesh objects. Preserve local positions and joint pivots. Check normals, UVs and the evaluated geometry after any modifiers.
2. Build metallic-roughness materials using Principled BSDF. Use sRGB for base colour and emissive images. Use Non-Color for normal, roughness, metallic and occlusion data. Use tangent-space +Y normals through a Normal Map node. Roughness uses the green channel and metallic uses blue when packed together. Occlusion can share the red channel. Bake procedural Blender shaders to UV textures before export.
3. Reuse materials across repeated parts. Use JPEG for opaque colour maps and PNG for masks, normal maps and alpha. Use opaque or alpha-masked surfaces where appropriate. Prefer embedded PNG/JPEG for the first handoff. Meshopt geometry decoding is available. Draco and KTX2/Basis require a separately configured decoder or transcoder before adopting them.
4. Choose **File → Export → glTF 2.0**, select **glTF Binary (.glb)**, enable **Selected Objects** and **+Y Up**, and include materials, UVs and normals. Include tangents for normal-mapped surfaces. Exclude authoring cameras, lights and unused animation tracks. Ensure images are available to Blender at export and embedded in the resulting GLB. [Blender glTF documentation](https://docs.blender.org/manual/en/latest/addons/scene_gltf2.html)
5. Open the GLB directly in the inspector. Verify the XYZ readout against your authored dimensions. Inspect texture seams, the silhouette and exposed backfaces under both lights. After re-exporting, choose the file again to inspect the new revision.

## Initial performance budgets

These are proposed delivery targets for a single foreground spacecraft at the introduction's existing display size. Measure the exported asset and revise them if a shot requires more detail.

| Item | Target |
| --- | --- |
| Packaged GLB | Up to 5 MiB |
| Geometry | Up to 50,000 rendered triangles |
| Draw calls | Up to 20 visible mesh primitives/material draws per pass |
| Textures | Start at 1K per map, up to 2K for a shared hero atlas. Target at most 32 MiB of resident textures including mipmaps. |

A 2048 × 2048 RGBA8 texture with a full mip chain costs about 21.3 MiB on the GPU even when the embedded JPEG is small. Share atlases and reduce map resolution first. Use Blender's evaluated triangle count and check the exported glTF primitive/material split when estimating draws.

## Registering an asset

Place each versioned GLB under `public/models/spacecraft/`. The Caravan manifest points to `/models/spacecraft/caravan-v002.glb`. Both the inspector and the Emplacement arrival shot consume that entry. The adjacent JSON records verified asset structure and proposed dimensions. The [Caravan rebuild guide](../../assets/spacecraft/caravan/README.md) describes the generator and the reusable palette exporter.

`src/models/GlbModel.tsx` mounts inside an R3F Canvas. Pass a nullable source and a procedural JSX fallback. Optional `onState(state, root, message)` reports procedural, loading, ready and error states for a surrounding UI. A new URL resets the error boundary. Each instance clones the loaded hierarchy and shares cached mesh resources. The shot retains ownership of its timeline, transform and lighting.
