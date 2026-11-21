# The Road to Earth · Opening hook

## Recording sheet

The opening uses the Adam recording from 00:01.750 to 01:32.197. Paragraph breaks gain 0.42 seconds, with a longer three-second pause before the Hegemony. Each cue in the [recording sheet](../../src/data/audio/dialogue.json) has a film-time entrance, speaker, transcript and subtitle phrases. The [production manifest](../../assets/audio/manifest.json) also records the corresponding times within the downloaded MP3.

## Picture and sound edit

Earth holds alone for eight seconds. The four archive photographs appear one at a time beside the rotating globe. After the ISS photograph clears, the camera withdraws. The local sound master has environmental beds and two draft voices. The isolation passage reuses its low contact-vibration treatment at a lower level.

At 00:29.5 the isolated globe dissolves into a face-on scientific illustration of the Milky Way. At 00:49 the galaxy gives way to Earth's survey record. The three proposed glyphs share a spine, terminal notch and branching strokes. Their grouping supplies visual continuity between records. English annotations are explicitly marked as documentary translations. The reconstruction establishes no political boundaries or canonical alien writing system.

The expedition atlas enters at 01:06.5. Between 01:14.5 and 01:21.5 the view box closes on the fixed Caravan mark. The camera recentres the mark while the symbols fade and the approved v002 model appears at the corresponding screen position. The model then fills the industrial broadside shot. AtlasReveal takes its timing and subject as inputs. All interpolation samples film seconds. Reduced motion switches between static compositions and the existing approved model still.

The final “Earth” gives way to the supplied bass hit and a hold on the hull. Resources begins at 01:36.5, Industrial build-up at 02:06, Infrastructure at 02:57, Final Staging at 03:34 and Notification at 05:17. The film ends at 05:31. At 01:37.5 Caravan dispatches mining equipment and a separate reserve. The next shipment travels inward. The map follows it into the Earth–Moon region and shows the workshop packages arriving. An asteroid surface insert identifies the source of the bulk material before the cut to Foundry Alpha at 02:06. The routes and compressed travel times are illustrative.

## Image provenance

The local WebP derivatives are resized archive images. The manifest records a source page, download URL, archive ID and description for each. The four photographs use NASA's informational media usage guidance. The galactic illustration is credited to NASA/JPL-Caltech. [NASA media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) · [JPL image policy](https://www.jpl.nasa.gov/jpl-image-use-policy/) · [Asset manifest](../../public/art/opening/manifest.json)

| Plate | Source |
| --- | --- |
| Tokyo and Yokohama around Tokyo Bay, photographed from the ISS | [NASA ISS064-E-023814](https://images.nasa.gov/details/iss064e023814) |
| Port of Rotterdam, photographed from the ISS | [NASA ISS011-E-7380](https://science.nasa.gov/earth/earth-observatory/port-of-rotterdam-netherlands-5591/) |
| Apollo 11 lifting off, 1969 | [NASA S69-39525](https://images.nasa.gov/details/s69-39525) |
| ISS from Atlantis after undocking, 2010 | [NASA S132-E-012208](https://images.nasa.gov/details/s132e012208) |
| Milky Way, artist's concept | [NASA/JPL-Caltech PIA10748](https://www.jpl.nasa.gov/images/pia10748-our-milky-way-gets-a-makeover-artist-concept/) |

## Validation

The production player ran uninterrupted from the first Play gesture through 01:32. Review covered all four photographs, the withdrawal, galaxy dissolve, survey entries and the atlas-to-hull match. Continuous playback exposed a canvas sizing error when the model mounted under a small CSS scale. Measuring the canvas before CSS transforms restored the full-size broadside. The repeat run showed the aft assembly, cargo truss and forward habitation section across the frame.

Across 559 sampled positions, every visible phrase or silence matched its recording cue within the scrubber’s displayed time resolution. The 95th-percentile difference between the master audio and displayed film position was 72 ms. Browser checks also exercised backward and forward seeks, a paused seek into Final Staging, restart, fullscreen entry and exit, and reduced-motion portrait layouts. TypeScript and the production build passed. The lazy Three.js bundle retains its size advisory. Physical-device audio latency and Safari remain unmeasured.

[Desktop review frames](cinematic-review/opening-v32-desktop.jpg) · [Reduced-motion mobile frames](cinematic-review/opening-v32-mobile.jpg)

### Foundry environment

The four industrial close-ups share a 36 KB [WebP backdrop](../../public/art/documentary/cislunar-foundries.webp). The fragments represent delivered feedstock at a cislunar worksite. Their positions and sizes are illustrative. The facility models remain separate foreground elements.

Built-in ImageGen prompt:

> Wide 16:9 photographic reconstruction for a restrained space documentary. Cislunar space at a remote industrial worksite. Small recognizable half-lit Earth in the upper left third, soft muted ocean blue, pale cloud swirls, delicate limb. Along the extreme lower right and far left edges a handful of widely separated rough carbonaceous asteroid fragments delivered as raw feedstock, textured by low raking sunlight. Keep the broad center almost empty and dark for compositing a separately rendered workshop. Black sky, sparse faint stars, no haze, text, station, ships, lens flare or dense asteroid belt.
