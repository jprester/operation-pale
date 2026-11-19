"""Generate proposed Foundry branch models and preview plates in background Blender."""
import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE.parent))
from industrial_kit import frame, geometry_kit, make_studio
from spacecraft_export import export_asset

ROLES = {
    "alpha": "Volatile processing, water storage and propellant production",
    "beta": "Metals refining and bulk fabrication",
    "gamma": "Large-scale assembly and integration",
    "delta": "Provisional cargo exchange and dispatch yard",
}
VERSION = "v001"


def lattice(m, start, end, width, bays, radius=.22):
    """Four chords and alternating diagonal webs along an arbitrary trestle."""
    a, b = Vector(start), Vector(end)
    axis = (b-a).normalized()
    cross = axis.cross(Vector((0,0,1)) if abs(axis.z) < .9 else Vector((0,1,0))).normalized()
    up = cross.cross(axis)
    corners = [(cross*u+up*v)*width/2 for u,v in [(1,1),(-1,1),(-1,-1),(1,-1)]]
    for j, offset in enumerate(corners):
        other = corners[(j+1)%4]
        m.rod(a+offset,b+offset,radius,"ash")
        for i in range(bays):
            p = a.lerp(b,i/bays)
            q = a.lerp(b,(i+1)/bays)
            m.rod(p+offset,p+other,radius*.65,"iron")
            u,v = (offset,other) if i%2 else (other,offset)
            m.rod(p+u,q+v,radius*.67,"graphite")
        m.rod(b+offset,b+other,radius*.65,"iron")


class Site:
    def __init__(self, key, scale):
        self.key, self.scale = key, scale
        self.prefix = "foundry-"+key
        self.collection = bpy.data.collections.new(self.prefix)
        bpy.context.scene.collection.children.link(self.collection)
        self.part, self.materials = geometry_kit(self.prefix,scale,self.collection)
        self.root = bpy.data.objects.new(self.prefix+"-root",None)
        self.collection.objects.link(self.root)

    def install(self, part, placements):
        """Linked rigid modules with local mounting origins and semantic node names."""
        original = part.build()
        for i,(name,position,yaw) in enumerate(placements):
            obj = original if i==0 else bpy.data.objects.new(name,original.data)
            if i: self.collection.objects.link(obj)
            obj.name = self.prefix+"-"+name
            obj.parent = self.root
            obj.location = Vector(position)*self.scale
            obj.rotation_euler.z = yaw
        return original

    def mount(self, part, position=(0,0,0)):
        return self.install(part,[(part.name,position,0)])


def vertical(m,x,y,profile,mat,sides=20):
    m.solid([[(x+r*math.cos(i*math.tau/sides),y+r*math.sin(i*math.tau/sides),z)
              for i in range(sides)] for z,r in profile],mat)


def utilities(site, x, cooling):
    """Two solar blankets on a tracking boom and separate manifold-fed radiator fins."""
    m=site.part("photovoltaic-yoke")
    lattice(m,(0,-19,0),(0,19,0),1.7,9)
    for side in (-1,1):
        m.rod((0,side*7,0),(0,side*19,2),.34,"iron")
    site.mount(m,(x,0,1))
    m=site.part("solar-blanket")
    m.rod((-12,0,0),(12,0,0),.22,"brass")
    for i in range(6):
        for j in (-1,1):
            xx=-10+i*4
            m.panel(xx,j*3.3,0,3.83,6.35,.19,"glass")
            m.rod((xx-1.85,j*.2,-.13),(xx-1.85,j*6.5,-.13),.095,"ash")
    site.install(m,[(f"solar-{side}",(x,y,1),0) for side,y in [("port",22),("starboard",-22)]])
    m=site.part("thermal-collector")
    for i in range(cooling):
        y=(i-(cooling-1)/2)*2.15
        # Upright double-sided emitters above the pump gallery, with branching heat pipes.
        m.solid([[(-3,y+d,0),(4,y+d,0),(5.6,y+d,8),(-1.5,y+d,10)] for d in [-.12,.12]],"carbon")
        m.rod((-2,y,0),(-1,y,9.2),.15,"oxide")
        for z in (2,4.3,6.6):
            m.rod((-1.8,y-.16,z),(3.9,y-.16,z),.065,"iron")
    m.panel(.5,0,-.35,8,cooling*2.25,1.1,"ash")
    for xx in (-2.7,2.7):
        m.rod((xx,-cooling,0),(xx,cooling,0),.28,"oxide")
    site.mount(m,(x+7,0,2))


