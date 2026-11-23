import {useEffect,useRef,useState} from 'react';
import {indexedBeats,frameAt,introDuration,cover} from './data/opening';
import {pictureAt} from './data/film/edl';
import {OpeningPlate} from './scenes/OpeningPlate';
import {usePlaybackClock} from './player/usePlaybackClock';
import {AudioMix,type AudioTransport} from './player/AudioMix';
import {useFilmFullscreen,usePlayerChrome} from './player/FilmTools';
import {Explore,type Section} from './player/Explore';
import {FilmIcon} from './player/FilmIcon';
import {clock,pad} from './player/filmTime';
import './styles.css';
import './cinema.css';

function coldOpenSlate(id:string) {
  if(id==='catalogue') return 'H−36 H · SPACE CATALOGUE';
  if(id==='order' || id==='tracking' || id==='observatory') return 'H−20 MIN · TRACKING RECORD';
  if(id==='announcement' || id==='public-channel') return 'H+0:00 · PUBLIC CHANNEL';
  return 'H+0 · FIRST HOUR';
}

function Mark() {
  return <svg className="mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.4"/>
    <ellipse cx="16" cy="16" rx="16" ry="5" transform="rotate(-43 16 16)" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="23" cy="8" r="2.3" fill="currentColor"/></svg>;
}

