"""The Echo Colosseum — a sunken pit under the Abyss Gate where the Gloam replays old fights."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 30, 26
m = MapCanvas(W, H, ground='S', height=6, seed=44)

# Tiered stands (too high to climb onto) ring the pit.
m.ellipse(15, 10.5, 14, 9.5, ground='_', height=5)
m.ellipse(15, 10.5, 12.5, 8.2, ground='_', height=4)
# The pit floor.
m.ellipse(15, 10.5, 11, 7, ground='s', height=1, jitter=0.05)
m.ellipse(15, 10.5, 4, 2.5, ground='a', height=1)
# The tunnel from the gate, sloping down into the pit.
m.rect(13, 16, 4, 10, ground='_', height=1)
m.rect(12, 16, 1, 10, ground='S', height=6)
m.rect(17, 16, 1, 10, ground='S', height=6)

# Stands: torches, banners and the odd pillar; the bookie's board by the gate.
for (x, y) in [(5, 4), (25, 4), (2, 10), (28, 10), (5, 17), (25, 17), (15, 1)]:
    m.set(x, y, prop='^')
for (x, y) in [(9, 2), (21, 2), (3, 7), (27, 7), (3, 14), (27, 14)]:
    m.set(x, y, prop='q')
for (x, y) in [(12, 1), (18, 1), (1, 12), (29, 12)]:
    m.set(x, y, prop='|')
m.set(13, 18, prop='s')
for (x, y) in [(6, 9), (24, 9), (9, 14), (21, 14)]:
    m.set(x, y, prop='!')
m.scatter(5, 5, 20, 12, ['x', 'o', 'd'], 0.05, on='s')
m.clear_props(13, 9, 5, 4)

m.spot('arrive', 14, 23)
m.spot('host', 15, 15)
m.spot('center', 15, 10)
m.write('postgame_arena')
m.preview()
