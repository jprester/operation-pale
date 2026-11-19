import { useState } from 'react';
import { verification } from '../data/verification';
const clamp = (n: number) => Math.max(0, Math.min(1,n));

function Demonstration({ seconds, reduced }: { seconds: number; reduced: boolean }) {
  // Illustrative screen coordinates. Contact occurs during the second narration cue.
  const progress = reduced ? (seconds < 8 ? 0 : 1) : clamp((seconds-1)/7);
  const contact = reduced ? (seconds >= 8 ? 1 : 0) : clamp((seconds-8)/2.8);
  const start=[87,62], control=[282,64], end=[390,206];
  const point=(axis:number)=>(1-progress)**2*start[axis]+2*(1-progress)*progress*control[axis]+progress**2*end[axis];
  return <div className="demo-shot"><svg viewBox="0 0 560 320" role="presentation">
    <defs><linearGradient id="terrain" x2=".3" y2="1"><stop stopColor="#686557"/><stop offset="1" stopColor="#191b16"/></linearGradient></defs>
    <path d="M0 89 Q100 43 220 51" stroke="#877d68" fill="none" strokeWidth=".8"/>
    <circle cx="87" cy="62" r="4" fill="#bca98a"/>
    <text x="94" y="51">Orbit</text>
    <path d="M0 210 Q260 153 560 225 L560 320H0Z" fill="#30332a"/>
    <path d="M0 232 Q230 169 560 231V320H0Z" fill="url(#terrain)"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M0 ${239+i*14} Q255 ${173+i*10} 560 ${243+i*14}`} stroke="#b2a88d" opacity=".22" fill="none"/>)}
    <path d="M357 210l10-12h40l12 13z" fill="#494b42" stroke="#c5bea9"/>
    <path d="M87 62Q282 64 390 206" pathLength="1" stroke="#8d8169" strokeDasharray=".008 .017" fill="none"/>
    <path d="M87 62Q282 64 390 206" pathLength="1" stroke="#e1bd8c" strokeWidth="2" strokeDasharray="1" strokeDashoffset={1-progress} fill="none"/>
    {progress<1 && <circle cx={point(0)} cy={point(1)} r="3.6" fill="#f5dbc0"/>}
    {contact>0 && <g><ellipse cx="390" cy="206" rx={5+contact*36} ry={2+contact*9} fill="none" stroke="#e7c89d" opacity={1-contact}/>
      {[0,1,2,3,4,5,6].map(i=><circle key={i} cx={390+(i-3)*contact*5} cy={204-contact*(12+(i%3)*5)} r={2+contact*6} fill="#b6b09b" opacity={.48*(1-contact)}/>)}
      <circle cx="390" cy="206" r="3" fill="#d1ab7b"/></g>}
    <path d="M419 210l20-20h73" stroke="#aa9c85" fill="none"/><text x="512" y="182" textAnchor="end">Empty shelter</text>
  </svg><div className="shot-label">{seconds<8?'T+0:05 / BULLETIN':'T+0:10 / DEMONSTRATION'}<br/><strong>{progress<1?'Announced site':'Contact recorded'}</strong></div></div>;
}

export function VerificationRecord({reduced}: {reduced: boolean}) {
  const [seconds,setSeconds] = useState(0);
  const cue = verification.narration.find(line => seconds >= line.start && seconds < line.end);
  return <details className="verification-record"><summary>Verification · illustrated record</summary>
    <div className="verification-frame">{seconds < 15 ? <Demonstration seconds={seconds} reduced={reduced}/> :
      <div className="record-plate"><small>T+0:12 · Identity package</small><strong>{seconds < 21 ? 'Public key issued' : seconds < 25 ? 'Signed response' : 'Observable confirmation'}</strong></div>}</div>
    <input type="range" aria-label="Verification record position" min={0} max={30} value={seconds} onChange={event=>setSeconds(event.currentTarget.valueAsNumber)}/>
    <p>{cue?.transcript ?? 'Independent observation establishes a verifiable sender.'}</p>
  </details>;
}
