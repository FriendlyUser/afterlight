"""Chapter 11 side-quest maps: the six Character Rites and the Orrery.
Writes c11_reef, c11_infirmary, c11_vigil, c11_scrapfall, c11_stormwall,
c11_rift and c11_orrery."""
from ch11_kit import MapCanvas, sky, island, bridge, mooring, interior

# ================================================================== Wren — the Drowned Reef
m = sky(36, 38, seed=901)
island(m, 18, 31, 7, 3.4, 's', 1)
island(m, 9, 22, 6, 4, 's', 1)
island(m, 26, 21, 6, 4.2, 'c', 1)
island(m, 18, 9, 11, 5.5, 's', 2)
bridge(m, [(14, 29), (11, 25)], 1)
bridge(m, [(22, 29), (25, 25)], 1)
bridge(m, [(12, 18), (15, 14)], 2)
bridge(m, [(24, 17), (21, 14)], 2)
for (cx, cy, rx, ry) in [(8, 23, 2, 1.2), (27, 22, 2.4, 1.3), (14, 9, 2.5, 1.2)]:
    m.ellipse(cx, cy, rx, ry, ground='w')                     # pools the sea forgot
m.scatter(0, 0, 36, 38, ['*', 'R', 'o', 'x', 'A', '%'], 0.09, on='sc')
for (x, y) in [(6, 20), (29, 19), (24, 9), (11, 11)]:
    m.set(x, y, prop='V')                                     # wrecks of every age
m.clear_props(13, 4, 11, 8)
m.set(15, 6, prop='V'); m.spot('edrin_boat', 15, 7)            # the Gull's Return
m.set(21, 6, prop='V'); m.spot('ysolde_skiff', 21, 7)          # a Keeper's skiff
m.spot('undertow', 18, 5); m.spot('wren_stand', 18, 9)
m.clear_props(16, 27, 5, 5)
for name, (x, y) in {'c_west': (5, 23), 'c_east': (30, 21), 'c_north': (26, 10), 'c_pool': (10, 9)}.items():
    m.spot(name, x, y)
m.spot('star', 28, 24)
m.spot('save', 18, 13); m.set(18, 13, prop='$')
mooring(m, 17, 33, length=5, height=1)
m.write('c11_reef')
m.preview()

# ================================================================== Ilse — the Drowned Infirmary
h = interior(19, 14, wall='P', floor='+', seed=902)
for (cx, cy, rx, ry) in [(5, 9, 3, 1.5), (14, 7, 2.5, 1.2), (9, 12, 2, 1)]:
    h.ellipse(cx, cy, rx, ry, ground='p')
for x in (2, 5, 13, 16):
    h.set(x, 3, prop='E'); h.set(x, 6, prop='E')
h.set(8, 2, prop='H'); h.set(10, 2, prop='H'); h.set(1, 11, prop='u'); h.set(17, 11, prop='u')
h.set(9, 3, prop='S')                                         # Osk's lectern / the staff stand
for (x, y) in [(3, 2), (15, 2)]:
    h.set(x, y, prop='^')
h.set(17, 4, prop='k'); h.set(1, 5, prop='O'); h.set(12, 10, prop='x'); h.set(6, 12, prop='d')
h.rect(8, 13, 3, 1, ground='x')
h.spot('entry', 9, 12); h.spot('staff', 9, 4); h.spot('matron', 9, 6); h.spot('ledger', 8, 2)
h.spot('bed_a', 2, 4); h.spot('bed_b', 16, 7); h.spot('c_ward', 17, 9); h.spot('c_store', 1, 8)
h.write('c11_infirmary')
h.preview()

# ================================================================== Bram — the Vigil Hall
v = MapCanvas(26, 34, ground='#', height=8, seed=903)
v.rect(0, 30, 26, 4, ground=' ', height=0)
v.rect(6, 20, 14, 10, ground='*', height=1)                  # the snow approach
v.ramp(12, 19, 3, 'n', 1, 3, width=2, ground='_')
v.rect(4, 3, 18, 15, ground='_', height=3)                   # the hall floor
v.rect(4, 3, 18, 1, ground='S', height=3)
v.rect(11, 5, 4, 12, ground='X', height=3)                   # the vigil carpet
v.rect(10, 3, 6, 3, ground='M', height=4)                    # the cairn dais
v.stair(11, 6, 4, 1)
v.rect(11, 6, 4, 1, ground='M', height=3)
for y in (6, 9, 12, 15):
    v.set(6, y, prop='S'); v.set(19, y, prop='S')            # knights of the Dawnguard, in stone
