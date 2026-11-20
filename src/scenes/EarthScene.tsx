import { CaravanShot } from './CaravanShot';
import { introAssets } from '../data/assets';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useState } from 'react';
import { BackSide, OrthographicCamera, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector3 } from 'three';

// A distant Sun, fixed in world space as both Earth and camera move.
const sunDirection = new Vector3(-.89, .38, .32).normalize();
const earthVertex = `
  varying vec2 coords;
  varying vec3 worldNormal;
  varying vec3 viewNormal;
  void main() {
    coords = uv;
    worldNormal = mat3(modelMatrix) * normal;
    viewNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;
const earthLighting = `
  uniform vec3 sunDirection;
  varying vec2 coords;
  varying vec3 worldNormal;
  varying vec3 viewNormal;
`;
const surfaceFragment = earthLighting + `
  uniform sampler2D surface;
  uniform sampler2D lights;
  void main() {
    float incidence = dot(normalize(worldNormal), sunDirection);
    float daylight = max(incidence, 0.);
    float darkness = 1. - smoothstep(-.20, .06, incidence);
    vec3 albedo = texture2D(surface, coords).rgb;
    vec3 radiance = albedo * (.011 + 1.15 * daylight);
    float cities = texture2D(lights, coords).r;
    radiance += vec3(.93, .59, .31) * pow(cities, 1.28) * darkness * .78;
    float grazing = 1. - clamp(normalize(viewNormal).z, 0., 1.);
    float haze = pow(grazing, 3.4) * smoothstep(-.18, .72, incidence);
    radiance += vec3(.12, .25, .43) * haze;
    gl_FragColor = vec4(radiance, 1.);
    #include <colorspace_fragment>
  }
`;
const cloudFragment = earthLighting + `
  uniform sampler2D coverage;
  void main() {
    float incidence = dot(normalize(worldNormal), sunDirection);
    float opacity = smoothstep(.035, .94, texture2D(coverage, coords).r);
    vec3 cloud = vec3(.91, .95, 1.) * (.007 + max(incidence, 0.));
    gl_FragColor = vec4(cloud, opacity * .93);
    #include <colorspace_fragment>
  }
`;
const atmosphereFragment = earthLighting + `
  void main() {
    // The ground occludes the back of this thin shell. Optical depth tapers
    // to zero at the outside edge of its silhouette.
    float column = smoothstep(0., .145, abs(normalize(viewNormal).z));
    float sunlight = smoothstep(-.18, .65, dot(normalize(worldNormal), sunDirection));
    gl_FragColor = vec4(.22, .44, .72, column * sunlight * .55);
    #include <colorspace_fragment>
  }
`;

export function Planet({ seconds }: { seconds: number }) {
  const [surface, coverage, lights] = useLoader(TextureLoader, [
    introAssets.earthSurface.src, introAssets.earthClouds.src, introAssets.earthLights.src,
  ]);
  const materials = useMemo(() => {
    surface.colorSpace = SRGBColorSpace;
    for (const map of [surface, coverage, lights]) {
      map.wrapS = RepeatWrapping;
      map.needsUpdate = true;
    }
    const sun = { value: sunDirection };
    return {
      surface: { surface: { value: surface }, lights: { value: lights }, sunDirection: sun },
      clouds: { coverage: { value: coverage }, sunDirection: sun },
      air: { sunDirection: sun },
    };
  }, [surface, coverage, lights]);
  const longitude = -2.07 + seconds * .032;
  return <group rotation={[.26, 0, -.09, 'ZXY']}>
    <mesh rotation-y={longitude}>
      <sphereGeometry args={[1, 72, 48]}/>
      <shaderMaterial uniforms={materials.surface} vertexShader={earthVertex} fragmentShader={surfaceFragment}/>
    </mesh>
    <mesh rotation-y={longitude + seconds * .00065} renderOrder={2}>
      <sphereGeometry args={[1.002, 72, 48]}/>
      <shaderMaterial transparent depthWrite={false} uniforms={materials.clouds}
        vertexShader={earthVertex} fragmentShader={cloudFragment}/>
    </mesh>
    <mesh renderOrder={1}>
      <sphereGeometry args={[1.012, 72, 48]}/>
      <shaderMaterial transparent depthWrite={false} side={BackSide} uniforms={materials.air}
        vertexShader={earthVertex} fragmentShader={atmosphereFragment}/>
    </mesh>
  </group>;
}

type ShotProps = { carrier: boolean; seconds: number };

function EarthShot({ seconds }: { seconds: number }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const lens = camera as OrthographicCamera;
    const progress = seconds / 25;
    lens.zoom = Math.min(size.width, size.height) * (.44 + .065*progress);
    lens.position.set(.14 * Math.sin(progress * 1.4), .12 * progress, 5);
    lens.lookAt(0, 0, 0);
    lens.updateProjectionMatrix();
  }, [camera, size, seconds]);
  return <Planet seconds={seconds}/>;
}

export default function EarthScene(props: ShotProps & { onReady: () => void; onLost: () => void }) {
  const [supported] = useState(() => {
    const context = document.createElement('canvas').getContext('webgl2');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  });
  if (!supported) return null;
  return <Canvas orthographic resize={{offsetSize:true}} camera={{ position: [0,0,5], far: 20 }} frameloop="demand"
    dpr={[1, 1.4]} gl={{ alpha: true, antialias: true }} fallback={null}
    onCreated={({ gl }) => {
      props.onReady();
      gl.domElement.addEventListener('webglcontextlost', props.onLost, { once: true });
    }}>
    {props.carrier ? <CaravanShot seconds={props.seconds}/> : <EarthShot seconds={props.seconds}/>}
  </Canvas>;
}
