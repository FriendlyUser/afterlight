"""The Abyss Gate — the Nadir Light on the lip of the deepest rift (post-game hub)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 42, 34
m = MapCanvas(W, H, ground='a', height=2, seed=91)

# The rift: nothing but dark across the north, with a ragged lip.
m.rect(0, 0, W, 6, ground=' ', height=0)
for x in range(W):
    depth = 6 + m.rng.choice([0, 0, 1, 1, 2])
    for y in range(6, depth):
        m.set(x, y, ground=' ', height=0)
# Cliffs frame the plateau west/east; dead woods along the south.
m.ragged_edge('w', 3, '#', 3, var=1)
m.ragged_edge('e', 3, '#', 3, var=1)
for y in range(0, 8):
    m.rect(0, y, 4, 1, ground=' ', height=0)
    m.rect(W - 4, y, 4, 1, ground=' ', height=0)
m.rect(0, 29, W, 5, ground='q', height=2)

# Plaza around the Nadir Light.
m.ellipse(21, 12.5, 8, 5, ground='r', height=2, jitter=0.1)
m.ellipse(21, 12.5, 4.5, 3, ground='_', height=2)
m.structure('lantern', 21, 11, lit=True)

# Roads.
m.path([(21, 33), (21, 17)], width=3, ground=';')
m.path([(19, 17), (10, 17), (10, 13)], width=2, ground=';')     # to the Descent
m.path([(23, 18), (34, 18), (34, 22)], width=2, ground=';')     # to the Colosseum
m.path([(26, 11), (31, 11), (31, 9)], width=2, ground=';')      # to the lift
m.path([(10, 18), (10, 22), (6, 22)], width=2, ground=':')      # to the chalk wall

# The Descent: a stairwell cut through a cliff block, down into the rift.
m.rect(6, 6, 9, 6, ground='#', height=2)
m.set(10, 11, ground='u', height=1)
m.set(10, 10, ground='u', height=0)
m.set(10, 9, ground='u', height=0)
m.set(10, 8, ground='u', height=0)
m.stair(10, 8, 1, 4)
m.structure('arch', 9, 11, w=3, tex='wall_gloam')

# The lift gantry at the rim.
m.rect(29, 8, 5, 3, ground='+', height=2)
m.set(31, 8, prop='L')
for x in (29, 33):
    m.set(x, 8, prop='F')

# The Echo Colosseum.
m.building(30, 13, 9, 5, wall='wall_stone', roof='roof_slate', h=3.4,
           door={'dx': 4, 'to': 'pg_arena', 'tx': 14, 'ty': 23, 'dir': 'up'}, windows=[1, 7])

# Sorrel's salvage stall.
m.rect(5, 15, 4, 3, ground='+', height=2)
m.structure('tent', 6, 15, color='#6a4a6a')
for (x, y, p) in [(5, 17, 'C'), (8, 15, 'O'), (8, 16, 'k'), (5, 16, 'O')]:
    m.set(x, y, prop=p)

# The old wall where someone drew in chalk.
m.rect(4, 21, 4, 1, ground='R', height=2)

# Props.
m.set(24, 22, prop='$')
m.set(18, 27, prop='s')
m.set(36, 20, prop='s')
for (x, y) in [(18, 20), (24, 20), (18, 25), (24, 25), (13, 19), (29, 20), (12, 12), (8, 12)]:
    m.set(x, y, prop='L')
for (x, y) in [(32, 18), (37, 18)]:
    m.set(x, y, prop='q')
for (x, y) in [(15, 9), (17, 15), (27, 15), (25, 9), (14, 13), (28, 12)]:
    m.set(x, y, prop='!')
m.scatter(4, 6, 34, 3, ['%', 'x', 'o'], 0.25, on='a')
m.scatter(1, 29, 40, 5, ['D', 'D', 'R', 'b'], 0.3, on='q')
m.scatter(3, 8, 36, 21, ['d', 'o', 'x'], 0.05, on='a')
m.scatter(3, 8, 36, 21, ['D', 'R'], 0.015, on='a')
m.clear_props(19, 28, 5, 6)

m.spot('arrive', 21, 31)
m.spot('descent', 10, 8)
m.spot('descent_front', 10, 12)
m.spot('lift_arrive', 31, 9)
m.spot('arena_door', 34, 18)
m.spot('chalk', 5, 21)
m.spot('orrin', 24, 13)
m.write('postgame_gate')
m.preview()
