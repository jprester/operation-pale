"""Shared edit and recording times, in absolute film seconds."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PATH = ROOT / 'src/data/film/timeline.json'


def load():
    return json.loads(PATH.read_text())


def save(timeline):
    PATH.write_text(json.dumps(timeline, ensure_ascii=False, indent=2) + '\n')


def resolve(timeline, anchor):
    if 'sequence' in anchor:
        seq = next(s for s in timeline['sequences'] if s['id'] == anchor['sequence'])
        offset = seq['duration'] if anchor['at'] == 'end' else anchor['at']
        return round(seq['start'] + offset, 3)
    cue = next(c for c in timeline['cues'] if c['id'] == anchor['at'])
    return round(cue['start'] + anchor.get('offset', 0), 3)


def recording_windows(timeline, segments):
    """Match by stable ID; stop at the next cue or the end of its sequence."""
    clips = {clip['id']: clip for clip in segments}
    cues = timeline['cues']
    if len(clips) != len(segments) or set(clips) != {c['id'] for c in cues} or len(cues) != len(clips):
        raise ValueError('Timeline and recording manifest cue IDs differ')
    sequences = {seq['id']: seq for seq in timeline['sequences']}
    for i, cue in enumerate(cues):
        seq = sequences[cue['sequence']]
        boundary = seq['start'] + seq['duration']
        if i + 1 < len(cues):
            boundary = min(boundary, cues[i + 1]['start'])
        if not seq['start'] <= cue['start'] < cue['end'] <= boundary:
            raise ValueError(f"Invalid cue window: {cue['id']}")
        yield cue, clips[cue['id']], boundary
