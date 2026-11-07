"""Side content — Fort Ashwatch, Sir Aldous Venn's old Dawnguard command:
the outer bailey, the keep, and the signal tower (Act I, Ch4+, Lv ~28)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

PREVIEW = '--preview' in sys.argv


def done(m, mid):
    m.write(mid)
    if PREVIEW:
        m.preview()


# =====================================================================
# side_ash_bailey — the outer bailey under grey skies
# =====================================================================
W, H = 44, 36
m = MapCanvas(W, H, ground='q', height=1, seed=421)
# outside the walls: heath and a dry moat
m.rect(0, 30, W, 6, ground='q', height=1)
m.rect(2, 29, 40, 2, ground='m', height=0)
m.rect(19, 29, 6, 2, ground='=', height=1)                  # drawbridge
# curtain wall (thick) with a gate gap
m.rect(2, 2, 40, 27, ground='S', height=1)
m.rect(4, 4, 36, 23, ground='d', height=1)
m.rect(19, 27, 6, 2, ground=';', height=1)
m.structure('arch', 19, 27, w=6, tex='wall_stone')
# the keep (north) — its door leads inside
m.building(14, 4, 16, 7, wall='wall_stone', roof='roof_slate', h=4.6,
           door={'dx': 8, 'to': 'side_ash_keep', 'tx': 20, 'ty': 29, 'dir': 'up'}, windows=[3, 12])
m.rect(20, 11, 5, 2, ground=';', height=1)
# barracks (west, roof fallen in) and stables (east)
m.building(5, 13, 9, 5, wall='wall_ruin', roof='roof_slate', h=2.4, windows=[2, 6])
m.building(31, 5, 8, 4, wall='wall_wood', roof='roof_thatch', h=2.2, windows=[2, 5])
# parade ground: cobbles, a cracked well, training dummies
m.rect(15, 15, 14, 9, ground=';', height=1)
m.path([(22, 26), (22, 13)], width=3, ground=';')
m.set(22, 19, prop='W')
for (x, y) in [(16, 16), (16, 18), (16, 20)]:
    m.set(x, y, prop='S')
# kennels (east), fenced run
for x in range(31, 40):
    m.set(x, 13, prop='F'); m.set(x, 22, prop='F')
for y in range(13, 23):
    m.set(39, y, prop='F')
for y in (13, 14, 15, 19, 20, 21, 22):
    m.set(31, y, prop='F')
m.rect(32, 14, 7, 8, ground='m', height=1)
m.set(37, 15, prop='h'); m.set(33, 20, prop='x'); m.set(36, 21, prop='x')
# armour racks, crates, braziers, a gibbet of old banners
for (x, y, p) in [(6, 20, 'C'), (7, 20, 'C'), (6, 21, 'O'), (11, 21, 'k'), (5, 24, 'a'), (12, 24, 'O'),
                  (30, 24, 'C'), (36, 25, 'O'), (14, 12, 'q'), (30, 12, 'q'), (18, 14, '^'), (26, 14, '^'),
                  (18, 25, '^'), (26, 25, '^'), (9, 9, 't'), (11, 9, 't'), (7, 9, 't'), (9, 7, 'S')]:
    m.set(x, y, prop=p)
m.scatter(4, 4, 36, 23, ['d', 'x', 'o', 'D'], 0.05, on='dq')
m.scatter(0, 30, W, 6, ['D', 'R', 'g', 'o'], 0.12, on='q')
m.clear_props(19, 26, 7, 10)
m.clear_props(20, 11, 5, 2)
m.spot('entry', 22, 34)
m.spot('keep_door', 22, 10)
m.spot('mange', 35, 18)
m.spot('graves', 9, 8)
done(m, 'side_ash_bailey')

# =====================================================================
# side_ash_keep — the great hall, office, armoury, chapel, barracks, cellar
# =====================================================================
W, H = 42, 32
m = MapCanvas(W, H, ground='S', height=1, seed=422)


def room(x, y, w, h, g='_'):
    m.rect(x, y, w, h, ground=g, height=1)


room(13, 13, 16, 17)                    # great hall
room(18, 30, 5, 2)                      # front door corridor
m.rect(19, 14, 4, 16, ground='x', height=1)       # the long red carpet
room(15, 3, 12, 8)                      # chapel (north)
room(19, 1, 4, 2)                       # tower stair
room(19, 11, 4, 2)                      # hall → chapel
room(2, 3, 9, 9)                        # commander's office (north-west)
room(5, 12, 3, 3); room(8, 14, 5, 3)    # office corridor (blocked) → hall
room(32, 3, 8, 11)                      # armoury (north-east)
room(29, 15, 5, 3); room(34, 14, 3, 3)  # armoury corridor
room(2, 18, 9, 11)                      # barracks (south-west)
room(11, 21, 2, 3)
room(31, 19, 9, 10)                     # cellar (south-east), the frozen cistern
room(29, 23, 2, 3)
m.rect(34, 22, 4, 4, ground='i', height=1)
m.rect(35, 23, 2, 2, ground='~', height=1)
# props
for (x, y) in [(14, 15), (27, 15), (14, 21), (27, 21), (14, 27), (27, 27)]:
    m.set(x, y, prop='|')
for (x, y) in [(15, 14), (26, 14), (15, 28), (26, 28)]:
    m.set(x, y, prop='^')
m.set(17, 18, prop='='); m.set(24, 18, prop='='); m.set(17, 24, prop='='); m.set(24, 24, prop='=')
m.set(16, 18, prop='j'); m.set(25, 18, prop='j'); m.set(16, 24, prop='j'); m.set(25, 24, prop='j')
m.set(21, 4, prop='S'); m.set(17, 5, prop='q'); m.set(25, 5, prop='q')
m.set(17, 8, prop='j'); m.set(18, 8, prop='j'); m.set(24, 8, prop='j'); m.set(25, 8, prop='j')
m.set(23, 9, prop='$')
m.set(3, 4, prop='H'); m.set(4, 4, prop='H'); m.set(6, 6, prop='='); m.set(7, 6, prop='=')
m.set(9, 4, prop='E'); m.set(3, 9, prop='O'); m.set(9, 10, prop='q')
for (x, y) in [(33, 4), (35, 4), (37, 4), (39, 6), (39, 9)]:
    m.set(x, y, prop='a' if x % 2 else 'C')
m.set(33, 12, prop='O'); m.set(38, 12, prop='C')
for (x, y) in [(3, 19), (3, 21), (3, 23), (3, 25), (9, 19), (9, 21), (9, 23)]:
    m.set(x, y, prop='E')
m.set(6, 27, prop='O'); m.set(9, 27, prop='k')
m.set(32, 20, prop='O'); m.set(33, 20, prop='O'); m.set(39, 27, prop='C'); m.set(32, 27, prop='k')
m.scatter(2, 2, 38, 28, ['d', 'x', 'o'], 0.04, on='_')
m.clear_props(19, 1, 4, 31)
m.spot('entry', 20, 30)
m.spot('stair', 20, 1)
m.spot('office_door', 6, 13)
m.spot('duke', 36, 8)
done(m, 'side_ash_keep')

# =====================================================================
# side_ash_tower — the signal tower's roof
# =====================================================================
W, H = 26, 22
m = MapCanvas(W, H, ground=' ', height=0, seed=423)
m.rect(3, 2, 20, 18, ground='S', height=6)
m.rect(4, 3, 18, 16, ground='_', height=6)
m.rect(11, 18, 4, 4, ground='_', height=6)                   # stairhead
m.ellipse(13, 8, 4, 3, ground=';', height=7)
m.ramp(13, 12, 2, 'n', 6, 7, width=1, ground=';')
m.set(13, 7, prop='@')                                        # the signal brazier, cold
for x in range(5, 22, 4):                                     # fallen crenels
    m.set(x, 3, prop='!')
m.set(5, 5, prop='q'); m.set(20, 5, prop='q')
m.set(6, 15, prop='C'); m.set(19, 15, prop='O'); m.set(5, 11, prop='a')
m.set(12, 17, prop='$')
m.spot('entry', 13, 20)
m.spot('brazier', 13, 7)
done(m, 'side_ash_tower')
