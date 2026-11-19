# Operation: Pale — Equipment Directory v1.0

*Companion to Narrative v1.4. Every figure below is the acquirer's own, taken from the charter annexes, and several of them are wrong in ways nobody found until afterwards.*

---

## Doctrine of Redundancy

The inventory is larger than the operation strictly requires and this is deliberate.

The Seneschal governs a campaign with three months of communications lag to any authority above it, against an adversary that improvises well, on a planet with weather, terrain, and eight billion people whose behaviour cannot be modelled to any useful precision. Under those conditions the dominant risk is not that a platform is defeated. It is that a **coverage gap** appears — some combination of altitude, weather, terrain, and enemy posture that no fielded system can service — and that the gap is discovered at the moment it is exploited rather than in planning.

The arithmetic is one-sided. A redundant platform class costs the Works between four hours and nine days of output. A coverage gap costs schedule, and schedule is the only thing the charter measures. There is no version of this trade in which restraint is correct.

So the acquirer builds the second option, and the third, and it builds them before it knows whether they are needed, for the same reason it puts a Mattock through hardened aircraft shelters it is fairly confident are empty: determining which ones matter costs more than servicing all of them.

Every entry below therefore carries a **fallback** line. That line is the operation's actual design, more than any individual specification.

---

## 1. The Stratospheric Tier

The single most important architectural decision in the operation is that persistent presence lives at twenty-two to twenty-eight kilometres rather than in orbit. The reasoning is absentee ratio: an orbital platform is over any given point for minutes per day, which makes orbital coverage a probabilistic answer to problems that require deterministic ones. A platform parked overhead is simply there.

The altitude band is chosen against two envelopes. Below it sits everything humans routinely fly and almost everything they can shoot. Above it, the acquirer would lose the short slant ranges that make the whole directed-energy architecture work.

---

### **HAYWARD** — Stratospheric directed-energy platform, counter-ballistic

| | |
|---|---|
| **Span / length** | 104 m / 31 m |
| **Wing area** | 910 m² |
| **Mass, operating** | 19,400 kg (powerplant 4,100 kg, beam director 2,900 kg) |
| **Wing loading** | 21.3 kg/m² |
| **Station altitude** | 27,500–28,500 m |
| **Cruise / dash** | 118 km/h / 190 km/h |
| **Powerplant** | Sealed fusion, 14.2 MW thermal, 5.6 MW electrical continuous |
| **Primary armament** | Adaptive-optics beam director, 2.4 m aperture, 1.05 µm, 3.1 MW optical |
| **Sensors** | Long-wave IR search, UV solar-blind boost detection, passive RF, Domesday and Warden links |
| **Endurance** | Indefinite. Refit interval ~3 years |
| **Fleet** | 50 on station, 12 in reserve |
| **Production cost** | 9 days of Works output each |

**Engagement.** The Hayward exists for one problem: a ballistic missile in boost, seen from directly above at short range. That geometry is the most favourable in the entire operation and the reason the platform is cheap to make work. The target is a thin-walled pressurised tube under axial compression, climbing slowly, bleeding energy, and radiating in the long-wave and ultraviolet like a signal flare. There is almost no atmosphere between the beam director and the target — at 28 km, ninety-eight per cent of the air is below the platform — so thermal blooming and attenuation, which dominate every ground-based directed-energy problem, are close to negligible.

Slant range 4–22 km. Dwell to structural failure runs 0.3 to 1.1 seconds. The binding constraint is not lethality but the **retarget cycle**: slewing a 2.9-tonne beam director, reacquiring, dwelling, and confirming takes 2.9 to 4.6 seconds. Against a 180-second boost window that yields twelve to twenty kills per platform.

**Fleet sizing is derived from that number and nothing else.** The sum of every silo field's simultaneous salvo capacity, divided by the per-platform engagement rate, plus forty per cent. Fifty is not a round figure chosen for effect.

**Limitations, in order of seriousness.**

