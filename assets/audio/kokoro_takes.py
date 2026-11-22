"""Run with ~/Projects/software_dev/my_projects/narration-app/code/podcast-studio/.venv/bin/python."""
import hashlib
import json
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

from film_timeline import ROOT, save
from audio_io import RATE, ff

MANIFEST = ROOT / 'assets/audio/manifest.json'
CAST = {'Narrator': ('bm_fable,bm_fable,am_onyx', .96), 'Company transmission': ('bf_alice', 1.0)}


def pipeline():
    cache = Path.home() / '.cache/espeak-ng-data'
    if cache.is_dir():
        EspeakWrapper.set_data_path(str(cache))
    torch.manual_seed(42)
    torch.set_num_threads(4)
    return KPipeline(lang_code='b', repo_id='hexgrad/Kokoro-82M', device='cpu')


AUDITION = ROOT / 'assets/audio/voices/kokoro/audition'
SCRIPT = ROOT / 'docs/design/INTRODUCTION_V4_SCRIPT.md'
PAUSES = {'‖': .8, '‖‖': 2.0, '‖‖‖': 3.0, '': .5}


def audition_phrases(ids):
    rows = dict(re.findall(r'^\| (C\d+-\d+[a-z]?) \| [^|]+ \| ([^|]+) \|$', SCRIPT.read_text(), re.M))
    for cue_id in ids:
        for text, mark in re.findall(r'([^‖]+)(‖*)', rows[cue_id]):
            text = text.strip()
            if text:
                yield cue_id, text, PAUSES[mark]


def render_take(pipe, ids, voices, speed, target, production=False):
    torch.manual_seed(42)
    pieces = []
    timings = []
    captions = []
    cursor = 0
    previous_tail = 0
    gap = 0
    words = 0
    for cue_id, text, pause in audition_phrases(ids):
        if len(text) > 250:
            raise ValueError(f'Review phrase length in {cue_id}')
        chunks = list(pipe(text, voice=voices, speed=speed))
        audio = np.concatenate([c.audio.numpy() for c in chunks])
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
        captions.append({'text': text, 'sample': cursor + head})
        if production and len(text) > 70 and ', ' in text:
            # Keep the spoken phrase intact. Locate caption breaks in Kokoro's
            # timed tokens, relative to the original (pre-trim) audio.
            tokens = [(tok, base) for chunk, base in zip(chunks, np.cumsum([0] + [len(c.audio) for c in chunks[:-1]]))
                      for tok in chunk.tokens]
            remaining = text
            consumed = 0
            while len(remaining) > 70 and ', ' in remaining:
                commas = [m.end() for m in re.finditer(r',(?= )', remaining)]
                split = min(commas, key=lambda n: abs(n - 55))
                left, remaining = remaining[:split], remaining[split:].strip()
                captions[-1]['text'] = left
                consumed += len(''.join(left.split()))
                pos = 0
                for tok, base in tokens:
                    if pos >= consumed and tok.start_ts is not None:
                        predicted = int(base + tok.start_ts * RATE)
                        window = np.flatnonzero(np.abs(audio[predicted:predicted+int(.45*RATE)]) >= .01)
                        entrance = predicted + (int(window[0]) if window.size else 0)
                        captions.append({'text': remaining, 'sample': cursor + head + entrance - onset})
                        break
                    pos += len(''.join(tok.text.split()))
                else:
                    raise ValueError(f'Cannot align subtitle split in {cue_id}')
        pieces.append(phrase)
        cursor += len(phrase)
        previous_tail, gap = tail, pause
        words += len(text.split())
    if not production:
        pieces.append(np.zeros(round(gap * RATE) - previous_tail, dtype=np.float32))
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / 'raw.wav'
        sf.write(raw, np.concatenate(pieces), RATE, subtype='PCM_24')
        ff('-i', raw, '-af', 'loudnorm=I=-18:TP=-2:LRA=8', '-ar', RATE, '-sample_fmt', 's16', target)
    if production:
        # Loudness normalization lifts quiet edge noise. Fade the retained
        # padding at phrase boundaries so it cannot consume the authored gap.
        audio, _ = sf.read(target)
        cleaned = np.zeros_like(audio)
        for phrase in timings:
            a, b = phrase['onsetSample'], phrase['endSample']
            fade = round(.012 * RATE)
            lo, hi = max(0, a-fade), min(len(audio), b+fade)
            cleaned[lo:a] = audio[lo:a] * np.linspace(0, 1, a-lo, endpoint=False)
            cleaned[a:b] = audio[a:b]
            cleaned[b:hi] = audio[b:hi] * np.linspace(1, 0, hi-b, endpoint=False)
        sf.write(target, cleaned, RATE, subtype='PCM_16')
    info = sf.info(target)
    if abs(info.frames - sum(map(len, pieces))) > RATE * .01:
        raise ValueError(f'Unexpected encoded length: {target}')
    return dict(file=target.name, voices=voices.split(','), speed=speed, words=words,
                seconds=round(info.duration, 3), wpm=round(60 * words / info.duration, 1),
                phrases=timings, captions=captions)


