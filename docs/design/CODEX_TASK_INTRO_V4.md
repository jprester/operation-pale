# Codex task: implement Introduction v4

**Issued:** 22 November 2026, by the editor.
**Status:** ready to start.

**Locked inputs** (read both completely before writing code):
- `docs/design/INTRODUCTION_V4_SCRIPT.md`: the script, recording sheet, picture notes and implementation notes.
- `docs/canon/CURRENT_CANON.md`: canon, especially §4a (pre-contact deployment and detection) and §9 (decisions D1–D6).

---

## 0. Ground rules

1. **The script text is locked.** Do not reword, shorten, merge or split narration lines, and do not "fix" punctuation. If a line won't fit, reads badly aloud, or seems to contradict canon, stop and list it in the implementation report (§9). The editor resolves script problems; Codex does not.
2. **Canon is locked.** Do not edit anything in `docs/canon/`. Any number, date or claim you show on screen must come from the script or from `CURRENT_CANON.md`. If something you need is missing, report it rather than inventing it.
3. **No paid generation.** All speech is local Kokoro. Make no ElevenLabs calls and spend no credits. Any images you generate must be logged with their prompts in the relevant asset manifest, as before.
4. **Keep the engineering principles in `AGENTS.md`:** narrative is data, captions and text stay HTML, reduced-motion and WebGL fallbacks keep working, and no new dependencies without a stated reason.
5. **Work in the phases below and stop at each checkpoint.** At every checkpoint the editor reviews before you continue. Commit at the end of each phase with a descriptive message.
6. **Do not delete source material.** Retired audio, photographs and models stay in the repo and are marked retired in their manifests.

---

## 1. What changes, in one paragraph

The introduction is re-cut from seven chronological sequences into a **cold open plus flashback**:

1. **H-hour** (cold open): the unclaimed objects, re-entry, the President's order and the canonical Notification.
2. **Title.**
3. **The record:** charter and casualty ceiling.
4. **The manifest:** what was shipped once.
5. **The Foundries.**
6. **Seen, not understood.**
7. **The last ninety days:** staging, ending on the Coffer descent, which loops back to the cold open.
8. **H+0:** verification, and the unasked question.

All narration is new. One narrator (Kokoro `bm_george`) and the Company transmission (Kokoro `bf_emma`) replace the mixed ElevenLabs/Kokoro v3 track.

**Most picture is reused.** The work is mainly re-timing existing scenes, removing non-canonical material and adding a handful of small new inserts.

---

## 2. Architecture changes (Phase 1)

The v3 film hard-codes absolute film seconds in many places:

- `road.ts`, `staging.ts`, `opening.ts`
- `OpeningHook.tsx` (fade times 7–96), `DispatchAtlas.tsx` (97–116), `SolarAtlas.tsx` (`time-67.5`), `StagingPlate.tsx` (`Journey` phase thresholds 220–309), `StagingAtlas.tsx` (`time>=223`)
- `Explore.tsx` (`elapsed<126`)
- `master.py` (`LENGTH`, `BOUNDARIES`, `events` with a +22 offset) and `manifest.json` placements

Re-cutting by editing every constant is error-prone. Do this instead.

### 2.1 One timeline file, shared by TypeScript and Python

Create `src/data/film/timeline.json` as the single source of truth for the film's structure, written by the audio pipeline (§3):

```jsonc
{
  "edition": "Introduction v4",
  "duration": 0,                       // computed
  "sequences": [
    { "id": "h-hour", "label": "H-hour", "cutTitle": "", "start": 0, "duration": 0 },
    { "id": "title", "label": "Title", "cutTitle": "", "start": 0, "duration": 6, "indexed": false },
    { "id": "record", "label": "The record", "cutTitle": "The record.", ... },
    { "id": "manifest", "label": "The manifest", "cutTitle": "What could not be made here.", ... },
    { "id": "foundries", "label": "The Foundries", "cutTitle": "Four Foundries.", ... },
    { "id": "seen", "label": "Seen, not understood", "cutTitle": "Seen, not understood.", ... },
    { "id": "staging", "label": "Final staging", "cutTitle": "The last ninety days.", ... },
    { "id": "h-zero", "label": "H+0", "cutTitle": "", ... }
  ],
  "cues": [
    { "id": "C0-01", "sequence": "h-hour", "speaker": "Narrator", "start": 0, "end": 0,
      "transcript": "...", "phrases": [{ "text": "...", "at": 0 }] }
  ]
}
```

