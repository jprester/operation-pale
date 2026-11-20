import {lazy,Suspense,useState} from 'react';
import {atlasSites,belt,caravanArrival,earth,freightLinks,localOrbits,orbitPoint,solarOrbits,sun,type Point} from '../data/atlas';
import {preparationMonth,type MapScale} from '../data/road';
import { SceneBoundary } from './SceneBoundary';
const Ground=lazy(()=>import('./AtlasGround'));

import {StagingOverlay} from './StagingAtlas';
import type {StagingKind} from '../data/staging';

export function SolarAtlas({initial,time,moving,staging,focus=0,focusSite=caravanArrival}:{initial:MapScale;time:number;moving:boolean;staging?:StagingKind;focus?:number;focusSite?:Point}) {
  const [scale,setScale]=useState(initial);
  const [deployment,setDeployment]=useState(true);
  const [ready,setReady]=useState(false);
  const [lost,setLost]=useState(false);
  const month=preparationMonth(time);
  const showIndustry=staging!=='relay';
  const showLogistics=showIndustry && staging!=='assignment';
  const sites=atlasSites(scale,month).filter(site=>scale==='solar' || showIndustry || site.type==='world');
  const solar=scale==='solar';
  const center=solar?sun:earth;
  const links=solar?[['Asteroid works','Earth']]:freightLinks;
  const t=moving?Math.min(1,Math.max(0,time-65)/10):1;
  const caravan:Point=[494-65*t,30+31*t];
  const zoom = 1 + 3.5*focus;
  const w=520/zoom, h=280/zoom;
  const cx=focusSite[0]-(focusSite[0]-260)*(1-focus)/zoom;
  const cy=focusSite[1]-(focusSite[1]-140)*(1-focus)/zoom;
  return <section style={{'--atlas-label-opacity':Math.max(0,1-2.5*focus), '--atlas-type-scale':1/zoom} as React.CSSProperties} className="solar-atlas" aria-label="Expedition atlas">
    <div className="atlas-tools" aria-label="Map scale">{(['solar','local'] as const).map(value=>
      <button key={value} aria-pressed={scale===value} onClick={()=>setScale(value)}>{value==='solar'?'Solar System':'Earth–Moon'}</button>)}
      {!solar && month>=10 && <button aria-pressed={deployment} onClick={()=>setDeployment(!deployment)}>Deployment</button>}</div>
    <div className="atlas-field">
      {moving && focus===0 && !lost && <div className="atlas-ground"><SceneBoundary onLost={()=>setLost(true)}><Suspense fallback={null}>
        <Ground scale={scale} onReady={()=>setReady(true)} onLost={()=>setLost(true)}/>
      </Suspense></SceneBoundary></div>}
      <svg viewBox={`${cx-w/2} ${cy-h/2} ${w} ${h}`} role="img" aria-label={solar?'Illustrative arrival, planetary orbits and asteroid belt':'Earth, Moon and successive industrial sites with cargo connections'}>
        {(!ready || lost || !moving || focus>0) && <g>{(solar?solarOrbits:localOrbits).map(r=><ellipse key={r} cx={center[0]} cy={center[1]} rx={r} ry={r*.52} fill="none" stroke="#79715b"/>)}
          {solar && belt.map(([x,y],i)=><circle key={i} cx={x} cy={y} r=".85" fill="#a59c81"/>)}</g>}
        {solar && <g><path d="M494 30L429 61" stroke="#d7bc8c" strokeDasharray="3 4"/><path transform={`translate(${caravan}) scale(${1/zoom})`} d="m-6 3 5-8 8 1-5 5z" fill="#eee3c8"/><text x={caravan[0]-10} y={caravan[1]-9} textAnchor="end">Caravan</text>
          <text className="atlas-region" x="118" y="96">MAIN BELT</text></g>}
        {(solar || showLogistics) && links.map(([source,target],i)=>{
          const a=sites.find(s=>s.label===source)?.p,b=sites.find(s=>s.label===target)?.p;
          if(!a||!b)return null;
          const f=moving?(time*.093+i*.31)%1:.55;
          return <g key={source+target}><path d={`M${a}L${b}`} stroke="#c9a46c" strokeDasharray="3 3" opacity=".78"/>
            <circle cx={a[0]+(b[0]-a[0])*f} cy={a[1]+(b[1]-a[1])*f} r="2.4" fill="#f5d399"/></g>;
        })}
        {!solar && staging && deployment && <StagingOverlay kind={staging} time={time}/>}
        {!staging && !solar && deployment && month>=10 && <g fill="#8dc6d4">{Array.from({length:Math.min(20,Math.floor((month-10)*2)+1)},(_,i)=>{
          const [x,y]=orbitPoint(earth,42,2.39*i+(moving?time*.018:0));return <path key={i} d={`M${x-2} ${y+2}l2-5 2 5z`}/>;
        })}<text className="atlas-region" x="85" y="164">DEPLOYED</text></g>}
        {sites.map(({label,p:[x,y],offset,type})=><g key={label}>
          {type==='world'? <circle cx={x} cy={y} r={label==='Sun'?8:label==='Earth'&&!solar?11:5}
            fill={label==='Earth'?'#8dbaca':label==='Sun'?'#e8bf7e':'#c7baa2'}/>:
            <rect x={x-4} y={y-4} width="8" height="8" fill={type==='reserve'?'#837f71':'#d5ad71'} transform={`rotate(45 ${x} ${y})`}/>}
          <text x={x+offset[0]} y={y+offset[1]}>{label}</text></g>)}
      </svg>
    </div>
    <div className="atlas-key"><span>{!solar && staging?'Schematic · domains & scales compressed':solar?'Heliocentric · 1 AU = Earth orbit':'Earth-centred · Moon orbit ≈ 384,400 km'}</span>
      <span>{!solar && staging?'□ Warden   ▴ Quiver   ··· sampled links':solar?'Illustrative positions & arrival track':month>=8.4?'Illustrative sites · *Delta role proposed':'Illustrative works & cargo links'}</span></div>
  </section>;
}
