# The Road to Earth · v3.0 recording and sound report

The picture runs exactly 04:00. Daniel reads the documentary narration at a nominal 151 words per minute. Samantha delivers the reconstructed Company notice at 143. Both voices come from the installed macOS speech engine. These are local synthetic draft performances. A public release should use voices cleared for its intended distribution.

## Recording script

Film time starts at the first picture. End times come from measured takes, rounded to hundredths below. The pause column gives the interval until the next voice entrance or the end of the film. On a new recording, preserve those spaces for the atlas, machinery and observation shots. Read the Company notice plainly and leave the gap between instructions audible.

| In | Out | Voice | Dialogue | Pause after |
| --- | --- | --- | --- | ---: |
| 00:01.00 | 00:10.50 | Narrator | A scientific survey from another civilization found Earth. Its report described a living planet whose people fed themselves and ran their own industries. | 0.50 s |
| 00:11.00 | 00:18.88 | Narrator | The report reached the Hegemony, the authority that governed the surveyors’ civilization. Earth lay along a potential trade route. | 1.12 s |
| 00:20.00 | 00:29.64 | Narrator | The Hegemony chartered the Sol Development Company to take control. Its prize was a working world, including the people who knew how to keep it running. | 3.36 s |
| 00:33.00 | 00:39.64 | Narrator | The Company’s six-year deadline began when its carrier, the Caravan, entered the outer Solar System. | 4.36 s |
| 00:44.00 | 00:52.89 | Narrator | Aboard were workshops, precision instruments, and machines that could build other machines. They had all made the same interstellar crossing. | 2.11 s |
| 00:55.00 | 01:01.93 | Narrator | There would be no second shipment during the charter. Most of the infrastructure for the invasion would have to be built here. | 7.07 s |
| 01:09.00 | 01:18.12 | Narrator | The expedition divided its work. One branch gathered raw material from asteroids. Another set up workshops between Earth and the Moon. | 4.88 s |
| 01:23.00 | 01:29.86 | Narrator | A small reserve stayed out in the main belt. If the workshops were lost, part of the expedition would survive. | 2.14 s |
| 01:32.00 | 01:41.56 | Narrator | The distances made propellant as important as metal. Foundry Alpha processed volatile material into water and fuel for the journeys between sites. | 3.44 s |
| 01:45.00 | 01:53.44 | Narrator | Over the following months, the workshops grew. No one station had to do everything, as long as cargo could move between them. | 2.56 s |
| 01:56.00 | 02:03.92 | Narrator | Foundry Beta refined metal and made beams. Even the largest frame could cross the distance to the next workshop in pieces. | 4.08 s |
| 02:08.00 | 02:15.75 | Narrator | At Foundry Gamma, those pieces came together. A frame made here could carry a precision instrument brought from another star. | 4.25 s |
| 02:20.00 | 02:25.96 | Narrator | Depots held cargo until the next transfer. The workshops could keep different schedules. | 2.04 s |
| 02:28.00 | 02:33.48 | Narrator | A fourth branch was called Foundry Delta. Its precise role remains uncertain. | 2.52 s |
| 02:36.00 | 02:44.84 | Narrator | By now the Company could supply equipment in Earth orbit. From below, an object arriving there gave little indication of the industry behind it. | 4.16 s |
| 02:49.00 | 02:57.32 | Narrator | Some of these objects entered human tracking records. A track could establish where something had been, and where to look for it again. | 4.68 s |
| 03:02.00 | 03:06.88 | Narrator | What it carried, who had built it, and why it was there were harder questions. | 6.12 s |
| 03:13.00 | 03:21.43 | Narrator | At an observatory, two exposures might show a point of light changing position. The measurement could be sound while its meaning remained unclear. | 3.57 s |
| 03:25.00 | 03:32.64 | Narrator | The scattered observations never became a warning governments could act on. The people comparing them had only pieces of the picture. | 3.36 s |
| 03:36.00 | 03:42.78 | Narrator | Nineteen months had passed since the Caravan arrived. On Earth, the first public word was still to come. | 3.22 s |
| 03:46.00 | 03:48.12 | Narrator | The Company opened a public channel. | 3.88 s |
| 03:52.00 | 03:54.51 | Company transmission | This transmission is of nonhuman origin. | 1.49 s |
| 03:56.00 | 03:59.23 | Company transmission | Leave military equipment and military structures. | 0.77 s |

## Mix and provenance

The single 240-second mono master contains all 23 takes and the original sound design. It is encoded as 24 kHz, 80 kb/s MP3 (2.40 MB). The decoded master measures −18.6 LUFS integrated and −2.1 dB true peak. The mix contains no score.

| Film region | Treatment |
| --- | --- |
| Discovery | Dry voice with room for the opening image. |
| 00:45–01:05 | Low structure-borne machinery under the carrier pass. |
| 01:15–02:34 | Short motor beds at the works, with muted contact sounds at 02:04, 02:12 and 02:17. Space exteriors use an illustrative contact-microphone perspective. |
| 02:54–03:36 | Filtered room air accompanies surveillance, observatory and briefing interiors. |
| 03:42.78–03:46 | Silence before the public channel opens. |
| 03:51.55–03:51.83 | Brief receiver noise, followed by the distinct Company voice at 03:52. |

All environmental and handling sounds were synthesized for this edition from seeded filtered noise and oscillators. No stock recordings or external generation services were used. Both voice parts and all designed effects are present. Human voice performances remain optional replacements.

## Regeneration and transport

The editable script is `src/data/audio/dialogue.json`. On a Mac with Daniel, Samantha, Python 3 and FFmpeg installed, run `python3 assets/audio/master.py` from the repository root. The script measures each take, rejects empty or overflowing lines and writes the playback master and measured caption ends. It preserves the delivery rate throughout each voice part. For studio replacement, record to the cue starts, master against film zero and update the end times to the new performances.

The browser retains one audio element across cuts. Play and restart invoke it during the user's gesture. The existing film clock controls follow-up seeks, pause, visibility and replay. Captions share the recording script and the measured end times. The receiver holds its last transmitted line between utterances. An absent or failed master leaves the visuals and subtitles available.

## Validation

All 23 measured takes fit their existing shot windows at the recorded rate. The mastered file decodes to 240.00 seconds. TypeScript and the production build passed. Vite retains its existing large-chunk advisory for the lazy-loaded 3D renderer.

Production Chromium rejected ungestured audio playback and started the master on the first physical Play click. Tests exercised every sequence boundary, forward and backward seeks, pause/resume, restart, mute, volume, caption gaps, end-of-reel pause and playback with a blocked MP3. The player retained one audio element across scene changes.

The maximum settled offset sampled between audio time and the displayed scrubber was 111 ms (the scrubber itself rounds to tenths). On cold seeks into a 3D scene, software-rendered Chromium could hold the previous visual sample for roughly half a second while audio continued. The picture caught up on subsequent frames. Physical-device listening and Safari playback were not tested.
