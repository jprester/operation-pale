"""Render B2 listening candidates with local Stable Audio 3 and a measured voice timeline."""
import hashlib
import json
import os
import subprocess
import tempfile
import wave
from datetime import datetime, timezone
from pathlib import Path

from film_timeline import ROOT, load

MLX = Path.home() / 'Projects/software_dev/my_projects/narration-app/code/stable-audio-3/optimized/mlx'
MANIFEST = ROOT / 'assets/audio/manifest.json'
CUES = [
    ('bed-cold-open', 'sm-sfx', ['h-hour'], 10,
     'Low steady room tone with a faint sub-bass vibration, distant ventilation hum, very sparse, no melody, no drums, no pulses.'),
    ('hit-title', 'sm-sfx', [], 8,
     'Single deep sub-bass impact with a long dark decay, no reverb tail brightness, no melody.'),
    ('score-flashback', 'medium', ['record', 'manifest', 'foundries'], 0,
     'Slow, restrained orchestral-electronic score. Begins with sparse low strings and a cold synth pad, steady and patient, gradually adds soft repeating mechanical textures, never triumphant. No drums, no vocals, no melody lead.'),
    ('bed-seen', 'sm-sfx', ['seen'], 10,
     'Thin high air tone with very faint static, almost silent, uneasy, no melody, no drums.'),
    ('score-staging', 'medium', ['staging'], 10,
     'Dark ambient composition. Begins with a low drone and slow pulsing pad, gradually builds dissonant bowed strings and deep swells toward a restrained peak, then thins abruptly to a single held low tone. No drums, no vocals.'),
    ('score-end', 'sm-music', [], 30,
     'Sparse cold piano-like tones over a low pad, slow, unresolved, no drums.'),
]


def main():
    timeline = load()
    durations = {s['id']: s['duration'] for s in timeline['sequences']}
    manifest = json.loads(MANIFEST.read_text())
    generated = manifest['generated']
    for i, (cue, model, sequences, padding, prompt) in enumerate(CUES):
        seconds = round(sum(durations[s] for s in sequences) + padding, 3)
        decoder = 'same-l' if model == 'medium' else 'same-s'
        for take in range(1, 4):
            name = f'{cue}-a{take}'
            path = ROOT / 'assets/audio/generated' / cue / (name + '.wav')
            existing = next((row for row in generated if row['id'] == name), None)
            seed = 41000 + 10*i + take
            negative = 'drums, vocals'
            if existing:
                if (existing['prompt'], existing['seed'], existing['seconds']) != (prompt, seed, seconds):
                    raise ValueError(f'Changed recipe for {name}; preserve the original and use a new ID')
                if hashlib.sha256(path.read_bytes()).hexdigest() != existing['sha256']:
                    raise ValueError(f'Candidate checksum mismatch: {name}')
                continue
            if path.exists():
                raise FileExistsError(path)
            path.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory(dir=path.parent) as tmp:
                output = Path(tmp) / path.name
                model_seconds = min(120, seconds) if model.startswith('sm-') else seconds
                raw = output if model_seconds == seconds else Path(tmp) / 'source.wav'
                subprocess.run([MLX/'.venv/bin/python', 'scripts/sa3_mlx.py', '--dit', model,
                                '--decoder', decoder, '--seconds', str(model_seconds), '--prompt', prompt,
                                '--negative-prompt', negative, '--steps', '8', '--seed', str(seed),
                                '--cfg', '3.0', '--out', str(raw)], cwd=MLX, check=True,
                               env={**os.environ, 'HF_HUB_OFFLINE': '1'})
                if raw != output:
                    # Extend only the review handle beyond the small model's 120 s limit.
                    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', raw, '-filter_complex',
                                    f'asplit[a][b];[a][b]acrossfade=d=2:c1=qsin:c2=qsin,atrim=duration={seconds}',
                                    '-c:a', 'pcm_s16le', output], check=True)
                with wave.open(str(output)) as wav:
                    if wav.getnchannels() != 2 or abs(wav.getnframes()/wav.getframerate()-seconds) > .001:
                        raise ValueError(f'Unexpected WAV format or length: {name}')
                output.rename(path)
            generated.append(dict(id=name, cue=cue, tool='Stable Audio 3 (local MLX)', model=model,
                                  decoder=decoder, prompt=prompt, negativePrompt=negative, cfg=3, steps=8,
                                  seconds=seconds, modelSeconds=model_seconds, loopCrossfadeSeconds=2 if model_seconds < seconds else 0, seed=seed, generatedAt=datetime.now(timezone.utc).isoformat(),
                                  path=str(path.relative_to(ROOT)), sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                                  license='Stability AI Community License', approval='candidate'))
            temporary = MANIFEST.with_suffix('.tmp')
            temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
            temporary.replace(MANIFEST)
            print(name, seconds, flush=True)


if __name__ == '__main__':
    main()
