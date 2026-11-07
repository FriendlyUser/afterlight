"""Mirefen — the drowned stilt-village of Mother Osk, now a lake of rot afloat
in the dark. Boardwalks link the islands; the Lantern stands on the northmost."""
from ch11_kit import MapCanvas, island, mooring

m = MapCanvas(40, 46, ground='~', height=0, seed=411)
# Wild banks of mud and dead trees around the lake (too steep to climb)
m.ragged_edge('n', 2, 'm', 4, var=1)
m.ragged_edge('w', 3, 'm', 4, var=1)
m.ragged_edge('e', 3, 'm', 4, var=1)
m.scatter(0, 0, 40, 42, ['D', 'D', 'T', 'n'], 0.45, on='m')
m.rect(0, 42, 40, 4, ground=' ', height=0, prop=' ')

# --- islands
island(m, 20, 38, 8, 3.4, 'm', 1)                          # landing
island(m, 19, 26, 7, 4.2, 'm', 1)                          # stilt-village green
island(m, 7, 27, 4.5, 5, 'm', 1)                           # Osk's hut
island(m, 33, 27, 4.5, 5, 'm', 1)                          # the drowned infirmary
island(m, 20, 15, 7, 3.2, 'm', 1)                          # the rot garden
island(m, 20, 5, 10, 3.6, 'o', 1)                          # the sanctum (moss stone)
for (cx, cy, rx, ry) in [(16, 27, 2, 1.2), (8, 30, 1.5, 1), (34, 30, 1.6, 1), (23, 15, 2, 1)]:
    m.ellipse(cx, cy, rx, ry, ground='p', height=1)
m.rect(0, 41, 40, 1, ground=' ', height=0, prop=' ')

# --- boardwalks
for pts in [[(19, 35), (19, 30)], [(13, 26), (11, 26)], [(25, 26), (29, 26)],
            [(19, 22), (19, 18)], [(20, 12), (20, 8)], [(10, 32), (15, 36)]]:
    m.path(pts, width=2, ground='=', height=1)

# --- stilt houses
m.building(13, 21, 5, 2, wall='wall_wood', roof='roof_thatch', h=2.2, windows=[1, 3])
m.building(22, 21, 5, 2, wall='wall_wood', roof='roof_thatch', h=2.2, windows=[1, 3])
m.building(4, 23, 5, 3, wall='wall_wood', roof='roof_green', h=2.4, windows=[1])        # Osk's hut
m.building(31, 23, 6, 3, wall='wall_wood', roof='roof_green', h=2.6, windows=[0, 5],
           door={'dx': 3, 'to': 'c11_infirmary', 'tx': 9, 'ty': 12, 'dir': 'up',
                 'locked': True, 'unlockFlag': 'c11_ilse_rite_open',
                 'lockedText': 'A red cord is knotted across the door: the old Mirefen sign for "fever within". It is tied very tightly.'})
m.structure('lantern', 20, 3, lit=False)

# --- decoration
m.scatter(1, 2, 38, 40, ['n', 'G', 'm', 'D', 'n'], 0.12, on='m')
m.scatter(1, 2, 38, 40, ['n', 'G'], 0.2, on='p')
m.scatter(9, 1, 23, 8, ['%', 'G', 'D'], 0.08, on='o')
for pts in [(19, 30, 2, 6), (11, 25, 3, 2), (25, 25, 4, 2), (19, 17, 2, 5), (20, 8, 2, 4), (17, 6, 7, 3)]:
    m.clear_props(*pts)
m.clear_props(16, 3, 9, 6)

# --- puzzle: Osk's censer burns away the rot-blooms
m.spot('censer', 6, 29); m.set(6, 29, prop='u')
m.spot('rot_a', 18, 19)                                    # 2-wide on the north boardwalk
m.spot('rot_b', 19, 10)                                    # 2-wide on the sanctum boardwalk
for (x, y) in [(17, 19), (22, 19), (18, 10), (23, 10)]:
    m.set(x, y, prop='%') if m.g[y][x] != '~' else None

# --- story & secrets
m.spot('infirmary_door', 34, 26)
m.spot('hut_door', 6, 26)
m.spot('save', 16, 6); m.set(16, 6, prop='$')
m.spot('boss', 20, 6)
m.spot('boss_stand', 20, 7)
m.spot('well', 21, 28); m.set(21, 28, prop='W')
for name, (x, y) in {
    'c_landing': (25, 38), 'c_green': (14, 28), 'c_hut': (9, 24), 'c_infirm': (36, 29),
    'c_garden_w': (15, 15), 'c_garden_e': (25, 14), 'c_sanct': (27, 5), 'c_bank': (3, 35),
}.items():
    m.spot(name, x, y)
m.rect(2, 33, 4, 4, ground='m', height=1, prop=' ')               # a muddy bank reached by the west walk
m.rect(4, 31, 7, 3, ground='m', height=1, prop=' ')
m.spot('c_bank', 3, 35)
m.spot('star', 30, 31)
mooring(m, 19, 41, length=5, height=1)
m.spot('arrival', 20, 38)
m.write('c11_mirefen')
m.preview()
