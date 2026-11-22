"""Assemble the B2 dialogue audition from the selected local takes at measured film time."""
import json
import subprocess
import tempfile
import wave
from pathlib import Path

from audio_io import RATE, ff
from film_timeline import ROOT, load, recording_windows


def render_dialogue(output):
    timeline = load()
    manifest = json.loads((ROOT / 'assets/audio/manifest.json').read_text())
    pcm = bytearray(round(timeline['duration'] * RATE) * 2)
    previous_end = 0
    for cue, take, boundary in recording_windows(timeline, manifest['segments']):
        samples = subprocess.check_output(['ffmpeg', '-nostdin', '-v', 'error', '-i', ROOT / take['path'],
                                          '-ar', str(RATE), '-ac', '1', '-f', 's16le', '-'])
        start = round(cue['start'] * RATE) - take['onsetSample']
        end = start + len(samples) // 2
        if start < previous_end or end > round(boundary * RATE):
            raise ValueError(f"Recording exceeds its window: {cue['id']}")
        pcm[2*start:2*end] = samples
        previous_end = end
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'voice.wav'
        with wave.open(str(wav), 'wb') as track:
            track.setparams((1, 2, RATE, 0, 'NONE', ''))
            track.writeframes(pcm)
        ff('-i', wav, '-c:a', 'libmp3lame', '-b:a', '96k', output)


if __name__ == '__main__':
    render_dialogue(ROOT / 'assets/audio/voices/kokoro/v4/dialogue-review.mp3')
