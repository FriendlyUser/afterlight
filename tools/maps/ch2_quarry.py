"""Chapter 2 — Red Tam's hideout: an abandoned stone quarry cut in terraces."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(46, 42, ground='#', height=9, seed=71)

# The yard (bottom), bandit camp
m.rect(10, 29, 27, 12, ground='d', height=1)
m.ellipse(23, 35, 13, 5.5, ground='_', height=1, jitter=0.3)
m.rect(21, 39, 5, 3, ground=':', height=1)                   # the way in (south)
# The gloam pit (west, sunk below the yard)
m.ellipse(6, 31, 5, 5, ground='c', height=0, jitter=0.3)
m.rect(9, 31, 2, 2, ground='c', height=0)
m.ramp(10, 32, 2, 'e', 0, 1, width=2, ground='c')
# Terrace one (height 3): the archers' walk
m.rect(16, 20, 26, 7, ground='_', height=3)
m.ramp(34, 30, 4, 'n', 1, 3, width=2, ground=':')             # yard -> terrace one
m.ellipse(40, 23, 4, 3, ground='d', height=3)
# Terrace two (height 5): the gatehouse and the stores
m.rect(5, 10, 26, 7, ground='_', height=5)
m.ellipse(7, 13, 4, 4, ground='d', height=5)
m.ramp(17, 19, 3, 'n', 3, 5, width=2, ground=':')             # gate ramp (guarded)
# Terrace three (height 7): Red Tam's camp
m.rect(14, 2, 20, 6, ground='d', height=7)
m.ellipse(24, 5, 8, 3, ground='_', height=7)
m.ramp(28, 9, 2, 'n', 5, 7, width=2, ground=':')
m.rect(28, 8, 2, 2, ground=':')
m.rect(33, 3, 6, 4, ground='d', height=7)                     # Tam's hoard nook
# Rock walls flanking the ramps
for y in range(17, 20):
    m.set(16, y, ground='#', height=9); m.set(19, y, ground='#', height=9)
for y in range(27, 31):
    m.set(33, y, ground='#', height=9); m.set(36, y, ground='#', height=9)
for y in range(7, 10):
    m.set(27, y, ground='#', height=9); m.set(30, y, ground='#', height=9)

# Camp dressing
m.structure('tent', 14, 32, color='#8a5a3a')
m.structure('tent', 31, 32, color='#6a6a4a')
m.structure('tent', 19, 3, color='#a83a2a')
m.structure('tent', 29, 3, color='#8a3a2a')
m.set(23, 33, prop='@'); m.set(24, 4, prop='@'); m.set(9, 12, prop='@')
for (x, y, p) in [(12, 30, 'C'), (13, 30, 'O'), (33, 30, 'k'), (34, 31, 'C'), (28, 37, 'O'), (17, 37, 'C'),
                  (6, 11, 'C'), (7, 11, 'C'), (5, 13, 'O'), (11, 15, 'k'), (25, 11, 'O'), (26, 11, 'C'),
                  (17, 2, 'O'), (31, 6, 'C'), (35, 3, 'k'), (22, 21, 'O'), (30, 25, 'C'), (41, 21, 'k')]:
    m.set(x, y, prop=p)
for (x, y) in [(20, 38), (26, 38), (16, 22), (34, 22), (12, 12), (22, 12), (18, 3), (30, 5)]:
    m.set(x, y, prop='^')
m.set(14, 24, prop='q'); m.set(33, 12, prop='q'); m.set(24, 2, prop='q')
m.scatter(1, 25, 11, 12, ['%', '%', 'A', 'x'], 0.12, on='c')
m.scatter(10, 29, 27, 12, ['o', 'd', 'R'], 0.05, on='d_')
m.scatter(16, 20, 26, 7, ['o', 'd', 'R'], 0.04, on='_d')
m.scatter(5, 10, 26, 7, ['o', 'd'], 0.05, on='_d')
m.set(15, 12, prop='$')                                        # Hearthstone (terrace two)
m.set(3, 28, prop='%')                                         # the violet seam
m.set(7, 28, prop='k'); m.set(8, 28, prop='k')                 # sacks of "stuffing"
m.clear_props(21, 36, 5, 6)
m.clear_props(17, 17, 2, 4)
m.clear_props(34, 26, 2, 6)
m.clear_props(28, 7, 2, 4)
m.clear_props(9, 31, 3, 3)
m.clear_props(20, 4, 9, 4)
m.set(24, 4, prop='@')
# Rock walls stand only a little above the terrace they border, so the camera can see in.
for y in range(m.h):
    wall_h = 2 if y >= 28 else 4 if y >= 17 else 6 if y >= 9 else 8
    for x in range(m.w):
        if m.g[y][x] == '#':
            m.hg[y][x] = wall_h
m.spot('entry', 23, 39)
m.spot('gate', 17, 18)
m.spot('tam', 24, 3)
m.write('c2_quarry')
m.preview()