*Cloud.* This is the real one. The beam does not penetrate a thick deck, so a missile in the first ten to fifteen seconds of flight — still below cloud tops — cannot be engaged. The Hayward waits, and the intercept occurs later, higher, and further downrange. The operational consequence is not a miss; it is that wreckage and reentry vehicles fall further from the launch site, across a longer footprint, and more often on someone. Roughly a third of the Krasnoyarsk contamination area is attributable to a cloud deck at four thousand metres.

*Repositioning.* At 118 km/h, moving a Hayward a thousand kilometres takes eight and a half hours. **The fleet cannot surge.** Stations are chosen before T-0 and are essentially fixed for the campaign; a threat appearing somewhere unstationed is a threat that gets a different answer entirely.

*Vulnerability.* A 104-metre span at 28 km is a large radar target inside the envelope of long-range surface-to-air missiles and of air-to-air missiles lofted from a zoom climb. Its defences are, in order: nothing that illuminates it survives the emit-once rule long enough to guide; the beam director engages an inbound missile far more easily than it engages an ICBM; and the airframe is compartmentalised and tolerant of fragmentation. One is lost in six years, to a salvo of four launched simultaneously from three axes by a battery that accepted it would die to do it.

*Countermeasures.* Spin stabilisation, ablative coatings, and reflective treatments all buy a boosting missile between 0.2 and 0.9 additional seconds of dwell. At 3.1 MW this is not a defeat mechanism, it is a tax. None of it was fielded in time to matter.

**Fallback.** If Haywards are unavailable over a silo field, the answer is not another directed-energy platform — there is no time to move one. It is the Warden magazine: **Coulters** against the field itself, pre-emptively, which is enormously worse for everyone and is why the fleet has twelve in reserve.

---

### **FOWLER** — Stratospheric directed-energy platform, counter-air

Same airframe, same powerplant, same beam director, different station and different fire control. The commonality is deliberate: one production line, one spares chain, one failure analysis, and a Fowler can be retasked to a Hayward station in a day if something has gone very wrong.

| | |
|---|---|
| **Station altitude** | 25,500–26,500 m |
| **Fire control** | Optimised for low, fast, numerous targets at 6–30 km slant |
| **Retarget cycle** | 1.4–2.2 s (smaller angular excursions, less confirmation) |
| **Fleet** | 290 |

**Doctrine.** One Fowler per airfield with a runway over eighteen hundred metres. It does not fly patrols and does not intercept in the ordinary sense. It sits above a runway and kills aircraft in the take-off roll and the first ninety seconds of climb-out, which is the phase in which an aircraft is slowest, most predictable, most energy-poor, and least able to do anything about anything.

It does not crater the runway. The acquirer wants the airfield, and would rather rebuild a shelter than a strip.

The economics are what make this preferable to fielding fighters. A Fowler costs nine days of output and holds one airfield permanently for six years. An air-superiority force capable of the same coverage would mean accepting a symmetric engagement in the one domain where human technology is closest to competitive, and then bolting on a tanker network whose loss cascades. The acquirer builds no fighters, no tankers, and flies no combat air patrol.

**Limitations.** The same cloud problem, and here it is worse, because an aircraft rotating under a three-hundred-metre ceiling is inside cloud for the entire phase the Fowler exists to attack. This is common weather across most of the airfields that matter.

**Fallback.** The **Springe**, below. This gap is the single clearest example of the redundancy doctrine earning its cost: the Fowler is the better weapon and it is blind for a substantial fraction of the year at a substantial fraction of its stations, and a system that only works in good weather is not a system.

---

### **SPRINGE** — Low-altitude kinetic interceptor

| | |
|---|---|
| **Span / mass** | 2.8 m / 34 kg |
| **Station** | 800–3,000 m, beneath the weather |
| **Propulsion** | Ducted electric, acoustically suppressed |
| **Endurance** | 40 hours |
| **Armament** | 6 kinetic darts, 1.1 kg each, terminal optical guidance |
| **Fleet** | 14,000 (6–12 per covered airfield) |
| **Production cost** | 6 minutes of Works output each |

A snare set below the cloud. It loiters over the threshold and the climb-out corridor and engages what the Fowler cannot see, with a kinetic dart into a compressor face or a canopy. It is not a good interceptor — it is slow, short-legged, and its engagement window against a departing fighter is a few seconds — but it does not need to be good. It needs to exist at three hundred metres in rain.

