"""Ch7 — The Drowned Undercroft (flooded halls) and the Cistern of Bells (boss floor)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

FLOOR = 2

# =====================================================================
# Floor 1 — the Drowned Undercroft
# =====================================================================
m = MapCanvas(48, 40, ground='S', height=FLOOR, seed=7101)

def room(x, y, w, h, g='_'):
    m.rect(x, y, w, h, ground=g, height=FLOOR)

# Entry corridor and the South Hall (half flooded)
room(22, 36, 3, 4)
room(18, 29, 12, 7)
m.ellipse(23.5, 32.5, 5, 2.6, ground='w', height=FLOOR)
m.ellipse(20, 31, 1.5, 1.2, ground='~', height=FLOOR)
m.ellipse(28, 34, 1.4, 1.2, ground='~', height=FLOOR)
for (x, y) in [(19, 30), (28, 30), (19, 34)]:
    m.set(x, y, prop='|')

# Central Nave: a causeway between two deep channels
room(20, 13, 8, 16)
m.rect(20, 13, 2, 16, ground='~', height=FLOOR)
m.rect(26, 13, 2, 16, ground='~', height=FLOOR)
for y in (14, 18, 22, 26):
    m.set(22, y, prop='|'); m.set(25, y, prop='|')
m.set(23, 20, prop='x'); m.set(24, 16, prop='d')

# Sluice gate row and the Chapel of Low Water (marble: no encounters)
room(22, 12, 4, 1)
room(19, 3, 10, 9, g='M')
m.ramp(23, 6, 3, 'n', 2, 0, width=2, ground='c')
m.set(21, 6, prop='$')
for (x, y) in [(19, 3), (28, 3), (19, 10), (28, 10)]:
    m.set(x, y, prop='^')
m.set(26, 5, prop='S'); m.set(20, 9, prop='j'); m.set(27, 9, prop='j')

# West wing: corridor, bridge and the Ossuary
room(8, 23, 12, 2)
m.rect(20, 23, 2, 2, ground='=', height=FLOOR)
room(3, 15, 12, 14)
for (x, y, w, h) in [(6, 18, 1, 3), (10, 18, 1, 3), (6, 23, 1, 3), (10, 23, 1, 3)]:
    m.rect(x, y, w, h, ground='S', height=FLOOR)       # burial niches
m.scatter(3, 15, 12, 14, ['x', 'x', 't', 'd'], 0.16, on='_')
m.set(4, 16, prop='W')                                   # west sluice wheel
m.set(13, 27, prop='t')
# Secret niche behind cracked masonry (south wall of the ossuary)
room(5, 30, 3, 3)
m.set(6, 29, ground='_')

# North-west: the Choir Archive (flooded)
room(8, 12, 2, 3)
room(4, 3, 11, 9)
m.ellipse(9, 8, 3.5, 2.2, ground='w', height=FLOOR)
for (x, y) in [(4, 3), (5, 3), (12, 3), (13, 3), (14, 3)]:
    m.set(x, y, prop='H')
m.set(4, 6, prop='H'); m.set(14, 7, prop='j'); m.set(6, 10, prop='d')

# East wing: corridor, bridge and Mercy's Laboratory
room(28, 23, 5, 2)
m.rect(26, 23, 2, 2, ground='=', height=FLOOR)
room(33, 15, 12, 14)
for (x, y) in [(35, 17), (36, 17), (40, 20), (41, 20), (35, 24), (36, 24)]:
    m.set(x, y, prop='=')
for (x, y) in [(38, 17), (34, 21), (42, 25)]:
    m.set(x, y, prop='u')
for x in range(37, 44):
    m.set(x, 27, prop='F')                               # cages along the south wall
m.set(33, 15, prop='H'); m.set(34, 15, prop='H'); m.set(44, 22, prop='H')
for (x, y) in [(39, 25), (37, 22), (43, 18)]:
    m.set(x, y, prop='%')
m.set(43, 16, prop='W')                                  # east sluice wheel

# North-east: the Collapsed Reliquary (bounty lair)
room(38, 12, 2, 3)
room(33, 3, 12, 9)
m.ellipse(39, 6, 3, 2, ground='w', height=FLOOR)
for (x, y) in [(34, 4), (43, 4), (34, 10), (43, 10)]:
    m.set(x, y, prop='!')
m.scatter(33, 3, 12, 9, ['x', 'd', 'R'], 0.1, on='_')
m.set(36, 7, prop='S')

m.clear_props(22, 12, 4, 1)
m.clear_props(22, 29, 4, 11)
m.spot('entry', 23, 37)
m.spot('stair_down', 23, 4)
m.spot('save', 21, 6)
m.spot('gate', 22, 12)
m.spot('wheel_w', 4, 16)
m.spot('wheel_e', 43, 16)
m.spot('secret', 6, 29)
m.spot('lair', 39, 7)
m.write('ch7_drowned_undercroft')
m.preview()

# =====================================================================
# Floor 2 — the Cistern of Bells, where the Drowned Choir still sings
# =====================================================================
m = MapCanvas(40, 36, ground='~', height=1, seed=7102)
m.border('S', height=3, thickness=1)
m.ragged_edge('w', 2, 'S', 3, var=1)
m.ragged_edge('e', 2, 'S', 3, var=1)

def walk(x, y, w, h, g='_', hh=2):
    m.rect(x, y, w, h, ground=g, height=hh)

# Landing (south) and the stair back up
walk(17, 30, 7, 6)
walk(19, 28, 3, 2)
# Long walkway north to the central platform
walk(19, 20, 3, 8)
walk(16, 14, 9, 6)                                      # central platform
m.set(17, 15, prop='$')
m.set(16, 14, prop='^'); m.set(24, 14, prop='^')
# West causeway to the Bellwright's Cache
walk(6, 16, 10, 2)
walk(3, 11, 7, 9)
m.set(4, 12, prop='a'); m.set(8, 12, prop='C'); m.set(3, 18, prop='O')
# A broken spur south-west, ending at a sunken bell
walk(8, 18, 2, 8)
walk(6, 26, 5, 3)
m.set(7, 29, prop='S')
# East causeway to the flooded vestry
walk(25, 16, 8, 2)
walk(31, 18, 2, 6)
walk(29, 24, 8, 5)
m.set(35, 25, prop='H'); m.set(30, 28, prop='k')
# Ramp up to the Choir Loft
walk(19, 10, 3, 4)
m.ramp(19, 12, 3, 'n', 2, 3, width=3, ground='_')
walk(11, 2, 18, 8, g='M', hh=3)
for (x, y) in [(12, 3), (27, 3), (12, 8), (27, 8)]:
    m.set(x, y, prop='|')
for (x, y) in [(15, 3), (24, 3)]:
    m.set(x, y, prop='q')
m.set(19, 3, prop='S'); m.set(21, 3, prop='S')
# The Apothecary Vault (east of the loft, behind a grate)
walk(29, 4, 1, 3, g='_', hh=3)
walk(30, 2, 7, 6, g='_', hh=3)
for (x, y) in [(31, 2), (32, 2), (35, 2), (36, 2)]:
    m.set(x, y, prop='H')
m.set(36, 6, prop='O')
# Sunken bells breaking the surface
for (x, y) in [(13, 24), (27, 12), (30, 31), (11, 8 + 5), (34, 13), (25, 22)]:
    if m.g[y][x] == '~':
        m.set(x, y, prop='S')

m.spot('entry', 20, 32)
m.spot('save', 17, 15)
m.spot('boss', 20, 5)
m.spot('vault', 33, 4)
m.spot('cache', 5, 14)
m.write('ch7_drowned_choir')
m.preview()
