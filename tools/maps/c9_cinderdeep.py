"""The Cinderdeep — Odessa's sun-ember mine, dug into a shard of mountain that a
piece of the broken sun fell through. Lava seams, ember crystals, slag (Ch9)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, carve

W, H = 46, 40
m = MapCanvas(W, H, ground='C', height=0, seed=707)

ROOMS = {
    'head': (6, 34, 5, 4), 'shaft': (10, 23, 5, 4), 'west': (5, 12, 4, 3.5), 'cavern': (24, 21, 8, 6),
    'south': (20, 34, 4, 2.5), 'gallery': (36, 31, 6, 4), 'east': (41, 20, 3, 3), 'climb': (39, 12, 4, 3),
    'nw': (6, 5, 3, 2.5), 'ante': (30, 5, 3.5, 2.5), 'heart': (18, 6, 5, 4),
}
for (cx, cy, rx, ry) in ROOMS.values():
    m.ellipse(cx, cy, rx, ry, ground='c', height=0, jitter=0.35)

corridors = [
    [(6, 34), (9, 28), (10, 23)],
    [(9, 21), (6, 15), (5, 12)],
    [(14, 23), (18, 22)],
    [(22, 26), (21, 31), (20, 34)],
    [(29, 25), (33, 29), (36, 31)],
    [(39, 28), (41, 24), (41, 20)],
    [(41, 17), (39, 12)],
    [(37, 10), (34, 7), (31, 5)],
    [(27, 5), (22, 6)],
    [(5, 10), (6, 5)],
]
for c in corridors:
    carve(m, c, width=3)

# Lava: the lake in the great cavern (a rock bridge crosses it), seams elsewhere.
m.ellipse(24, 21, 4.5, 3, ground='l', height=0, jitter=0.2)
m.line(20, 21, 29, 21, width=1, ground='c', height=0)
for (cx, cy, rx, ry) in [(33, 34, 2, 1), (40, 8, 1.5, 1.2), (4, 37, 1.2, 1), (9, 2, 1.0, 0.6), (23, 3, 1.5, 0.7)]:
    m.ellipse(cx, cy, rx, ry, ground='l', height=0)
m.ellipse(18, 4, 1.4, 1.1, ground='l', height=0)            # the heart, a well of light
m.border('C')
m.rect(1, 37, 3, 3, ground='c', height=0)                    # mine head opening
m.rect(2, 36, 3, 2, ground='c', height=0)

# Rails along the main shaft
m.path([(2, 38), (6, 34), (9, 28), (10, 24)], width=1, ground=':', height=0)
m.path([(29, 25), (33, 29), (37, 31)], width=1, ground=':', height=0)

# --- props
m.scatter(1, 1, 44, 38, ['*', 'A', 'o', 'x', 'G', 'A'], 0.06, on='c')
for (x, y, p) in [(8, 36, '^'), (12, 26, '^'), (13, 20, '^'), (17, 19, '^'), (30, 18, '^'), (34, 27, '^'),
                  (39, 33, '^'), (42, 18, '^'), (35, 8, '^'), (27, 4, '^'), (6, 37, 'O'), (7, 37, 'C'),
                  (11, 21, 'k'), (25, 26, 'C'), (32, 33, 'O'), (7, 3, 'k'), (21, 36, 'C')]:
    m.set(x, y, prop=p)
m.set(3, 11, prop='a')        # west steam valve
m.set(41, 33, prop='a')       # south-east steam valve
m.set(29, 7, prop='$')        # Hearthstone in the antechamber
m.set(18, 2, prop='*')
for c in corridors:
    for (x, y) in c:
        m.clear_props(x - 1, y - 1, 3, 3)
m.clear_props(19, 20, 11, 3)
m.clear_props(39, 22, 4, 5)
m.clear_props(32, 5, 4, 4)

m.spot('entry', 3, 37)
m.spot('heart', 18, 4)
m.spot('slag_a', 41, 24)
m.spot('slag_b', 34, 7)
m.write('c9_cinderdeep')
m.preview()
