"""Evernoon — Aurenne as Cassian remembers it: the summer festival, forty years
ago, at the hour before everything went wrong. Frozen. Perfect. (Ch10)"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 46, 44
m = MapCanvas(W, H, ground=',', height=1, seed=1212)

# --- the edge of the memory: beyond the last street, nothing but white
m.rect(0, 0, W, H, ground=' ', height=0)
m.ellipse(23, 22, 22, 21, ground=',', height=1, jitter=0.12)
m.rect(19, 38, 8, 6, ground='M', height=1)                 # Noon Gate approach

# --- streets
m.rect(13, 17, 20, 13, ground='M', height=1)                # festival square
m.path([(23, 42), (23, 29)], width=4, ground=';', height=1) # Gate Street
m.path([(13, 23), (3, 23)], width=3, ground=';', height=1)  # River Lane (west)
m.path([(32, 23), (42, 23)], width=3, ground=';', height=1) # Market Row (east)
m.path([(23, 17), (23, 9)], width=4, ground='M', height=1)  # Cathedral steps approach
m.path([(30, 17), (35, 11)], width=2, ground=';', height=1) # to the Keeper's house
m.path([(16, 17), (11, 10)], width=2, ground=';', height=1) # to the Lantern
# the river and its little bridge (west)
m.path([(7, 3), (7, 15), (8, 28), (6, 40)], width=2, ground='w', height=0)
m.rect(6, 22, 4, 3, ground='=', height=1)                    # the bridge
# Cathedral of Dawn (north centre), on a raised marble terrace
m.rect(16, 3, 15, 6, ground='M', height=2)
m.ramp(22, 10, 2, 'n', 1, 2, width=3, ground='M')
m.building(18, 2, 11, 4, wall='wall_marble', roof='roof_slate', h=4.2, windows=[1, 3, 5, 7, 9])
# the Grand Lantern (north-west)
m.structure('lantern', 10, 7)
# the Keeper's house — the Lornes' (north-east)
m.building(33, 7, 6, 4, wall='wall_plaster', roof='roof_blue', h=2.8,
           door={'dx': 2, 'to': 'c10_lorne_house', 'tx': 5, 'ty': 7, 'dir': 'up'}, windows=[0, 4, 5])
# festival houses
m.building(3, 27, 4, 3, wall='wall_timber', roof='roof_red', h=2.4, windows=[1, 2])
m.building(12, 32, 5, 3, wall='wall_plaster', roof='roof_red', h=2.5, windows=[0, 4])
m.building(29, 32, 5, 3, wall='wall_timber', roof='roof_green', h=2.5, windows=[1, 3])
m.building(37, 27, 5, 3, wall='wall_brick', roof='roof_red', h=2.4, windows=[0, 4])
m.building(36, 16, 5, 3, wall='wall_plaster', roof='roof_green', h=2.4, windows=[1, 3])
m.building(3, 14, 3, 3, wall='wall_timber', roof='roof_blue', h=2.2, windows=[1])
# the bandstand (raised boards) and the fountain
m.rect(26, 19, 5, 3, ground='=', height=2)
m.set(23, 23, prop='Q')
# stalls
for (x, y, c) in [(15, 19, '#e0a0a0'), (15, 26, '#a0c0e0'), (31, 26, '#f0d080'), (40, 21, '#c0e0a0'), (34, 24, '#e0b0e0')]:
    m.structure('tent', x, y, color=c)

# --- festival dressing: bunting, lamps, cherry trees, flowers
for x in range(14, 33, 3):
    m.set(x, 17, prop='q'); m.set(x, 29, prop='q')
for (x, y) in [(19, 30), (27, 30), (13, 22), (32, 22), (21, 12), (26, 12), (5, 25), (41, 25), (31, 13), (14, 13)]:
    m.set(x, y, prop='L')
m.scatter(0, 0, W, H, ['K', 'K', 'B', 'f', 'f', 'g'], 0.12, on=',')
m.scatter(13, 17, 20, 13, ['f'], 0.03, on='M')
for (x, y, p) in [(19, 20, 'O'), (20, 20, 'k'), (27, 25, 'C'), (17, 27, '='), (18, 27, 'j'), (29, 24, 'j'),
                  (35, 22, 'O'), (11, 24, 'S'), (36, 12, 'f'), (37, 12, 'f')]:
    m.set(x, y, prop=p)
m.clear_props(21, 36, 5, 8)
m.clear_props(22, 9, 3, 4)
m.clear_props(34, 11, 3, 2)
m.clear_props(21, 20, 5, 6)
m.set(23, 23, prop='Q')

m.spot('entry', 23, 41)
m.spot('fountain', 23, 23)
m.spot('lorne_door', 35, 11)
m.spot('cassian', 23, 19)
m.write('c10_evernoon')
m.preview()
