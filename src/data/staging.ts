export const stagingShots = [
  {at:192, name:'Final staging', kind:'handover'},
  {at:198, name:'Earth orbital register', kind:'architecture'},
  {at:206, name:'From workshop to orbit', kind:'freight'},
  {at:213, name:'Transfer berth', kind:'dock'},
  {at:220, name:'Two relay domains', kind:'relay'},
  {at:227, name:'Asteroidal feedstock', kind:'rock'},
  {at:234, name:'Foundry Gamma · Final assembly', kind:'assembly'},
  {at:241, name:'Observatory · Comparison field', kind:'astronomers'},
  {at:250, name:'Surveillance · Unassigned tracks', kind:'surveillance'},
  {at:258, name:'Domesday · Survey fragments', kind:'ground'},
  {at:264, name:'Ninety days in review', kind:'countdown'},
  {at:273, name:'Demonstration reserved', kind:'assignment'},
  {at:280, name:'Demonstration record', kind:'record'},
  {at:287, name:'The completed apparatus', kind:'tableau'},
  {at:295, name:'The Notification', kind:'notice'},
] as const;
export type StagingKind = typeof stagingShots[number]['kind'];
export const stagingAt=(time:number)=>stagingShots.find((_,i)=>!stagingShots[i+1] || time<stagingShots[i+1].at)!;
export const reviewDays=(time:number)=>time<266?90:time<268.5?30:time<271?7:1;
export function stagedFraction(time:number) {
  if(time<264) return .12+.38*Math.max(0,(time-192)/72);
  return .5+.5*Math.min(1,(time-264)/8);
}