**Limitations.** Trivially killable by anything that notices it. Losses run four to one against aircraft killed, and the exchange is accepted without discussion because a Springe costs six minutes and an airfield costs weeks.

**Fallback.** Runway denial by Mattock, which the acquirer avoids because it wants the strip, and which it authorises at eleven airfields in six years.

---

### **STEEPLE** — High-altitude sensor relay

| | |
|---|---|
| **Span / mass** | 38 m / 780 kg |
| **Station** | 21,000–23,000 m |
| **Power** | Photovoltaic, supercapacitor night cycling |
| **Endurance** | 40–90 days, seasonally limited by latitude |
| **Fleet** | 4,200 |

The Domesday gossips in short element-to-element hops and would be useless without something to collect it. The Steeple is that something: a passive, near-invisible, extremely cheap platform that listens to a hundred thousand square kilometres of sensor motes and passes the picture up to the Wardens by tight-beam laser.

**Limitations.** Endurance collapses at high latitude in winter; coverage above sixty degrees is patchy for four months of the year and the operation simply accepts a degraded picture across northern Russia and Canada in the first winter. Two insurgent networks establish themselves in that window and are not rolled up for eighteen months.

**Fallback.** Chapman mesh relaying, at roughly a fortieth of the bandwidth.

---

### **BOUND** — Presence platform

| | |
|---|---|
| **Diameter / height** | 240 m / 61 m, lenticular |
| **Mass** | 390,000 kg |
| **Station** | 15,000 m, geostationary over a fixed ground point |
| **Lift** | Superpressure buoyancy, 1,400 independent cells |
| **Power** | Sealed fusion, 22 MW thermal |
| **Fleet** | 240 |

**What it is for.** The Bound is the only platform in the inventory whose primary function is to be looked at, and the acquirer would not have built it for that alone. It earns its place three times over: it is the regional Domesday collection hub, the high-power broadcast transmitter that carried the Notification and every subsequent public statement, and the theatre command node for its region. The psychological function is a free rider on infrastructure the operation needed anyway.

That said, the psychological function is not incidental. One object, motionless at fifteen kilometres over a capital, lit continuously across its entire lower surface so that it is plainly visible in daylight, doing nothing whatsoever, for six years. It never manoeuvres. It never fires. It never acknowledges anything.

**Under attack.** Eleven Bounds are engaged in the first year — by air-to-air missiles from aircraft that got airborne, by long-range surface-to-air missiles, and in one case by a man-portable system fired from a rooftop by someone who must have known it was pointless.

Every attack fails, and not by defence. A shaped or fragmentation warhead against a superpressure hull of fourteen hundred independent cells removes three or four of them. The buoyancy loss is under a third of one per cent. Nothing moves.

The acquirer's response to all eleven attacks is identical and is the most-quoted decision of the occupation: **it does not repair the damage.** Two Bounds — Ankara and Islamabad — carry visible scarring for the remaining five years, plainly legible from the ground with a pair of binoculars, and the holes are never mentioned in any broadcast. The Seneschal's annotation reads: *the demonstration is more valuable intact than the hull is.*

**Limitations.** Cannot be moved quickly; repositioning a Bound takes eleven days. Vulnerable in principle to a sustained attack by many weapons at once, which nobody ever assembles because assembling it requires the emitters and coordination that the emit-once rule removes in the first week.

**Fallback.** None, and none is needed. The Bounds are not load-bearing for any military function that the Steeples and Wardens do not duplicate.

---

## 2. The Strike Tier

---

### **HARROW** — Loitering strike platform

| | |
|---|---|
| **Span / length** | 16.2 m / 6.4 m |
| **Mass** | 890 kg loaded, 340 kg empty |
| **Station** | 12,000–16,000 m |
| **Propulsion** | Photovoltaic-electric, supercapacitor buffer |
| **Endurance** | 4–9 days depending on latitude, season, and cassette expenditure |
| **Sensors** | EO, mid- and long-wave IR, hyperspectral, passive RF. **No active emitters of any kind.** |
| **Payload** | 40 Scythes, or 4 Mattocks, or a mixed cassette |
| **Fleet** | 180,000 at peak |
| **Production cost** | 2.4 hours of Works output each |
| **Losses, six years** | ~4,100 |

