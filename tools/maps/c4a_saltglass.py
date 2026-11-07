"""Chapter 4a — Saltglass, the desert Lantern town, and its interiors."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# ----------------------------------------------------------------- c4a_saltglass
m = MapCanvas(48, 38, ground='s', height=1, seed=411)
# Mesa behind the Lantern; plaster town walls east and west with gates.
m.ragged_edge('n', 3, '#', 3, var=1)
m.rect(0, 0, 48, 2, ground='#', height=4)
m.rect(0, 2, 2, 34, ground='P', height=1)
m.rect(46, 2, 2, 34, ground='P', height=1)
m.rect(0, 18, 2, 4, ground=':', height=1)            # west gate
m.rect(46, 26, 2, 4, ground=':', height=1)           # east gate (Glass Caverns)
# Lantern plaza (raised) and the market square.
m.rect(18, 3, 13, 7, ground=';', height=2)
m.rect(20, 3, 9, 1, ground='g', height=2)
m.rect(14, 14, 21, 11, ground=';', height=1)
m.ellipse(24, 19, 5, 3, ground='g', height=1)
# Streets.
m.path([(0, 19), (14, 19)], width=3, ground=':', height=1)
m.path([(34, 19), (40, 19), (40, 27), (47, 27)], width=3, ground=':', height=1)
m.path([(24, 10), (24, 14)], width=3, ground=';', height=1)
m.path([(34, 15), (40, 8)], width=2, ground=':', height=1)
m.path([(9, 14), (14, 16)], width=2, ground=':', height=1)
# Caravan yard (north-east).
m.rect(35, 3, 10, 7, ground='d', height=1)
m.structure('tent', 37, 4, color='#d8c8a0'); m.structure('tent', 42, 4, color='#c87a4a')
for (x, y, p) in [(36, 7, 'C'), (36, 8, 'C'), (44, 7, 'k'), (44, 8, 'O'), (39, 4, 'h'), (40, 4, 'h')]:
    m.set(x, y, prop=p)
# Buildings.
m.building(6, 10, 7, 4, wall='wall_plaster', roof='roof_red', h=2.8,
           door={'dx': 3, 'to': 'c4a_sg_inn', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[1, 5])
m.building(34, 12, 5, 3, wall='wall_plaster', roof='roof_thatch',
           door={'dx': 2, 'to': 'c4a_sg_house', 'tx': 4, 'ty': 5, 'dir': 'up'}, windows=[0, 4])
m.building(5, 24, 6, 3, wall='wall_plaster', roof='roof_slate', windows=[1, 4])     # glassworks
m.building(38, 21, 6, 3, wall='wall_plaster', roof='roof_red', windows=[0, 5])
m.building(39, 31, 5, 3, wall='wall_plaster', roof='roof_thatch', windows=[1])
m.building(5, 4, 5, 3, wall='wall_plaster', roof='roof_thatch', windows=[1, 3])
# The Lantern.
m.structure('lantern', 24, 5, doorTo='c4a_sg_lantern', tx=7, ty=11, dir='up')
# Market tents & stalls.
for (x, c) in [(16, '#c87a4a'), (20, '#3a7a8a'), (28, '#d8c8a0'), (32, '#8a3a5a')]:
    m.structure('tent', x, 15, color=c)
for (x, y, p) in [(15, 17, 'C'), (17, 17, 'k'), (19, 17, '='), (21, 17, 'O'), (27, 17, '='), (29, 17, 'k'), (31, 17, 'C'), (33, 17, 'O')]:
    m.set(x, y, prop=p)
m.set(24, 19, prop='W')            # the deep well
m.set(20, 22, prop='$')
m.set(28, 22, prop='s')
for (x, y) in [(14, 14), (34, 14), (14, 24), (34, 24), (18, 9), (30, 9)]:
    m.set(x, y, prop='L')
m.set(19, 4, prop='q'); m.set(29, 4, prop='q')
# Glassworks yard.
m.set(12, 26, prop='u'); m.set(12, 25, prop='a'); m.set(4, 27, prop='O')
# Palms, cacti and life.
m.scatter(2, 3, 44, 33, ['Y', 'Y', 'o', 'c', 'b'], 0.045, on='s')
m.scatter(2, 26, 44, 10, ['Y', 'c', 'o', 'g'], 0.06, on='s')
m.rect(2, 36, 44, 2, ground='s', height=1)
m.rect(0, 36, 2, 2, ground='s', height=1); m.rect(46, 36, 2, 2, ground='s', height=1)
for x in range(2, 46, 3):
    m.set(x, 37, prop='F' if x % 2 else 'Y')
m.clear_props(0, 17, 5, 6)
m.clear_props(43, 25, 5, 6)
m.clear_props(22, 6, 5, 5)
m.spot('entry_w', 2, 19)
m.spot('entry_e', 45, 27)
m.spot('lantern_out', 24, 7)
m.spot('inn_out', 9, 14)
m.spot('house_out', 36, 15)
m.spot('caravan', 40, 7)
m.spot('nim', 37, 16)
m.write('c4a_saltglass')
m.preview()

# ----------------------------------------------------------------- the Saltglass Lantern
m = interior(15, 13, wall='P', floor='_', seed=412)
m.rect(4, 2, 7, 3, ground='g', height=1)
m.rect(6, 5, 3, 1, ground='g', height=0)
m.stair(6, 5, 3, 1)
m.rect(7, 6, 1, 7, ground='x')
for y in (4, 7, 10):
    m.set(2, y, prop='*'); m.set(12, y, prop='*')
m.set(3, 2, prop='q'); m.set(11, 2, prop='q')
m.set(1, 6, prop='^'); m.set(13, 6, prop='^')
m.set(1, 10, prop='j'); m.set(13, 10, prop='j'); m.set(12, 11, prop='k')
m.spot('lamp', 7, 2); m.spot('tamsin', 7, 4); m.spot('entry', 7, 11); m.spot('kneel', 7, 6)
m.write('c4a_sg_lantern')

# ----------------------------------------------------------------- The Cool Well (inn)
m = interior(13, 10, wall='P', floor='=', seed=413)
for x in (2, 6, 10):
    m.set(x, 5, prop='='); m.set(x - 1, 5, prop='j'); m.set(x + 1, 5, prop='j')
m.rect(1, 2, 3, 1, prop='O'); m.set(9, 2, prop='E'); m.set(10, 2, prop='E'); m.set(11, 2, prop='H')
m.set(6, 2, prop='='); m.set(7, 2, prop='=')
m.set(1, 7, prop='k'); m.set(11, 7, prop='C'); m.set(4, 2, prop='^'); m.set(8, 2, prop='^')
m.set(11, 8, prop='Y')
m.spot('entry', 6, 8); m.spot('keeper', 6, 3)
m.write('c4a_sg_inn')

# ----------------------------------------------------------------- Asha & Nim's house
m = interior(9, 7, wall='P', floor='+', seed=414)
m.set(1, 2, prop='E'); m.set(2, 2, prop='E'); m.set(6, 2, prop='H'); m.set(7, 2, prop='u')
m.set(4, 3, prop='='); m.set(3, 3, prop='j'); m.set(7, 5, prop='k'); m.set(1, 5, prop='O')
m.spot('entry', 4, 5)
m.write('c4a_sg_house')
