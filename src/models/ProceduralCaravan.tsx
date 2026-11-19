// Proposed visual proxy in shot units. Its dimensions do not establish canon.
export function ProceduralCaravan() {
  return <>
    <mesh><boxGeometry args={[2.35,.14,.16]}/><meshStandardMaterial color="#a99c87"/></mesh>
    {[-.75,-.28,.19,.66].map(x => <group key={x} position={[x,0,0]}>
      {[-1,1].map(side => <mesh key={side} position={[0,0,side*.22]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[.18,.18,.39,12]}/><meshStandardMaterial color="#b6afa1" roughness={.84}/>
      </mesh>)}
      <mesh><boxGeometry args={[.058,.42,.8]}/><meshStandardMaterial color="#665543"/></mesh>
    </group>)}
    {[-1,1].map(side => <group key={side} position={[-.86,side*.49,0]}>
      <mesh><boxGeometry args={[.07,.8,.06]}/><meshStandardMaterial color="#b8a27e"/></mesh>
      {[0,1,2].map(i => <mesh key={i} position={[0,side*i*.16,0]}><boxGeometry args={[.44,.145,.034]}/><meshStandardMaterial color="#696d6a" metalness={.35} roughness={.55}/></mesh>)}
    </group>)}
    <mesh position={[1.07,.055,0]}><boxGeometry args={[.27,.32,.33]}/><meshStandardMaterial color="#c5b59a"/></mesh>
  </>;
}
