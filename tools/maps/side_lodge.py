"""Side content — the Hunters' Lodge (Act I yard + hall), Brackenmoor, and the
ruined lodge on its shard after the Sundering, plus the Ashen Reach beyond it."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

PREVIEW = '--preview' in sys.argv


def done(m, mid):
    m.write(mid)
    if PREVIEW:
        m.preview()


# =====================================================================
# side_lodge — the Hunters' Lodge, a timber hall in a forest clearing
# =====================================================================
m = MapCanvas(36, 28, ground='.', height=1, seed=401)
m.ragged_edge('n', 4, ',', var=2)
m.ragged_edge('w', 3, ',', var=1)
m.ragged_edge('e', 3, ',', var=1)
m.scatter(0, 0, 36, 5, ['T', 'P', 'T'], 0.75, on=',')
m.scatter(0, 0, 4, 28, ['T', 'P'], 0.7, on=',')
m.scatter(32, 0, 4, 28, ['T', 'P'], 0.7, on=',')
m.rect(0, 26, 36, 2, ground=',')
m.scatter(0, 26, 36, 2, ['T', 'b', 'P'], 0.55, on=',')
# the lodge
m.building(11, 4, 12, 6, wall='wall_timber', roof='roof_green', h=3.2,
           door={'dx': 6, 'to': 'side_lodge_hall', 'tx': 8, 'ty': 10, 'dir': 'up'}, windows=[2, 9])
# roads: south to the world, east to the moor
m.path([(17, 27), (17, 11)], width=2, ground=':')
m.path([(18, 15), (26, 15), (35, 16)], width=2, ground=':')
m.rect(14, 10, 8, 2, ground=';')                         # stoop
# pond with a short dock
m.ellipse(27, 21, 5.2, 3.4, ground='w', height=0)
m.ellipse(27.5, 21.5, 4.2, 2.6, ground='~', height=0)
m.rect(21, 21, 3, 1, ground='=', height=1)
m.scatter(20, 17, 14, 9, ['n', 'n', 'f'], 0.25, on='.')
# camp west of the hall: fire, tents, a woodpile
m.set(8, 15, prop='@')
m.structure('tent', 5, 12, color='#7a6a4a')
m.structure('tent', 5, 18, color='#5a6a4a')
m.set(10, 13, prop='h'); m.set(7, 19, prop='C'); m.set(10, 17, prop='O')
# archery butts (hay) and Dagny's mark
m.set(5, 7, prop='h'); m.set(7, 7, prop='h'); m.set(9, 7, prop='h')
# trophy posts and lamps by the door
m.set(14, 10, prop='q'); m.set(21, 10, prop='q')
m.set(13, 12, prop='L'); m.set(22, 12, prop='L')
m.set(24, 12, prop='W')
m.set(15, 14, prop='s')
m.set(20, 13, prop='$')
m.set(24, 8, prop='O'); m.set(25, 8, prop='C'); m.set(24, 9, prop='k')
m.scatter(4, 5, 28, 20, ['f', 'g', 'o'], 0.06, on='.')
m.clear_props(16, 11, 3, 17)
m.clear_props(18, 14, 18, 3)
m.spot('entry_s', 17, 26)
m.spot('entry_e', 34, 16)
m.spot('door', 17, 10)
done(m, 'side_lodge')

# =====================================================================
# side_lodge_hall — inside the Lodge
# =====================================================================
m = interior(17, 12, wall='T', floor='=', seed=402)
# Rook's desk (center back) and the bounty board beside it
m.set(9, 3, prop='='); m.set(10, 3, prop='='); m.set(10, 2, prop='H')
m.set(12, 2, prop='H'); m.set(13, 2, prop='q'); m.set(11, 2, prop='q')
# Gus's counter (west)
m.set(2, 2, prop='H'); m.set(3, 2, prop='H'); m.set(1, 4, prop='O'); m.set(1, 5, prop='O')
m.set(2, 5, prop='='); m.set(3, 5, prop='='); m.set(4, 5, prop='=')
# hearth and bunks (east)
m.set(15, 2, prop='u'); m.set(14, 2, prop='^'); m.set(6, 2, prop='^')
m.set(15, 5, prop='E'); m.set(15, 7, prop='E')
# tables
m.set(11, 7, prop='='); m.set(10, 7, prop='j'); m.set(12, 7, prop='j')
m.set(5, 8, prop='='); m.set(4, 8, prop='j'); m.set(6, 8, prop='j')
m.set(1, 9, prop='C'); m.set(15, 9, prop='k')
m.rect(7, 11, 3, 1, ground='x')
m.spot('entry', 8, 10)
done(m, 'side_lodge_hall')

# =====================================================================
# side_moor — Brackenmoor: heath, a peat bog, a stream and an old quarry
# =====================================================================
W, H = 50, 36
m = MapCanvas(W, H, ground='.', height=1, seed=403)
m.ragged_edge('n', 3, '#', height=3, var=2)
m.ragged_edge('s', 2, ',', var=1)
m.ragged_edge('e', 2, '#', height=3, var=1)
m.scatter(0, H - 4, W, 4, ['T', 'P', 'b'], 0.6, on=',')
# heath textures
for (cx, cy, rx, ry, g) in [(14, 10, 7, 4, '"'), (30, 24, 8, 4, '"'), (24, 12, 5, 3, 'k'), (40, 28, 6, 3, 'k'),
                            (6, 8, 4, 3, '"'), (36, 20, 4, 3, '"'), (20, 30, 6, 2, 'k')]:
    m.ellipse(cx, cy, rx, ry, ground=g, jitter=0.5)
# the stream: north edge down to the bog
stream = [(31, 0), (30, 6), (27, 11), (27, 17), (22, 21), (16, 24), (12, 26)]
m.path(stream, width=3, ground='w', height=0)
m.path(stream, width=1, ground='~', height=0)
# bog (south-west)
m.ellipse(9, 28, 7.5, 4.5, ground='p', height=0, jitter=0.4)
m.ellipse(8, 28, 3.5, 2, ground='~', height=0)
m.scatter(1, 22, 17, 11, ['n', 'n', 'D'], 0.18, on='p.')
# old quarry (north-east), sunken one level, cliff rim
m.rect(36, 3, 12, 11, ground='#', height=3)
m.rect(37, 4, 10, 9, ground='_', height=0)
m.ramp(41, 13, 2, 's', 0, 1, width=2, ground=':')
m.rect(41, 13, 2, 2, ground=':')
m.scatter(37, 4, 10, 9, ['R', 'o', 'd'], 0.12, on='_')
# bramble thicket (north-centre) around Bristleback's wallow
m.ellipse(19, 6, 5, 2.6, ground='m', height=1)
for (x, y) in [(13, 4), (14, 7), (15, 9), (23, 4), (24, 7), (22, 9), (16, 3), (21, 3), (13, 6), (25, 5)]:
    m.set(x, y, prop='b')
# roads
m.path([(0, 16), (8, 16), (16, 15), (25, 14), (29, 14), (36, 16), (41, 15)], width=2, ground=':')
m.path([(16, 15), (18, 10)], width=2, ground=':')
m.path([(8, 16), (11, 21)], width=1, ground=':')
# bridges over the stream
m.rect(26, 13, 3, 2, ground='=', height=1)
m.rect(17, 21, 2, 3, ground='=', height=1)
m.path([(18, 23), (22, 28), (30, 30), (44, 30)], width=1, ground=':')
# hunters' hide, cairns, a gibbet of old snares
m.structure('tent', 33, 9, color='#6a5a3a')
m.set(34, 11, prop='@')
m.set(10, 12, prop='S'); m.set(45, 23, prop='S')
m.set(4, 20, prop='t'); m.set(45, 32, prop='$')
m.scatter(2, 3, 46, 30, ['B', 'B', 'R', 'f', 'g', 'o', 'b'], 0.07, on='.,k"')
m.clear_props(0, 15, 45, 3)
m.clear_props(17, 9, 3, 7)
m.spot('entry', 1, 16)
m.spot('bristleback', 19, 6)
m.spot('lanternjaw', 12, 24)
m.spot('gravelgut', 42, 7)
done(m, 'side_moor')

# =====================================================================
# side_ruin_lodge — the lodge after the Sundering, on a drifting shard
# =====================================================================
W, H = 36, 28
m = MapCanvas(W, H, ground=' ', height=0, seed=404)
m.ellipse(17, 13, 16, 12, ground='a', height=0, jitter=0.35)    # lower ledge
m.ellipse(17, 13, 14.5, 10.5, ground='q', height=2, jitter=0.3)
m.ellipse(16, 13, 9, 6, ground='a', height=2, jitter=0.5)
m.rect(16, 22, 3, 6, ground=':', height=2)                       # south landing
m.rect(30, 12, 6, 3, ground='=', height=2)                        # east plank bridge
# the lodge: half the hall fell into the dark
m.building(9, 3, 11, 5, wall='wall_ruin', roof='roof_slate', h=2.2, windows=[2])
m.rect(20, 3, 3, 5, ground='r', height=2)
for (x, y, p) in [(20, 4, 'd'), (21, 6, '!'), (22, 3, 'd'), (19, 8, 'x'), (8, 8, 'd'), (10, 9, 'R')]:
    m.set(x, y, prop=p)
# Rook's office under a tarp, the board, the fire
m.structure('tent', 12, 11, color='#8a7a5a')
m.set(13, 13, prop='='); m.set(14, 13, prop='=')
m.set(17, 10, prop='H')
m.set(17, 15, prop='@')
m.set(21, 12, prop='$')
m.set(22, 16, prop='O'); m.set(23, 16, prop='C'); m.set(10, 15, prop='k')
m.set(14, 9, prop='q')
m.scatter(2, 2, 32, 24, ['D', 'd', 'o', 'x', 'R'], 0.06, on='qa')
m.clear_props(16, 16, 3, 12)
m.clear_props(24, 12, 12, 3)
m.spot('entry_s', 17, 25)
m.spot('entry_e', 33, 13)
m.spot('hesper', 3, 13)
done(m, 'side_ruin_lodge')

# =====================================================================
# side_ashen_reach — the moor, broken into islands over the abyss
# =====================================================================
W, H = 52, 38
m = MapCanvas(W, H, ground=' ', height=0, seed=405)
isles = [  # cx, cy, rx, ry, height
    (8, 19, 7, 6, 2),      # A west (entry)
    (23, 8, 8, 5.5, 3),    # B north
    (22, 29, 7.5, 5, 2),   # C south
    (38, 19, 8.5, 7, 3),   # D east
    (46, 6, 4.5, 3.5, 4),  # E far north-east
]
for (cx, cy, rx, ry, h) in isles:
    m.ellipse(cx, cy, rx + 1, ry + 1, ground='a', height=h - 2, jitter=0.3)   # lower ledge
    m.ellipse(cx, cy, rx, ry, ground='a', height=h, jitter=0.3)
    m.ellipse(cx, cy, rx * 0.6, ry * 0.6, ground='q', height=h, jitter=0.6)
# bridges (planks / land ribs)
m.ramp(12, 14, 6, 'e', 2, 3, width=2, ground=':')                # A -> B
m.line(12, 13, 17, 10, width=2, ground=':', height=3)
m.ramp(14, 22, 5, 'e', 2, 2, width=2, ground='=')                # A -> C
m.line(14, 23, 17, 27, width=2, ground='=', height=2)
m.line(29, 10, 33, 15, width=2, ground='=', height=3)            # B -> D
m.ramp(28, 27, 6, 'e', 2, 3, width=2, ground=':')                # C -> D
m.line(33, 27, 35, 24, width=2, ground=':', height=3)
m.ramp(42, 12, 4, 'n', 3, 4, width=2, ground='=')                # D -> E
m.line(42, 9, 44, 8, width=2, ground='=', height=4)
m.rect(0, 18, 3, 3, ground=':', height=2)                        # west landing
m.rect(46, 18, 6, 3, ground=':', height=3)                       # east trail (to the Hollow)
# props
m.scatter(0, 0, W, H, ['D', 'D', 'R', '%', 'x', 'd', 'o'], 0.07, on='aq')
for (x, y) in [(20, 6), (26, 9), (36, 17), (40, 22), (20, 31), (24, 27)]:
    m.set(x, y, prop='%')
m.set(9, 16, prop='S')                                           # a lodge waymarker
m.set(36, 21, prop='$')
m.clear_props(0, 17, 12, 5)
m.clear_props(44, 17, 8, 5)
m.spot('entry_w', 1, 19)
m.spot('cinderwing', 23, 6)
m.spot('glasshide', 22, 30)
m.spot('gravemouth', 46, 5)
m.spot('trail', 50, 19)
done(m, 'side_ashen_reach')