- `src/data/opening.ts` derives `beats`, `introDuration` and `frameAt` from this file. Sequence nav, cut titles and the transcript work unchanged. An empty `cutTitle` shows no title card. The `title` sequence is not shown in the sequence index.
- `master.py` and `kokoro_takes.py` read sequence boundaries and cue times from this file. Delete the hard-coded `LENGTH` and `BOUNDARIES`.
- `dialogue.json`, `subtitles.json` and `ends.json` are either generated from `timeline.json` or replaced by it. Pick one, and document the choice in `assets/audio/PRODUCTION.md`. There must be exactly one place where cue text lives.

### 2.2 Anchor picture to cues, not seconds

Picture events (shot changes, inserts, overlays) are declared relative to a cue or a sequence, for example `{ at: "C2-03", offset: -0.4 }` or `{ sequence: "staging", at: 0.0 }`. A helper resolves them to film seconds from `timeline.json`. Re-recording a line then moves its picture with it.

### 2.3 Reuse v3 scenes through an edit list

Existing scene components take an absolute v3 `time`. Rather than rewriting them, add `src/data/film/edl.ts`: an ordered list of picture segments. Each segment maps a span of v4 film time to a span of v3 source time:

```ts
{ id: 'seq2-atlas', from: { at: 'C2-01', offset: -1 }, to: { at: 'C2-03', offset: -0.5 },
  render: 'v3', sourceStart: 67.5, sourceEnd: 96.5, fit: 'stretch' | 'hold-end' | 'loop' }
```

`OpeningPlate` receives the mapped source time for `render: 'v3'` segments, and renders the new components for the others (§4.3). Replace hard-coded sequence indices (`index<2`, `index===2`, `beats[6]`) with segment or sequence IDs. Stretch factors outside 0.75–1.5 are a warning sign; prefer `hold-end` and report them.

`Explore`'s atlas (`elapsed<126`) and any other consumer of film time go through the same mapping.

### 2.4 Checkpoint A

The v3 cut should play **exactly as before** through the new timeline, EDL and audio boundaries, with only the old content loaded. This proves the refactor before any content changes. `npm run build` passes. Commit.

---

## 3. Narration and audio (Phase 2)

### 3.1 Ingest the script

Parse the cue tables in `INTRODUCTION_V4_SCRIPT.md` (IDs `C0-01` … `C6-04`) into `timeline.json`. Text goes in exactly as written. The markers become timing, never text:

| Marker | Meaning |
|---|---|
| `‖` | 0.8 s pause; also a subtitle phrase break |
| `‖‖` | 2.0 s pause |
| `‖‖‖` | 3.0 s pause |
| No trailing marker on a cue | 0.5 s gap before the next cue |

Further split any subtitle phrase longer than about 70 characters at a comma. The joined phrases must equal the transcript exactly, apart from whitespace.

### 3.2 Voices

- Narrator: Kokoro `bm_george`. Company transmission: Kokoro `bf_emma`, one cue, `C0-07`, read verbatim.
- **Retire the ElevenLabs Adam opening.** Remove it from the mix path in `master.py`. Keep the file, and mark its manifest entry `retired: v3 opening, superseded by Introduction v4`. The old `pauseEdits` logic goes with it.
- Update `manifest.json`: set `edition` to `Introduction v4`, add one segment per cue, set budget `authorizedSpend: 0`, and leave no ElevenLabs takes in use.

### 3.3 Synthesis: audio first

Change `kokoro_takes.py`:

