# Architecture and content model

## Stack
Vite, React 18, TypeScript, React Three Fiber, Drei, Three.js, simple CSS. No service required for local development.

## Components
- `App.tsx`: entry, chapter navigation and story typography (temporary; split later).
- `src/data/chapters.ts`: typed chapter metadata and prose; later expand to typed scene beats (`image`, `globe`, `transcript`, `diagram`, `video`).
- `src/scenes/EarthScene.tsx`: replaceable, lightweight 3D placeholder.
- `public/assets/`: approved local images, audio, models; no external copyrighted media bundled.

## Suggested next interfaces
- `Episode`, `Beat`, `MediaAsset`, `CanonCitation` types.
- `StoryPlayer`: beat progression, keyboard and reduced-motion states.
- `NarrationController`: opt-in audio and captions, synchronised at beat level.
- `SceneFrame`: HTML text layer over 3D/image/video layers.
- `DossierDrawer`: optional archive, without forcing loss of reading progress.

## Rules
Never assume the browser simulation is itself the source of truth. Scene motion can be illustrative without encoding a military targeting model. Metadata should specify approximate vs canonical numbers and whether images are artistic reconstructions. Add performance budgets and actual mobile checks when high-res assets enter the project.
