"""Lanternfall, a year after the Sundering. Built from the Act I village layout:
the sea is gone (void), the isle is cracked by Gloam faults, and the Lantern on
the bluff is still burning. Writes c11_lf_ruins, c11_lf_home, c11_lf_lantern."""
import json, os
from ch11_kit import MapCanvas, interior

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'maps', 'layouts')
src = open(os.path.join(ROOT, 'lanternfall.js')).read()
base = json.loads(src[src.index('{'):src.rstrip().rindex('}') + 1])

HC = '0123456789abcdefghijklmnopqrstuvwxyz'
m = MapCanvas(base['w'], base['h'], ground=' ', height=0, seed=811)
for y in range(m.h):
    for x in range(m.w):
        g = base['ground'][y][x]
        m.g[y][x] = g
        m.hg[y][x] = HC.index(base['height'][y][x])
        m.p[y][x] = base['props'][y][x]
m.stairs = list(base['stairs'])

# The sea fell upward: water is gone, the beach crumbles into the void.
for y in range(m.h):
    for x in range(m.w):
        g = m.g[y][x]
        if g in '~w':
            m.set(x, y, ground=' ', height=0, prop=' ')
        elif g == 's':
            r = m.rng.random()
            if r < 0.18 or y > 30:
                m.set(x, y, ground=' ', height=0, prop=' ')
            elif r < 0.6:
                m.set(x, y, ground='a')
        elif g in '.,':
            r = m.rng.random()
            m.set(x, y, ground='q' if r < 0.45 else 'a' if r < 0.6 else g)
        if m.p[y][x] in 'TP' and m.rng.random() < 0.6:
            m.p[y][x] = 'D'
        if m.p[y][x] in 'fV':
            m.p[y][x] = ' '

# Gloam faults: two chasms crack the isle; survivors' planks bridge them.
def fault(points, width=2):
    for (a, b) in zip(points, points[1:]):
        m.line(a[0], a[1], b[0], b[1], width, ' ', 0, ' ')

fault([(0, 21), (8, 20), (13, 22), (17, 21)])
fault([(30, 24), (34, 23), (40, 24), (46, 22)])
fault([(36, 0), (38, 7), (37, 12)])
m.path([(14, 21), (14, 23)], width=2, ground='=', height=1)      # a plank over the west fault
m.rect(13, 20, 1, 4, ground='=', height=1)
m.rect(36, 12, 2, 1, ground='q', height=1)
# The village square cracks but holds.
for (x, y) in [(18, 22), (19, 22), (28, 21), (29, 21), (21, 19)]:
    m.set(x, y, ground='u', prop='%')
m.scatter(0, 0, 46, 36, ['%', 'd', 'x'], 0.03, on='aq')

# The docks now hang over nothing. The Halcyon moors at their end.
m.rect(22, 24, 3, 9, ground='=', height=1, prop=' ')
m.rect(17, 30, 12, 2, ground='=', height=1, prop=' ')
m.set(17, 31, prop='O'); m.set(28, 30, prop='C'); m.set(25, 25, prop='k')
for y in range(32, 36):
    m.set(23, y, ground='=', height=1)
    m.set(24, y, ground='=', height=1)

# Buildings: same houses, a year of ash on them. Only home will open.
m.buildings = []
m.building(14, 9, 4, 3, wall='wall_timber', roof='roof_blue', door={'dx': 2, 'to': 'c11_lf_home', 'tx': 4, 'ty': 7, 'dir': 'up'}, windows=[0, 3])
locked = 'The door is fused shut with Gloam-glass. Through the window: a chair, pushed back from a table, exactly as someone left it.'
m.building(21, 9, 5, 3, wall='wall_plaster', roof='roof_red', door={'dx': 3, 'locked': True, 'lockedText': locked}, windows=[1])
m.building(29, 11, 6, 4, wall='wall_stone', roof='roof_slate', h=3.0, door={'dx': 2, 'locked': True, 'lockedText': 'The Gull\'s Rest. The sign still swings. There is no wind.'}, windows=[0, 4, 5])
m.building(8, 13, 5, 3, wall='wall_ruin', roof='roof_thatch', windows=[0])
m.building(36, 18, 4, 3, wall='wall_ruin', roof='roof_thatch', windows=[3])
m.structures = []
m.structure('lantern', 8, 3, doorTo='c11_lf_lantern', tx=7, ty=11, dir='up',
            unlockFlag='c11_lf_light_open', lockedText='A wall of light fills the doorway, warm as a hand. It will not let you in. Not while the island is still remembering so loudly.')

