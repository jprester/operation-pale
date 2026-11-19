import { useMemo } from 'react';
import { BoxGeometry, CylinderGeometry, Color, Float32BufferAttribute, Quaternion, Vector3, type BufferGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { FoundryBranch } from '../data/foundries';

type XYZ = [number,number,number];
const chalk='#d5d0bb', graphite='#484b49', metal='#939b97', ochre='#ac8057';
const vertex=(xyz:XYZ)=>new Vector3(...xyz);

// Bake each rigid assembly into one vertex-coloured mesh.
class Assembly {
  parts:BufferGeometry[]=[];
  add(geometry:BufferGeometry, color:string, at:XYZ) {
    const part=geometry.toNonIndexed();
    geometry.dispose();
    const tint=new Color(color);
    const rgb=Array.from({length:part.attributes.position.count},()=>[tint.r,tint.g,tint.b]).flat();
    part.setAttribute('color',new Float32BufferAttribute(rgb,3));
    part.translate(...at);
    this.parts.push(part);
  }
  box(at:XYZ,size:XYZ,color=chalk) { this.add(new BoxGeometry(...size),color,at); }
  beam(a:XYZ,b:XYZ,r:number,color=metal) {
    const direction=vertex(b).sub(vertex(a));
    const tube=new CylinderGeometry(r,r,direction.length(),8);
    tube.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),direction.normalize()));
    this.add(tube,color,[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2]);
  }
  finish() {
    const geometry=mergeGeometries(this.parts)!;
    this.parts.forEach(part=>part.dispose());
    return geometry;
  }
}
function build(kind:HardwareKind) {
  const m=new Assembly();
  if(kind==='extraction') {
    for(const x of [-1.15,.98]) for(const z of [-.36,.36]) {
      m.beam([x*1.1,.26,z*1.4],[x,1.29,z],.072,graphite);
      m.beam([-x,.42,z],[x,1.27,z],.046,metal);
      m.box([x*1.1,.57,z*1.4],[.32,.3,.31],ochre);
    }
    m.box([0,1.24,0],[2.65,.16,.86],graphite);
    for(const z of [-.29,.29]) m.beam([-1.28,1.4,z],[1.28,1.4,z],.055);
    m.add(new CylinderGeometry(.32,.17,.46,12,1,true),metal,[1,1.62,0]);
    for(const z of [-.22,.22]) m.beam([-.98,1.3,z],[-.98,1.95,z],.038);
    m.box([-.98,1.94,0],[.39,.14,.55],chalk);
    m.beam([-.98,.49,0],[-.98,1.92,0],.09,ochre);
    m.add(new CylinderGeometry(.29,.16,.42,12,1,true).scale(-1,1,1),graphite,[1,1.62,0]);
    for(const x of [-.86,-.45,0,.45,.86])m.box([x,1.34,0],[.06,.05,.7],ochre);
    for(const z of [-.51,.51])m.beam([-1.19,1.19,z],[1.21,1.19,z],.027,metal);
    for(const x of [.4,.78,1.16])m.beam([x,1.13,.47],[x,1.13,.87],.14,chalk);
  } else if(kind==='bay') {
    for(const y of [0,19]) for(const z of [-12,12]) m.beam([-31,y,z],[31,y,z],2.3);
    for(const x of [-31,0,31]) {
      for(const z of [-12,12])m.beam([x,0,z],[x,19,z],1.8,graphite);
      m.beam([x,19,-12],[x,19,12],2,chalk);
    }
    for(const z of [-12,12]) {
      m.beam([-31,0,z],[0,19,z],1.6,ochre);m.beam([0,19,z],[31,0,z],1.6,ochre);
    }
  } else if(kind==='tanker') {
    m.box([0,0,0],[56,8,20],graphite);
    m.beam([-20,12,0],[20,12,0],10,chalk);
    for(const x of [-13,13]) m.beam([x,12,0],[x+2.5,12,0],11,metal);
    m.box([24,9,0],[10,14,20],ochre);
  } else if(kind==='rail') {
    for(const z of [-10,10])m.beam([-112,0,z],[112,0,z],2.3);
    for(const x of [-100,0,100])m.box([x,-5,0],[8,10,28],graphite);
  } else {
    m.box([0,0,0],[47,6,27],graphite);
    m.box([0,9,0],[42,14,22],chalk);
    for(const x of [-14,14])m.box([x,9,0],[3,16,24],ochre);
  }
  return m.finish();
}
type HardwareKind='extraction'|'bay'|'tanker'|'pallet'|'rail';
export function Hardware({kind}:{kind:HardwareKind}) {
  const geometry=useMemo(()=>build(kind),[kind]);
  return <mesh geometry={geometry}><meshStandardMaterial vertexColors roughness={.7} metalness={.32}/></mesh>;
}
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export function FoundryOperation({branch,seconds}:{branch:FoundryBranch;seconds:number}) {
  switch(branch.key) {
    case 'alpha': return <group position={[178-138*ease(seconds/12),49,118]}><Hardware kind="tanker"/></group>;
    case 'beta': return <group position={[18,42,83]}><Hardware kind="rail"/>
      <group position={[-80+160*ease(seconds/10),4,0]}><Hardware kind="bay"/></group></group>;
    case 'gamma': return <group position={[-57,48,0]}>
      {[0,1,2].map(i=><group key={i} position={[i*62,i===0?0:82*(1-ease((seconds-(i-1)*5)/5)),0]}><Hardware kind="bay"/></group>)}</group>;
    case 'delta': return <group position={[181-55*ease(seconds/6),50-31*ease(seconds/6),0]}><Hardware kind="pallet"/></group>;
  }
}
