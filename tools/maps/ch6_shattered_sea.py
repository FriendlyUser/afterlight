"""Chapter 6 — The Shattered Sea: the old strait between Lanternfall and the
mainland, now an abyss full of floating wreckage. Hub-and-spokes dungeon:
two salvagers' winches unchain the east bridge to the Strait-That-Was."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(72, 44, ground=' ', height=0, seed=91)


def isle(cx, cy, rx, ry, ground='a', h=3, jitter=0.25):
    m.ellipse(cx, cy, rx, ry, ground=ground, height=h, jitter=jitter)


def bridge(x, y, w, hh, height=3):
    m.rect(x, y, w, hh, ground='=', height=height)


# entry isle + bridge from Keelhaven
isle(6, 21, 5, 4)
bridge(0, 20, 3, 2)
bridge(11, 20, 7, 2)
# the hub: Salvagers' Rest
isle(24, 21, 7.5, 5.5, ground='q')
m.ellipse(24, 21, 4, 3, ground='g', height=3, jitter=0.3)
# north spoke: the Chainyard (winch A) and Glassback's quarry (west)
bridge(23, 10, 2, 7)
isle(24, 6, 8, 4, ground='a', h=4)
m.rect(27, 3, 4, 3, ground='+', height=4)
bridge(12, 5, 5, 2, height=4)
isle(7, 6, 5, 3.6, ground='g', h=4)
m.ellipse(6, 5, 2.2, 1.4, ground='#', height=4)
# south spoke: the wreck of the Gilded Psalm (winch B)
bridge(23, 26, 2, 7)
isle(24, 37, 11, 5, ground='a', h=3, jitter=0.15)
m.rect(16, 34, 17, 6, ground='+', height=3)          # deck
m.rect(15, 33, 19, 1, ground='W', height=3)          # starboard rail
m.rect(15, 33, 1, 7, ground='W', height=3)           # bow
m.rect(33, 33, 1, 7, ground='W', height=3)           # stern
m.rect(23, 33, 2, 1, ground='+', height=3)           # gap where the bridge lands
m.rect(26, 35, 5, 3, ground='W', height=3)           # deckhouse
m.rect(27, 36, 3, 2, ground='+', height=3)
# east bridge (chained: blockers in the map file)
bridge(31, 20, 9, 2)
# the Last Hearth isle
isle(44, 21, 5, 4, ground='q')
# north-east: the Lidless's perch
bridge(44, 9, 2, 9, height=4)
isle(46, 6, 5.5, 3.2, ground='u', h=5)
# to the Strait-That-Was
bridge(49, 20, 5, 2)
isle(61, 21, 8.5, 7, ground='a')
m.ellipse(61, 21, 5, 4, ground='u', height=3, jitter=0.4)
bridge(69, 20, 3, 2)

# --- props
m.scatter(0, 0, 72, 44, ['d', 'o', 'x', 'D'], 0.07, on='a')
m.scatter(0, 0, 72, 44, ['R', 'o', 'b', 'D'], 0.05, on='q')
m.scatter(0, 0, 72, 44, ['*', 'o'], 0.08, on='g')
m.scatter(0, 0, 72, 44, ['%', 'x'], 0.07, on='u')
m.clear_props(0, 19, 72, 4)
m.clear_props(22, 8, 4, 30)
m.clear_props(43, 8, 4, 12)
m.clear_props(54, 16, 14, 11)
m.set(29, 4, prop='a')                                 # winch A
m.set(28, 3, prop='C'); m.set(30, 5, prop='O'); m.set(20, 4, prop='!'); m.set(19, 8, prop='O')
m.set(28, 36, prop='a')                                # winch B (in the deckhouse)
for (x, y) in [(18, 35), (31, 38), (20, 38)]:
    m.set(x, y, prop='C')
m.set(24, 36, prop='|')                                # the Psalm's broken mast
m.set(17, 38, prop='q')
m.set(44, 19, prop='$')
m.set(41, 22, prop='@'); m.set(47, 23, prop='O')
for (x, y) in [(56, 16), (58, 15), (61, 15), (64, 15), (66, 16), (56, 26), (58, 27), (61, 27), (64, 27), (66, 26)]:
    m.set(x, y, prop='|')                              # ribs of something enormous
for (x, y) in [(59, 19), (63, 23), (57, 22), (65, 20)]:
    m.set(x, y, prop='x')
# drifting debris (decor)
for (cx, cy, rx, ry, h) in [(14, 30, 2.5, 1.4, 1), (37, 8, 2, 1.3, 7), (36, 31, 3, 1.6, 0), (55, 6, 2, 1.2, 6), (68, 37, 3, 2, 2), (3, 38, 2.6, 1.6, 5), (52, 37, 2, 1.3, 1)]:
    isle(cx, cy, rx, ry, ground='q', h=h, jitter=0.2)

m.spot('entry', 1, 20)
m.spot('hub', 24, 21)
m.spot('glassback', 8, 7)
m.spot('lidless', 46, 6)
m.spot('arena', 60, 21)
m.spot('exit', 70, 20)
m.write('c6_shattered_sea')
m.preview()