function App() {
  const [mode,setMode]=useState<'watch'|'explore'>('watch');
  const [section,setSection]=useState<Section>('Atlas');
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible,setVisible]=useState(true);
  const [tabVisible,setTabVisible]=useState(()=>!document.hidden);
  const [captions,setCaptions]=useState(true);
  const player=useRef<HTMLDivElement>(null);
  const frame=useRef<HTMLDivElement>(null);
  const media=useRef<AudioTransport>(null);
  const watch=mode==='watch';
  const playback=usePlaybackClock(introDuration,watch && visible && tabVisible);
  const {elapsed,started,playing,toggle,setPlaying,seek,setScrubbing}=playback;
  const {scene,seconds,cue}=frameAt(elapsed);
  const index=indexedBeats.indexOf(scene);
  const {sourceTime,cut}=pictureAt(elapsed);
  const subtitle=cue?.subtitles.filter(s=>s.at<=elapsed).at(-1);
  const chrome=usePlayerChrome(playing);
  const screen=useFilmFullscreen(player);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
    const visibility = () => { setTabVisible(!document.hidden); if (document.hidden) setScrubbing(false); };
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (frame.current) observer.observe(frame.current);
    media.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      media.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, [setPlaying, setScrubbing, watch]);

  function togglePlayback() {
    if (!playing) media.current?.start(elapsed >= introDuration ? 0 : playback.read());
    toggle();
  }
  function restartPlayback() {
    media.current?.start(0);
    playback.restart();
  }

  function explore(target?:Section) {
    setPlaying(false);
    setScrubbing(false);
    if(target) setSection(target);
    setMode('explore');
  }
  function jump(t:number) {seek(t);setMode('watch');}
  const titleOpacity=reduced?1:Math.min(1,seconds/.45,(4-seconds)/.8);
  return <main><div ref={player} className={'cinema'+(screen.expanded?' expanded':'')}>
    <header className="film-header"><a className="brand" href="#opening" onClick={()=>setMode('watch')}><Mark/> PALE ARCHIVE</a>
      <nav className="mode-switch" aria-label="Presentation mode">
        <button aria-pressed={watch} onClick={()=>setMode('watch')}><FilmIcon name="film"/> Watch</button>
        <button aria-pressed={!watch} onClick={()=>explore()}><FilmIcon name="atlas"/> Explore</button>
      </nav>
      <button className="archive-shortcut" onClick={()=>explore('Chapter index')} aria-label="Chapter index"><FilmIcon name="index"/><span>Chapter index</span></button>
    </header>
    {watch && <div className="theater"><div className="film-meta"><span>Operation: Pale</span><span>Introduction <i/> {clock(introDuration)}</span></div></div>}
    <div className="theater" hidden={!watch} id="opening" onPointerMove={chrome.wake} onPointerDown={chrome.wake} onKeyDown={chrome.wake} onFocus={chrome.wake}>
      <div ref={frame} className={'film-frame'+(!started?' cover-frame':'')} aria-label="Documentary picture">
        <div className="stars"/>
        {watch && <OpeningPlate plate={cut.plate} time={sourceTime} scene={scene} seconds={seconds} started={started} reduced={reduced} visible={visible}/>}
        {!started ? <div className="film-cover"><p className="kicker"><i/> Speculative documentary</p><h1>Operation<span>:</span> Pale</h1>
          <p className="cover-line">{cover.title}</p><button className="cover-play" onClick={togglePlayback}><FilmIcon name="play"/>Play introduction</button></div> :
        <><div className="film-clock"><span>{index<0 ? '·' : pad(index+1) + ' / ' + pad(indexedBeats.length)}</span>{scene.id==='h-hour' ? coldOpenSlate(cut.id) : scene.label}</div>
        {scene.title && seconds<4 && <h2 className="cut-title" style={{opacity:titleOpacity}}>{scene.title}</h2>}
        {captions && subtitle && <div className="subtitles"><span>{cue?.speaker==='Company transmission' && <b>Company transmission · reconstructed　</b>}{subtitle.text}</span></div>}</>}
      </div>
      <section className={'film-transport'+(chrome.hidden?' idle':'')} aria-label="Introduction playback">
        <button className="transport-play" aria-label={playing?'Pause':'Play'} onClick={togglePlayback}><FilmIcon name={playing?'pause':'play'}/></button>
        <button className="restart" aria-label="Restart" title="Restart" onClick={restartPlayback}><FilmIcon name="restart"/></button>
        <span className="timecode">{clock(elapsed)} <b>/ {clock(introDuration)}</b></span>
        <input className="scrubber" type="range" aria-label="Introduction position" aria-valuetext={clock(elapsed)+' of '+clock(introDuration)}
          min={0} max={introDuration} step={.1} value={elapsed} style={{'--progress':elapsed/introDuration*100+'%'} as React.CSSProperties}
          onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setScrubbing(true);}}
          onLostPointerCapture={()=>setScrubbing(false)} onPointerCancel={()=>setScrubbing(false)} onBlur={()=>setScrubbing(false)}
          onChange={e=>seek(e.currentTarget.valueAsNumber)} onKeyDown={e=>{
            if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();seek(Math.round(elapsed)+(e.key==='ArrowRight'?1:-1));}
          }}/>
        <AudioMix ref={media} elapsed={elapsed} running={playback.running} read={playback.read}/>
        <button className="cc" aria-label="Captions" title="Captions" aria-pressed={captions} onClick={()=>setCaptions(!captions)}>CC</button>
        {screen.fullscreen && <><select className="fullscreen-scenes" value={index} aria-label="Film sequence" onChange={e=>seek(indexedBeats[Number(e.target.value)].start)}>
          {index<0 && <option value={-1} hidden>{scene.label}</option>}{indexedBeats.map((b,i)=><option key={b.start} value={i}>{b.label}</option>)}</select>
          <button aria-label="Explore archive" onClick={()=>explore()}><FilmIcon name="atlas"/></button></>}
        <button aria-label={screen.fullscreen?'Exit fullscreen':'Fullscreen'} title="Fullscreen" onClick={screen.toggleFullscreen}><FilmIcon name={screen.fullscreen?'exit':'fullscreen'}/></button>
      </section>
      <nav className="sequence-nav" aria-label="Film sequences"><h2>Sequence index</h2><div>{indexedBeats.map((b,i)=>
        <button key={b.start} className={b.start<scene.start?'complete':''} aria-current={i===index?'step':undefined} onClick={()=>seek(b.start)}>
          <small>{b.start<scene.start?'✓':pad(i+1)} <span>{clock(b.start)}</span></small>{b.label}</button>)}</div></nav>
    </div>
    {!watch && <Explore section={section} select={setSection} elapsed={elapsed} reduced={reduced} jump={jump}/>}
    {!watch && screen.fullscreen && <button className="leave-screen" onClick={screen.toggleFullscreen}>Exit fullscreen</button>}
  </div></main>;
}
export default App;
