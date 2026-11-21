import { lazy, Suspense, useState } from 'react';
import { foundryBranches, posterUrl } from '../data/foundries';
import { beats } from '../data/opening';

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

function Broadcast({ seconds, reduced }: { seconds: number; reduced: boolean }) {
  const phrases = beats[6].narration.filter(cue => cue.speaker === 'Company transmission');
  const page = phrases.filter(cue => seconds >= cue.start).length - 1;
  if (page < 0) return <RecordPlate eyebrow="PUBLIC CHANNEL" title="Incoming notice" detail="T+0:00 · Public emergency broadcast"/>;
  const words = phrases[page].transcript.split(' ');
  const count = reduced ? words.length : 1 + Math.floor((seconds - phrases[page].start) * 7);
  return <div className="receiver">
    <div className="receiver-bar"><b>PUBLIC WARNING</b><span>T+0:00</span></div>
    <div className="receiver-body"><small>EMERGENCY TRANSMISSION</small>
      <p>{words.slice(0,count).join(' ')}<i aria-hidden="true"/></p></div>
    <div className="receiver-footer"><span>PROPOSED CAPTIONS</span><span>0{page+1} / 04</span></div>
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


const worksite = documentaryPhotos.find(photo=>photo.id==='asteroid-extraction')!;

// Keep the local map under the dissolve into the source of the feedstock.
function ResourcePass({time,reduced,name}:{time:number;reduced:boolean;name:string}) {
  const inside = time >= worksite.start && time < worksite.end;
  const ramp = clamp((time-worksite.start)/1.25);
  const blend = reduced ? Number(inside) : ramp*ramp*(3-2*ramp);
  return <div className="plate resource-pass">
    {blend < 1 && <div className="resource-map"><DispatchAtlas time={time} reduced={reduced}/></div>}
    {(inside || (time>=worksite.start-1 && time<worksite.start)) &&
      <div className="resource-exposure" aria-hidden={blend===0} aria-label={name} style={{opacity:blend}}>
        <DocumentaryInsert photo={worksite} time={time} reduced={reduced} externalFade/>
      </div>}
  </div>;
}

export function OpeningPlate({ index, seconds, started, reduced, visible }: {
  index: number; seconds: number; started: boolean; reduced: boolean; visible: boolean;
}) {
  const time = beats[index].start + seconds;
  const shot = shotAt(time);
  const local = time - shot.at;
  const branch = foundryBranches.findIndex(b=>b.key===shot.view);
  const render3D = started && !reduced && visible;
  const photo = shot.view==='photo' ? documentaryPhotos.find(item=>time>=item.start && time<item.end) : undefined;
  if (started && index<2) return <OpeningHook time={time} reduced={reduced} live={render3D}/>;
  if (shot.view==='staging' || shot.view==='notice' && local<4) {
    return <StagingPlate time={time} reduced={reduced} visible={visible} assembly={t=><FoundrySequence index={2} seconds={t} reduced={reduced} visible={visible}/>}/>;
  }
  if (index===2) {
    return <ResourcePass time={time} reduced={reduced} name={shot.name}/>;
  }
  return <div className={branch>=0 ? "plate foundry-environment" : photo?.composition==='full' ? "plate photo-full-plate" : "plate"}>
    <div className="shot-window" aria-label={shot.name} style={{opacity: !started || reduced || photo ? 1 : .68+.32*clamp(local/.5)}}>
      {shot.view==='earth' && <SpaceView key="earth" carrier={false} seconds={local*25/32} render3D={render3D}/>}
      {shot.view==='carrier' && <SpaceView key="carrier" carrier seconds={local} render3D={render3D}/>}
      {branch>=0 && <FoundrySequence index={branch} seconds={local} reduced={reduced} visible={visible}/>}
      {shot.view==='map' && <SolarAtlas key={shot.at} initial={shot.scale!} time={time} moving={render3D}/>}
      {photo && <DocumentaryInsert photo={photo} time={time} reduced={reduced} comparison={<Survey seconds={local*2} reduced={reduced}/>}/>}
      {shot.view==='notice' && <Broadcast seconds={seconds} reduced={reduced}/>}
    </div>
    {!photo && <span className="plate-caption">FIG. 0{index+1} &nbsp; / &nbsp; {shot.name.toUpperCase()}<br/><small>Artistic reconstruction</small>
      {shot.view==='earth' && <a className="earth-credit" href="/art/earth-credits.txt" target="_blank" rel="noreferrer">Earth imagery · Solar System Scope · CC BY 4.0</a>}</span>}
  </div>;
}
