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
