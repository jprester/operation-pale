// A null source reserves an editorial asset slot without issuing a request.
type Asset = {
  kind: 'model' | 'texture' | 'image' | 'audio' | 'video';
  src: string | null;
  fallback: string;
};
export const introAssets = {
  earthSurface: { kind: 'texture', src: '/art/surface.webp', fallback: 'earthPoster' },
  earthClouds: { kind: 'texture', src: '/art/earth-clouds.webp', fallback: 'earthPoster' },
  earthLights: { kind: 'texture', src: '/art/earth-lights.webp', fallback: 'earthPoster' },
  earthPoster: { kind: 'image', src: '/art/earth.webp', fallback: 'shaded CSS sphere' },
  moon: { kind: 'image', src: '/art/moon.webp', fallback: 'shaded lunar limb' },
  stars: { kind: 'image', src: '/art/stars.png', fallback: 'hero sky gradient' },
  caravanPoster: { kind: 'image', src: '/art/caravan-v002.webp', fallback: 'carrier line drawing' },
  caravan: { kind: 'model', src: '/models/spacecraft/caravan-v002.glb', fallback: 'ProceduralCaravan' },
  broadcast: { kind: 'video', src: null, fallback: 'HTML emergency receiver' },
} satisfies Record<string, Asset>;
