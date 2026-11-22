import timeline from './film/timeline.json';

// Canonical text: Canon Handoff v2.4 §6 (docs/canon/CURRENT_CANON.md §5).
export const publicNotice: string[] = [
  'This transmission is not of human origin.',
  'Military forces worldwide are being neutralized now.',
  'This is not an attack by any human state.',
  'Civilian population centres, hospitals, food systems, water systems, and electrical infrastructure are not targets.',
  'Do not launch strategic weapons.',
  'Leave disabled military facilities and equipment immediately.',
  'Further instructions will follow.',
];

type Speaker = 'Narrator' | 'Company transmission';
type Cue = { subtitles: { at:number; text:string }[]; start: number; end: number; transcript: string; speaker: Speaker };
export const cover = {
  title: 'The Road to Earth',
  caption: 'A company enters the Solar System with a six-year charter and a finite manifest. It needs the planet working when the charter ends.',
};
// Captions retain absolute film times; the player exposes scene-local cue bounds.
export const beats = timeline.sequences.map((scene, index) => ({
  ...scene,
  title: scene.cutTitle,
  figure: index + 1,
  narration: timeline.cues.filter(cue => cue.sequence === scene.id).map((cue): Cue => ({
    subtitles: cue.phrases,
    start: cue.start - scene.start,
    end: cue.end - scene.start,
    speaker: cue.speaker === 'Company transmission' ? 'Company transmission' : 'Narrator',
    transcript: cue.transcript,
  })),
}));
export const indexedBeats = beats.filter(scene => scene.indexed !== false);
export const introDuration = timeline.duration;

export function frameAt(elapsed: number) {
  const next = beats.findIndex(scene => scene.start > elapsed);
  const index = next < 0 ? beats.length - 1 : Math.max(0, next - 1);
  const scene = beats[index];
  const seconds = elapsed - scene.start;
  const cue = scene.narration.find(item => seconds >= item.start && seconds < item.end);
  return { index, scene, seconds, cue };
}

// H-hour to H+48 per Canon Handoff v2.4 and Opening 48 Hours v2.0 (CURRENT_CANON.md §4).
// The v2.0 demonstration timetable is superseded (decision D1).
export const schedule: { time: string; event: string; detail: string }[] = [
  { time: 'H−36 h', event: 'Unclaimed objects', detail: 'Staging carriers descend to release orbits. The space catalogue fills with objects no state claims; capitals query each other privately.' },
  { time: 'H−20 min', event: 'Orbital anomalies', detail: 'Tracking networks report mass re-entry commitments that fit no human launch pattern.' },
  { time: 'H+0', event: 'Notification and first strikes', detail: 'The public transmission and the opening operation begin at the same moment.' },
  { time: 'H+0–1 h', event: 'Global strategic suppression', detail: 'Strategic launch, integrated air defence, combat aviation, major naval and military-space functions cease to work as systems.' },
  { time: 'H+1–3 h', event: 'Authenticated contact', detail: 'A government sends a challenge; the signed reply arrives while a Warden performs an independently observable manoeuvre.' },
  { time: 'H+1–6 h', event: 'Bulk military dismantling', detail: 'The remaining exposed military inventory is serviced. Later hours become assessment and pursuit.' },
  { time: 'H+12', event: 'Interim terms', detail: 'No strategic launch or dispersal, no unauthorized military take-off, no armed naval sortie; grids, water, hospitals, food distribution and reactors stay staffed.' },
  { time: 'H+30', event: 'Movement categories', detail: 'Military movement is sorted into compliant, safety-authorized and hostile.' },
  { time: 'H+30–48', event: 'Airfield Qualification Protocol', detail: 'Governments and regional authorities begin nominating sites for Company logistics.' },
];
