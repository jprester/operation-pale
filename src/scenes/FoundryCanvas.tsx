import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useLayoutEffect, useState } from 'react';
import { OrthographicCamera } from 'three';
import { branchSeconds, modelUrl, type FoundryBranch } from '../data/foundries';
import { FoundryOperation } from './IndustrialHardware';
import { GlbModel } from '../models/GlbModel';

function Massing({ branch }: { branch: FoundryBranch }) {
  const metal = '#797970';
  return <group>
    <mesh><boxGeometry args={[branch.key==='delta'?180:520,14,18]}/><meshStandardMaterial color={metal}/></mesh>
    {branch.key==='alpha' && [-114,0,114].flatMap(x=>[-60,60].map(z=>
      <mesh key={x+','+z} position={[x,6,z]}><sphereGeometry args={[42,16,12]}/><meshStandardMaterial color="#d3d0bd"/></mesh>))}
    {branch.key==='beta' && [-140,-48].map(x=><mesh key={x} position={[x,41,-42]}>
      <cylinderGeometry args={[22,32,90,16]}/><meshStandardMaterial color="#945b42"/></mesh>)}
    {branch.key==='gamma' && [-120,100].map(x=><group key={x} position-x={x}>
      {[-84,84].map(z=><mesh key={z} position={[0,45,z]}><boxGeometry args={[16,90,15]}/><meshStandardMaterial color={metal}/></mesh>)}
      <mesh position-y={95}><boxGeometry args={[22,19,180]}/><meshStandardMaterial color="#bbb5a3"/></mesh>
    </group>)}
    {branch.key==='delta' && [0,1,2].map(i=><group key={i} rotation-y={i*2*Math.PI/3}>
      <mesh position-x={125}><boxGeometry args={[250,20,25]}/><meshStandardMaterial color={metal}/></mesh>
      {[70,135,200].map(x=><mesh key={x} position={[x,15,0]}><boxGeometry args={[42,22,63]}/><meshStandardMaterial color="#d3d0bd"/></mesh>)}
    </group>)}
  </group>;
}

function CameraMove({ branch, seconds }: { branch: FoundryBranch; seconds: number }) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    const t = Math.min(1,Math.max(0,seconds/branchSeconds));
    const ease = t*t*(3-2*t);
    const bearing = branch.azimuth + .27*ease;
    const lens = camera as OrthographicCamera;
    lens.position.set(830*Math.sin(bearing),830*(branch.elevation-.08*ease),830*Math.cos(bearing));
    lens.lookAt(-15+28*ease,12,0);
    lens.rotateZ(-.045);
    lens.zoom = Math.min(size.width/(branch.width*(1-.085*ease)),size.height/(branch.key==='delta' ? 515 : 395));
    lens.updateProjectionMatrix();
    invalidate();
  }, [branch, seconds, camera, size, invalidate]);
  return null;
}

export default function FoundryCanvas({ branch, seconds, onDraw, onLost }: {
  branch: FoundryBranch; seconds: number; onDraw: (key: string) => void; onLost: () => void;
}) {
  const [supported] = useState(()=>{
    const gl=document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  });
  const report=useCallback(()=>onDraw(branch.key),[branch.key,onDraw]);
  if (!supported) return null;
  return <Canvas orthographic frameloop="demand" dpr={[1,1.4]} camera={{near:1,far:2200,position:[0,400,830]}}
    onCreated={({gl})=>gl.domElement.addEventListener('webglcontextlost',onLost,{once:true})}>
    <CameraMove branch={branch} seconds={seconds}/>
    <FoundryOperation branch={branch} seconds={seconds}/>

    <hemisphereLight args={['#fff6e5','#72859a',1.1]}/>
    <directionalLight position={[-450,620,420]} intensity={3} color="#fff0da"/>
    <directionalLight position={[160,380,-460]} intensity={2} color="#d3e4ff"/>
    <GlbModel src={modelUrl(branch)} fallback={<Massing branch={branch}/>} onState={report}/>
  </Canvas>;
}
