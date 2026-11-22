"""Regenerate the local replacement takes with Podcast Studio's Kokoro environment."""
import json
import math
import os
import sys
from pathlib import Path
import tempfile

os.environ.setdefault('HF_HUB_OFFLINE', '1')
import numpy as np
import soundfile as sf
import torch
from kokoro import KPipeline
from phonemizer.backend.espeak.wrapper import EspeakWrapper

from film_timeline import ROOT, load, recording_windows, save
from master import RATE, ff

MANIFEST = ROOT / 'assets/audio/manifest.json'
CAST = {'Narrator': 'bm_george', 'Company transmission': 'bf_emma'}


def generate(ids=()):
    cache = Path.home() / '.cache/espeak-ng-data'
    if cache.is_dir():
        EspeakWrapper.set_data_path(str(cache))
    torch.manual_seed(42)
    torch.set_num_threads(4)
    pipe = KPipeline(lang_code='b', repo_id='hexgrad/Kokoro-82M', device='cpu')
    timeline = load()
    manifest = json.loads(MANIFEST.read_text())
    for cue, seg, boundary in recording_windows(timeline, manifest['segments']):
        if seg.get('originalPath') or (ids and seg['id'] not in ids):
            continue
        phrases = cue['phrases']
        assert cue['transcript'] == ' '.join(p['text'] for p in phrases)
        window = boundary - cue['start'] - .12
        voice = CAST[cue['speaker']]
        speed = 1.0
        while True:
            chunks = list(pipe(cue['transcript'], voice=voice, speed=speed))
            audio = np.concatenate([chunk.audio.numpy() for chunk in chunks])
            duration = len(audio) / RATE
            if duration <= window:
                break
            speed = math.ceil(100 * speed * max(1.03, duration/window)) / 100
            if speed > 1.25:
                raise ValueError(f"Review timing for {seg['id']}: {duration:.2f}s in {window:.2f}s")
        # Match the existing caption breaks to Kokoro's own token timing.
        offsets = {}
        chars = 0
        base = 0
        for chunk in chunks:
            for token in chunk.tokens:
                if token.start_ts is not None:
                    offsets[chars] = base + token.start_ts
                chars += len(''.join(token.text.split()))
            base += len(chunk.audio) / RATE
        chars = 0
        for j, phrase in enumerate(phrases):
            predicted = offsets[chars]
            # Tokens can include a quiet lead-in. Find the first sustained
            # speech near the predicted entrance, including the first phrase.
            start = round(predicted * RATE)
            stop = min(len(audio), start + round(.45 * RATE))
            frame = RATE // 100
            onset = predicted
            for pos in range(start, stop - frame, frame):
                if np.sqrt(np.mean(audio[pos:pos+frame] ** 2)) > .006:
                    onset = pos / RATE
                    break
            phrase['at'] = round(cue['start'] + onset, 3)
            chars += len(''.join(phrase['text'].split()))
        target = ROOT / 'assets/audio/voices/kokoro' / (seg['id'] + '.flac')
        target.parent.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory() as temp:
            raw = Path(temp) / 'raw.wav'
            sf.write(raw, audio, RATE, subtype='PCM_24')
            ff('-i',raw,'-af','loudnorm=I=-18:TP=-2:LRA=8','-ar',RATE,'-sample_fmt','s16',target)
        cue['end'] = round(cue['start'] + duration, 3)
        seg.update(localTake=dict(path=str(target.relative_to(ROOT)), voice=voice, speed=speed),
                   targetDurationSeconds=round(duration,3))
        print(seg['id'], voice, speed, round(duration,3), flush=True)
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    save(timeline)


if __name__ == '__main__':
    generate(sys.argv[1:])
