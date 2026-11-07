"""The Hiding Place — Lysa's memory of the festival square, the night the dark came in."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 34, 26
m = MapCanvas(W, H, ground=';', height=1, seed=1640)

# Rooftops close in on three sides: the square as a ten-year-old remembers it.
m.rect(0, 0, W, 3, ground='P', height=1)
m.rect(0, 0, 2, H, ground='P', height=1)
m.rect(W - 2, 0, 2, H, ground='P', height=1)
m.building(2, 3, 6, 3, wall='wall_plaster', roof='roof_red', windows=[1, 4])
m.building(9, 3, 5, 3, wall='wall_timber', roof='roof_blue', windows=[2])
m.building(20, 3, 5, 3, wall='wall_plaster', roof='roof_green', windows=[1, 3])
m.building(26, 3, 6, 3, wall='wall_brick', roof='roof_red', windows=[1, 4])
# The bell tower lane north, swallowed by dark.
m.rect(15, 0, 4, 6, ground=' ', height=0)
m.rect(14, 3, 1, 3, ground='P', height=1)
m.rect(19, 3, 1, 3, ground='P', height=1)

# The square.
m.ellipse(17, 13, 13, 8, ground='M', height=1, jitter=0.1)
m.ellipse(17, 13, 4, 2.5, ground=';', height=1)
m.set(17, 13, prop='Q')                         # fountain
# Festival stalls and clutter — every one a hiding place.
m.structure('tent', 7, 9, color='#c84a4a')
m.structure('tent', 27, 9, color='#4a7ac8')
m.structure('tent', 9, 19, color='#e0b040')
for (x, y) in [(24, 18), (25, 18), (24, 19)]:
    m.set(x, y, prop='O')                       # barrel stack
for (x, y) in [(4, 13), (5, 13)]:
    m.set(x, y, prop='C')                       # crate pile
m.set(29, 15, prop='h')                         # hay for the pony rides
m.set(13, 20, prop='W')                         # well
m.set(21, 9, prop='u')                          # the sweet-seller's cauldron

for (x, y) in [(10, 7), (24, 7), (4, 17), (30, 18), (12, 16), (22, 16), (17, 22)]:
    m.set(x, y, prop='L')
for (x, y) in [(13, 8), (21, 7), (6, 6), (28, 6)]:
    m.set(x, y, prop='q')
for (x, y) in [(3, 21), (30, 22), (2, 9), (31, 11)]:
    m.set(x, y, prop='K')
m.scatter(3, 7, 28, 16, ['f', 'f', 'o'], 0.05, on='M;')

# South: the chalk door home.
m.rect(15, 23, 4, 3, ground='M', height=1)
m.rect(0, 24, 15, 2, ground='P', height=1)
m.rect(19, 24, 15, 2, ground='P', height=1)
m.spot('arrive', 17, 22)
m.spot('lysa_start', 17, 15)
m.write('postgame_hiding')
m.preview()
