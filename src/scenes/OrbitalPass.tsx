import {Canvas,useThree} from '@react-three/fiber';
import {Suspense,useLayoutEffect,useMemo} from 'react';
import {BufferGeometry,Float32BufferAttribute,OrthographicCamera,Vector3} from 'three';
import {Clone,useGLTF} from '@react-three/drei';
import {Planet} from './EarthScene';

const glide=(t:number,a:number,b:number)=>{
  const p=Math.max(0,Math.min(1,(t-a)/(b-a)));
  return p*p*(3-2*p);
};
const earth=new Vector3(0,-1040,-245);
const globeRadius=960;

function Model({name}:{name:string}) {
  const src=name==='gamma'?'/models/foundries/foundry-gamma-v001.glb':'/models/staging/'+name+'-v001.glb';
  const {scene}=useGLTF(src,false);
  return <Clone object={scene} dispose={null}/>;
}

// Each point stands for a unit. The film compresses travel and exaggerates
// orbital spacing. Depth testing hides the far side behind the physical globe.
function OrbitalField({time,reveal}:{time:number;reveal:number}) {
  const geometry=useMemo(()=>{
    const positions:number[]=[],colors:number[]=[];
    for(let unit=0;unit<64;unit++)for(let band=0;band<12;band++){
      const angle=(unit+band*.397)*Math.PI/32;
      const tilt=.28+band*.203, node=band*.91;
      const r=globeRadius*(1.10+.018*(band%5));
      const x=r*Math.cos(angle),z=r*Math.sin(angle)*Math.cos(tilt);
      positions.push(x*Math.cos(node)-z*Math.sin(node),r*Math.sin(angle)*Math.sin(tilt),z*Math.cos(node)+x*Math.sin(node));
      colors.push(...(band%4===0?[.77,.65,.43]:[.46,.67,.72]));
    }
    return new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3)).setAttribute('color',new Float32BufferAttribute(colors,3));
  },[]);
  const symbols=useMemo(()=>{
    const vertices:number[]=[],colors:number[]=[];
    // Open diamonds denote command, crossbars denote freight, and short
    // green strokes sit against the globe for atmospheric relays.
    for(const [count,radius,type] of [[9,1.29,0],[8,1.22,1],[24,1.015,2]]){
      for(let i=0;i<count;i++){
        const a=i*2.39996+type, y=1-2*(i+.5)/count, h=Math.sqrt(1-y*y);
        const p=new Vector3(h*Math.cos(a),y,h*Math.sin(a)).multiplyScalar(globeRadius*radius);
        const strokes=type===0?[[-15,0,0,18],[0,18,15,0],[15,0,0,-18],[0,-18,-15,0]]:
          type===1?[[-14,0,14,0],[0,-7,0,7]]:[[-8,0,8,0]];
        for(const [x1,y1,x2,y2] of strokes) {
          vertices.push(p.x+x1,p.y+y1,p.z,p.x+x2,p.y+y2,p.z);
          const color=type===0?[1,.79,.48]:type===1?[.85,.77,.66]:[.56,.85,.62];
          colors.push(...color,...color);
        }
      }
    }
    return new BufferGeometry().setAttribute('position',new Float32BufferAttribute(vertices,3)).setAttribute('color',new Float32BufferAttribute(colors,3));
  },[]);
  return <group position={earth} rotation-y={.18+(time-214)*.002}><points geometry={geometry}>
    <pointsMaterial vertexColors size={2.35} sizeAttenuation={false} transparent opacity={reveal*.90} depthWrite={false}/>
  </points><lineSegments geometry={symbols}><lineBasicMaterial vertexColors transparent opacity={reveal} depthWrite={false}/></lineSegments></group>;
}

function Shot({time}:{time:number}){
  const {camera,size,invalidate}=useThree();
  const warden=time>=242 && time<246,lantern=time>=246 && time<249,wide=time>=309;
  const move=glide(time,222,234),pull=wide?1:glide(time,233,241);
  const satellite=warden||lantern;
  // Local frame follows the freight. An editorial scale change then resolves
  // that freight into a single highlighted mark in the Earth-centred register.
  useLayoutEffect(()=>{
    const lens=camera as OrthographicCamera;
    const establish=glide(time,214,220);
    const closeWidth=200*Math.pow(42/200,establish);
    const width=satellite?(warden?68:62):closeWidth*Math.pow(3380/closeWidth,pull);
    const aim=(width-closeWidth)/(3380-closeWidth);
    const target=satellite?new Vector3():earth.clone().multiplyScalar(aim);
    const bearing=satellite?.62-((time-22)%4)*.06:1.18-1.10*pull-.30*move;
    lens.position.copy(target).add(new Vector3(bearing,.55-.48*pull,1).normalize().multiplyScalar(4400));
    lens.lookAt(target);lens.zoom=Math.min(size.width/width,size.height/(width*(satellite ? .61 : .61+.085*pull)));
    lens.updateProjectionMatrix();invalidate();
  },[time,move,pull,satellite,warden,camera,size,invalidate]);
  const orbitVisible=wide||time>=225;
  return <>
    <hemisphereLight args={['#f7efdc','#8194a2',.95]}/><directionalLight position={[-6,9,6]} intensity={3}/>
    <directionalLight position={[5,2,-7]} color="#a0c4ed" intensity={1.3}/>
    {orbitVisible && <group position={satellite?(lantern?[0,-114,-45]:[4,-52,-70]):[0,earth.y-600*(1-glide(time,225,231)),earth.z]} scale={satellite?(lantern?112:38):globeRadius}>
      <Planet seconds={22+(time-214)*.14}/>
    </group>}
    {!satellite && <>
      {time<233 && <group position={[-191-move*510,-35-move*62,-move*155]}><Model name="gamma"/></group>}
      {!wide && <group>
        <Model name="quiver"/>
        <mesh position={[1,3.25+8*(1-glide(time,215,220)),0]}><boxGeometry args={[8,.5,4.4]}/><meshStandardMaterial color="#c2ab81" metalness={.4} roughness={.7}/></mesh>
        <group rotation-y={Math.PI} position={[27-13.1*glide(time,219,224)+19*glide(time,232,237),0,0]}><Model name="tug"/></group>
      </group>}
      {orbitVisible && <OrbitalField time={time} reveal={pull}/>}
      {pull>.1 && <mesh scale={2+pull*12}><ringGeometry args={[1,1.15,32]}/><meshBasicMaterial color="#ffc889"/></mesh>}
    </>}
    {satellite && <group rotation={[warden?.50:.24,warden?-.65:-.32,warden?.04:-.15]}><Model name={warden?'warden':'lantern'}/></group>}
  </>;
}
function Ready({report}:{report:(ready:boolean)=>void}) {
  useLayoutEffect(()=>{report(true);return ()=>report(false);},[report]);
  return null;
}
export default function OrbitalPass({time,onLost,onReady}:{time:number;onLost:()=>void;onReady:(ready:boolean)=>void}) {
  return <Canvas orthographic frameloop="demand" dpr={[1,1.4]} camera={{near:.1,far:9000,position:[0,0,4400]}}
    onCreated={({gl})=>gl.domElement.addEventListener('webglcontextlost',onLost,{once:true})}>
    <Suspense fallback={null}><Shot time={time}/><Ready report={onReady}/></Suspense>
  </Canvas>;
}