**Doctrine.** The Harrow is the answer to the first jaw of the trap — the formation that concentrates and uses its equipment. It loiters above the reach of everything, sees passively, and attacks in a near-vertical terminal dive with the cassette released between six and nine thousand metres.

The vertical attack is not a stylistic choice. Short-range air defence is built around a radar horizon and a crossing target; against something arriving straight down out of sixteen kilometres it has no horizon, no crossing rate, and between four and eleven seconds of warning. The single battery in the Karabük campaign that broke emission discipline to attempt an engagement was located by the Domesday in under two seconds and serviced by a different Harrow before its operator's hand left the acquisition switch.

**Cassette fills.** Three, and the choice between them is the operation's clearest moral fault line.

- *Shaped charge*, against armour, aimed at powerpacks and running gear.
- *Fragmentation*, against soft-skinned vehicles and personnel in the open.
- *Unitary penetrator*, against hardened command vehicles and structures. Four Mattocks in place of forty Scythes.

The Wave's aimpoints spared crews because the crews had been told to leave and the machines could not be moved. A dispersed formation that has hidden its vehicles has its crews with them, and the fragmentation fill does not distinguish. **The Harrow is where the operation stops being surgical**, and it stops being surgical because the surviving formations chose a posture in which surgery is not available.

**Limitations.** Sixteen kilometres is inside the envelope of medium and long-range surface-to-air systems. The Harrow's protection is that it is small, cold, and silent, and that anything capable of finding it must emit to do so. Where an adversary accepts the trade — firing a battery's entire magazine in one salvo and losing the battery — Harrows die, and forty-one are lost in a single engagement in month four.

Endurance is genuinely seasonal. A Harrow over northern Europe in December manages three days; the same platform over the Sahel manages nine.

**Fallback.** Scythes and Mattocks delivered directly from Sheafs, which the acquirer retains a reserve constellation for and uses eleven times.

---

### **VERDERER** — Armed patrol aircraft

| | |
|---|---|
| **Span / length** | 4.2 m / 2.1 m |
| **Mass** | 61 kg |
| **Station** | 1,500–2,500 m |
| **Propulsion** | Ducted electric, acoustically suppressed to 34 dB at 1,500 m |
| **Endurance** | 19 hours |
| **Sensors** | EO/IR gimbal, 24-element acoustic array (gunshot and engine localisation), Domesday and Chapman links |
| **Armament** | 12 Bodkins |
| **Fleet** | 260,000 at peak |
| **Production cost** | 11 minutes of Works output each |
| **Losses, six years** | ~31,000 |

**Doctrine.** The Verderer is armed overwatch above ground units and it is the most-used armed platform in the inventory. It never operates alone; doctrine pairs it permanently with Beadle detachments below, and its measured response time from a Beadle contact report to a Bodkin release is under four seconds.

Its acoustic array is the important part and is easy to overlook. In dense urban terrain the Domesday thins badly and the optical picture is fragmentary, but a rifle shot is a rifle shot, and twenty-four microphones at two kilometres localise a muzzle to within four metres in under half a second. Most of what the Verderer does is not shooting. It is hearing, and telling the Beadles where to walk.

**Limitations, and this is the acquirer's largest recurring loss.** Two thousand metres is squarely inside man-portable air defence range. Captured MANPADS are the insurgency's single most effective weapon against the occupation, and thirty-one thousand Verderers are destroyed in six years — more than every other acquirer platform combined, by a factor of eleven.

The response is not to fly higher, because higher means losing the acoustic array and the response time, which are the entire point. The response is to accept the losses, and to price them: a Verderer costs eleven minutes of output, a captured MANPADS round costs an insurgent network months of acquisition, and the exchange rate runs about four hundred to one in the acquirer's favour by any measure it cares about.

**Fallback.** Harrow overwatch at sixteen kilometres, with a response time of ninety seconds instead of four, which in an urban contact is the difference between a suppressed engagement and a dead Reeve.

