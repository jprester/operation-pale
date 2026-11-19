import type { MapScale } from './road';

export type Point = [number, number];
export const sun: Point = [260,148];
export const earth: Point = [222,145];
export const orbitPoint = ([x,y]: Point,r: number,a: number): Point => [x+r*Math.cos(a),y+.52*r*Math.sin(a)];
export const solarOrbits = [.39,.72,1,1.52,5.2].map(au=>au*43);
export const localOrbits = [42,195];
export const belt = Array.from({length:390},(_,i) =>
  orbitPoint(sun,43*(2.15+1.12*((i*193%397)/397)),i*2.39996));
type Site = { label: string; p: Point; offset: Point; from: number; type: 'world'|'industry'|'reserve'|'depot' };
const outer: Site[] = [
  {label:'Sun',p:sun,offset:[-16,24],from:0,type:'world'},
  {label:'Earth',p:orbitPoint(sun,43,2.4),offset:[-48,20],from:0,type:'world'},
  {label:'Mars',p:orbitPoint(sun,65.36,-1.25),offset:[9,0],from:0,type:'world'},
  {label:'Jupiter',p:orbitPoint(sun,223.6,.45),offset:[-2,24],from:0,type:'world'},
  {label:'Asteroid works',p:orbitPoint(sun,112,3.4),offset:[-86,-12],from:1,type:'industry'},
  {label:'Belt Reserve',p:orbitPoint(sun,129,1.5),offset:[10,16],from:2,type:'reserve'},
];
const inner: Site[] = [
  {label:'Earth',p:earth,offset:[-19,31],from:0,type:'world'},
  {label:'Moon',p:orbitPoint(earth,195,-.42),offset:[14,0],from:0,type:'world'},
  {label:'Alpha',p:[129,123],offset:[-49,-8],from:2,type:'industry'},
  {label:'Beta',p:[272,77],offset:[12,-7],from:4,type:'industry'},
  {label:'Gamma',p:[340,172],offset:[11,15],from:5.7,type:'industry'},
  {label:'Anchor depot',p:[172,208],offset:[-82,18],from:7,type:'depot'},
  {label:'Delta*',p:[369,223],offset:[14,5],from:8.4,type:'industry'},
];
export function atlasSites(scale: MapScale, month: number) {
  return (scale==='solar' ? outer : inner).filter(site=>month>=site.from);
}
export const freightLinks = [
  ['Alpha','Beta'],['Beta','Gamma'],['Alpha','Anchor depot'],['Anchor depot','Gamma'],['Gamma','Delta*']
];
