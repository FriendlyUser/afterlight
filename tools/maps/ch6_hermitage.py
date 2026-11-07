"""Chapter 6 — Old Fennick's hut (shard_hermitage) and the floating shard it
stands on (c6_hermit_shard): a broken piece of Lanternfall's northern cliffs."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# ------------------------------------------------------------------ the hut
m = interior(12, 10, wall='W', floor='+', seed=61)
m.set(2, 2, prop='E')                                  # the bed Wren woke in
m.set(8, 2, prop='H'); m.set(9, 2, prop='H'); m.set(10, 2, prop='H')
m.set(5, 2, prop='^')
m.set(1, 4, prop='u')                                  # stove-pot
m.set(8, 5, prop='='); m.set(7, 5, prop='j'); m.set(9, 5, prop='j')
m.set(10, 7, prop='C'); m.set(10, 6, prop='k'); m.set(1, 7, prop='O')
m.set(4, 2, prop='q')                                  # an old net
m.rect(5, 8, 2, 2, ground='x')
m.spot('wake', 5, 5); m.spot('fennick', 7, 4); m.spot('door', 5, 9)
m.write('shard_hermitage')

# ------------------------------------------------------------------ the shard
m = MapCanvas(38, 28, ground=' ', height=0, seed=62)
# main body and a lower southern terrace
m.ellipse(16, 12, 13.5, 9, ground='q', height=3, jitter=0.25)
m.ellipse(15, 21, 9, 4, ground='a', height=2, jitter=0.3)
m.ellipse(16, 12, 9, 5.5, ground=',', height=3, jitter=0.35)
m.ellipse(27, 9, 4, 3, ground='q', height=4, jitter=0.2)   # the cairn rise (NE)
m.ramp(23, 10, 2, 'e', 3, 4, width=2, ground=':')
m.ramp(14, 18, 2, 's', 3, 2, width=2, ground=':')
# paths
m.path([(14, 9), (14, 12), (20, 12), (25, 13), (30, 13)], width=1, ground=':', height=3)
m.path([(14, 12), (8, 14), (6, 17)], width=1, ground=':', height=3)
m.path([(14, 12), (14, 17)], width=2, ground=':', height=3)
# garden
m.rect(7, 9, 4, 3, ground='d', height=3)
for x in range(6, 12):
    m.set(x, 8, prop='F')
m.scatter(7, 9, 4, 3, ['f', 'b', 'B', 'f'], 0.6, on='d')
# training ring
m.ellipse(21, 16, 3.5, 2.2, ground='d', height=3)
m.set(21, 15, prop='|'); m.set(18, 17, prop='O'); m.set(24, 16, prop='C')
# east bridge (2 wide) to the Drift
m.rect(29, 12, 9, 2, ground='=', height=3)
m.set(29, 11, prop='F'); m.set(29, 14, prop='F')
# Fennick's hut
m.building(12, 6, 5, 3, wall='wall_wood', roof='roof_thatch', door={'dx': 2, 'to': 'shard_hermitage', 'tx': 5, 'ty': 8, 'dir': 'up'}, windows=[0, 4])
# props
m.set(18, 8, prop='@')                                 # cookfire
m.set(11, 7, prop='L')
m.set(17, 9, prop='O'); m.set(10, 6, prop='k')
m.set(26, 8, prop='t'); m.set(28, 8, prop='t')         # two cairns
m.set(27, 7, prop='D')
m.set(3, 12, prop='R')                                 # Wren's rock
m.set(21, 22, prop='V')                                # the beached fishing boat
m.scatter(2, 2, 34, 24, ['D', 'R', 'o', 'b'], 0.05, on='q')
m.scatter(2, 2, 34, 24, ['g', 'o', 'f'], 0.06, on=',')
m.scatter(6, 18, 20, 7, ['d', 'x', 'o', '%', 'D'], 0.12, on='a')
m.clear_props(13, 9, 3, 9)
m.clear_props(27, 11, 4, 4)
m.clear_props(3, 11, 3, 3); m.set(3, 12, prop='R')
# small drifting rocks (decor only, unreachable)
for (cx, cy, rx, ry, h) in [(3, 4, 2, 1.4, 5), (34, 4, 2.4, 1.6, 6), (33, 22, 2, 1.3, 1), (2, 24, 1.6, 1.1, 4)]:
    m.ellipse(cx, cy, rx, ry, ground='q', height=h)
m.set(34, 4, prop='D'); m.set(3, 4, prop='R')

m.spot('door_out', 14, 9)
m.spot('rock', 4, 12)
m.spot('cairns', 27, 9)
m.spot('ring', 21, 16)
m.spot('bridge', 36, 12)
m.write('c6_hermit_shard')
m.preview()