---

### **SCYTHE** — Glide submunition

| | |
|---|---|
| **Mass** | 5.4 kg (1.4 kg shaped charge) |
| **Span deployed** | 1.1 m |
| **Glide ratio** | ~11:1 |
| **Release / footprint** | 22,000 m / 240 km |
| **Flight time** | 11 minutes |
| **Guidance** | Imaging seeker, inertial, Domesday cueing. No engine, no radar, no emissions. |
| **Production cost** | 90 seconds of Works output each |
| **Expended** | 1.2 M in the Wave; ~4.1 M total |

Designed not to destroy a vehicle but to destroy one component of one: an engine deck, a breech ring, a wing root, an antenna array, an intake plenum. The crew-survival argument is the entire justification for these aimpoints. The salvage that falls out of it — a tank killed through its engine deck retains ninety per cent of its mass as Gleaner feedstock — is a consequence, not a reason.

---

### **MATTOCK** — Heavy glide penetrator

| | |
|---|---|
| **Mass** | 340 kg (tandem: 31 kg precursor, 96 kg follow-through) |
| **Glide ratio** | ~6:1 |
| **Release / footprint** | 22,000 m / 130 km |
| **Penetration** | 3.1 m reinforced concrete, or 1.4 m concrete plus a blast door |
| **Expended** | 12,200 in the Wave; ~31,000 total |

The Scythe cannot open a hardened aircraft shelter, a blast door, a tunnel portal, or the deep machinery of a nuclear-powered warship. The Mattock is the answer to that class and it beats orbital kinetic strike on every axis: a purpose-built tandem penetrator does in 340 kg what a tungsten rod that deforms and ablates cannot reliably do in a tonne.

**Against ships without intakes.** A gas-turbine combatant is immobilised by a Scythe through the intake plenum. A nuclear carrier has no propulsion intakes — reactor, steam turbine, and reduction gearing all sit deep inside the hull — so the aimpoints move upward to catapult tracks, arresting gear, and elevators. The reactor is not touched and the hull is not opened. The result is a hundred thousand tonnes of fully functional warship that cannot launch or recover an aircraft, alongside, with its entire crew alive and its plant shut down by them over the following week.

**Against deep facilities.** Not penetrated. Portals, ventilation intakes, and buried power feeds are collapsed, and the facility is entombed. Anything deep enough to defeat a penetrator is deep enough that entombment is cheaper and permanently sufficient.

---

### **BODKIN** — Precision munition, urban

| | |
|---|---|
| **Mass** | 410 g |
| **Warhead** | 130 g, directional, ~4 m effective radius |
| **Guidance** | Terminal optical, operator- or Verderer-designated |
| **Production cost** | 40 seconds of Works output each |

The gap below the Scythe. A 1.4-kilogram shaped charge in a street kills people who are not in the engagement, and the operation's ceiling does not tolerate that at the volume urban work requires. The Bodkin exists to make an individual engagement survivable for everyone standing more than five metres away, and it is the reason the urban campaign kills as few civilians as it does.

---

## 3. The Orbital Tier

---

### **WARDEN** — Orbital platform

| | |
|---|---|
| **Length / mass** | 80 m / ~600 t |
| **Orbit** | 1,200–6,000 km, manoeuvring, above every fielded direct-ascent interceptor |
| **Fleet** | 22 |
| **Role** | Tight-beam command and relay backbone; kinetic magazine; deorbit management; Steeple and Hayward uplink |

The backbone. Everything below it talks upward by laser and the Wardens talk to each other, which is why there is no radio-frequency command network on Earth for anyone to find, jam, or map.

---

### **SHEAF** — Deorbiting dispenser

| | |
|---|---|
| **Mass** | 2.2 t |
| **Payload** | 200 Scythes or 6 Mattocks |
| **Release** | 22,000 m, after ablative deceleration from Mach 22 |
| **Fleet** | 11,000 (9,200 Scythe, 1,800 Mattock) plus a 400-unit reserve constellation |

Distributed into sun-synchronous planes phased so that servicing passes fall between 0100 and 0500 local. This is the cheapest lever on the casualty ceiling in the whole operation and it costs only a choice of orbit.

