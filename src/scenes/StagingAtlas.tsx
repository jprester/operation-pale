import { earth,orbitPoint } from '../data/atlas';
import { reviewDays,stagedFraction,type StagingKind } from '../data/staging';

export function StagingOverlay({kind,time}:{kind:StagingKind;time:number}) {
  const progress=stagedFraction(time);
  const relay=['relay','countdown','tableau'].includes(kind);
  const [ex,ey]=earth;
  return <g>
    {time>=221 && <g stroke="#ddcba2" fill="none">
      <ellipse cx={ex} cy={ey} rx="95" ry="49.4" strokeDasharray="3 6" opacity=".55"/>
      {Array.from({length:1+Math.floor(progress*3)},(_,i)=>{
        const [x,y]=orbitPoint(earth,95,i*1.9+.42);
        return <rect key={i} x={x-3} y={y-3} width="6" height="6"/>;
      })}
    </g>}
    {kind!=='relay' && time>=223 && <g fill="#94c7d5">
      {[0,1].map(lane=><g key={lane} transform={'rotate('+(lane?22:-18)+' '+ex+' '+ey+')'}>
        <ellipse cx={ex} cy={ey} rx={49+lane*15} ry={(49+lane*15)*.52} fill="none" stroke="#94c7d5" opacity=".4"/>
        {Array.from({length:2+Math.floor(progress*8)},(_,i)=>{
          const [x,y]=orbitPoint(earth,49+lane*15,i*2.4+lane);
          return <g key={i} transform={'translate('+x+' '+y+')'}><path d="M0 -3l3 5h-6z"/>
            {kind==='assignment' && !lane && !i && <circle r="9" stroke="#f7d798" fill="none"/>}</g>;
        })}
      </g>)}
    </g>}
    {relay && <g transform={'translate('+ex+' '+ey+')'} stroke="#d1b494" fill="none">
      <path d="M-14 -1q14 -24 29 0" strokeDasharray="3 2"/><path d="M13 -9l45 -33h48" strokeWidth=".7"/>
      <text x="59" y="-46">Lantern</text>
    </g>}
    {kind==='relay' && <g>
      <text x="315" y="173">Warden · orbit</text>
      <g transform="translate(22 207)"><rect width="216" height="53" fill="#181e1b" stroke="#5e6455"/>
        <path d="M6 47Q96 25 209 46" fill="none" stroke="#839d9f"/><path d="M17 40Q98 17 196 39" fill="none" stroke="#c6af8e" strokeDasharray="3 3"/>
        <text x="9" y="16">Stratosphere · detail</text><circle cx="108" cy="29" r="3" fill="#d9caae"/></g>
    </g>}
    {kind==='tableau' && <path d="M155 164q11 21 27 27" stroke="#dfc8bb" strokeDasharray="2 4" fill="none"/>}
    {kind==='countdown' && <text x="34" y="39">T−{reviewDays(time)} DAYS</text>}
    {kind==='assignment' && <g transform="translate(358 29)"><rect width="134" height="36" fill="#191c17" stroke="#8c826b"/>
      <circle cx="13" cy="17" r="5" fill="none" stroke="#c4ab85"/><text x="25" y="22">Reserved site</text></g>}
  </g>;
}
