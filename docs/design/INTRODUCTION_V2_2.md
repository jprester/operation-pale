# The Road to Earth · cinematic cut

## Editing plan

Keep the seven sequences, the 04:00 runtime and the v2.1 recording sheet. The new human shots are possible views of incomplete evidence. No particular institution, observation, meeting, nationality or date is attested. No narration changes are proposed. The existing atlas supplies geography between physically separate sites.

| Reel | Picture and treatment |
| --- | --- |
| 00:00–00:32 | Discovery. Hold the existing Earth approach through survey, assessment and charter. |
| 00:32–00:43 | Expedition. Establish the Caravan’s arrival on the Solar System atlas. |
| 00:43–01:08 | Move from the carrier’s aft silhouette to the open cargo spine. |
| 01:08–01:15 | Resources. Find the asteroid works on the heliocentric map. |
| 01:15–01:24 | Dissolve from the atlas into a photographic close view of a processing bridge anchored to fractured rock. Hold on the feed line and anchoring feet, then dissolve back to the atlas. |
| 01:24–01:31 | Pull back to the map to establish the separate Belt Reserve. |
| 01:31–01:44 | Alpha. A service tender transfers a tank alongside the volatile works. |
| 01:44–01:56 | Industrial build-up. Use the Earth–Moon detail to establish the workshops. |
| 01:56–02:07 | Beta. A fabricated section advances along a handling rail. |
| 02:07–02:19 | Gamma. Two successive lattice bays slide into register at an external assembly jig. |
| 02:19–02:28 | Return to freight paths and the Anchor depot. |
| 02:28–02:35 | Delta. A cargo pallet approaches an exchange berth. This function remains provisional. |
| 02:35–02:54 | Infrastructure. Local map builds up the deployment layer. |
| 02:54–03:04 | Space surveillance. Slow pan across a quiet shift of operators cataloguing uncertain tracks. |
| 03:04–03:12 | Return to the wider logistics picture known to the Company. |
| 03:12–03:20 | Deadline. Observatory exterior and control-room window, dark-adapted night shift. |
| 03:20–03:28 | Two researchers compare exposures. Pair the photograph with a reconstructed observational field. |
| 03:28–03:36 | Institutional briefing. Hold on a small civilian meeting with inconclusive evidence. |
| 03:36–03:46 | The network on the eve of contact. |
| 03:46–04:00 | Notification. Hold the public receiver as the first instruction appears. |

## Reconstruction and media

The four human inserts require wide photographic compositions with enough margin for a six-percent push or lateral drift. Subject, caption, prompt and delivery status belong in the documentary image manifest. Reduced motion uses a fixed composition. Missing or failed photography falls back to a typeset archive plate. The evidence comparison also retains its illustrative exposure field.

Asteroidal feedstock, distributed industry, the three documented Foundry functions, finite precision inventory and incomplete human detection follow the bundled handoff. The rock, anchors, service vehicles, assembly motions and photographed people are artistic reconstructions. The scale of production and the months assigned to individual activities are illustrative.

## Implementation report

Four photographic reconstructions were generated for this cut with the built-in image-generation tool. All four are delivered as drafts for editorial review. Each has a 1440 × 810 master and a 640 × 360 variant. The [documentary manifest](../../public/art/documentary/manifest.json) records the complete generation prompts, shot windows, intended content, composition, motion, captions, filenames and status. Set status to `missing` to use the archive slate, or to `approved` after review. The caption identifies AI reconstruction even after approval.

The camera crop, vignette drift, image dissolve, extraction carriage, tank tender, handling rail, assembly jig and cargo pallet sample elapsed reel time. The rock and rigid equipment use procedural geometry. Static hardware parts share a baked vertex-colour mesh for each moving assembly. The Earth, Caravan v002, Foundry GLBs, atlas, playback clock, transcript and audio adapter continue to serve the cut.

| Sample | Draws per rendered frame | Submitted triangles |
| --- | ---: | ---: |
| Extraction bed at 01:19 | 3 | 3,684 |
| Alpha at 01:35 | 15 | 20,596 |
| Beta at 01:59 | 15 | 14,600 |
| Gamma at 02:12 | 14 | 23,732 |
| Delta at 02:30 | 16 | 18,600 |

These measurements count WebGL draw submissions in desktop Chromium. The scenes render on demand. No new model download is required. The four desktop photographs total 345,416 bytes and the four smaller variants total 92,266 bytes. Each insert requests the appropriate image candidate.

All planned photographs are present. Voice recordings and the optional ambience, effects and music stems remain absent. Physical-device GPU performance and recorded voice pacing remain unmeasured.

## Validation

TypeScript and the Vite production build passed. Representative frames from all seven sequences were inspected. Desktop Chromium checks covered sequence selection, seeks across cut points, captions, restart and pause/resume. Revisiting the extraction shot, surveillance photograph and mid-dissolve reproduced identical screenshot crops. Gamma returned to the same assembly pose and draw count with a small raster difference between WebGL contexts (normalized image RMSE 0.00068). At 375 × 812, reduced motion held the photographic crop fixed, used the static worksite section and kept the comparison field legible. Blocking the surveillance WebP displayed the labelled archive slate. The next photograph loaded successfully. Vite continues to report a chunk-size advisory for the lazy-loaded Three.js renderer.

### Resource-shot revision

The resource-body photograph supersedes the procedural shot at 01:15–01:24. Both ends use a 1.25-second clock-driven dissolve over the Solar System atlas. Reduced motion cuts directly to a still. The earlier draw measurement refers to the retired procedural shot. The current shot adds one draft reconstruction in 1440- and 640-pixel WebP formats. Its prompt and source status are included in the documentary manifest.
