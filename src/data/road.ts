import { reviewDays } from './staging';
// Editorial pacing within the canonical nineteen-month interval.
const milestones = [[65,0],[90,1],[126,4],[177,10],[214,16],[317,19]];

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
  if (time < 31) return 'Earth · Human record';
  if (time < 50) return 'Historical record · Galactic context';
  if (time < 60) return 'Historical record · Scientific survey';
  if (time < 65) return 'Historical record · Charter authorized';
  if (time >= 317) return 'T-0 · Public contact / 19 months since arrival';
  if (time >= 295) return 'T−1 day · Final preparations';
  if (time >= 286) return 'Ninety-day review · T−'+reviewDays(time)+' days';
  if (time >= 214) return time < 220 ? 'T−90 days · Final staging' : 'Final ninety days · Before public contact';
  const month = Math.floor(preparationMonth(time));
  return (time < 76 ? 'Arrival · ' : 'Preparation · ') + month + ' mo elapsed / ' + (19-month) + ' mo to T-0';
}

export type MapScale = 'solar' | 'local';
type Shot = { at: number; view: 'earth'|'carrier'|'alpha'|'beta'|'gamma'|'delta'|'map'|'photo'|'extraction'|'notice'|'staging'; name: string; scale?: MapScale };
const shots: Shot[] = [
  {at:0,view:'earth',name:'Survey record'},
  {at:65,view:'map',scale:'solar',name:'Outer-system arrival'},
  {at:78,view:'carrier',name:'Caravan · industrial carrier'},
  {at:90,view:'map',scale:'solar',name:'Resource branch'},
  {at:97,view:'extraction',name:'Resource body · Anchored works'},
  {at:106,view:'map',scale:'solar',name:'Belt Reserve'},
  {at:113,view:'alpha',name:'Volatiles to propellant'},
  {at:126,view:'map',scale:'local',name:'Cislunar workshops'},
  {at:138,view:'beta',name:'Feedstock to structure'},
  {at:149,view:'gamma',name:'Structure to assembly'},
  {at:161,view:'map',scale:'local',name:'Depot transfers'},
  {at:170,view:'delta',name:'Proposed exchange berths'},
  {at:177,view:'map',scale:'local',name:'Orbital infrastructure'},
  {at:196,view:'photo',name:'Catalogue review'},
  {at:206,view:'map',scale:'local',name:'Deployment record'},
  {at:214,view:'staging',name:'The machinery of conquest'},
  {at:317,view:'notice',name:'The Notification'},
];
export function shotAt(time: number) {
  return shots.find((_,i)=>!shots[i+1] || time < shots[i+1].at)!;
}
