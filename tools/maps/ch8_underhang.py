"""Ch8 — the Underhang (cliff ledges beneath Kiteholm) and the wreck of the Choir galleon *Vigil*."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

# =====================================================================
# The Underhang — a descent down the underside of the shard.
# North is "up the cliff"; every ledge south is lower.
# =====================================================================
m = MapCanvas(40, 44, ground=' ', height=0, seed=821)

def ledge(x, y, w, h, hh, g='c'):
    m.rect(x, y, w, h, ground=g, height=hh)

def bridge(x, y, w, h, hh):
    m.rect(x, y, w, h, ground='=', height=hh)

# A: the ladder foot (top)
ledge(16, 0, 9, 7, 9)
m.rect(16, 0, 9, 1, ground='#', height=10)
m.rect(19, 0, 3, 1, ground='=', height=9)
# A → B (west) rope bridge
bridge(8, 4, 8, 2, 9)
# B: the gull cliffs (west, high)
ledge(2, 2, 7, 10, 9)
m.rect(2, 2, 7, 1, ground='#', height=10)
m.ramp(3, 12, 4, 's', 9, 6, width=3, ground='c')
# B2: the west nests
ledge(1, 16, 10, 7, 6)
for (x, y) in [(2, 17), (8, 21), (2, 21)]:
    m.set(x, y, prop='x')
m.set(5, 17, prop='R'); m.set(9, 17, prop='o')
# B2 → C rope bridge
bridge(11, 18, 7, 2, 6)
# C: the middle shelf, with a scout's niche to the north
ledge(18, 13, 9, 10, 6)
ledge(20, 8, 5, 5, 6)
m.rect(20, 8, 5, 1, ground='#', height=7)
m.set(21, 9, prop='@'); m.set(23, 9, prop='k')
m.set(18, 13, prop='R'); m.set(26, 21, prop='o')
# C → D rope bridge
bridge(27, 16, 5, 2, 6)
# D: the roc perch (east)
ledge(32, 10, 7, 14, 6)
m.rect(32, 10, 7, 1, ground='#', height=7)
for (x, y) in [(36, 12), (37, 13), (33, 19)]:
    m.set(x, y, prop='x')
m.set(38, 16, prop='q')
m.ramp(34, 24, 4, 's', 6, 3, width=3, ground='c')
# D2: the low east shelf
ledge(30, 28, 9, 6, 3)
m.set(37, 32, prop='R')
# D2 → E long bridge
bridge(22, 30, 8, 2, 3)
# E: the wreck landing — the *Vigil*'s split prow juts out of the rock
ledge(13, 27, 9, 10, 3)
ledge(15, 37, 6, 7, 3, g='+')
m.set(14, 28, prop='C'); m.set(20, 28, prop='O'); m.set(13, 33, prop='k')
m.set(15, 38, prop='!'); m.set(20, 38, prop='!')
# A broken rope bridge from C straight down toward E (impassable)
bridge(20, 23, 2, 2, 6)
m.set(20, 24, prop='F'); m.set(21, 24, prop='F')
# Scatter cliff debris
m.scatter(0, 0, 40, 44, ['o', 'd', 'g'], 0.06, on='c')

m.spot('entry', 20, 2)
m.spot('pip', 34, 16)
m.spot('niche', 22, 10)
m.spot('wreck', 18, 42)
m.write('c8_underhang')
m.preview()

# =====================================================================
# The wreck of the *Vigil* — a Choir galleon split on the rocks.
# =====================================================================
m = MapCanvas(44, 30, ground='W', height=2, seed=822)

def deck(x, y, w, h, g='+'):
    m.rect(x, y, w, h, ground=g, height=2)

# West: the breach and the lower hold (entry)
deck(0, 13, 3, 4)
deck(2, 9, 11, 13)
for (x, y) in [(3, 10), (4, 10), (11, 10), (3, 20), (4, 20), (11, 19)]:
    m.set(x, y, prop='C')
for (x, y) in [(5, 10), (10, 20), (11, 20)]:
    m.set(x, y, prop='O')
m.set(7, 18, ground=' '); m.set(8, 18, ground=' '); m.set(8, 17, ground=' ')   # hull breach
# The gun deck — the long corridor east
deck(12, 13, 22, 5, g='=')
for (x, y) in [(15, 13), (19, 17), (24, 13), (29, 17)]:
    m.set(x, y, ground=' ')                                # holes in the deck
for (x, y) in [(17, 14), (26, 16), (31, 14)]:
    m.set(x, y, prop='O')
# North: the captain's cabin
deck(19, 9, 3, 4)
deck(15, 2, 12, 7, g='x')
m.set(16, 3, prop='H'); m.set(17, 3, prop='H'); m.set(25, 3, prop='E')
m.set(20, 4, prop='='); m.set(21, 4, prop='='); m.set(19, 4, prop='j')
m.set(24, 6, prop='O'); m.set(16, 7, prop='C')
# South: the brig
deck(20, 18, 2, 3)
deck(14, 21, 13, 7)
for x in range(15, 26):
    if x not in (18, 22):
        m.set(x, 24, prop='F')
m.set(15, 22, prop='^'); m.set(25, 22, prop='^')
# South-east: the cargo hold
deck(30, 18, 3, 4)
deck(29, 22, 13, 6)
for (x, y) in [(30, 23), (31, 23), (40, 23), (40, 24), (35, 26), (36, 26)]:
    m.set(x, y, prop='C')
m.set(33, 25, ground=' '); m.set(34, 25, ground=' ')
# East: the forecastle, where the Lullaby Engine sings
deck(34, 12, 2, 7)
deck(36, 5, 7, 16)
m.set(37, 6, prop='%'); m.set(41, 6, prop='%'); m.set(37, 19, prop='%'); m.set(41, 19, prop='%')
m.set(33, 15, prop='$')

m.spot('entry', 1, 15)
m.spot('cabin', 20, 5)
m.spot('brig', 20, 25)
m.spot('engine', 39, 12)
m.write('c8_vigil_wreck')
m.preview()
