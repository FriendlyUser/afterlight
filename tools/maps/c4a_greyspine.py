"""Chapter 4a — the Greyspine: the pass, Frosthollow monastery, its interiors,
the Bell Stair ice caves and the eastern ledge below the bell tower."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior, cave, carve

# ----------------------------------------------------------------- c4a_greyspine_pass
# Five snow terraces climbing north; the trail zig-zags between them on ramps.
W, H = 40, 58
m = MapCanvas(W, H, ground='*', height=1, seed=431)
BANDS = [(0, 9, 9), (10, 21, 7), (22, 33, 5), (34, 45, 3), (46, 57, 1)]   # (y0, y1, height)
for x in range(W):
    for (y0, y1, hgt) in BANDS:
        top = y0 + (m.rng.choice([0, 0, 1]) if y0 > 0 else 0)
        for y in range(top, y1 + 1):
            m.set(x, y, height=hgt)
# Ramps between terraces (trail zig-zags: east, west, east, west).
RAMPS = [(30, 47, 1, 3), (7, 35, 3, 5), (27, 23, 5, 7), (10, 11, 7, 9)]
for (x, y, h0, h1) in RAMPS:
    m.rect(x - 1, y - 3, 4, 5, ground='*')
    for yy in range(y - 4, y + 2):
        for xx in range(x - 1, x + 3):
            m.set(xx, yy, height=h1 if yy <= y - 2 else h0)
    m.ramp(x, y, 3, 'n', h0, h1, width=2, ground=':')
# Mountain walls on both sides.
m.ragged_edge('w', 4, '#', None, var=2)
m.ragged_edge('e', 4, '#', None, var=2)
for y in range(H):
    for x in range(W):
        if m.g[y][x] == '#':
            m.hg[y][x] = 10
m.rect(0, 0, W, 1, ground='#', height=11)
m.rect(17, 0, 6, 2, ground='*', height=9)
# The trail.
TRAIL = [(20, 57), (21, 50), (30, 48), (30, 44), (22, 40), (12, 38), (8, 35), (8, 31), (16, 27), (27, 25), (27, 20),
         (28, 15), (18, 14), (11, 12), (11, 8), (19, 4), (19, 0)]
for (a, b) in zip(TRAIL, TRAIL[1:]):
    m.line(a[0], a[1], b[0], b[1], width=2, ground=':')
# Avalanche gullies: rock fins either side of the trail.
for (x0, x1, y, hgt) in [(13, 24, 36, 3), (13, 24, 41, 3), (20, 31, 12, 7), (20, 31, 17, 7)]:
    for x in range(x0, x1 + 1):
        m.set(x, y, ground='#', height=hgt + 3)
m.rect(14, 37, 10, 4, ground=':' , height=3)
m.rect(21, 13, 10, 4, ground=':', height=7)
# Frozen streams.
m.path([(4, 52), (12, 49), (15, 46)], width=2, ground='i')
m.path([(33, 30), (36, 27)], width=2, ground='i')
# Whitefang's den (east of the middle terrace).
m.rect(31, 22, 6, 6, ground='c', height=5)
m.rect(30, 21, 8, 1, ground='#', height=8)
m.rect(37, 21, 1, 8, ground='#', height=8)
# Pilgrims' shrine with a Hearthstone (middle terrace, west).
m.rect(5, 26, 5, 4, ground='_', height=5)
m.set(7, 26, prop='S'); m.set(5, 26, prop='|'); m.set(9, 26, prop='|')
m.set(7, 28, prop='$')
# The Vigil Stone and Sir Aldous's cairn (upper terrace).
m.rect(30, 9, 6, 5, ground='_', height=7)
m.set(32, 10, prop='S'); m.set(34, 10, prop='R'); m.set(33, 11, prop='o')
# Trees & rocks.
m.scatter(0, 0, W, H, ['T', 'T', 'R', 'T', 'o'], 0.1, on='*')
for (a, b) in zip(TRAIL, TRAIL[1:]):
    m.line(a[0], a[1], b[0], b[1], width=3, prop=' ')
for (x, y, h0, h1) in RAMPS:
    m.clear_props(x - 1, y - 4, 4, 7)
for (x, y, w, h) in [(14, 37, 10, 4), (21, 13, 10, 4), (31, 22, 6, 6), (5, 26, 5, 4), (30, 9, 6, 5), (17, 52, 7, 6)]:
    m.clear_props(x, y, w, h)
m.set(7, 26, prop='S'); m.set(5, 26, prop='|'); m.set(9, 26, prop='|'); m.set(7, 28, prop='$')
m.set(32, 10, prop='S'); m.set(34, 10, prop='R')
m.set(33, 22, prop='x'); m.set(35, 24, prop='x'); m.set(32, 26, prop='o')
m.set(23, 53, prop='s'); m.set(24, 42, prop='s'); m.set(19, 18, prop='s')
for (x, y) in [(5, 44), (37, 31), (7, 16), (33, 6)]:      # frost lilies
    m.set(x, y, prop='f')
m.spot('entry_s', 20, 55)
m.spot('entry_n', 19, 1)
m.spot('gully_low', 18, 38)
m.spot('gully_high', 25, 14)
m.spot('den', 34, 24)
m.spot('vigil', 33, 12)
m.spot('pilgrim', 14, 49)
m.write('c4a_greyspine_pass')
m.preview()


# ----------------------------------------------------------------- c4a_frosthollow
m = MapCanvas(46, 36, ground='*', height=1, seed=432)
m.ragged_edge('n', 4, '#', 6, var=1)
m.rect(0, 0, 46, 4, ground='#', height=7)
m.ragged_edge('w', 2, '#', 4, var=1)
m.ragged_edge('e', 2, '#', 4, var=1)
# Monastery terrace (raised) across the north.
m.rect(4, 4, 38, 10, ground='_', height=2)
m.rect(4, 4, 38, 1, ground='#', height=6)
# Bell Stair: a cave mouth cut into the north-east cliff.
m.rect(39, 1, 3, 4, ground='c', height=2)
# Buildings.
m.building(10, 5, 9, 4, wall='wall_stone', roof='roof_slate', h=3.2,
           door={'dx': 4, 'to': 'c4a_fh_hall', 'tx': 8, 'ty': 11, 'dir': 'up'}, windows=[1, 3, 5, 7])
m.building(30, 8, 6, 3, wall='wall_stone', roof='roof_slate',
           door={'dx': 2, 'to': 'c4a_fh_guest', 'tx': 5, 'ty': 6, 'dir': 'up'}, windows=[0, 4])
m.building(5, 17, 5, 3, wall='wall_stone', roof='roof_blue', windows=[1, 3])        # infirmary
m.building(36, 16, 5, 3, wall='wall_timber', roof='roof_slate', windows=[1])         # woodshed
m.structure('lantern', 24, 6)                                                       # the bell tower
# Square, paths, the frozen pond.
m.rect(15, 16, 15, 9, ground=';', height=1)
m.path([(21, 35), (21, 24)], width=3, ground=';', height=1)
m.path([(22, 13), (22, 16)], width=3, ground='_', height=1)
m.ramp(21, 15, 2, 'n', 1, 2, width=3, ground='_')
m.path([(14, 9), (14, 13)], width=2, ground='_', height=2)
m.path([(32, 11), (32, 13), (40, 13), (40, 5)], width=2, ground='_', height=2)
m.ellipse(36, 27, 5, 2.6, ground='i', height=1)
m.path([(7, 20), (7, 22), (15, 22)], width=2, ground=':', height=1)
# Memorial wall (west terrace).
for x in (5, 6, 7, 8):
    m.set(x, 11, prop='S' if x % 2 else 't')
m.set(4, 10, prop='^'); m.set(9, 10, prop='^')
# Stalls, hearth, lamps.
for (x, y, p) in [(26, 18, '='), (27, 18, '='), (28, 18, 'C'), (25, 18, 'k'), (17, 18, 'O'), (17, 19, 'O')]:
    m.set(x, y, prop=p)
m.set(19, 23, prop='$')
m.set(23, 23, prop='W')
for (x, y) in [(15, 16), (29, 16), (15, 24), (29, 24), (20, 13), (26, 13)]:
    m.set(x, y, prop='L')
m.set(12, 12, prop='q'); m.set(19, 12, prop='q')
m.set(18, 33, prop='s')
# Pines & snow.
m.scatter(2, 14, 42, 22, ['T', 'T', 'R', 'o'], 0.07, on='*')
m.scatter(4, 5, 38, 8, ['O', 'C', 'k'], 0.03, on='_')
m.clear_props(19, 24, 6, 12)
m.clear_props(20, 13, 5, 4)
m.clear_props(31, 11, 10, 3)
m.clear_props(38, 1, 5, 6)
m.clear_props(31, 23, 11, 8)
m.clear_props(13, 9, 3, 5)
m.spot('entry_s', 21, 34)
m.spot('hall_out', 14, 10)
m.spot('guest_out', 32, 12)
m.spot('stair', 40, 2)
m.spot('gate', 21, 30)
m.spot('pond', 36, 27)
m.write('c4a_frosthollow')
m.preview()


# ----------------------------------------------------------------- Hall of Echoes
m = interior(17, 13, wall='S', floor='_', seed=433)
m.rect(4, 0, 9, 2, ground='I')                 # the Ice Score
m.rect(5, 2, 7, 2, ground='X', height=0)
m.rect(8, 4, 1, 9, ground='X')
for x in (2, 3, 5, 6, 10, 11, 13, 14):
    m.set(x, 7, prop='j'); m.set(x, 9, prop='j')
m.set(1, 2, prop='H'); m.set(2, 2, prop='H'); m.set(14, 2, prop='H'); m.set(15, 2, prop='H')
m.set(3, 2, prop='^'); m.set(13, 2, prop='^')
m.set(1, 5, prop='|'); m.set(15, 5, prop='|')
m.set(1, 10, prop='u'); m.set(15, 10, prop='k')
m.spot('entry', 8, 11); m.spot('halvard', 8, 4); m.spot('score', 8, 1)
m.write('c4a_fh_hall')

# ----------------------------------------------------------------- Guesthouse
m = interior(11, 8, wall='S', floor='+', seed=434)
for x in (1, 3, 7, 9):
    m.set(x, 2, prop='E')
m.set(5, 2, prop='^'); m.set(5, 4, prop='='); m.set(4, 4, prop='j'); m.set(9, 5, prop='O'); m.set(1, 5, prop='k')
m.spot('entry', 5, 6); m.spot('tolle', 6, 3)
m.write('c4a_fh_guest')


# ----------------------------------------------------------------- c4a_frost_caves (the Bell Stair)
# Hand-cut tunnels through solid ice. A rubble choke splits the stair in two.
m = MapCanvas(46, 30, ground='I', height=0, seed=435)
MAIN_A = [(0, 15), (9, 15), (15, 8), (24, 9), (27, 13)]
MAIN_B = [(31, 13), (34, 20), (40, 22), (45, 22)]
SIDE = [[(15, 8), (19, 3)], [(9, 15), (11, 25)], [(24, 9), (21, 18)], [(34, 20), (39, 8)], [(40, 22), (37, 27)]]
carve(m, MAIN_A, width=4)
carve(m, MAIN_B, width=4)
for s in SIDE:
    carve(m, s, width=3)
m.rect(27, 12, 4, 3, ground='c')
for (x, y, rx, ry) in [(19, 3, 3, 1.8), (11, 25, 3, 1.8), (39, 7, 3.5, 2), (21, 18, 2.5, 1.6), (12, 13, 3, 2.5), (38, 22, 4, 2.2)]:
    m.ellipse(x, y, rx, ry, ground='c')
m.border('I')
m.rect(0, 14, 1, 3, ground='c')
m.rect(45, 21, 1, 3, ground='c')
for (x, y, rx, ry) in [(15, 8, 3, 1.5), (34, 18, 2.5, 2), (19, 3, 2, 1), (39, 7, 2, 1.2), (11, 25, 2, 1)]:
    m.ellipse(x, y, rx, ry, ground='i')
m.scatter(1, 1, 44, 28, ['*', 'A', 'o', '*', 'x'], 0.08, on='ci')
for pts in [MAIN_A, MAIN_B] + SIDE:
    for (a, b) in zip(pts, pts[1:]):
        m.line(a[0], a[1], b[0], b[1], width=2, prop=' ')
m.clear_props(26, 11, 6, 5)
m.clear_props(35, 19, 11, 6)
m.clear_props(0, 13, 4, 5)
m.set(38, 20, prop='$')
m.spot('entry', 1, 15)
m.spot('rubble', 29, 13)
m.spot('ambush', 20, 9)
m.spot('save', 38, 21)
m.spot('exit', 45, 22)
m.write('c4a_frost_caves')
m.preview()


# ----------------------------------------------------------------- c4a_bell_ledge
m = MapCanvas(38, 26, ground='*', height=2, seed=436)
m.ragged_edge('n', 9, '#', 4, var=2)
m.rect(0, 0, 38, 3, ground='#', height=9)
m.ellipse(19, 5, 6, 4, ground='*', height=8, jitter=0.2)      # the bell tower's crag
m.ragged_edge('w', 2, '#', 4, var=1)
m.ragged_edge('e', 2, '#', 4, var=1)
m.rect(0, 12, 4, 3, ground='c', height=2)                    # Bell Stair mouth
m.rect(0, 11, 4, 1, ground='#', height=6); m.rect(0, 15, 4, 1, ground='#', height=6)
m.rect(34, 15, 4, 4, ground='*', height=2)                   # the road east
m.ragged_edge('s', 2, '#', 1, var=1)
m.structure('lantern', 19, 5)
m.path([(2, 13), (14, 14), (24, 15), (37, 16)], width=2, ground=':', height=2)
m.scatter(2, 9, 34, 15, ['T', 'R', 'o', 'T'], 0.08, on='*')
m.clear_props(0, 10, 8, 7)
m.clear_props(12, 11, 16, 8)
m.clear_props(32, 13, 6, 7)
for (x, y) in [(5, 11), (6, 16), (4, 17)]:
    m.set(x, y, prop='R')
m.spot('entry', 2, 13)
m.spot('shelter', 4, 13)
m.spot('garrick', 21, 14)
m.spot('halvard', 19, 7)
m.spot('east', 36, 16)
m.write('c4a_bell_ledge')
m.preview()