- **Synthesise phrase by phrase** (split at `‖`) and join with the authored silences, so the pauses are real and caption entrances are exact. Caption `at` values come from the phrase joins, refined by onset detection as now.
- **Remove the speed-up-to-fit loop.** The timeline flexes to the recording, not the reverse. Cue starts are laid out in order: sequence head hold + cue durations + authored gaps. Sequence durations are the sum, plus the tail holds below. The script writes the results into `timeline.json`.

Head and tail holds (editor-adjustable constants, kept in one place):

| Where | Hold |
|---|---|
| `h-hour` head | 2.5 s black before C0-01 |
| C0-06 → C0-07 | 2.0 s (the `‖‖`); the timestamp changes to `H+0:00` inside it |
| `h-hour` tail | 2.0 s after C0-11 |
| `title` | 6.0 s, no voice |
| Every other sequence head | 1.5 s |
| `h-zero` tail | 6.0 s hold on the end card |

**Narrator speed audition (do this first).** Render C0-01 to C0-03 at Kokoro speed 0.92, 0.96 and 1.00 into `assets/audio/voices/kokoro/audition/`. The voice direction is lower-middle register, dry and unhurried, about 135–145 words per minute. Render the full set only after the editor picks a speed. Company speed: start at 1.00.

### 3.4 Mix

Re-author `master.py` placements relative to sequences or cues, not absolute seconds. Move the procedural `events` list to sequence-relative times and drop the `+22` offset hack.

| Element | Placement |
|---|---|
| Cold open (`h-hour`) | Room tone and the low contact-vibration bed only. **No music.** Leave silence across the handover from C0-06 to the transmission, as v3 did before the Company channel. |
| `title` | First music entrance: Approach Vector, plus the "doom" bass hit on the cut to the title. |
| `record` | The Hegemony ambient effect under the charter material. Music returns at the head of `manifest`. |
| `manifest` second half through `foundries` | The resources drone, as in v3. |
| `seen` | Thin: room tone and drone tail only. |
| `staging` | Music bed. The final line, C5-06, lands into a three-second hold with the music pulled out. |
| `h-zero` | Room tone; music returns for the end card and fades out over the final 3 s. |

Keep dialogue ducking, the three stems (dialogue, music, effects), the fallback master, the narrator fader and the in-player Audio settings. `master.py` must still fail loudly if a cue overruns its sequence.

### 3.5 Checkpoint B

Deliver a **rough cut**: the full new narration and mix over the existing picture, mapped through the EDL. Placeholder plates are fine where new inserts don't exist yet. The editor listens before any picture work. Report the measured duration of each sequence and the total. Commit.

---

## 4. Picture (Phase 3)

Use the script's per-sequence **Picture** notes. The specifics below are where the code has to change.

### 4.1 Sequence by sequence

**`h-hour` (cold open)**
- The timestamp slate replaces the chronology label: `H−36 H · SPACE CATALOGUE` → `H−20 MIN · TRACKING RECORD` → `H+0:00 · PUBLIC CHANNEL`. Use amber, small, top left, in the existing `film-clock` style.
- **H−36:** the Earth orbital register, reusing the `Journey` network / pullback views or the local-atlas staging overlay. New objects appear one by one, each tagged `UNCORRELATED` (new SVG/HTML overlay).
- **H−20:** the same objects show re-entry arcs (new overlay).
- Plates: `orbital-surveillance`, then `observatory-night`. Don't use `astronomers-anomaly` here; it belongs to `seen`.
- C0-06 plays over black.
- C0-07 is the **receiver** (`Broadcast` in `OpeningPlate.tsx`), paged by **phrase** (seven pages) instead of by cue. Bar: `PUBLIC CHANNEL` / `H+0:00`. Footer: `COMPANY TRANSMISSION · RECONSTRUCTED` and `0n / 07`. Behind it, the `intelligence-briefing` plate.
- C0-08 to C0-11 continue over the briefing plate. Then fade to the title.

**`title`**
- A non-interactive version of the cover composition (globe, *Operation: Pale*, *The acquisition of Earth.*) with no button.

