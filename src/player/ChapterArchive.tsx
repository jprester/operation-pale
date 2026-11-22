import {useRef,useState} from 'react';
import {chapters} from '../data/chapters';
import {publicNotice,schedule} from '../data/opening';
import {VerificationRecord} from '../scenes/VerificationRecord';
import {pad} from './filmTime';

export function ChapterArchive({reduced}:{reduced:boolean}) {
  const [active,setActive]=useState(0);
  const chapter=chapters[active];
  const article=useRef<HTMLElement>(null);
  function openChapter(index:number) {
    setActive(index);
    requestAnimationFrame(()=>article.current?.focus());
  }
  return (<section className="archive" id="archive" aria-labelledby="archive-title" tabIndex={-1}>
      <div className="archive-heading"><div><p className="kicker"><i/> CAMPAIGN RECORD</p><h2 id="archive-title">Chapter index</h2></div><span className="micro">05 RECORDS</span></div>
      <div className="archive-grid"><nav className="chapter-list" aria-label="Narrative chapters">{chapters.map((item,i)=><button key={item.id}
        aria-current={active===i?'step':undefined} onClick={()=>openChapter(i)}><span className="number">{pad(i+1)}</span><span><small>{item.date}</small>{item.title}</span><span className="arrow">↗</span></button>)}</nav>
        <article tabIndex={-1} ref={article} aria-labelledby="chapter-title">
          <div className="meta"><span>{chapter.eyebrow}</span><span>{chapter.status==='planned'?'Editorial preview':'Prototype'}</span></div>
          <h2 id="chapter-title">{chapter.title}</h2><p className="lead">{chapter.summary}</p>
          {chapter.narrative.map(p=><p key={p}>{p}</p>)}
          {chapter.id==='notification' && <section className="transcript"><p className="micro">PUBLIC CHANNEL &nbsp; / &nbsp; H+0:00</p><h3>Emergency transmission</h3><small>Canonical text · Canon Handoff v2.4</small><blockquote>{publicNotice.map(line=><p key={line}>{line}</p>)}</blockquote>
            <VerificationRecord reduced={reduced}/>
            <h3>The first forty-eight hours</h3><ol>{schedule.map(row=><li key={row.time}><time>{row.time}</time><div><strong>{row.event}</strong><p>{row.detail}</p></div></li>)}</ol></section>}
          <div className="chapter-actions"><button disabled={!active} onClick={()=>openChapter(active-1)}>← Previous</button><span>{pad(active+1)} / 05</span><button disabled={active===4} onClick={()=>openChapter(active+1)}>Next →</button></div>
        </article></div>
    </section>);
}
