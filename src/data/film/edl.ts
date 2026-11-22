import timeline from './timeline.json';

type Anchor = { at: string; offset?: number; phrase?: number; edge?: 'end' } | { sequence: string; at: number | 'end' };
export function resolveAnchor(anchor: Anchor): number {
  if ('sequence' in anchor) {
    const seq = timeline.sequences.find(seq => seq.id === anchor.sequence);
    if (!seq) throw Error('Unknown sequence: ' + anchor.sequence);
    return seq.start + (anchor.at === 'end' ? seq.duration : anchor.at);
  }
  const cue = timeline.cues.find(cue => cue.id === anchor.at);
  if (!cue) throw Error('Unknown picture cue: ' + anchor.at);
  // The recording sheet measures anchors to the millisecond.
  return Math.round(((anchor.edge === 'end' ? cue.end : anchor.phrase === undefined ? cue.start : cue.phrases[anchor.phrase].at) + (anchor.offset ?? 0)) * 1000) / 1000;
}

type Plate = 'hook' | 'resources' | 'road' | 'black' | 'title' | 'briefing' | 'observatory' | 'end' | 'delta' | 'city' | 'receiver';
type Cut = {
  plate: Plate;
  id: string; from: Anchor; sourceStart: number; sourceEnd: number;
  fit: 'stretch' | 'hold-end' | 'loop'; render: 'v3';
};

// Each cut ends at the next cut's anchor. Source in/out points are immutable
// positions in the original v3 animation, independent of the active film clock.
function v3(id: string, from: Anchor, sourceStart: number, sourceEnd: number, plate: Plate = 'road'): Cut {
  return { id, plate, from, sourceStart, sourceEnd, fit: 'hold-end', render: 'v3' };
}
const cuts = [
  v3('head-black', { sequence: 'h-hour', at: 0 }, 0, 1, 'black'),
  v3('orbital-register', { at: 'C0-01' }, 235, 242),
  v3('surveillance', { at: 'C0-02' }, 272, 280),
  v3('observatory', { at: 'C0-03' }, 214, 222, 'observatory'),
  v3('order', { at: 'C0-06' }, 0, 1, 'black'),
  v3('announcement', { at: 'C0-06a' }, 230, 238, 'briefing'),
  v3('public-channel', { at: 'C0-06a', phrase: 3 }, 230, 238, 'receiver'),
  v3('after-notice', { at: 'C0-08' }, 230, 238, 'briefing'),
  v3('city', { at: 'C0-11', phrase: 2 }, 0, 25, 'city'),
  v3('title', { sequence: 'title', at: 0 }, 0, 6, 'title'),
  v3('galaxy', { sequence: 'record', at: 0 }, 35, 49, 'hook'),
  v3('survey', { at: 'C1-02' }, 49, 62, 'hook'),
  v3('charter', { at: 'C1-03' }, 62, 66.5, 'hook'),
  v3('arrival', { sequence: 'manifest', at: 0 }, 67.5, 81.5, 'hook'),
  v3('carrier', { at: 'C2-02' }, 81.5, 94, 'hook'),
  v3('samples', { at: 'C2-05' }, 120, 126, 'resources'),
  v3('belt', { at: 'C2-06' }, 96.5, 108, 'resources'),
  v3('foundries', { sequence: 'foundries', at: 0 }, 161, 170),
  v3('alpha', { at: 'C3-02' }, 126, 138),
  v3('beta', { at: 'C3-03' }, 138, 149),
  v3('gamma', { at: 'C3-04' }, 149, 161),
  v3('delta', { at: 'C3-05' }, 170, 177, 'delta'),
  v3('network', { at: 'C3-06' }, 161, 170),
  v3('survey-map', { sequence: 'seen', at: 0 }, 161, 170),
  v3('catalogue', { at: 'C4-03' }, 196, 206),
  v3('astronomers', { at: 'C4-04' }, 263, 272),
  v3('finishing-bay', { sequence: 'staging', at: 0 }, 214, 220),
  v3('handoff', { at: 'C5-01', offset: 5 }, 220, 228),
  v3('warden', { at: 'C5-01', offset: 12 }, 242, 246),
  v3('relay', { at: 'C5-02' }, 246, 249),
  v3('airspace', { at: 'C5-03' }, 214, 222, 'observatory'),
  v3('ground', { at: 'C5-04' }, 280, 286),
  v3('records', { at: 'C5-05' }, 272, 280),
  v3('descent', { at: 'C5-06' }, 235, 242),
  v3('descent-black', { at: 'C5-06', edge: 'end' }, 0, 1, 'black'),
  v3('authenticated-contact', { sequence: 'h-zero', at: 0 }, 230, 238, 'briefing'),
  v3('warden-contact', { at: 'C6-02' }, 242, 246),
  v3('historian', { at: 'C6-03' }, 230, 238, 'briefing'),
  v3('end-card', { at: 'C6-04', edge: 'end', offset: 3 }, 0, 6, 'end'),
];

export const edl = cuts.map((cut, i) => {
  const start = resolveAnchor(cut.from);
  const end = i + 1 < cuts.length ? resolveAnchor(cuts[i + 1].from) : timeline.duration;
  if (end <= start || cut.sourceEnd <= cut.sourceStart || (i === 0 && start !== 0)) {
    throw Error('Invalid picture range: ' + cut.id);
  }
  return { ...cut, start, end, rate: cut.fit === 'stretch' ? (cut.sourceEnd - cut.sourceStart) / (end - start) : 1 };
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
