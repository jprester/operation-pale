# Pale Archive audio production

## Introduction v4 · B3 rough mix

From the repository root, `python3 -B assets/audio/master.py` rebuilds the running film’s three stems and stereo fallback in `src/media/audio/`. Use `--dialogue-review` for the separate B2 voice-only audition. The film now plays the measured v4 timeline and cue-anchored picture edit.

The editor chose cold open A3, title impact A1, flashback A2, survey bed A1, staging A1 and ending A1. The [manifest](manifest.json) stores the decisions and sequence/cue-relative placements under `mix`. Bed loudness targets, source trim, fades and narrator gain (0.8) are editable there. The mixer ducks the music and ambience against dialogue; the player retains independent stem faders. Existing Approach Vector, Hegemony ambience and the resources drone provide the additional layers specified by the brief.

## Introduction v4 · B2 dialogue and score review

The editor selected Fable + Onyx (2:1, speed 0.96) and Alice (speed 1.00). The [v4 timeline](../../src/data/film/timeline.json) gives the measured film positions. [Recording and score provenance](manifest.json) lists each file, voice or model, seed and settings. The running player uses the archived v3 timeline and stems through this audition checkpoint.

Run from the repository root:

```sh
HF_HUB_OFFLINE=1 ~/Projects/software_dev/my_projects/narration-app/code/podcast-studio/.venv/bin/python -B assets/audio/kokoro_takes.py
~/Projects/software_dev/my_projects/narration-app/code/podcast-studio/.venv/bin/python -B assets/audio/check_recordings.py
python3 -B assets/audio/master.py --dialogue-review
python3 -B assets/audio/score_candidates.py
```

Kokoro reads each marked phrase at its selected speed. Long captions can split at timed comma boundaries within the same spoken phrase. FLAC takes use 24 kHz mono PCM16, Torch seed 42 per cue, and FFmpeg loudness normalization targeting −18 LUFS. A short fade on retained edge padding after normalization keeps the authored gaps quiet. Cue starts mark speech onsets. The voice-only review aligns the FLAC files using the manifest’s onset samples and includes all intentional gaps, sequence holds, and the silent title.

