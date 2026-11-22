# Introduction v4: editor change requests

Change requests that arrive after the brief (`CODEX_TASK_INTRO_V4.md`) are recorded here, newest last. Each one names the script revision it implements. The script (`INTRODUCTION_V4_SCRIPT.md`) remains the source of truth for text. Where this file and the brief disagree, this file wins.

---

## CR-1 · Announced Notification, new cold-open ending (script R1)

**Issued:** 2026-11-22, during Checkpoint B3 (rough cut). Revised the same day, before implementation: an earlier draft made the Notification silent, and that is **withdrawn**. Apply this version before starting the Phase 3 picture pass.

### 1. New cue C0-06a: the narrator announces the transmission

The new text, from the script and verbatim:

> On the hour, the same message began on open frequencies around the world. ‖ The recording survives in thousands of copies. ‖ This is one of them. ‖‖

- Insert C0-06a into `timeline.json` between C0-06 and C0-07, in sequence `h-hour`. **Do not renumber** other cues; existing anchors must stay valid.
- Render it with the selected narrator (`bm_fable*2+am_onyx` at 0.96), using phrase-level synthesis and edge trimming, with authored pauses as marked.
- **Picture:** the timestamp changes to `H+0:00 · PUBLIC CHANNEL` at the start of C0-06a. Hold the `intelligence-briefing` plate. The receiver frame appears empty, waiting, during C0-06a's final phrase.

### 2. C0-07 keeps the Company voice, with broadcast treatment

The Company voice stays as selected at B2 (`bf_alice` at 1.00, the existing take). It should read as an archival broadcast recording, not a second narrator.

**Processing**, applied in `master.py` to C0-07 only, with all parameters kept in the manifest:
- band-pass about 250 Hz – 4.5 kHz;
- light compression;
- a subtle short slap or room on the broadcast, nothing metallic;
- level about 3 dB below the narrator.

**Carrier**
- A faint broadcast carrier bed fades in about 1.0 s before the first word, sits under the voice, and cuts 0.3 s after the last word, before C0-07's trailing `‖‖`.
- Generate three Stable Audio 3 candidates: `sm-sfx`, C0-07 length + 3 s, prompt *"very faint steady radio carrier hiss with a soft low hum, no tones, no beeps, no melody, no music"*. Log them per `LOCAL_TOOLCHAIN.md` and list them for the editor.
- Until the editor chooses, use a procedural pink-noise carrier, band-limited to match the voice.

**Timing and picture**
- The C0-07 start moves by the length of C0-06a plus the 1.0 s carrier pre-roll. Re-run the audio-first layout so everything after it shifts. Picture stays anchored to cues.
- The receiver types each phrase in sync with the voice (as now), with the footer `COMPANY TRANSMISSION · RECONSTRUCTED` and `0n / 07`.

**Captions** stay on for C0-07, with the prefix `Company transmission · reconstructed`. No change from the current implementation.

### 3. C0-11 extended

The new text, from the script and verbatim:

> Around the bases, the cities kept their lights. ‖ In most of them, people did not yet understand what had been taken. ‖‖ Not their homes. ‖ Not their lives. ‖ Only the ability to defend them. ‖‖

- Re-render **C0-11 only**, with the selected narrator. Leave all other narrator takes untouched.
- Keep the title hit and the first music entrance anchored to the end of C0-11's trailing `‖‖`.
- **Picture under C0-11:** stay on the `intelligence-briefing` plate through the first sentence. On "Not their homes", cut to a night city plate and hold it through the final phrase.
  - Preferred: reuse an existing reconstruction if one fits.
  - Otherwise generate one still, tagged *artistic reconstruction*, and log the prompt: *"Wide 16:9 photographic reconstruction, documentary restraint. A mid-sized city at night seen from a low hill, ordinary residential lights on, streets calm, a distant airbase at the edge of frame dark with a faint thin smoke column. No fire, no explosions, no people in close-up, no text. Muted, cold archival grade."*
  - Then fade to black and go into the title.

### 4. Knock-on checks

- The H-hour sequence gets longer, by C0-06a, the carrier pre-roll and the longer C0-11. Re-check the selected cold-open bed (B2 choice) and extend or loop it if it is now shorter than the sequence.
- The flashback and staging score cues are unaffected. Confirm this.
- Update `INTRODUCTION_V4_IMPLEMENTATION.md` with a **CR-1** section containing:
  - the new H-hour timing;
  - the C0-06a and C0-11 takes (voice, speed, duration);
  - the C0-07 processing settings and carrier candidates;
  - the total runtime;
  - any editor questions.

### 5. Acceptance

- Acceptance criterion 1 of the brief (script fidelity) passes, including C0-06a.
- The C0-07 text on screen and in captions matches `CURRENT_CANON.md` §5 verbatim.
- No cue was renumbered.
- `npm run typecheck` and `npm run build` pass.
- Commit as `CR-1: announced Notification and extended cold-open ending`.

---

## CR-2 · Cold-open picture from the ground (script R2)

