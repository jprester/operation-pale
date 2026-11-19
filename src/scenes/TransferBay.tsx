import { Canvas,useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { OrthographicCamera } from 'three';
import { GlbModel } from '../models/GlbModel';

function Berth({t}:{t:number}) {
  const {camera,size,invalidate}=useThree();
  useLayoutEffect(()=>{
    const lens=camera as OrthographicCamera;
    lens.position.set(16-6*t,17,40);lens.lookAt(-2,0,0);
    lens.zoom=Math.min(size.width/49,size.height/26);
    lens.updateProjectionMatrix();invalidate();
  },[t,camera,size,invalidate]);
  const release=Math.min(1,Math.max(0,(t-.48)/.52));
  const tugX=t<.48?-22+7*Math.sin(t/.48*Math.PI/2):-15-4*release*release;
  return <><hemisphereLight args={['#fff4dc','#7d8991',1.1]}/><directionalLight position={[-8,18,12]} intensity={3}/>
    {(['cradle','quiver','tug'] as const).map(name=><group key={name} position={[name==='tug'?tugX:name==='quiver'?-4*release*release:0,name==='cradle'?0:2*release,0]}>
      <GlbModel src={'/models/staging/'+name+'-v001.glb'} fallback={<mesh><boxGeometry args={name==='cradle'?[24,1,8]:name==='tug'?[6,4,5]:[16,5,5]}/><meshStandardMaterial color="#aca997"/></mesh>}/>
    </group>)}</>;
}
export default function TransferBay({t,onLost}:{t:number;onLost:()=>void}) {
  return <Canvas orthographic frameloop="demand" dpr={[1,1.4]} camera={{position:[16,17,40],near:.1,far:200}}
    onCreated={({gl})=>gl.domElement.addEventListener('webglcontextlost',onLost,{once:true})}><Berth t={t}/></Canvas>;
}