def audition():
    pipe = pipeline()
    AUDITION.mkdir(exist_ok=True, parents=True)
    takes = []
    for voice, speed in [('bm_george', .92), ('bm_george', .96), ('bm_george', 1.0),
                         ('bm_george,bm_george,am_onyx', .96), ('bm_fable,bm_fable,am_onyx', .96),
                         ('bf_emma', 1.0), ('bf_alice', 1.0)]:
        ids = ['C0-07'] if voice.startswith('bf_') else ['C0-01', 'C0-02', 'C0-03']
        name = f"{voice.replace(',', '-')}-{speed:.2f}.wav"
        take = render_take(pipe, ids, voice, speed, AUDITION / name)
        take.pop('captions')
        print(name, take['seconds'], 'seconds', take['wpm'], 'wpm', flush=True)
        takes.append(take)
    (AUDITION / 'takes.json').write_text(json.dumps(dict(sampleRate=RATE, seed=42, takes=takes), indent=2)+'\n')


SEQUENCES = [
    ('h-hour', 'H-hour', ''), ('title', 'Title', ''), ('record', 'The record', 'The record.'),
    ('manifest', 'The manifest', 'What could not be made here.'),
    ('foundries', 'The Foundries', 'Four Foundries.'), ('seen', 'Seen, not understood', 'Seen, not understood.'),
    ('staging', 'Final staging', 'The last ninety days.'), ('h-zero', 'H+0', ''),
]
HEAD = {'h-hour': 2.5, 'title': 6}
TAIL = {'h-zero': 6}


def record_film():
    rows = re.findall(r'^\| (C(\d+)-\d+[a-z]?) \| ([^|]+) \| ([^|]+) \|$', SCRIPT.read_text(), re.M)
    manifest = json.loads(MANIFEST.read_text())
    old_cues = {c['id']: c for c in json.loads((ROOT/'src/data/film/timeline.json').read_text())['cues']}
    old_takes = {s['id']: s for s in manifest['segments']}
    pipe = None
    folder = AUDITION.parent / 'v4'
    folder.mkdir(exist_ok=True)
    cursor = 0
    timeline = dict(edition='Introduction v4', sequences=[], cues=[])
    segments = []
    script_groups = dict(zip((s[0] for s in SEQUENCES if s[0] != 'title'), range(7), strict=True))
    for seq, label, title in SEQUENCES:
        start = round(cursor / RATE, 3)
        cursor += round(HEAD.get(seq, 1.5) * RATE)
        for cue_id, group, speaker, line in rows:
            if int(group) != script_groups.get(seq):
                continue
            if cue_id == 'C0-07':
                cursor += RATE  # carrier pre-roll after the announcement's authored pause
            transcript = ' '.join(line.replace('‖', '').split())
            old = old_cues.get(cue_id)
            if old and old['transcript'] == transcript:
                clip = old_takes[cue_id]
                if hashlib.sha256((ROOT/clip['path']).read_bytes()).hexdigest() != clip['sha256']:
                    raise ValueError(f'Cached take differs from manifest: {cue_id}')
                start_seconds = round(cursor/RATE, 3)
                shift = start_seconds - old['start']
                end = round(old['end'] + shift, 3)
                timeline['cues'].append({**old, 'start': start_seconds, 'end': end,
                    'phrases': [{**p, 'at': round(p['at'] + shift, 3)} for p in old['phrases']]})
                segments.append(clip)
                cursor = round((end + PAUSES[re.search(r'‖*$', line)[0]]) * RATE)
                continue
            if pipe is None:
                pipe = pipeline()
            path = folder / (cue_id + ('-r1' if old else '') + '.flac')
            voice, speed = CAST[speaker]
            take = render_take(pipe, [cue_id], voice, speed, path, production=True)
            origin = cursor - take['phrases'][0]['onsetSample']
            last = take['phrases'][-1]
            transcript = ' '.join(line.replace('‖', '').split())
            phrases = [dict(text=p['text'], at=round((origin+p['sample'])/RATE, 3)) for p in take['captions']]
            assert ' '.join(p['text'] for p in phrases) == transcript
            end = origin + last['endSample']
            timeline['cues'].append(dict(id=cue_id, sequence=seq, speaker=speaker,
                                         start=round(cursor/RATE, 3), end=round(end/RATE, 3),
                                         transcript=transcript, phrases=phrases))
            segments.append(dict(id=cue_id, speaker=speaker, path=str(path.relative_to(ROOT)),
                                 voice=voice, speed=speed, onsetSample=take['phrases'][0]['onsetSample'],
                                 seed=42, sampleRate=RATE))
            cursor = end + round(last['pauseSeconds'] * RATE)
            print(cue_id, round(end/RATE, 3), flush=True)
        cursor += TAIL.get(seq, 0) * RATE
        timeline['sequences'].append(dict(id=seq, label=label, cutTitle=title, start=start,
                                          duration=round(cursor/RATE-start, 3), indexed=seq!='title'))
    assert len(segments) == len(rows) == len({s['id'] for s in segments})
    timeline['duration'] = round(cursor/RATE, 3)
    manifest = json.loads(MANIFEST.read_text())
    manifest['localSynthesis'] = dict(model='hexgrad/Kokoro-82M', license='Apache-2.0',
                                      language='British English', device='cpu', torchThreads=4,
                                      seedPerCue=42, loudness='loudnorm=I=-18:TP=-2:LRA=8')
    for segment in segments:
        segment['sha256'] = hashlib.sha256((ROOT / segment['path']).read_bytes()).hexdigest()
    manifest.update(edition=timeline['edition'], segments=segments, durationSeconds=timeline['duration'])
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False)+'\n')
    save(timeline)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--audition', action='store_true')
    if parser.parse_args().audition:
        audition()
    else:
        record_film()
