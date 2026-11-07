"""Chapter 4b — the Stormcrown: Stormfoot (the Halcyon's mooring), the flight deck,
the floating isle of Skyreach, Vasha's Lantern and the Undercradle (storm dungeon).
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior, carve

# =====================================================================
# c4b_stormfoot — the foot of the Stormcrown, where the Halcyon is moored
# =====================================================================
m = MapCanvas(46, 34, ground='q', height=2, seed=431)
m.rect(0, 0, 46, 5, ground='#', height=7)
m.ragged_edge('n', 6, '#', 7, var=2)
m.ragged_edge('w', 2, '#', 6, var=1)
m.ragged_edge('e', 2, '#', 6, var=1)
for (cx, cy, rx, ry) in [(10, 25, 7, 4), (34, 28, 8, 3), (24, 20, 9, 3)]:
    m.ellipse(cx, cy, rx, ry, ground='d', height=2, jitter=0.3)
# Crags with the storm-core seams (raised, with ramps)
for (cx, cy, rx, ry, rx0, ry0, rdir) in [(7, 11, 4, 3, 7, 15, 'n'), (39, 10, 4, 3, 39, 14, 'n'), (39, 27, 4, 2.5, 34, 27, 'e')]:
    m.ellipse(cx, cy, rx, ry, ground='_', height=4, jitter=0.15)
    m.ramp(rx0, ry0, 3, rdir, 2, 4, width=2, ground=':')
# The Halcyon on her cradle: a hull of dark timber with a plank deck (height 5)
m.ellipse(23, 8, 10, 2.6, ground='=', height=5)
m.rect(13, 7, 4, 3, ground='=', height=5)                     # stern
m.set(34, 8, ground='=', height=5)                             # prow
m.ramp(23, 14, 4, 'n', 2, 5, width=2, ground='+')              # gangplank
for (x, y, p) in [(19, 8, '|'), (27, 8, '|'), (19, 7, 'q'), (27, 7, 'q'), (15, 8, 'O'), (16, 7, 'C'), (30, 9, 'k'), (31, 7, 'O')]:
    m.set(x, y, prop=p)
# Mooring posts and the camp of a grounded trader
for (x, y) in [(13, 12), (33, 12)]:
    m.set(x, y, prop='|')
m.structure('tent', 11, 21, color='#6a5a8a')
m.set(13, 23, prop='@')
m.path([(2, 29), (12, 26), (20, 18), (23, 15)], width=2, ground=':', height=2)
m.path([(20, 18), (36, 18), (39, 15)], width=2, ground=':', height=2)
m.path([(28, 24), (33, 27)], width=2, ground=':', height=2)
m.rect(0, 28, 3, 3, ground=':', height=2)

m.scatter(0, 0, 46, 34, ['R', 'R', 'D', 'o'], 0.08, on='qd')
m.scatter(0, 0, 46, 34, ['*', 'R'], 0.25, on='_')
m.scatter(0, 0, 46, 8, ['R', 'D'], 0.1, on='#')
m.clear_props(20, 12, 7, 8)
m.clear_props(0, 26, 6, 6)
for (cx, cy) in [(7, 11), (39, 10), (39, 27)]:
    m.clear_props(cx - 1, cy - 1, 3, 3)
m.set(19, 16, prop='$')
m.set(26, 15, prop='L')

m.spot('west', 1, 29)
m.spot('arrive', 5, 28)
m.spot('gangplank', 23, 15)
m.spot('deck', 23, 9)
m.spot('corvin', 22, 12)
m.spot('core1', 7, 11)
m.spot('core2', 39, 10)
m.spot('core3', 39, 27)
for k in ('core1', 'core2', 'core3'):
    x, y = m.spots[k]
    m.set(x, y, prop='*')                                       # the storm-core seams
m.spot('joss', 11, 23)
m.spot('ambush', 23, 17)
for name, (x, y) in {'c_west': (4, 7), 'c_east': (43, 22), 'c_crag': (41, 11), 'c_camp': (9, 21)}.items():
    m.spot(name, x, y)
m.write('c4b_stormfoot')
m.preview()

# =====================================================================
# c4b_halcyon_deck — the flight up through the storm
# =====================================================================
m = MapCanvas(28, 14, ground=' ', height=0, seed=432)
m.ellipse(14, 7, 11, 3.4, ground='=', height=2)
m.rect(3, 6, 22, 3, ground='=', height=2)
m.set(25, 7, ground='=', height=2)
for (x, y, p) in [(10, 6, '|'), (18, 6, '|'), (10, 5, 'q'), (18, 5, 'q'), (5, 7, 'O'), (6, 8, 'C'), (21, 8, 'k'), (22, 6, 'O'), (14, 5, 'L')]:
    m.set(x, y, prop=p)
m.spot('wheel', 7, 6)
m.spot('wren', 13, 7)
m.spot('ilse', 12, 8)
m.spot('bram', 16, 8)
m.spot('sable', 14, 8)
m.spot('pip', 20, 7)
m.spot('corvin', 7, 7)
m.write('c4b_halcyon_deck')

# =====================================================================
# c4b_skyreach — the floating isle of the airship folk
# =====================================================================
m = MapCanvas(50, 40, ground=' ', height=0, seed=433)
m.ellipse(25, 18, 21, 14, ground='.', height=4, jitter=0.12)
m.ellipse(25, 18, 15, 10, ground='_', height=4, jitter=0.1)
m.ellipse(25, 6, 6, 3.5, ground='M', height=5)                  # Lantern terrace
m.ramp(25, 11, 2, 'n', 4, 5, width=3, ground=':')
m.path([(25, 9), (25, 30)], width=3, ground=';', height=4)
m.path([(8, 20), (44, 20)], width=2, ground=';', height=4)
# Piers into the sky (south) — the Halcyon crashes into Ilka's yard (south-west)
for x0 in (21, 29):
    m.rect(x0, 31, 2, 8, ground='=', height=4)
m.rect(21, 30, 10, 2, ground='=', height=4)
m.ellipse(12, 30, 7, 4, ground='d', height=4, jitter=0.15)      # Ilka's shipyard
m.rect(6, 28, 6, 3, ground='+', height=4)                         # the wrecked hull
for (x, y, p) in [(8, 28, '!'), (11, 29, 'd'), (6, 30, 'd'), (14, 27, 'a'), (16, 29, 'C'), (17, 30, 'C'), (15, 32, 'O'), (9, 32, 'k')]:
    m.set(x, y, prop=p)
# The Keel Lift (east)
m.rect(44, 17, 6, 5, ground='_', height=4)
for (x, y) in [(45, 16), (45, 22), (48, 16), (48, 22)]:
    m.set(x, y, prop='|')
# Buildings
m.building(14, 9, 5, 3, wall='wall_plaster', roof='roof_blue', windows=[1, 3])
m.building(32, 9, 5, 3, wall='wall_plaster', roof='roof_blue', windows=[0, 3])
m.building(10, 15, 4, 3, wall='wall_wood', roof='roof_slate', windows=[1])
m.building(35, 13, 5, 3, wall='wall_plaster', roof='roof_red', windows=[1, 3])
m.building(17, 22, 5, 3, wall='wall_wood', roof='roof_blue', windows=[0, 4])
m.building(33, 23, 5, 3, wall='wall_plaster', roof='roof_slate', windows=[2])
m.structure('lantern', 25, 5, lit=False, doorTo='c4b_sky_lantern', tx=7, ty=10, dir='up')
m.structure('tent', 39, 19, color='#c87a4a')
m.structure('tent', 39, 22, color='#4a7ac8')
# Windmills (pillars with sails) and kites
for (x, y) in [(8, 12), (42, 12), (13, 25), (40, 27)]:
    m.set(x, y, prop='|'); m.set(x, y - 1, prop='q')
for (x, y) in [(22, 13), (28, 13), (22, 27), (28, 27), (20, 20), (30, 20)]:
    m.set(x, y, prop='L')
m.set(27, 17, prop='$')
m.set(23, 17, prop='Q')
m.scatter(4, 4, 42, 30, ['b', 'B', 'f', 'g', 'o'], 0.08, on='.')
m.scatter(4, 4, 42, 30, ['o'], 0.02, on='_')
m.clear_props(23, 9, 5, 22)
m.clear_props(8, 19, 37, 3)

m.spot('crash', 9, 29)
m.spot('arrive', 13, 31)
m.spot('ilka', 15, 30)
m.spot('lantern_door', 25, 7)
m.spot('vasha_out', 27, 8)
m.spot('square', 25, 19)
m.spot('lift', 46, 19)
m.spot('innkeep', 31, 17)
m.spot('merchant', 38, 20)
m.spot('chime_girl', 30, 28)
m.spot('kite_kids', 18, 14)
m.spot('elder', 12, 19)
m.spot('pilot', 22, 34)
m.spot('priest', 21, 8)
m.spot('dockhand', 30, 33)
m.spot('corvin_dock', 24, 31)
m.write('c4b_skyreach')
m.preview()

# =====================================================================
# c4b_sky_lantern — Vasha's Lantern hall
# =====================================================================
m = interior(15, 12, wall='K', floor='M', seed=434)
m.rect(5, 2, 5, 2, ground='_', height=1)
m.stair(6, 4, 3, 1)
m.rect(7, 5, 1, 7, ground='X')
for y in (4, 7):
    m.set(2, y, prop='|'); m.set(12, y, prop='|')
m.set(7, 2, prop='|')
m.set(1, 2, prop='q'); m.set(13, 2, prop='q'); m.set(3, 2, prop='^'); m.set(11, 2, prop='^')
m.set(12, 9, prop='H'); m.set(2, 9, prop='=')
m.spot('vasha', 7, 4); m.spot('cradle', 7, 3); m.spot('entry', 7, 10)
m.write('c4b_sky_lantern')

# =====================================================================
# c4b_undercradle — the stone keel beneath Skyreach, open to the storm
# =====================================================================
m = MapCanvas(50, 44, ground=' ', height=0, seed=435)

def rock(cx, cy, rx, ry):
    m.ellipse(cx, cy, rx, ry, ground='c', height=2, jitter=0.2)

def bridge(points, width=2):
    m.path(points, width=width, ground='=', height=2)

rock(25, 4, 5, 3)
rock(25, 15, 7, 4)
rock(8, 15, 5, 4)
rock(42, 15, 5, 4)
rock(11, 28, 5, 3.5)
rock(25, 33, 5, 2.5)
rock(25, 40, 9, 3.5)
bridge([(25, 7), (25, 11)], width=3)
bridge([(18, 15), (13, 15)])
bridge([(32, 15), (37, 15)])
bridge([(20, 18), (14, 25)])
bridge([(25, 19), (25, 31)], width=3)
bridge([(25, 35), (25, 37)], width=3)
# Rock spires and storm crystals
for (x, y) in [(21, 3), (29, 3), (19, 14), (31, 16), (6, 13), (44, 17), (8, 29), (19, 40), (31, 40)]:
    m.set(x, y, ground='C', height=2)
m.scatter(0, 0, 50, 44, ['*', 'o', 'A', 'o'], 0.1, on='c')
m.clear_props(23, 0, 5, 44)
m.clear_props(17, 36, 17, 7)
for (x, y) in [(6, 15), (44, 15), (10, 28)]:
    m.clear_props(x - 1, y - 1, 3, 3)
m.set(27, 33, prop='$')
m.spot('entry', 25, 3)
m.spot('pylon_w', 6, 15)
m.spot('pylon_e', 44, 15)
m.spot('pylon_s', 10, 28)
m.spot('glider', 14, 26)
for k in ('pylon_w', 'pylon_e', 'pylon_s'):
    x, y = m.spots[k]
    m.set(x, y, prop='|')                                       # the dead lift-pylons
m.set(14, 26, prop='!')                                         # Aram's broken glider mast
m.set(13, 25, prop='d'); m.set(15, 27, prop='d')
m.spot('gate1', 24, 21)
m.spot('gate2', 24, 24)
m.spot('gate3', 24, 27)
m.spot('save', 27, 33)
m.spot('boss', 25, 37)
m.spot('eye', 25, 41)
for name, (x, y) in {'c_w': (9, 18), 'c_e': (41, 18), 'c_s': (14, 29), 'c_hub': (30, 13), 'c_entry': (28, 5), 'c_save': (22, 33)}.items():
    m.spot(name, x, y)
m.write('c4b_undercradle')
m.preview()
