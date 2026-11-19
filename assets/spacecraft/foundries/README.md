# Foundry network · v001

The four models represent separate working sites across cislunar space. Each is a visual reconstruction at a proposed metre scale. Relative orbits, branch separation, plant capacity, equipment quantities and thermal or power ratings remain unresolved.

The v2.0 handoff assigns water and propellant to Alpha, metals and bulk structures to Beta, and higher-complexity assembly to Gamma. The later naming record identifies Delta. Its industrial assignment is absent from the bundled equipment sources. Delta’s cargo-exchange role is a provisional design choice, also identified in its metadata and documentary shot. [Canon handoff](../../../docs/canon/Operation_Pale_Canon_Handoff_v2_0.md) · [Naming record](../../../docs/canon/README.md)

| Branch | Architectural read | Editable source | Preview plates |
| --- | --- | --- | --- |
| Alpha | Two insulated tank banks flank a fluid-transfer spine. Valved feeds connect reservoirs, separation columns and the tanker berth. | [Blend](alpha/foundry-alpha-v001.blend) | [Side](alpha/previews/side.png) · [Top](alpha/previews/top.png) · [Three-quarter](alpha/previews/three-quarter.png) |
| Beta | Feed conveyors and braced reduction vessels lead into the rolling stands and billet-dispatch berth. | [Blend](beta/foundry-beta-v001.blend) | [Side](beta/previews/side.png) · [Top](beta/previews/top.png) · [Three-quarter](beta/previews/three-quarter.png) |
| Gamma | Two portal cranes span open build ways. Their suspended carriages serve a partly skinned assembly held in a jig. | [Blend](gamma/foundry-gamma-v001.blend) | [Side](gamma/previews/side.png) · [Top](gamma/previews/top.png) · [Three-quarter](gamma/previews/three-quarter.png) |
| Delta | Three transfer piers, local loaders and capture collars surround a dispatch hub. A dedicated utility boom clears the berthing approaches. **Provisional role.** | [Blend](delta/foundry-delta-v001.blend) | [Side](delta/previews/side.png) · [Top](delta/previews/top.png) · [Three-quarter](delta/previews/three-quarter.png) |

## Rebuild

Run from the repository root with Blender 5.3. The default builds all four sites, including the poster used for reduced motion.

```sh
blender --background --factory-startup --python-exit-code 1 --python assets/spacecraft/foundries/generate.py
```

Append `-- --branch gamma` to rebuild one site. The optional `--metres-per-unit` and `--samples` flags default to 6 and 12. If changing scale, review the documentary camera widths too.

Each branch function creates independently named rigid subsystem nodes and linked modules. Shared utilities include articulated-site mounting origins, solar tracking yokes, photovoltaic blankets, separate carbon radiators with heat pipes, freight capture collars and lattice trestles. The shared industrial kit supplies the Caravan palette, mesh primitives and studio. The exporter packs surface finishes into one shared PBR material with embedded textures. All geometry is authored for this project.

## Measured delivery

Dimensions use glTF X × Y × Z in metres, with +Y dorsal and +X the primary service axis. Triangles include repeated instances in the fully visible model. Each opaque primitive contributes one draw per pass. Full precision, per-node pivots, mesh indices, palette values and dependencies are in the adjacent JSON files.

| Branch | Proposed XYZ (m) | Unique meshes / nodes | Visible triangles | Materials | Draws | GLB bytes | Export |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Alpha | 668.7 × 137.8 × 342.0 | 8 / 14 | 20,476 | 1 | 14 | 799,848 | [GLB](../../../public/models/foundries/foundry-alpha-v001.glb) · [JSON](../../../public/models/foundries/foundry-alpha-v001.json) |
| Beta | 644.7 × 126.6 × 342.0 | 9 / 13 | 13,956 | 1 | 13 | 748,228 | [GLB](../../../public/models/foundries/foundry-beta-v001.glb) · [JSON](../../../public/models/foundries/foundry-beta-v001.json) |
| Gamma | 638.7 × 135.6 × 342.0 | 8 / 11 | 22,100 | 1 | 11 | 1,125,424 | [GLB](../../../public/models/foundries/foundry-gamma-v001.glb) · [JSON](../../../public/models/foundries/foundry-gamma-v001.json) |
| Delta | 638.7 × 96.0 × 553.4 | 8 / 15 | 18,552 | 1 | 15 | 572,888 | [GLB](../../../public/models/foundries/foundry-delta-v001.glb) · [JSON](../../../public/models/foundries/foundry-delta-v001.json) |

## Documentary and inspection

Select **Resources** or **Industrial build-up** in the opening reel. Map shots connect close-ups of Alpha (01:31), Beta (01:56), Gamma (02:07) and Delta (02:28). Camera poses sample local playback time. Only the active branch is drawn. A blocked GLB uses a procedural massing model. Reduced-motion and WebGL-unavailable views use the corresponding rendered plate.

Open any export with **Local GLB** in `/dev/models` to orbit it, inspect its metre dimensions and compare lighting. These first assets supply single-detail rigid geometry. Their layouts support subsystem selection and future animation. Production throughput, deployment clips, collisions, distance LODs and multi-site frame rates have not been established.