for y in (5, 11):
    v.set(5, y, prop='^'); v.set(20, y, prop='^')
v.set(12, 3, prop='t'); v.spot('cairn', 12, 4); v.set(12, 3, prop='t')
v.spot('sword', 13, 4)
v.spot('vigil_stone', 13, 10)
v.scatter(6, 20, 14, 10, ['P', 'R', 'o'], 0.1, on='*')
v.clear_props(11, 20, 5, 10)
v.set(13, 9, prop=' ')
v.spot('bram_kneel', 13, 10); v.spot('corvin', 15, 12); v.spot('dread', 13, 7)
v.spot('save', 9, 22); v.set(9, 22, prop='$')
for name, (x, y) in {'c_hall_w': (5, 16), 'c_hall_e': (20, 16), 'c_snow': (18, 27)}.items():
    v.spot(name, x, y)
mooring(v, 12, 30, length=4, height=1)
v.write('c11_vigil')
v.preview()

# ================================================================== Pip — Scrapfall
s = sky(34, 34, seed=904)
island(s, 17, 27, 9, 4, 'a', 1)
island(s, 8, 16, 6, 5, 'a', 2)
island(s, 26, 16, 6, 5, '=', 2, jitter=0.4)
island(s, 17, 6, 9, 4, 'a', 3)
bridge(s, [(12, 24), (10, 20)], 2)
bridge(s, [(22, 24), (24, 20)], 2)
bridge(s, [(10, 12), (14, 9)], 3)
bridge(s, [(24, 12), (20, 9)], 3)
s.scatter(0, 0, 34, 34, ['C', 'O', 'd', 'd', 'k', 'V', 'q'], 0.16, on='a=')
s.clear_props(14, 24, 7, 6)
s.clear_props(13, 3, 9, 6)
for (x, y) in [(13, 4), (21, 4), (13, 7), (21, 7)]:
    s.set(x, y, prop='q')                                     # kites, tangled
s.set(17, 3, prop='C'); s.set(16, 3, prop='C'); s.set(18, 3, prop='C')
s.spot('tilly', 17, 5); s.spot('queen', 17, 7); s.spot('pip_stand', 17, 9)
s.spot('nest', 26, 15); s.set(26, 15, prop='x')
s.spot('save', 13, 26); s.set(13, 26, prop='$')
for name, (x, y) in {'c_west': (5, 15), 'c_east': (29, 17), 'c_dump': (21, 28), 'c_top': (24, 6)}.items():
    s.spot(name, x, y)
mooring(s, 16, 29, length=5, height=1)
s.write('c11_scrapfall')
s.preview()

# ================================================================== Corvin — the Stormwall wreck
k = sky(30, 28, seed=905)
k.ellipse(15, 13, 12, 4.6, ground='=', height=2)             # the Kingfisher's hull
k.rect(2, 10, 6, 7, ground='+', height=3)                    # her stern cabin roof
for y in range(k.h):
    for x in range(k.w):
        if 13 <= x <= 15:
            if k.g[y][x] != ' ' and (x + y) % 3 == 0:
                k.set(x, y, ground=' ', height=0)            # broken in two
k.rect(13, 12, 3, 2, ground='=', height=2)
k.building(3, 9, 4, 2, wall='wall_wood', roof='roof_blue', h=1.8, windows=[1])
for (x, y) in [(9, 11), (20, 11)]:
    k.set(x, y, prop='|')
for (x, y, p) in [(10, 15, 'O'), (18, 10, 'C'), (22, 15, 'O'), (24, 12, 'd'), (8, 16, 'k'), (17, 16, 'd')]:
    k.set(x, y, prop=p)
