import {Canvas,useThree} from '@react-three/fiber';
import {useLayoutEffect,useMemo} from 'react';
import {Color,Float32BufferAttribute,IcosahedronGeometry,OrthographicCamera} from 'three';
import {Hardware} from './IndustrialHardware';

function Worksite({seconds}:{seconds:number}) {
  const {camera,size,invalidate}=useThree();
  const t=Math.min(1,seconds/9);
  useLayoutEffect(()=>{
    const lens=camera as OrthographicCamera;
    lens.position.set(3.4-t,2.8+t*.25,5);lens.lookAt(0,.32,0);
    lens.zoom=Math.min(size.width/(6.2-.5*t),size.height/3.65);
    lens.updateProjectionMatrix();invalidate();
  },[t,camera,size,invalidate]);
  const rock=useMemo(()=>{
    const g=new IcosahedronGeometry(1,11),pos=g.attributes.position,colors=[];
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
      const f=1+.13*Math.sin(5*x+4*z)*Math.cos(y*7)+.045*Math.cos(x*13-y*8+z*9)+.016*Math.sin(35*x+13*y)*Math.cos(28*z);
      pos.setXYZ(i,2.28*x*f,y*f,1.25*z*f);
      const c=new Color('#726b5d').multiplyScalar(.8+.2*(1+Math.cos(23*x+11*z+17*y)));
      colors.push(c.r,c.g,c.b);
    }
    g.setAttribute('color',new Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
  },[]);
  return <><hemisphereLight args={['#b6c6cf','#51473b',.9]}/>
    <directionalLight position={[-4,5,2]} color="#ffefd7" intensity={2.7}/>
    <mesh geometry={rock}><meshStandardMaterial vertexColors flatShading roughness={.98}/></mesh>
    <Hardware kind="extraction"/>
    <group position={[-.74+1.47*t*t*(3-2*t),1.46,0]} scale={.013}><Hardware kind="pallet"/></group></>;
}
export default function Extraction({seconds,onLost,onReady}:{seconds:number;onLost:()=>void;onReady:()=>void}) {
  return <Canvas orthographic frameloop="demand" camera={{position:[3,3,5],near:.1,far:30}} dpr={[1,1.4]}
    onCreated={({gl})=>{onReady();gl.domElement.addEventListener('webglcontextlost',onLost,{once:true});}}>
    <Worksite seconds={seconds}/></Canvas>;
}
