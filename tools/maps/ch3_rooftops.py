"""The rooftops of the Bell Market — Pip's chase (Chapter 3).

Custom ground chars (defined in the map's `legend`): 1 red roof, 2 slate roof,
3 blue roof, 4 green roof, 5 thatch. Streets (';', height 0) run between the
blocks; the party crosses them with 'Leap' inspect points.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(46, 24, ground=';', height=0, seed=307)

# Roof blocks: (char, x, y, w, h, height)
m.rect(1, 7, 9, 11, ground='1', height=7)      # A — where the crates come up
m.rect(12, 5, 9, 13, ground='2', height=8)     # B — St. Aurel's roof
m.rect(23, 8, 9, 10, ground='3', height=7)     # C — the old chandlery
m.rect(26, 11, 3, 3, ground='+', height=3)     #     ...with its fallen-in middle
m.rect(34, 5, 8, 13, ground='4', height=8)     # D — Pip's roof
m.rect(13, 1, 18, 3, ground='5', height=6)     # E — the long thatch (north)
m.rect(22, 19, 12, 4, ground='1', height=6)    # F — the dyers' roof (south)
m.rect(42, 0, 4, 14, ground='S', height=10)    # the bell tower of St. Aurel
m.rect(0, 0, 46, 1, ground='B', height=4)      # far wall line
m.rect(36, 6, 6, 3, ground='+', height=8)      # Pip's planked nook

# Ramps on B (a lower terrace) keep the roofline interesting
m.rect(12, 14, 9, 4, ground='2', height=7)

# ------------------------------------------------------------------ props
P = [
    # A
    (2, 8, 'C'), (7, 8, 'O'), (5, 11, 'O'), (8, 13, 'C'), (2, 12, 'B'), (6, 16, 'q'),
    # B
    (13, 6, 'C'), (19, 6, 'O'), (15, 9, 'S'), (18, 12, 'C'), (13, 15, 'O'), (19, 16, 'C'),
    # C (laundry lines either side of the hole)
    (24, 9, 'O'), (30, 9, 'C'), (25, 12, 'F'), (29, 12, 'F'), (30, 16, 'O'), (24, 16, 'k'),
    # D & the nook
    (35, 6, 'C'), (40, 16, 'O'), (35, 16, 'C'), (38, 12, 'S'), (37, 6, 'k'), (36, 8, 'C'), (39, 6, 'q'),
    # E
    (17, 2, 'C'), (22, 2, 'O'), (26, 2, 'k'),
    # F
    (24, 20, 'F'), (25, 20, 'F'), (28, 21, 'O'), (30, 20, 'C'),
    # street clutter far below
    (10, 20, 'O'), (16, 21, 'C'), (4, 20, 'k'), (21, 6, 'O'), (32, 4, 'C'), (38, 21, 'O'), (11, 3, 'k'),
]
for (x, y, p) in P:
    m.set(x, y, prop=p)
for (x, y) in [(5, 20), (12, 20), (19, 21), (35, 20), (43, 18)]:
    m.set(x, y, prop='L')

for name, x, y in [('arrive', 3, 15), ('pip_a', 8, 10), ('pip_b', 20, 11), ('pip_c', 31, 14),
                   ('pip_nook', 39, 7), ('cat', 29, 2)]:
    m.spot(name, x, y)

m.write('c3_rooftops')
m.preview()
