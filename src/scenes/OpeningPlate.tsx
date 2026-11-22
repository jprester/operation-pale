import { lazy, Suspense, useState } from 'react';
import { foundryBranches, posterUrl } from '../data/foundries';
import type { pictureAt } from '../data/film/edl';
import type { beats } from '../data/opening';

import { shotAt } from '../data/road';
import { StagingPlate } from './StagingPlate';
import { SolarAtlas } from './SolarAtlas';
import { SceneBoundary } from './SceneBoundary';
import { DocumentaryInsert, documentaryPhotos } from './DocumentaryInsert';
import {SpaceView} from './SpaceView';
import {DispatchAtlas} from './DispatchAtlas';
import {OpeningHook} from './OpeningHook';
const FoundryCanvas = lazy(() => import('./FoundryCanvas'));
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function FoundrySequence({ index, seconds, reduced, visible }: { index: number; seconds: number; reduced: boolean; visible: boolean }) {
  const branch = foundryBranches[index];
  const [drawn, setDrawn] = useState('');
  const [lost, setLost] = useState(false);
  const [failedPoster, setFailedPoster] = useState('');
  const render3D = !reduced && visible && !lost;
  return <div className="foundry-shot">
    <div className="foundry-frame">
      {(!render3D || drawn!==branch.key) && (failedPoster!==branch.key
        ? <img className="carrier-poster" src={posterUrl(branch)} alt="" onError={()=>setFailedPoster(branch.key)}/>
        : <svg className="survey-chart" viewBox="0 0 480 250" aria-hidden="true">
          <path d="M55 166Q160 55 425 108" stroke="#8d8168" strokeDasharray="3 5" fill="none"/>
          {foundryBranches.map((item,i)=><circle key={item.key} cx={65+i*110} cy={[158,108,96,102][i]} r={i===index?7:3} fill="#d4bb94"/>)}
        </svg>)}
      {render3D && <SceneBoundary onLost={()=>setLost(true)}><Suspense fallback={null}>
        <FoundryCanvas branch={branch} seconds={seconds} onDraw={setDrawn} onLost={()=>setLost(true)}/>
      </Suspense></SceneBoundary>}
    </div>
    <div className="shot-label">CISLUNAR SPACE · {index+1} / 4<br/><strong>{branch.name}</strong><br/>{branch.role}</div>
  </div>;
}

type Scene = (typeof beats)[number];

function Broadcast({ scene, seconds, reduced }: { scene: Scene; seconds: number; reduced: boolean }) {
  const cue = scene.narration.find(cue => cue.speaker === 'Company transmission')!;
  const elapsed = seconds + scene.start;
  const pages: typeof cue.subtitles[] = [];
  for (const phrase of cue.subtitles) {
    if (!pages.length || pages.at(-1)!.at(-1)!.text.endsWith('.')) pages.push([]);
    pages.at(-1)!.push(phrase);
  }
  const index = pages.filter(page => page[0].at <= elapsed).length - 1;
  const page = pages[index] ?? [];
  const text = page.flatMap((p,i) => {
    if (elapsed < p.at) return [];
    const until = page[i+1]?.at ?? pages[index+1]?.[0].at ?? scene.start+cue.end;
    const progress = Math.min(1,(elapsed-p.at)/Math.max(.1,(until-p.at)*.8));
    return [reduced ? p.text : p.text.slice(0, Math.ceil(progress*p.text.length))];
  }).join(' ');
  return <div className="receiver cold-receiver">
    <div className="receiver-bar"><b>PUBLIC CHANNEL</b><span>H+0:00</span></div>
    <div className="receiver-body"><small>EMERGENCY TRANSMISSION</small><p>{text}<i aria-hidden="true"/></p></div>
    <div className="receiver-footer"><span>COMPANY TRANSMISSION · RECONSTRUCTED</span>
      <span>{index<0?'—':String(index+1).padStart(2,'0')} / 07</span></div>
  </div>;
}

