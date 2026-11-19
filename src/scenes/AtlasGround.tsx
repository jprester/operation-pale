import {Canvas} from '@react-three/fiber';
import {BufferGeometry,Float32BufferAttribute} from 'three';
import {useEffect,useMemo} from 'react';
import {belt, earth, localOrbits, orbitPoint, solarOrbits, sun, type Point} from '../data/atlas';
import type {MapScale} from '../data/road';

function geometry(points:Point[]) {
  return new BufferGeometry().setAttribute('position',new Float32BufferAttribute(points.flatMap(([x,y])=>[x-260,140-y,0]),3));
}
function Ground({scale}:{scale:MapScale}) {
  const orbits=useMemo(()=>{
    const vertices:Point[]=[];
    for(const r of scale==='solar'?solarOrbits:localOrbits) {
      for(let i=0;i<128;i++) for(const j of [i,i+1]) vertices.push(orbitPoint(scale==='solar'?sun:earth,r,j*Math.PI/64));
    }
    return geometry(vertices);
  },[scale]);
  const debris=useMemo(()=>geometry(belt),[]);
  useEffect(()=>()=>orbits.dispose(),[orbits]);
  useEffect(()=>()=>debris.dispose(),[debris]);
  return <><lineSegments geometry={orbits}><lineBasicMaterial color="#79715b"/></lineSegments>
    {scale==='solar' && <points geometry={debris}><pointsMaterial color="#a59c81" size={1.6} sizeAttenuation={false}/></points>}</>;
}
export default function AtlasGround({scale,onReady,onLost}:{scale:MapScale;onReady:()=>void;onLost:()=>void}) {
  return <Canvas orthographic frameloop="demand" dpr={[1,1.5]} camera={{manual:true,left:-260,right:260,top:140,bottom:-140,near:.1,far:20,position:[0,0,5]}}
    onCreated={({gl})=>{onReady();gl.domElement.addEventListener('webglcontextlost',onLost,{once:true});}}>
    <Ground scale={scale}/>
  </Canvas>;
}