def berth(site, mounts):
    m=site.part("freight-berth")
    lattice(m,(0,0,0),(5,0,0),2.7,2)
    m.turned([(4.8,2),(5.3,2.6),(6.1,2.6),(6.15,1.78)],"chalk",sides=20)
    m.turned([(6.1,1.72),(6.24,1.72)],"graphite",sides=20)
    for side in (-1,1):
        m.rod((2,side*1.4,-1),(6.3,side*3,-1.4),.33,"ash")
        m.rod((6.3,side*3,-1.4),(7.4,side*2.8,-1.4),.31,"brass")
    site.install(m,mounts)


def alpha(site):
    m=site.part("fluid-transfer-spine")
    lattice(m,(-48,0,0),(50,0,0),4.5,17,.34)
    for y in (-1.2,1.2):
        m.rod((-42,y,2.7),(46,y,2.7),.56,"oxide")
    for x in (-19,0,19):
        lattice(m,(x,-10,0),(x,10,0),2.5,4)
    site.mount(m)
    tank=site.part("insulated-reservoir")
    profile=[(-7.9,.84),(-7.3,2.9),(-5.9,5),(-3.8,6.5),(0,7.2),(3.8,6.5),(5.9,5),(7.3,2.9),(7.9,.84)]
    tank.turned(profile,"chalk",sides=32)
    for x,r in [(-4,6.46),(0,7.24),(4,6.46)]:
        tank.turned([(x-.12,r+.08),(x+.12,r+.08),(x+.12,r-.24),(x-.12,r-.24)],"ash",sides=32,closed=True)
    tank.turned([(7.8,.76),(8.35,.76)],"brass",sides=12)
    site.install(tank,[(f"water-vessel-{i+1}-{s}",(x,y,1),0) for i,x in enumerate((-19,0,19))
                       for s,y in [("port",10),("starboard",-10)]])
    piping=site.part("tank-valve-manifold")
    for x in (-19,0,19):
        for sign in (-1,1):
            inlet=(x+8.35,sign*10,1)
            elbow=(x+8.8,sign*10,1)
            collector=(x+8.8,sign*1.2,2.7)
            piping.rod(inlet,elbow,.37,"ash")
            piping.rod(elbow,collector,.28,"oxide")
            piping.rod((x+8.8,sign*3,2.6),(x+8.8,sign*3,3.7),.25,"iron")
            piping.panel(x+8.8,sign*3,3.78,1.1,.72,.19,"brass")
    site.mount(piping)
    m=site.part("separation-plant")
    m.panel(0,0,1,10,11,3.8,"ash")
    for y,h in [(-3,12),(0,16),(3,10)]:
        vertical(m,0,y,[(2,1.3),(2.4,1.55),(h,1.55),(h+.65,1)],"porcelain")
        for z in range(4,h,3):
            vertical(m,0,y,[(z,1.61),(z+.25,1.61)],"iron")
        m.rod((1.6,y,3),(1.6,y,h-.3),.21,"brass")
    site.mount(m,(35,0,0))
    utilities(site,-42,4)
    berth(site,[("tanker-collar",(50,0,0),0)])


