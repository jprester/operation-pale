// Camera bearings and framing are editorial choices for the proposed reconstructions.
export const foundryBranches = [
  { key: 'alpha', name: 'Foundry Alpha', role: 'Water storage & propellant production', azimuth: -.48, elevation: .54, width: 690 },
  { key: 'beta', name: 'Foundry Beta', role: 'Metals refining & bulk fabrication', azimuth: .53, elevation: .48, width: 685 },
  { key: 'gamma', name: 'Foundry Gamma', role: 'Assembly & integration', azimuth: -.83, elevation: .55, width: 680 },
  { key: 'delta', name: 'Foundry Delta', role: 'Cargo exchange · provisional role', azimuth: -.08, elevation: 1.17, width: 730 },
] as const;
export type FoundryBranch = typeof foundryBranches[number];
export const branchSeconds = 45 / foundryBranches.length;
export function foundryCut(seconds: number) {
  const index = Math.min(foundryBranches.length - 1, Math.floor(seconds/branchSeconds));
  return { index, branch: foundryBranches[index], localSeconds: seconds-index*branchSeconds };
}
export const modelUrl = (branch: FoundryBranch) => `/models/foundries/foundry-${branch.key}-v001.glb`;
export const posterUrl = (branch: FoundryBranch) => `/art/foundry-${branch.key}-v001.webp`;
