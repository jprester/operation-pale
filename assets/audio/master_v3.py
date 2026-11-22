"""Archived Checkpoint A recipe for rebuilding the v3 stems."""
import json
import math
import tempfile
import wave
from pathlib import Path

from audio_io import RATE, ff
from film_timeline import ROOT, recording_windows, resolve


def render(tmp):
    timeline = json.loads((ROOT/'src/data/film/timeline-v3.json').read_text())
    cues = timeline['cues']
    duration_seconds = timeline['duration']
    manifest = json.loads((ROOT/'assets/audio/manifest-v3.json').read_text())
    speech = bytearray(round(RATE * duration_seconds) * 2)
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
    take_offset = round(resolve(timeline, take['from']) * RATE) * 2
    speech[take_offset:take_offset+len(opening)] = opening
    for cue, clip, boundary in recording_windows(timeline, manifest['segments']):
        if clip.get('originalPath') == take['originalPath']:
            continue
        local = clip['localTake']
        voice = local['voice']
        ff('-i', ROOT/local['path'], '-ar', RATE, '-ac', 1, tmp/'line.wav')
        with wave.open(str(tmp/'line.wav'), 'rb') as wav:
            samples = wav.readframes(wav.getnframes())
        start = cue['start']
        duration = len(samples)/(2*RATE)
        end = round(start + duration, 3)
        print(f'{start:6.1f} {end:7.3f}  {voice:9s}  available pause {boundary-end:.2f}s', flush=True)
        if duration < .25 or end > boundary:
            raise ValueError(f'Revise line at {start}s to fit the shot')
        offset = round(start*RATE)*2
        speech[offset:offset+len(samples)] = samples
        cue['end'] = end
    with wave.open(str(tmp/'dialogue.wav'), 'wb') as out:
        out.setparams((1, 2, RATE, 0, 'NONE', ''))
        out.writeframes(speech)

    # Original non-diegetic contact vibration, ventilation and receiver noise.
    # Each event has a discrete envelope. The isolated Earth uses the existing contact bed quietly. Leave silence
    # across the handover from the last narrator line to the public channel.
    starts = {seq['id']: seq['start'] for seq in timeline['sequences']}
    # Keep the original event order: its index selects the noise seed.
    events = [
        ('expedition', -.5, 20, 52, 1.6, .018),
        ('resources', .5, 9, 78, .8, .027), ('resources', 17.5, 10, 61, 1, .019),
        ('industry', 12, 10, 82, 1, .022), ('industry', 24, 10, 48, 1, .020),
        ('industry', 44, 6, 63, .5, .018), ('infrastructure', 19, 10, 325, 1.5, .013),
        ('staging', 49, 9, 270, 1, .012), ('staging', 58, 8, 430, 1.6, .014),
        ('industry', 20, .36, 111, .015, .060), ('industry', 28, .48, 96, .02, .054),
        ('industry', 33, .42, 104, .02, .052), ('notification', 5.55, .28, 1650, .03, .022),
        ('discovery', 26, 18, 52, 4, .012),
    ]
    layers = []
    for i,(sequence,offset,duration,hz,attack,level) in enumerate(events):
        start = starts[sequence] + offset
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
    ambient = manifest['hegemonyFx']
    placements = [(manifest['music'], manifest['music']['placement']),
                  (ambient, ambient['placement']), (ambient, ambient['repeatPlacement']),
                  (manifest['caravanBass'], manifest['caravanBass']['placement']),
                  (manifest['resourcesDrone'], manifest['resourcesDrone']['placement'])]
    for index, (asset, placement) in enumerate(placements):
        start = resolve(timeline, placement['from'])
        length = resolve(timeline, placement['to']) - start
        bed_inputs.extend(['-i', ROOT/asset['path']])
        source = f'[{first_bed+index}:a]'
        overlap = placement.get('loopCrossfadeSeconds')
        if overlap:
            source_length = asset['durationSeconds']
            copies = 1 + math.ceil((length - source_length) / (source_length - overlap))
            labels = ''.join(f'[copy{index}_{i}]' for i in range(copies))
            beds.append(f'{source}asplit={copies}{labels};')
            source = f'[copy{index}_0]'
            for i in range(1, copies):
                beds.append(f'{source}[copy{index}_{i}]acrossfade=d={overlap}:c1=qsin:c2=qsin[loop{index}_{i}];')
                source = f'[loop{index}_{i}]'
        envelope = ''
        if 'break' in placement:
            gap = placement['break']
            a, b, c, d = (resolve(timeline, gap[key]) - start for key in
                          ('fadeOutStart', 'silentFrom', 'returnStart', 'fadeInEnd'))
            envelope = f"volume='clip(({b}-t)/({b}-{a}),0,1)+clip((t-{c})/({d}-{c}),0,1)':eval=frame,"
        beds.append(
            f'{source}atrim=start={placement["sourceInSeconds"]}:duration={length},asetpts=PTS-STARTPTS,{envelope}'
            f'volume={placement["gainDb"]}dB,afade=t=in:d={placement["fadeInSeconds"]},'
            f'afade=t=out:st={length-placement["fadeOutSeconds"]}:d={placement["fadeOutSeconds"]},'
            f'adelay={round(start*1000)}:all=1[bed{index}];'
        )
    # Apply the narrator fader after the split so it doesn't change bed ducking.
    company_start = next(c['start'] for c in cues if c['speaker'] == 'Company transmission')
    narrator_gain = manifest['currentMaster']['narratorGainLinear']
    fader = f"volume={narrator_gain}:enable='lt(t,{company_start})'"
    duck = 'sidechaincompress=threshold=0.045:ratio=3:attack=18:release=350'
    graph = (
        '[0:a]asplit=3[dialogue][musicKey][fxKey];'
        f'[dialogue]{fader},pan=stereo|c0=c0|c1=c0[dialogueOut];'
        + ''.join(beds)
        + f'[bed0][musicKey]{duck}[musicOut];'
        + ''.join(f'[bed{i}]' for i in range(1,len(placements)))
        + f'amix=inputs={len(placements)-1}:duration=longest:normalize=0[fx];'
        f'[fx][fxKey]{duck}[duckedFx];'
        f'{effects}amix=inputs={len(events)}:duration=longest:normalize=0,'
        'pan=stereo|c0=c0|c1=c0[room];'
        '[room][duckedFx]amix=inputs=2:duration=longest:normalize=0[effectsOut]'
    )
    # Every stem starts at film zero and includes its authored fades and ducking.
    stems = ['dialogue', 'music', 'effects']
    outputs = []
    for name in stems:
        graph += f';[{name}Out]apad=whole_dur={duration_seconds}[{name}Padded]'
        outputs.extend(['-map', f'[{name}Padded]', '-t', duration_seconds, '-ar', 48000,
                        '-ac', 2, '-c:a', 'pcm_f32le', tmp/f'{name}-stem.wav'])
    ff('-i',tmp/'dialogue.wav',*layers,*bed_inputs,'-filter_complex',graph,*outputs)
    stem_inputs = []
    for name in stems:
        wav = tmp/f'{name}-stem.wav'
        stem_inputs.extend(['-i', wav])
        # Constant frame sizes allow accurate time-to-byte seeking in HTML audio.
        bitrate = '96k' if name == 'dialogue' else '128k'
        ff('-i', wav, '-c:a','libmp3lame','-b:a',bitrate, tmp/f'{name}.mp3')
    ff(*stem_inputs,'-filter_complex',
       'amix=inputs=3:normalize=0,alimiter=limit=0.93:level=0:latency=1',
       '-c:a','libmp3lame','-b:a','160k',tmp/'master.mp3')
    for name in stems:
        (output.parent/f'{name}.mp3').write_bytes((tmp/f'{name}.mp3').read_bytes())
    output.write_bytes((tmp/'master.mp3').read_bytes())
    # The archived v3 cue sheet is frozen.


if __name__ == '__main__':
    with tempfile.TemporaryDirectory() as work:
        render(Path(work))