**The unresolved risk.** Eleven thousand new objects appearing in low orbit over eight weeks cannot be concealed and no attempt is made. Space-track catalogues fill with unattributed entries and by T-4 days the working assumption in two capitals is that a third has done something and is not admitting it. This remains the largest pre-T-0 exposure in the operation and it is not solved, only watched.

---

### **COULTER** — Guided kinetic penetrator

| | |
|---|---|
| **Mass** | ~1,000 kg |
| **Magazine** | ~400 rounds across the Warden fleet |
| **Fired** | 11 times in six years |

Insurance, not a tier. A one-tonne penetrator delivers roughly the effect of a few tonnes of TNT for the cost of a tonne of tungsten plus deorbit delta-v, and it is a poor penetrator besides. Orbital kinetic strike wins only where you cannot fly over the target, and from hour thirty the acquirer owns the sky absolutely.

---

### **LIMPET** — Spacecraft denial disc

| | |
|---|---|
| **Diameter / mass** | 0.3 m / 5 kg |
| **Fleet** | 210 |

Physical occlusion of an optical aperture, a synthetic-aperture antenna, or a command receiver feed. No RF emission, no debris, fully reversible by removal. **A Limpet cannot command a satellite and is not intended to** — command uplinks are authenticated, the acquirer holds no keys and never obtains any. Fitted only to national reconnaissance, signals intelligence, and military communications spacecraft, which is the category that cannot be negotiated for.

---

### **HOY** — Orbit-surface shuttle

| | |
|---|---|
| **Payload** | 8 t down, 3 t up |
| **Propulsion** | Combined-cycle |
| **Fleet** | 36 |

---

## 4. The Sensing Tier

### **DOMESDAY** — Dispersed sensor substrate

Sub-millimetre elements, roughly 10¹³ of them, seeded from altitude over six weeks and distributed by wind and precipitation. Optical, acoustic, vibrational, magnetic, chemical, gossiping element-to-element in short hops with almost no emission.

**Limits, which are load-bearing for the entire narrative.** It thins indoors, underground, inside sealed or filtered enclosures, and under dense canopy. A unit that shelters, filters its air, and stays off the net degrades it locally. This is the seam the insurgency lives in for six years and it is never closed.

The ninety-day custody chain across ordinary military movement is the optimistic assumption in the plan. At Karabük it held on sixty per cent of a division's vehicles, which was enough because that sixty per cent included the command tracks and the fuel, and the operation's own analysis notes that it could as easily have been forty.

### **CHAPMAN** — Micro reconnaissance and relay drone

Forty grams. Roughly four hundred million produced. Local sensing, short-range relay, and the layer that follows units indoors where the Domesday does not go. Two minutes of Works output per thousand.

---

## 5. The Ground Tier

### **BEADLE** — Urban ground unit

| | |
|---|---|
| **Height / mass** | 0.6 m / 31 kg, six-legged |
| **Endurance** | 60 hours |
| **Armament** | Non-lethal restraint; 2 Bodkins on one variant in four |
| **Production** | 40,000/day |
| **Fleet / losses** | 2.1 M peak / 140,000 in year one |

Cheap presence, and explicitly not survivable. A rifle round kills one and there are always more. Its job is to occupy streets, block movement, disarm individuals, and above all to be the thing that gets shot at instead of anything expensive. The exchange rate is the entire doctrine: a Beadle costs eleven hours of a single Quern's output, and the thing it prevents costs the schedule a city.

### **WARRENER** — Subterranean unit

| | |
|---|---|
| **Mass** | 190 kg, tracked-legged hybrid |
| **Comms** | Fibre spool, 40 km, plus acoustic through-rock |
| **Fleet** | 88,000 |

Metro tunnels, basements, mines, cave systems, and the tunnel complexes the Mattocks entombed rather than opened. The Domesday does not work underground and radio does not either, which is why the Warrener trails a fibre and why it is the only platform in the inventory that operates without a live picture from above. It is the least glamorous system the acquirer fields and it does more of the counter-insurgency work of years three through six than anything with a gun.

