"""Render the local draft with macOS say and FFmpeg, using film time in seconds."""
import json
import math
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/audio'
RATE = 24000
LENGTH = 331
VOICES = {'Narrator': ('Daniel', 151), 'Company transmission': ('Samantha', 143)}
BOUNDARIES = [65, 90, 126, 177, 214, 317, 331]


def ff(*args):
    subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)


def render(tmp):
    cues = json.loads((DATA / 'dialogue.json').read_text())
    manifest = json.loads((ROOT/'assets/audio/manifest.json').read_text())
    imports = {s['id']: s for s in manifest['segments'] if s.get('originalPath')}
    speech = bytearray(RATE * LENGTH * 2)
    # Insert room between paragraphs at quiet points in the decoded performance.
    take = manifest['voices']['narrator']
    ff('-i', ROOT/take['originalPath'], '-af', 'volume=3dB,alimiter=limit=0.92:level=0:latency=1',
       '-ar', RATE, '-ac', 1, tmp/'opening.wav')
    with wave.open(str(tmp/'opening.wav'), 'rb') as wav:
        opening = wav.readframes(wav.getnframes())
    for edit in reversed(take['pauseEdits']):
        cut = round(edit['sourceSeconds'] * RATE) * 2
        silence = bytes(round(edit['insertSeconds'] * RATE) * 2)
        opening = opening[:cut] + silence + opening[cut:]
    take_offset = round(take['startSeconds'] * RATE) * 2
    speech[take_offset:take_offset+len(opening)] = opening
    ends = []
    for index, cue in enumerate(cues):
        voice, rate = VOICES[cue['speaker']]
        clip = imports.get(cue.get('id'))
        if clip:
            if clip['text'] != cue['transcript']:
                raise ValueError(f"Recording text differs for {cue['id']}")
            ends.append(clip['endSeconds'])
            continue
        subprocess.run(['say', '-v', voice, '-r', str(rate), '-o', str(tmp/'line.aiff'), cue['transcript']], check=True)
        # Trim the synthesizer's file padding, retain pauses inside the sentence.
        trim = 'silenceremove=start_periods=1:start_threshold=-58dB:start_silence=0.025'
        ff('-i', tmp/'line.aiff', '-af', f'{trim},areverse,{trim},areverse,loudnorm=I=-18:TP=-2:LRA=8',
           '-ar', RATE, '-ac', 1, tmp/'line.wav')
        with wave.open(str(tmp/'line.wav'), 'rb') as wav:
            samples = wav.readframes(wav.getnframes())
        start = cue['start']
        duration = len(samples)/(2*RATE)
        end = round(start + duration, 3)
        boundary = BOUNDARIES[cue['sequence']-1]
        if index+1 < len(cues):
            boundary = min(boundary, cues[index+1]['start'])
        print(f'{start:6.1f} {end:7.3f}  {voice:9s}  available pause {boundary-end:.2f}s', flush=True)
        if duration < .25 or end > boundary:
            raise ValueError(f'Revise line at {start}s to fit the shot')
        offset = round(start*RATE)*2
        speech[offset:offset+len(samples)] = samples
        ends.append(end)
    with wave.open(str(tmp/'dialogue.wav'), 'wb') as out:
        out.setparams((1, 2, RATE, 0, 'NONE', ''))
        out.writeframes(speech)

    # Original non-diegetic contact vibration, ventilation and receiver noise.
    # Each event has a discrete envelope. The isolated Earth uses the existing contact bed quietly. Leave silence
    # across the handover from the last narrator line to the public channel.
    events = [
        (45,20,52,1.6,.018), (75,9,78,.8,.027), (92,10,61,1,.019),
        (116,10,82,1,.022), (128,10,48,1,.020), (148,6,63,.5,.018),
        (174,10,325,1.5,.013), (241,9,270,1,.012), (250,8,430,1.6,.014),
        (124,.36,111,.015,.060), (132,.48,96,.02,.054), (137,.42,104,.02,.052),
        (300.55,.28,1650,.03,.022)]
    # The revised opening moves the seven-sequence industrial edit forward 22 s.
    events = [(start + 22, *params) for start, *params in events]
    events.append((26, 18, 52, 4, .012))
    layers = []
    for i,(start,duration,hz,attack,level) in enumerate(events):
        # Pink noise shaped into room air or contact rumble, with a faint motor harmonic.
        noise = f'anoisesrc=r={RATE}:c=pink:a=1:d={duration}:seed={80+i},bandpass=f={hz}:width_type=o:w=1.25'
        if hz < 150:
            noise += f'[air];sine=f={hz}:r={RATE}:d={duration}[motor];[air][motor]amix=normalize=0'
        release = min(duration*.50,1.8)
        graph = (noise + f',volume={level*3},afade=t=in:d={attack},'
                 f'afade=t=out:st={duration-release}:d={release},adelay={round(start*1000)}')
        path = tmp/f'bed-{i}.wav'
        ff('-f','lavfi','-i',graph,'-ar',RATE,'-ac',1,path)
        layers.extend(['-i',path])
    output = ROOT/'src/media/audio/road-to-earth.mp3'
    output.parent.mkdir(parents=True, exist_ok=True)
    first_bed = len(events) + 1
    effects = ''.join(f'[{i}:a]' for i in range(1, first_bed))
    bed_inputs = []
    beds = []
    for index, asset in enumerate([manifest['music'], manifest['hegemonyFx']]):
        placement = asset['placement']
        length = placement['endSeconds'] - placement['startSeconds']
        bed_inputs.extend(['-i', ROOT/asset['path']])
        source = f'[{first_bed+index}:a]'
        overlap = placement.get('loopCrossfadeSeconds')
        if overlap:
            source_length = asset['durationSeconds']
            copies = 1 + math.ceil((length - source_length) / (source_length - overlap))
            labels = ''.join(f'[copy{i}]' for i in range(copies))
            beds.append(f'{source}asplit={copies}{labels};')
            source = '[copy0]'
            for i in range(1, copies):
                beds.append(f'{source}[copy{i}]acrossfade=d={overlap}:c1=qsin:c2=qsin[loop{i}];')
                source = f'[loop{i}]'
        envelope = ''
        if 'break' in placement:
            gap = placement['break']
            a, b = gap['fadeOutStart'], gap['silentFrom']
            c, d = gap['returnStart'], gap['fadeInEnd']
            envelope = f"volume='clip(({b}-t)/({b}-{a}),0,1)+clip((t-{c})/({d}-{c}),0,1)':eval=frame,"
        beds.append(
            f'{source}atrim=start={placement["sourceInSeconds"]}:duration={length},asetpts=PTS-STARTPTS,{envelope}'
            f'volume={placement["gainDb"]}dB,afade=t=in:d={placement["fadeInSeconds"]},'
            f'afade=t=out:st={length-placement["fadeOutSeconds"]}:d={placement["fadeOutSeconds"]},'
            f'adelay={round(placement["startSeconds"]*1000)}:all=1[bed{index}];'
        )
    graph = (
        '[0:a]asplit[voice][key];'
        + ''.join(beds)
        + '[bed0][bed1]amix=inputs=2:duration=longest:normalize=0[beds];'
        '[beds][key]sidechaincompress=threshold=0.045:ratio=3:attack=18:release=350[score];'
        f'[voice]{effects}amix=inputs={first_bed}:duration=first:normalize=0,'
        'pan=stereo|c0=c0|c1=c0[centre];'
        '[centre][score]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.93:level=0:latency=1'
    )
    ff('-i',tmp/'dialogue.wav',*layers,*bed_inputs,'-filter_complex',graph,
       '-ar',48000,'-ac',2,'-c:a','libmp3lame','-b:a','160k',tmp/'master.mp3')
    output.write_bytes((tmp/'master.mp3').read_bytes())
    (DATA/'ends.json').write_text(json.dumps(ends,indent=2)+'\n')


if __name__ == '__main__':
    with tempfile.TemporaryDirectory() as work:
        render(Path(work))
