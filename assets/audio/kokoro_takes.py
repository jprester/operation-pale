"""Run with ~/Projects/software_dev/my_projects/narration-app/code/podcast-studio/.venv/bin/python."""
import json
import math
import os
import re
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


def pipeline():
    cache = Path.home() / '.cache/espeak-ng-data'
    if cache.is_dir():
        EspeakWrapper.set_data_path(str(cache))
    torch.manual_seed(42)
    torch.set_num_threads(4)
    return KPipeline(lang_code='b', repo_id='hexgrad/Kokoro-82M', device='cpu')


def generate(ids=()):
    pipe = pipeline()
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


AUDITION = ROOT / 'assets/audio/voices/kokoro/audition'
SCRIPT = ROOT / 'docs/design/INTRODUCTION_V4_SCRIPT.md'
PAUSES = {'‖': .8, '‖‖': 2.0, '‖‖‖': 3.0, '': .5}


def audition_phrases(ids):
    rows = dict(re.findall(r'^\| (C\d+-\d+) \| [^|]+ \| ([^|]+) \|$', SCRIPT.read_text(), re.M))
    for cue_id in ids:
        for text, mark in re.findall(r'([^‖]+)(‖*)', rows[cue_id]):
            text = text.strip()
            if text:
                yield cue_id, text, PAUSES[mark]


def audition_take(pipe, ids, voices, speed, target):
    torch.manual_seed(42)
    pieces = []
    timings = []
    cursor = 0
    previous_tail = 0
    gap = 0
    words = 0
    for cue_id, text, pause in audition_phrases(ids):
        if len(text) > 250:
            raise ValueError(f'Review phrase length in {cue_id}')
        audio = np.concatenate([c.audio.numpy() for c in pipe(text, voice=voices, speed=speed)])
        active = np.flatnonzero(np.abs(audio) >= .01)
        if not active.size:
            raise ValueError(f'Silent phrase in {cue_id}')
        onset, end = int(active[0]), int(active[-1]) + 1
        head = min(onset, round(.05 * RATE))
        tail = min(len(audio) - end, round(.05 * RATE))
        if pieces:
            # Retained room at both edges counts towards the authored silence.
            silence = round(gap * RATE) - previous_tail - head
            pieces.append(np.zeros(silence, dtype=np.float32))
            cursor += silence
        phrase = audio[onset-head:end+tail]
        timings.append(dict(cue=cue_id, onsetSample=cursor+head, endSample=cursor+len(phrase)-tail,
                            pauseSeconds=pause))
        pieces.append(phrase)
        cursor += len(phrase)
        previous_tail, gap = tail, pause
        words += len(text.split())
    pieces.append(np.zeros(round(gap * RATE) - previous_tail, dtype=np.float32))
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / 'raw.wav'
        sf.write(raw, np.concatenate(pieces), RATE, subtype='PCM_24')
        ff('-i', raw, '-af', 'loudnorm=I=-18:TP=-2:LRA=8', '-ar', RATE, '-c:a', 'pcm_s16le', target)
    info = sf.info(target)
    if abs(info.frames - sum(map(len, pieces))) > RATE * .01:
        raise ValueError(f'Unexpected encoded length: {target}')
    return dict(file=target.name, voices=voices.split(','), speed=speed, words=words,
                seconds=round(info.duration, 3), wpm=round(60 * words / info.duration, 1),
                phrases=timings)


def audition():
    pipe = pipeline()
    AUDITION.mkdir(exist_ok=True, parents=True)
    takes = []
    for voice, speed in [('bm_george', .92), ('bm_george', .96), ('bm_george', 1.0),
                         ('bm_george,bm_george,am_onyx', .96), ('bm_fable,bm_fable,am_onyx', .96),
                         ('bf_emma', 1.0), ('bf_alice', 1.0)]:
        ids = ['C0-07'] if voice.startswith('bf_') else ['C0-01', 'C0-02', 'C0-03']
        name = f"{voice.replace(',', '-')}-{speed:.2f}.wav"
        take = audition_take(pipe, ids, voice, speed, AUDITION / name)
        print(name, take['seconds'], 'seconds', take['wpm'], 'wpm', flush=True)
        takes.append(take)
    (AUDITION / 'takes.json').write_text(json.dumps(dict(sampleRate=RATE, seed=42, takes=takes), indent=2)+'\n')


if __name__ == '__main__':
    if sys.argv[1:] == ['--audition']:
        audition()
    else:
        generate(sys.argv[1:])
