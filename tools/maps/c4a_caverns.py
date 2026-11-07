"""Chapter 4a — the Glass Caverns east of Saltglass, and the Sand Wyrm Queen's nest."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, cave, carve

# ----------------------------------------------------------------- c4a_glass_caverns
m = MapCanvas(52, 40, ground='C', height=0, seed=421)
cave(m, 1, 1, 50, 38, fill=0.5, steps=4)
main = [(0, 19), (9, 19), (17, 15), (25, 19), (33, 18), (41, 19)]
carve(m, main, width=3)
BRANCHES = [
    [(9, 19), (7, 11), (12, 5)],        # NW: resonance pillar A
    [(17, 15), (16, 26), (10, 33)],     # SW: resonance pillar B
    [(33, 18), (36, 9), (43, 5)],       # NE: resonance pillar C
    [(25, 19), (29, 27), (33, 31)],     # SE: Jorah's pocket
    [(7, 11), (3, 6)],                  # side chests
    [(16, 26), (24, 30)],
    [(36, 9), (29, 5)],
]
for b in BRANCHES:
    carve(m, b, width=3)
# Chambers.
m.ellipse(12, 5, 3.2, 2.4, ground='c')
m.ellipse(10, 33, 3.4, 2.4, ground='c')
m.ellipse(43, 5, 3.4, 2.4, ground='c')
m.rect(35, 24, 11, 15, ground='C')                          # Jorah's sealed pocket
m.ellipse(38, 31, 3, 2.2, ground='c')
m.rect(33, 30, 3, 3, ground='c')
# The sealed eastern gallery toward the nest: a straight corridor through rock.
m.rect(38, 15, 14, 9, ground='C')
m.rect(38, 17, 14, 5, ground='c')
m.border('C')
m.rect(0, 18, 1, 3, ground='c')
m.rect(51, 17, 1, 5, ground='c')
# Glass: floors that glitter and walls that sing.
for (x, y, rx, ry) in [(12, 5, 2.4, 1.6), (10, 33, 2.6, 1.6), (43, 5, 2.6, 1.6), (25, 19, 3, 1.6), (45, 19, 4, 1.6), (38, 31, 2, 1.2)]:
    m.ellipse(x, y, rx, ry, ground='g')
m.ellipse(20, 23, 2.4, 1.4, ground='w')                     # cave spring
m.scatter(1, 1, 50, 38, ['*', 'A', 'o', '*', 'x'], 0.07, on='c')
m.scatter(1, 1, 50, 38, ['*', 'o'], 0.1, on='g')
# Keep every corridor and key spot clear.
for pts in [main] + BRANCHES:
    for (a, b) in zip(pts, pts[1:]):
        m.line(a[0], a[1], b[0], b[1], width=2, prop=' ')
for (x, y, w, h) in [(0, 17, 4, 5), (10, 3, 5, 5), (8, 31, 5, 5), (41, 3, 5, 5), (31, 29, 9, 6), (38, 16, 14, 7), (19, 22, 3, 3)]:
    m.clear_props(x, y, w, h)
m.set(45, 16, ground='C'); m.set(45, 22, ground='C')
m.set(41, 16, prop='*'); m.set(41, 22, prop='*'); m.set(49, 16, prop='*'); m.set(49, 22, prop='*')
for (x, y) in [(12, 4), (10, 32), (43, 4)]:
    m.set(x, y, prop='*')
m.spot('entry', 1, 19)
m.spot('jorah', 38, 31)
m.spot('jorah_wall', 34, 31)
m.spot('door', 45, 19)
m.spot('exit', 51, 19)
m.write('c4a_glass_caverns')
m.preview()

# ----------------------------------------------------------------- c4a_glass_nest
m = MapCanvas(34, 28, ground='C', height=0, seed=422)
m.ellipse(19, 14, 12.5, 10, ground='c', jitter=0.25)
m.ellipse(19, 14, 9, 7, ground='g', jitter=0.3)
carve(m, [(0, 14), (8, 14)], width=3)
m.ellipse(5, 14, 3, 2.5, ground='c')
m.border('C')
m.rect(0, 13, 1, 3, ground='c')
m.ellipse(27, 6, 2.6, 1.8, ground='c')
# Eggs of glass, bones of caravans.
for (x, y) in [(12, 8), (13, 9), (25, 20), (26, 19), (11, 19), (27, 9)]:
    m.set(x, y, prop='R')
m.scatter(2, 2, 30, 24, ['x', 'x', 'o', '*', 'd'], 0.09, on='cg')
m.clear_props(0, 11, 9, 7)
m.clear_props(15, 10, 9, 8)
m.set(4, 12, prop='$')
m.spot('entry', 1, 14)
m.spot('queen', 22, 13)
m.spot('fight', 17, 14)
m.spot('hoard', 27, 6)
m.write('c4a_glass_nest')
m.preview()
