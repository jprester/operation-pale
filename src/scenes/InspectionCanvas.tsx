import {Bounds,OrbitControls} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import {useCallback} from 'react';
import {Subject,Lights,type Reading} from '../models/InspectionSubject';

export default function InspectionCanvas({src,onLost}:{src:string;onLost:()=>void}) {
  const inspect=useCallback((result:Reading)=>{if(result.state==='error')onLost();},[onLost]);
  return <Canvas frameloop="demand" dpr={[1,1.4]} camera={{position:[3,2,4],fov:38}}
    onCreated={({gl})=>gl.domElement.addEventListener('webglcontextlost',onLost,{once:true})}>
    <Lights preset="Studio"/><OrbitControls makeDefault enableDamping={false}/>
    <Bounds fit clip observe margin={1.25} maxDuration={0}><Subject src={src} inspect={inspect} fallback={null}/></Bounds>
  </Canvas>;
}
