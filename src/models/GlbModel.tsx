import { Clone, useGLTF } from '@react-three/drei';
import { Component, Suspense, useLayoutEffect, useRef, type ReactNode } from 'react';
import type { Group } from 'three';

export type ModelState = 'procedural' | 'loading' | 'ready' | 'error';
type Report = (state: ModelState, root: Group, message?: string) => void;
type Props = { src: string | null; fallback: ReactNode; onState?: Report };

function ModelRoot({ state, report, message, children }: {
  state: ModelState; report?: Report; message?: string; children: ReactNode;
}) {
  const root = useRef<Group>(null);
  useLayoutEffect(() => {
    if (root.current) report?.(state, root.current, message);
  }, [state, report, message]);
  return <group ref={root}>{children}</group>;
}

function Imported({ src, report }: { src: string; report?: Report }) {
  const { scene } = useGLTF(src, false);
  return <ModelRoot state="ready" report={report}>
    <Clone object={scene} dispose={null}/>
  </ModelRoot>;
}

class AssetBoundary extends Component<Props & { children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null };
  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : String(error) };
  }
  render() {
    if (this.state.message !== null) return <ModelRoot state="error" report={this.props.onState} message={this.state.message}>
      {this.props.fallback}
    </ModelRoot>;
    return this.props.children;
  }
}

// Mount inside a Canvas. Each instance owns its transform hierarchy while
// successful instances share the loader's cached geometry and materials.
export function GlbModel({ src, fallback, onState }: Props) {
  if (!src) return <ModelRoot state="procedural" report={onState}>{fallback}</ModelRoot>;
  return <AssetBoundary key={src} src={src} fallback={fallback} onState={onState}>
    <Suspense fallback={<ModelRoot state="loading" report={onState}>{fallback}</ModelRoot>}>
      <Imported src={src} report={onState}/>
    </Suspense>
  </AssetBoundary>;
}