**`record`**
- v3 source 29.5–67.5: galaxy, survey optics, survey seals, charter.
- **Do not use the four NASA photographs** (`city`, `industry`, `launch`, `station`) or v3 0–29.5. Keep the files, and mark them `reserved: later episode` in `public/art/opening/manifest.json`.
- At C1-04, show the tag `CHARTER CEILING · < 5% OF WORLD POPULATION · canonical figure`.

**`manifest`**
- v3 source 67.5–126: atlas, the Caravan reveal and broadside, the dispatch atlas, the resource pass and the specimens.
- At C2-03, build the new **manifest card** (HTML) over a darkened broadside, line by line, using the table in the script. Tag it `canonical figure`.

**`foundries`**
- v3 source 126–177 (Alpha, Beta, Gamma, depot map, Delta), one Foundry per line from C3-02 to C3-05.
- Update Delta's role label (§4.2).

**`seen`**
- The local atlas. A new overlay of **six faint infrared marks near lunar distance**, appearing at C4-02.
- Then the `astronomers-anomaly` plate for C4-04.

**`staging`** — from the v3 staging shots, keep:
- gamma bay, handoff, transit, Warden, Lantern relay (`relay`), `ground` (Domesday), `countdown` (optional), and `tableau`/network.

Drop:
- `rock` (asteroidal feedstock), `assembly` (Gamma final assembly), `astronomers` (moved to `seen`), `surveillance` (moved to the cold open), `assignment` and `record` (the demonstration shots, D1).

Changes:
- **Relabel for D6.** Before H−36, Quivers are racked on Coffers at cislunar distance, not in Earth orbit. Change the `Journey` labels: `transit` becomes `Cislunar staging / Coffer racks`. The key line `◯ Tracked Quiver` becomes `◯ Coffer (Quiver racks)`. Audit `OrbitalPass` and the SolarAtlas **Deployment** overlay (`month>=10` draws "DEPLOYED" marks in low Earth orbit). Before the final ~36 h, staged units sit near the Anchor depots at cislunar distance, not around Earth. The Earth-orbit network view is canonical only from H−36, so use it in the cold open and for C5-06.
- **New insert, C5-02: Lantern entry.** A still: a Lantern unfolding in the stratosphere after entry, over open ocean at dawn, with its entry shell falling away. Tag it `artistic reconstruction`. Generate it with the built-in image tool and log the prompt. Starting prompt:
  > Wide 16:9 photographic reconstruction for a restrained documentary. Stratosphere at about 22 km over open ocean at dawn, curved horizon, thin blue band, black sky above. A long, slender solar-electric aircraft with a very high aspect ratio wing (about 38 m span), pale matte surfaces, wing panels still unfolding, small propellers stationary. Below and behind it, two halves of a dark ablative entry shell tumbling away. No markings, no text, no lens flare, no glow. Muted, archival colour grade.
- **New insert, C5-03: Aegis standoff map (HTML/SVG).** Draw it on an equirectangular crop of the existing Earth texture (`public/art/earth.webp`) or a simplified outline. Mark Aegis stations as small amber marks over the **Mongolian steppe**, the **Kazakh steppe** and the **Canadian interior north of the US northern plains**. Draw approximate reach rings toward the regions they cover, labelled by region only: *Western and northern Chinese silo fields*, *Siberian and Volga–Urals forces*, *US northern plains fields*. Mark **European Russia** and **central China** as `no nearby gap`.
  - Label it `approximate · canonical placement`.
  - **No distances, counts or base names on the map**, apart from the one spoken number: 38 Aegis, which may appear in the caption.
- C5-04 uses `ground` (Domesday).
- C5-05 (the uncorrelated records) goes over the orbital register with faint record annotations: `UNCORRELATED RE-ENTRY` and `SLOW HIGH RETURN · FILED: BALLOON`. Keep it simple.
- C5-06 holds on the Coffers starting their descent toward Earth, then cuts to black for the `‖‖‖`.

