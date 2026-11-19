# Operation: Pale — Interactive Documentary

A small, runnable **prototype** of a cinematic, interactive documentary about the fictional acquisition of Earth. **Not** a game, not a complete documentary, and not a finished Earth simulation.

## Quick start

Requirements: Node 20+; npm or Yarn.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). To build: `npm run build`.

## What is implemented

- A visitor-started 5:09 introduction with seven selectable sequences, two recorded draft voices, timed captions and an original environmental mix. Playback can be paused, continued, skipped or replayed.
- Seven sequences follow scientific discovery, charter formation, arrival, the nineteen-month industrial build-up and first public contact. The interactive atlas connects the overview to Earth–Moon detail. Planet and carrier shots use React Three Fiber with illustrated fallbacks. Reduced motion uses still compositions and complete caption lines.
- A responsive chapter index with the original five chapter records, status labels and keyboard-operable navigation.
- A proposed caption transcript for the Notification and the eight communication stages from canon v2.0.

The opening is an editorial prototype. The globe is an artistic reconstruction. The synchronized audio master is included. The full 8–12-minute first episode remains future work.

## Where to start

1. Read [`AGENTS.md`](./AGENTS.md) (guidance for Codex).
2. Read [`docs/design/CREATIVE_DIRECTION.md`](./docs/design/CREATIVE_DIRECTION.md) and [`docs/design/EPISODE_01.md`](./docs/design/EPISODE_01.md).
3. Read [`docs/design/CODEX_FIRST_TASK.md`](./docs/design/CODEX_FIRST_TASK.md) and have Codex implement it incrementally.
4. Treat `docs/canon/Operation_Pale_Canon_Handoff_v2_0.md` as authoritative when old documents disagree.

This repo includes copies of the user's source documents as project references. These documents are fiction and contain fictional operational estimates, some of which are explicitly marked provisional.

## Introduction player

The reel runs for 309 seconds. The transport supports play/pause, restart, captions, a continuous scrubber and seven scene markers. Restart plays from the beginning. Selecting a marker preserves the current playback state. Dragging freezes progression until release. On the focused scrubber, Left and Right seek one second, and Home and End select the endpoints. The check marks identify scenes preceding the current position. CC controls the documentary subtitles. Text displayed inside the emergency receiver remains part of that scene.

### Timing and subtitles

`src/player/usePlaybackClock.ts` stores an anchored position in seconds and a monotonic start time. Rendering samples the clock up to 30 times per second. Seek replaces the anchor immediately. Pause, scrubbing, a hidden tab, and a fully offscreen player freeze it. Scene selection, camera transforms, procedural motion, broadcast reveals and subtitle selection all derive from the sampled position.

Sequence metadata is in `src/data/opening.ts`. The recording text and measured cue ends are in `src/data/audio/`. Sequence starts use film time. Each narration cue has a local start, exclusive end, speaker and transcript. Between voice cues the picture holds or continues with scene sound. At 05:09 the final image holds. Company speech is explicitly marked as reconstructed.

See the [v3.1 staging cut and recording sheet](./docs/design/FINAL_STAGING.md) for the voice cues, deliberate pauses and master delivery. The [visual storyboard](./docs/design/INTRODUCTION_V2_1.md) describes the seven sequences.

### Earth imagery

The Acquisition shot uses Solar System Scope’s Earth Day Map, Earth Night Map and Earth Clouds under Creative Commons Attribution 4.0 International. The app bundles compact local derivatives and a still rendered from the opening frame for reduced motion, unavailable WebGL or texture-loading errors. Exact source files, the license and adaptation notes are listed in the [Earth imagery credits](./public/art/earth-credits.txt).

### Spacecraft inspection

In the development server, open `/dev/models` to inspect a local GLB with orbit controls, lighting presets, grid and a one-metre scale reference. The [spacecraft asset handoff](./docs/design/SPACECRAFT_ASSETS.md) covers Blender export, material and texture conventions, delivery budgets and registering the Caravan in the manifest.

The four [Foundry branch assets](./assets/spacecraft/foundries/README.md) include editable Blender sources, measured GLBs, preview plates, and the Emplacement shot schedule.

The [v2.2 cinematic cut and implementation report](./docs/design/INTRODUCTION_V2_2.md) covers the human-perspective inserts, industrial animation and photographic asset manifest.
