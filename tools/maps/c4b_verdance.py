"""Chapter 4b — Verdance: the hamlet of Rootholm, the Thornwood (dungeon) and the Heartwood grove.

Forest walls are raised banks (height 4) crowded with trees; walkable floor sits at height 1.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, carve

WALLH = 4

# =====================================================================
# c4b_verdance — Rootholm, a hamlet at the edge of the Thornwood
# =====================================================================
m = MapCanvas(46, 36, ground=',', height=1, seed=421)
m.rect(0, 0, 46, 6, ground=',', height=WALLH)
m.ragged_edge('n', 7, ',', WALLH, var=2)
m.ragged_edge('w', 4, ',', WALLH, var=2)
m.ragged_edge('e', 4, ',', WALLH, var=2)
# The clearing
m.ellipse(23, 17, 13, 8, ground='.', height=1, jitter=0.2)
m.ellipse(23, 17, 4, 3, ground='o', height=1)
# Roads: west (world map) and north (the Tangle gate)
m.path([(0, 27), (8, 27), (14, 23), (19, 19)], width=2, ground=':', height=1)
m.path([(23, 14), (23, 3)], width=3, ground=':', height=1)
m.rect(22, 0, 3, 4, ground=':', height=1)
m.rect(0, 26, 5, 3, ground=':', height=1)
m.path([(17, 13), (29, 13)], width=1, ground=':', height=1)
m.path([(17, 21), (31, 21)], width=1, ground=':', height=1)
# Tall grass on the outskirts (encounters)
for (cx, cy, rx, ry) in [(9, 31, 6, 3), (36, 29, 6, 3), (6, 20, 3, 4), (40, 22, 3, 4), (32, 6, 4, 2)]:
    m.ellipse(cx, cy, rx, ry, ground='"', height=1, jitter=0.3)
# A brook along the south with a footbridge
m.path([(0, 33), (14, 33), (22, 34), (46, 33)], width=2, ground='w', height=0)
m.rect(17, 32, 2, 4, ground='=', height=1)
# Buildings: treehouses of living wood
m.building(17, 9, 6, 3, wall='wall_wood', roof='roof_green', h=3.0, windows=[1, 4])      # Elder's hall
m.building(27, 10, 5, 3, wall='wall_wood', roof='roof_thatch', windows=[0, 3])           # The Hollow Log
m.building(8, 14, 4, 3, wall='wall_timber', roof='roof_green', windows=[1])
m.building(34, 15, 4, 3, wall='wall_wood', roof='roof_green', windows=[2])
m.building(11, 22, 4, 3, wall='wall_wood', roof='roof_thatch', windows=[0])
m.building(31, 22, 5, 3, wall='wall_timber', roof='roof_green', windows=[1, 3])
m.structure('tent', 28, 18, color='#7a8a4a')                                             # Fern's stall
m.structure('arch', 22, 4, w=3, tex='wall_wood')                                          # the Tangle gate
# The Memory Tree
m.set(23, 17, prop='K')
for (x, y) in [(21, 16), (25, 16), (21, 18), (25, 18), (23, 15), (23, 19)]:
    m.set(x, y, prop='f')
m.set(26, 19, prop='$')
m.set(20, 5, prop='s')
for (x, y) in [(19, 13), (29, 15), (17, 20), (30, 20), (14, 24)]:
    m.set(x, y, prop='L')
m.set(29, 18, prop='C'); m.set(27, 18, prop='k')

m.scatter(0, 0, 46, 9, ['T', 'T', 'P', 'b', 'T'], 0.45, on=',')
m.scatter(0, 0, 5, 36, ['T', 'P', 'b'], 0.45, on=',')
m.scatter(41, 0, 5, 36, ['T', 'P', 'b'], 0.45, on=',')
m.scatter(4, 7, 38, 26, ['T', 'b', 'B', 'f', 'g', 'm'], 0.08, on=',')
m.scatter(4, 7, 38, 26, ['f', 'g', 'B'], 0.05, on='.')
m.scatter(0, 30, 46, 6, ['n', 'b', 'f'], 0.1, on=',"')
m.clear_props(21, 0, 5, 16)
m.clear_props(0, 25, 6, 5)

m.spot('west', 1, 27)
m.spot('arrive', 6, 27)
m.spot('elder', 20, 14)
m.spot('fern', 28, 19)
m.spot('innkeep', 30, 14)
m.spot('tree', 23, 17)
m.spot('tree_front', 23, 20)
m.spot('gate', 23, 6)
m.spot('gatekeeper', 24, 8)
m.spot('mother1', 12, 18)
m.spot('mother2', 35, 19)
m.spot('father3', 14, 26)
m.spot('child', 19, 22)
m.spot('woodcutter', 38, 25)
m.spot('poet', 9, 19)
m.spot('c_brook', 41, 31)
m.spot('c_grove', 5, 12)
m.spot('c_north', 33, 7)
m.write('c4b_verdance')
m.preview()

# =====================================================================
# c4b_thornwood — the Tangle: a forest gone wrong since its light was stolen
# =====================================================================
m = MapCanvas(50, 46, ground=',', height=WALLH, seed=422)

def trail(points, width=3, ground='o'):
    carve(m, points, width=width, ground=ground, height=1)

def glade(cx, cy, rx, ry, ground=','):
    m.ellipse(cx, cy, rx, ry, ground=ground, height=1, jitter=0.2)

# Entry and first glade
trail([(24, 45), (24, 39)], width=3)
glade(24, 38, 5, 3)
trail([(19, 38), (12, 38), (8, 31)], width=3)        # west: Wick
glade(8, 29, 4, 3)
trail([(29, 39), (36, 40), (42, 35)], width=3)       # east pocket
glade(43, 33, 3.5, 2.5)
# Thorn wall A (row 34) then the second glade
trail([(24, 36), (24, 27)], width=3)
glade(24, 25, 6, 3.5)
trail([(18, 25), (13, 23), (10, 16)], width=3)       # west: Bryony
glade(9, 14, 4, 3)
trail([(7, 13), (5, 9)], width=2)
glade(5, 8, 2.5, 2)
trail([(30, 25), (36, 24), (41, 19), (43, 12)], width=3)  # east: thorn wall B (x 33) then Tamsel
glade(43, 10, 4, 3)
trail([(45, 9), (46, 5)], width=2)
glade(46, 5, 2.2, 2)
# North: the last Hearthstone, thorn wall C (row 11), the Warden's glade
trail([(24, 22), (24, 16)], width=3)
glade(24, 15, 4, 2.5)
trail([(24, 13), (24, 9)], width=3)
glade(24, 6, 7, 3.5)
m.rect(23, 0, 3, 4, ground='o', height=1)
# Narrow the thorn-wall rows to exactly three tiles.
for (x0, y0, horizontal) in [(23, 34, True), (23, 11, True), (33, 23, False)]:
    for k in range(-3, 6):
        tx, ty = (x0 + k, y0) if horizontal else (x0, y0 + k)
        if (horizontal and not 0 <= k <= 2) or (not horizontal and not 0 <= k <= 2):
            m.set(tx, ty, ground=',', height=WALLH)
            continue
        m.set(tx, ty, ground='o', height=1)

# Props
m.scatter(0, 0, 50, 46, ['T', 'T', 'P', 'T', 'b', 'Z'], 0.55, on=',')
for y in range(46):
    for x in range(50):
        if m.g[y][x] == ',' and m.hg[y][x] == 1 and m.p[y][x] in 'TPbZ':
            m.p[y][x] = ' '
m.scatter(0, 0, 50, 46, ['G', 'm', 'f', 'g', 'G'], 0.12, on='o,')
for y in range(46):
    for x in range(50):
        if m.hg[y][x] == 1 and m.p[y][x] not in ' GmfgoB':
            m.p[y][x] = ' '
m.clear_props(22, 0, 5, 46)
for (x, y) in [(21, 37), (27, 37), (20, 24), (28, 24), (21, 6), (27, 6)]:
    m.set(x, y, prop='^')
m.set(26, 15, prop='$')
m.set(24, 26, prop='S')                               # an old Keeper statue in the second glade

m.spot('entry', 24, 44)
m.spot('glade1', 24, 38)
m.spot('thornA', 23, 34)
m.spot('thornB', 33, 23)
m.spot('thornC', 23, 11)
m.spot('wick', 8, 29)
m.spot('bryony', 9, 14)
m.spot('tamsel', 43, 10)
m.spot('save', 26, 15)
m.spot('boss', 24, 8)
m.spot('warden', 24, 4)
m.spot('exit', 24, 1)
for name, (x, y) in {
    'c_west': (6, 30), 'c_east': (44, 33), 'c_bryony': (5, 8), 'c_tamsel': (46, 5),
    'c_glade2': (28, 26), 'c_save': (22, 15), 'c_glade1': (27, 39),
}.items():
    m.spot(name, x, y)
m.write('c4b_thornwood')
m.preview()

# =====================================================================
# c4b_heartwood — Elowen's grove and the dark Lantern of Thornwood
# =====================================================================
m = MapCanvas(32, 26, ground=',', height=WALLH, seed=423)
m.ellipse(16, 13, 13, 10, ground='o', height=1, jitter=0.15)
m.ellipse(16, 13, 8, 6, ground='.', height=1, jitter=0.15)
m.rect(14, 20, 4, 6, ground='o', height=1)
m.path([(0, 16), (5, 15)], width=2, ground=':', height=1)       # the hidden way out (west)
m.structure('lantern', 16, 7, lit=False)
m.scatter(0, 0, 32, 26, ['T', 'T', 'K', 'P'], 0.6, on=',')
for y in range(26):
    for x in range(32):
        if m.hg[y][x] == 1 and m.p[y][x] in 'TKP':
            m.p[y][x] = ' '
m.scatter(3, 3, 26, 20, ['f', 'f', 'G', 'B', 'g'], 0.12, on='.o')
for (x, y) in [(12, 6), (20, 6), (10, 9), (22, 9)]:
    m.set(x, y, prop='K')
m.set(11, 17, prop='@')
m.set(22, 18, prop='$')
m.clear_props(13, 9, 7, 5)
m.clear_props(0, 14, 7, 4)
m.clear_props(13, 18, 6, 8)
m.spot('elowen', 16, 10)
m.spot('stone', 15, 11)
m.spot('entry', 16, 23)
m.spot('camp', 11, 18)
m.spot('west', 1, 16)
m.spot('wren', 16, 13)
m.write('c4b_heartwood')
m.preview()