**`h-zero`**
- The `intelligence-briefing` plate with the timestamp `H+0:00`.
- At C6-02, a new **Warden manoeuvre inset** (SVG): an orbital track with a Warden mark stepping to a new track as predicted. Label: `AUTHENTICATED CONTACT · H+1 TO H+3 · artistic reconstruction`.
- **End card:** `EPISODE 1 · THE FIRST FORTY-EIGHT HOURS`. Hold, then the final image stays as v3's end did.

### 4.2 Data and labels

- `src/data/foundries.ts`: Delta's role becomes `Precision maintenance, calibration & salvage`. Remove `provisional role`. This feeds the Foundry shot label and the Explore equipment list.
- `src/data/road.ts`: delete the v3 `shots` and `chronology` logic, or reduce it to EDL source data. The new chronology labels:

| Sequence | Label |
|---|---|
| `h-hour` | the timestamp slate above |
| `title` | none |
| `record` | `Historical record · Charter` |
| `manifest` | `Arrival · 0 mo elapsed / 19 mo to contact`, advancing by month as v3 did |
| `foundries` | months 4–10 |
| `seen` | `T−14 to T−3 months · Survey data` |
| `staging` | `T−90 days` → `T−10 days` (at C5-03) → `T−36 h` (at C5-06) |
| `h-zero` | `H+0 · Public channel`, then `H+1–3 h · Authenticated contact` at C6-02 |

  Use T− for months and days, and H− / H+ for hours and minutes. Both refer to the same moment.
- `src/data/staging.ts`: remove the `assignment` and `record` shots. `reviewDays` may stay for `countdown`.
- `src/scenes/StagingPlate.tsx`: remove the `PUBLIC DEMONSTRATION · SCHEDULED` register variant. The contact slate reads `H+0:00`.
- `src/scenes/StagingAtlas.tsx`: remove the `assignment` overlay branch.
- Captions: the speaker prefix for the Company becomes `Company transmission · reconstructed`. Narrator lines have no prefix.

### 4.3 New components

New: the timestamp slate, the uncorrelated-object and re-entry overlays, the title card, the manifest card, the infrared-marks overlay, the Lantern-entry plate, the Aegis standoff map, the record annotations, the Warden inset and the end card.

Each one:
- is driven by mapped film time from the EDL, not its own clock;
- has a static reduced-motion state;
- keeps all text as HTML or accessible SVG text;
- carries a status tag (`canonical figure`, `approximate`, or `artistic reconstruction`) matching the script.

### 4.4 Checkpoint C

Deliver the full v4 cut: desktop, mobile and reduced-motion review frames, one per sequence and per new insert, in `docs/design/cinematic-review/v4-*.jpg`. Commit.

---

## 5. Archive (Phase 4)

### 5.1 Verification record (D1)

Rewrite `src/data/verification.ts` and `src/scenes/VerificationRecord.tsx`. Remove the inert-demonstration animation entirely. The new record is three illustrated stages on the same 30 s scrubber:

| Stage | Visual | Label | Text |
|---|---|---|---|
| 0–8 s | The identity package arriving as a data record (key fingerprint, message formats, Warden identifiers) | `FIRST HOURS · IDENTITY PACKAGE` | The technical identity package gave specialists a public key, and a way to test who held its counterpart. |
| 8–15 s | A government console composing a random challenge string | `H+1 TO H+3 · CHALLENGE` | A government chose a random challenge and sent it through the contact channel. Nobody outside that government knew it in advance. |
| 15–22 s | The reply returning; the signature check turns green | `SIGNED REPLY` | The reply came back signed, and the signature checked against the published key. |
| 22–30 s | A Warden mark stepping to a new orbital track, with two independent observatory ticks confirming it | `OBSERVABLE MANOEUVRE` | In the same minute, a Warden changed its orbit as the reply said it would. Observatories in other countries saw it move. The next message had a verifiable sender. |

These texts are editor-approved archive copy. Use them verbatim.

### 5.2 Explore

- The Atlas section uses mapped source time.
- The Transcript section lists v4 cues by sequence, including the Company transmission. The jump buttons seek to the right times.
- The Equipment list shows the corrected Delta role.

