import { useEffect, useRef, useState } from 'react';

type Props = { src: string; seconds: number; reduced: boolean; children: React.ReactNode };

// A paused video is a seekable image source. Never start a media clock or audio.
export function SilentInsert({src, seconds, reduced, children}: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const latest = useRef(seconds);
  latest.current = seconds;
  function synchronize() {
    const el = video.current;
    if (!el || !Number.isFinite(el.duration) || el.seeking) return;
    const target = Math.min(Math.max(0, latest.current), Math.max(0, el.duration - .04));
    if (Math.abs(el.currentTime - target) > 1/30) el.currentTime = target;
    else setDrawn(true);
  }
  useEffect(() => { if (ready && !reduced && !failed) synchronize(); }, [seconds, ready, reduced, failed]);
  return <>{children}{!reduced && !failed && <video className="silent-insert" ref={video}
    src={src} muted playsInline preload="auto" aria-hidden="true" style={{opacity:drawn?1:0}}
    onLoadedData={()=>{setReady(true);synchronize();}} onSeeked={()=>{setDrawn(true);synchronize();}}
    onError={()=>setFailed(true)}/>}</>;
}
