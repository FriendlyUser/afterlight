"""Chapter 4b — the Drownmere: the bog south of Mirefen where Ilse gathers the cure.

Hub island (ruined shrine) with three routes: west to the Sunken Shrine (lanternmoss),
east into the Root Grotto (weepcap lily), north past the rot-crystal growths to the black
pool where Mawmire waits. A reed-hidden ford off the west island leads to the Drowned Chapel.
'V' = deep murky water (map legend). Land at height 1, fords ('p') at 0.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, cave, carve

W, H = 54, 46
m = MapCanvas(W, H, ground='V', height=0, seed=411)

# Raised, tree-choked banks around the edge.
m.rect(0, 0, W, 3, ground=',', height=3)
m.ragged_edge('n', 4, ',', 3, var=2)
m.ragged_edge('w', 3, ',', 3, var=1)
m.ragged_edge('e', 3, ',', 3, var=1)

def land(points, width=3, ground='m'):
    carve(m, points, width=width, ground=ground, height=1)

def ford(points, width=2):
    carve(m, points, width=width, ground='p', height=0)

def isle(cx, cy, rx, ry, ground='m'):
    m.ellipse(cx, cy, rx, ry, ground=ground, height=1, jitter=0.2)

# --- Entry causeway (south) and the hub shrine
m.rect(25, 41, 5, 5, ground='m', height=1)
land([(27, 44), (27, 38), (27, 33)], width=3)
isle(27, 30, 6.5, 4.2, ground='o')
isle(19, 39, 3, 2)                                  # side islet (chest)
ford([(25, 39), (21, 39)])

# --- West: fords to the Sunken Shrine
ford([(21, 31), (16, 32)], width=3)
land([(15, 32), (12, 28), (9, 23)], width=3)
ford([(9, 22), (8, 19)], width=3)
isle(8, 15, 5, 3.4, ground='o')
land([(11, 29), (7, 34), (5, 37)], width=2)          # west pocket
isle(5, 37, 2.5, 2)

# --- Secret: the reed-hidden ford to the Drowned Chapel
ford([(9, 12), (11, 9), (12, 7)], width=2)
isle(13, 5, 3, 2, ground='o')

# --- East: into the Root Grotto
ford([(33, 31), (38, 32)], width=3)
land([(38, 32), (42, 28), (43, 24)], width=3)
cave(m, 38, 10, 15, 15, wall='C', floor='c', fill=0.42)
for j in range(10, 25):
    for i in range(38, 53):
        if m.g[j][i] == 'c':
            m.hg[j][i] = 1
carve(m, [(43, 24), (45, 19), (47, 15)], width=3, ground='c', height=1)
carve(m, [(45, 19), (50, 21)], width=2, ground='c', height=1)
carve(m, [(46, 16), (41, 13)], width=2, ground='c', height=1)
m.rect(38, 10, 15, 1, ground='C', height=1)
m.rect(52, 10, 1, 15, ground='C', height=1)

# --- North: the rot-crystal wall, the last Hearthstone and the black pool
land([(27, 27), (27, 21)], width=3)
m.rect(26, 19, 3, 3, ground='m', height=1)          # the wall sits on row 20 (x 26..28)
land([(27, 19), (27, 15)], width=3)
isle(27, 15, 4.5, 2.6)
land([(27, 13), (27, 11)], width=3)
isle(28, 7, 7.5, 4.2)
m.rect(17, 1, 3, 10, ground='V', height=0)            # keep the chapel cut off from the arena
m.ellipse(28, 6, 4.5, 2, ground='p', height=0)      # the black pool
isle(33, 15, 2, 1.5)
land([(30, 15), (33, 15)], width=1)

# Walls of water between the routes stay deep; make sure the rot wall can't be skirted.
for x in (24, 25, 29, 30):
    for y in (19, 20, 21):
        m.set(x, y, ground='V', height=0)

# --- Props
m.scatter(0, 0, W, 5, ['T', 'D', 'D', 'b'], 0.45, on=',')
m.scatter(0, 0, 4, H, ['T', 'D', 'b'], 0.45, on=',')
m.scatter(W - 4, 0, 4, H, ['T', 'D', 'b'], 0.45, on=',')
m.scatter(0, 0, W, H, ['n', 'n', 'D', 'G', 'm', 'b'], 0.14, on='m')
m.scatter(0, 0, W, H, ['n', 'n', 'G'], 0.25, on='p')
m.scatter(0, 0, W, H, ['n'], 0.04, on='V')
m.scatter(38, 10, 15, 15, ['A', 'G', 'G', 'm', 'x'], 0.12, on='c')
# Hide the secret ford under a thick reed bed.
for (x, y) in [(9, 12), (9, 11), (10, 11), (10, 10), (11, 10), (11, 9), (12, 9), (12, 8)]:
    if m.g[y][x] != 'o':
        m.set(x, y, ground='p', height=0)
    m.set(x, y, prop='n')
# Hub shrine ruins
for (x, y, p) in [(23, 28, '|'), (31, 28, '!'), (23, 32, '!'), (31, 32, '|'), (27, 28, 'S')]:
    m.set(x, y, prop=p)
# Sunken shrine
for (x, y, p) in [(5, 14, '|'), (11, 14, '!'), (6, 17, '!'), (10, 17, '|')]:
    m.set(x, y, prop=p)
# Drowned chapel
for (x, y, p) in [(11, 5, '|'), (15, 4, '!'), (13, 4, 't'), (11, 6, 't'), (15, 6, 't')]:
    m.set(x, y, prop=p)
# Boss arena: bones and dead trees around the pool
for (x, y, p) in [(22, 7, 'D'), (34, 7, 'D'), (23, 5, 'x'), (33, 9, 'x'), (24, 9, 'x'), (31, 4, 'D')]:
    m.set(x, y, prop=p)
m.clear_props(25, 33, 5, 13)
m.clear_props(25, 9, 5, 19)
m.set(27, 16, prop='$')
m.set(26, 42, prop='$')

m.spot('entry', 27, 44)
m.spot('moss', 8, 14)
m.spot('lily', 47, 15)
m.spot('wall', 26, 20)
m.spot('save', 27, 16)
m.spot('boss', 27, 9)
m.spot('mawmire', 28, 5)
m.spot('ring', 13, 5)
for name, (x, y) in {
    'c_hub': (31, 30), 'c_islet': (19, 39), 'c_west': (5, 37), 'c_shrine': (11, 16),
    'c_grotto1': (50, 21), 'c_grotto2': (41, 13), 'c_chapel': (14, 6), 'c_north': (33, 15),
}.items():
    m.spot(name, x, y)
m.write('c4b_drownmere')
m.preview()
