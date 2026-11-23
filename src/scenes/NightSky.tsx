import {resolveAnchor} from '../data/film/edl';
import './night-sky.css';

const catalogueStart = resolveAnchor({at:'C0-01'});
const entriesStart = resolveAnchor({at:'C0-08'});
const buildTime = resolveAnchor({at:'C0-09'}) - entriesStart;
const tracks = [
  {id:'7318',at:0,y:211,dy:-72,span:31},
  {id:'4902',at:2.1,y:112,dy:96,span:24},
  {id:'6841',at:5,y:284,dy:-94,span:34},
  {id:'2507',at:7.4,y:155,dy:75,span:27},
  {id:'9526',at:10.1,y:252,dy:-130,span:36},
  {id:'3674',at:13.5,y:94,dy:119,span:25},
  {id:'5083',at:15.8,y:318,dy:-84,span:29},
];
const fraction = (n:number) => n-Math.floor(n);
const noise = (n:number) => fraction(Math.sin(n*74.53+5)*24531.73);

// Fixed exposures on the cue clock. A backward seek samples the same sky.
type Streak = {at:number;x:number;y:number;dx:number;dy:number;span:number;bright:boolean};
const streaks: Streak[] = [];
for (let i=0, at=.35; at<resolveAnchor({at:'C0-11'})-entriesStart; i++) {
  const bright = i===0 || (i%16===0 && at>7);
  const x=65+noise(i+7)*845, y=36+noise(i+60)*295;
  // Extend lines away from one vanishing point beyond the left edge.
  const angle=i%6===3 ? .8+noise(i+16) : Math.atan2(y+90,x+390);
  const length=(bright?105:36)+noise(i+19)*45;
  streaks.push({at,x,y,dx:Math.cos(angle)*length,dy:Math.sin(angle)*length,
    span:bright?1.14:.45+.5*noise(i+72),bright});
  at+= .44+.13*noise(i+1)+1.7*Math.max(0,1-at/buildTime);
}
function Trail({s,progress,still}:{s:Streak;progress:number;still:boolean}) {
  const head=still?1:progress;
  const tail=still?0:Math.max(0,head-.64);
  const dx=s.dx*(head-tail), dy=s.dy*(head-tail);
  return <g transform={`translate(${s.x+s.dx*tail} ${s.y+s.dy*tail})`}
    opacity={(s.bright?.95:.64)*(still?1:Math.min(1,progress*8,(1-progress)*6))}>
    <path d={`M0 0L${dx} ${dy}`} stroke="url(#entry-tail)" strokeWidth={s.bright?2.2:1.25} strokeLinecap="round"/>
  </g>;
}

export function NightSky({mode,seconds,reduced}:{mode:'catalogue'|'entries';seconds:number;reduced:boolean}) {
  const local=seconds-(mode==='catalogue'?catalogueStart:entriesStart);
  const rows=reduced?tracks:tracks.filter(t=>local>=t.at);
  return <div className="plate ground-sky" data-sky={mode}>
    <img style={{opacity:reduced || mode==='entries'?1:Math.min(1,seconds/.65)}} src="/art/documentary/night-farmland.webp" srcSet="/art/documentary/night-farmland-640.webp 640w, /art/documentary/night-farmland.webp 1672w"
      sizes="100vw" alt="A moonless sky above a low horizon of fields and distant lights."/>
    <svg className="sky-tracks" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="entry-tail"><stop stopColor="#b7c7d4" stopOpacity="0"/><stop offset=".7" stopColor="#c9d8de" stopOpacity=".7"/><stop offset="1" stopColor="#fff1d8"/></linearGradient></defs>
      {mode==='catalogue' ? rows.map((t,i)=>{
        const f=reduced?.18+i*.074:(local-t.at)/t.span;
        const x=3+f*1000,y=t.y+f*t.dy;
        return reduced?<path key={t.id} d={`M${x-14} ${y-2}Q${x} ${y} ${x+13} ${y+t.dy*.013}`} fill="none" stroke="#dfe8ee" strokeOpacity=".8"/>:
          <circle key={t.id} cx={x} cy={y} r="1.85" fill="#e6ecea"/>;
      }):streaks.map((s,i)=>{
        const progress=(local-s.at)/s.span;
        if(reduced?i>=20:progress<=0||progress>=1) return null;
        return <Trail key={i} s={s} progress={progress} still={reduced}/>;
      })}
    </svg>
    {mode==='catalogue' && rows.length>0 && <ol className="sky-catalogue" aria-label="Illustrative space catalogue">
      {rows.map(t=><li key={t.id}><strong>UNCORRELATED TRACK {t.id}</strong><span> · NO LAUNCH RECORD · NO OWNER</span></li>)}
    </ol>}
    <span className="plate-caption">Artistic reconstruction</span>
  </div>;
}

export function TrackingDisplay() {
  return <figure className="ground-tracking"><figcaption>PREDICTED RE-ENTRY · MULTIPLE OBJECTS</figcaption>
    <svg viewBox="0 0 300 120" role="img" aria-label="Predicted paths converge on the Earth's limb">
      <path d="M-5 126Q145 47 316 110" fill="none" stroke="#acc4ca" strokeWidth="2"/>
      {[0,1,2,3,4,5].map(i=><path key={i} d={`M${17+i*42} ${10+(i%3)*5} Q${82+i*33} ${30+i*2} ${102+i*22} ${87+(i-2)**2*.36}`}
        fill="none" stroke="#e6c08c" strokeDasharray="4 4"/>)}
    </svg></figure>;
}
