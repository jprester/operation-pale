import {lazy,Suspense,useState} from 'react';
import {introAssets} from '../data/assets';
import {SceneBoundary} from './SceneBoundary';
const SpaceScene=lazy(()=>import('./EarthScene'));
function CarrierDrawing() {
  return <svg className="carrier-drawing" viewBox="0 0 400 240" aria-hidden="true">
    <g transform="rotate(-13 200 120)" stroke="#bbae99" strokeWidth="1.7" fill="#494b42">
      <path d="M47 114h286l17 8-17 9H47z"/><path d="M93 53v135" strokeWidth="4"/>
      {[45,65,155,175].map(y=><rect key={y} x="67" y={y} width="53" height="15"/>)}
      {[115,162,209,256].map(x=><g key={x}><rect x={x} y="90" width="42" height="26" rx="7"/><rect x={x} y="124" width="42" height="26" rx="7"/><path d={`M${x+18} 88v64`}/></g>)}
    </g></svg>;
}

export function SpaceView({ carrier, seconds, render3D }: { carrier: boolean; seconds: number; render3D: boolean }) {
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const fail = () => setLost(true);
  return <div className={carrier ? 'carrier-shot' : 'earth-shot'}>
    {!carrier && <div className="orbits"><i/><i/><i/></div>}
    <div className={carrier ? 'carrier-frame' : 'planet-frame'}>
      {(!ready || lost || !render3D) && (carrier ? (posterFailed ? <CarrierDrawing/> : <img alt="" src={introAssets.caravanPoster.src}
        className="carrier-poster" onError={()=>setPosterFailed(true)}/>) : <div className="earth-still" style={{backgroundImage: `url(${introAssets.earthPoster.src}), radial-gradient(circle at 24% 27%, #8197a2, #213c57 48%, #090e17 78%)`}}/>)}
      {render3D && !lost && <SceneBoundary onLost={fail}><Suspense fallback={null}><SpaceScene carrier={carrier} seconds={seconds} onReady={()=>setReady(true)} onLost={fail}/></Suspense></SceneBoundary>}
    </div>
    {carrier && <div className="shot-label">OUTER SOLAR SYSTEM<br/><strong>Caravan</strong></div>}
  </div>;
}
