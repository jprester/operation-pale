"""Caravan v002 • proposed visual study. Run with Blender --background --python."""
import argparse
import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.dont_write_bytecode = True
sys.path.insert(0, str(HERE.parent))
from spacecraft_export import export_asset
VERSION = "v002"
parser = argparse.ArgumentParser()
parser.add_argument("--metres-per-unit", type=float, default=5.0, help="Proposed model scale")
parser.add_argument("--samples", type=int, default=16)
parser.add_argument("--no-previews", action="store_true")
args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
S = args.metres_per_unit
if S <= 0 or args.samples < 1:
    raise ValueError("Scale and sample count must be positive")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.preferences.filepaths.save_version = 0
bpy.context.preferences.filepaths.file_preview_type = "NONE"
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1
ship = bpy.data.collections.new("Caravan • proposed visual prototype")
scene.collection.children.link(ship)
from industrial_kit import geometry_kit, make_studio, frame as frame_asset
from functools import partial
Assembly, materials = geometry_kit("caravan", S, ship)
frame = partial(frame_asset, collection=ship, scale=S, scene=scene)


def spine():
    m=Assembly("load-spine")
    m.hull([(-40,1.6,1.4),(39,1.6,1.4)],"graphite")
    for y in (-3.1,3.1):
        for z in (-2.7,2.7):
            m.rod((-39,y,z),(39,y,z),.34,"iron")
        for x in range(-37,37,6):
            m.rod((x,y,-2.7),(x+3,y,2.7),.19,"ash")
            m.rod((x+3,y,2.7),(x+6,y,-2.7),.19,"ash")
            m.rod((x,y,2.7),(x+6,-y,2.7),.13,"iron")
            m.rod((x,y,-2.7),(x,-y,-2.7),.18,"iron")
        m.rod((-36,y*.45,1.8),(38,y*.45,1.8),.32,"brass")
    m.build()


def pod_template(factory):
    m=Assembly("precision-workshop" if factory else "freight-cassette")
    l=6.8 if factory else 5.2
    m.hull([(-l,2.6,2.1),(-l+.7,3.3,2.85),(l-.8,3.3,2.85),(l,2.55,2.15)],"graphite")
    for index in range(3):
        x=(index-1)*(2*l-1)/3
        half=(2*l-1)/6-.12
        m.hull([(x-half,3.2,2.72),(x-half+.25,3.50,3.03),
                (x+half-.25,3.50,3.03),(x+half,3.2,2.72)],"ash" if factory and index==1 else "chalk")
        for sign in (-1,1):
            m.panel(x,sign*3.48,0,half*1.55,.22,2.1,"iron" if factory else "ash")
            for j in range(5):
                m.panel(x+(j-2)*half*.26,sign*3.62,0,.12,.16,1.5,"graphite")
        m.panel(x,0,3.07,half*1.62,3.1,.2,"porcelain")
    for x in (-l+.8,l-.8):
        m.hull([(x-.16,3.56,3.13),(x+.16,3.56,3.13)],"oxide")
    # Human-scale lock, step irons and lifting-point paint on both broad faces.
    for side in (-1,1):
        m.panel(-l+.88,side*3.56,-.54,.42,.09,.62,"graphite",.035)
        m.panel(-l+.88,side*3.62,-.54,.32,.055,.47,"ash",.025)
        for j in range(4):
            m.rod((-l+.73,side*3.64,-1.08-j*.17),(-l+1.03,side*3.64,-1.08-j*.17),.024,"iron")
        for j in range(3 if factory else 2):
            m.panel(l-1.4-j*.22,side*3.54,.97,.10,.055,.39,"oxide",.015)
    if factory:
        for y in (-1.15,1.15):
            m.turned([(-4,.49),(-3.65,.67),(3.65,.67),(4,.49)],"iron",y,3.60,16)
    return m.build()


def cargo():
    rack=Assembly("cargo-saddles")
    for factory,stations in [(True,[-16,1]),(False,[18])]:
        original=pod_template(factory)
        for j,(x,side) in enumerate((x,side) for x in stations for side in (-1,1)):
            if factory and x==1 and side==-1:
                continue  # Open process bed occupies this saddle.
            obj=original if j==0 else bpy.data.objects.new(original.name+"-linked",original.data)
            if j: ship.objects.link(obj)
            section = "aft" if x < 0 else "mid" if x < 10 else "fore"
            bank = "port" if side == 1 else "starboard"
            obj.name = f"{original.data.name}-{section}-{bank}"
            obj.location=(x*S,side*6.7*S,-2*S)
            for end in (-3,3):
                rack.rod((x+end,side*2.6,2.4),(x+end,side*7.0,.7),.36,"iron")
                rack.rod((x+end,side*2.7,-2.3),(x+end,side*7,-4.2),.25,"graphite")
    rack.build()


