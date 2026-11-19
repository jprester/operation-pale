import {useState, type ReactNode} from 'react';
import manifest from '../../public/art/documentary/manifest.json';

export const documentaryPhotos=manifest;
type Photo=typeof manifest[number];
const base='/art/documentary/';
const clamp=(x:number)=>Math.max(0,Math.min(1,x));

function Exposure({photo,time,reduced}:{photo:Photo;time:number;reduced:boolean}){
  const [failed,setFailed]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const t=reduced?.5:clamp((time-photo.start)/(photo.end-photo.start));
  const drift=photo.motion==='push'?0:(t-.5)*(photo.motion==='pan-left'?-5:5);
  const zoom=photo.motion==='push'?1+.06*t:1.065;
  const slate = <div className="photo-slate"><span>Reconstruction plate</span>
    <strong>{photo.caption}</strong><p>{photo.description}</p><small>{failed || photo.status==='missing' ? 'Photograph unavailable' : 'Loading photograph'}</small></div>;
  if(failed || photo.status==='missing')return slate;
  return <>{!loaded && slate}<img src={base+photo.filename} srcSet={base+photo.smallFilename+' 640w, '+base+photo.filename+' 1440w'}
    sizes={photo.composition==='full'?'100vw':'(max-width:760px) 96vw, 54vw'}
    onLoad={()=>setLoaded(true)} onError={()=>setFailed(true)} alt={photo.description} style={{transform:`scale(${zoom}) translateX(${drift}%)`}}/></>;
}

export function DocumentaryInsert({photo,time,reduced,comparison,externalFade=false}:{photo:Photo;time:number;reduced:boolean;comparison?:ReactNode;externalFade?:boolean}){
  const incoming=reduced || externalFade?1:clamp((time-photo.start)/.8);
  const previous=documentaryPhotos.find(item=>item.end===photo.start);
  return <figure className={'doc-photo doc-'+photo.composition}>
    <div className="doc-emulsion">
      {previous && incoming<1 && <div className="doc-exposure" aria-hidden="true"><Exposure key={previous.id} photo={previous} time={previous.end} reduced={reduced}/></div>}
      <div className="doc-exposure" style={{opacity:incoming}}><Exposure key={photo.id} photo={photo} time={time} reduced={reduced}/></div>
      {photo.atmosphere && <div className="doc-vignette" style={{transform:reduced?undefined:`scale(1.07) translateX(${(clamp((time-photo.start)/(photo.end-photo.start))-.5)*3}%)`}}/>}
    </div>
    {photo.composition==='split' && <div className="doc-comparison">{comparison}</div>}
    <figcaption><small>{photo.reconstruction}</small>{photo.caption}</figcaption>
  </figure>;
}
