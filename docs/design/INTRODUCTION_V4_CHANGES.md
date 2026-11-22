# Introduction v4: editor change requests

Change requests that arrive after the brief (`CODEX_TASK_INTRO_V4.md`) are recorded here, newest last. Each one names the script revision it implements. The script (`INTRODUCTION_V4_SCRIPT.md`) remains the source of truth for text. Where this file and the brief disagree, this file wins.

---

## CR-1 · Silent Notification, new cold-open ending (script R1)

**Issued:** 2026-11-22, during Checkpoint B3 (rough cut). Apply it before starting the Phase 3 picture pass.

### 1. C0-07 becomes silent on-screen text

The narrator is now the only voice in the introduction.

**Data**
- In `src/data/film/timeline.json`, keep C0-07 with the speaker `Company transmission` and add `"voiced": false`.
- The transcript and phrases stay exactly as they are; they are still checked against the script and `CURRENT_CANON.md` §5.

**Timing**
- C0-07 is no longer measured from audio. Its length is a **reading hold**, computed per phrase as `1.2 s + 0.28 s × words`. That comes to roughly 23 s for the seven phrases.
- Each phrase's `at` is the start of its page. The trailing `‖‖` (2.0 s) still follows the last page.
- Re-run the audio-first layout so everything after C0-07 shifts. Picture stays anchored to cues and follows automatically.

**Audio**
- `kokoro_takes.py` and `master.py` skip cues with `voiced: false`. No Company take goes into the dialogue stem.
- In the manifest, mark the Alice C0-07 take `retired: R1, Notification shown silently`. Keep the file.
- Under C0-07, the cold-open room-tone bed only. No music, and no ducking, since there is no voice to duck under.
- *Optional:* a faint receiver carrier under the text. Generate three Stable Audio 3 candidates (`sm-sfx`, the measured C0-07 hold + 4 s) with a prompt such as "very faint steady radio carrier hiss with a soft low hum, no tones, no beeps, no melody". Log them per `LOCAL_TOOLCHAIN.md` and list them for the editor. Default, until the editor chooses: room tone only.

**Picture (`Broadcast` receiver)**
- Page through the seven phrases on the reading-hold timing.
- Typing reveal at the existing rate; each page fully revealed for at least 70% of its hold.
- Footer: `COMPANY TRANSMISSION · RECONSTRUCTED` and `0n / 07`.

**Captions and transcript**
- **No subtitles during C0-07.** The text is already on screen, and the receiver is HTML, so screen readers get it.
- In `App.tsx`, the caption prefix `Company transmission · reconstructed` no longer appears in the introduction. Leave the code path for future episodes.
- In the Explore transcript, list C0-07 under its timecode with the label `Company transmission · on screen`.

### 2. C0-11 extended

The new text, from the script and verbatim:

> Around the bases, the cities kept their lights. ‖ In most of them, people did not yet understand what had been taken. ‖‖ Not their homes. ‖ Not their lives. ‖ Only the ability to defend them. ‖‖

- Re-render **C0-11 only**, with the selected narrator (`bm_fable*2+am_onyx` at 0.96). Use the same phrase-level synthesis and edge trimming, and authored pauses as marked. Leave all other narrator takes untouched.
- The longer line moves the title later. Keep the title hit and the first music entrance anchored to the end of C0-11's trailing `‖‖`.
- **Picture under C0-11:** stay on the `intelligence-briefing` plate through the first phrase. On "Not their homes", cut to a night city plate, and hold it through the final phrase.
  - Preferred: reuse an existing reconstruction if one fits.
  - Otherwise generate one still, tagged *artistic reconstruction*, and log the prompt: *"Wide 16:9 photographic reconstruction, documentary restraint. A mid-sized city at night seen from a low hill, ordinary residential lights on, streets calm, a distant airbase at the edge of frame dark with a faint thin smoke column. No fire, no explosions, no people in close-up, no text. Muted, cold archival grade."*
  - Then fade to black and go into the title.

### 3. Knock-on checks

- The H-hour sequence length changes. Re-check the selected cold-open bed (B2 choice) and extend or loop it if it is now shorter than the sequence.
- The flashback and staging score cues are unaffected, because their sequences don't change length. Confirm this.
- Update `INTRODUCTION_V4_IMPLEMENTATION.md` with a **CR-1** section: new H-hour timing, the C0-11 take (voice, speed, duration), the C0-07 reading-hold timing, the total runtime, and any editor questions.

### 4. Acceptance

- Acceptance criterion 1 of the brief (script fidelity) still passes, with C0-07 included.
- The dialogue stem contains no Company voice.
- No subtitle is shown during C0-07.
- The Notification text on screen matches `CURRENT_CANON.md` §5 verbatim.
- `npm run typecheck` and `npm run build` pass.
- Commit as `CR-1: silent Notification and extended cold-open ending`.
