# Introduction v4 implementation

## Checkpoint A · v3 compatibility cut

Baseline `4eff164`. The active edition is still Introduction v3.2. Watch, Explore, transcript seeking and the offline mix use the shared 331-second timeline. The original picture components receive v3 source time. All 26 edits run at their recorded speed.

### Sequence timing

| Sequence ID | In (s) | Out (s) | Gap to next (s) |
|---|---:|---:|---:|
| discovery | 0 | 67.5 | 0 |
| expedition | 67.5 | 96.5 | 0 |
| resources | 96.5 | 126.0 | 0 |
| industry | 126.0 | 177.0 | 0 |
| infrastructure | 177.0 | 214.0 | 0 |
| staging | 214.0 | 317.0 | 0 |
| notification | 317.0 | 331.0 | 0 |

### Recording timing

Gap is silence before the next cue. The last row measures the remaining tail to film end. Times are in seconds.

| Cue ID | In | Out | Gap |
|---|---:|---:|---:|
| hook-01 | 1.750 | 2.330 | 0.850 |
| hook-02 | 3.180 | 7.270 | 0.970 |
| hook-03 | 8.240 | 12.240 | 0.380 |
| hook-04 | 12.620 | 19.990 | 0.970 |
| hook-05 | 20.960 | 25.340 | 0.430 |
| hook-06 | 25.770 | 29.410 | 3.000 |
| hook-07 | 32.410 | 40.700 | 0.900 |
| hook-motives | 41.600 | 49.370 | 0.930 |
| hook-interest | 50.300 | 52.220 | 1.040 |
| hook-08 | 53.260 | 59.120 | 0.950 |
| hook-09 | 60.070 | 64.560 | 3.470 |
| hook-10 | 68.030 | 75.040 | 0.910 |
| hook-11 | 75.950 | 80.550 | 0.000 |
| hook-12 | 80.550 | 86.330 | 0.930 |
| hook-13 | 87.260 | 89.400 | 0.910 |
| hook-14 | 90.310 | 92.197 | 5.303 |
| resources-01 | 97.500 | 105.725 | 0.775 |
| resources-02 | 106.500 | 114.125 | 1.375 |
| resources-03 | 115.500 | 122.275 | 4.025 |
| industrial-build-up-01 | 126.300 | 134.750 | 3.250 |
| industrial-build-up-02 | 138.000 | 146.200 | 3.100 |
| industrial-build-up-03 | 149.300 | 157.725 | 4.275 |
| industrial-build-up-04 | 162.000 | 168.075 | 1.925 |
| industrial-build-up-05 | 170.000 | 176.100 | 1.900 |
| infrastructure-01 | 178.000 | 188.150 | 2.850 |
| infrastructure-02 | 191.000 | 199.675 | 4.325 |
| infrastructure-03 | 204.000 | 209.025 | 4.975 |
| final-staging-01 | 214.000 | 219.825 | 0.175 |
| final-staging-02 | 220.000 | 226.400 | 1.600 |
| final-staging-03 | 228.000 | 234.800 | 0.200 |
| final-staging-04 | 235.000 | 241.800 | 0.200 |
| final-staging-05 | 242.000 | 248.775 | 0.225 |
| final-staging-06 | 249.000 | 255.675 | 0.325 |
| final-staging-07 | 256.000 | 262.425 | 0.575 |
| final-staging-08 | 263.000 | 271.800 | 0.200 |
| final-staging-09 | 272.000 | 279.725 | 0.275 |
| final-staging-10 | 280.000 | 286.875 | 0.125 |
| final-staging-11 | 287.000 | 293.375 | 1.625 |
| final-staging-12 | 295.000 | 301.625 | 0.375 |
| final-staging-13 | 302.000 | 308.025 | 0.975 |
| final-staging-14 | 309.000 | 316.350 | 0.650 |
| notification-01 | 317.000 | 320.200 | 2.800 |
| notification-02 | 323.000 | 326.325 | 0.675 |
| notification-03 | 327.000 | 330.575 | 0.425 |

### Picture edit list

The film and source intervals are identical. Out-points cut to the next segment. The final frame holds at 331 s.

