export const stagingShots = [
  {at:214, name:'Gamma finishing bay', kind:'handover'},
  {at:220, name:'Tug handoff', kind:'architecture'},
  {at:228, name:'The transport passage', kind:'freight'},
  {at:235, name:'Earth orbital register', kind:'dock'},
  {at:242, name:'Two relay domains', kind:'relay'},
  {at:249, name:'Asteroidal feedstock', kind:'rock'},
  {at:256, name:'Foundry Gamma · Final assembly', kind:'assembly'},
  {at:263, name:'Observatory · Comparison field', kind:'astronomers'},
  {at:272, name:'Surveillance · Unassigned tracks', kind:'surveillance'},
  {at:280, name:'Domesday · Survey fragments', kind:'ground'},
  {at:286, name:'Ninety days in review', kind:'countdown'},
  {at:295, name:'Demonstration reserved', kind:'assignment'},
  {at:302, name:'Demonstration record', kind:'record'},
  {at:309, name:'The completed apparatus', kind:'tableau'},
  {at:317, name:'The Notification', kind:'notice'},
] as const;
export type StagingKind = typeof stagingShots[number]['kind'];
export const stagingAt=(time:number)=>stagingShots.find((_,i)=>!stagingShots[i+1] || time<stagingShots[i+1].at)!;
export const reviewDays=(time:number)=>time<288?90:time<290.5?30:time<293?7:1;
export function stagedFraction(time:number) {
  if(time<286) return .12+.38*Math.max(0,(time-214)/72);
  return .5+.5*Math.min(1,(time-286)/8);
}
