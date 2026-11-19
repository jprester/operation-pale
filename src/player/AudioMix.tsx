import { useEffect, useState, type RefObject } from 'react';

const masters = import.meta.glob<string>('../media/audio/road-to-earth.mp3', {
  eager: true, query: '?url', import: 'default',
});
const src = Object.values(masters)[0];

type Props = { media: RefObject<HTMLAudioElement>; elapsed: number; running: boolean; read: () => number };

// Invoke directly in a Play/Restart click so gesture-gated browsers authorize
// this persistent element even when metadata is still loading.
export function startAudio(media: HTMLAudioElement | null, position: number) {
  if (!media || media.error) return;
  media.currentTime = position;
  void media.play().catch(() => { /* The transport and subtitles remain available. */ });
}

export function AudioMix({media, elapsed, running, read}: Props) {
  const [muted,setMuted] = useState(false);
  const [volume,setVolume] = useState(1);
  const [failed,setFailed] = useState(false);
  const [ready,setReady] = useState(false);
  const available = Boolean(src) && !failed;
  useEffect(() => {
    const audio = media.current;
    if (!audio || !ready || failed || audio.seeking) return;
    const target = Math.min(read(), audio.duration);
    if (Math.abs(audio.currentTime - target) > (running ? .12 : .005)) audio.currentTime = target;
  }, [media, elapsed, read, running, ready, failed]);
  useEffect(() => {
    const audio = media.current;
    if (!audio || failed) return;
    if (!running) audio.pause();
    else if (audio.paused) void audio.play().catch(()=>{ /* Retry on the next explicit Play. */ });
    return () => audio.pause();
  }, [media, running, failed]);
  useEffect(() => {
    if (media.current) media.current.volume = volume;
  }, [media, volume]);
  return <>
    {src && <audio ref={media} src={src} preload="metadata" muted={muted}
      onLoadedMetadata={()=>setReady(true)} onError={()=>setFailed(true)}
      onSeeked={()=>{const a=media.current; if(a && !running && Math.abs(a.currentTime-read())>.005) a.currentTime=read();}}/>}
    <button disabled={!available} aria-label="Mute audio" aria-pressed={muted}
      onClick={()=>setMuted(!muted)}>{available ? muted ? 'Unmute' : 'Mute' : 'Audio unavailable'}</button>
    <input className="mix-volume" type="range" aria-label="Audio volume" disabled={!available}
      min={0} max={1} step=".05" value={volume} onChange={event=>setVolume(event.currentTarget.valueAsNumber)}/>
  </>;
}
