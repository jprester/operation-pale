import { useEffect, useRef, useState } from 'react';
import { chapters } from './data/chapters';
import { beats, frameAt, introDuration, cover, publicNotice, schedule } from './data/opening';
import './styles.css';

import { chronology } from './data/road';
import { VerificationRecord } from './scenes/VerificationRecord';
import { OpeningPlate } from './scenes/OpeningPlate';
import { usePlaybackClock } from './player/usePlaybackClock';
import { AudioMix, startAudio } from './player/AudioMix';
import { introAssets } from './data/assets';
const pad = (n: number) => String(n).padStart(2, '0');
const clock = (seconds: number) => [Math.floor(seconds / 60), Math.floor(seconds % 60)].map(pad).join(':');
function Mark() {
  return <svg className="mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.4"/>
    <ellipse cx="16" cy="16" rx="16" ry="5" transform="rotate(-43 16 16)" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="23" cy="8" r="2.3" fill="currentColor"/></svg>;
}

function App() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [captions, setCaptions] = useState(true);
  const player = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLAudioElement>(null);
  const article = useRef<HTMLElement>(null);
  const playback = usePlaybackClock(introDuration, visible && tabVisible);
  const { elapsed, started, playing, toggle, setPlaying, seek, setScrubbing } = playback;
  const { index: beatIndex, scene: beat, seconds: sceneSeconds, cue } = frameAt(elapsed);
  const captionOpacity = reduced || !cue ? 1 : .78 + .22 * Math.min(1, (sceneSeconds - cue.start) / .42);
  const chapter = chapters[active];

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
    const visibility = () => { setTabVisible(!document.hidden); if (document.hidden) setScrubbing(false); };
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (player.current) observer.observe(player.current);
    media.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      media.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, [setPlaying, setScrubbing]);

  function togglePlayback() {
    if (!playing) startAudio(media.current, elapsed >= introDuration ? 0 : playback.read());
    toggle();
  }
  function restartPlayback() {
    startAudio(media.current, 0);
    playback.restart();
  }
  function openChapter(index: number) {
    setPlaying(false);
    setActive(index);
    requestAnimationFrame(() => { article.current?.focus({ preventScroll: true }); article.current?.scrollIntoView({ block: 'start' }); });
  }
  return <main>
    <a className="skip" href="#archive">Skip to chapter archive</a>
    <header><a className="brand" href="#opening"><Mark/> PALE ARCHIVE</a>
      <nav aria-label="Primary"><a href="#opening">Introduction</a><a href="#archive" onClick={() => setPlaying(false)}>Chapter index <span>↗</span></a></nav>
    </header>
    <div ref={player}>
    <section id="opening" className={started ? 'hero in-reel' : 'hero'} aria-labelledby="title">
      <div className="stars" aria-hidden="true" style={{backgroundImage: `url(${introAssets.stars.src})`}}/>
      <OpeningPlate index={beatIndex} seconds={sceneSeconds} started={started} reduced={reduced} visible={visible}/>
      <div className="hero-copy">
        <p className="kicker"><i/> {started ? `OPERATION: PALE / SCENE ${pad(beatIndex + 1)} OF ${pad(beats.length)}` : 'SPECULATIVE DOCUMENTARY'}</p>
        {started && <p className="road-clock">{chronology(elapsed)}</p>}
        <h1 id="title" key={started ? beatIndex : 'cover'}>{started ? beat.title : <>Operation<span>:</span> Pale</>}</h1>
        <div className="caption" aria-live="polite" aria-atomic="true">
          {!started && <h2>{cover.title}</h2>}
          <p className={started && (!captions || !cue) ? 'empty-caption' : undefined} style={{ opacity: captionOpacity }}>
            {started ? captions && cue && <><small className="speaker">{cue.speaker === "Narrator" ? "Narrator" : "Company · reconstructed transmission"}</small>{cue.transcript}</> : cover.caption}
          </p>
        </div>
        <div className="hero-actions"><button className="play" onClick={togglePlayback}>
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>{playing ? 'Pause introduction' : elapsed === 0 ? 'Play introduction' : elapsed >= introDuration ? 'Replay introduction' : 'Continue introduction'}</button>
          <button className="link" onClick={() => openChapter(elapsed >= introDuration ? 1 : 0)}>{elapsed >= introDuration ? 'Read the Notification' : 'Skip to archive'} &nbsp;→</button></div>
      </div>
    </section>
    <section className="transport player-controls" aria-label="Introduction playback">
      <div className="control-row">
        <button className="transport-play" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlayback}>
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
        </button>
        <button className="restart" onClick={restartPlayback}>↺ Restart</button>
        <span className="timecode">{clock(elapsed)} <b>/ {clock(introDuration)}</b></span>
        <input className="scrubber" type="range" aria-label="Introduction position" aria-valuetext={`${clock(elapsed)} of ${clock(introDuration)}`}
          min={0} max={introDuration} step={0.1} value={elapsed}
          onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId); setScrubbing(true);}}
          onLostPointerCapture={()=>setScrubbing(false)} onPointerCancel={()=>setScrubbing(false)} onBlur={()=>setScrubbing(false)}
          onChange={event=>seek(event.currentTarget.valueAsNumber)}
          onKeyDown={event=>{
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              seek(Math.round(elapsed) + (event.key === 'ArrowRight' ? 1 : -1));
            }
          }}/>
        <button className="cc" aria-label="Captions" aria-pressed={captions} onClick={()=>setCaptions(!captions)}>CC</button>
        <AudioMix media={media} elapsed={elapsed} running={playback.running} read={playback.read}/>
      </div>
      <div className="tracks">{beats.map((item,i) => {
        const completed = elapsed >= item.start + item.duration;
        const current = i === beatIndex;
        return <button key={item.label} className={[current?'selected':'',completed?'complete':''].join(' ')}
          aria-label={`${item.label}, ${clock(item.start)}${completed?', completed':''}`}
          aria-current={current?'step':undefined} onClick={()=>seek(item.start)}>
          <span className="track"><i style={{width: Math.max(0,Math.min(100,(elapsed-item.start)/item.duration*100))+'%'}}/></span>
          <small>{completed?'✓':pad(i+1)}</small> {item.label}
        </button>;
      })}</div>
    </section>
    </div>
    <section className="archive" id="archive" aria-labelledby="archive-title" tabIndex={-1}>
      <div className="archive-heading"><div><p className="kicker"><i/> CAMPAIGN RECORD</p><h2 id="archive-title">Chapter index</h2></div><span className="micro">05 RECORDS</span></div>
      <div className="archive-grid"><nav className="chapter-list" aria-label="Narrative chapters">{chapters.map((item,i)=><button key={item.id}
        aria-current={active===i?'step':undefined} onClick={()=>openChapter(i)}><span className="number">{pad(i+1)}</span><span><small>{item.date}</small>{item.title}</span><span className="arrow">↗</span></button>)}</nav>
        <article tabIndex={-1} ref={article} aria-labelledby="chapter-title">
          <div className="meta"><span>{chapter.eyebrow}</span><span>{chapter.status==='planned'?'Editorial preview':'Prototype'}</span></div>
          <h2 id="chapter-title">{chapter.title}</h2><p className="lead">{chapter.summary}</p>
          {chapter.narrative.map(p=><p key={p}>{p}</p>)}
          {chapter.id==='notification' && <section className="transcript"><p className="micro">PUBLIC CHANNEL &nbsp; / &nbsp; T+0:00</p><h3>Emergency transmission</h3><small>Proposed caption transcript · 45–90 seconds</small><blockquote>{publicNotice.map(line=><p key={line}>{line}</p>)}</blockquote>
            <VerificationRecord reduced={reduced}/>
            <h3>Transmission schedule</h3><ol>{schedule.map(row=><li key={row.time}><time>{row.time}</time><div><strong>{row.event}</strong><p>{row.detail}</p></div></li>)}</ol></section>}
          <div className="chapter-actions"><button disabled={!active} onClick={()=>openChapter(active-1)}>← Previous</button><span>{pad(active+1)} / 05</span><button disabled={active===4} onClick={()=>openChapter(active+1)}>Next →</button></div>
        </article></div>
    </section>
    <footer><span>OPERATION: PALE</span><span>Fictional archive · Proposed opening narration</span></footer>
  </main>;
}
export default App;