| Segment | Film and source in–out (s) | Source seconds per film second |
|---|---:|---:|
| opening | 0–29.5 | 1.00 |
| survey | 29.5–67.5 | 1.00 |
| expedition | 67.5–96.5 | 1.00 |
| dispatch | 96.5–118.75 | 1.00 |
| specimens | 118.75–126 | 1.00 |
| alpha | 126–138 | 1.00 |
| beta | 138–149 | 1.00 |
| gamma | 149–161 | 1.00 |
| depots | 161–170 | 1.00 |
| delta | 170–177 | 1.00 |
| infrastructure | 177–214 | 1.00 |
| finishing-bay | 214–220 | 1.00 |
| handoff | 220–228 | 1.00 |
| transit | 228–235 | 1.00 |
| orbital-register | 235–242 | 1.00 |
| relay | 242–249 | 1.00 |
| feedstock | 249–256 | 1.00 |
| final-assembly | 256–263 | 1.00 |
| observatory | 263–272 | 1.00 |
| surveillance | 272–280 | 1.00 |
| ground | 280–286 | 1.00 |
| countdown | 286–295 | 1.00 |
| assignment | 295–302 | 1.00 |
| record | 302–309 | 1.00 |
| tableau | 309–317 | 1.00 |
| notification | 317–331 | 1.00 |

### Validation

- Compared all 44 cue transcripts, speakers, starts, ends and 98 caption phrases with their timings against the baseline. Checked the selected cue and source picture time at all 331,001 millisecond positions including film end.
- Compared the rendered picture and navigation markup of both production builds at 25 positions forward and back in Chromium with reduced motion, plus the paused Explore atlas. The samples included both sides of every internal sequence boundary.
- Tested the production player at 1440 × 900 and 390 × 844 with gesture playback, restart, pause, forward and backward seeking, stem sync, mix adjustment/reset and mute. Blocking the effects stem switched playback to the stereo master.
- Rebuilt the existing mix with `python3 -B assets/audio/master.py`. All four MP3s matched the baseline byte for byte. The audition file is `src/media/audio/road-to-earth.mp3`, 5:31, stereo 48 kHz at 160 kb/s. The v3 narrator gain is 0.8 before the player faders. Set each player fader to 100% for review. Listening remains with the editor.
- `npm run typecheck` and `npm run build` passed. Both builds reported the same React Three Fiber chunk size advisory (825.34 kB minified).
- Script ingestion, the v4 voice audition and new media belong to later checkpoints. No synthesis ran, no credits were spent, and no narrator speed was selected.

### Editor questions

- C0-03 picture notes in the recording sheet call for the astronomers plate before the President’s order. The implementation brief reserves that plate for C4-04 and names the observatory-night plate for the cold open. Suggested reading for the picture pass: use observatory-night at H−20 and keep astronomers-anomaly for C4-04.
- C3-05 calls for Delta to show calibration and salvage. The approved v3 exterior depicts exchange berths and the remodel is outside this milestone. Suggested picture treatment for the later pass: frame a neutral detail under the approved role label until the revised model is available.

## Checkpoint B1 · voice audition

Five narrator readings cover C0-01 through C0-03 (76 words). Two Company readings cover C0-07 (53 words). The Company text matches Current Canon §5 after removing the recording markers. The editor chooses both performances by listening.

| Voice | Speed | Duration (s) | WPM including pauses | Audition |
|---|---:|---:|---:|---|
| bm_george | 0.92 | 33.400 | 136.5 | [WAV](../../assets/audio/voices/kokoro/audition/bm_george-0.92.wav) |
| bm_george | 0.96 | 32.437 | 140.6 | [WAV](../../assets/audio/voices/kokoro/audition/bm_george-0.96.wav) |
| bm_george | 1.00 | 31.690 | 143.9 | [WAV](../../assets/audio/voices/kokoro/audition/bm_george-1.00.wav) |
| bm_george, am_onyx (2:1) | 0.96 | 30.749 | 148.3 | [WAV](../../assets/audio/voices/kokoro/audition/bm_george-bm_george-am_onyx-0.96.wav) |
| bm_fable, am_onyx (2:1) | 0.96 | 27.549 | 165.5 | [WAV](../../assets/audio/voices/kokoro/audition/bm_fable-bm_fable-am_onyx-0.96.wav) |
| bf_emma | 1.00 | 27.798 | 114.4 | [WAV](../../assets/audio/voices/kokoro/audition/bf_emma-1.00.wav) |
| bf_alice | 1.00 | 29.910 | 106.3 | [WAV](../../assets/audio/voices/kokoro/audition/bf_alice-1.00.wav) |

