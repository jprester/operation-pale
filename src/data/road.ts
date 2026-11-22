import { reviewDays } from './staging';
// Editorial pacing within the canonical nineteen-month interval.
const milestones = [[67.5,0],[96.5,1],[126,4],[177,10],[214,16],[317,19]];

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
  if (time < 67.5) return 'Historical record · Charter authorized';
  if (time >= 317) return 'T-0 · Public contact / 19 months since arrival';
  if (time >= 295) return 'T−1 day · Final preparations';
  if (time >= 286) return 'Ninety-day review · T−'+reviewDays(time)+' days';
  if (time >= 214) return time < 220 ? 'T−90 days · Final staging' : 'Final ninety days · Before public contact';
  const month = Math.floor(preparationMonth(time));
  return (time < 78.5 ? 'Arrival · ' : 'Preparation · ') + month + ' mo elapsed / ' + (19-month) + ' mo to T-0';
}

export type MapScale = 'solar' | 'local';
type Shot = { at: number; view: 'earth'|'carrier'|'alpha'|'beta'|'gamma'|'delta'|'map'|'photo'|'extraction'|'notice'|'staging'; name: string; scale?: MapScale };
const shots: Shot[] = [
  {at:0,view:'earth',name:'Survey record'},
  {at:67.5,view:'map',scale:'solar',name:'Outer-system arrival'},
  {at:80.5,view:'carrier',name:'Caravan · industrial carrier'},
  {at:96.5,view:'map',scale:'solar',name:'Caravan cargo dispatch'},
  {at:111,view:'map',scale:'local',name:'Earth–Moon workshops'},
  {at:118.75,view:'extraction',name:'Asteroid cargo · Material survey'},
  {at:126,view:'alpha',name:'Volatiles to propellant'},
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
