"""Build the sealed Quiver exterior, cargo tug and public-facing freight cradle."""
import argparse
import sys
from pathlib import Path

import bpy

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.dont_write_bytecode = True
sys.path.insert(0,str(HERE.parent))
from industrial_kit import geometry_kit, make_studio, frame
from spacecraft_export import export_asset

def quiver(part, mount):
    m=part('closed-shell')
    m.hull([(-9,2,2),(-7,3,3),(5,3,3),(8,2.6,2.6),(9,1.4,1.4)],'chalk')
    mount(m)
    m=part('external-jackets')
    for x in (-6,-1,4):
        m.hull([(x-.32,3.11,3.11),(x+.32,3.11,3.11)],'graphite')
    for side in (-1,1):
        m.panel(0,side*3.07,0,4,.25,1.4,'ash')
        m.panel(2.7,side*3.09,0,.6,.27,1.4,'oxide')
    for x in (-4,1.6):
        m.panel(x,0,3.05,3.9,3.4,.18,'ash')
        for j in range(6): m.panel(x-1.5+j*.55,0,3.17,.17,2.7,.09,'chalk')
    mount(m)

def tug(part,mount):
    m=part('service-cabin')
    m.hull([(-4,1.8,1.6),(-2.8,2.8,2.2),(1.8,2.8,2.2),(4,1.6,1.3)],'chalk')
    for y in (-2,2):
        m.turned([(-5,1.12),(-4.5,1.2),(-1,1.2),(-.6,.9)],'ash',y,-1)
        m.panel(.3,y,2.04,3,.6,.38,'graphite')
    mount(m)
    m=part('tow-yoke')
    for y in (-1.6,1.6):
        m.rod((2,y,0),(5,y,0),.28,'iron')
    m.panel(5,0,0,.7,4.4,1.6,'oxide')
    for side in (-1,1):
        for x in (-4,-2.4): m.turned([(x,1.23),(x+.18,1.23)],'graphite',side*2,-1)
        m.panel(-.4,side*2.8,.15,3.2,.22,1.45,'ash')
        for x in (-1.3,-.65,0,.65): m.panel(x,side*2.94,.15,.28,.13,1.1,'chalk')
    m.panel(-.6,0,2.38,2.7,2.9,.45,'graphite')
    mount(m)

def cradle(part,mount):
    m=part('handling-bed')
    for y in (-4.5,4.5):
        for z in (-4,-6): m.rod((-13,y,z),(13,y,z),.35,'ash')
        for x in range(-12,12,4): m.rod((x,y,-6),(x+4,y,-4),.19,'chalk')
    for x in (-11,0,11): m.panel(x,0,-4.4,1.1,10,1.1,'graphite')
    mount(m)
    m=part('service-uprights')
    for x in (-10,10):
        m.rod((x,-4.5,-4),(x,-4.5,4.5),.32,'chalk')
        m.panel(x,-4.5,4.5,1.4,1.4,1.2,'oxide')
    mount(m)

def warden(part,mount):
    m=part('avionics-bus')
    m.hull([(-7,2,2),(-5.8,3.1,2.6),(3,3.1,2.6),(6,2,1.8)],'chalk')
    for x in (-4,.6):
        m.hull([(x,3.18,2.68),(x+.55,3.18,2.68)],'ash')
    for y in (-3.25,3.25):
        m.panel(-.8,y,0,5,.5,2.8,'graphite')
    mount(m)
    m=part('communications-reflector')
    m.rod((3,0,1),(6.5,0,3),.65,'iron')
    m.turned([(6.2,.65),(6.7,2.2),(7.9,4.7),(8.1,4.7),(7,2.2),(6.5,.65)],'porcelain',z=3,sides=32,closed=True)
    for y,z in [(-4,3),(4,3),(0,7)]:
        m.rod((8,y,z),(10.7,0,3),.09,'ash')
    m.turned([(10.2,.35),(11,.35)],'brass',z=3)
    mount(m)
    m=part('power-wings')
    for side in (-1,1):
        m.rod((-2,side*2,0),(-2,side*20,0),.26,'iron')
        for i in range(4):
            y=side*(6.5+i*4)
            m.panel(-2,y,0,6.6,3.85,.25,'ash')
            for j in (-1.6,1.6):
                m.panel(-2+j,y,.17,3,3.5,.11,'glass')
    mount(m)

def lantern(part,mount):
    m=part('solar-wing')
    for side in (-1,1):
        for i in range(7):
            y=side*(1.6+3.2*i)
            x=-abs(y)*.07
            m.hull([(x-1.3,1.6,.055),(x+.55,1.6,.24),(x+1.6,1.6,.095)],'chalk',y,i*.06)
            m.panel(x+.1,y,i*.06+.25,1.7,2.98,.075,'glass')
    mount(m)
    m=part('relay-pod-and-tail')
    m.hull([(-3,.2,.14),(-1,.85,.72),(2,.72,.6),(3.1,.2,.23)],'chalk',z=-.65)
    for y in (-2,2):
        m.rod((0,y,0),(-6.3,y,.4),.12,'graphite')
    m.panel(-5.9,0,.5,1.4,5.1,.18,'ash')
    m.panel(-5.8,0,1.2,1.2,.18,1.5,'chalk')
    mount(m)

args=argparse.ArgumentParser()
args.add_argument('--scale',type=float,default=1)
builders=dict(quiver=quiver,tug=tug,cradle=cradle,warden=warden,lantern=lantern)
args.add_argument('--asset',choices=[*builders,'all'],default='all')
options=args.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
scale=options.scale
if scale<=0: raise ValueError('Positive scale required')
for key,builder in builders.items():
    if options.asset not in ('all',key): continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.preferences.filepaths.save_version=0
    bpy.context.preferences.filepaths.file_preview_type="NONE"
    scene=bpy.context.scene
    scene.unit_settings.system='METRIC'
    col=bpy.data.collections.new(key);scene.collection.children.link(col)
    root=bpy.data.objects.new(key+'-root',None);col.objects.link(root)
    part,mats=geometry_kit(key,scale,col)
    def mount(mesh): mesh.build().parent=root
    builder(part,mount)
    path=ROOT/'public/models/staging'/(key+'-v001.glb')
    export_asset(path,col,mats,version='v001',generator='assets/spacecraft/staging/generate.py')
    camera=make_studio(scene,scale,4)
    frame(camera,(.55,-1,.55),640,360,collection=col,scale=scale,scene=scene)
    bpy.ops.wm.save_as_mainfile(filepath=str(HERE/(key+'-v001.blend')),compress=True)
    scene.render.image_settings.file_format='WEBP'
    scene.render.film_transparent=True
    scene.render.filepath=str(path.with_suffix('.webp'))
    bpy.ops.render.render(write_still=True)
