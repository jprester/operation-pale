import { reviewDays } from './staging';
// Editorial pacing within the canonical nineteen-month interval.
const milestones = [[32,0],[68,1],[104,4],[155,10],[192,16],[295,19]];

export function preparationMonth(time: number) {
  for (let i=1; i<milestones.length; i++) {
    const [end, next] = milestones[i];
    if (time <= end) {
      const [start, previous] = milestones[i-1];
      return previous + Math.max(0,(time-start)/(end-start))*(next-previous);
    }
  }
  return 19;
}

export function chronology(time: number) {
  if (time < 32) return time < 10 ? 'Historical record · Scientific survey' : time < 19 ? 'Historical record · Assessment' : 'Historical record · Charter authorized';
  if (time >= 295) return 'T-0 · Public contact / 19 months since arrival';
  if (time >= 273) return 'T−1 day · Final preparations';
  if (time >= 264) return 'Ninety-day review · T−'+reviewDays(time)+' days';
  if (time >= 192) return time < 198 ? 'T−90 days · Final staging' : 'Final ninety days · Before public contact';
  const month = Math.floor(preparationMonth(time));
  return (time < 43 ? 'Arrival · ' : 'Preparation · ') + month + ' mo elapsed / ' + (19-month) + ' mo to T-0';
}

export type MapScale = 'solar' | 'local';
type Shot = { at: number; view: 'earth'|'carrier'|'alpha'|'beta'|'gamma'|'delta'|'map'|'photo'|'extraction'|'notice'|'staging'; name: string; scale?: MapScale };
const shots: Shot[] = [
  {at:0,view:'earth',name:'Survey record'},
  {at:32,view:'map',scale:'solar',name:'Outer-system arrival'},
  {at:43,view:'carrier',name:'Caravan · industrial carrier'},
  {at:68,view:'map',scale:'solar',name:'Resource branch'},
  {at:75,view:'extraction',name:'Resource body · Anchored works'},
  {at:84,view:'map',scale:'solar',name:'Belt Reserve'},
  {at:91,view:'alpha',name:'Volatiles to propellant'},
  {at:104,view:'map',scale:'local',name:'Cislunar workshops'},
  {at:116,view:'beta',name:'Feedstock to structure'},
  {at:127,view:'gamma',name:'Structure to assembly'},
  {at:139,view:'map',scale:'local',name:'Depot transfers'},
  {at:148,view:'delta',name:'Proposed exchange berths'},
  {at:155,view:'map',scale:'local',name:'Orbital infrastructure'},
  {at:174,view:'photo',name:'Catalogue review'},
  {at:184,view:'map',scale:'local',name:'Deployment record'},
  {at:192,view:'staging',name:'The machinery of conquest'},
  {at:295,view:'notice',name:'The Notification'},
];
export function shotAt(time: number) {
  return shots.find((_,i)=>!shots[i+1] || time < shots[i+1].at)!;
}
