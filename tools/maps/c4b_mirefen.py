"""Chapter 4b — Mirefen: the swamp road, the stilt village, the inn and Mother Osk's Lantern.

Ground 'V' is deep murky water (declared in the map's `legend`, see src/data/maps/ch4b_mirefen.js).
Walkable land sits at height 1 (road) / 2 (village boardwalks); shallow swamp 'p' at height 0.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# =====================================================================
# mirefen_road — the causeway into the fens (chapter entry at 4,20)
# =====================================================================
m = MapCanvas(48, 30, ground='V', height=0, seed=401)

# Treeline banks (north + west), raised so the void never shows.
m.rect(0, 0, 48, 6, ground=',', height=3)
m.ragged_edge('n', 7, ',', 3, var=2)
m.rect(0, 0, 3, 30, ground=',', height=3)
m.ragged_edge('w', 3, ',', 3, var=1)
m.rect(45, 0, 3, 12, ground=',', height=3)

# Islands of mud and sedge (height 1) with shallow fords (height 0).
for (cx, cy, rx, ry, g) in [(9, 20, 7, 3.2, 'm'), (18, 14, 6, 3.5, ','), (27, 18, 5, 3, 'm'), (30, 24, 6, 3, ','),
                            (37, 17, 5, 3.4, 'm'), (43, 14, 5, 3, ','), (8, 25, 4, 2.5, 'm'), (31, 9, 5, 2.5, ',')]:
    m.ellipse(cx, cy, rx, ry, ground=g, height=1, jitter=0.25)
for (cx, cy, rx, ry) in [(13, 18, 3, 2), (23, 17, 3, 2.2), (32, 20, 3, 2), (8, 23, 2, 1.4), (30, 12, 2, 1.6), (40, 20, 3, 1.6)]:
    m.ellipse(cx, cy, rx, ry, ground='p', height=0, jitter=0.2)

# The causeway: packed earth and old planks (height 1).
road = [(1, 20), (10, 20), (14, 16), (22, 16), (26, 19), (34, 19), (38, 15), (47, 15)]
m.path(road, width=2, ground=':', height=1)
for (x0, x1, y) in [(11, 13, 17), (23, 25, 17), (35, 37, 17)]:     # plank bridges over the fords
    m.rect(x0, y - 1, x1 - x0 + 1, 3, ground='=', height=1)
m.rect(46, 14, 2, 3, ground=':', height=1)                      # east exit to the village
m.path([(25, 15), (28, 13), (30, 11)], width=2, ground='p', height=0)  # ford to the north islet
m.rect(0, 19, 3, 3, ground=':', height=1)                        # the buried mountain road (west)

# Ferryman's hut on the north island + jetty.
m.building(15, 10, 5, 3, wall='wall_wood', roof='roof_thatch', h=2.4, windows=[1, 3])
m.rect(20, 12, 3, 1, ground='=', height=1)
m.set(23, 12, prop='V')
# Quarantine camp (south island).
m.structure('tent', 27, 23, color='#a89a78')
m.structure('tent', 33, 23, color='#8a9a78')
m.set(30, 23, prop='@')
m.set(26, 25, prop='E'); m.set(34, 26, prop='E')
m.path([(30, 21), (30, 22)], width=2, ground=':', height=1)
# Dawnguard checkpoint on the causeway.
for y in (17, 18, 21, 22):
    m.set(33, y, prop='F')
m.set(32, 17, prop='q'); m.set(35, 21, prop='C'); m.set(35, 22, prop='O')
# The drowned wayshrine (south-west pocket).
m.path([(9, 21), (8, 24)], width=1, ground='=', height=1)
m.set(6, 24, prop='!'); m.set(10, 24, prop='|'); m.set(8, 26, prop='S')

# Narrow channels of water read as solid foam in the water shader: silt them up into mudflats.
for _ in range(2):
    for y in range(1, 29):
        for x in range(1, 47):
            if m.g[y][x] not in 'Vp':
                continue
            land = sum(1 for (dx, dy) in ((1, 0), (-1, 0), (0, 1), (0, -1)) if m.g[y + dy][x + dx] not in 'Vp')
            if land >= 3:
                m.set(x, y, ground='m', height=0)

# Props
m.scatter(0, 0, 48, 8, ['T', 'T', 'D', 'b', 'P'], 0.35, on=',')
m.scatter(0, 0, 4, 30, ['T', 'D', 'b'], 0.4, on=',')
m.scatter(44, 0, 4, 12, ['T', 'D'], 0.4, on=',')
m.scatter(3, 8, 44, 22, ['n', 'n', 'D', 'b', 'G', 'm'], 0.12, on='m,')
m.scatter(3, 8, 44, 22, ['n'], 0.18, on='p')
m.scatter(3, 6, 44, 24, ['n'], 0.03, on='V')
m.clear_props(0, 18, 48, 4)
m.clear_props(12, 14, 12, 3)
m.clear_props(36, 13, 12, 4)
for (x, y) in [(10, 19), (22, 15), (38, 14)]:
    m.set(x, y, prop='L')

m.set(4, 18, prop='s')                                           # avalanche sign
m.set(21, 14, prop='$')
m.spot('entry', 4, 20)
m.spot('gaspar', 20, 13)
m.spot('checkpoint', 33, 19)
m.spot('poster', 32, 18)
m.spot('sick1', 28, 25)
m.spot('sick2', 32, 25)
m.spot('shrine_chest', 8, 25)
m.spot('north_chest', 31, 8)
m.spot('camp_chest', 34, 24)
m.spot('east', 46, 15)
m.write('mirefen_road')
m.preview()

# =====================================================================
# c4b_mirefen — the stilt village (boardwalks at height 2)
# =====================================================================
m = MapCanvas(46, 36, ground='V', height=0, seed=402)
m.rect(0, 0, 46, 4, ground=',', height=4)
m.ragged_edge('n', 5, ',', 4, var=2)
m.rect(0, 0, 2, 14, ground=',', height=4)
m.rect(44, 0, 2, 20, ground=',', height=4)
# Shallow reed-beds between the stilts.
for (cx, cy, rx, ry) in [(10, 28, 6, 3), (36, 30, 7, 3), (6, 20, 3, 4), (42, 12, 2, 4)]:
    m.ellipse(cx, cy, rx, ry, ground='p', height=0, jitter=0.3)

B = 2  # boardwalk height
def walk(points, width=2):
    m.path(points, width=width, ground='=', height=B)

# Lantern island (north-east)
m.ellipse(37, 7, 6, 4, ground=',', height=B, jitter=0.15)
# Platforms
m.rect(15, 14, 13, 7, ground='+', height=B)        # the square
m.rect(15, 8, 9, 6, ground='=', height=B)          # inn deck
m.rect(29, 13, 11, 7, ground='=', height=B)        # Rot House pavilion
m.rect(3, 9, 7, 6, ground='=', height=B)           # Hesk's house
m.rect(26, 7, 6, 5, ground='=', height=B)          # weaver's house
m.rect(6, 22, 7, 5, ground='=', height=B)          # Widow Pell's
m.rect(28, 23, 7, 5, ground='=', height=B)         # eel-fishers
m.rect(37, 23, 6, 5, ground='=', height=B)         # Tiller's
# Boardwalks
walk([(0, 18), (15, 18)])
walk([(6, 14), (6, 18)])
walk([(12, 18), (12, 22)])
walk([(19, 13), (19, 14)])
walk([(27, 16), (29, 16)])
walk([(34, 13), (34, 11), (36, 10)])
walk([(28, 12), (28, 13)])
walk([(22, 20), (22, 34)])
walk([(23, 25), (28, 25)])
walk([(34, 25), (37, 25)])
walk([(10, 9), (10, 6)], width=2)
m.ramp(9, 5, 3, 'n', B, 4, width=2, ground=':')    # up to the north woods
m.rect(9, 0, 2, 3, ground=':', height=4)
m.rect(21, 33, 3, 3, ground='=', height=B)          # jetty to the Drownmere
m.set(20, 34, prop='V'); m.set(24, 34, prop='V')

# Buildings
m.building(16, 8, 6, 4, wall='wall_timber', roof='roof_thatch', h=2.8, door={'dx': 3, 'to': 'c4b_mirefen_inn', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[1, 5])
m.building(4, 9, 5, 3, wall='wall_wood', roof='roof_green', windows=[1, 3])
m.building(27, 7, 4, 3, wall='wall_wood', roof='roof_thatch', windows=[0])
m.building(6, 22, 4, 3, wall='wall_wood', roof='roof_green', windows=[0, 3])
m.building(29, 23, 5, 3, wall='wall_timber', roof='roof_thatch', windows=[1])
m.building(38, 23, 4, 3, wall='wall_wood', roof='roof_green', windows=[3])
m.structure('lantern', 37, 6, lit=False, doorTo='c4b_osk_lantern', tx=7, ty=10, dir='up')
m.path([(36, 10), (37, 8)], width=1, ground=':', height=B)

# Rot House: an open pavilion of beds
for (x, y) in [(29, 13), (39, 13), (29, 19), (39, 19)]:
    m.set(x, y, prop='|')
for x in (31, 33, 35, 37):
    m.set(x, 14, prop='E'); m.set(x, 18, prop='E')
m.set(38, 16, prop='u'); m.set(30, 16, prop='k')
# Market stalls on the square
m.structure('tent', 16, 20, color='#8a6a4a')
m.structure('tent', 26, 20, color='#6a7a5a')
for (x, y, p) in [(17, 20, 'C'), (18, 20, 'k'), (25, 20, 'O'), (24, 20, 'C'), (27, 14, 'O'), (15, 14, 'k')]:
    m.set(x, y, prop=p)
for (x, y) in [(15, 17), (27, 18), (22, 22), (22, 30), (13, 21), (35, 10), (3, 18)]:
    m.set(x, y, prop='L')
m.set(21, 15, prop='$')
m.set(14, 17, prop='s')

m.scatter(0, 0, 46, 6, ['T', 'T', 'D', 'b'], 0.4, on=',')
m.scatter(0, 0, 2, 14, ['T', 'D'], 0.5, on=',')
m.scatter(44, 0, 2, 20, ['T', 'D'], 0.5, on=',')
m.scatter(31, 2, 13, 9, ['D', 'b', 'G', 'n'], 0.15, on=',')
m.scatter(0, 6, 46, 30, ['n', 'n', 'D'], 0.12, on='p')
m.scatter(0, 6, 46, 30, ['n'], 0.025, on='V')
m.clear_props(8, 0, 4, 9)

m.spot('west', 1, 18)
m.spot('square', 21, 17)
m.spot('hesk_run', 33, 11)
m.spot('hesk', 7, 13)
m.spot('vey', 34, 16)
m.spot('nettie', 33, 15)
m.spot('dace', 37, 17)
m.spot('lisette', 31, 17)
m.spot('pell', 10, 25)
m.spot('tiller', 21, 20)
m.spot('corla', 30, 26)
m.spot('benet', 26, 25)
m.spot('sedge', 18, 18)
m.spot('rusk_out', 20, 12)
m.spot('weaver', 26, 11)
m.spot('jetty', 22, 33)
m.spot('lantern_door', 37, 8)
m.spot('north', 9, 1)
m.write('c4b_mirefen')
m.preview()

# =====================================================================
# Interiors
# =====================================================================
# --- The Leaning Heron (inn)
m = interior(13, 10, wall='T', floor='=', seed=403)
m.rect(1, 2, 5, 1, prop='O')
m.set(8, 3, prop='='); m.set(9, 3, prop='=')                # bar
for x in (2, 9):
    m.set(x, 6, prop='='); m.set(x - 1, 6, prop='j'); m.set(x + 1, 6, prop='j')
m.set(11, 2, prop='E'); m.set(11, 4, prop='E'); m.set(10, 2, prop='H')
m.set(3, 2, prop='^'); m.set(7, 2, prop='^'); m.set(1, 8, prop='C'); m.set(11, 8, prop='k')
m.set(6, 4, prop='u')
m.spot('entry', 6, 8); m.spot('rusk', 8, 4); m.spot('drinker', 2, 7); m.spot('bard', 10, 7); m.spot('hearth', 6, 3)
m.write('c4b_mirefen_inn')

# --- Mother Osk's Lantern (sickroom at the foot of the tower)
m = interior(15, 12, wall='S', floor='+', seed=404)
m.rect(5, 2, 5, 2, ground='_', height=1)                    # the lamp cradle dais
m.stair(6, 4, 3, 1)
m.set(7, 2, prop='|')
m.set(2, 3, prop='E')                                        # Osk's bed
m.set(1, 2, prop='H'); m.set(12, 2, prop='H'); m.set(13, 2, prop='H')
m.set(11, 5, prop='u'); m.set(12, 6, prop='k'); m.set(1, 7, prop='O'); m.set(13, 8, prop='C')
m.set(4, 2, prop='^'); m.set(10, 2, prop='^')
m.set(3, 6, prop='='); m.set(4, 6, prop='j')
m.rect(7, 7, 1, 5, ground='x')
m.spot('osk', 2, 4); m.spot('cradle', 7, 3); m.spot('entry', 7, 10); m.spot('vey', 4, 5); m.spot('hesk', 9, 6)
m.spot('ilse', 3, 5); m.spot('wren', 5, 6)
m.write('c4b_osk_lantern')