def habitation():
    m=Assembly("forward-habitat")
    m.hull([(30,2.9,2.2),(33,4.1,3.0),(40,4.7,3.38),(49,4.1,2.9),(53,2.4,1.7)],"graphite",z=1.2)
    for x,w,h in [(33,4.5,3.35),(36,4.9,3.7),(39,5.32,3.95),(42,5.2,3.83),(45,4.97,3.60),(48,4.65,3.34)]:
        m.hull([(x-.9,w*.95,h*.95),(x-.76,w,h),(x+1.6,w,h),(x+1.8,w*.95,h*.95)],"porcelain",z=1.45)
    m.hull([(47.5,4.7,3.35),(50,4.3,3.1),(54,2.75,2.0)],"chalk",z=1.4)
    m.hull([(35,2.1,.45),(37,3.25,1.15),(45,3.1,1.1),(49,2.1,.4)],"ash",z=5.05)
    m.hull([(38,2.85,.3),(39,3,.52),(45,2.88,.48),(47,2,.26)],"glass",z=5.92)
    m.hull([(38.1,2.92,.16),(39,3.08,.25),(45,2.94,.25),(47.1,1.99,.13)],"porcelain",z=6.42)
    # Surface access panels and narrow observation strips give the decks scale.
    for x,w,h in [(33,4.5,3.35),(36,4.9,3.7),(39,5.32,3.95),(42,5.2,3.83),(45,4.97,3.60),(48,4.65,3.34)]:
        for side in (-1,1):
            m.panel(x+.34,side*(w+.03),1.94,1.87,.13,.32,"graphite",.02)
            for k in range(4):
                m.panel(x-.33+k*.42,side*(w+.12),1.94,.24,.06,.14,"glass",.01)
            m.panel(x+.4,side*(w+.035),.66,1.7,.14,.73,"chalk")
    for side in (-1,1):
        for i in range(7):
            m.panel(38.8+i*.91,side*3,5.96,.12,.26,.66,"ash")
        m.panel(42.2,side*5.25,1.38,2.2,.18,.17,"oxide")
    # Umbilical gallery and capture jaws sit clear of the hab on its ventral side.
    m.hull([(27,1.2,.65),(30,2.5,1.2),(42,2.5,1.2),(44,1.4,.7)],"iron",z=-4.25)
    for x in (30,40):
        m.rod((x,0,-2),(x,0,-4.5),1.2,"graphite",12)
        for side in (-1,1):
            m.rod((x,side*1.5,-4.7),(x,side*3.3,-6.35),.45,"iron")
            m.rod((x,side*3.3,-6.35),(x+1,side*3.3,-6.35),.55,"brass")
    for y in (-2.2,2.2):
        m.rod((34,y,4.5),(31.8,y,8.1),.13,"iron")
    m.build()


def propulsion():
    m=Assembly("interstellar-drive-yoke")
    # Annular machinery with a visible annulus around the thrust frame.
    for x,r in [(-41,9.0),(-36.6,9.2)]:
        m.turned([(x-1,r-.4),(x-.6,r),(x+.65,r),(x+1,r-.35),(x+1,r-2.0),(x-1,r-2.0)],"iron",closed=True,sides=48)
    for i in range(18):
        a=i*math.tau/18
        c,s=math.cos(a),math.sin(a)
        def band(x,r,angle): return (x,r*math.cos(angle),r*math.sin(angle))
        # Individual cast housings bridge the two circular service galleries.
        rings=[]
        for x,r in [(-41.5,9.2),(-41,9.72),(-37.0,9.72),(-36.4,9.25)]:
            rings.append([band(x,r,a-.145),band(x,r,a+.145),band(x,7.6,a+.145),band(x,7.6,a-.145)])
        m.solid(rings,"ash" if i%3 else "chalk")
        m.rod((-40,7.6*c,7.6*s),(-33.5,3.4*c,3.4*s),.39,"graphite")
        m.rod((-37.8,9.6*c,9.6*s),(-40.2,9.6*c,9.6*s),.16,"brass")
    m.build()
    m=Assembly("fusion-manoeuvring-bank")
    m.turned([(-45,4.2),(-44,5.5),(-38,5.5),(-31,3.65)],"graphite",sides=24)
    for y,z in [(-3.15,-2.15),(3.15,-2.15),(0,3.2)]:
        m.turned([(-46,1.8),(-44,2.25),(-40,2.25),(-38.5,1.55)],"iron",y,z)
        # Return the profile into the throat to leave a recessed, unlit exhaust.
        m.turned([(-53,2.68),(-52.35,2.78),(-49.5,2.05),(-47,1.45),(-45.4,1.75),
                  (-45.4,1.06),(-47.6,1.04),(-52.8,2.30)],"graphite",y,z,32,True)
        m.turned([(-53.2,2.64),(-52.8,2.78),(-52.5,2.74),(-52.5,2.38),(-53.2,2.38)],"ash",y,z,32,True)
        for j in range(10):
            a=j*math.tau/10
            m.rod((-51.8,y+2.61*math.cos(a),z+2.61*math.sin(a)),(-46.5,y+1.54*math.cos(a),z+1.54*math.sin(a)),.095,"iron")
        for x in (-45,-43.8,-42.6):
            m.turned([(x-.17,2.35),(x+.17,2.35),(x+.17,2.1),(x-.17,2.1)],"oxide",y,z,24,True)
    m.build()


