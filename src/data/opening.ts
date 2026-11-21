import dialogue from './audio/dialogue.json';
import subtitles from './audio/subtitles.json';
import recordedEnds from './audio/ends.json';

export const publicNotice: string[] = [
  'This transmission is of nonhuman origin.',
  'Leave military equipment and military structures.',
  'Cities, hospitals, utilities and food systems are not targets.',
  'Do not launch strategic weapons. Further instructions will follow.',
];

type Speaker = 'Narrator' | 'Company transmission';
type Cue = { subtitles: { at:number; text:string }[]; start: number; end: number; transcript: string; speaker: Speaker };
type Beat = { start: number; duration: number; label: string; title: string; narration: Cue[] };
export const cover = {
  title: 'The Road to Earth',
  caption: 'A company enters the Solar System with a six-year charter and a finite manifest. It needs the planet working when the charter ends.',
};
// Recording cues use absolute reel time. Rendering consumes scene-local time.
const scenes = [
  { start: 0, duration: 67.5, label: 'Earth & the Hegemony', title: 'The road to Earth.' },
  { start: 67.5, duration: 29, label: 'Expedition', title: 'The expedition.' },
  { start: 96.5, duration: 29.5, label: 'Resources', title: 'Working the asteroids.' },
  { start: 126, duration: 51, label: 'Industrial build-up', title: 'An industry takes shape.' },
  { start: 177, duration: 37, label: 'Infrastructure', title: 'Built in Earth orbit.' },
  { start: 214, duration: 103, label: 'Final Staging', title: 'The machinery of conquest.' },
  { start: 317, duration: 14, label: 'Notification', title: 'The first words.' },
];
export const beats: Beat[] = scenes.map((scene,index) => ({
  ...scene,
  narration: dialogue.flatMap((cue,i): Cue[] => cue.sequence === index+1 ? [{
    subtitles: subtitles[i],
    start: cue.start - scene.start,
    end: recordedEnds[i] - scene.start,
    speaker: cue.speaker === 'Company transmission' ? 'Company transmission' : 'Narrator',
    transcript: cue.transcript,
  }] : []),
}));

export const introDuration = beats[beats.length - 1].start + beats[beats.length - 1].duration;

export function frameAt(elapsed: number) {
  const next = beats.findIndex(scene => scene.start > elapsed);
  const index = next < 0 ? beats.length - 1 : Math.max(0, next - 1);
  const scene = beats[index];
  const seconds = elapsed - scene.start;
  const cue = scene.narration.find(item => seconds >= item.start && seconds < item.end);
  return { index, scene, seconds, cue };
}

export const schedule: { time: string; event: string; detail: string }[] = [
  { time: 'T+0:00', event: 'Public emergency notice', detail: 'The public warning runs for 45–90 seconds.' },
  { time: 'T+0:02', event: 'Government contact notice', detail: 'Authorities, observatories and telecommunications operators receive separate contact instructions.' },
  { time: 'T+0:05', event: 'Demonstration bulletin', detail: 'A distinct channel repeats the location, time and safety perimeter.' },
  { time: 'T+0:10', event: 'Inert demonstration', detail: 'An inert projectile reaches the announced empty shelter.' },
  { time: 'T+0:12', event: 'Technical identity package', detail: 'Specialists receive the information needed to authenticate later messages.' },
  { time: 'T+0:15', event: 'Destructive demonstration', detail: 'An evacuated military complex is demolished.' },
  { time: 'T+0:18', event: 'Military power denial', detail: 'Dedicated military supplies are interrupted. Adjacent civilian grids remain active.' },
  { time: 'T+0:20–0:30', event: 'Regional Wave begins', detail: 'Regional bulletins repeat local timing and safety instructions.' },
];

