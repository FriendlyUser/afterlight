"""The Keeper's Stair — Chapter 5. An old passage climbing from the back of the
tide caves up through the bluff to the Lantern of Lanternfall."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, cave, carve

W, H = 34, 42
m = MapCanvas(W, H, ground='C', height=0, seed=55)

# --- Entry grotto (h0): where the shattered crystal opened the way
cave(m, 4, 31, 26, 10, fill=0.42, steps=3)
m.ellipse(17, 36, 8, 3.6, ground='c', height=0, jitter=0.25)
carve(m, [(17, 41), (17, 37), (17, 32)], width=3, ground='c', height=0)
m.ellipse(10, 36, 2.2, 1.2, ground='w', height=0)
m.ellipse(24, 37, 2.6, 1.4, ground='w', height=0)

# --- The Drowned Steps: carved stair, h0 -> h3
m.ramp(16, 31, 7, 'n', 0, 3, width=3, ground='_')
# West branch (h1): the Keepers' Rest
m.rect(9, 28, 7, 2, ground='_', height=1)
m.rect(3, 24, 7, 8, ground='_', height=1)
m.rect(2, 23, 9, 1, ground='S', height=1)
# East branch (h2): the Flooded Gallery
m.rect(19, 26, 4, 2, ground='_', height=2)
m.ellipse(26, 28, 5, 3.4, ground='c', height=2, jitter=0.2)
m.ellipse(27, 29, 2.4, 1.3, ground='w', height=2)

# --- The Lamp Hall (h3)
m.rect(7, 14, 20, 11, ground='S', height=3)
m.rect(8, 15, 18, 9, ground='_', height=3)
m.rect(16, 24, 3, 1, ground='_', height=3)
m.rect(14, 17, 6, 5, ground='x', height=3)            # worn runner
m.rect(26, 17, 3, 3, ground='_', height=3)            # carving alcove
m.rect(16, 14, 3, 1, ground='_', height=3)            # gate (blocker in map file)

# --- The Long Climb: a chasm crossed by ledges and an old plank bridge
m.rect(3, 3, 28, 11, ground=' ', height=0)
m.rect(15, 10, 5, 4, ground='c', height=3)            # ledge A (below the gate)
m.rect(5, 11, 10, 2, ground='c', height=3)            # west ledge
m.rect(20, 11, 8, 2, ground='c', height=3)            # east dead-end ledge
m.rect(26, 9, 3, 4, ground='c', height=3)
m.ramp(5, 10, 5, 'n', 3, 5, width=2, ground='_')      # climb north
m.rect(5, 4, 9, 2, ground='c', height=5)              # ledge B
m.rect(14, 5, 7, 1, ground='=', height=5)             # plank bridge
m.rect(21, 3, 8, 5, ground='c', height=5)             # ledge C

# --- The Stair Head (h6)
m.rect(13, 0, 9, 3, ground='S', height=6)
m.rect(14, 1, 7, 3, ground='_', height=6)
m.rect(17, 0, 1, 1, ground='_', height=6)             # exit to the bluff
m.rect(16, 0, 1, 1, ground='S', height=6)

# Walls hug the floor beside them so the cutaway stays readable.
floor = lambda ch: ch not in 'CS '
for y in range(H):
    for x in range(W):
        if m.g[y][x] not in 'CS':
            continue
        best = 0
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                xx, yy = x + dx, y + dy
                if m.inside(xx, yy) and floor(m.g[yy][xx]):
                    best = max(best, m.hg[yy][xx])
        m.hg[y][x] = best

# --- Props
m.scatter(4, 31, 26, 10, ['%', 'o', 'G', 'x', 'A'], 0.08, on='c')
m.scatter(20, 24, 12, 8, ['G', 'o', 'n'], 0.1, on='c')
for (x, y) in [(4, 25), (6, 25), (8, 25), (4, 27), (8, 27)]:
    m.set(x, y, prop='t')                              # Keepers' graves
m.set(3, 30, prop='^'); m.set(9, 30, prop='^')
m.set(6, 24, prop='S')                                 # the first Keeper
for (x, y) in [(9, 16), (24, 16), (9, 22), (24, 22)]:
    m.set(x, y, prop='|')
for (x, y) in [(11, 15), (14, 15), (21, 15)]:
    m.set(x, y, prop='S')                              # the three lamp pedestals
m.set(10, 19, prop='^'); m.set(23, 19, prop='^')
m.set(8, 23, prop='!'); m.set(25, 23, prop='d')
m.set(28, 18, prop='d')
m.scatter(5, 3, 26, 11, ['A', '*', 'o'], 0.06, on='c')
m.set(15, 1, prop='^'); m.set(20, 1, prop='^')
m.set(19, 2, prop='$')
m.clear_props(15, 30, 5, 12)
m.clear_props(16, 10, 3, 5)

m.spot('entry', 17, 40)
m.spot('top', 17, 1)
m.write('ch5_keepers_stair')
m.preview()
