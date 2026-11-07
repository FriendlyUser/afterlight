"""Chapter 2 — the Whisperwold: the Murmuring Path (outer) and the Hollow (heart)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

FLOOR, RIDGE = 1, 3


def glade(m, cx, cy, rx, ry, ground=','):
    m.ellipse(cx, cy, rx, ry, ground=ground, height=FLOOR, jitter=0.35)


def trail(m, pts, width=3):
    m.path(pts, width=width, ground=',', height=FLOOR)
    m.path(pts, width=1, ground=':', height=FLOOR)


def forest(m):
    """Dense trees on the ridges, mushrooms and moss on the floor."""
    m.scatter(0, 0, m.w, m.h, ['T', 'P', 'T', 'P', 'b', 'T'], 0.55, on=',')
    for j in range(m.h):
        for i in range(m.w):
            if m.hg[j][i] == FLOOR and m.g[j][i] == ',' and m.p[j][i] in ('T', 'P', 'b'):
                m.p[j][i] = ' '
    # Keep the view open: no tall trees on the ridge just south of a path (they would hide the player).
    for j in range(m.h):
        for i in range(m.w):
            if m.hg[j][i] != RIDGE or m.p[j][i] not in ('T', 'P'):
                continue
            near = [(i, j - 1), (i, j - 2), (i - 1, j - 1), (i + 1, j - 1), (i, j - 3)]
            if any(0 <= y < m.h and 0 <= x < m.w and m.hg[y][x] == FLOOR for x, y in near):
                m.p[j][i] = 'b' if m.rng.random() < 0.35 else ' '
    m.scatter(0, 0, m.w, m.h, ['m', 'G', 'g', 'f', 'o'], 0.08, on=',:o')


# ================================================================== Outer wold
m = MapCanvas(52, 40, ground=',', height=RIDGE, seed=51)
glade(m, 4, 20, 5, 4)                     # entry glade
glade(m, 16, 20, 4, 3)                    # the fork
glade(m, 14, 7, 6, 3.5)                   # Cradle Glade (north)
glade(m, 16, 32, 7, 4.5)                  # Drowned Hollow (south)
m.ellipse(14, 33, 4, 2, ground='p', height=FLOOR)   # black pond
glade(m, 29, 20, 5.5, 4.5, ground='o')    # Ring of Stones
glade(m, 38, 9, 5, 3.5)                   # the Overlook
glade(m, 46, 31, 4.5, 3.5)                # hidden grove
trail(m, [(0, 20), (12, 20), (24, 20)])
trail(m, [(16, 18), (16, 10)])
trail(m, [(16, 23), (17, 28)])
trail(m, [(33, 17), (36, 12), (40, 10), (51, 9)])
trail(m, [(33, 23), (38, 27), (42, 29)], width=2)
# Ring of standing stones
for (x, y) in [(26, 17), (32, 17), (25, 21), (33, 21), (27, 24), (31, 24)]:
    m.set(x, y, prop='|')
m.set(29, 20, prop='Z')                   # the Grandmother tree
# Whispering trees (glow violet; each has a voice)
for (x, y) in [(14, 4), (11, 31), (41, 7), (47, 8), (20, 34)]:
    m.set(x, y, prop='Z')
m.set(48, 30, prop='t')                   # a small grave in the hidden grove
m.set(45, 29, prop='B'); m.set(49, 31, prop='B'); m.set(47, 33, prop='f')
forest(m)
for (x, y) in [(14, 4), (11, 31), (41, 7), (47, 8), (20, 34), (29, 20)]:
    m.set(x, y, prop='Z')
m.clear_props(0, 18, 3, 5)
m.clear_props(48, 7, 4, 5)
m.clear_props(39, 26, 3, 4)
m.spot('entry', 1, 20)
m.spot('exit', 50, 9)
m.write('c2_wold_outer')
m.preview()

# ================================================================== The Hollow (heart)
m = MapCanvas(44, 40, ground=',', height=RIDGE, seed=52)
glade(m, 6, 33, 5, 3.5)                   # antechamber
glade(m, 21, 21, 10, 6, ground='o')       # Hall of Listening Stones
glade(m, 9, 13, 3.5, 2.5)                 # alcove: the wedding stone
glade(m, 9, 25, 3.5, 2.5)                 # alcove: the grave stone
glade(m, 35, 20, 3.5, 3)                  # alcove: the cradle stone
glade(m, 22, 7, 4.5, 3)                   # Hearth glade
glade(m, 35, 8, 6, 4.5, ground='u')       # the Hollow (boss)
glade(m, 4, 21, 3, 2.5)                   # west pocket
glade(m, 31, 3, 3, 2)                     # north-east pocket
glade(m, 25, 35, 4, 2.5)                  # south pocket
trail(m, [(0, 33), (10, 33), (14, 29), (17, 25)])
trail(m, [(12, 18), (9, 15)], width=2)
trail(m, [(12, 23), (9, 25)], width=2)
trail(m, [(30, 21), (34, 20)], width=2)
trail(m, [(22, 15), (22, 9)])
trail(m, [(26, 7), (30, 8)])
trail(m, [(41, 7), (43, 7)])
trail(m, [(9, 33), (6, 23), (4, 21)], width=2)
trail(m, [(25, 6), (30, 3)], width=2)
trail(m, [(24, 26), (25, 34)], width=2)
# The three Listening Stones and the riddle stone
m.set(9, 12, prop='S'); m.set(9, 24, prop='S'); m.set(36, 19, prop='S')
m.set(9, 31, prop='S')
m.set(22, 8, prop=' ')
m.set(19, 6, prop='$')
# The Hollow: gloam crystals around the Mother
for (x, y) in [(31, 6), (39, 6), (32, 11), (38, 11), (35, 4)]:
    m.set(x, y, prop='%')
forest(m)
for (x, y) in [(9, 12), (9, 24), (36, 19), (9, 31)]:
    m.set(x, y, prop='S')
m.set(19, 6, prop='$')
for (x, y) in [(31, 6), (39, 6), (32, 11), (38, 11), (35, 4)]:
    m.set(x, y, prop='%')
m.set(35, 6, prop='Z')                    # the Hollow Mother's heart-tree
m.rect(34, 7, 3, 3, prop=' ')
m.clear_props(0, 32, 3, 3)
m.clear_props(40, 6, 4, 3)
m.clear_props(20, 13, 5, 3)
m.spot('entry', 1, 33)
m.spot('roots', 22, 13)
m.spot('mother', 35, 7)
m.spot('exit', 42, 7)
m.write('c2_wold_heart')
m.preview()
