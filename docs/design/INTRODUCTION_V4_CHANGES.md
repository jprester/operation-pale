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
