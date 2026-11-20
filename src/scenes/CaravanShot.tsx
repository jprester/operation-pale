import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { OrthographicCamera } from 'three';
import { introAssets } from '../data/assets';
import { GlbModel } from '../models/GlbModel';
import { ProceduralCaravan } from '../models/ProceduralCaravan';

export function CaravanShot({ seconds }: { seconds: number }) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    const lens = camera as OrthographicCamera;
    const close = seconds >= 13;
    const t = close ? (seconds - 13) / 12 : seconds / 13;
    const ease = t * t * (3 - 2 * t);
    // Metre-space move from the aft yoke toward a broadside of the open process bed.
    const azimuth = close ? .65 - .35 * ease : -1.05 + .66 * ease;
    lens.position.set(710 * Math.sin(azimuth), close ? 145 : 340 - 90 * ease, 710 * Math.cos(azimuth));
    lens.near = 1;
    lens.far = 1600;
    lens.lookAt(close ? 18 - 55 * ease : -15 + 22 * ease, 0, 0);
    lens.rotateZ(-.14);
    lens.zoom = Math.min(size.width / (close ? 410 + 30 * ease : 670 - 70 * ease), size.height / (close ? 220 : 310));
    lens.updateProjectionMatrix();
    invalidate();
  }, [camera, size, seconds, invalidate]);

  return <>
    <hemisphereLight args={['#fff4e1', '#768797', .82]}/>
    <directionalLight position={[-420,560,340]} intensity={2.8} color="#fff1d9"/>
    <directionalLight position={[170,240,-450]} intensity={1.9} color="#cadff1"/>
    <GlbModel src={introAssets.caravan.src}
      fallback={<group scale={155}><ProceduralCaravan/></group>}/>
  </>;
}