All seven files decoded as 24 kHz mono PCM16. Across 39 phrase windows, measured onsets in the normalized WAVs were within 42 ms of the recorded edit positions at an absolute amplitude threshold of 0.01. The authored gap lengths matched the recorded positions to within 10 ms including each trailing pause. TypeScript and the production build passed with the existing Three.js bundle advisory. No listening assessment was made. The audition command, seed and normalization settings are in [audio production](../../assets/audio/PRODUCTION.md#introduction-v4--b1-voice-audition).

### Editor questions

- C0-01 through C0-03: all three George speeds fall within the requested 135–145 WPM range when measured with pauses. Both blends read faster at their specified audition speed. Which voice and speed should carry the film?
- C0-07: which Company reading should carry the transmission, Emma or Alice at 1.00×?

## Checkpoint B2 · sound selection

The editor selected Fable + Onyx (2:1) at 0.96× and Alice at 1.00×. The full voice-only cut runs 6:33.235, including the six-second title and all marked silences. The Company enters at 0:53.546. [Play the dialogue review](../../assets/audio/voices/kokoro/v4/dialogue-review.mp3).

### Measured sequence and cue positions

Film times are seconds. Gap is the interval to the next spoken cue, including holds and the title where applicable.

| Sequence | Start | End | Duration |
|---|---:|---:|---:|
| H-hour | 0.000 | 112.210 | 112.210 |
| Title | 112.210 | 118.210 | 6.000 |
| The record | 118.210 | 161.697 | 43.487 |
| The manifest | 161.697 | 212.501 | 50.804 |
| The Foundries | 212.501 | 251.431 | 38.930 |
| Seen, not understood | 251.431 | 279.241 | 27.810 |
| Final staging | 279.241 | 350.395 | 71.154 |
| H+0 | 350.395 | 393.235 | 42.840 |

| Cue | Start | End | Gap |
|---|---:|---:|---:|
| C0-01 | 2.500 | 8.572 | 0.800 |
| C0-02 | 9.372 | 17.794 | 2.000 |
| C0-03 | 19.794 | 29.201 | 0.800 |
| C0-04 | 30.001 | 36.877 | 0.800 |
| C0-05 | 37.677 | 42.198 | 2.000 |
| C0-06 | 44.198 | 51.546 | 2.000 |
| C0-07 | 53.546 | 81.405 | 2.000 |
| C0-08 | 83.405 | 88.781 | 2.000 |
| C0-09 | 90.781 | 97.579 | 0.500 |
| C0-10 | 98.079 | 104.930 | 0.800 |
| C0-11 | 105.730 | 108.210 | 11.500 |
| C1-01 | 119.710 | 127.818 | 2.000 |
| C1-02 | 129.818 | 137.281 | 0.801 |
| C1-03 | 138.082 | 145.531 | 0.800 |
| C1-04 | 146.331 | 159.697 | 3.500 |
| C2-01 | 163.197 | 171.154 | 0.800 |
| C2-02 | 171.954 | 176.314 | 0.800 |
| C2-03 | 177.114 | 191.240 | 0.800 |
| C2-04 | 192.040 | 198.921 | 2.000 |
| C2-05 | 200.921 | 202.734 | 0.800 |
| C2-06 | 203.534 | 211.701 | 2.300 |
| C3-01 | 214.001 | 217.596 | 0.800 |
| C3-02 | 218.396 | 220.912 | 0.800 |
| C3-03 | 221.712 | 227.162 | 0.800 |
| C3-04 | 227.962 | 231.634 | 0.800 |
| C3-05 | 232.434 | 238.646 | 2.000 |
| C3-06 | 240.646 | 249.431 | 3.500 |
| C4-01 | 252.931 | 254.689 | 0.800 |
| C4-02 | 255.489 | 262.632 | 0.800 |
| C4-03 | 263.432 | 269.310 | 0.800 |
| C4-04 | 270.110 | 277.241 | 3.500 |
| C5-01 | 280.741 | 296.030 | 0.800 |
| C5-02 | 296.830 | 303.923 | 0.800 |
| C5-03 | 304.723 | 317.575 | 0.800 |
| C5-04 | 318.375 | 327.550 | 0.800 |
| C5-05 | 328.350 | 341.283 | 2.000 |
| C5-06 | 343.283 | 347.395 | 4.500 |
| C6-01 | 351.895 | 360.314 | 0.800 |
| C6-02 | 361.114 | 367.271 | 2.000 |
| C6-03 | 369.271 | 374.433 | 2.000 |
| C6-04 | 376.433 | 384.235 | 9.000 |

### Listening list

Each row contains three independent renders of the same prompt. File links include the seed. All candidates are 44.1 kHz stereo PCM16. Prompt settings are CFG 3, eight steps and negative prompt `drums, vocals`. Generation used Stable Audio 3 locally under the Stability AI Community License. The manifest records each checksum, command settings and timestamp.

| Cue | Model / decoder | Seconds | A1 | A2 | A3 |
|---|---|---:|---|---|---|
| bed-cold-open | sm-sfx / same-s | 122.21 | [41001](../../assets/audio/generated/bed-cold-open/bed-cold-open-a1.wav) | [41002](../../assets/audio/generated/bed-cold-open/bed-cold-open-a2.wav) | [41003](../../assets/audio/generated/bed-cold-open/bed-cold-open-a3.wav) |
| hit-title | sm-sfx / same-s | 8 | [41011](../../assets/audio/generated/hit-title/hit-title-a1.wav) | [41012](../../assets/audio/generated/hit-title/hit-title-a2.wav) | [41013](../../assets/audio/generated/hit-title/hit-title-a3.wav) |
| score-flashback | medium / same-l | 133.221 | [41021](../../assets/audio/generated/score-flashback/score-flashback-a1.wav) | [41022](../../assets/audio/generated/score-flashback/score-flashback-a2.wav) | [41023](../../assets/audio/generated/score-flashback/score-flashback-a3.wav) |
| bed-seen | sm-sfx / same-s | 37.81 | [41031](../../assets/audio/generated/bed-seen/bed-seen-a1.wav) | [41032](../../assets/audio/generated/bed-seen/bed-seen-a2.wav) | [41033](../../assets/audio/generated/bed-seen/bed-seen-a3.wav) |
| score-staging | medium / same-l | 81.154 | [41041](../../assets/audio/generated/score-staging/score-staging-a1.wav) | [41042](../../assets/audio/generated/score-staging/score-staging-a2.wav) | [41043](../../assets/audio/generated/score-staging/score-staging-a3.wav) |
| score-end | sm-music / same-s | 30 | [41051](../../assets/audio/generated/score-end/score-end-a1.wav) | [41052](../../assets/audio/generated/score-end/score-end-a2.wav) | [41053](../../assets/audio/generated/score-end/score-end-a3.wav) |

#### Prompts

- **bed-cold-open** — Low steady room tone with a faint sub-bass vibration, distant ventilation hum, very sparse, no melody, no drums, no pulses.
- **hit-title** — Single deep sub-bass impact with a long dark decay, no reverb tail brightness, no melody.
- **score-flashback** — Slow, restrained orchestral-electronic score. Begins with sparse low strings and a cold synth pad, steady and patient, gradually adds soft repeating mechanical textures, never triumphant. No drums, no vocals, no melody lead.
- **bed-seen** — Thin high air tone with very faint static, almost silent, uneasy, no melody, no drums.
- **score-staging** — Dark ambient composition. Begins with a low drone and slow pulsing pad, gradually builds dissonant bowed strings and deep swells toward a restrained peak, then thins abruptly to a single held low tone. No drums, no vocals.
- **score-end** — Sparse cold piano-like tones over a low pad, slow, unresolved, no drums.

The cold-open bed calls for 122.210 s, including its 10 s edit handle. The small SFX model generated 120 s for each take. A two-second equal-power overlap extends the handle. The join begins after the 112.210 s sequence ends.

### Verification

The script-fidelity check compared all 41 cue transcripts, speaker identities and assembled caption phrases against the locked sheet, including a verbatim match for C0-07 with canon §5. All 111 caption entrances are within their cue windows. The waveform check passed for speech edges and measured authored pauses at the 50 ms tolerance. All 18 score candidates decoded and matched their recorded durations and SHA-256 checksums. The production build passed with its existing React Three Fiber chunk advisory. Listening remains with the editor. The running film still uses the v3 soundtrack until the B3 rough cut.

### Editor questions

Which take should B3 use for each of the six cues? A retained v3 sound is also available where preferred. No candidate has been selected automatically.

## Checkpoint B3 · rough cut

Running time is **6:33.235**. Fable + Onyx narrate at 0.96×; Alice begins the Company transmission at 0:53.546. The measured cue table from B2 also applies to this mix. The stereo audition is [road-to-earth.mp3](../../src/media/audio/road-to-earth.mp3).

| Sequence | Duration (s) |
|---|---:|
| H-hour | 112.210 |
| Title | 6.000 |
| The record | 43.487 |
| The manifest | 50.804 |
| The Foundries | 38.930 |
| Seen, not understood | 27.810 |
| Final staging | 71.154 |
| H+0 | 42.840 |

### Sound edit

Editor selections in listening-table order are A3, A1, A2, A1, A1 and A1. The first music entrance is the title. The record uses the archived Hegemony ambience. Flashback A2 resumes in sync with its original through-composed arc at the start of the manifest. The resources drone enters at C2-04. The staging music reaches silence at the end of C5-06. The final six-second card uses the closing six seconds of Ending A1 with a three-second fade. The cold-open room tone also supports the first part of H+0. No new audio was generated.

### Rough picture edit

All moving source intervals play at **1.00×**. An interval longer than its destination is trimmed at the following cut. A shorter interval holds its last frame. Black, type and still plates are marked separately. This edit leaves the final inserts for picture review.

| Segment | Film in–out (s) | Source in–out (s) | Treatment |
|---|---:|---:|---|
| head-black | 0.000–2.500 | 0–1 | Static plate |
| orbital-register | 2.500–9.372 | 235–242 | 1.00× |
| surveillance | 9.372–19.794 | 272–280 | 1.00× then hold 2.422 s |
| observatory | 19.794–44.198 | 214–222 | 1.00× then hold 16.404 s |
| order | 44.198–53.546 | 0–1 | Static plate |
| public-channel | 53.546–112.210 | 230–238 | 1.00× then hold 50.664 s |
| title | 112.210–118.210 | 0–6 | 1.00× |
| galaxy | 118.210–129.818 | 35–49 | 1.00× |
| survey | 129.818–138.082 | 49–62 | 1.00× |
| charter | 138.082–161.697 | 62–66.5 | 1.00× then hold 19.115 s |
| arrival | 161.697–171.954 | 67.5–81.5 | 1.00× |
| carrier | 171.954–200.921 | 81.5–94 | 1.00× then hold 16.467 s |
| samples | 200.921–203.534 | 120–126 | 1.00× |
| belt | 203.534–212.501 | 96.5–108 | 1.00× |
| foundries | 212.501–218.396 | 161–170 | 1.00× |
| alpha | 218.396–221.712 | 126–138 | 1.00× |
| beta | 221.712–227.962 | 138–149 | 1.00× |
| gamma | 227.962–232.434 | 149–161 | 1.00× |
| delta | 232.434–240.646 | 170–177 | Static plate |
| network | 240.646–251.431 | 161–170 | 1.00× then hold 1.785 s |
| survey-map | 251.431–263.432 | 161–170 | 1.00× then hold 3.001 s |
| catalogue | 263.432–270.110 | 196–206 | 1.00× |
| astronomers | 270.110–279.241 | 263–272 | 1.00× then hold 0.131 s |
| finishing-bay | 279.241–285.741 | 214–220 | 1.00× then hold 0.500 s |
| handoff | 285.741–292.741 | 220–228 | 1.00× |
| warden | 292.741–296.830 | 242–246 | 1.00× then hold 0.089 s |
| relay | 296.830–304.723 | 246–249 | 1.00× then hold 4.893 s |
| airspace | 304.723–318.375 | 214–222 | 1.00× then hold 5.652 s |
| ground | 318.375–328.350 | 280–286 | 1.00× then hold 3.975 s |
| records | 328.350–343.283 | 272–280 | 1.00× then hold 6.933 s |
| descent | 343.283–347.395 | 235–242 | 1.00× |
| descent-black | 347.395–350.395 | 0–1 | Static plate |
| authenticated-contact | 350.395–361.114 | 230–238 | 1.00× then hold 2.719 s |
| warden-contact | 361.114–369.271 | 242–246 | 1.00× then hold 4.157 s |
| historian | 369.271–387.235 | 230–238 | 1.00× then hold 9.964 s |
| end-card | 387.235–393.235 | 0–6 | Static plate |

### Verification

All four decoded tracks measure 393.235 s. The music stem is silent during the cold open, the record, the survey sequence and the final staging hold. The decoded master contains silence across the interior of the two-second handover into C0-07. All 41 recordings passed the locked-script and timing check. The largest measured pause deviation is 12 ms. Chromium exercised all eight sequences forward and backward at desktop and mobile widths, cue-aligned captions, pause/resume, independent gains, mute, restart and missing-stem fallback. TypeScript and the production build passed with the existing React Three Fiber chunk-size advisory. Listening is reserved for the editor.

### Editor questions

Do the voice and bed levels work for you during the transmission, flashback and ending? The briefing and observatory images currently stand in for new inserts, and the provisional Delta exterior appears without its obsolete v3 role label. Final picture work follows the B3 listening review.
