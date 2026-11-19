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

args=argparse.ArgumentParser()
args.add_argument('--scale',type=float,default=1)
scale=args.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []).scale
if scale<=0: raise ValueError('Positive scale required')
for key,builder in [('quiver',quiver),('tug',tug),('cradle',cradle)]:
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
