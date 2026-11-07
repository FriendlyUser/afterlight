"""Chapter 2 — Thistledown: the farming village, its interiors, and the east fields."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# ------------------------------------------------------------------ Thistledown (village)
m = MapCanvas(46, 34, ground='.', height=1, seed=61)
m.rect(0, 0, 46, 4, ground=',', height=3)
m.ragged_edge('n', 4, ',', 3, var=1)
m.rect(0, 0, 46, 1, ground='#', height=5)
m.ellipse(41, 5, 6, 4, ground='k', height=3, jitter=0.2)      # the Sage's hill
m.ramp(36, 11, 3, 'n', 1, 3, width=2, ground=':')            # path up the hill
m.rect(35, 8, 4, 1, ground=':', height=3)
m.rect(0, 30, 46, 4, ground=',', height=3)                    # southern hedgerows
# Road and green
m.path([(0, 18), (20, 18), (46, 18)], width=3, ground=':')
m.ellipse(23, 15, 7, 4.5, ground='.', jitter=0.1)             # village green
m.path([(15, 13), (15, 17)], width=1, ground=':')
m.path([(30, 13), (30, 17)], width=1, ground=':')
m.path([(36, 17), (36, 12)], width=2, ground=':')
m.path([(9, 13), (9, 17)], width=1, ground=':')
m.path([(38, 18), (38, 20)], width=1, ground=':')
# Fields south of the road
for (fx, fy, fw, fh) in [(4, 22, 12, 6), (19, 22, 11, 6), (33, 23, 9, 5)]:
    m.rect(fx, fy, fw, fh, ground='d')
    for r in range(fy, fy + fh, 2):
        m.rect(fx, r, fw, 1, ground='k')
    m.rect(fx - 1, fy - 1, fw + 2, 1, prop='F')
    m.set(fx + fw // 2, fy - 1, prop=' ')
m.scatter(4, 22, 38, 6, ['h', 'g'], 0.06, on='dk')

# Buildings
m.building(12, 8, 7, 5, wall='wall_timber', roof='roof_thatch', h=3.0, windows=[1, 5],
           door={'dx': 3, 'to': 'c2_td_inn', 'tx': 6, 'ty': 8, 'dir': 'up'})
m.building(27, 9, 6, 4, wall='wall_wood', roof='roof_red', windows=[0, 4],
           door={'dx': 3, 'to': 'c2_td_shop', 'tx': 4, 'ty': 5, 'dir': 'up'})
m.building(5, 9, 5, 4, wall='wall_plaster', roof='roof_thatch', windows=[0, 3],
           door={'dx': 4, 'locked': True, 'lockedText': 'Locked. A jar of honey sits on the step with a note: FOR THE SAGE. DON\'T YOU DARE.'})
m.building(20, 7, 5, 4, wall='wall_stone', roof='roof_slate', windows=[1, 3],
           door={'dx': 2, 'locked': True, 'lockedText': 'The Reeve\'s House. A sign: PETITIONS AFTER SUPPER. COMPLAINTS NEVER.'})
m.building(39, 2, 5, 4, wall='wall_plaster', roof='roof_green', windows=[0, 4],
           door={'dx': 2, 'to': 'c2_sage_house', 'tx': 4, 'ty': 7, 'dir': 'up'})
m.building(40, 20, 5, 3, wall='wall_wood', roof='roof_red', h=3.2, windows=[],
           door={'dx': 2, 'locked': True, 'lockedText': 'The barn. Something inside moos at you, judgmentally.'})
# The Sage's garden & beehives
m.scatter(36, 2, 10, 7, ['f', 'B', 'f'], 0.35, on='k')
for (x, y) in [(36, 5), (37, 5), (36, 3)]:
    m.set(x, y, prop='O')
m.set(41, 7, prop=' '); m.set(41, 6, prop=' ')
# The green
m.set(23, 15, prop='W')
m.set(26, 16, prop='$')
m.set(20, 17, prop='s')
for (x, y) in [(17, 14), (29, 14), (11, 17), (33, 17), (24, 20)]:
    m.set(x, y, prop='L')
for (x, y) in [(18, 12), (27, 13), (19, 16)]:
    m.set(x, y, prop='K')
m.scatter(0, 0, 46, 4, ['T', 'T', 'P', 'b'], 0.35, on=',')
m.scatter(0, 30, 46, 4, ['T', 'b', 'B', 'T'], 0.45, on=',')
m.scatter(0, 4, 46, 26, ['f', 'g', 'b', 'T'], 0.04, on='.')
m.set(2, 13, prop='h'); m.set(3, 13, prop='h'); m.set(31, 15, prop='C'); m.set(32, 15, prop='O')
m.clear_props(0, 16, 3, 5)
m.clear_props(43, 16, 3, 5)
m.spot('west', 1, 18)
m.spot('east', 44, 18)
m.write('thistledown')
m.preview()

# ------------------------------------------------------------------ The Sleepy Thistle (inn)
m = interior(13, 10, wall='T', floor='+', seed=62)
for x in range(2, 6):
    m.set(x, 3, prop='=')
m.set(1, 2, prop='O'); m.set(7, 2, prop='H'); m.set(10, 2, prop='E'); m.set(11, 2, prop='E')
m.set(4, 2, prop='^'); m.set(9, 2, prop='^')
for (x, y) in [(4, 6), (9, 6)]:
    m.set(x, y, prop='='); m.set(x - 1, y, prop='j'); m.set(x + 1, y, prop='j')
m.set(11, 7, prop='u'); m.set(1, 7, prop='h')
m.rect(6, 9, 1, 1, ground='x')
m.spot('entry', 6, 8)
m.write('c2_td_inn')

# ------------------------------------------------------------------ Thistledown Trading Post
m = interior(10, 7, wall='W', floor='=', seed=63)
m.set(1, 2, prop='H'); m.set(2, 2, prop='k'); m.set(7, 2, prop='H'); m.set(8, 2, prop='h')
m.set(3, 3, prop='='); m.set(4, 3, prop='='); m.set(5, 3, prop='=')
m.set(1, 5, prop='O'); m.set(8, 5, prop='C')
m.spot('entry', 4, 5)
m.write('c2_td_shop')

# ------------------------------------------------------------------ The Sage's cottage
m = interior(11, 9, wall='P', floor='+', seed=64)
m.set(1, 2, prop='H'); m.set(2, 2, prop='H'); m.set(3, 2, prop='H')
m.set(9, 2, prop='E'); m.set(6, 2, prop='u'); m.set(5, 2, prop='^'); m.set(8, 2, prop='^')
m.set(5, 5, prop='='); m.set(4, 5, prop='j'); m.set(6, 5, prop='j')
m.set(1, 6, prop='k'); m.set(9, 6, prop='B'); m.set(1, 4, prop='B')
m.spot('entry', 4, 7); m.spot('sage', 7, 3)
m.write('c2_sage_house')

# ------------------------------------------------------------------ The East Fields
m = MapCanvas(56, 32, ground='k', height=1, seed=65)
m.rect(0, 0, 56, 5, ground=',', height=4)
m.ragged_edge('n', 5, ',', 4, var=1)
m.rect(0, 0, 56, 1, ground='#', height=6)
m.rect(0, 28, 56, 4, ground=',', height=3)
# The quarry hill (north-east): a shelf at height 3 with the quarry mouth
m.rect(38, 0, 18, 9, ground=',', height=4)
m.rect(42, 1, 6, 6, ground='d', height=3)                      # the quarry mouth
m.ramp(44, 9, 3, 'n', 1, 3, width=2, ground=':')               # bandit track (watched)
m.rect(44, 6, 2, 1, ground=':', height=3)
m.ramp(52, 12, 4, 'n', 1, 3, width=2, ground=':')              # the Sage's herb path (behind the hedge)
m.rect(48, 6, 6, 3, ground=':', height=3)
m.rect(52, 8, 2, 1, ground=':', height=3)
for y in range(9, 13):
    m.set(51, y, ground='#', height=5); m.set(54, y, ground='#', height=5)
for y in range(7, 10):
    m.set(43, y, ground='#', height=5); m.set(46, y, ground='#', height=5)
# Road east to Aurenne
m.path([(0, 16), (20, 16), (40, 15), (56, 15)], width=3, ground=':')
m.path([(44, 14), (44, 12)], width=2, ground=':')
m.path([(52, 14), (52, 16)], width=2, ground=':')
# Farmstead and fields
m.building(4, 6, 6, 4, wall='wall_timber', roof='roof_thatch', windows=[0, 4],
           door={'dx': 3, 'locked': True, 'lockedText': 'The Pell farmhouse. Somebody has nailed a horseshoe over the door, then a second one, then a third.'})
for (fx, fy, fw, fh) in [(8, 19, 12, 7), (24, 20, 12, 6), (14, 9, 10, 4), (31, 9, 8, 4)]:
    m.rect(fx, fy, fw, fh, ground='d')
    for r in range(fy, fy + fh, 2):
        m.rect(fx, r, fw, 1, ground='k')
    m.rect(fx - 1, fy - 1, fw + 2, 1, prop='F')
    m.set(fx + fw // 2, fy - 1, prop=' ')
m.scatter(8, 9, 32, 17, ['h', 'g'], 0.04, on='dk')
m.scatter(0, 0, 56, 5, ['T', 'T', 'P', 'b'], 0.35, on=',')
m.scatter(38, 0, 18, 9, ['T', 'P', 'b', 'R'], 0.25, on=',')
m.scatter(0, 28, 56, 4, ['T', 'b', 'T'], 0.5, on=',')
m.scatter(0, 5, 56, 23, ['f', 'g', 'T', 'b'], 0.03, on='k')
m.rect(42, 1, 6, 6, prop=' ')
m.rect(44, 6, 2, 6, prop=' ')
m.rect(48, 6, 6, 3, prop=' ')
m.rect(52, 8, 2, 8, prop=' ')
m.set(45, 2, prop='@'); m.set(43, 2, prop='C'); m.set(47, 3, prop='O')
m.set(7, 11, prop='W'); m.set(11, 10, prop='h'); m.set(12, 10, prop='h')
m.set(30, 17, prop='s')
m.clear_props(0, 14, 3, 5)
m.clear_props(52, 13, 4, 5)
m.spot('west', 1, 16)
m.spot('east', 54, 15)
m.write('c2_td_fields')
m.preview()
