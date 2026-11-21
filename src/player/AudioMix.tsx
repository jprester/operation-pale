import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import {FilmIcon} from './FilmIcon';

const sources = import.meta.glob<string>('../media/audio/*.mp3', {
  eager: true, query: '?url', import: 'default',
});
const tracks = ['dialogue','music','effects'] as const;
type Track = typeof tracks[number];
type Levels = Record<Track,number>;
const labels: Record<Track,string> = {dialogue:'Dialogue',music:'Music',effects:'Ambience & effects'};
const defaults: Levels = {dialogue:1,music:1,effects:1};
const storageKey = 'pale.audio.mix.v1';
const url = (name:string) => sources[`../media/audio/${name}.mp3`];

function savedLevels(): Levels {
  const result = {...defaults};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    for (const track of tracks) {
      const level = saved?.[track];
      if (Number.isFinite(level) && level >= 0 && level <= 1) result[track] = level;
    }
  } catch { /* Storage can be unavailable in private browsing. */ }
  return result;
}

export type AudioTransport = {start:(time:number)=>void};
type Props = {elapsed:number; running:boolean; read:()=>number};

export const AudioMix = forwardRef<AudioTransport,Props>(function AudioMix({elapsed,running,read},ref) {
  const container=useRef<HTMLSpanElement>(null);
  const settings=useRef<HTMLDetailsElement>(null);
  const [levels,setLevels]=useState(savedLevels);
  const [muted,setMuted]=useState(false);
  const [volume,setVolume]=useState(1);
  const [fallback,setFallback]=useState(()=>tracks.some(t=>!url(t)));
  const [failed,setFailed]=useState(false);
  const available=!failed && (!fallback || Boolean(url('road-to-earth')));
  const context=useRef<AudioContext|null>(null);
  const gains=useRef(new Map<HTMLAudioElement,GainNode>());

  function elements() { return Array.from(container.current?.querySelectorAll('audio') ?? []); }
  function levelFor(audio:HTMLAudioElement) {
    const track = audio.dataset.track as Track;
    return volume * (levels[track] ?? 1);
  }
  function start(position:number) {
    if (!available) return;
    // Create/resume inside the transport gesture, including on mobile browsers
    // that delegate HTMLMediaElement.volume to the device's hardware controls.
    if (!context.current && typeof AudioContext !== 'undefined') {
      try {context.current=new AudioContext();} catch { /* Native media fallback. */ }
    }
    const ctx=context.current;
    if (ctx?.state==='suspended') void ctx.resume().catch(()=>{});
    for (const audio of elements()) {
      if (ctx && !gains.current.has(audio)) {
        const gain=ctx.createGain();
        gain.gain.value=levelFor(audio);
        ctx.createMediaElementSource(audio).connect(gain);
        gain.connect(ctx.destination);
        gains.current.set(audio,gain);
        audio.volume=1;
      }
      audio.currentTime=position;
      void audio.play().catch(()=>{});
    }
  }
  useImperativeHandle(ref,()=>({start}));

  useLayoutEffect(()=>{
    for (const audio of elements()) {
      const gain=gains.current.get(audio);
      if (gain && context.current) gain.gain.setTargetAtTime(levelFor(audio),context.current.currentTime,.012);
      else audio.volume=levelFor(audio);
    }
  },[volume,levels,fallback]);
  useEffect(()=>{
    try {localStorage.setItem(storageKey,JSON.stringify(levels));} catch { /* Session-only mix. */ }
  },[levels]);
  useEffect(()=>{
    const nodes=gains.current;
    return ()=>{
      for (const gain of nodes.values()) gain.disconnect();
      nodes.clear();
      void context.current?.close().catch(()=>{});
      context.current=null;
    };
  },[]);
  useEffect(()=>{
    if (!running || !available) {elements().forEach(audio=>audio.pause());return;}
    start(read());
    const current=elements();
    return ()=>current.forEach(audio=>audio.pause());
  },[running,fallback,available,read]);
  function sync(audio:HTMLAudioElement) {
    if (!audio.readyState || audio.seeking || !Number.isFinite(audio.duration)) return;
    const target=Math.min(read(),audio.duration);
    if (Math.abs(audio.currentTime-target)>(running ? .09 : .005)) audio.currentTime=target;
  }
  useEffect(()=>{elements().forEach(sync);},[elapsed,running,fallback,read]);
  return <>
    <span hidden ref={container}>{(fallback?['road-to-earth']:tracks).map(track=>
      <audio key={track} src={url(track)} data-track={track} preload="metadata" muted={muted}
        onLoadedMetadata={e=>sync(e.currentTarget)} onSeeked={e=>sync(e.currentTarget)}
        onError={()=>{if(fallback)setFailed(true);else setFallback(true);}}/>)}</span>
    <button disabled={!available} title={muted?'Unmute':'Mute'} aria-label="Mute audio" aria-pressed={muted}
      onClick={()=>setMuted(!muted)}>{available?<FilmIcon name={muted?'mute':'audio'}/>:'Audio unavailable'}</button>
    <input className="mix-volume" type="range" aria-label="Audio volume" disabled={!available}
      min={0} max={1} step=".05" value={volume} onChange={e=>setVolume(e.currentTarget.valueAsNumber)}/>
    <details className="mix-settings" ref={settings} onKeyDown={e=>{
      if(e.key==='Escape' && settings.current?.open) {
        settings.current.open=false;settings.current.querySelector('summary')?.focus();e.stopPropagation();
      }
    }}>
      <summary aria-label="Audio settings" title="Audio settings"><FilmIcon name="settings"/></summary>
      <fieldset><legend>Audio mix</legend>
        {!fallback && <p>100% is the documentary mix.</p>}
        {fallback && <p>{available?'Playing the stereo mix. Individual tracks are unavailable.':'Audio unavailable.'}</p>}
        {tracks.map(track=><label key={track}><span>{labels[track]}</span><output>{Math.round(levels[track]*100)}%</output>
          <input type="range" min="0" max="100" step="1" aria-label={labels[track]} disabled={fallback}
            value={Math.round(levels[track]*100)} onChange={e=>setLevels({...levels,[track]:e.currentTarget.valueAsNumber/100})}/>
        </label>)}
        <button type="button" disabled={fallback} onClick={()=>setLevels({...defaults})}>Reset mix</button>
      </fieldset>
    </details>
  </>;
});
