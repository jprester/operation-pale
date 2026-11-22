import timeline from './timeline.json';

type Anchor = { at: string; offset?: number } | { sequence: string; at: number | 'end' };
export function resolveAnchor(anchor: Anchor): number {
  if ('sequence' in anchor) {
    const seq = timeline.sequences.find(seq => seq.id === anchor.sequence);
    if (!seq) throw Error('Unknown sequence: ' + anchor.sequence);
    return seq.start + (anchor.at === 'end' ? seq.duration : anchor.at);
  }
  const cue = timeline.cues.find(cue => cue.id === anchor.at);
  if (!cue) throw Error('Unknown picture cue: ' + anchor.at);
  // The recording sheet measures anchors to the millisecond.
  return Math.round((cue.start + (anchor.offset ?? 0)) * 1000) / 1000;
}

type Plate = 'hook' | 'resources' | 'road';
type Cut = {
  plate: Plate;
  id: string; from: Anchor; sourceStart: number; sourceEnd: number;
  fit: 'stretch' | 'hold-end' | 'loop'; render: 'v3';
};

// Each cut ends at the next cut's anchor. Source in/out points are immutable
// positions in the original v3 animation, independent of the active film clock.
function v3(id: string, from: Anchor, sourceStart: number, sourceEnd: number, plate: Plate = 'road'): Cut {
  return { id, plate, from, sourceStart, sourceEnd, fit: 'stretch', render: 'v3' };
}
const cuts = [
  v3('opening', { sequence: 'discovery', at: 0 }, 0, 29.5, 'hook'),
  v3('survey', { at: 'hook-07', offset: -2.91 }, 29.5, 67.5, 'hook'),
  v3('expedition', { sequence: 'expedition', at: 0 }, 67.5, 96.5, 'hook'),
  v3('dispatch', { sequence: 'resources', at: 0 }, 96.5, 118.75, 'resources'),
  v3('specimens', { at: 'resources-03', offset: 3.25 }, 118.75, 126, 'resources'),
  v3('alpha', { sequence: 'industry', at: 0 }, 126, 138),
  v3('beta', { at: 'industrial-build-up-02' }, 138, 149),
  v3('gamma', { at: 'industrial-build-up-03', offset: -.3 }, 149, 161),
  v3('depots', { at: 'industrial-build-up-04', offset: -1 }, 161, 170),
  v3('delta', { at: 'industrial-build-up-05' }, 170, 177),
  v3('infrastructure', { sequence: 'infrastructure', at: 0 }, 177, 214),
  v3('finishing-bay', { at: 'final-staging-01' }, 214, 220),
  v3('handoff', { at: 'final-staging-02' }, 220, 228),
  v3('transit', { at: 'final-staging-03' }, 228, 235),
  v3('orbital-register', { at: 'final-staging-04' }, 235, 242),
  v3('relay', { at: 'final-staging-05' }, 242, 249),
  v3('feedstock', { at: 'final-staging-06' }, 249, 256),
  v3('final-assembly', { at: 'final-staging-07' }, 256, 263),
  v3('observatory', { at: 'final-staging-08' }, 263, 272),
  v3('surveillance', { at: 'final-staging-09' }, 272, 280),
  v3('ground', { at: 'final-staging-10' }, 280, 286),
  v3('countdown', { at: 'final-staging-11', offset: -1 }, 286, 295),
  v3('assignment', { at: 'final-staging-12' }, 295, 302),
  v3('record', { at: 'final-staging-13' }, 302, 309),
  v3('tableau', { at: 'final-staging-14' }, 309, 317),
  v3('notification', { sequence: 'notification', at: 0 }, 317, 331),
];

export const edl = cuts.map((cut, i) => {
  const start = resolveAnchor(cut.from);
  const end = i + 1 < cuts.length ? resolveAnchor(cuts[i + 1].from) : timeline.duration;
  if (end <= start || cut.sourceEnd <= cut.sourceStart || (i === 0 && start !== 0)) {
    throw Error('Invalid picture range: ' + cut.id);
  }
  return { ...cut, start, end, rate: (cut.sourceEnd - cut.sourceStart) / (end - start) };
});

export function pictureAt(time: number) {
  const filmTime = Math.max(0, Math.min(timeline.duration, time));
  const cut = edl.find(cut => filmTime < cut.end) ?? edl[edl.length - 1];
  const delta = filmTime - cut.start;
  const span = cut.sourceEnd - cut.sourceStart;
  let sourceTime: number;
  switch (cut.fit) {
    case 'loop': sourceTime = cut.sourceStart + delta % span; break;
    case 'hold-end': sourceTime = cut.sourceStart + Math.min(delta, span - Math.min(.000001, span)); break;
    case 'stretch': sourceTime = cut.rate === 1
      ? filmTime + (cut.sourceStart - cut.start)
      : cut.sourceStart + delta * cut.rate;
  }
  return { cut, sourceTime };
}
