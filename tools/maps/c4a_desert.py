"""Chapter 4a — the Pilgrim Road into the Sunscar: sunscar_road, c4a_dunes, c4a_halcyon."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas


# ----------------------------------------------------------------- sunscar_road
# The heartland scrub gives way to sand. West: dead grass. East: the first dunes.
m = MapCanvas(42, 30, ground='s', height=1, seed=401)
m.rect(0, 0, 15, 30, ground='q')
m.scatter(0, 0, 18, 30, 'd', 0.0)
for (x, y, rx, ry) in [(4, 26, 4, 2.5), (10, 11, 3, 2), (2, 9, 3, 2.5), (13, 24, 2.5, 1.5)]:
    m.ellipse(x, y, rx, ry, ground='d', jitter=0.4)
m.ellipse(16, 22, 4, 6, ground='q', jitter=0.6)       # ragged scrub edge
# Northern mesas (red cliffs), higher toward the east.
m.ragged_edge('n', 6, '#', 1, var=2)
m.rect(0, 0, 42, 2, ground='#', height=3)
m.ellipse(31, 3, 9, 4, ground='#', height=3, jitter=0.3)
# Dunes in the south and east (walkable one-step rises).
m.ellipse(30, 25, 7, 3, ground='s', height=2, jitter=0.3)
m.ellipse(37, 8, 4, 2.5, ground='s', height=2, jitter=0.3)
m.ellipse(23, 9, 3, 1.6, ground='s', height=2, jitter=0.2)
m.ellipse(36, 23, 3, 2, ground='g', height=2, jitter=0.2)
m.rect(0, 28, 42, 2, ground='s', height=1)
m.ragged_edge('s', 2, 's', 2, var=1)
# The Pilgrim Road.
m.path([(0, 20), (10, 20), (17, 17), (28, 17), (35, 15), (41, 15)], width=2, ground=':', height=1)
# Pilgrim's Arch over the road and the waystation camp.
m.structure('arch', 21, 15, w=4, tex='wall_stone')
m.rect(25, 19, 9, 6, ground='d', height=1)
m.structure('tent', 26, 20, color='#c87a4a')
m.structure('tent', 31, 20, color='#d8c8a0')
m.set(29, 22, prop='@')
for (x, y, p) in [(25, 21, 'C'), (25, 22, 'k'), (33, 23, 'O'), (32, 23, 'O'), (27, 24, 'k')]:
    m.set(x, y, prop=p)
m.set(29, 19, prop='$')
# Props
m.scatter(0, 2, 16, 27, ['D', 'b', 'b', 'o', 'g'], 0.08, on='qd')
m.scatter(15, 6, 27, 22, ['c', 'R', 'o', 'x', 'o', 'c'], 0.05, on='s')
m.scatter(15, 6, 27, 22, ['o'], 0.04, on='g')
m.set(2, 18, prop='s')                                 # road sign
m.set(17, 19, prop='S')                                # Choir milestone
m.set(9, 24, prop='R'); m.set(10, 24, prop='o'); m.set(9, 23, prop='o')   # pilgrim cairn
m.clear_props(0, 18, 6, 5)
m.clear_props(37, 13, 5, 5)
m.spot('entry', 4, 20)
m.spot('camp', 29, 21)
m.spot('east_exit', 40, 15)
m.write('sunscar_road')
m.preview()


# ----------------------------------------------------------------- c4a_dunes
# The open Sunscar: glass flats, a giant's bones, an oasis, a raider camp, and
# a canyon north toward the smoke of a crashed airship.
m = MapCanvas(62, 46, ground='s', height=1, seed=402)
# Northern mesa wall with a canyon gap at x 40-43.
m.ragged_edge('n', 7, '#', 3, var=2)
m.rect(0, 0, 62, 2, ground='#', height=4)
m.rect(39, 0, 6, 9, ground='s', height=1)
m.rect(38, 0, 1, 7, ground='#', height=3); m.rect(45, 0, 1, 7, ground='#', height=3)
# Edges: west & east cliffs leave gates for the road; south dunes.
m.ragged_edge('w', 2, '#', 2, var=1)
m.ragged_edge('e', 2, '#', 2, var=1)
m.ragged_edge('s', 2, '#', 2, var=1)
m.rect(0, 20, 4, 5, ground='s', height=1)
m.rect(58, 25, 4, 5, ground='s', height=1)
# Dune ridges (height 2, some 3 with ramps).
for (x, y, rx, ry) in [(10, 12, 6, 3), (52, 14, 6, 3.5), (24, 35, 6, 3), (49, 40, 7, 2.5), (6, 40, 4, 2.5), (33, 12, 4, 2)]:
    m.ellipse(x, y, rx, ry, ground='s', height=2, jitter=0.3)
m.ellipse(52, 13, 3.5, 2, ground='s', height=3, jitter=0.2)
m.ramp(52, 17, 2, 'n', 2, 3, width=2, ground='s')
m.ellipse(10, 11, 3, 1.6, ground='s', height=3, jitter=0.2)
m.ramp(10, 14, 2, 'n', 2, 3, width=2, ground='s')
# Saltglass flats — the mirage country.
m.ellipse(33, 33, 9, 5, ground='g', height=1, jitter=0.35)
m.ellipse(44, 22, 4, 2.5, ground='g', height=1, jitter=0.3)
# The oasis (SW): water ringed with grass and palms.
m.ellipse(12, 31, 6, 4, ground='.', height=1, jitter=0.3)
m.ellipse(12, 31, 3.6, 2.2, ground='w', height=1)
m.ellipse(12, 31, 1.8, 1.0, ground='~', height=1)
# Raider camp (SE).
m.rect(47, 31, 11, 7, ground='d', height=1)
# Caravan track.
m.path([(0, 22), (12, 22), (19, 26), (30, 25), (40, 27), (50, 27), (61, 27)], width=2, ground=':', height=1)
m.path([(30, 25), (35, 18), (41, 10), (41, 0)], width=2, ground=':', height=1)
# Pilgrim shrine with a Hearthstone.
m.rect(21, 18, 5, 4, ground='_', height=1)
m.set(23, 18, prop='S'); m.set(21, 18, prop='!'); m.set(25, 18, prop='|')
m.set(23, 20, prop='$')
# The giant's bones: a ribcage arc north-west of the shrine.
for i, x in enumerate(range(14, 31, 2)):
    y = 9 + (1 if i % 3 else 0)
    m.set(x, y, prop='!' if i % 2 else 'R')
m.scatter(14, 7, 18, 6, ['x', 'x', 'o'], 0.25, on='s')
m.set(31, 8, prop='R'); m.set(32, 8, prop='R')       # the skull
# Raider camp furniture.
m.structure('tent', 49, 32, color='#8a3a2a'); m.structure('tent', 55, 32, color='#5a4a3a'); m.structure('tent', 52, 36, color='#8a3a2a')
m.set(52, 34, prop='@')
for (x, y, p) in [(48, 35, 'C'), (48, 36, 'C'), (57, 35, 'O'), (56, 36, 'k'), (50, 37, 'q'), (54, 31, 'q')]:
    m.set(x, y, prop=p)
# Oasis plants.
m.scatter(5, 26, 15, 11, ['Y', 'Y', 'n', 'g', 'b'], 0.2, on='.')
m.scatter(8, 28, 9, 7, ['n'], 0.3, on='w')
# Desert props.
m.scatter(3, 7, 56, 36, ['c', 'R', 'o', 'x', 'c', 'D'], 0.045, on='s')
m.scatter(3, 7, 56, 36, ['o', '*'], 0.03, on='g')
for (x, y) in [(0, 21), (1, 21), (0, 22), (1, 22), (2, 22), (60, 27), (61, 27), (60, 28)]:
    m.set(x, y, prop=' ')
m.clear_props(39, 0, 6, 10)
m.clear_props(0, 19, 6, 7)
m.clear_props(55, 24, 7, 7)
# Spots
m.spot('entry_w', 1, 22)
m.spot('entry_e', 59, 27)
m.spot('entry_n', 41, 1)
m.spot('shrine', 23, 21)
m.spot('mirage', 33, 32)
m.spot('raiders', 52, 35)
m.spot('oasis_hermit', 16, 28)
m.spot('smoke_view', 36, 19)
m.write('c4a_dunes')
m.preview()


# ----------------------------------------------------------------- c4a_halcyon
# The wreck of the airship Halcyon, nose-down in a dune.
m = MapCanvas(38, 30, ground='s', height=1, seed=403)
m.ragged_edge('n', 4, '#', 3, var=2)
m.rect(0, 0, 38, 1, ground='#', height=5)
m.ragged_edge('w', 2, '#', 2, var=1)
m.ragged_edge('e', 2, '#', 2, var=1)
m.rect(16, 27, 5, 3, ground='s', height=1)
# The skid furrow of glass behind the ship.
m.path([(27, 12), (31, 9), (35, 6)], width=3, ground='g', height=1)
m.scatter(26, 5, 10, 9, ['d', 'd', 'o'], 0.35, on='g')
# Hull: a raised plank deck (height 3) — the sand drifts up its port side.
m.ellipse(18, 11, 10, 3.6, ground='+', height=3)
m.ellipse(18, 11, 8.5, 2.4, ground='=', height=3)
m.rect(8, 10, 3, 3, ground='=', height=3)                    # stern
m.ellipse(13, 15, 4, 1.2, ground='s', height=2, jitter=0.2)  # drift
m.ramp(18, 16, 2, 'n', 1, 3, width=2, ground='=')          # gangplank
m.set(18, 14, ground='=', height=3); m.set(19, 14, ground='=', height=3)
# Masts, sails and cargo.
m.set(15, 10, prop='|'); m.set(22, 10, prop='|')
m.set(14, 10, prop='q'); m.set(23, 10, prop='q')
for (x, y, p) in [(11, 11, 'O'), (12, 12, 'C'), (25, 11, 'C'), (25, 12, 'k'), (20, 9, 'O'), (16, 13, 'k')]:
    m.set(x, y, prop=p)
# Spilled cargo on the sand and the wyrm's pit to the south.
m.ellipse(18, 21, 4, 2, ground='d', height=1, jitter=0.3)
for (x, y, p) in [(9, 18, 'C'), (10, 19, 'O'), (27, 17, 'C'), (28, 18, 'd'), (26, 19, 'k'), (12, 22, 'd'), (24, 23, 'd')]:
    m.set(x, y, prop=p)
m.scatter(3, 5, 32, 22, ['c', 'R', 'o', 'x'], 0.04, on='s')
m.clear_props(15, 13, 7, 17)
m.clear_props(15, 13, 7, 1)
m.spot('entry', 18, 28)
m.spot('corvin', 19, 12)
m.spot('wyrm', 18, 21)
m.spot('party', 18, 25)
m.spot('sockets', 18, 9)
m.write('c4a_halcyon')
m.preview()