**Issued:** 2026-11-22. Apply it in the Phase 3 picture pass, after CR-1.

**Supersedes:**
- the cold-open (`h-hour`) bullets in brief §4.1;
- the C0-11 picture bullet in CR-1 §3. The night city now starts at C0-11's first word, not on "Not their homes".

### Principle

The cold open is told from the human side. Everything is seen from the ground, through human eyes and instruments. **No Company hardware appears in `h-hour`:** no Quiver, Coffer or Warden models, no OrbitalPass or Journey 3D, and no Earth orbital register. Remove the uncorrelated-object tags drawn on the orbital register. The Company's own view is revealed in the flashback, and `staging` still ends on the Coffers descending, a deliberate mirror of the cold open's first image.

### 1. New component: `NightSky`

**Base image.** One still: a night sky over a dark horizon. Generate two candidates with the built-in image tool, log the prompts in `public/art/documentary/manifest.json`, tag them *artistic reconstruction*, and let the editor choose. Starting prompt:

> Wide 16:9 photographic reconstruction, documentary restraint. Clear moonless night sky over a low dark horizon (flat farmland or high desert, a few small distant lights on the horizon line), dense natural star field, faint Milky Way band low to one side, slight long-exposure softness. No satellites, no meteors, no aircraft, no text, no people, no foreground buildings. Cold blue-black grade, muted.

The sky must be clean, because everything that moves is drawn on top.

**Overlay.** A 2D canvas, or SVG if it performs, driven by mapped film time. No independent clock. It has two modes:

- **`catalogue`** (C0-01 and C0-02):
  - 6–10 faint points, each entering at its own time, the first at the start of C0-01. Each crosses on a slow straight path, taking 20–40 s to cross the frame. Steady brightness, no twinkle.
  - On the right, an HTML **catalogue list** adds one row per point: `UNCORRELATED TRACK <id> · NO LAUNCH RECORD · NO OWNER`. Use monospace, small, porcelain on charcoal, amber for the newest row.
  - IDs are illustrative four-digit numbers. **No altitudes, inclinations or counts** (CURRENT_CANON §7).
- **`entries`** (C0-08 to C0-10):
  - Thin streaks, 0.4–1.2 s long, fading tails. Most share one radiant, entering from one side of the frame; a minority scatter.
  - Brightness varies; an occasional longer, brighter trail, no more than one every 6–8 s.
  - The rate builds from sparse at C0-08 to a steady 1–3 per second by C0-09, and holds through C0-10.
  - **No explosions, ground flashes or debris clouds in frame.**

**Reduced motion:**
- `catalogue`: a static composite with the points drawn as short time-lapse arcs, and the list fully shown.
- `entries`: a static long-exposure composite with about 20 frozen streaks, like a meteor-shower photograph.

### 2. Shot list for `h-hour`

| Cue | Picture | Timestamp slate |
|---|---|---|
| head hold, C0-01, C0-02 | `NightSky` in `catalogue` mode, with the catalogue list | `H−36 H · SPACE CATALOGUE` |
| C0-03 | `orbital-surveillance` plate, with a new **tracking display** overlay (SVG): an Earth limb arc and 5–8 dashed predicted re-entry arcs converging on it, labelled `PREDICTED RE-ENTRY · MULTIPLE OBJECTS`. No spacecraft symbols, no numbers. | `H−20 MIN · TRACKING RECORD` |
| C0-04, C0-05 | `observatory-night` plate | unchanged |
| C0-06 | black | unchanged |
| C0-06a, C0-07 | `intelligence-briefing` plate with the receiver (CR-1) | `H+0:00 · PUBLIC CHANNEL` |
| C0-08 to C0-10 | `NightSky` in `entries` mode | `H+0 · FIRST HOUR` |
| C0-11 | **night city plate** (CR-1 prompt or an existing reconstruction), from the first word; slow push; black after the trailing pause, into the title | unchanged |

Transitions are cuts or short dissolves (≤ 0.8 s). Avoid zooms between plates.

### 3. Sound

- The streaks are **silent**. No whooshes or impacts; entries at that altitude are not heard on the ground.
- *Optional:* an open-air night ambience under the `NightSky` shots, instead of room tone. Generate three Stable Audio 3 candidates (`sm-sfx`, about 60 s, prompt *"quiet open-air night ambience, very light wind, distant low hum, no insects, no birds, no voices, no melody"*). Log them per `LOCAL_TOOLCHAIN.md` and list them for the editor. Default: the existing room-tone bed.

### 4. Acceptance

- The `h-hour` sequence renders no Company models or 3D orbital scenes. Check by inspecting which components are mounted at every cue in `h-hour`.
- No numbers appear on the catalogue list or the tracking display apart from illustrative track IDs.
- Reduced-motion composites exist for both `NightSky` modes.
- Review frames: `docs/design/cinematic-review/v4-cold-open-*.jpg`, covering one frame per row of the shot list on desktop, plus mobile and reduced motion for the two `NightSky` modes.
- `npm run typecheck` and `npm run build` pass.
- Commit as `CR-2: cold open seen from the ground`.
