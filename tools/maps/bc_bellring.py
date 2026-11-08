"""The Bellring — Aurenne's colosseum: a sand ring under a horseshoe of stands (open to the
south, the camera side), the great bell on the top tier, and a forecourt with the
ringmaster's desk and the prize counter in front of a low barrier at the sand."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 32, 30
CX, CY = 16, 11
m = MapCanvas(W, H, ground=';', height=1, seed=61)

# Stands: two tiers round the ring (too high to climb onto), then the sand.
m.ellipse(CX, CY, 15.5, 10.5, ground='_', height=5)
m.ellipse(CX, CY, 13.3, 8.6, ground='M', height=3)
m.ellipse(CX, CY, 11, 6.8, ground='s', height=1, jitter=0.04)
m.ellipse(CX, CY, 4, 2.2, ground='d', height=1)
# Open the south arc: the forecourt runs up to the sand.
for y in range(CY + 4, H):
    for x in range(W):
        if m.g[y][x] in '_M':
            m.set(x, y, ground=';', height=1)
# Low walls frame the forecourt; the way out is the gap at the bottom.
m.rect(0, 16, 1, H - 16, ground='S', height=3)
m.rect(W - 1, 16, 1, H - 16, ground='S', height=3)
m.rect(0, H - 1, 12, 1, ground='S', height=3)
m.rect(20, H - 1, 12, 1, ground='S', height=3)
# Outside the stands: the colosseum's outer wall.
for y in range(0, CY + 5):
    for x in range(W):
        if m.g[y][x] == ';':
            m.set(x, y, ground='S', height=6)

# A barrier of fence posts between the forecourt and the sand, with a gate.
for x in list(range(5, 14)) + list(range(18, 27)):
    if m.g[17][x] in 's;':
        m.set(x, 17, prop='F')
for (x, y) in [(13, 17), (18, 17)]:
    m.set(x, y, prop='S')

# The great bell on the top tier; banners, torches and pillars round the stands.
m.set(16, 1, prop='N')
for (x, y) in [(6, 3), (26, 3), (2, 9), (30, 9), (3, 14), (29, 14)]:
    m.set(x, y, prop='^')
for (x, y) in [(10, 1), (22, 1), (3, 5), (29, 5), (1, 12), (31, 12)]:
    m.set(x, y, prop='q')
for (x, y) in [(13, 1), (19, 1), (1, 8), (31, 8)]:
    m.set(x, y, prop='|')
m.scatter(6, 5, 20, 11, ['o', 'd'], 0.04, on='s')
m.clear_props(12, 8, 8, 6)

# Forecourt: a red carpet from the gate, the ringmaster's desk and the prize counter,
# a Hearthstone, lamps, the fight card, barrels and crates.
m.rect(14, 18, 4, 9, ground='x', height=1)
for x in (13, 14):
    m.set(x, 22, prop='=')
for x in (21, 22):
    m.set(x, 22, prop='=')
m.set(6, 22, prop='$')
m.set(10, 25, prop='s')
for (x, y) in [(3, 19), (28, 19), (3, 26), (28, 26), (12, 28), (19, 28)]:
    m.set(x, y, prop='L')
for (x, y) in [(26, 24), (5, 25)]:
    m.set(x, y, prop='O')
m.set(25, 25, prop='C')

m.spot('arrive', 15, 28)
m.spot('ottavio', 13, 21)
m.spot('clerk', 21, 21)
m.spot('stone', 6, 23)
m.write('bc_bellring')
m.preview()
