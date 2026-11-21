import {useState} from 'react';
import {caravanArrival,type Point} from '../data/atlas';
import type {MapScale} from '../data/road';
import {DispatchAtlas} from './DispatchAtlas';
import {SolarAtlas} from './SolarAtlas';
import {SpaceView} from './SpaceView';
import sources from '../../public/art/opening/manifest.json';
import './opening-hook.css';

function ease(t:number,a:number,b:number) {
  const x=Math.max(0,Math.min(1,(t-a)/(b-a)));
  return x*x*(3-2*x);
}
const photos=[
  {key:'city',start:8,end:14.8,label:'Tokyo Bay',year:'2021'},
  {key:'industry',start:14.8,end:18.5,label:'Port of Rotterdam',year:'2005'},
  {key:'launch',start:18.5,end:21.5,label:'Apollo 11',year:'1969'},
  {key:'station',start:21.5,end:26,label:'International Space Station',year:'2010'}
] as const;
function PlateImage({name}:{name:keyof typeof sources}) {
  const [failed,setFailed]=useState(false);
  return failed?null:<img src={'/art/opening/'+name+'.webp'} alt={sources[name].alt} onError={()=>setFailed(true)}/>;
}

// A common spine and terminal notch identify related entries; branch count distinguishes records.
function Seal({record}:{record:number}) {
  return <svg viewBox="0 0 60 40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 32H50l6-6M10 32V9l7-5M16 32V18l8-7"/>
    {record>=1 && <path d="M26 32V16l9-9M26 23h8l5-5"/>}
    {record>=2 && <path d="M41 32V17l8-8"/>}
  </svg>;
}
// Proposed survey optics: two offset limbs register against the same world.
function SurveyOptics({registration}:{registration:number}) {
  return <div className="survey-optics" aria-hidden="true">
    <svg viewBox="0 0 300 300" fill="none" stroke="currentColor">
      <g transform={`rotate(${-18+registration*9} 150 150)`}>
        <path d="M54 62A130 130 0 0 1 271 101m8 29a130 130 0 0 1-49 124M111 274a130 130 0 0 1-87-89"/>
        <path d="M43 86a125 125 0 0 1 71-56m136 44a125 125 0 0 1 22 48" strokeWidth="3"/>
        {Array.from({length:15},(_,i)=><path key={i} d={i%4===0?'M150 14v10':'M150 17v4'}
          transform={`rotate(${i*4-42} 150 150)`}/>)}
      </g>
      <path d="M15 166h19l8-7m199 62 12 9h31M205 39l8-11h30" opacity=".75"/>
    </svg>
  </div>;
}
function SurveyRecord({time}:{time:number}) {
  const step=time<60?0:time<62?1:2;
  return <div className="survey-register">
    <div className="record-seals">{[0,1,2].map(i=><span key={i} data-active={i===step}><Seal record={i}/></span>)}</div>
    <small>Documentary translation</small><strong>{['Survey record','Acquisition approved','Sol Development Company'][step]}</strong>
  </div>;
}

// The atlas zoom converges on a fixed catalogue mark. The model inherits the mark's screen centre.
export function AtlasReveal({time,from,to,reduced,children,target=caravanArrival,scale='solar'}:{time:number;from:number;to:number;reduced:boolean;children:React.ReactNode;target?:Point;scale?:MapScale}) {
  const focus=reduced?0:ease(time,from,to);
  const mix=reduced?Number(time>=(from+to)/2):ease(time,from+2,to);
  return <>
    {mix<1 && <div className="hook-layer reveal-atlas" style={{opacity:1-mix}}>
      <SolarAtlas initial={scale} time={time} moving={false} focus={focus} focusSite={target}/>
    </div>}
    {mix>0 && <div className="hook-layer reveal-hull" style={{opacity:mix,transform:`translate(${reduced?0:74*(target[0]/520-.5)*(1-focus)}%, ${reduced?0:67*(target[1]/280-.5)*(1-focus)}%) scale(${reduced?1:.10+.9*mix})`}}>{children}</div>}
  </>;
}

export function OpeningHook({time,reduced,live}:{time:number;reduced:boolean;live:boolean}) {
  const fade=(a:number,b:number)=>reduced?Number(time>=(a+b)/2):ease(time,a,b);
  const globeOut=fade(29.5,35), surveyIn=fade(49,52), atlasIn=fade(66.5,70);
  const resourceMap=fade(94,96.5);
  const photo=photos.find(p=>time>=p.start && time<p.end);
  const montage=fade(7,10)*(1-fade(24,27));
  const withdrawal=fade(25,31);
  const earthOpacity=time<40?1-globeOut:surveyIn*(1-atlasIn);
  const survey=time>=40;
  return <div className="plate opening-hook">
    {earthOpacity>0 && <div className={'hook-layer hook-earth'+(survey?' surveyed':'')} style={{
      opacity:earthOpacity,transform:`translateX(${survey?-17:23*montage}%) scale(${survey ? .72 : 1-.60*withdrawal-.14*montage})`
    }}><SpaceView carrier={false} seconds={reduced?0:Math.min(24,time*.47)} render3D={live}/></div>}
    {photo && <figure key={photo.key} className={'human-plate plate-'+photo.key} style={{opacity:reduced?1:ease(time,photo.start,photo.start+.65)*(1-ease(time,photo.end-.65,photo.end))}}>
      <div style={{transform:`scale(${reduced?1:1+.025*ease(time,photo.start,photo.end)})`}}><PlateImage name={photo.key}/></div>
      <figcaption>{photo.label} <span>{photo.year} · NASA</span></figcaption></figure>}
    {globeOut>0 && surveyIn<1 && <div className="hook-layer galactic" style={{opacity:globeOut*(1-surveyIn)}}>
      <PlateImage name="galaxy"/><div className="galaxy-sign"><Seal record={0}/></div>
      <small>Milky Way · Artist’s concept<br/>NASA/JPL-Caltech</small></div>}
    {globeOut>0 && atlasIn<1 && <div className="hook-layer survey-spectrum" aria-hidden="true"
      style={{opacity:globeOut*(1-atlasIn)}}/>}
    {surveyIn>0 && atlasIn<1 && <div className="hook-layer" style={{opacity:surveyIn*(1-atlasIn)}}>
      <SurveyOptics registration={reduced?1:ease(time,49,59)}/>
    </div>}
    {surveyIn>0 && atlasIn<1 && <div className="hook-layer survey-overlay" style={{opacity:surveyIn*(1-atlasIn)}}><SurveyRecord time={time}/></div>}
    {atlasIn>0 && <div className="hook-layer" style={{opacity:atlasIn*(1-resourceMap)}}><AtlasReveal time={time} from={74.5} to={81.5} reduced={reduced}>
      <SpaceView carrier seconds={Math.max(0,time-76.5)*1.13} render3D={live}/>
    </AtlasReveal></div>}
    {resourceMap>0 && <div className="hook-layer" style={{opacity:resourceMap}}><DispatchAtlas time={time} reduced={reduced}/></div>}
    {earthOpacity>.5 && <a className="hook-credit" href="/art/earth-credits.txt" target="_blank" rel="noreferrer">Earth imagery · CC BY 4.0</a>}
  </div>;
}
