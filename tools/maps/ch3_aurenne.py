"""Aurenne, the City of Bells — Chapter 3 hub (map id 'aurenne').

Districts: Cathedral Square (raised, north) with the Cathedral of Dawn and the
Grand Lantern; the Bell Market (west); the Lantern Quarter (east, wealthy);
Low Town (south-east, sunken) with the almshouse and the Undercroft stair;
the South Gate bridge over the river Aure (entry at 20,38).
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(50, 48, ground=';', height=3, seed=303)

# ------------------------------------------------------------------ walls & river
m.rect(0, 0, 50, 2, ground='S', height=5)
m.rect(0, 0, 2, 40, ground='S', height=3)
m.rect(48, 0, 2, 40, ground='S', height=3)
m.rect(0, 40, 50, 3, ground='~', height=0)                 # the river Aure
m.rect(0, 43, 50, 5, ground='.', height=2)                 # south bank
m.rect(19, 43, 4, 5, ground=':', height=2)                 # pilgrim road out
m.rect(19, 39, 4, 4, ground='_', height=3)                 # the bridge
m.rect(2, 39, 46, 1, ground=';', height=3)                 # quay

# ------------------------------------------------------------------ Cathedral Square (h5)
m.rect(2, 2, 46, 12, ground='_', height=5)
m.rect(13, 8, 17, 3, ground='M', height=5)                 # marble apron
m.rect(20, 11, 3, 3, ground='M', height=5)
m.rect(2, 7, 8, 7, ground='d', height=5)                   # Dawnguard yard
m.rect(40, 2, 8, 9, ground=',', height=5)                  # Hierophant's garden
m.ramp(19, 16, 3, 'n', 3, 5, width=4, ground='M')          # the Great Stair
m.ramp(6, 16, 3, 'n', 3, 5, width=3, ground='_')           # market stair

# ------------------------------------------------------------------ avenue & market (h3)
m.rect(19, 17, 4, 22, ground='_', height=3)                # Pilgrim's Way
m.rect(4, 22, 13, 8, ground=';', height=3)
m.rect(3, 31, 5, 7, ground=':', height=3)                  # packed-dirt corner

# ------------------------------------------------------------------ Lantern Quarter (h4)
m.rect(24, 14, 24, 12, ground='M', height=4)
m.rect(32, 20, 7, 5, ground=',', height=4)                 # quarter garden

# ------------------------------------------------------------------ Low Town (h2)
m.rect(24, 26, 24, 13, ground='d', height=2)
m.ellipse(29, 36, 3.5, 1.6, ground='m', jitter=0.3)
m.ellipse(42, 37, 3, 1.3, ground='m', jitter=0.3)
m.path([(24, 33), (33, 33), (43, 33), (43, 30)], width=1, ground=':')
m.path([(37, 32), (37, 38)], width=1, ground=':')
m.ramp(30, 25, 3, 's', 4, 2, width=2, ground='_')          # stair down from the Lantern Quarter
# The old Undercroft stair, behind the almshouse
m.rect(45, 28, 3, 4, ground='_', height=0)
m.ramp(43, 29, 3, 'e', 2, 0, width=2, ground='_')

# ------------------------------------------------------------------ buildings
m.building(14, 2, 15, 6, wall='wall_marble', roof='roof_slate', h=5.5, roofH=3.4,
           door={'dx': 7, 'to': 'c3_cathedral', 'tx': 11, 'ty': 19, 'dir': 'up'}, windows=[2, 4, 10, 12])
m.building(2, 2, 7, 4, wall='wall_stone', roof='roof_red', h=3.5,
           door={'dx': 3, 'locked': True, 'lockedText': 'DAWNGUARD HALL. Squires report to the Quartermaster. Everyone else reports elsewhere.'}, windows=[1, 5])
m.building(2, 17, 7, 4, wall='wall_timber', roof='roof_red', h=3.2,
           door={'dx': 3, 'to': 'c3_inn', 'tx': 7, 'ty': 9, 'dir': 'up'}, windows=[1, 5])
m.building(11, 17, 6, 4, wall='wall_plaster', roof='roof_blue', h=3.0,
           door={'dx': 2, 'to': 'c3_shop', 'tx': 5, 'ty': 6, 'dir': 'up'}, windows=[0, 4])
m.building(2, 27, 4, 4, wall='wall_stone', roof='roof_slate', h=7.5, roofH=2.6,
           door={'dx': 2, 'to': 'c3_tolliver', 'tx': 4, 'ty': 7, 'dir': 'up'}, windows=[1])
m.building(10, 31, 7, 4, wall='wall_brick', roof='roof_red', h=3.4, windows=[2, 5])
m.building(25, 15, 7, 4, wall='wall_plaster', roof='roof_green', h=3.2,
           door={'dx': 3, 'locked': True, 'lockedText': 'THE CHOIR INFIRMARY. Visiting hours at dawn and dusk. Please do not bleed on the step.'}, windows=[1, 5])
m.building(34, 15, 5, 4, wall='wall_timber', roof='roof_slate', h=3.0,
           door={'dx': 2, 'locked': True, 'lockedText': 'A brass plate: MAGISTER IVO OSSENFELD, LANTERN THEORY. NO SOLICITORS. NO STUDENTS.'}, windows=[0, 4])
m.building(41, 15, 6, 4, wall='wall_plaster', roof='roof_blue', h=3.0,
           door={'dx': 2, 'to': 'c3_venn', 'tx': 5, 'ty': 6, 'dir': 'up'}, windows=[0, 4, 5])
m.building(25, 21, 5, 3, wall='wall_plaster', roof='roof_red', h=2.8,
           door={'dx': 2, 'locked': True, 'lockedText': 'Locked. Someone inside is practicing the harp, badly, with great determination.'}, windows=[0, 4])
m.building(41, 21, 6, 3, wall='wall_stone', roof='roof_green', h=2.8,
           door={'dx': 3, 'locked': True, 'lockedText': 'Locked. A note pinned to the door: GONE TO SALTGLASS. WATER THE FERNS, TERRENCE.'}, windows=[1, 4])
m.building(34, 28, 8, 4, wall='wall_stone', roof='roof_slate', h=3.4,
           door={'dx': 3, 'to': 'c3_almshouse', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[1, 6])
m.building(25, 28, 4, 3, wall='wall_wood', roof='roof_thatch', h=2.2,
           door={'dx': 1, 'locked': True, 'lockedText': 'A board nailed across the door: GUTTER COURT. KEEP OWT. THIS MEENS YOU.'}, windows=[3])
m.building(25, 34, 4, 3, wall='wall_wood', roof='roof_thatch', h=2.2,
           door={'dx': 2, 'locked': True, 'lockedText': 'Locked. From inside, someone snores like a sawmill.'})
m.building(31, 35, 4, 3, wall='wall_timber', roof='roof_thatch', h=2.4,
           door={'dx': 1, 'locked': True, 'lockedText': 'Locked. The door has been mended so many times it is mostly mend.'}, windows=[3])

# ------------------------------------------------------------------ structures
m.structure('lantern', 35, 6)
m.structure('arch', 18, 44, w=6, tex='wall_stone')    # the South Gate barbican
for (x, y, c) in [(8, 23, '#c84a3a'), (12, 23, '#3a6ac8'), (15, 26, '#d8b040'), (9, 27, '#5a9a4a')]:
    m.structure('tent', x, y, color=c)

# ------------------------------------------------------------------ props: square
for (x, y) in [(11, 10), (31, 11)]:
    m.set(x, y, prop='Q')
for (x, y) in [(17, 12), (25, 12)]:
    m.set(x, y, prop='S')
for (x, y) in [(19, 8), (23, 8)]:
    m.set(x, y, prop='|')
for (x, y) in [(15, 8), (27, 8), (13, 8), (29, 8)]:
    m.set(x, y, prop='q')
for (x, y) in [(14, 12), (28, 12), (9, 3), (32, 3), (39, 12), (2, 13)]:
    m.set(x, y, prop='L')
for (x, y) in [(3, 9), (5, 9), (3, 11), (7, 11)]:
    m.set(x, y, prop='h')
m.rect(2, 7, 1, 1, prop='F')
for x in range(40, 48):
    m.set(x, 11, prop='F')
m.set(43, 11, prop=' ')
m.scatter(41, 2, 7, 8, ['K', 'K', 'B', 'f'], 0.35, on=',')
m.set(44, 5, prop='S')

# ------------------------------------------------------------------ props: market
m.set(5, 24, prop='W')
m.set(13, 27, prop='$')
for (x, y, p) in [(7, 23, '='), (11, 23, '='), (14, 26, '='), (10, 27, '='), (7, 24, 'k'), (13, 24, 'k'),
                  (16, 27, 'O'), (8, 28, 'k'), (16, 22, 'C'), (2, 22, 'O'), (3, 22, 'O'),
                  (9, 34, 'C'), (9, 33, 'C'), (8, 34, 'O'), (17, 34, 'O'), (17, 33, 'k')]:
    m.set(x, y, prop=p)
for (x, y) in [(10, 21), (17, 21), (2, 25), (17, 29), (7, 30), (18, 37), (7, 37), (23, 21), (23, 27), (23, 33), (18, 17)]:
    m.set(x, y, prop='L')
m.set(9, 20, prop='s')
m.set(17, 20, prop='s')
m.scatter(3, 31, 5, 7, ['o', 'g'], 0.15, on=':')
for (x, y) in [(3, 36), (6, 33)]:
    m.set(x, y, prop='K')

# ------------------------------------------------------------------ props: Lantern Quarter
m.set(35, 22, prop='S')
m.scatter(32, 20, 7, 5, ['K', 'B', 'f', 'f'], 0.3, on=',')
m.set(35, 21, prop=' '); m.set(35, 23, prop=' ')
for (x, y) in [(24, 19), (33, 19), (40, 19), (47, 19), (31, 24), (39, 24)]:
    m.set(x, y, prop='L')
m.set(26, 19, prop='B'); m.set(39, 15, prop='K'); m.set(46, 24, prop='K'); m.set(24, 24, prop='K')
m.set(39, 19, prop='s')

# ------------------------------------------------------------------ props: Low Town
for (x, y, p) in [(29, 28, 'O'), (29, 29, 'C'), (24, 31, 'k'), (33, 29, 'O'), (42, 28, 'k'),
                  (42, 34, '$'), (45, 35, 'O'), (46, 35, 'C'), (36, 37, 'k'), (25, 38, 'O'),
                  (45, 28, '^'), (45, 31, '^'), (39, 35, 'O')]:
    m.set(x, y, prop=p)
for x in range(38, 43):
    m.set(x, 36, prop='F')
m.set(33, 32, prop='s')
m.scatter(24, 26, 24, 13, ['o', 'd', 'g'], 0.06, on='dm')
for (x, y) in [(24, 27), (40, 33), (47, 38)]:
    m.set(x, y, prop='L')

# ------------------------------------------------------------------ quay, bridge, south bank
for x in (4, 10, 16, 27, 33, 39, 45):
    m.set(x, 39, prop='L')
m.scatter(0, 44, 50, 4, ['T', 'T', 'b', 'B', 'f', 'g'], 0.28, on='.')
m.clear_props(17, 43, 8, 5)
m.scatter(0, 43, 50, 1, ['n', 'g'], 0.4, on='.')

# ------------------------------------------------------------------ spots
for name, x, y in [('entry', 20, 38), ('gate', 20, 41), ('market', 10, 25), ('climb', 9, 35),
                   ('inn_door', 5, 21), ('shop_door', 13, 21), ('tower_door', 4, 31),
                   ('cathedral_door', 21, 8), ('lantern', 35, 8), ('venn_door', 43, 19),
                   ('alms_door', 37, 32), ('uc_stair', 46, 29), ('square', 21, 12), ('lowtown', 33, 33)]:
    m.spot(name, x, y)

m.write('aurenne')
m.preview()