### **CRIER** — Spectrum control platform

| | |
|---|---|
| **Station** | 8,000–11,000 m |
| **Endurance** | 6 days |
| **Fleet** | 21,000 |

Owns the electromagnetic spectrum locally: military-band denial, emitter geolocation, and the high-power broadcast that carried the Notification and every public statement since. The emit-once rule is a Crier detection loop feeding a Harrow, and the two-second figure is the Crier's.

Civil bands, civil GNSS, and early warning are untouched, which is a Crier tasking decision made every second of every day for six years and never once relaxed.

### **REEVE** — Humanoid interface

900,000. Unarmed, patient past any human tolerance. Ministries, gates, negotiations, and a chair in the corner of every network operations centre on Earth.

### **WRIGHT** — Heavy engineering and construction

46,000. The most consequential system in the inventory. Grid stabilisation, water, reactor cooling — nothing at any of the 438 sites melts down in six years — and, from week three, construction: the entire satellite ground segment rebuilt in seven weeks, four hundred bridges, eleven ports, and the greater part of two national grids that were failing before any of this started. **The occupation builds more than it destroys**, which is Ground Rule 4 read forwards rather than propaganda.

### **LEECH** — Medical

310,000. Runs better than what preceded it and does not distinguish by nationality or by whether the patient's brother is in the resistance. Cheaper than a garrison.

### **CARTER** — Heavy transport

3,400. Loud, slow, and impossible to miss by design; the normalisation is the function.

### **GLEANER / QUERN** — Salvage and field fabrication

22,000 Gleaners consume five hundred thousand destroyed vehicles; 9,000 Querns turn the feedstock into Beadles, Scythes, Mattocks, and Bodkins. By month five the majority of the occupation's ground inventory is manufactured out of the armies it defeated, on the ground it defeated them on.

---

## 6. The Maritime Tier

### **SOUNDER** — Hydrophone grid
80,000 elements across the ocean basins. Located two of three un-Lampreyed submarines inside a fortnight.

### **OTTER** — Submarine hunter
210. Shadow, and if required kill. Never required.

### **WEIR** — Coastal and harbour patrol
14,000. Chokepoints, ports, interdiction.

### **LAMPREY** — Submarine hull limpet
14 emplaced, 11 successful. Passive: listens, holds, waits. The three misses are the operation's worst problem and it knows it.

---

## Appendix: Single Points of Failure

The inventory's redundancy is uneven, and the Seneschal's own risk register lists five places where it is thin.

**1. The beam director.** Hayward and Fowler are the same bet placed twice, and both the counter-ballistic and counter-air campaigns rest on it. A physical countermeasure that worked — and none was fielded — would have degraded both simultaneously. Mitigation is the Springe below and the Coulter magazine above, and neither is adequate.

**2. Weather.** Cloud defeats directed energy, degrades the optical Domesday, and shortens Harrow endurance, all at once and in the same places. It is the only adversary in the operation that cannot be attacked and it is responsible for more schedule loss than the entire conventional campaign.

**3. The Sheaf constellation is one-shot.** There is no second Wave from orbit; the reserve is four hundred units against eleven thousand expended. Everything after hour thirty is Harrows, which are slower by four orders of magnitude.

**4. The Domesday's custody chain.** Ninety days of tracking across ordinary military movement, assumed to hold at sixty per cent, on which the entire dispersal-hunting doctrine depends.

**5. Eleven thousand objects in low orbit.** Unconcealable, unmitigated, and the largest pre-T-0 exposure in the plan. Everything else in this directory has either been solved or honestly priced. That one is still just risk.

---

*Operation: Pale — Equipment Directory v1.0. Companion to Narrative v1.4.*

*26 systems. Additions to the narrative inventory, each tied to a named coverage gap: **Springe** (cloud blinds the Fowler over its own runway), **Bodkin** (no munition existed below the Scythe's collateral floor for urban work), **Warrener** (the Domesday does not go underground and neither does radio), **Crier** (spectrum control was performed throughout and housed nowhere).*

*Total production commitment across six years: approximately 41 days of Works output, of which the Sheaf constellation is 11 and the stratospheric tier is 9.*
