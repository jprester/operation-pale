import {lazy,Suspense,useCallback,useState} from 'react';
import {beats,frameAt} from '../data/opening';
import {pictureAt} from '../data/film/edl';
import {introAssets} from '../data/assets';
import {foundryBranches,modelUrl,posterUrl} from '../data/foundries';
import {SolarAtlas} from '../scenes/SolarAtlas';
import {SceneBoundary} from '../scenes/SceneBoundary';
import {ChapterArchive} from './ChapterArchive';
import {clock,pad} from './filmTime';

const InspectionCanvas=lazy(()=>import('../scenes/InspectionCanvas'));
const records=[
  {name:'Caravan',detail:'Interstellar industrial carrier',src:introAssets.caravan.src,poster:introAssets.caravanPoster.src},
  ...foundryBranches.map(branch=>({name:branch.name,detail:branch.role,src:modelUrl(branch),poster:posterUrl(branch)})),
  ...Object.entries({Warden:'Orbital command',Quiver:'Orbital dispenser',Tug:'Cislunar freight',Lantern:'Stratospheric relay'}).map(([name,detail])=>({
    name,detail,src:'/models/staging/'+name.toLowerCase()+'-v001.glb',poster:'/models/staging/'+name.toLowerCase()+'-v001.webp'
  }))
];
function Equipment() {
  const [index,select]=useState(0);
  const [orbit,setOrbit]=useState(false);
  const fail=useCallback(()=>setOrbit(false),[]);
  const record=records[index];
  return <section className="equipment">
    <div className="explore-tools"><label>Equipment <select value={index} onChange={e=>{select(Number(e.target.value));setOrbit(false);}}>
      {records.map((r,i)=><option key={r.name} value={i}>{r.name}</option>)}</select></label>
      <button onClick={()=>setOrbit(!orbit)} aria-pressed={orbit}>{orbit?'Still view':'Orbit model'}</button></div>
    <div className="inspection-stage">{orbit?<SceneBoundary onLost={fail}><Suspense fallback={<img alt={record.name} src={record.poster}/>}>
      <InspectionCanvas src={record.src} onLost={fail}/></Suspense></SceneBoundary>:<img alt={record.name} src={record.poster}/>}</div>
    <p>{record.detail} · Proposed exterior{orbit?' · Drag to orbit, scroll to zoom':''}</p>
  </section>;
}
export const sections=['Atlas','Equipment','Transcript','Chapter index'] as const;
export type Section=typeof sections[number];
export function Explore({section,select,elapsed,reduced,jump}:{section:Section;select:(s:Section)=>void;elapsed:number;reduced:boolean;jump:(t:number)=>void}) {
  const current=frameAt(elapsed);
  const {cut,sourceTime}=pictureAt(elapsed);
  return <section className="explorer" aria-label="Explore the archive">
    <div className="explore-heading"><h1>Explore the archive</h1><span>Film paused at {clock(elapsed)}</span></div>
    <nav className="explore-tools" aria-label="Archive collections">{sections.map(s=><button key={s} aria-pressed={section===s} onClick={()=>select(s)}>{s}</button>)}</nav>
    {section==='Atlas' && <div className="atlas-study"><SolarAtlas initial={cut.plate==='road'?'local':'solar'} time={sourceTime} moving={false}/></div>}
    {section==='Equipment' && <Equipment/>}
    {section==='Transcript' && <div className="film-transcript">{beats.map((beat,i)=><details key={beat.label} open={i===current.index || undefined}>
      <summary>{pad(i+1)}　{beat.label}</summary><h2>{beat.title}</h2>
      {beat.narration.map(c=><div key={c.start}><button onClick={()=>jump(beat.start+c.start)} aria-label={'Watch from '+clock(beat.start+c.start)}>{clock(beat.start+c.start)} ↗</button>
        <p><small>{c.speaker}</small>{c.transcript}</p></div>)}</details>)}</div>}
    {section==='Chapter index' && <ChapterArchive reduced={reduced}/>}
  </section>;
}
