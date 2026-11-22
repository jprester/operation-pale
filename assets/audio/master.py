"""Render the introduction stems and stereo master from the approved recording and mix sheets."""
import argparse
from array import array
import json
import math
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path

from audio_io import RATE, ff
from film_timeline import ROOT, load, recording_windows


def render_dialogue(output, narrator_gain=1):
    timeline = load()
    manifest = json.loads((ROOT / 'assets/audio/manifest.json').read_text())
    pcm = bytearray(round(timeline['duration'] * RATE) * 2)
    previous_end = 0
    for cue, take, boundary in recording_windows(timeline, manifest['segments']):
        filters = []
        radio = manifest['mix']['broadcast']
        if cue['id'] == radio['cue']:
            filters = ['-af', f"highpass=f={radio['highpassHz']},lowpass=f={radio['lowpassHz']},"
                       f"acompressor=threshold={radio['compressionThreshold']}:ratio={radio['ratio']}:attack={radio['attackMs']}:release={radio['releaseMs']},"
                       f"aecho=1:1:{radio['slapMs']}:{radio['slapDecay']},"
                       f"loudnorm=I={radio['targetLUFS']}:TP={radio['truePeakDb']}:LRA={radio['lra']}"]
        samples = subprocess.check_output(['ffmpeg', '-nostdin', '-v', 'error', '-i', ROOT / take['path'],
                                          *filters, '-ar', str(RATE), '-ac', '1', '-f', 's16le', '-'])
        start = round(cue['start'] * RATE) - take['onsetSample']
        end = start + len(samples) // 2
        if start < previous_end or end > round(boundary * RATE):
            raise ValueError(f"Recording exceeds its window: {cue['id']}")
        if cue['speaker'] == 'Narrator' and narrator_gain != 1:
            values = array('h', samples)
            samples = array('h', (round(n * narrator_gain) for n in values)).tobytes()
        pcm[2*start:2*end] = samples
        previous_end = end
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'voice.wav'
        with wave.open(str(wav), 'wb') as track:
            track.setparams((1, 2, RATE, 0, 'NONE', ''))
            track.writeframes(pcm)
        if output.suffix == '.wav':
            shutil.copyfile(wav, output)
        else:
            ff('-i', wav, '-c:a', 'libmp3lame', '-b:a', '96k', output)


def render_mix(tmp):
    timeline = load()
    manifest = json.loads((ROOT/'assets/audio/manifest.json').read_text())
    archive = json.loads((ROOT/manifest['archivedManifest']).read_text())
    selected = {r['cue']: r for r in manifest['generated'] if r['approval'] == 'selected by editor'}
    sequences = {s['id']: s for s in timeline['sequences']}
    cues = {c['id']: c for c in timeline['cues']}
    duration = timeline['duration']

    def position(anchor):
        if 'sequence' in anchor:
            seq = sequences[anchor['sequence']]
            return seq['start'] + (seq['duration'] if anchor['at'] == 'end' else anchor['at'])
        return cues[anchor['at']][anchor['edge']] + anchor.get('offset', 0)

    dialogue = tmp/'voice.wav'
    render_dialogue(dialogue, manifest['mix']['narratorGainLinear'])
    stems = {'dialogue': dialogue}
    for bus in ['music', 'effects']:
        inputs = []
        graph = []
        tracks = []
        for clip in manifest['mix']['placements']:
            if clip['bus'] != bus:
                continue
            key = clip['asset']
            a, b = position(clip['start']), position(clip['end'])
            length = round(b - a, 3)
            offset = clip['sourceIn']
            if 'sourceInSequenceDuration' in clip:
                offset += sequences[clip['sourceInSequenceDuration']]['duration']
            if not 0 <= a < b <= duration:
                raise ValueError(f'Invalid placement: {key}')
            i = len(tracks)
            if key == 'procedural-carrier':
                radio = manifest['mix']['broadcast']
                inputs.extend(['-f','lavfi','-i',f"anoisesrc=color=pink:r=48000:d={length}:seed={radio['carrierSeed']}:a={radio['carrierAmplitude']},"
                               f"highpass=f={radio['highpassHz']},lowpass=f={radio['lowpassHz']}"])
                span = length
            else:
                asset = selected[key] if key in selected else archive[key]
                inputs.extend(['-i', ROOT/asset['path']])
                span = asset.get('seconds', asset.get('durationSeconds'))
            source = f'[{i}:a]'
            if offset+length > span+.001:
                # The short archived atmospheres repeat with equal-power joins.
                copies = 1 + math.ceil((offset+length-span)/(span-2))
                graph.append(source+f'asplit={copies}'+''.join(f'[r{i}_{j}]' for j in range(copies)))
                source = f'[r{i}_0]'
                for j in range(1, copies):
                    graph.append(f'{source}[r{i}_{j}]acrossfade=d=2:c1=qsin:c2=qsin[j{i}_{j}]')
                    source = f'[j{i}_{j}]'
            graph.append(f'{source}atrim=start={offset}:duration={length},asetpts=PTS-STARTPTS,'
                         f'loudnorm=I={clip["levelLUFS"]}:TP=-3:LRA=8,aresample=48000,'
                         f'aformat=channel_layouts=stereo,afade=t=in:d={clip["fadeIn"]},'
                         f'afade=t=out:st={length-clip["fadeOut"]}:d={clip["fadeOut"]},'
                         f'adelay={round(a*1000)}:all=1[part{i}]')
            tracks.append(f'[part{i}]')
        graph.append(''.join(tracks)+f'amix=inputs={len(tracks)}:normalize=0,apad=whole_dur={duration}[bed]')
        graph.append(f'[bed][{len(tracks)}:a]sidechaincompress=threshold=0.035:ratio=3:attack=18:release=350[out]')
        stems[bus] = tmp/f'{bus}.wav'
        ff(*inputs, '-i', dialogue, '-filter_complex', ';'.join(graph), '-map', '[out]',
           '-t', duration, '-ar', 48000, '-ac', 2, '-c:a', 'pcm_f32le', stems[bus])

    for name, path in stems.items():
        ff('-i', path, '-af', 'pan=stereo|c0=c0|c1=c0' if name=='dialogue' else 'anull',
           '-ar', 48000, '-c:a', 'libmp3lame', '-b:a', '96k' if name=='dialogue' else '128k', tmp/f'{name}.mp3')
    ff('-i', dialogue, '-i', stems['music'], '-i', stems['effects'], '-filter_complex',
       '[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0[d];[d][1:a][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.93:level=0:latency=1',
       '-ar', 48000, '-c:a', 'libmp3lame', '-b:a', '160k', tmp/'road-to-earth.mp3')
    for path in tmp.glob('*.mp3'):
        shutil.copyfile(path, ROOT/'src/media/audio'/path.name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dialogue-review', action='store_true')
    if parser.parse_args().dialogue_review:
        render_dialogue(ROOT/'assets/audio/voices/kokoro/v4/dialogue-review.mp3')
    else:
        with tempfile.TemporaryDirectory() as temp:
            render_mix(Path(temp))
