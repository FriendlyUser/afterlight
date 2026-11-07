"""Ch8 — Kiteholm, a shanty town of kites and scrap on a windy cliff-shard, plus its interiors."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

TOWN = 3

# =====================================================================
# Kiteholm
# =====================================================================
m = MapCanvas(48, 40, ground=' ', height=0, seed=808)

# The shard itself
m.ellipse(24, 21, 21, 16, ground='d', height=TOWN, jitter=0.25)
m.ellipse(24, 22, 17, 12, ground=':', height=TOWN, jitter=0.2)
m.scatter(4, 6, 40, 32, ['q'], 0.0)
for (cx, cy, rx, ry) in [(9, 28, 4, 3), (36, 31, 5, 3), (14, 9, 4, 3)]:
    m.ellipse(cx, cy, rx, ry, ground='q', height=TOWN, jitter=0.3)

# West dock (arrival) — planks out over the abyss, with rope rails
m.rect(0, 18, 9, 5, ground='=', height=TOWN)
for x in (1, 3, 5, 7):
    m.set(x, 18, prop='F')
    m.set(x, 22, prop='F')
m.rect(0, 16, 2, 2, ground='=', height=TOWN)
m.rect(0, 23, 2, 2, ground='=', height=TOWN)
m.set(0, 16, prop='V'); m.set(0, 24, prop='V')

# South-west dock: the Baron's skiff
m.rect(8, 33, 6, 2, ground='=', height=TOWN)
m.rect(9, 35, 2, 3, ground='=', height=TOWN)
m.set(9, 37, prop='V')

# The Baron's terrace (north)
m.rect(16, 2, 16, 8, ground=';', height=5)
m.rect(16, 2, 16, 1, ground='#', height=6)
m.ramp(23, 12, 3, 'n', TOWN, 5, width=3, ground=';')
m.building(19, 3, 10, 5, wall='wall_brick', roof='roof_slate', h=3.4,
           door={'dx': 5, 'to': 'c8_baron_hall', 'tx': 7, 'ty': 9, 'dir': 'up'}, windows=[1, 3, 7, 9])
for (x, y) in [(17, 8), (30, 8), (17, 4), (30, 4)]:
    m.set(x, y, prop='L')
m.set(18, 9, prop='a'); m.set(29, 9, prop='C'); m.set(28, 9, prop='C')

# The Kite Cliffs (east, highest point) with the signal mast
m.ellipse(40, 13, 6.5, 6, ground='q', height=6, jitter=0.2)
m.ramp(33, 13, 4, 'e', TOWN, 6, width=2, ground=':')
for (x, y) in [(39, 9), (42, 10), (44, 13), (41, 17), (38, 16), (36, 10)]:
    m.set(x, y, prop='q')
m.set(43, 12, prop='|')                                   # the old signal mast
m.set(45, 15, prop='F'); m.set(45, 14, prop='F'); m.set(44, 17, prop='F')

# Buildings: the Rusty Anchor, the Kite Nest, the Scrap Arena, shacks
m.building(8, 11, 7, 4, wall='wall_wood', roof='roof_thatch', h=2.8,
           door={'dx': 3, 'to': 'c8_rusty_anchor', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[1, 5])
m.building(27, 14, 6, 4, wall='wall_wood', roof='roof_red', h=3.0,
           door={'dx': 3, 'to': 'c8_kite_nest', 'tx': 7, 'ty': 9, 'dir': 'up'}, windows=[0, 5])
m.building(32, 23, 9, 5, wall='wall_ruin', roof='roof_slate', h=3.2,
           door={'dx': 4, 'to': 'c8_scrap_arena', 'tx': 10, 'ty': 15, 'dir': 'up'}, windows=[1, 7])
m.building(13, 24, 4, 3, wall='wall_wood', roof='roof_thatch', windows=[1])
m.building(5, 13, 3, 3, wall='wall_wood', roof='roof_red', windows=[1])
m.building(24, 28, 4, 3, wall='wall_timber', roof='roof_thatch', windows=[2])
m.building(37, 18, 3, 3, wall='wall_wood', roof='roof_green', windows=[1])

# Market square: stalls, Hearthstone, the town kite-pole
m.rect(17, 15, 10, 8, ground='=', height=TOWN)
m.structure('tent', 18, 16, color='#c86a3a')
m.structure('tent', 25, 16, color='#3a7aa8')
m.structure('tent', 18, 21, color='#d8b84a')
m.set(22, 20, prop='$')
m.set(22, 16, prop='q')
m.set(20, 15, prop='O'); m.set(24, 15, prop='C'); m.set(26, 21, prop='k'); m.set(26, 22, prop='O')
m.set(21, 23, prop='@')

# The Underhang ladder (south)
m.rect(22, 35, 3, 5, ground='=', height=TOWN)
m.set(21, 35, prop='F'); m.set(25, 35, prop='F')

# Railings, lamps, scrap
for (x, y) in [(6, 30), (5, 26), (40, 33), (42, 28), (44, 22), (12, 7), (35, 8), (4, 16)]:
    m.set(x, y, prop='F')
for (x, y) in [(10, 18), (16, 13), (28, 20), (12, 30), (31, 32), (22, 26), (34, 21)]:
    m.set(x, y, prop='L')
m.scatter(4, 5, 40, 32, ['C', 'O', 'k', 'R', 'q', 'a', 'd'], 0.05, on='d:q')
m.clear_props(9, 18, 3, 5)
m.clear_props(22, 9, 3, 6)
m.clear_props(17, 17, 10, 4)
m.clear_props(21, 30, 5, 10)
m.clear_props(30, 12, 6, 4)
m.clear_props(9, 15, 7, 2)
m.clear_props(30, 18, 5, 3)
m.clear_props(34, 28, 8, 3)
m.clear_props(22, 7, 5, 2)
m.set(22, 20, prop='$')                                  # Hearthstone (after the clears)

m.spot('entry', 4, 20)
m.spot('square', 22, 19)
m.spot('nest_door', 30, 18)
m.spot('anchor_door', 11, 15)
m.spot('cliff', 42, 14)
m.spot('ladder', 23, 38)
m.write('kiteholm')
m.preview()

# =====================================================================
# Interiors
# =====================================================================
# The Rusty Anchor — tavern & inn
m = interior(14, 10, wall='W', floor='=', seed=811)
m.rect(1, 2, 5, 1, prop='O'); m.set(7, 2, prop='='); m.set(8, 2, prop='=')
m.set(12, 2, prop='E'); m.set(11, 2, prop='H'); m.set(6, 2, prop='^'); m.set(10, 2, prop='^')
for (x, y) in [(3, 5), (9, 5), (11, 7)]:
    m.set(x, y, prop='='); m.set(x - 1, y, prop='j'); m.set(x + 1, y, prop='j')
m.set(1, 7, prop='C'); m.set(12, 5, prop='O')
m.spot('entry', 6, 8); m.spot('keeper', 7, 3); m.spot('bram', 10, 7)
m.write('c8_rusty_anchor')

# The Kite Nest — Pip's den for twenty orphans
m = interior(16, 11, wall='W', floor='+', seed=812)
for x in (1, 3, 12, 14):
    m.set(x, 3, prop='E'); m.set(x, 6, prop='E')
for x in (2, 5, 9, 13):
    m.set(x, 2, prop='q')
m.set(7, 4, prop='='); m.set(8, 4, prop='=')                # the map table
m.set(6, 2, prop='H'); m.set(10, 2, prop='C'); m.set(11, 2, prop='k'); m.set(1, 9, prop='O')
m.set(14, 9, prop='C'); m.set(7, 2, prop='^'); m.set(8, 7, prop='u')
m.spot('entry', 7, 9); m.spot('pip', 8, 5)
m.write('c8_kite_nest')

# The Baron's Hall — scrap throne room
m = interior(15, 11, wall='B', floor='+', seed=813)
m.rect(7, 3, 1, 8, ground='x')
m.set(7, 2, prop='S')                                         # a statue of the Baron. By the Baron.
m.set(6, 2, prop='q'); m.set(8, 2, prop='q')
for (x, y) in [(2, 3), (3, 3), (11, 3), (12, 3)]:
    m.set(x, y, prop='C')
m.set(1, 6, prop='a'); m.set(13, 6, prop='a'); m.set(2, 8, prop='O'); m.set(12, 8, prop='k')
m.set(4, 2, prop='^'); m.set(10, 2, prop='^')
m.spot('entry', 7, 9); m.spot('baron', 7, 3); m.spot('door_guard', 8, 8)
m.write('c8_baron_hall')

# The Scrap Arena — a fighting pit ringed with stands
m = MapCanvas(22, 18, ground='=', height=2, seed=814)
m.rect(0, 0, 22, 2, ground='W', height=3)
m.rect(0, 0, 1, 18, ground='W', height=3)
m.rect(21, 0, 1, 18, ground='W', height=3)
m.rect(4, 5, 14, 8, ground='d', height=0)                     # the pit
for x in range(4, 18):
    m.set(x, 4, prop='F')
for y in range(5, 13):
    m.set(3, y, prop='F'); m.set(18, y, prop='F')
m.ramp(10, 13, 2, 'n', 2, 0, width=2, ground='=')
m.ramp(10, 14, 1, 'n', 2, 2, width=2, ground='=')
for (x, y) in [(2, 2), (6, 2), (15, 2), (19, 2)]:
    m.set(x, y, prop='q')
for (x, y) in [(1, 6), (20, 6), (1, 10), (20, 10)]:
    m.set(x, y, prop='^')
m.set(5, 2, prop='j'); m.set(7, 2, prop='j'); m.set(14, 2, prop='j'); m.set(16, 2, prop='j')
m.set(2, 15, prop='O'); m.set(19, 15, prop='C')
m.spot('entry', 10, 15); m.spot('ratchet', 11, 3); m.spot('pit', 10, 8)
m.write('c8_scrap_arena')
