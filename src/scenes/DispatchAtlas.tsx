import { atlasSites, belt, caravanArrival, earth, localOrbits, solarOrbits, sun, type Point } from '../data/atlas';

const worlds = atlasSites('solar', 0);
const solarEarth = worlds.find(site => site.label === 'Earth')!.p;
const moon = atlasSites('local', 0).find(site => site.label === 'Moon')!.p;
const mining: Point = [326, 102];
const reserve: Point = [377, 161];
const workshops: Point = [308, 137];

function progress(time: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (time - start) / (end - start)));
}

// The moving package follows the same quadratic curve as its drawn trail.
function Transfer({ from, bend, to, fraction, label, color, offset = [8,-9] }: {
  from: Point; bend: Point; to: Point; fraction: number; label: string; color: string; offset?: Point;
}) {
  if (fraction <= 0) return null;
  const u = 1 - fraction;
  const control = from.map((v,i) => u*v + fraction*bend[i]);
  const point = from.map((v,i) => u*u*v + 2*u*fraction*bend[i] + fraction*fraction*to[i]);
  return <g>
    <path d={`M${from} Q${control} ${point}`} fill="none" stroke={color} strokeWidth="1.25" opacity=".8"/>
    <path d="m0 -3.6 3.6 3.6-3.6 3.6-3.6-3.6z" transform={`translate(${point})`} fill={color}/>
    {fraction===1 && label && <text x={to[0]+offset[0]} y={to[1]+offset[1]}>{label}</text>}
  </g>;
}

export function DispatchAtlas({time,reduced}:{time:number; reduced:boolean}) {
  const stage=(a:number,b:number)=>reduced?Number(time>=(a+b)/2):progress(time,a,b);
  const zoom=stage(108.3,111);
  const local=stage(109.8,111.4);
  const scale=1+zoom*3;
  const cx=260+(solarEarth[0]-260)*zoom;
  const cy=140+(solarEarth[1]-140)*zoom;
  return <section className="solar-atlas dispatch-atlas" aria-label="Caravan cargo dispatch">
    <div className="atlas-field"><svg viewBox="0 0 520 280" role="img" aria-label={local>.5?'Workshop packages arriving in the space between Earth and the Moon':'Caravan dispatching mining equipment, a reserve, and workshop packages'}>
      {local<1 && <g opacity={1-local} transform={`translate(${260+(earth[0]-260)*zoom} ${140+(earth[1]-140)*zoom}) scale(${scale}) translate(${-cx} ${-cy})`}>
        {solarOrbits.map(r=><ellipse key={r} cx={sun[0]} cy={sun[1]} rx={r} ry={r*.52} fill="none" stroke="#79715b" strokeWidth=".55"/>)}
        {belt.map(([x,y],i)=><circle key={i} cx={x} cy={y} r=".6" fill="#998e75"/>)}
        {worlds.map(site=><g key={site.label}><circle cx={site.p[0]} cy={site.p[1]} r={site.label==='Sun'?7:4} fill={site.label==='Earth'?'#8dbaca':'#d3bc93'}/><text opacity={1-zoom} x={site.p[0]+site.offset[0]} y={site.p[1]+site.offset[1]}>{site.label}</text></g>)}
        <g opacity={1-zoom}><text className="atlas-region" x="127" y="99">MAIN BELT</text>
          <path d="m-6 3 5-8 8 1-5 5z" transform={`translate(${caravanArrival})`} fill="#eee3c8"/>
          <text x="421" y="49" textAnchor="end">Caravan</text>
        </g>
        <Transfer from={caravanArrival} bend={[362,63]} to={mining} fraction={stage(97.8,101)} label="Mining equipment" color="#e5b779"/>
        <Transfer from={caravanArrival} bend={[414,130]} to={reserve} fraction={stage(101.2,104.5)} label="Belt Reserve" color="#adafa8"/>
        <Transfer from={caravanArrival} bend={[295,67]} to={solarEarth} fraction={stage(106.5,110.2)} label="" color="#9acdc6"/>
      </g>}
      {local>0 && <g opacity={local}>
        {localOrbits.map(r=><ellipse key={r} cx={earth[0]} cy={earth[1]} rx={r} ry={r*.52} fill="none" stroke="#79715b" strokeWidth=".65"/>)}
        <circle cx={earth[0]} cy={earth[1]} r="11" fill="#8dbaca"/><text x={earth[0]-18} y={earth[1]+30}>Earth</text>
        <circle cx={moon[0]} cy={moon[1]} r="5" fill="#d3c8b6"/><text x={moon[0]+11} y={moon[1]+4}>Moon</text>
        <text className="atlas-region" x="238" y="94">CISLUNAR SPACE</text>
        <Transfer from={[510,55]} bend={[397,49]} to={workshops} fraction={stage(110,113.5)} label="Workshop packages" color="#9acdc6" offset={[7,16]}/>
        {time>=115.5 && <g aria-label="Asteroid material delivered from the belt">
          <path d="M486 213 Q371 241 308 137" fill="none" stroke="#b29470" strokeDasharray="2 4"/>
          <text x="392" y="238" textAnchor="middle">From the belt</text>
          {[0,.65,1.25].map((delay,i)=>{
            const f=stage(115.5+delay,119.2+delay), u=1-f;
            const x=u*u*486+2*u*f*371+f*f*308, y=u*u*213+2*u*f*241+f*f*137;
            return <path key={i} d="m-4 -2 3-2 4 1 1 3-3 3-4-1z" transform={`translate(${x} ${y+i*4})`} fill="#d2b58e" stroke="#51483a"/>;
          })}
        </g>}
      </g>}
    </svg></div>
    <div className="atlas-key"><span>{local>.5?'Earth–Moon space':'Solar System'}</span><span>Illustrative routes · distances compressed</span></div>
  </section>;
}