def radiators():
    # Independent leaves rotate about their own coolant-header hinge.
    # Splayed radiator leaves feed paired supply/return headers near machinery.
    for side in (-1,1):
        for x in (-31,-25.8):
            bank = "port" if side == 1 else "starboard"
            leaf = "aft" if x == -31 else "fore"
            m = Assembly(f"radiator-{bank}-{leaf}")
            root=Vector((x,side*3,2.1))
            def point(u,t,h):
                return root + Vector((u-t*3.5,side*(t*16),t*7.2+h))
            for u in (-1.93,1.93):
                m.rod(point(u,0,0),point(u,1,0),.22,"iron")
            for u in (-.18,.18):
                m.rod(point(u,-.12,0),point(u,1.0,0),.14,"oxide")
            m.rod(point(-1.95,0,0),point(1.95,0,0),.34,"iron",12)
            for j in range(8):
                t=.09+j*.112
                for u0,u1 in [(-2,-.24),(.24,2)]:
                    m.solid([[point(u0,t,h),point(u1,t,h),point(u1,t+.104,h),point(u0,t+.104,h)] for h in (-.09,.09)],"carbon")
                # Shallow heat pipes bridge the carbon emitter to the return header.
                m.rod(point(-1.85,t+.055,.126),point(1.85,t+.055,.126),.055,"iron")
            obj=m.build()
            obj.data.transform(Matrix.Translation(-root*S))
            obj.location=root*S
    mounts=Assembly("radiator-pump-gallery")
    for x in (-31,-25.8):
        for side in (-1,1):
            mounts.rod((x,side*1.8,0),(x,side*3,2.1),.44,"ash")
            mounts.rod((x-1.0,side*2.2,-1),(x+1.4,side*3,1.9),.22,"iron")
            mounts.panel(x,side*2.75,.48,1.4,.95,.88,"oxide")
    mounts.build()


def docking():
    m=Assembly("docking-transfer-node")
    m.hull([(23.4,3.1,2.5),(24.4,4.1,3.1),(27.8,4.1,3.1),(29,3.2,2.5)],"ash")
    for side in (-1,1):
        for near,far,r,mat in [(3.5,5.3,1.9,"graphite"),(5.3,5.9,2.2,"chalk"),(5.9,6.05,1.46,"carbon")]:
            m.rod((26,side*near,0),(26,side*far,0),r,mat,16)
        # Personnel lock and paired fluid couplers sit inside the cargo collar.
        m.rod((26,side*6.05,0),(26,side*6.12,0),.46,"ash",16)
        m.rod((26,side*6.12,0),(26,side*6.15,0),.31,"graphite",16)
        for dx in (-.85,.85):
            m.rod((26+dx,side*6.04,-.62),(26+dx,side*6.23,-.62),.12,"brass",8)
        for j in range(4):
            m.panel(25.62+j*.23,side*6.1,.93,.12,.08,.23,"chalk",.016)
        for angle in range(0,360,60):
            a=math.radians(angle)
            m.panel(26+1.8*math.cos(a),side*6.05,1.8*math.sin(a),.45,.4,.45,"brass")
    m.build()


def process_bed():
    m=Assembly("seed-industry-open-process-bed")
    x,y=1,-6.9
    m.hull([(-6.4,2.5,.65),(-5.7,3.35,.95),(7.7,3.35,.95),(8.4,2.5,.65)],"iron",y,-4.0)
    for rail in (-2.55,2.55):
        m.rod((-5.7,y+rail,-2.93),(7.6,y+rail,-2.93),.25,"brass")
        for end in (-5.35,7.15):
            m.rod((end,y+rail,-3.1),(end,y+rail,.85),.28,"graphite")
            m.rod((end,y+rail,.85),(end,y-rail,.85),.22,"ash")
    # A restrained machine tool: isolated bed, headstock, open traveller and rams.
    m.hull([(-4.8,1.6,1.25),(-4.3,2.05,1.55),(-1.4,2.05,1.55),(-1.1,1.55,1.1)],"oxide",y,-1.75)
    m.turned([(-1.2,1.03),(.25,1.03),(.35,.69),(2.8,.69)],"ash",y,-1.67)
    for end in (2.9,4.9):
        m.turned([(end,1.30),(end+.48,1.30),(end+.48,.73),(end,.73)],"chalk",y,-1.67,20,True)
        m.panel(end+.24,y,-2.91,1.15,2.9,.42,"iron")
    m.build()