### 5.3 Checkpoint D

`npm run build` passes, with archive screenshots in the review folder. Commit.

---

## 6. Documents (Phase 5)

- Add a one-line status banner at the top of each of these files: `OPENING_HOOK.md`, `FINAL_STAGING.md`, `INTRODUCTION_V2.md`, `INTRODUCTION_V2_1.md`, `INTRODUCTION_V2_2.md`, `INTRODUCTION_V3_AUDIO.md`, `CINEMATIC_PLAYER.md` (timing sections only), `EPISODE_01.md` and `CODEX_FIRST_TASK.md`. The banner reads:
  > **Superseded for narration and timing by Introduction v4** (`INTRODUCTION_V4_SCRIPT.md`, `CODEX_TASK_INTRO_V4.md`). Canon: `docs/canon/CURRENT_CANON.md`. Engineering and asset notes below may still apply.

  `EPISODE_01.md` gets an additional line: *its canon checkpoints (demonstrations, regional Wave, T+30 h) are obsolete; the Episode 1 storyboard will be rewritten.*
- Update the `README.md` sections "What is implemented" and "Introduction player" for v4: runtime, sequences and voices.
- Update `assets/audio/PRODUCTION.md` for the audio-first pipeline, the timeline file, the retired Adam take and the regeneration commands.

---

## 7. Acceptance criteria

1. **Script fidelity:** a script diffs every cue's transcript in `timeline.json` against the script tables (markers stripped). There are zero differences.
2. **Timing:** no cue overlaps the next, and no cue overruns its sequence. Every caption phrase appears within 100 ms of its audio onset, checked across sampled positions as in the v3 validation. All authored pauses are present (±50 ms).
3. **Canon sweep:** visitor-facing source and data (`src/`, `public/**/manifest.json`, captions) contain none of the following:
   - `Wain`, `Seneschal`, `Works ` (as a facility name)
   - `demonstration`, `T+30`, `T+0:`
   - `nonhuman origin`
   - `PROPOSED CAPTIONS`, `Cargo exchange`, `provisional role`
   - `Tracked Quiver` in any pre-H−36 shot

   The Notification text matches `CURRENT_CANON.md` §5 verbatim.
4. **Status tags:** every on-screen figure or reconstruction carries the tag the script specifies.
5. **Playback:** play from cover, pause/resume, seek forward and back across every sequence boundary, restart, fullscreen, captions on/off, audio stem failure fallback, hidden tab, and reduced motion on desktop and mobile widths.
6. **Build:** `npm run build` passes. Report any new bundle-size advisories.

---

## 8. Out of scope for this task

- Changing any script line or canon decision.
- **Remodelling Foundry Delta in Blender.** That is a separate task: change the label now and leave the model.
- ElevenLabs or any paid takes.
- Any H+0 to H+1 combat content beyond what the script shows.
- Episode 1.

---

## 9. Implementation report

Write `docs/design/INTRODUCTION_V4_IMPLEMENTATION.md` containing:
- the final sequence and cue timing table (ID, start, end, gap);
- the EDL with every stretch factor, flagging any outside 0.75–1.5;
- the narrator speed chosen at audition;
- new assets with their provenance and prompts;
- validation results against §7;
- **an "Editor questions" section:** every place where the script, canon or picture didn't fit, with the line ID and what you would suggest. Suggestions only; don't apply them.

---

## Later: Task B (not now) — Foundry Delta remodel

Delta's canonical role is precision maintenance, calibration and salvage of manifest-grade components (`CURRENT_CANON.md` §3). It should read as clean, controlled and small-scale next to the heavy industry of Alpha and Beta:

- sealed inspection bays and calibration rigs;
- a salvage berth where damaged assemblies are disassembled;
- no cargo-exchange berths.

Update `assets/spacecraft/foundries/generate.py`, the `.blend`, the GLB and its preview plates, `foundry-delta-v001.json`, and the asset README. Version the model as `v002` and keep `v001`.
