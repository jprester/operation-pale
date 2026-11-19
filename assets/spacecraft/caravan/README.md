# Caravan v002 · Emplacement asset

The canon handoff establishes a commercial carrier with command facilities, seed industry and a finite manifest. The approved v001 silhouette provides the visual foundation. Dimensions, fittings, heat-collector geometry and drive housings remain proposed art direction.

The revision adds paired coolant headers and pump housings at the radiator roots, matte carbon emitter plates with transverse heat pipes, a small personnel lock and fluid couplers inside each cargo docking collar, and access hatches, step irons and lifting-point markings on the detachable cassettes. The leaves dissipate heat from the propulsion-side manifold. The model carries no photovoltaic array.

## Regenerate

From the repository root, run with Blender 5.3:

```sh
blender --background --factory-startup --python-exit-code 1 --python assets/spacecraft/caravan/generate.py
```

On macOS the bundled executable is typically `/Applications/Blender.app/Contents/MacOS/Blender`. The Python generator is the source of truth. Edit subsystem functions there and regenerate before registering a new revision. Its optional flags follow a separate `--`: `--samples 16` sets preview fidelity, `--metres-per-unit 5` sets the proposed authoring scale, and `--no-previews` skips all images, including the WebP poster.

The run writes the editable .blend beside the script, three PNGs under `previews/`, a transparent reduced-motion poster under `public/art/`, and matching GLB and JSON files under `public/models/spacecraft/`. The GLB uses metres, +X bow and +Y dorsal. Blender uses +Z dorsal. The root transform is identity.

## Reusing the pipeline

The exporter in `../spacecraft_export.py` accepts a named rigid-object hierarchy and a set of flat Principled materials. It maps each source finish to a texel in two embedded palette textures: sRGB base colour and linear packed roughness/metallic. Each subsystem mesh uses one shared PBR material. Linked pod variants share their exported geometry. The .blend retains the nine separate editable materials.

Look up subsystem **node names** from the JSON and select them relative to `caravan-root`. For example, `caravan-radiator-port-aft` has its local origin on the mounting header and swings about its longitudinal X axis. The cargo meshes use their own attachment-local origins. The ship can be cloned and subsystems hidden independently. For a per-instance highlight, clone the selected mesh's shared material before changing it.

## Measured delivery

| Quantity | v002 |
| --- | ---: |
| Proposed length × beam × height | 536.00 × 190.98 × 97.16 m |
| Mesh nodes / unique meshes | 19 / 16 |
| Unique / fully visible triangles | 31,208 / 41,772 |
| Exported PBR materials / authored finishes | 1 / 9 |
| Fully visible opaque draws per pass | 19 |
| GLB size | 1,987,068 bytes |

The JSON records each node, mesh index, pivot and triangle count. Measurements cover the ship alone. The asset stays within the current handoff budgets. The inspector grid, extra rendering passes and other scene content have separate costs.

## Editorial integration and limitations

The six-second carrier shot starts at reel time 18 s. Its orthographic camera moves from an elevated aft view toward the exposed workshop flank. Camera position, aim and framing are sampled directly from scene time in metres. At 24 s the documentary cuts to the cislunar Foundry chart. A transient GLB failure or load delay displays the lightweight procedural proxy. Reduced motion uses the rendered still.

This version supports rigid subsystem selection and posing. It has one detail level, flat palette texturing and no collision meshes or authored deployment clips. Fine finish variation, collision proxies and distance LODs are future work for sustained close-ups or multi-ship gameplay. Validation used desktop Chromium; the draw measurement does not establish frame rate on target game hardware.
