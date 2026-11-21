# Cinematic player

The [v3.2 opening recording sheet](OPENING_HOOK.md) gives the current runtime, revised opening cues and latest review frames. The player validation below records the earlier 5:09 cut.

## Presentation plan

Watch opens on the existing Earth plate. The title and visitor-started play button share the negative space beside the globe. During playback the frame belongs to the current shot. A small historical clock sits above it, short scene titles fade at cuts, and phrase subtitles occupy the lower safe area. Transport sits immediately below the image so controls never cover a map or subtitle. Scene selection uses a native menu.

Explore pauses the same transport. Its atlas and equipment viewer can be browsed independently of the film position. The full timecoded transcript and existing chapter records live here. An explicit transcript jump returns to Watch at the selected line. Returning normally holds the position until the viewer presses Play.

One persistent player owns the clock, audio mixer, transport and fullscreen surface. Only the active picture mounts. Wide screens use a height-limited widescreen frame; portrait uses a taller frame with a dedicated caption shelf. Controls remain visible for pause, keyboard navigation and touch interaction. Future silent video inserts belong to the shot layer and sample the same clock with a still underneath.

## Implemented controls and framing

Watch uses a seven-button sequence index below the transport. Fullscreen replaces it with a compact sequence menu and retains Explore access. Native range and button controls support keyboard navigation. The pointer or a touch wakes the transport after three seconds of inactivity. Pausing or focusing a transport control with the keyboard keeps it visible. Browsers without element fullscreen can expand the player in the page and exit with Escape.

The Earth cover uses an off-centre disc; the survey cut recentres it. Caravan retains the aft-to-broadside camera with a wider close-up. Industrial models have a separate lower-third identification area. The orbital pullback gets extra vertical clearance as the globe resolves. Atlas controls live in Explore; Watch frames the SVG and its illustrative-scale legend together. Documentary plates occupy the picture with their original motion. Portrait places captions below the subject and contains photographs to preserve faces. Reconstruction captions and Earth imagery credits remain attached to their plates.

Explore uses the atlas at the paused historical time. Equipment records pair approved stills with an optional orbit view sharing the development inspector’s bounds fitting and lights. Transcript links explicitly seek. The chapter index retains the original records, transmission schedule and verification exhibit.

## Subtitle and media delivery

Each entry of src/data/audio/subtitles.json corresponds to one recording cue in dialogue.json. Its phrase starts are absolute film seconds. The measured recording end in ends.json clears the final phrase, including in silence after a backward seek. The words are taken directly from the transcript. Internal cuts are editorial estimates placed near low-energy points in the master. When replacing the mix with another recording, check the internal boundaries against the new delivery as well as updating the cue ends. The mixer and clock remain mounted across both modes.

A documentary manifest entry can optionally specify a video URL alongside its existing still filenames. Supply an MP4 or WebM with frequent keyframes. SilentInsert samples the shot-local clock, coalesces outstanding decoder seeks and never calls play. The media stays muted. The existing still supplies the initial frame, failure state and reduced-motion composition. No video clips ship in this cut.

## Validation and remaining limits

TypeScript and Vite production checks passed. A gesture-gated Chromium session exercised start, pause, restart, forward/backward seeks, scene boundaries, keyboard seeking, captions and cue gaps, mute, end-of-reel pause, Watch/Explore position retention, atlas scale, model orbit, fullscreen, and control hiding and pointer wake. Audio skew on a settled playing seek sampled 72 ms with one persistent master. Reduced-motion checks used the orbital still. Desktop and emulated mobile captures cover Earth, atlas, Caravan, extraction, Foundry Gamma, staged orbit, human reconstruction and the Notification transition.

[Desktop frames](cinematic-review/desktop.jpg) · [Portrait frames](cinematic-review/mobile.jpg) · [Opening cover](cinematic-review/cover.jpg)

The existing scene renderers remain lazy and demand-driven. The 3D film canvases cap pixel ratio at 1.4 (atlas 1.5). Explore unmounts the film picture before offering a different model. Its atlas uses the existing SVG fallback without allocating a WebGL context. Context loss switches affected shots to their existing still or schematic until remounted. Shared GLB geometry, textures and materials retain their existing loader caches. Device GPU memory, sustained hardware frame rate, physical mobile Safari and production video decode performance remain unmeasured. Vite continues to flag the lazy Three.js renderer chunk.
