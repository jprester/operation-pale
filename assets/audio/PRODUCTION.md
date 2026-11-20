# Pale Archive audio production

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

The machine-readable manifest contains every finalized line, cue start, measured draft duration, speaker, stable ID, working WAV destination and approval state. Unknown voice, model, license and settings fields are intentionally null. The complete opening take is in the offline master. The manifest tracks remaining draft lines. Record generation-time plan, permitted uses and any voice-library conditions with the original export before publishing.

Original planning estimate before importing the complete take.

| Scope | Characters | Planning credits |
| --- | ---: | ---: |
| Narrator · 40 cues | 3,791 | 3,791 |
| Company · 2 cues | 89 | 89 |
| First pass, both speakers | 3,880 | 3,880 |
| Proposed revision reserve · 20% | | 776 |
| Planning total | | 4,656 |

The estimate assumes one take for each cue at the published Multilingual v2 base rate and a standard-rate voice. Count spaces and punctuation. Joined cues add a separator. Reuse accepted lines and deduct their characters from the outstanding budget. If the proposed pilot replaces its two cue takes, the joined prompt adds one character. A discarded pilot costs its own quoted price against the revision reserve. The reserve authorizes zero expenditure. Confirm the voice-specific estimate and remaining shared balance before spending. [ElevenLabs pricing](https://elevenlabs.io/pricing)

**Proposed narrator pilot.** Resources, 01:31.000–01:51.863, two adjacent cues. The current delivery totals 15.985 seconds of speech across that 20.863-second picture window. One output, 245 characters, 245 credits in the estimate-only quote for Adam (6FiCmD8eY5VyjOdG5Zjk), Multilingual v2 and connector voice defaults. Generation requires explicit approval.

> The expedition divided its work. One branch gathered raw material from asteroids. Another set up workshops between Earth and the Moon. A small reserve stayed out in the main belt. If the workshops were lost, part of the expedition would survive.

**Company audition.** Use the existing line “This transmission is of nonhuman origin.” Present one separately quoted take after a Company voice has been identified. Listen for controlled pace, clear consonants and a natural voice distinguishable from the narrator. Retain the approved voice ID for future episodes.

## From approval to the timeline

1. Identify the existing voice and music. Check whether a saved original already covers the proposed take. Record source, model, settings, rights and filename. Keep signed URLs and credentials out of the repository.
2. For a new take, submit the exact prompt, chosen voice/model and `generations_count: 1` using `estimate_only: true`. Present that quote, settings, output count and duration to the editor. Obtain explicit spend approval for that request.
3. Add the approved request to the ledger before execution. Make one generation call. Save its generation and flow IDs immediately. If delivery or download fails, recover the same result or export from the saved flow. For an ambiguous submission, reconcile history before any new request.
4. Preserve the untouched download with its original extension. Record its SHA-256 and actual reported charge. Make a separate working WAV. Measure duration, identify the pause between cues and place each clause at its intended picture beat. Adjust subtitle phrase starts and measured ends against that recording. Let the editor hear it in the film before authorizing further takes.
5. Mix offline in three logical buses. Replace the corresponding local voice lines in the narration stem. Rebuild effects from the existing seeded recipes. Combine those stems with the approved music edit and render the single 331-second local master. Mixing a replacement on top of the current master would double the draft voice. Retain the working draft master until the replacement passes review.
6. The local production manifest records source, scene, start/end, source in-point, gain, fades, approval, provenance and version for each imported clip. Preserve the master clock and persistent, gesture-started HTML audio element. Music and effects receive their automation in the offline mix. Seek, pause, restart, fullscreen, user volume and mute continue to operate on one local file.

## Music and effects edit

| Film region | Treatment |
| --- | --- |
| Full film, 00:00–05:31 | Approach Vector fades out from 00:27.5 to 00:29.5. It returns with the Solar System atlas at 01:04, reaching its mix level at 01:06. Adjacent copies of the 30-second recording overlap by two seconds with equal-power crossfades. The score ducks under both speakers and fades out over the last three seconds. |
| Hegemony reveal, 00:29.5–00:53.18 | The supplied ambient effect takes over from the score with the dissolve, just before the Hegemony narration. |

## Validation of the current master

TypeScript and the production build passed. Local Chromium exercised the 331-second draft in desktop and mobile viewport emulation. Checks covered gesture-started playback, pause/resume, restart, forward and backward seeking, the Resources boundary, Company captions, mute and fullscreen. Blocking the MP3 request left the picture and captions running with audio controls disabled. The existing lazy Three.js chunk still triggers Vite’s size advisory. Physical-device listening remains unverified.

The [cue manifest](manifest.json) is the production worksheet and [generation ledger](generation-ledger.json) records paid requests and recoverable output IDs. The runtime script remains the editorial source of truth. Check exact text, timestamps and phrase boundaries against it whenever the film is recut.

## Supplied recording edit

The editor supplied the final opening script and its 80.927-second Adam recording. The complete take plays at recorded speed from 00:01.750 to 01:29.697. The renderer inserts silence at the source positions in the manifest. The narrator leaves three seconds before introducing the Hegemony. Caption entrances follow the performance. The next narrator cue uses Daniel at 01:31. No speech generation was required.

The score enters over 0.7 seconds at −11 dB. The Hegemony effect enters at −12 dB, fading in over two seconds and out over three. The manifest records source hashes, placements and fades for the offline mix. The supplied effect has no accompanying license record.
