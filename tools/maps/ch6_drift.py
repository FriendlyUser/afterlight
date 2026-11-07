"""Chapter 6 — The Drift: the broken pieces of Lanternfall floating between
Fennick's shard and Keelhaven. Wreckage bridges over the abyss."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(66, 34, ground=' ', height=0, seed=71)


def isle(cx, cy, rx, ry, ground='q', h=3, jitter=0.25):
    m.ellipse(cx, cy, rx, ry, ground=ground, height=h, jitter=jitter)


def bridge(x, y, w, h_tiles, height=3):
    m.rect(x, y, w, h_tiles, ground='=', height=height)


# A — landing isle (from Fennick's bridge)
isle(6, 14, 5.5, 4.5)
bridge(0, 13, 3, 2)
# B — the village square, torn loose whole
isle(19, 13, 6.5, 5, ground=';', h=3, jitter=0.15)
bridge(11, 13, 3, 2)
# C — half of the Halloway house (north of the square)
isle(20, 3.5, 5, 2.8, ground='q', h=4, jitter=0.1)
m.rect(17, 1, 7, 4, ground='=', height=4)                # the floor that's left
m.rect(16, 1, 1, 4, ground='T', height=4)                # west wall
m.rect(16, 0, 8, 1, ground='T', height=4)                # back wall
bridge(19, 6, 2, 3, height=3)
# D — the Dawnguard cutter wreck (east)
isle(36, 13, 7, 5.5, ground='a', h=3)
m.rect(31, 10, 11, 6, ground='+', height=3)              # deck
m.rect(30, 9, 13, 1, ground='W', height=3)               # far rail
m.rect(30, 9, 1, 7, ground='W', height=3)                # bow
m.rect(42, 9, 1, 3, ground='W', height=3)
m.rect(30, 12, 1, 2, ground='+', height=3)               # gap torn in the bow
bridge(26, 12, 4, 2)
# E — ash field (south), off the square
isle(29, 26, 6.5, 4.5, ground='a', h=2)
bridge(18, 18, 2, 3, height=3)
m.ramp(18, 21, 2, 's', 3, 2, width=2, ground='=')
bridge(18, 23, 6, 2, height=2)
# F — Gull Rock (the way on to Keelhaven)
isle(53, 15, 8, 6, ground='q', h=3)
m.ellipse(55, 13, 3, 2.2, ground='#', height=3)          # the old sea-stack
bridge(43, 14, 3, 2)
isle(47, 15, 2.2, 1.6, ground='a', h=3, jitter=0)        # stepping stone
bridge(49, 14, 2, 2)
m.rect(46, 14, 3, 2, ground='a', height=3)
# exit bridge east
bridge(60, 15, 6, 2)
# G — a lonely pinnacle with a chest (reached from F, south)
isle(52, 27, 3, 2.4, ground='q', h=2)
bridge(52, 20, 2, 5, height=3)
m.ramp(52, 24, 2, 's', 3, 2, width=2, ground='=')

# --- props
m.scatter(0, 0, 66, 34, ['D', 'R', 'o', 'd'], 0.06, on='q')
m.scatter(0, 0, 66, 34, ['d', 'x', 'o', '%'], 0.08, on='a')
m.scatter(13, 8, 13, 10, ['d', 'o'], 0.05, on=';')
m.clear_props(0, 12, 66, 5)
m.clear_props(17, 5, 5, 6)
m.clear_props(17, 17, 8, 9)
m.clear_props(51, 19, 4, 7)
m.set(19, 12, prop='W')                                  # the well
m.set(16, 10, prop='L'); m.set(23, 16, prop='L')
m.set(22, 10, prop='s')                                  # the old village sign
m.set(17, 15, prop='O'); m.set(15, 12, prop='!')
m.set(18, 2, prop='E'); m.set(21, 2, prop='='); m.set(20, 2, prop='j'); m.set(22, 2, prop='j')
m.set(23, 1, prop='H')
m.set(36, 11, prop='|')                                  # broken mast
m.set(33, 11, prop='C'); m.set(34, 15, prop='O'); m.set(39, 15, prop='C'); m.set(40, 11, prop='k')
m.set(32, 15, prop='q')
for (x, y) in [(50, 18), (57, 18), (58, 11)]:
    m.set(x, y, prop='D')
m.set(2, 16, prop='R')                                   # the westward lookout
# drifting debris (decor)
for (cx, cy, rx, ry, h) in [(5, 3, 2, 1.2, 6), (41, 3, 2.6, 1.5, 7), (62, 5, 2, 1.4, 5), (8, 28, 3, 1.6, 1), (42, 30, 2, 1.2, 0), (63, 28, 2.2, 1.5, 4)]:
    isle(cx, cy, rx, ry, ground='q', h=h, jitter=0.2)

m.spot('entry', 1, 13)
m.spot('square', 19, 14)
m.spot('house', 20, 3)
m.spot('wreck', 36, 12)
m.spot('field', 29, 26)
m.spot('exit', 64, 15)
m.write('c6_drift')
m.preview()
