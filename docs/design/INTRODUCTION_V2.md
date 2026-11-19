# Operation: Pale — Introduction v2.0

## Recording script and storyboard

Times below are elapsed film time. T+ times on screen are minutes since fictional first contact. The edit condenses the 45–90-second public notice. Its words are a proposed reconstruction of the v2.0 handoff. Read the narrator calmly, with space between observations. Record the Company voice separately, with the steady delivery of a public notice. Leave unassigned intervals silent.

### 00:00–00:25 · Acquisition

A slow approach to the daylight limb brings the inhabited surface into view.

| Film time | Voice | Script |
| --- | --- | --- |
| 00:02–00:09 | Narrator | When the surveyors catalogued Earth, they recorded something much harder to come by than minerals. |
| 00:09–00:15 | Narrator | Here was a world that already fed its people and maintained its own industry. |
| 00:16–00:24 | Narrator | The Sol Development Company received a six-year charter to take possession of Earth with those arrangements still working. |

### 00:25–00:50 · Arrival

An aft three-quarter establishing view cuts at 00:38 to a closer pass along the cargo spine.

| Film time | Voice | Script |
| --- | --- | --- |
| 00:26–00:32 | Narrator | The charter clock began when the Caravan reached the outer Solar System. |
| 00:33–00:40 | Narrator | Every precision component the expedition could draw from home had made the crossing with it. |
| 00:41–00:49 | Narrator | For the things it could make here, the carrier brought something more valuable than finished cargo. It brought the beginnings of an industry. |

### 00:50–01:35 · Emplacement

Four 11.25-second surveys visit Alpha, Beta, Gamma and Delta in order. The Delta exchange berths illustrate a provisional role.

| Film time | Voice | Script |
| --- | --- | --- |
| 00:51–01:00 | Narrator | At Foundry Alpha, volatile material became stored water and propellant. Every transfer between sites depended on work like this. |
| 01:01.5–01:10.5 | Narrator | Foundry Beta refined metals and turned them into bulk structures. A beam made here was a beam the Caravan had never had to carry. |
| 01:13–01:22 | Narrator | At Foundry Gamma, separate assemblies became working systems. Fabrication could be spread over many sites. The pieces still had to fit. |
| 01:24–01:33 | Narrator | The record names a fourth branch, Foundry Delta. Its assignment is uncertain. The exchange berths shown here are a reconstruction. |

### 01:35–01:55 · Countdown

Three registered survey exposures hold the stars fixed while one unresolved object shifts between frames. The field is illustrative.

| Film time | Voice | Script |
| --- | --- | --- |
| 01:36–01:42 | Narrator | From Earth, parts of the preparation were visible. Objects appeared where none had been catalogued. |
| 01:43–01:49 | Narrator | An observer could have a good track and still have no way to say what it was for. |
| 01:50–01:54.8 | Narrator | The Company had a timetable. The observers had fragments. |

### 01:55–02:30 · Notification

The public receiver carries the reconstructed notice. The cut to the government channel marks the change of audience.

| Film time | Voice | Script |
| --- | --- | --- |
| 01:55–02:01 | Narrator | The first public notice lasted less than two minutes. Its instructions were brief. |
| 02:02–02:05 | Company transmission | This transmission is of nonhuman origin. |
| 02:05–02:09 | Company transmission | Leave military equipment and military structures. |
| 02:09–02:15 | Company transmission | Cities, hospitals, utilities and food systems are not targets. |
| 02:15–02:20 | Company transmission | Do not launch strategic weapons. Further instructions will follow. |
| 02:21–02:29 | Narrator | For people near military sites, the immediate question was where to go. For governments receiving separate contact instructions, it was who had sent them. |

### 02:30–03:00 · Verification

The empty shelter holds in frame through the announced demonstration. The closing record shows how a signed reply can be tied to an independent observation.

| Film time | Voice | Script |
| --- | --- | --- |
| 02:30–02:37 | Narrator | Five minutes after the warning, a bulletin named an empty shelter and a time. Observers could check both. |
| 02:38–02:44 | Narrator | At ten minutes, the inert demonstration reached the announced site. The sender had kept an appointment. |
| 02:45–02:51 | Narrator | At twelve minutes, specialists received a public key and a way to test who held its counterpart. |
| 02:51–02:59 | Narrator | A government could send a fresh challenge, check the signed reply, and observe the answering signal. The next message would have a verifiable sender. |

## Supplying audio

The silent edition includes all subtitles. To add recorded media, place any of the following files under `src/media/audio/` and rebuild. Each file is a separate full-length MP3 aligned to the same 03:00 edit. Start each export at film time zero, preserve its leading and internal silence, and mix relative levels before export.

| File | Contents | Current delivery |
| --- | --- | --- |
| `narrator.mp3` | Documentary narrator following the script above | Awaiting recording |
| `company.mp3` | Reconstructed public transmission from 02:02 through 02:20 | Awaiting recording |
| `ambience.mp3` | Environmental sound bed | Optional, absent |
| `effects.mp3` | Time-aligned individual effects | Optional, absent |
| `music.mp3` | Background score | Optional, absent |

The audio adapter discovers supplied files at build time. Each media element follows the existing transport anchor and shares the master gain and mute controls. Scrubbing, pausing or leaving the player pauses the mix. Returning to playback realigns each track. During playback the adapter corrects drift beyond 120 ms. This provides documentary playback synchronization at the media-element level. A final recording session should check delivery and mix levels on actual listening devices. Edit the scene-relative cues in `src/data/opening.ts` first if a recording changes the timing, then update this recording sheet.

## Implementation report

The opening now lasts exactly 180 seconds. It reuses the approved Earth, Caravan v002 and four Foundries. The survey, emergency receiver and verification records use HTML and SVG. Reduced-motion mode uses the existing still plates, complete warning lines and discrete observation states. The chapter archive retains its five records.

TypeScript and the production build passed. Desktop Chromium checks covered all six boundaries, each Foundry cut, reconstructed speech, intentional silence, caption visibility, backward seeks, pause, resume, restart and the terminal frame. Mobile Chromium emulation at 375 × 812 checked every sequence with reduced motion, no 3D canvas and no horizontal overflow. A temporary silent ambience file exercised actual media-element playback, paused and running seeks, mute, gain, resume and end-of-reel pause. The fixture was removed before the delivery build.

The five audio files listed above are absent. The edition plays silently with captions enabled by default. The existing lazy-loaded 3D dependency chunk still triggers Vite’s 500 kB advisory. Browser checks used Chromium and mobile emulation. Physical-device audio and voice-to-picture review remain pending.
