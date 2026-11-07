"""Chapter 12 — epilogue stages under the new dawn.

c12_epi_square : Aurenne, two summers after — rebuilding, the new Kindling, Bram's yard, Pip's green.
c12_epi_ward   : the Ember Hospital (Ilse; Sable measured against the doorframe).
c12_epi_shore  : Lanternfall, rebuilt — the last goodbye at the dock.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior


def square():
    m = MapCanvas(36, 28, ground=';', height=1, seed=1211)
    m.rect(0, 0, 36, 4, ground=',', height=2)
    m.ellipse(18, 13, 9, 6, ground='M', height=1)
    m.rect(2, 13, 10, 12, ground='.', height=1)          # the green
    m.rect(26, 14, 8, 10, ground='d', height=1)          # Bram's yard
    m.structure('lantern', 18, 6)
    # Rebuilt houses (north) and half-built ones (ruin walls, no roofs)
    m.building(2, 3, 5, 4, wall='wall_timber', roof='roof_thatch', windows=[1, 3])
    m.building(8, 3, 5, 4, wall='wall_plaster', roof='roof_red', windows=[2])
    m.building(24, 3, 5, 4, wall='wall_plaster', roof='roof_blue', windows=[1, 3])
    m.building(30, 3, 5, 4, wall='wall_timber', roof='roof_green', windows=[2])
    for (x, y, w, h) in [(2, 9, 4, 1), (2, 9, 1, 3), (30, 9, 4, 1), (33, 9, 1, 3)]:
        m.rect(x, y, w, h, ground='R', height=1)
    # Fences round the yard, scaffolds, stacks of new timber
    for x in range(26, 34):
        m.set(x, 13, prop='F')
    for y in range(14, 24):
        m.set(34, y, prop='F')
    for (x, y, p) in [(4, 10, 'C'), (31, 10, 'C'), (32, 11, 'k'), (3, 11, 'O'), (14, 9, 'h'), (22, 9, 'C'),
                      (13, 20, 'd'), (24, 21, 'd'), (27, 15, 'a'), (33, 15, 'O'), (33, 22, 'k'),
                      (12, 7, 'L'), (24, 7, 'L'), (11, 18, 'L'), (25, 18, 'L')]:
        m.set(x, y, prop=p)
    m.scatter(2, 13, 10, 12, ['K', 'T', 'f', 'f', 'b'], 0.12, on='.')
    m.scatter(0, 0, 36, 3, ['T', 'K', 'b'], 0.35, on=',')
    m.scatter(12, 8, 12, 12, ['f'], 0.05, on='M')
    m.clear_props(16, 7, 5, 10)
    m.clear_props(4, 16, 6, 6)
    m.clear_props(27, 16, 6, 6)
    m.spot('lantern_front', 18, 9)
    m.spot('green', 6, 19)
    m.spot('yard', 29, 18)
    m.write('c12_epi_square')
    m.preview()


def ward():
    m = interior(16, 11, wall='P', floor='=', seed=1212)
    for x in (2, 5, 8):
        m.set(x, 2, prop='E')
    m.set(1, 2, prop='H'); m.set(14, 2, prop='H'); m.set(13, 2, prop='H')
    m.set(11, 5, prop='='); m.set(10, 5, prop='j'); m.set(12, 5, prop='j')
    m.set(14, 6, prop='u'); m.set(1, 7, prop='O'); m.set(1, 8, prop='C')
    m.set(4, 2, prop='^'); m.set(10, 2, prop='^'); m.set(7, 6, prop='f'); m.set(14, 8, prop='f')
    m.rect(6, 10, 3, 1, ground='x')
    m.spot('ilse', 11, 4)
    m.spot('doorframe', 12, 2)
    m.spot('nurse1', 3, 4)
    m.spot('nurse2', 6, 4)
    m.spot('entry', 7, 9)
    m.write('c12_epi_ward')
    m.preview()


def shore():
    m = MapCanvas(40, 30, ground='~', height=0, seed=1213)
    m.ellipse(20, 13, 17, 10, ground='s', height=0, jitter=0.2)
    m.ellipse(20, 11, 15, 8, ground='.', height=1, jitter=0.15)
    m.ellipse(8, 4, 5, 3.5, ground=',', height=3)
    m.rect(3, 0, 11, 1, ground='#', height=5)
    m.ramp(15, 4, 3, 'w', 1, 3, width=2, ground=':')
    m.structure('lantern', 7, 3)
    # Halloway house and new neighbours
    m.building(17, 5, 4, 3, wall='wall_timber', roof='roof_blue', windows=[0, 3])
    m.building(23, 6, 5, 3, wall='wall_plaster', roof='roof_red', windows=[1])
    m.building(29, 8, 4, 3, wall='wall_wood', roof='roof_thatch', windows=[2])
    m.path([(19, 8), (19, 14), (20, 18)], width=2, ground=':', height=1)
    m.path([(16, 5), (19, 8)], width=1, ground=':', height=1)
    # Dock
    m.rect(19, 18, 3, 10, ground='=', height=1)
    m.rect(16, 25, 9, 2, ground='=', height=1)
    m.set(23, 27, ground='~', prop='V')
    # Props
    m.set(10, 3, prop='t')                                 # Ysolde's stone
    for (x, y, p) in [(16, 12, 'L'), (25, 12, 'L'), (22, 20, 'O'), (18, 22, 'C'), (17, 25, 'k'),
                      (27, 13, 'h'), (31, 13, 'C'), (8, 14, 'R'), (33, 16, 'R')]:
        m.set(x, y, prop=p)
    m.scatter(4, 3, 30, 14, ['f', 'g', 'g', 'b'], 0.07, on='.')
    m.scatter(4, 3, 30, 14, ['T'], 0.025, on='.')
    m.scatter(3, 1, 11, 7, ['P', 'b', 'f'], 0.1, on=',')
    m.scatter(2, 14, 36, 10, ['o', 'g'], 0.04, on='s')
    m.clear_props(18, 8, 4, 18)
    m.clear_props(9, 2, 7, 6)
    m.set(10, 3, prop='t')
    m.spot('dock_end', 20, 25)
    m.spot('stone', 10, 4)
    m.spot('house', 19, 9)
    m.write('c12_epi_shore')
    m.preview()


if __name__ == '__main__':
    which = sys.argv[1:] or ['square', 'ward', 'shore']
    for name in which:
        globals()[name]()