function RecordPlate({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return <div className="record-plate"><small>{eyebrow}</small><strong>{title}</strong><p>{detail}</p></div>;
}

function Survey({ seconds, reduced }: { seconds: number; reduced: boolean }) {
  const exposure = Math.min(2, Math.floor(seconds / 6));
  const x = 122 + exposure * 64;
  return <div className="survey-plate">
    <div className="survey-heading">OPTICAL SURVEY <span>EXPOSURE 0{exposure + 1} / 03</span></div>
    <svg viewBox="0 0 420 175" aria-hidden="true">
      {Array.from({length: 65}, (_, i) => <circle key={i} cx={(i*i*19+33)%421} cy={(i*47+9)%173}
        r={i%5===0?1.6:.85} fill="#dbdbce" opacity={.35+(i%4)*.17}/>)}
      <g transform={`translate(${x} ${105-exposure*17})`} opacity={reduced ? 1 : .55+.45*clamp((seconds-exposure*6)/.7)}>
        <circle r="2" fill="#e3bf8e"/><path d="M-10 -4v-6h6m8 20h6v-6" fill="none" stroke="#d5ac77"/>
      </g>
    </svg>
    <div className="survey-heading">COMPARISON FIELD <span>Origin unresolved</span></div>
  </div>;
}


// The diagram establishes where the cargo goes before the sample comparison.
function ResourcePass({time,reduced}:{time:number;reduced:boolean}) {
  const ramp = clamp((time-118.75)/1.1);
  const blend = reduced ? Number(time>=119.3) : ramp*ramp*(3-2*ramp);
  return <div className="plate resource-pass">
    {blend<1 && <div className="resource-map"><DispatchAtlas time={time} reduced={reduced}/></div>}
    {time>=118.5 && <div className="resource-exposure material-assay" style={{opacity:blend}} aria-hidden={blend===0}>
      <figure>
        <img src="/art/documentary/asteroid-samples.webp" alt="Two broken asteroid fragments expose icy inclusions and metallic grains."/>
        <figcaption>
          <div><small>Ice-bearing rock</small><strong>Water &amp; propellant</strong></div>
          <div><small>Metal-bearing rock</small><strong>Structural metal</strong></div>
        </figcaption>
      </figure>
      <span className="plate-caption">Asteroid cargo · Illustrative samples</span>
    </div>}
  </div>;
}

export function OpeningPlate({ plate, time, scene, seconds, started, reduced, visible }: {
  plate: ReturnType<typeof pictureAt>['cut']['plate']; time: number; scene: Scene; seconds: number; started: boolean; reduced: boolean; visible: boolean;
}) {
  const shot = shotAt(time);
  const local = time - shot.at;
  const branch = foundryBranches.findIndex(b=>b.key===shot.view);
  const render3D = started && !reduced && visible;
  const photo = shot.view==='photo' ? documentaryPhotos.find(item=>time>=item.start && time<item.end) : undefined;
  if (!started || plate === 'title') return <div className="plate"><SpaceView carrier={false} seconds={started?time:0} render3D={render3D}/>
    {started && <div className="film-cover"><h1>Operation: Pale</h1><p className="cover-line">The acquisition of Earth.</p></div>}</div>;
  if (plate === 'black') return <div style={{position:'absolute',inset:0,background:'black'}}/>;
  if (plate === 'end') return <div className="plate"><RecordPlate eyebrow="Episode 1" title="The first forty-eight hours." detail=""/></div>;
  if (plate === 'city') {
    const photo = documentaryPhotos.find(p=>p.id==='night-city')!;
    return <div className="plate photo-full-plate" style={{background:'black'}}><div style={{position:'absolute', inset:0, opacity:clamp((scene.duration-seconds)/.65)}}>
      <DocumentaryInsert photo={{...photo,start:0,end:25}} time={time} reduced={reduced} externalFade/></div></div>;
  }
  if (plate === 'briefing' || plate === 'observatory' || plate === 'receiver') {
    const id = plate === 'observatory' ? 'observatory-night' : 'intelligence-briefing';
    const photo = documentaryPhotos.find(item => item.id === id)!;
    return <div className="plate photo-full-plate"><DocumentaryInsert photo={{...photo,composition:'full'}} time={time} reduced={reduced} externalFade/>{plate === 'receiver' && <Broadcast scene={scene} seconds={seconds} reduced={reduced}/>}</div>;
  }
  if (plate === 'delta') {
    const delta = foundryBranches.find(branch => branch.key === 'delta')!;
    return <div className="plate foundry-environment"><img className="carrier-poster" src={posterUrl(delta)} alt="Foundry Delta exterior"/>
      <span className="plate-caption">Foundry Delta · Artistic reconstruction</span></div>;
  }
  if (started && plate === 'hook') return <OpeningHook time={time} reduced={reduced} live={render3D}/>;
  if (shot.view==='staging' || shot.view==='notice' && local<4) {
    return <StagingPlate time={time} reduced={reduced} visible={visible} assembly={t=><FoundrySequence index={2} seconds={t} reduced={reduced} visible={visible}/>}/>;
  }
  if (plate === 'resources') {
    return <ResourcePass time={time} reduced={reduced}/>;
  }
  return <div className={branch>=0 ? "plate foundry-environment" : photo?.composition==='full' ? "plate photo-full-plate" : "plate"}>
    <div className="shot-window" aria-label={shot.name} style={{opacity: !started || reduced || photo ? 1 : .68+.32*clamp(local/.5)}}>
      {shot.view==='earth' && <SpaceView key="earth" carrier={false} seconds={local*25/32} render3D={render3D}/>}
      {shot.view==='carrier' && <SpaceView key="carrier" carrier seconds={local} render3D={render3D}/>}
      {branch>=0 && <FoundrySequence index={branch} seconds={local} reduced={reduced} visible={visible}/>}
      {shot.view==='map' && <SolarAtlas key={shot.at} initial={shot.scale!} time={time} moving={render3D}/>}
      {photo && <DocumentaryInsert photo={photo} time={time} reduced={reduced} comparison={<Survey seconds={local*2} reduced={reduced}/>}/>}
      {shot.view==='notice' && <Broadcast scene={scene} seconds={seconds} reduced={reduced}/>}
    </div>
    {!photo && <span className="plate-caption">FIG. 0{scene.figure} &nbsp; / &nbsp; {shot.name.toUpperCase()}<br/><small>Artistic reconstruction</small>
      {shot.view==='earth' && <a className="earth-credit" href="/art/earth-credits.txt" target="_blank" rel="noreferrer">Earth imagery · Solar System Scope · CC BY 4.0</a>}</span>}
  </div>;
}