def beta(site):
    m=site.part("mill-transfer-line")
    lattice(m,(-47,0,-2),(47,0,-2),5,15,.35)
    m.panel(8,0,1,66,7,1.6,"iron")
    for x in range(-15,43,3):
        m.rod((x,-3.5,2),(x,3.5,2),.48,"ash",10)
    m.panel(26,0,2.72,22,1.9,.5,"brass")
    site.mount(m)
    furnace=site.part("reduction-vessel")
    vertical(furnace,0,0,[(-2,2.1),(1,4.9),(4,5.9),(10,5.9),(13,4),(15,2)],"oxide",20)
    for z,r in [(2.4,5.55),(5.3,6.1),(9,6.1),(13,4.1)]:
        vertical(furnace,0,0,[(z,r),(z+.62,r)],"iron",20)
    for j in range(8):
        a=j*math.tau/8
        furnace.rod((6*math.cos(a),6*math.sin(a),4),(6*math.cos(a),6*math.sin(a),10),.30,"ash")
    vertical(furnace,0,0,[(14.8,2.3),(16,2.3),(16.3,1.8)],"chalk")
    site.install(furnace,[("reduction-pot-a",(-24,7,0),0),("reduction-pot-b",(-8,7,0),0)])
    m=site.part("furnace-cradles")
    for x in (-24,-8):
        for dx in (-2.8,2.8):
            lattice(m,(x+dx,0,-2),(x+dx,7,-2),1.55,2,.18)
            m.rod((x+dx,7,-2),(x+dx,8,2),.35,"ash")
    site.mount(m)
    m=site.part("sealed-feed-conveyor")
    lattice(m,(-37,0,0),(-24,7,14),2.6,5)
    m.rod((-24,7,14),(-8,7,14),.9,"ash")
    for x in (-24,-8):
        m.rod((x,7,1),(x+5,0,2),1.05,"graphite",12)
    site.mount(m)
    press=site.part("rolling-stand")
    for y in (-4.7,4.7):
        press.hull([(-1.7,1,4),(-1.4,1.3,4.5),(1.4,1.3,4.5),(1.7,1,4)],"chalk",y,3.8)
    press.panel(0,0,8.2,4,11.2,2,"ash")
    press.rod((0,-4.7,4),(0,4.7,4),1.05,"iron",16)
    site.install(press,[(f"rolling-stand-{i+1}",(x,0,0),0) for i,x in enumerate((3,12,22))])
    utilities(site,-41,7)
    berth(site,[("billet-dispatch",(47,0,-2),0)])


def gamma(site):
    m=site.part("twin-build-ways")
    for y in (-14,14):
        lattice(m,(-47,y,0),(47,y,0),4,15,.32)
        m.rod((-46,y,2.3),(46,y,2.3),.33,"brass")
    for x in (-40,-16,8,32):
        lattice(m,(x,-14,-2),(x,14,-2),2.7,5)
    site.mount(m)
    gantry=site.part("portal-trolley")
    for y in (-14,14):
        gantry.panel(0,y,3.1,6,4.6,1.6,"oxide")
        lattice(gantry,(0,y,4),(0,y,17),2.8,3)
    lattice(gantry,(0,-15,17),(0,15,17),3.6,6,.29)
    gantry.panel(0,-3,16.2,4.6,5.4,2.8,"chalk")
    for y in (-4.4,-1.6):
        gantry.rod((0,y,15),(0,y,10.8),.21,"iron")
    gantry.panel(0,-3,10.5,3.6,4.1,.8,"brass")
    site.install(gantry,[("traverser-a",(-21,0,0),0),("traverser-b",(16,0,0),0)])
    work=site.part("assembly-jig")
    for x in range(-27,30,8):
        for y in (-8,8):
            work.rod((x,y,0),(x,y*.7,4.5),.46,"oxide")
        work.turned([(x-.44,6.1),(x+.44,6.1),(x+.44,5.4),(x-.44,5.4)],"ash",z=5.2,sides=12,closed=True)
    for y,z in [(0,11.25),(5.2,8.2),(-5.2,8.2)]:
        work.rod((-27,y,z),(29,y,z),.27,"chalk")
    # A partly skinned article distinguishes the jig from a row of empty rings.
    for x in (-26.5,-18.5):
        for a,b in [(1.03,1.54),(1.60,2.08),(2.14,2.62)]:
            rings=[]
            for end in (x,x+7.4):
                rings.append([(end,r*math.cos(t),5.2+r*math.sin(t))
                              for r,t in [(6.18,a),(6.18,b),(5.93,b),(5.93,a)]])
            work.solid(rings,"chalk")
    site.mount(work)
    m=site.part("power-crosshead")
    lattice(m,(-40,-14,0),(-40,14,0),3.2,5)
    site.mount(m)
    utilities(site,-40,3)
    berth(site,[("supply-berth",(47,-14,0),0),("handoff-berth",(47,14,0),0)])


