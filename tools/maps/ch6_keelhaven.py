"""Chapter 6 — Keelhaven: a refugee camp on a great shard, built from the
upturned hulls of boats that rose with the falling sea. Plus its interiors."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

m = MapCanvas(50, 36, ground=' ', height=0, seed=81)
m.ellipse(25, 17.5, 23, 15.5, ground='a', height=2, jitter=0.18)
m.ellipse(25, 16, 17, 10, ground='q', height=2, jitter=0.3)
m.ellipse(41, 5, 5, 3.2, ground='q', height=3, jitter=0.15)      # the kite rock (NE)
m.ramp(39, 8, 2, 's', 3, 2, width=2, ground=':')
# streets
m.path([(0, 17), (49, 17)], width=2, ground=':', height=2)
m.path([(11, 9), (11, 17)], width=2, ground=':', height=2)
m.path([(34, 8), (34, 17)], width=2, ground=':', height=2)
m.path([(20, 17), (20, 26)], width=2, ground=':', height=2)
m.rect(21, 11, 11, 5, ground=';', height=2)                     # salvage market
m.rect(17, 19, 10, 4, ground=';', height=2)                     # the hearth square
# bridges
m.rect(0, 16, 3, 2, ground='=', height=2)
m.rect(46, 16, 4, 2, ground='=', height=2)

# hull-houses
m.building(7, 5, 7, 4, wall='wall_wood', roof='roof_slate', h=2.8, door={'dx': 4, 'to': 'c6_keel_inn', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[1, 5])
m.building(30, 4, 8, 4, wall='wall_wood', roof='roof_slate', h=3.0, door={'dx': 4, 'to': 'c6_keel_hall', 'tx': 6, 'ty': 7, 'dir': 'up'}, windows=[1, 6])
m.building(17, 6, 5, 3, wall='wall_wood', roof='roof_thatch', door={'dx': 2}, windows=[0])
m.building(4, 11, 4, 3, wall='wall_wood', roof='roof_thatch', door={'dx': 1}, windows=[3])
m.building(40, 10, 5, 3, wall='wall_wood', roof='roof_slate', door={'dx': 2}, windows=[4])
for (x, y, c) in [(7, 23, '#a89878'), (11, 26, '#8a7a6a'), (29, 25, '#b8a080'), (40, 22, '#7a6a5a'), (44, 25, '#a08a70'), (14, 29, '#9a8a7a'), (36, 28, '#8a7a68')]:
    m.structure('tent', x, y, color=c)

# the Lost Wall: a long fence of planks, letters pinned to its face
m.rect(23, 27, 9, 1, ground='W', height=2)
# props
m.set(13, 13, prop='u'); m.set(14, 12, prop='@')                # Maela's soup kettle
m.set(12, 12, prop='O'); m.set(15, 14, prop='k')
for x in (22, 24, 28, 30):
    m.set(x, 12, prop='=')
m.set(23, 12, prop='C'); m.set(26, 11, prop='O'); m.set(29, 11, prop='k'); m.set(31, 13, prop='C')
m.set(25, 14, prop='s')                                         # the bounty board
m.set(22, 20, prop='$')
m.set(26, 21, prop='@')
m.set(36, 20, prop='!')                                         # Cinder's pulpit
for (x, y) in [(4, 15), (4, 20), (45, 15), (45, 20), (16, 18), (30, 15), (11, 10), (34, 9)]:
    m.set(x, y, prop='L')
m.set(3, 15, prop='q'); m.set(3, 20, prop='q')
m.set(41, 4, prop='F'); m.set(43, 5, prop='R')
m.set(24, 33, prop='R')
m.scatter(0, 0, 50, 36, ['d', 'o', 'D', 'x'], 0.06, on='a')
m.scatter(0, 0, 50, 36, ['g', 'o', 'b', 'R'], 0.04, on='q')
m.clear_props(0, 16, 50, 4)
m.clear_props(10, 8, 3, 9); m.clear_props(33, 7, 3, 10); m.clear_props(19, 18, 3, 9)
m.clear_props(22, 28, 9, 2)
m.set(4, 15, prop='L'); m.set(4, 20, prop='L'); m.set(45, 15, prop='L'); m.set(45, 20, prop='L'); m.set(16, 18, prop='L'); m.set(30, 15, prop='L')

m.set(5, 15, prop='s')                                         # the Choir proclamation
m.spot('west_gate', 1, 16)
m.spot('east_gate', 46, 16)
m.spot('inn_door', 11, 9)
m.spot('hall_door', 34, 8)
m.spot('wall', 27, 28)
m.spot('kite', 41, 5)
m.write('c6_keelhaven')
m.preview()

# ------------------------------------------------------------------ The Upturned Keel (inn)
m = interior(13, 10, wall='W', floor='=', seed=82)
m.rect(1, 2, 5, 1, prop='O'); m.set(3, 2, prop='^')
m.set(6, 3, prop='='); m.set(7, 3, prop='=')                   # the bar
for x in (3, 9):
    m.set(x, 6, prop='='); m.set(x - 1, 6, prop='j'); m.set(x + 1, 6, prop='j')
m.set(10, 2, prop='E'); m.set(11, 2, prop='E'); m.set(9, 2, prop='^')
m.set(1, 8, prop='C'); m.set(11, 8, prop='k')
m.rect(6, 9, 1, 1, ground='x')
m.spot('entry', 6, 8); m.spot('keeper', 7, 2)
m.write('c6_keel_inn')

# ------------------------------------------------------------------ Warden's Hall (and infirmary)
m = interior(13, 9, wall='W', floor='+', seed=83)
m.set(5, 3, prop='='); m.set(6, 3, prop='='); m.set(7, 3, prop='=')   # map table
m.set(2, 2, prop='H'); m.set(3, 2, prop='H'); m.set(6, 2, prop='q')
m.set(9, 3, prop='E'); m.set(11, 3, prop='E'); m.set(9, 5, prop='E'); m.set(11, 5, prop='E')
m.set(10, 2, prop='^'); m.set(1, 6, prop='O'); m.set(1, 7, prop='C')
m.rect(6, 8, 1, 1, ground='x')
m.spot('entry', 6, 7); m.spot('hale', 6, 4); m.spot('ottilie', 10, 4)
m.write('c6_keel_hall')