The score generator invokes the Stable Audio 3 MLX interpreter using cached weights on the local Metal GPU. It uses eight steps, CFG 3 and three distinct seeds per cue. Each seed, model, decoder, prompt, negative prompt, duration and output hash is in the manifest. The listening table in the [implementation report](../../docs/design/INTRODUCTION_V4_IMPLEMENTATION.md#checkpoint-b2--sound-selection) links each lossless WAV. Re-running the command verifies existing candidates and resumes outstanding takes.

## Checkpoint A · playing the v3 edit

The player and both offline audio tools share [timeline.json](../../src/data/film/timeline-v3.json). It replaces `dialogue.json`, `subtitles.json` and `ends.json`. Cue and phrase times are absolute seconds from film zero, with exclusive cue ends. The timeline retains the v3 words, caption breaks and measured onsets. The recording manifest holds take metadata keyed by cue ID. The locked v4 recording sheet enters the pipeline in Phase 2.

The mixer resolves a cue ID plus an optional offset, or a sequence ID plus a local time or `end`, against that timeline. Source trim points and pause edits remain relative to the original recording. The [picture edit list](../../src/data/film/edl.ts) uses the same anchor conventions. Each film span runs up to the next anchor and samples an independent interval of the v3 source reel. Watch and Explore use the same mapping.

For Checkpoint A, the only audio command was `python3 -B assets/audio/master.py` from the repository root. This mixes the existing files with FFmpeg. The outputs in `src/media/audio/` are stereo 48 kHz MP3s. Dialogue is 96 kb/s, music and effects are 128 kb/s each, and the combined audition master is 160 kb/s. Reset the three player faders to 100% for the authored balance. Existing voice settings and seeded effect recipes remain in the v3 manifest and mixer.

## Workspace inspection · 20 November 2026

The connected ElevenLabs Creative tools returned 25 voice entries, five workspace audio assets and zero brand kits. The voice list provides names, IDs, descriptions, labels and previews. It exposes neither a Pale approval flag nor the historical synthesis settings of a take.

| Capability | Verified surface and limitation |
| --- | --- |
| Identify an existing take | Asset lookup returned an opening-script MP3, ID `9WDl8TbgE6bnc2TuUjaY`, 1,311,774 bytes. The row supplies a temporary preview, name and media type. The supplied MP3 matches its title and byte count. The editor supplied the narrator ID. Historical settings and distribution rights remain unverified. |
| Identify music | The editor confirmed **Approach Vector** in ElevenLabs **Music → operation-pale**. The track detail shows 0:30. Exact-title connector search returned zero assets. The supplied stereo 48 kHz WAV measures exactly 30 seconds. |
| Generate speech | The direct speech tool takes a voice ID, model, prompt and output count. It offers a credit-free estimate-only operation. The direct signature exposes no numeric stability, similarity, style or speed controls. If the approved voice depends on custom settings, inspect the model-specific flow schema before quoting. |
| Music and effects | The workspace node catalogue lists Music v1, v2 and v2.5, and Text to Sound v2 and v3. The generic one-call tool explicitly accepts Music v1/v2 and Text to Sound v2. Its model enum omits Music v2.5 and Text to Sound v3, so those newer catalogue entries require separate verification. This planning pass tested discovery only. |
| Export | Completed flow generations can expose temporary full-resolution content URLs and per-generation prices. Library search returns preview URLs. Preserve the original file from the existing flow or user export, with checksum and durable IDs. |
| Credits | Estimate-only can return a quote and blocking errors for a specified voice/model. Actual generation records may report credits. Workspace balance, historical voice settings and subscription entitlements have no discovered read tool. The connector confirmed no additional tool for these operations. |

## Casting and budget

The film timeline holds the cue sheet. The recording manifest joins to it by stable cue ID and records working destinations and approval states. Unknown voice, model, license and settings fields are intentionally null. The complete opening take is in the offline master. The manifest tracks remaining draft lines. Record generation-time plan, permitted uses and any voice-library conditions with the original export before publishing.

Original planning estimate before importing the complete take.

| Scope | Characters | Planning credits |
| --- | ---: | ---: |
| Narrator · 40 cues | 3,791 | 3,791 |
| Company · 2 cues | 89 | 89 |
| First pass, both speakers | 3,880 | 3,880 |
| Proposed revision reserve · 20% | | 776 |
| Planning total | | 4,656 |

The estimate assumes one take for each cue at the published Multilingual v2 base rate and a standard-rate voice. Count spaces and punctuation. Joined cues add a separator. Reuse accepted lines and deduct their characters from the outstanding budget. If the proposed pilot replaces its two cue takes, the joined prompt adds one character. A discarded pilot costs its own quoted price against the revision reserve. The reserve authorizes zero expenditure. Confirm the voice-specific estimate and remaining shared balance before spending. [ElevenLabs pricing](https://elevenlabs.io/pricing)

The earlier two-cue Resources quote covered a superseded script. The current Resources edit and Foundry Alpha introduction use the local Kokoro George voice.

**Company audition.** Use the existing line “This transmission is of nonhuman origin.” Present one separately quoted take after a Company voice has been identified. Listen for controlled pace, clear consonants and a natural voice distinguishable from the narrator. Retain the approved voice ID for future episodes.

## From approval to the timeline

1. Identify the existing voice and music. Check whether a saved original already covers the proposed take. Record source, model, settings, rights and filename. Keep signed URLs and credentials out of the repository.
2. For a new take, submit the exact prompt, chosen voice/model and `generations_count: 1` using `estimate_only: true`. Present that quote, settings, output count and duration to the editor. Obtain explicit spend approval for that request.
3. Add the approved request to the ledger before execution. Make one generation call. Save its generation and flow IDs immediately. If delivery or download fails, recover the same result or export from the saved flow. For an ambiguous submission, reconcile history before any new request.
4. Preserve the untouched download with its original extension. Record its SHA-256 and actual reported charge. Make a separate working WAV. Measure duration, identify the pause between cues and place each clause at its intended picture beat. Adjust subtitle phrase starts and measured ends against that recording. Let the editor hear it in the film before authorizing further takes.
5. Mix offline in three logical buses. Replace the corresponding local voice lines in the narration stem. Rebuild effects from the existing seeded recipes. Combine those stems with the approved music edit and render the single 331-second local master. Mixing a replacement on top of the current master would double the draft voice. Retain the working draft master until the replacement passes review.
6. The local production manifest records source, scene, start/end, source in-point, gain, fades, approval, provenance and version for each imported clip. The playback clock drives three local tracks from film zero. Music and effects receive their fades and dialogue ducking in the offline mix. The stereo master provides a fallback if a track fails to load.

## Music and effects edit

| Film region | Treatment |
| --- | --- |
| Full film, 00:00–05:31 | Approach Vector fades out from 00:27.5 to 00:29.5. It returns with the Solar System atlas at 01:06.5, reaching its mix level at 01:08.5. Adjacent copies of the 30-second recording overlap by two seconds with equal-power crossfades. The score ducks under both speakers and fades out over the last three seconds. |
| Hegemony reveal, 00:29.5–00:53.18 | The supplied ambient effect takes over from the score with the dissolve, just before the Hegemony narration. A second pass starts at 00:51.7 and fades into the returning music through 01:09. |

The supplied doom bass enters at 01:32.22. The edit skips the first 1.4 seconds of the source to place its attack just after the final “Earth.”

## Validation of the current master

TypeScript and the production build passed. Local Chromium exercised the 331-second draft in desktop and mobile viewport emulation. Checks covered gesture-started playback, pause/resume, restart, forward and backward seeking, the Resources boundary, Company captions, mute and fullscreen. Blocking the MP3 request left the picture and captions running with audio controls disabled. The existing lazy Three.js chunk still triggers Vite’s size advisory. Physical-device listening remains unverified.

The [cue manifest](manifest-v3.json) is the production worksheet and [generation ledger](generation-ledger.json) records paid requests and recoverable output IDs. The runtime script remains the editorial source of truth for the archived v3 cut. Check exact text, timestamps and phrase boundaries against it whenever the film is recut.

## Supplied recording edit

The editor supplied the final opening script and its 80.927-second Adam recording. The complete take plays at recorded speed from 00:01.750 to 01:32.197. The renderer inserts silence at the source positions in the manifest. The narrator leaves three seconds before introducing the Hegemony. Caption entrances follow the performance. George takes over at 01:37.5. Emma reads the Company notice.

The score enters over 0.7 seconds at −11 dB. The Hegemony effect enters at −12 dB, fading in over two seconds and out over three. The manifest records source hashes, placements and fades for the offline mix. The supplied effect has no accompanying license record.

The supplied cinematic atmosphere drone enters at the Resources marker (01:36.5) and fades out by the Infrastructure marker (02:57). Its 30-second recording repeats with two-second equal-power crossfades, at −21 dB before narration ducking. The narrator fader is set to 0.8 (−1.94 dB) after the ducking signal is split off. The Company transmission uses unity gain.


## Adjust the mix

In Watch, open **Audio settings** beside the master volume. Dialogue (including the Company transmission), Music, and Ambience & effects each have a fader. At 100% each plays at its authored level. Changes apply during playback and are saved in this browser. Reset mix restores all three faders.

To change the authored balance for everyone, edit `currentMaster.narratorGainLinear` or an asset’s `placement.gainDb` in [manifest.json](manifest-v3.json). The former affects only documentary narration. More negative dB values lower individual music and effect cues. The procedural room and machinery levels are defined in [archived v3 mixer](master_v3.py). From the repository root, run `python3 assets/audio/master_v3.py` with FFmpeg and the saved voice takes, then `npm run build`. The renderer exports dialogue.mp3, music.mp3, effects.mp3 and the stereo fallback into src/media/audio.

## Regenerate local speech

The generative stage uses the same Kokoro-82M model and British English pipeline as Podcast Studio. All cues after the imported opening have individual lossless takes in `assets/audio/voices/kokoro/`. The manifest's `localTake` field identifies the recording, voice preset and synthesis speed used in the mix. The imported ElevenLabs opening keeps its edit and caption timings.

The Checkpoint A commit `988e06f` preserves the v3 take generator for reproducing the archived voice direction. The current generator reads the locked v4 recording sheet.

## Introduction v4 · B1 voice audition

From the repository root, render the seven comparison WAVs with Podcast Studio’s interpreter:

```sh
HF_HUB_OFFLINE=1 ~/Projects/software_dev/my_projects/narration-app/code/podcast-studio/.venv/bin/python -B assets/audio/kokoro_takes.py --audition
```

The audition reads C0-01 through C0-03 and C0-07 directly from the locked recording sheet. Each narrator WAV contains the same three consecutive cues. Each Company WAV contains the entire transmission. The audition uses British-English Kokoro-82M on CPU with four threads and Torch seed 42 per take. A weighted blend averages two copies of the British voice embedding and one of Onyx. Alice is the alternate British Company voice. Her voice pack was cached from `hexgrad/Kokoro-82M/voices/bf_alice.pt` before offline synthesis.

The renderer synthesizes each marked phrase at the specified speed. It retains up to 50 ms of edge padding and counts that padding toward the authored gaps. The audition starts at the first cue and includes the final marked pause. FFmpeg applies `loudnorm=I=-18:TP=-2:LRA=8` to each assembled take and writes 24 kHz mono 16-bit PCM. Files and measured phrase positions are in `assets/audio/voices/kokoro/audition/`. Words per minute counts whitespace-separated words over the full WAV, including pauses. Auditions are separate from the active v3 mix.