def delta(site):
    m=site.part("transfer-hub")
    vertical(m,0,0,[(-4,5),(-2.8,8),(2.4,8),(3.9,6.2)],"chalk",12)
    vertical(m,0,0,[(-.6,8.2),(.8,8.2)],"iron",12)
    vertical(m,0,0,[(3.8,4.8),(5.1,4.8)],"ash",12)
    site.mount(m)
    pier=site.part("dispatch-pier")
    lattice(pier,(6,0,0),(44,0,0),3.3,8)
    pier.panel(24,0,2.1,35,4.2,.67,"ash")
    for side in (-1,1):
        pier.rod((8,side*1.8,2.55),(43,side*1.8,2.55),.16,"brass")
        for x in (13,22,31):
            pier.rod((x,side*1.3,0),(x,side*5.8,.8),.43,"iron")
            pier.panel(x,side*5.1,2,7.1,4.8,3,"chalk")
            pier.panel(x,side*5.1,3.6,.72,4.8,.32,"oxide")
    angles=[math.radians(a) for a in (0,120,240)]
    site.install(pier,[(f"dispatch-pier-{i+1}",(0,0,0),a) for i,a in enumerate(angles)])
    arm=site.part("transfer-loader")
    lattice(arm,(0,0,4),(0,0,10),2,2)
    lattice(arm,(0,0,10),(4,6,10),1.6,3)
    arm.rod((4,6,10),(4,6,5),.21,"brass")
    arm.panel(4,6,4.9,3.2,2.1,.55,"graphite")
    site.install(arm,[(f"transfer-loader-{i+1}",(21*math.cos(a),21*math.sin(a),0),a) for i,a in enumerate(angles)])
    berth(site,[(f"freighter-collar-{i+1}",(44*math.cos(a),44*math.sin(a),0),a) for i,a in enumerate(angles)])
    utilities(site,-43,3)
    m=site.part("utility-feed")
    lattice(m,(-43,0,0),(-6,0,0),2.9,7)
    site.mount(m)


def generate(key, build, scale, samples):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.preferences.filepaths.save_version=0
    bpy.context.preferences.filepaths.file_preview_type="NONE"
    scene=bpy.context.scene
    scene.unit_settings.system="METRIC"
    site=Site(key,scale)
    build(site)
    folder=HERE/key
    previews=folder/"previews"
    previews.mkdir(parents=True,exist_ok=True)
    stem=site.prefix+"-"+VERSION
    glb=ROOT/"public/models/foundries"/(stem+".glb")
    export_asset(glb,site.collection,site.materials,version=VERSION,generator="assets/spacecraft/foundries/generate.py")
    meta=glb.with_suffix(".json")
    record=json.loads(meta.read_text())
    record.update(role=ROLES[key], roleStatus="provisional" if key=="delta" else "canon-v2.0")
    record["axes"]={"up":"+Y","primaryServiceAxis":"+X"}
    record["dependencies"]["geometryKit"]="assets/spacecraft/industrial_kit.py"
    meta.write_text(json.dumps(record,indent=2)+"\n")
    camera=make_studio(scene,scale,samples)
    views=[("side",(0,-1,0),0),("top",(0,0,1),math.pi),("three-quarter",(.65,-1.20,.80),-.06)]
    if key=="delta":
        views[-1]=("three-quarter",(-.13,-1,1.27),-.04)
    def compose(direction,roll):
        frame(camera,direction,1280,720,roll,collection=site.collection,scale=scale,scene=scene)
    compose(*views[-1][1:])
    scene["role"]=ROLES[key]
    scene["status"]="Proposed industrial layout and metric dimensions"
    bpy.ops.wm.save_as_mainfile(filepath=str(folder/(stem+".blend")),compress=True)
    for name,look,roll in views:
        compose(look,roll)
        scene.render.filepath=str(previews/(name+".png"))
        bpy.ops.render.render(write_still=True)
    scene.render.film_transparent=True
    scene.render.image_settings.file_format="WEBP"
    scene.render.image_settings.color_mode="RGBA"
    scene.render.resolution_percentage=65
    scene.render.filepath=str(ROOT/"public/art"/(stem+".webp"))
    bpy.ops.render.render(write_still=True)


builders={"alpha":alpha,"beta":beta,"gamma":gamma,"delta":delta}
parser=argparse.ArgumentParser()
parser.add_argument("--branch",choices=[*builders,"all"],default="all")
parser.add_argument("--metres-per-unit",type=float,default=6)
parser.add_argument("--samples",type=int,default=12)
args=parser.parse_args(sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else [])
if args.metres_per_unit<=0 or args.samples<1:
    parser.error("scale and sample count must be positive")
for key,build in builders.items():
    if args.branch in (key,"all"):
        generate(key,build,args.metres_per_unit,args.samples)
