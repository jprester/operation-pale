# Local audio toolchain

**Added:** 22 November 2026. Source: the editor's machine notes (`docs/local-ai-tools.md` in the narrative folder) and the Podcast Studio repository that uses the same tools.

All of these tools run **locally on this Mac, free and offline**. Prefer them over paid APIs. No ElevenLabs or other paid generation without the editor's explicit approval (see `PRODUCTION.md`).

> **You cannot hear audio.** For every generation, report the command, settings, seed if any, and output path, then let the editor listen. Never pick a "best take" yourself; offer candidates.

---

## 1. Speech: Kokoro-82M

- **Model:** Kokoro-82M, 28 English voices. Licence Apache 2.0.
- **Python environment (use this for the film):** Podcast Studio's venv, which already has `kokoro>=0.9`, `misaki[en]`, `soundfile` and `numpy`:
  `~/Projects/software_dev/my_projects/narration-app/code/podcast-studio/.venv/bin/python`
  Run `assets/audio/kokoro_takes.py` with this interpreter. Weights are cached; keep `HF_HUB_OFFLINE=1`.
- **CLI (for quick auditions only):** `kokoro-tts "text" -v bm_george -o out.wav` (in `~/.local/bin`). Check `kokoro-tts -h` for its speed and format flags. The film's takes go through `kokoro_takes.py`, because phrase-level control and onset detection are needed.
- **Voice blends** are supported: `bm_george*2+am_onyx` means a weighted mix. In the Python API, pass the expanded list joined by commas (`"bm_george,bm_george,am_onyx"`), as `KokoroTTS` in Podcast Studio's `podcast.py` does.
- **Known behaviour** (from Podcast Studio, both relevant to phrase-level synthesis):
  - Kokoro **rushes long inputs**: about 8% faster on a 100-word chunk than on short ones. Synthesise phrase by phrase, or in chunks of up to about 250 characters. Never send a whole cue as one string when it contains `‖` breaks.
  - Kokoro adds variable leading and trailing padding. **Trim each phrase's edge silence** (amplitude threshold about 0.01) to about 50 ms before inserting the script's authored pauses. Otherwise every `‖` comes out longer than written. Podcast Studio's `trim_edges()` is the reference.
  - espeak-ng cannot load its data from a path containing spaces. `kokoro_takes.py` already points it at `~/.cache/espeak-ng-data`.
- **Output:** 24 kHz mono, as now. Keep the film's existing loudness convention (`loudnorm I=-18` per take, then the mix). Do **not** copy Podcast Studio's podcast loudness targets (-20/-16 LUFS); this is a web film with its own stems.

## 2. Music, ambience and effects: Stable Audio 3 (local, MLX)

- **Location:** `~/Projects/software_dev/my_projects/narration-app/code/stable-audio-3/optimized/mlx`, with its own `.venv` (Python 3.11).
- **CLI:** `sa3 "prompt" <seconds>` (and `sa3-ui` for a web UI), in `~/.local/bin`.
- **Direct call** (as Podcast Studio does). Run it with that folder as the working directory:
  ```
  .venv/bin/python scripts/sa3_mlx.py --prompt "<prompt>" --dit <model> --decoder <decoder> \
      --seconds <n> --out <file.wav> [--cfg 3.0 --negative-prompt "drums, vocals, melody"]
  ```
- **Models:**

  | `--dit` | `--decoder` | Use | Length | Speed |
  |---|---|---|---|---|
  | `sm-sfx` | `same-s` | Steady drones, textures, room tone, one-shot impacts | ≤ 120 s | ~1.5 s per 40 s |
  | `sm-music` | `same-s` | Simple musical beds | ≤ 120 s | ~1.5 s per 40 s |
  | `medium` | `same-l` | Richer, through-composed pieces that follow an arc described in the prompt | ≤ ~380 s | ~5 s per 40 s; ~4 GB RAM |

- **Instrumental only.** There are no vocals; use it for score, beds and sound design only.
- **Reproducibility:** check `scripts/sa3_mlx.py -h` for a seed option. If one exists, always set and record the seed. If not, the generated WAV is the only source of truth: keep it, don't overwrite it.
- **Prompting:**
  - Describe the *sound*, not the scene.
  - For beds, add "no drums, no melody", or use `--negative`.
  - For long `medium` pieces, describe the arc ("begins with a faint low drone, gradually builds …, swells, then fades"); the model follows it.
- **Licence:** Stability AI Community License (free for individuals and organisations under $1M annual revenue). Record it on every generated asset. If the project ever earns revenue or is distributed commercially, the editor must revisit this.

### Provenance: required for every Stable Audio asset

Add an entry to `assets/audio/manifest.json` under a new `generated` list:

```json
{
  "id": "score-staging-a2",
  "tool": "Stable Audio 3 (local MLX)",
  "model": "medium", "decoder": "same-l",
  "prompt": "...", "negativePrompt": "...", "cfg": 3.0,
  "seconds": 120, "seed": null,
  "generatedAt": "2026-11-xxTxx:xx:xxZ",
  "path": "assets/audio/generated/score-staging/score-staging-a2.wav",
  "sha256": "...",
  "license": "Stability AI Community License",
  "approval": "candidate | selected by editor | rejected"
}
```

Keep all candidates in `assets/audio/generated/<cue>/` until the editor chooses. Then mark the rest `rejected`; don't delete them.

## 3. Other local tools (not for this task)

- **Ollama** with `qwen3.5` (`localhost:11434`). Not to be used for any script, caption or canon text in this repo.
- **Podcast Studio's bed library** (`podcast-studio/music/beds/*.mp3`): don't import these into the film unless their provenance is recorded. Generate film-specific material instead.
- The full machine inventory is in `~/Projects/LOCAL_AI_SETUP.md`.
