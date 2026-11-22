"""Check the v4 recording timeline against the locked sheet and decoded voice takes."""
import json
import re

import numpy as np
import soundfile as sf

from film_timeline import ROOT, load, recording_windows

timeline = load()
manifest = json.loads((ROOT / 'assets/audio/manifest.json').read_text())
script = (ROOT / 'docs/design/INTRODUCTION_V4_SCRIPT.md').read_text()
rows = re.findall(r'^\| (C\d+-\d+[a-z]?) \| ([^|]+) \| ([^|]+) \|$', script, re.M)
assert [row[0] for row in rows] == [cue['id'] for cue in timeline['cues']]
pauses = {'‖': .8, '‖‖': 2, '‖‖‖': 3, '': .5}
previous = None
worst_gap = 0
for (cue, take, boundary), (_, speaker, line) in zip(recording_windows(timeline, manifest['segments']), rows, strict=True):
    assert cue['speaker'] == speaker
    assert cue['transcript'] == ' '.join(line.replace('‖', '').split())
    assert cue['transcript'] == ' '.join(p['text'] for p in cue['phrases'])
    if cue['id'] == 'C0-07':
        assert cue['transcript'] in (ROOT / 'docs/canon/CURRENT_CANON.md').read_text()
    times = [p['at'] for p in cue['phrases']]
    assert times == sorted(set(times)) and cue['start'] == times[0] and times[-1] < cue['end'] <= boundary
    audio, rate = sf.read(ROOT / take['path'])
    assert rate == take['sampleRate'] == 24000 and audio.ndim == 1
    active = np.flatnonzero(np.abs(audio) >= .01)
    assert active.size and np.max(np.abs(audio)) < 1
    origin = cue['start'] - take['onsetSample'] / rate
    assert abs(origin + active[0] / rate - cue['start']) < .1
    assert abs(origin + active[-1] / rate - cue['end']) < .1
    if previous and previous[0] == cue['sequence']:
        gap = origin + active[0]/rate - previous[1]
        worst_gap = max(worst_gap, abs(gap - previous[2] - (1 if cue['id'] == 'C0-07' else 0)))
    j = 0
    for text, marker in re.findall(r'([^‖]+)(‖*)', line):
        words = ''
        while words != text.strip():
            assert j < len(times) and text.strip().startswith(words)
            pos = int(round((times[j] - origin) * rate))
            assert np.any(abs(audio[max(0, pos-1200):pos+2400]) >= .01)
            words = (words + ' ' + cue['phrases'][j]['text']).strip()
            j += 1
        if j < len(times):
            # Find the quiet interval straddling the midpoint of the authored pause.
            midpoint = (times[j] - pauses[marker]/2 - origin) * rate
            k = np.searchsorted(active, midpoint)
            gap = (active[k] - active[k-1]) / rate
            worst_gap = max(worst_gap, abs(gap - pauses[marker]))
    previous = cue['sequence'], origin + active[-1]/rate, pauses[marker]
assert worst_gap < .05, f'Measured silence deviates by {worst_gap:.3f}s'
print(f'{len(rows)} locked cues verified; largest measured pause deviation {worst_gap*1000:.1f} ms.')
