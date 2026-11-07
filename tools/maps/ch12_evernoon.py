"""Chapter 12 — Evernoon, the final dungeon.

evernoon_gate  : the approach across the shard to the golden wall (entry map).
c12_streets    : Cassian's frozen festival afternoon (Aurenne, forty summers ago).
c12_memory     : the night after — the Gloam spilling into Aurenne; Lysa is lost.
c12_stair      : the Noon Stair up the Grand Lantern (Hearthstone + last camp).
c12_throne     : the Noon Throne under the broken sun.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas


def gate():
    m = MapCanvas(40, 44, ground=' ', height=0, seed=1201)
    # Landing island + the Halcyon's mooring planks (south edge).
    m.ellipse(20, 38, 10, 5, ground='a', height=1, jitter=0.3)
    m.ellipse(20, 37, 6, 3, ground='u', height=1, jitter=0.5)
    m.rect(19, 39, 3, 5, ground='=', height=1)
    # Causeway north through floating rubble.
    m.path([(20, 34), (20, 30), (17, 25), (17, 21), (20, 17), (20, 13)], width=4, ground='r', height=1)
    m.ellipse(18, 27, 3, 2, ground='u', height=1, jitter=0.6)
    m.ellipse(19, 19, 2.5, 2, ground='u', height=1, jitter=0.6)
    # West island (the toppled belfry) and its bridge.
    m.ellipse(7, 21, 6, 6, ground='a', height=2, jitter=0.25)
    m.ellipse(7, 21, 3.5, 3.5, ground='r', height=2, jitter=0.3)
    m.path([(11, 21), (16, 21)], width=2, ground='=', height=1)
    # East island (the pedlar's fire) and its bridge.
    m.ellipse(32, 27, 6, 5, ground='a', height=1, jitter=0.25)
    m.path([(22, 27), (27, 27)], width=2, ground='=', height=1)
    # Gate plaza, the golden wall and Evernoon glimpsed beyond it.
    m.rect(11, 8, 19, 6, ground='M', height=2)
    m.ellipse(20, 12, 9, 3, ground='M', height=2)
    m.rect(2, 0, 36, 6, ground='M', height=3)
    m.rect(3, 6, 34, 2, ground='K', height=3)
    m.rect(19, 6, 3, 2, ground='M', height=3)
    m.structure('arch', 18, 7, w=5, tex='wall_marble')
    # North-east islet, bridged from the plaza.
    m.ellipse(34, 12, 3.5, 2.5, ground='M', height=2, jitter=0.2)
    m.path([(29, 11), (31, 11)], width=1, ground='=', height=2)

    # Decor
    m.scatter(0, 14, 40, 30, ['%', 'D', 'd', 'x', '!', 'R', 'Z'], 0.07, on='au')
    m.scatter(0, 14, 40, 30, ['d', 'o'], 0.05, on='r')
    m.scatter(2, 0, 36, 6, ['K', 'K', 'f', 'L'], 0.12, on='M')
    for (x, y, p) in [(14, 10, 'S'), (26, 10, 'S'), (12, 12, 'L'), (28, 12, 'L'), (16, 8, 'q'), (24, 8, 'q'),
                      (12, 9, '|'), (28, 9, '|'), (15, 13, '!'), (25, 13, '!')]:
        m.set(x, y, prop=p)
    # West island ruins
    for (x, y, p) in [(5, 18, '!'), (9, 18, '|'), (4, 21, '!'), (10, 24, 'R'), (6, 25, 'x'), (8, 20, 'S')]:
        m.set(x, y, prop=p)
    # East island camp
    for (x, y, p) in [(33, 27, '@'), (30, 24, 'C'), (31, 24, 'O'), (35, 25, 'k'), (36, 28, 'R')]:
        m.set(x, y, prop=p)
    m.structure('tent', 34, 24, color='#7a5a8a')
    # Dock crates
    for (x, y, p) in [(18, 41, 'O'), (22, 41, 'C'), (22, 42, 'k')]:
        m.set(x, y, ground='=', height=1, prop=p)
    m.set(24, 37, prop='$')
    m.clear_props(17, 36, 7, 8)
    m.set(24, 37, prop='$')
    m.clear_props(18, 13, 5, 22)
    m.clear_props(18, 6, 5, 4)
    m.clear_props(18, 0, 5, 6)
    for (x, y) in [(4, 23), (35, 12), (36, 29), (12, 37), (29, 29), (20, 9)]:
        m.spot(f'c{x}_{y}', x, y)

    m.spot('entry', 20, 40)
    m.spot('seal', 20, 8)
    m.spot('mott', 32, 26)
    m.spot('belfry_ghost', 7, 22)
    m.write('evernoon_gate')
    m.preview()


def streets():
    m = MapCanvas(52, 46, ground=';', height=1, seed=1202)
    m.border('K', height=1)
    m.rect(0, 45, 52, 1, ground=';', height=1)
    # Cathedral terrace (raised; reachable only by the grand steps).
    m.rect(17, 1, 19, 8, ground='M', height=3)
    m.ramp(24, 9, 3, 'n', 1, 3, width=5, ground='M')
    m.building(19, 1, 15, 5, wall='wall_marble', roof='roof_blue', h=4.6,
               door={'dx': 7, 'to': 'c12_memory', 'tx': 22, 'ty': 45, 'dir': 'up', 'locked': True,
                     'unlockFlag': 'c12_procession_moved',
                     'lockedText': 'The cathedral doors will not open while the procession stands in the way.'},
               windows=[2, 5, 9, 12])
    # Flanks of the steps
    m.building(17, 9, 7, 3, wall='wall_plaster', roof='roof_red', windows=[1, 4])
    m.building(29, 9, 7, 3, wall='wall_plaster', roof='roof_red', windows=[2, 5])
    # Bell-tower square (north-west)
    m.rect(2, 2, 13, 9, ground='M', height=1)
    m.structure('lantern', 8, 4, lit=False)
    m.building(12, 2, 4, 3, wall='wall_stone', roof='roof_slate', windows=[1])
    # Dawnguard post (north-east)
    m.rect(38, 2, 12, 9, ground='_', height=1)
    m.building(39, 2, 9, 4, wall='wall_stone', roof='roof_slate', h=3.0, windows=[1, 4, 7])
    for x in (38, 39, 40, 46, 47, 48):
        m.set(x, 9, prop='F')
    # West market buildings
    m.building(2, 13, 5, 4, wall='wall_plaster', roof='roof_red', windows=[1, 3])
    m.building(2, 20, 6, 4, wall='wall_timber', roof='roof_thatch', h=2.8, windows=[1, 4])
    m.building(2, 28, 5, 4, wall='wall_brick', roof='roof_green', windows=[2])
    m.building(17, 14, 5, 4, wall='wall_timber', roof='roof_red', windows=[1, 3])
    m.building(17, 22, 5, 5, wall='wall_plaster', roof='roof_blue', windows=[1, 3])
    # East gardens: grass, pond, hedges
    m.rect(31, 13, 19, 22, ground='.', height=1)
    m.ellipse(41, 20, 4.5, 2.6, ground='w', height=1)
    m.building(30, 14, 4, 3, wall='wall_plaster', roof='roof_blue', windows=[1])
    m.building(46, 14, 5, 4, wall='wall_plaster', roof='roof_red', windows=[1, 3])
    m.building(46, 25, 5, 4, wall='wall_timber', roof='roof_green', windows=[2])
    m.path([(29, 19), (40, 25), (46, 31)], width=2, ground=':', height=1)
    # South festival plaza
    m.rect(17, 35, 19, 10, ground='M', height=1)
    m.building(8, 37, 6, 4, wall='wall_plaster', roof='roof_red', windows=[1, 4])
    m.building(39, 37, 6, 4, wall='wall_plaster', roof='roof_blue', windows=[1, 4])

    # Festival tents (market + plaza)
    for (x, y, c) in [(9, 15, '#c84a4a'), (13, 15, '#4a7ac8'), (9, 21, '#d8b040'), (13, 21, '#5aa86a'),
                      (13, 27, '#a85ac8'), (20, 37, '#e07a4a'), (32, 37, '#4ab0c0'), (36, 41, '#e0c050')]:
        m.structure('tent', x, y, color=c)

    # Props: bunting, lamps, cherry trees, stalls
    for (x, y) in [(23, 13), (29, 13), (23, 20), (29, 20), (23, 27), (29, 27), (23, 33), (29, 33),
                   (18, 36), (34, 36), (18, 43), (34, 43), (4, 11), (12, 11)]:
        m.set(x, y, prop='L')
    for (x, y) in [(24, 16), (28, 16), (24, 24), (28, 24), (24, 30), (28, 30), (21, 35), (31, 35)]:
        m.set(x, y, prop='q')
    m.set(26, 40, prop='Q')
    m.scatter(31, 13, 19, 22, ['K', 'K', 'b', 'B', 'f', 'f'], 0.13, on='.')
    m.scatter(2, 13, 20, 22, ['O', 'C', 'k', 'f'], 0.04, on=';')
    m.scatter(17, 35, 19, 10, ['f'], 0.06, on='M')
    m.scatter(2, 2, 13, 9, ['K', 'f', 'b'], 0.08, on='M')
    for (x, y, p) in [(8, 17, '='), (12, 17, '='), (8, 23, '='), (12, 23, '='), (7, 25, 'j'), (5, 25, '='),
                      (4, 25, 'j'), (16, 30, 'H'), (17, 30, 'H'), (15, 30, '='), (19, 41, '='), (23, 42, 'j'),
                      (40, 8, 'a'), (44, 8, 'C'), (48, 7, 'O'), (35, 31, 'j'), (37, 31, 'j')]:
        m.set(x, y, prop=p)
    # Sundials (market, gardens, bell tower)
    m.set(11, 30, prop='|')
    m.set(44, 29, prop='|')
    m.set(8, 8, prop='|')
    # Hearthstone
    m.set(31, 42, prop='$')
    # Keep avenue + exits clear
    m.clear_props(24, 9, 5, 37)
    m.clear_props(22, 43, 9, 3)
    for (x, y) in [(23, 13), (29, 13), (23, 20), (29, 20), (23, 27), (29, 27), (23, 33), (29, 33)]:
        m.set(x, y, prop='L')
    m.set(26, 40, prop='Q')

    for (x, y) in [(26, 36), (20, 38), (18, 41), (22, 41), (23, 41), (29, 39), (31, 36), (16, 33), (28, 42),
                   (13, 16), (9, 16), (5, 26), (3, 26), (44, 7), (41, 7), (10, 5), (4, 7), (38, 29), (35, 23),
                   (34, 40), (40, 32), (42, 32), (24, 10), (25, 10), (26, 10), (27, 10), (28, 10),
                   (22, 12), (21, 12), (30, 13), (31, 12), (32, 12), (21, 7),
                   (49, 8), (3, 10), (48, 33), (2, 44), (49, 44)]:
        m.spot(f'n{x}_{y}', x, y)
    m.spot('entry', 26, 43)
    m.spot('cathedral_door', 26, 6)
    m.spot('procession', 26, 10)
    m.spot('sundial_market', 11, 31)
    m.spot('sundial_garden', 44, 30)
    m.spot('sundial_bell', 8, 9)
    m.write('c12_streets')
    m.preview()


def memory():
    m = MapCanvas(44, 48, ground=';', height=1, seed=1203)
    m.border('S', height=1)
    m.rect(0, 47, 44, 1, ground=';', height=1)
    # The Grand Lantern and its plaza
    m.rect(8, 2, 28, 15, ground='_', height=1)
    m.ellipse(22, 10, 4.5, 2.8, ground='u', height=1, jitter=0.4)
    m.structure('lantern', 22, 3, doorTo='c12_stair', tx=18, ty=41, dir='up', unlockFlag='c12_mem_done',
                lockedText='The Lantern door is cold and shut. The memory is not finished with you.')
    # Main road
    m.rect(19, 17, 7, 30, ground=';', height=1)
    # City blocks (dark houses)
    for (x, y, w, d, wall, roof) in [
        (2, 2, 5, 4, 'wall_stone', 'roof_slate'), (37, 2, 5, 4, 'wall_stone', 'roof_slate'),
        (13, 18, 5, 4, 'wall_plaster', 'roof_red'), (27, 18, 5, 4, 'wall_plaster', 'roof_blue'),
        (13, 38, 5, 4, 'wall_timber', 'roof_thatch'), (27, 38, 5, 4, 'wall_brick', 'roof_red'),
        (2, 40, 6, 4, 'wall_stone', 'roof_slate'), (36, 40, 6, 4, 'wall_stone', 'roof_slate'),
        (13, 27, 5, 3, 'wall_stone', 'roof_slate'), (27, 30, 5, 3, 'wall_timber', 'roof_green')]:
        m.building(x, y, w, d, wall=wall, roof=roof, windows=[1, w - 2])
    # West: the Lorne house courtyard
    m.rect(2, 23, 11, 14, ground='o', height=1)
    m.building(3, 23, 7, 4, wall='wall_stone', roof='roof_blue', h=3.0, windows=[1, 3, 5])
    m.rect(2, 22, 11, 1, ground='S', height=1)
    m.rect(12, 23, 1, 5, ground='S', height=1)
    m.rect(12, 31, 1, 6, ground='S', height=1)
    # East: the old wall, where the purple lights came through
    m.rect(32, 17, 10, 20, ground='r', height=1)
    m.ellipse(37, 24, 4, 5, ground='u', height=1, jitter=0.5)
    m.rect(41, 17, 1, 20, ground='R', height=1)
    for y in (19, 22, 28, 31):
        m.set(41, y, ground='U', height=1)
    # The Gloam spill: violet walls swallowing side streets
    for (x, y, w, h) in [(8, 17, 4, 2), (33, 37, 3, 2), (2, 37, 4, 2), (6, 44, 3, 3)]:
        m.rect(x, y, w, h, ground='U', height=1)
    m.ellipse(10, 44, 3, 1.5, ground='u', height=1, jitter=0.5)
    m.ellipse(34, 44, 3, 1.5, ground='u', height=1, jitter=0.5)

    # Props
    for (x, y) in [(18, 20), (26, 20), (18, 30), (26, 30), (18, 40), (26, 40), (12, 8), (32, 8), (12, 14), (32, 14)]:
        m.set(x, y, prop='L')
    m.scatter(0, 0, 44, 48, ['%', 'd', 'x'], 0.08, on='u')
    m.scatter(32, 17, 9, 20, ['%', '!', 'd', 'R'], 0.1, on='r')
    m.scatter(2, 2, 40, 45, ['d', 'O', 'C'], 0.025, on=';')
    for (x, y, p) in [(5, 31, 'T'), (8, 30, '='), (7, 30, 'j'), (4, 34, 'f'), (6, 35, 'f'), (10, 34, 'b'), (3, 30, 'B'),
                      (16, 4, 'q'), (28, 4, 'q'), (17, 7, '|'), (27, 7, '|'), (17, 13, '|'), (27, 13, '|')]:
        m.set(x, y, prop=p)
    m.clear_props(19, 17, 7, 31)
    for (x, y) in [(18, 20), (26, 20), (18, 30), (26, 30), (18, 40), (26, 40)]:
        m.set(x, y, prop='L')
    m.clear_props(20, 8, 5, 6)

    for (x, y) in [(18, 19), (24, 7), (16, 24), (28, 35), (24, 26), (14, 16), (4, 35), (39, 34), (40, 18), (2, 46),
                   (6, 33), (34, 30), (37, 24)]:
        m.spot(f'n{x}_{y}', x, y)
    m.spot('entry', 22, 45)
    m.spot('boy', 22, 37)
    m.spot('lysa', 22, 10)
    m.spot('journal', 8, 31)
    m.write('c12_memory')
    m.preview()


def stair():
    m = MapCanvas(36, 44, ground='K', height=1, seed=1204)
    # South hall (h1)
    m.rect(9, 33, 18, 11, ground='M', height=1)
    m.rect(16, 36, 4, 8, ground='x', height=1)
    # Middle level (h3): central corridor + two wings
    m.ramp(16, 34, 3, 'n', 1, 3, width=4, ground='M')
    m.rect(14, 19, 8, 13, ground='M', height=3)
    m.rect(2, 20, 11, 12, ground='M', height=3)
    m.rect(24, 20, 10, 12, ground='M', height=3)
    m.rect(12, 24, 3, 3, ground='M', height=3)
    m.rect(21, 24, 3, 3, ground='M', height=3)
    m.rect(16, 21, 4, 11, ground='x', height=3)
    # Upper landing (h5) via the bell-gated ramp
    m.ramp(16, 19, 3, 'n', 3, 5, width=4, ground='M')
    m.rect(5, 3, 26, 14, ground='M', height=5)
    m.rect(16, 1, 4, 3, ground='M', height=5)
    m.rect(16, 3, 4, 14, ground='x', height=5)
    for y in range(16, 20):
        m.set(15, y, ground='K', height=5)
        m.set(20, y, ground='K', height=5)

    # Props
    for (x, y) in [(10, 35), (25, 35), (10, 41), (25, 41)]:
        m.set(x, y, prop='|')
    for (x, y) in [(12, 34), (23, 34), (12, 42), (23, 42)]:
        m.set(x, y, prop='^')
    for x in range(4, 12, 2):           # Gallery of the Saved: rows of statues
        for y in (23, 26, 29):
            m.set(x, y, prop='S')
    for x in range(26, 33, 2):          # Hall of Letters: shelves and desks
        m.set(x, 21, prop='H')
    for (x, y) in [(26, 25), (28, 25), (30, 25), (26, 28), (28, 28), (30, 28)]:
        m.set(x, y, prop='=')
    for (x, y) in [(14, 20), (21, 20), (14, 30), (21, 30)]:
        m.set(x, y, prop='q')
    for (x, y) in [(7, 5), (28, 5), (7, 14), (28, 14), (11, 4), (24, 4)]:
        m.set(x, y, prop='|')
    m.set(3, 21, prop='|')   # west bell
    m.set(32, 21, prop='|')  # east bell
    m.set(13, 8, prop='$')
    m.set(22, 10, prop='@')
    for (x, y) in [(8, 9), (27, 9), (10, 12), (25, 12)]:
        m.set(x, y, prop='K')

    for (x, y) in [(10, 37), (25, 37), (3, 30), (32, 30), (6, 4), (29, 4), (20, 9), (24, 9), (20, 11), (23, 8), (25, 11), (22, 12)]:
        m.spot(f'n{x}_{y}', x, y)
    m.spot('entry', 18, 41)
    m.spot('fire', 22, 10)
    m.spot('bell_w', 3, 22)
    m.spot('bell_e', 32, 22)
    m.write('c12_stair')
    m.preview()


def throne():
    m = MapCanvas(30, 28, ground=' ', height=0, seed=1205)
    m.ellipse(15, 12, 12, 9, ground='M', height=2, jitter=0.1)
    m.ellipse(15, 12, 8, 6, ground='_', height=2)
    m.rect(14, 19, 3, 9, ground='M', height=2)
    m.rect(15, 4, 1, 17, ground='x', height=2)
    m.rect(12, 2, 7, 3, ground='M', height=3)
    m.set(15, 3, prop='S')
    for (x, y) in [(5, 8), (25, 8), (4, 13), (26, 13), (7, 18), (23, 18), (8, 5), (22, 5)]:
        m.set(x, y, prop='|')
    for (x, y, p) in [(12, 3, '*'), (18, 3, '*'), (13, 2, '%'), (17, 2, '%'), (11, 5, '*'), (19, 5, '*'), (10, 16, '!'), (21, 9, '!')]:
        m.set(x, y, prop=p)
    m.spot('entry', 15, 26)
    m.spot('cassian', 15, 6)
    m.spot('stand', 15, 14)
    m.write('c12_throne')
    m.preview()


if __name__ == '__main__':
    which = sys.argv[1:] or ['gate', 'streets', 'memory', 'stair', 'throne']
    for name in which:
        globals()[name]()
