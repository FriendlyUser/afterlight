"""Lanternfall Village — Wren's home isle (Act I)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(46, 36, ground='~', height=0, seed=7)

# Beach ring and grassy plateau
m.ellipse(23, 17, 22, 11.5, ground='s', height=0, jitter=0.2)
m.ellipse(23, 14, 19, 10, ground='.', height=1, jitter=0.15)
# Northern hills
m.rect(2, 1, 42, 7, ground=',', height=3)
m.ragged_edge('n', 3, ',', 3, var=2)
for x in range(2, 44):
    m.set(x, 7, ',', 3)
m.rect(0, 0, 46, 1, ground='#', height=4)
# Lantern promontory (NW) — high bluff
m.ellipse(9, 4, 7, 4, ground=',', height=6)
m.rect(3, 0, 13, 2, ground='#', height=8)
# Ramps: plateau -> hills, hills -> bluff
m.ramp(31, 9, 3, 'n', 1, 3, width=2, ground=':')
m.ramp(17, 4, 4, 'w', 3, 6, width=2, ground=':')
m.path([(19, 5), (31, 5), (31, 7)], width=2, ground=':', height=3)
m.path([(13, 4), (9, 6)], width=2, ground=':', height=6)

# Village square & paths
m.rect(19, 13, 9, 5, ground=';', height=1)
m.path([(23, 17), (23, 23)], width=2, ground=':', height=1)          # to beach
m.path([(16, 12), (16, 14), (19, 14)], width=1, ground=':', height=1)  # Wren's door
m.path([(24, 13), (24, 13)], width=1, ground=':', height=1)
m.path([(27, 15), (31, 15), (31, 11)], width=2, ground=':', height=1)  # to inn + ramp
m.path([(31, 16), (42, 16), (45, 17)], width=2, ground=':', height=1)   # east road
m.path([(10, 16), (19, 16)], width=1, ground=':', height=1)            # store
m.rect(42, 15, 4, 4, ground=':', height=1)

# Docks
m.rect(22, 24, 3, 9, ground='=', height=1)
m.rect(17, 30, 12, 2, ground='=', height=1)

# Buildings
m.building(14, 9, 4, 3, wall='wall_timber', roof='roof_blue', door={'dx': 2, 'to': 'lf_wren_house', 'tx': 4, 'ty': 7, 'dir': 'up'}, windows=[0, 3])
m.building(21, 9, 5, 3, wall='wall_plaster', roof='roof_red', door={'dx': 3, 'to': 'lf_nana_house', 'tx': 4, 'ty': 7, 'dir': 'up'}, windows=[1])
m.building(29, 11, 6, 4, wall='wall_stone', roof='roof_slate', h=3.0, door={'dx': 2, 'to': 'lf_inn', 'tx': 5, 'ty': 8, 'dir': 'up'}, windows=[0, 4, 5])
m.building(8, 13, 5, 3, wall='wall_wood', roof='roof_thatch', door={'dx': 2, 'to': 'lf_store', 'tx': 4, 'ty': 7, 'dir': 'up'}, windows=[0, 4])
m.building(36, 18, 4, 3, wall='wall_wood', roof='roof_thatch', door={'dx': 1, 'to': 'lf_tobias', 'tx': 3, 'ty': 6, 'dir': 'up'}, windows=[3])

# The Lantern
m.structure('lantern', 8, 3, doorTo='lf_lantern', tx=7, ty=11, dir='up', unlockFlag='ch1_named', lockedText='The Lantern is sealed until the Kindling.')

# Props
m.set(23, 15, prop='W')                       # well
m.set(20, 13, prop='s')                       # sign
m.set(27, 17, prop='$')                       # hearthstone
for (x, y) in [(18, 13), (28, 13), (18, 17), (28, 17), (31, 19), (23, 21), (39, 16), (13, 16)]:
    m.set(x, y, prop='L')
m.scatter(2, 1, 42, 7, ['T', 'P', 'P', 'b'], 0.18, on=',')
m.scatter(3, 3, 13, 6, ['P', 'b', 'f'], 0.12, on=',')
m.scatter(4, 8, 38, 14, ['f', 'g', 'g', 'b'], 0.07, on='.')
m.scatter(4, 8, 38, 14, ['T'], 0.025, on='.')
m.scatter(2, 18, 42, 14, ['o', 'g'], 0.04, on='s')
m.scatter(34, 23, 9, 7, ['R', 'R', 'o'], 0.25, on='s')
for x in range(13, 18):
    m.set(x, 12, prop='F') if x not in (16,) else None
m.rect(26, 10, 2, 1, prop='F')
for (x, y, p) in [(21, 25, 'O'), (21, 26, 'C'), (25, 27, 'O'), (25, 25, 'k'), (35, 21, 'h'), (40, 20, 'O')]:
    m.set(x, y, prop=p)
m.set(27, 33, prop='V')
m.set(19, 33, prop='V')

# Spots used by events
m.spot('start', 16, 13)
m.spot('square', 23, 16)
m.spot('dock_end', 23, 31)
m.spot('beach_rocks', 38, 25)
m.spot('east_exit', 44, 16)
m.spot('lantern_door', 8, 5)
m.spot('tobias', 33, 19)
m.spot('ilse_garden', 26, 12)
m.spot('nana', 24, 13)

m.write('lanternfall')
m.preview()
