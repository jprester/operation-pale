import { Bounds, OrbitControls, useBounds, useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { Box3, Group, PMREMGenerator, Vector3 } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { introAssets } from '../data/assets';
import { GlbModel, type ModelState } from '../models/GlbModel';
import { ProceduralCaravan } from '../models/ProceduralCaravan';
import './inspector.css';

type Reading = { state: ModelState; box: Box3; message?: string };
type Lighting = 'Studio' | 'Raking sunlight';

function Lights({ preset }: { preset: Lighting }) {
  const { scene, gl, invalidate } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const reflection = generator.fromScene(room);
    room.dispose();
    generator.dispose();
    scene.environment = reflection.texture;
    invalidate();
    return () => { scene.environment = null; reflection.dispose(); };
  }, [gl, scene, invalidate]);
  const studio = preset === 'Studio';
  return <>
    <hemisphereLight intensity={studio ? .9 : .12} color="#fffaf2" groundColor="#494849"/>
    <directionalLight intensity={studio ? 2 : 4} position={studio ? [4,7,5] : [-7,2,-3]}
      color={studio ? '#ffffff' : '#ffe3bb'}/>
  </>;
}

function Subject({ src, inspect }: { src: string | null; inspect: (reading: Reading) => void }) {
  const bounds = useBounds();
  const report = useCallback((state: ModelState, root: Group, message?: string) => {
    root.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(root, true);
    if (!box.isEmpty()) bounds.refresh(box).clip().fit();
    inspect({ state, box, message });
  }, [bounds, inspect]);
  return <GlbModel src={src} fallback={<ProceduralCaravan/>} onState={report}/>;
}

export default function ModelInspector() {
  const [file, setFile] = useState<{ name: string; url: string } | null>(null);
  const [reading, inspect] = useState<Reading | null>(null);
  const [lighting, setLighting] = useState<Lighting>('Studio');
  const [grid, setGrid] = useState(true);
  const [webgl] = useState(() => {
    const context = document.createElement('canvas').getContext('webgl2');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  });
  useEffect(() => () => {
    if (file) { useGLTF.clear(file.url); URL.revokeObjectURL(file.url); }
  }, [file]);
  const src = file?.url ?? introAssets.caravan.src;
  const box = reading?.box;
  const size = box?.getSize(new Vector3()) ?? new Vector3();
  const center = box?.getCenter(new Vector3()) ?? new Vector3();
  const floor = box && !box.isEmpty() ? box.min.y : -1;
  const span = Math.max(8, size.x, size.y, size.z);
  const step = 10 ** Math.floor(Math.log10(span / 5));
  const modelStatus = {
    procedural: 'Showing the procedural Caravan.',
    loading: 'Loading GLB · showing the procedural Caravan.',
    ready: 'Imported GLB ready.',
    error: 'GLB failed to load · showing the procedural Caravan.',
  };
  return <main className="model-inspector">
    <h1>Spacecraft model inspector</h1>
    <div className="inspection-tools">
      <label>Local GLB <input type="file" accept=".glb" onChange={event=>{
        const selected = event.currentTarget.files?.[0];
        if (selected) setFile({ name: selected.name, url: URL.createObjectURL(selected) });
        event.currentTarget.value = '';
      }}/></label>
      <button disabled={!file} onClick={()=>setFile(null)}>Use manifest</button>
      <label>Lighting <select value={lighting} onChange={event=>setLighting(event.target.value as Lighting)}>
        <option>Studio</option><option>Raking sunlight</option>
      </select></label>
      <label><input type="checkbox" checked={grid} onChange={event=>setGrid(event.target.checked)}/> Grid</label>
    </div>
    <p role="status">{file?.name ?? src ?? 'Caravan'} · {reading && modelStatus[reading.state]}</p>
    {reading?.message && <p className="model-error">{reading.message}</p>}
    <div className="inspection-view">
      {webgl ? <Canvas camera={{ position: [3,2.2,4], fov: 40 }} dpr={[1,1.5]} frameloop="demand">
        <color attach="background" args={['#1c201f']}/>
        <Lights preset={lighting}/>
        <OrbitControls makeDefault enableDamping={false}/>
        <Bounds fit clip observe margin={1.5} maxDuration={0}>
          <Subject src={src} inspect={inspect}/>
        </Bounds>
        {grid && <gridHelper position={[center.x, floor-.003, center.z]} args={[step*80,80,'#827860','#4b514c']}/>}
        <mesh position={[center.x + size.x/2 + .75, floor+.5, center.z]}>
          <boxGeometry args={[1,1,1]}/><meshStandardMaterial color="#c29562" roughness={.7}/>
        </mesh>
      </Canvas> : <p>This inspector requires WebGL 2.</p>}
    </div>
    <p>Drag to orbit · Scroll to zoom · Right-drag to pan</p>
    <p>Ochre cube 1 m · Grid spacing {step} m
      {reading?.state==='ready' && ' · XYZ bounds '+size.toArray().map(n=>Number(n.toPrecision(4))).join(' × ')+' m'}
      {reading && reading.state!=='ready' && ' · Procedural silhouette shown at illustrative scale'}
    </p>
  </main>;
}
