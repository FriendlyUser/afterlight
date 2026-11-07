"""The Tide Caves — first dungeon, east of Lanternfall."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, cave, carve

m = MapCanvas(44, 32, ground='C', height=0, seed=33)
cave(m, 1, 1, 42, 30, fill=0.47, steps=4)
path = [(1, 16), (8, 15), (14, 20), (20, 24), (27, 21), (31, 13), (26, 7), (33, 5), (40, 9), (39, 18), (36, 26)]
carve(m, path, width=3)
carve(m, [(14, 20), (9, 27), (4, 26)], width=2)          # side pocket (chest)
carve(m, [(26, 7), (19, 5), (12, 6)], width=2)           # upper pocket (chest)
m.rect(0, 15, 2, 3, ground='c')                          # entrance
m.border('C')
m.rect(0, 15, 1, 3, ground='c')
# Tide pools
m.ellipse(22, 25, 3, 1.6, ground='w')
m.ellipse(35, 27, 4, 2.2, ground='~')
m.ellipse(33, 27, 2, 1.5, ground='w')
m.ellipse(30, 15, 2, 1.2, ground='w')
m.rect(36, 24, 2, 2, ground='c')
# Decor
m.scatter(1, 1, 42, 30, ['A', '*', 'o', 'G', 'x'], 0.06, on='c')
m.clear_props(0, 14, 4, 5)
m.spot('entry', 1, 16)
m.spot('chest_pocket', 4, 26)
m.spot('chest_upper', 12, 6)
m.spot('chest_mid', 28, 21)
m.spot('save', 20, 23)
m.spot('brooch', 36, 25)
m.spot('eel', 36, 23)
m.set(20, 22, prop='$')
m.write('lf_tidecaves')
m.preview()
