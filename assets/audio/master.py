"""Render the local draft with macOS say and FFmpeg, using film time in seconds."""
import json
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/audio'
RATE = 24000
LENGTH = 309
VOICES = {'Narrator': ('Daniel', 151), 'Company transmission': ('Samantha', 143)}
BOUNDARIES = [32, 68, 104, 155, 192, 295, 309]


def ff(*args):
    subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)


def render(tmp):
    cues = json.loads((DATA / 'dialogue.json').read_text())
    speech = bytearray(RATE * LENGTH * 2)
    ends = []
    for index, cue in enumerate(cues):
        voice, rate = VOICES[cue['speaker']]
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
    # Each event has a discrete envelope. No ambient bed under the opening or
    # across the handover from the last narrator line to the public channel.
    events = [
        (45,20,52,1.6,.018), (75,9,78,.8,.027), (92,10,61,1,.019),
        (116,10,82,1,.022), (128,10,48,1,.020), (148,6,63,.5,.018),
        (174,10,325,1.5,.013), (241,9,270,1,.012), (250,8,430,1.6,.014),
        (124,.36,111,.015,.060), (132,.48,96,.02,.054), (137,.42,104,.02,.052),
        (300.55,.28,1650,.03,.022)]
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
    ff('-i',tmp/'dialogue.wav',*layers,'-filter_complex',
       f'amix=inputs={len(events)+1}:duration=first:normalize=0,alimiter=limit=0.93:level=0:latency=1',
       '-ar',RATE,'-ac',1,'-c:a','libmp3lame','-b:a','80k',tmp/'master.mp3')
    output.write_bytes((tmp/'master.mp3').read_bytes())
    (DATA/'ends.json').write_text(json.dumps(ends,indent=2)+'\n')


if __name__ == '__main__':
    with tempfile.TemporaryDirectory() as work:
        render(Path(work))
