import {lazy,Suspense,useState} from 'react';
import {stagingAt,stagingShots} from '../data/staging';
import {SceneBoundary} from './SceneBoundary';
import {SolarAtlas} from './SolarAtlas';
import {DocumentaryInsert,documentaryPhotos} from './DocumentaryInsert';

const Pass=lazy(()=>import('./OrbitalPass'));
function Journey({time,moving}:{time:number;moving:boolean}) {
  const [lost,setLost]=useState(false);
  const [ready,setReady]=useState(false);
  const phase=time<198?'gamma':time<206?'handoff':time<212?'transit':time<218?'pullback':time<220 || time>=287?'network':time<224?'warden':'lantern';
  const label={gamma:'Foundry Gamma / finishing bay',handoff:'Cislunar space / tug handoff',transit:'In transit / Earth approach',pullback:'Earth orbit / tracked consignment',network:'Earth orbit / staged units',warden:'Warden / orbital command',lantern:'Lantern / stratospheric relay'}[phase];
  return <div className="journey">
    <img className="journey-still" alt={label} src={'/art/staging/'+phase+'.webp'}/>
    {moving && !lost && <div className="journey-live" style={{opacity:ready?1:0}}><SceneBoundary onLost={()=>setLost(true)}><Suspense fallback={null}>
      <Pass time={time} onReady={setReady} onLost={()=>setLost(true)}/>
    </Suspense></SceneBoundary></div>}
    <div className="journey-label"><small>{phase==='gamma'||phase==='handoff'?'Industrial network':'Deployed architecture'}</small><strong>{label}</strong></div>
    {(phase==='network'||phase==='pullback') && <div className="journey-key">◯ Tracked Quiver　◇ Warden　+ Tug　· Staged units<br/>Atmospheric relays in green · Distances compressed</div>}
  </div>;
}
function Register({freight,local,reduced}:{freight:boolean;local:number;reduced:boolean}) {
  const entries=freight?['Foundry','Depot','Transport tug','Quiver','Assigned orbit']:['Warden','Quiver','Scythe','Demonstration','Confirmation'];
  const active=reduced?4:Math.min(4,Math.floor(local/1.25));
  return <div className="stage-register">
    <small>{freight?'CISLUNAR FREIGHT REGISTER':'PUBLIC DEMONSTRATION · SCHEDULED'}</small>
    {freight && <img src="/models/staging/tug-v001.webp" alt="Proposed transport tug exterior"/>}
    <div className="stage-entries">{entries.map((name,i)=><span key={name} style={{opacity:i<=active?1:.4}}>{name}</span>)}</div>
    <p>{freight?'A sealed consignment passes from industrial custody into orbital staging.':'The announced event will give independent observers something to verify.'}</p>
  </div>;
}
function GroundSurvey({local,reduced}:{local:number;reduced:boolean}) {
  return <div className="ground-record"><small>DOMESDAY / TERRESTRIAL SURVEY</small>
    <svg viewBox="0 0 450 150" role="img" aria-label="Illustrative coastal terrain with three isolated observation patches and wide gaps">
      <path d="M0 0h304l-33 22 10 13-45 21 4 18-41 14-12 27-53 35H0Z" fill="#444b3f"/>
      <g fill="none" stroke="#747867">{[0,1,2,3].map(i=><path key={i} transform={'translate('+(-i*20)+' 0)'} d="M183 -10q-39 17-31 41t-30 38q-42 11-34 36t-55 49"/>)}
      <path d="M26 125Q95 96 147 91t78-49" stroke="#b6ad95" strokeDasharray="3 4"/></g>
      {[[74,106],[140,94],[203,64]].map(([x,y],i)=><g key={x} opacity={reduced?1:Math.max(.05,Math.min(1,local-i*1.4))}><ellipse cx={x} cy={y} rx="14" ry="7" fill="#cfaf77" opacity=".48"/><circle cx={x} cy={y} r="2" fill="#ead4ac"/></g>)}
      <text x="280" y="104" fill="#cdc6ae" fontSize="12">Unobserved</text>
    </svg><p>Illustrative terrain · sampled areas only</p></div>;
}

export function StagingPlate({time,reduced,visible,assembly}:{time:number;reduced:boolean;visible:boolean;assembly:(seconds:number)=>React.ReactNode}) {
  const shot=stagingAt(time),local=time-shot.at,kind=shot.kind;
  const photoId=kind==='rock'?'asteroid-extraction':kind==='astronomers'?'astronomers-anomaly':kind==='surveillance'?'orbital-surveillance':kind==='notice'?'intelligence-briefing':undefined;
  const source=photoId && documentaryPhotos.find(p=>p.id===photoId);
  const number=String(1+stagingShots.indexOf(shot)).padStart(2,'0');
  return <div className="plate staging-plate" data-staging={kind}>
    <div className="shot-window" aria-label={shot.name}>
      {source ? <DocumentaryInsert photo={{...source,start:shot.at,end:shot.at+9,composition:'inset'}} time={time} reduced={reduced}/> :
      (time<227 || kind==='tableau') ? <Journey time={time} moving={!reduced && visible}/> :
      kind==='ground' ? <GroundSurvey local={local} reduced={reduced}/> :
      kind==='record' || kind==='freight' ? <Register freight={kind==='freight'} local={local} reduced={reduced}/> :
      kind==='assembly' ? assembly(local) :
      <SolarAtlas key={kind} initial="local" time={time} moving={!reduced && visible} staging={kind}/>}
    </div>
    {!source && <span className="plate-caption">STAGING {number} / {shot.name.toUpperCase()}<br/><small>Illustrative reconstruction</small></span>}
    {kind==='notice' && <div className="contact-slate">T+0:00<br/><strong>The Notification</strong></div>}
  </div>;
}
