"""Ch7 — The ruins of Aurenne (Act II) plus the Ember Ward and the Last Bell interiors."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# =====================================================================
# Ruined Aurenne — the City of Bells, a year after the Sundering.
# The city now floats on its own shard; the abyss shows at the margins.
# =====================================================================
m = MapCanvas(46, 44, ground='a', height=2, seed=707)

# Abyss margins and the rubble ridge of the upper city.
m.ragged_edge('w', 2, ' ', 0, var=2)
m.ragged_edge('e', 2, ' ', 0, var=2)
m.rect(0, 0, 46, 2, ground='#', height=6)
m.ragged_edge('n', 3, '#', 6, var=1)
for y in range(40, 44):          # south corners crumble into the void
    for x in range(0, 6 - (43 - y)):
        m.set(x, y, ' ', 0)
    for x in range(41 + (43 - y), 46):
        m.set(x, y, ' ', 0)

# ---- Cathedral plaza (north) with the cracked Grand Lantern
m.rect(13, 3, 20, 8, ground='M', height=4)
m.rect(14, 2, 18, 1, ground='M', height=4)
m.ramp(22, 13, 3, 'n', 2, 4, width=3, ground='_')
for (x, y, w, h) in [(13, 3, 1, 3), (13, 8, 1, 3), (32, 3, 1, 2), (32, 7, 1, 4), (14, 2, 3, 1), (20, 2, 2, 1), (27, 2, 4, 1)]:
    m.rect(x, y, w, h, ground='R', height=4)           # the cathedral's broken walls
m.structure('lantern', 23, 5, lit=False)
for (x, y) in [(16, 4), (16, 8), (30, 4), (30, 8)]:
    m.set(x, y, prop='|')
for (x, y) in [(18, 9), (28, 9), (19, 3)]:
    m.set(x, y, prop='!')
m.set(17, 6, prop='S'); m.set(29, 6, prop='S')
m.scatter(14, 3, 18, 8, ['d', 'd', 'o'], 0.12, on='M')

# ---- Ash Square: the survivors' camp (center)
m.rect(15, 15, 16, 13, ground=';', height=2)
m.scatter(15, 15, 16, 13, ['a'], 0.0)
for (x, y) in [(16, 16), (29, 16), (16, 26), (29, 26), (21, 15), (25, 27)]:
    m.set(x, y, ground='a')
m.set(20, 19, prop='W')                                  # the rationed well
m.set(23, 21, prop='@')                                  # the common fire
m.set(26, 25, prop='$')                                  # Hearthstone
m.set(24, 17, prop='s')                                  # notice board
m.set(18, 24, prop='u')                                  # soup kitchen
for (x, y, p) in [(16, 23, 'C'), (17, 23, 'C'), (16, 24, 'O'), (16, 25, 'k'), (19, 25, 'k'), (28, 18, 'O'), (29, 18, 'C')]:
    m.set(x, y, prop=p)
m.structure('tent', 17, 17, color='#8a6a5a')
m.structure('tent', 28, 21, color='#6a5a6a')
m.structure('tent', 19, 27, color='#7a5040')
m.structure('tent', 28, 24, color='#5a6070')

# ---- Bellfounders' Quarter (west): fallen towers and the Undercroft stair
m.rect(3, 8, 11, 24, ground='r', height=2)
m.rect(4, 9, 3, 3, ground='R', height=3)                 # bell tower stump (the one bell left)
m.rect(9, 13, 2, 2, ground='R', height=4)
m.rect(3, 15, 2, 2, ground='R', height=2)
m.set(8, 11, prop='!'); m.set(11, 10, prop='!'); m.set(5, 13, prop='d')
# Sunken courtyard and the Undercroft gate
m.rect(4, 20, 8, 7, ground='_', height=0)
m.rect(3, 19, 10, 1, ground='R', height=1)
m.rect(3, 19, 1, 9, ground='R', height=1)
m.rect(3, 27, 10, 1, ground='R', height=1)
m.rect(6, 19, 4, 1, ground='_', height=0)
m.rect(6, 18, 4, 1, ground='R', height=2)
m.set(7, 18, ground='c', height=0); m.set(8, 18, ground='c', height=0)
m.structure('arch', 6, 19, w=4, tex='wall_ruin')
m.ramp(14, 22, 3, 'w', 2, 0, width=2, ground='_')
m.rect(12, 22, 2, 2, ground='_')
for (x, y) in [(5, 21), (10, 21), (5, 25), (10, 25), (11, 20)]:
    m.set(x, y, prop='%')
m.set(4, 26, prop='x'); m.set(11, 26, prop='d')

# ---- The Ember Ward (east) and the overflow cots
m.rect(30, 10, 13, 10, ground=';', height=2)
m.building(31, 11, 10, 5, wall='wall_plaster', roof='roof_slate', h=3.2,
           door={'dx': 5, 'to': 'c7_ember_ward', 'tx': 9, 'ty': 10, 'dir': 'up'}, windows=[1, 3, 7, 9])
for x in (31, 33, 38, 40):
    m.set(x, 18, prop='E')
m.set(35, 18, prop='q'); m.set(41, 17, prop='u'); m.set(30, 17, prop='k')
m.structure('tent', 32, 20, color='#d8d0c0')
m.structure('tent', 39, 20, color='#d8d0c0')

# ---- The Last Bell (inn, in a half-fallen chapel)
m.building(33, 24, 6, 4, wall='wall_stone', roof='roof_red', h=3.0,
           door={'dx': 3, 'to': 'c7_last_bell', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[1, 5])
m.set(32, 26, prop='O'); m.set(39, 27, prop='C')

# ---- Memorial garden (southwest)
m.rect(4, 31, 10, 7, ground='q', height=2)
for (x, y) in [(5, 32), (7, 32), (9, 32), (11, 32), (5, 34), (7, 34), (9, 34), (11, 34), (6, 36), (8, 36), (10, 36)]:
    m.set(x, y, prop='t')
m.set(12, 36, prop='D'); m.set(4, 37, prop='D')

# ---- Collapsed houses scattered through the city
for (x, y, w, h) in [(15, 30, 3, 1), (15, 30, 1, 3), (26, 31, 4, 1), (29, 31, 1, 3), (31, 33, 3, 1), (36, 30, 1, 3), (10, 28, 3, 1)]:
    m.rect(x, y, w, h, ground='R', height=2)

# ---- Pilgrim's Road (south) and the broken gate
m.path([(20, 43), (20, 34), (21, 29), (22, 27)], width=3, ground=':', height=2)
m.path([(31, 20), (36, 16)], width=2, ground=';', height=2)
m.path([(31, 22), (36, 28)], width=2, ground=';', height=2)
m.structure('arch', 18, 35, w=5, tex='wall_ruin')
m.rect(40, 29, 4, 2, ground='=', height=2)               # the east bridge, ending in nothing
m.set(43, 29, ground=' '); m.set(43, 30, ground=' ')

# ---- Ash, rubble and dead trees
m.scatter(2, 2, 42, 40, ['d', 'd', 'R', 'D', 'o', 'x'], 0.07, on='a')
m.scatter(3, 8, 11, 12, ['d', 'R', '!'], 0.12, on='r')
m.scatter(2, 36, 42, 6, ['D', 'R', 'd'], 0.12, on='a')
m.clear_props(18, 28, 6, 16)                             # keep the road clear
m.clear_props(12, 21, 4, 4)
m.clear_props(34, 16, 4, 2)
m.clear_props(35, 28, 3, 2)
for (x, y) in [(18, 33), (23, 33), (14, 28), (31, 21), (24, 13), (21, 13)]:
    m.set(x, y, prop='^')

m.spot('entry', 20, 38)
m.spot('ward_door', 36, 16)
m.spot('inn_door', 36, 28)
m.spot('stair', 7, 21)
m.spot('lantern', 23, 7)
m.spot('square', 22, 22)
m.write('ruined_aurenne')
m.preview()

# =====================================================================
# The Ember Ward — field hospital in the old Bellwrights' Hall.
# =====================================================================
m = interior(20, 12, wall='P', floor='+', seed=711)
for x in (2, 4, 6, 13, 15, 17):
    m.set(x, 3, prop='E')
    m.set(x, 6, prop='E')
for x in (2, 4, 15, 17):
    m.set(x, 9, prop='E')
m.set(9, 2, prop='u'); m.set(10, 2, prop='H'); m.set(11, 2, prop='H'); m.set(1, 2, prop='H')
m.set(9, 5, prop='='); m.set(10, 5, prop='=')
m.set(18, 2, prop='C'); m.set(18, 3, prop='k'); m.set(1, 9, prop='O'); m.set(8, 2, prop='^'); m.set(12, 2, prop='^')
m.set(7, 9, prop='u'); m.set(12, 9, prop='C')
m.rect(9, 6, 2, 6, ground='X')                          # the one clean aisle
m.spot('entry', 9, 10); m.spot('ilse', 10, 4); m.spot('noll', 7, 7)
m.write('c7_ember_ward')

# =====================================================================
# The Last Bell — tavern in a half-fallen chapel.
# =====================================================================
m = interior(13, 10, wall='S', floor='_', seed=713)
m.rect(1, 2, 4, 1, prop='O'); m.set(6, 2, prop='='); m.set(7, 2, prop='=')
m.set(11, 2, prop='H'); m.set(10, 2, prop='E')
for (x, y) in [(2, 5), (6, 5), (10, 5)]:
    m.set(x, y, prop='='); m.set(x - 1, y, prop='j'); m.set(x + 1, y, prop='j')
m.set(5, 2, prop='^'); m.set(9, 2, prop='^'); m.set(1, 7, prop='C'); m.set(11, 7, prop='!')
m.rect(6, 6, 1, 4, ground='x')
m.spot('entry', 6, 8); m.spot('keeper', 7, 3)
m.write('c7_last_bell')