k.spot('hal_cabin', 5, 12); k.spot('log', 4, 14); k.spot('gun', 25, 13)
k.spot('ghost', 21, 13); k.spot('corvin_stand', 18, 13)
k.rect(14, 18, 2, 10, ground='=', height=2)
k.spot('entry', 14, 22)
k.spot('gangplank', 14, 27)
k.set(13, 26, prop='L'); k.set(16, 26, prop='L')
k.write('c11_stormwall')
k.preview()

# ================================================================== Sable — the Gloam Rift
r = MapCanvas(30, 34, ground='U', height=4, seed=906)
r.rect(0, 30, 30, 4, ground=' ', height=0)
from ch11_kit import cave, carve
cave(r, 1, 1, 28, 29, wall='U', floor='u', fill=0.44, steps=4)
carve(r, [(14, 30), (14, 25), (8, 20), (9, 13), (15, 9), (21, 13), (22, 20), (15, 23)], width=3, ground='u')
carve(r, [(15, 9), (15, 4)], width=3, ground='u')
r.rect(10, 2, 10, 5, ground='M', height=4)                   # Lysa's memory: a bedroom floor
r.rect(10, 2, 10, 1, ground='K', height=4)
r.set(11, 3, prop='E'); r.set(18, 3, prop='H'); r.set(14, 3, prop='='); r.set(13, 3, prop='j')
r.set(10, 5, prop='f'); r.set(19, 5, prop='f')
r.scatter(0, 0, 30, 30, ['%', 'Z', 'G', 'x'], 0.07, on='u')
r.clear_props(12, 22, 5, 9)
r.clear_props(11, 3, 9, 4)
r.set(11, 3, prop='E'); r.set(18, 3, prop='H'); r.set(14, 3, prop='=')
r.spot('lysa', 15, 4); r.spot('sable_stand', 15, 6); r.spot('unremembered', 15, 9)
r.spot('save', 12, 24); r.set(12, 24, prop='$')
for (x, y) in [(8, 13), (21, 14), (8, 20), (22, 20)]:
    r.spot(f'echo_{x}_{y}', x, y)
for name, (x, y) in {'c_west': (6, 17), 'c_east': (24, 17), 'c_deep': (19, 10)}.items():
    r.spot(name, x, y)
r.rect(0, 30, 30, 4, ground=' ', height=0, prop=' ')
r.rect(13, 28, 3, 2, ground='u', height=4, prop=' ')
r.spot('entry', 14, 28)
r.set(13, 29, prop=' '); r.set(15, 29, prop=' ')
r.write('c11_rift')
r.preview()

# ================================================================== the Orrery (Starseer)
o = sky(26, 26, seed=907)
island(o, 13, 13, 11, 9, 'o', 1, jitter=0.15)
o.rect(4, 3, 18, 13, ground='M', height=2)                   # the observatory floor
o.rect(4, 3, 18, 2, ground='K', height=2)
o.ramp(12, 16, 2, 'n', 1, 2, width=3, ground=';')
o.ellipse(13, 8, 4, 2.6, ground='X', height=3)               # the telescope dais
o.stair(12, 11, 3, 1)
o.set(13, 7, prop='S')                                       # the great glass
o.set(11, 7, prop='|'); o.set(15, 7, prop='|')
for x in (5, 6, 7, 18, 19, 20):
    o.set(x, 5, prop='H')
o.set(6, 10, prop='='); o.set(7, 10, prop='j'); o.set(19, 10, prop='='); o.set(18, 10, prop='j')
o.set(5, 13, prop='E'); o.set(20, 13, prop='u'); o.set(5, 8, prop='^'); o.set(20, 8, prop='^')
o.scatter(0, 15, 26, 11, ['R', 'o', 'f', 'b'], 0.1, on='o')
o.spot('ottoline', 13, 10); o.spot('chart', 6, 10); o.spot('desk', 19, 10); o.spot('telescope', 13, 8)
o.spot('star_stand', 13, 12)
o.spot('save', 9, 14); o.set(9, 14, prop='$')
mooring(o, 12, 21, length=5, height=1)
o.write('c11_orrery')
o.preview()