# Points of memory
m.set(20, 13, prop=' ')
m.spot('well', 23, 15)
m.spot('well_stand', 23, 17)
m.spot('garden', 14, 12)
m.spot('nana_door', 24, 12)
m.spot('inn_door', 31, 15)
m.spot('tobias_shack', 37, 21)
m.spot('dock_root', 23, 24)
m.spot('dock_echo', 23, 27)
m.spot('square', 23, 16)
m.spot('lantern_door', 8, 5)
m.spot('home_door', 16, 12)
m.spot('save', 11, 6); m.set(11, 6, prop='$')
m.set(27, 17, prop=' ')                                        # the old Hearthstone is cold
m.spot('cold_stone', 27, 17); m.set(27, 17, prop='S')
for name, (x, y) in {
    'c_beach': (36, 22), 'c_hills': (34, 6), 'c_store': (10, 17), 'c_square': (27, 14),
    'c_dock': (18, 31), 'c_bluff': (13, 4),
}.items():
    m.spot(name, x, y)
m.spot('entry', 23, 33)
m.spot('arrival', 23, 30)
m.write('c11_lf_ruins')
m.preview()

# ------------------------------------------------------------------ home
h = interior(10, 9, wall='T', floor='=', seed=812)
h.set(1, 2, prop='E'); h.set(8, 2, prop='H'); h.set(7, 2, prop='H')
h.set(4, 4, prop='='); h.set(3, 4, prop='j'); h.set(5, 4, prop='j')
h.set(1, 6, prop='O'); h.set(8, 6, prop='u'); h.set(2, 2, prop='^')
h.set(6, 2, prop='d'); h.set(8, 5, prop='d'); h.set(2, 6, prop='x')
h.set(9, 3, ground=' '); h.set(9, 4, ground=' ')             # the east wall is gone
h.rect(4, 8, 2, 1, ground='x')
h.spot('entry', 4, 7); h.spot('table', 4, 4); h.spot('bed', 1, 2); h.spot('shelf', 7, 2)
h.spot('echo_ysolde', 6, 5); h.spot('echo_wren', 3, 5)
h.write('c11_lf_home')
h.preview()

# ------------------------------------------------------------------ the lamp room
t = interior(15, 13, wall='S', floor='_', seed=813)
t.rect(5, 2, 5, 3, ground='M', height=1)
t.stair(6, 5, 3, 1)
t.rect(6, 5, 3, 1, ground='M', height=0)
t.rect(7, 6, 1, 7, ground='x')
for y in (4, 7, 10):
    t.set(3, y, prop='|'); t.set(11, y, prop='|')
for (x, y) in [(1, 3), (13, 3), (2, 9), (12, 8), (1, 11), (13, 10)]:
    t.set(x, y, ground='u', prop='%')
t.set(2, 2, prop='q'); t.set(12, 2, prop='q')
t.set(12, 5, prop='H'); t.spot('log', 12, 6)
t.spot('lamp', 7, 2); t.spot('remnant', 7, 4); t.spot('entry', 7, 11); t.spot('wren', 7, 7)
t.spot('ilse', 6, 9); t.spot('bram', 8, 9); t.spot('sable', 5, 10); t.spot('pip', 9, 10); t.spot('corvin', 7, 10)
t.write('c11_lf_lantern')
t.preview()