def aft_services():
    m=Assembly("reaction-mass-and-transfer")
    for side in (-1,1):
        y=side*4.1
        m.turned([(-34.8,.9),(-34.1,1.83),(-33.1,2.22),(-26.2,2.22),(-25.2,1.83),(-24.5,.9)],"ash",y,-3.50,24)
        for x in (-32.7,-27.1):
            m.turned([(x-.27,2.28),(x+.27,2.28),(x+.27,2.12),(x-.27,2.12)],"chalk",y,-3.5,24,True)
            m.rod((x,y,-1.6),(x,side*2,0),.32,"graphite")
        m.rod((-34.8,y,-3.5),(-38,y,-3),.42,"iron")
        for dz in (-.16,.16):
            elbow=(-26.0,side*2.65,-1.6+dz)
            m.rod((-31.8,side*2.65,-1.6+dz),elbow,.09,"iron")
            m.rod(elbow,(-24.8,side*2.7,-.52+dz),.09,"iron")
    m.build()


def identifiers():
    # Original geometric stencil. Mesh strokes keep the GLB independent of fonts.
    paths={
        "C":[[(.68,1),(0,1),(0,0),(.68,0)]],
        "A":[[(0,0),(.33,1),(.66,0)],[(.15,.39),(.52,.39)]],
        "R":[[(0,0),(0,1),(.64,1),(.64,.56),(0,.56)],[(.24,.56),(.69,0)]],
        "V":[[(0,1),(.34,0),(.68,1)]],
        "N":[[(0,0),(0,1),(.67,0),(.67,1)]],
    }
    m=Assembly("habitat-identification")
    m.panel(40.65,-2.36,6.66,5.1,1.22,.16,"graphite")
    for i,char in enumerate("CARAVAN"):
        for path in paths[char]:
            for a,b in zip(path,path[1:]):
                def pos(p): return (38.4+.70*i+.62*p[0],-2.69+.70*p[1],6.76)
                m.rod(pos(a),pos(b),.04,"porcelain",4)
    m.build()


spine()
cargo()
habitation()
propulsion()
radiators()
docking()
process_bed()
aft_services()
identifiers()

# Give rigid systems local selection pivots. Linked pod origins and heat-panel
# hinge origins were set by their assemblies and already carry meaningful offsets.
root=bpy.data.objects.new("caravan-root",None)
ship.objects.link(root)
for obj in ship.objects:
    if obj.type != "MESH":
        continue
    if obj.location.length == 0:
        pivot=sum((Vector(corner) for corner in obj.bound_box),Vector())/8
        obj.data.transform(Matrix.Translation(-pivot))
        obj.location=pivot
    obj.parent=root
export_asset(ROOT/f"public/models/spacecraft/caravan-{VERSION}.glb", ship, materials,
             version=VERSION, generator="assets/spacecraft/caravan/generate.py")
camera=make_studio(scene, S, args.samples)
views=[("side",(0,-1,0),1600,495,0),("top",(0,0,1),1600,700,math.pi),
       ("three-quarter",(-.80,-1.32,.78),1600,810,-.13)]
scene["status"]="Proposed visual design and dimensions. Original procedural geometry."
scene["proposed_metres_per_design_unit"]=S
frame(camera,*views[-1][1:])
# Make the asset visible immediately on opening the authoring file.
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type=="VIEW_3D":
            area.spaces.active.clip_end=400*S
            area.spaces.active.region_3d.view_perspective="CAMERA"
bpy.ops.wm.save_as_mainfile(filepath=str(HERE/f"caravan-{VERSION}.blend"),compress=True)
if not args.no_previews:
    (HERE/"previews").mkdir(exist_ok=True)
    for name,*view in views:
        frame(camera,*view)
        scene.render.filepath=str(HERE/"previews"/(name+".png"))
        bpy.ops.render.render(write_still=True)

    # Keep the same illustrated ship for reduced motion and WebGL-unavailable viewers.
    scene.render.film_transparent=True
    scene.render.image_settings.file_format="WEBP"
    scene.render.image_settings.color_mode="RGBA"
    scene.render.image_settings.quality=87
    scene.render.resolution_percentage=60
    scene.render.filepath=str(ROOT/f"public/art/caravan-{VERSION}.webp")
    bpy.ops.render.render(write_still=True)
