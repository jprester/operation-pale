import {useBounds} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {useCallback,useEffect} from 'react';
import {Box3,Group,PMREMGenerator} from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GlbModel,type ModelState} from './GlbModel';

export type Reading = { state: ModelState; box: Box3; message?: string };
export type Lighting = 'Studio' | 'Raking sunlight';

export function Lights({ preset }: { preset: Lighting }) {
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

export function Subject({ src, inspect, fallback }: { src: string | null; inspect: (reading: Reading) => void; fallback: React.ReactNode }) {
  const bounds = useBounds();
  const report = useCallback((state: ModelState, root: Group, message?: string) => {
    root.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(root, true);
    if (!box.isEmpty()) bounds.refresh(box).clip().fit();
    inspect({ state, box, message });
  }, [bounds, inspect]);
  return <GlbModel src={src} fallback={fallback} onState={report}/>;
}
