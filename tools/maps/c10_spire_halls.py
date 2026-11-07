"""The Spire Halls — inside the Noon Spire (Ch10). White marble, gold leaf and
ten thousand stopped clocks. Three clock rooms must be set to noon to open the
Noon Gate into Evernoon. During the escape the Sky Balcony (east) opens."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 42, 40
m = MapCanvas(W, H, ground='K', height=1, seed=1111)

def room(x, y, w, h, ground='M', height=1):
    m.rect(x, y, w, h, ground=ground, height=height)

# --- the receiving hall (south), open to the sky at its southern edge
room(12, 27, 18, 10)
m.rect(14, 37, 14, 3, ground='_', height=1)            # supply-lift landing
m.rect(0, 39, W, 1, ground=' ', height=0)
m.rect(12, 39, 18, 1, ground=' ', height=0)
m.rect(15, 32, 12, 3, ground='X', height=1)             # blue processional carpet
m.rect(19, 18, 4, 14, ground='X', height=1)
# west wing: The Keeper's Choice
room(2, 24, 9, 9)
m.rect(10, 28, 3, 3, ground='M', height=1)
# east wing: The Composer
room(31, 24, 9, 9)
m.rect(29, 28, 3, 3, ground='M', height=1)
# the long nave north, up to the dais
room(15, 13, 12, 14)
m.rect(17, 5, 8, 8, ground='M', height=3)               # Hour-Warden's dais
m.ramp(20, 14, 2, 'n', 1, 3, width=2, ground='M')      # dais stairs (13 is h3)
m.rect(19, 2, 4, 3, ground='M', height=3)               # the Noon Gate recess
# north-west gallery (raised): The Letters
room(3, 6, 10, 9, height=3)
m.rect(12, 9, 4, 3, ground='M', height=3)
m.ramp(13, 12, 2, 's', 3, 2, width=2, ground='M')       # down toward the nave (h2 -> nave h1)
m.rect(13, 14, 2, 1, ground='M', height=1)
# east: the Sky Balcony (opened during the escape), open to the void
room(27, 6, 6, 4, height=3)                             # corridor from the dais
room(33, 3, 7, 11, height=3)
m.rect(25, 7, 2, 2, ground='M', height=3)              # the balcony door (a blocker until the escape)
m.rect(40, 3, 2, 11, ground=' ', height=0)
m.rect(33, 14, 7, 1, ground=' ', height=0)

# --- props: pillars down the nave, clocks (bookshelves stand in as clock-cases)
for y in range(15, 27, 3):
    m.set(16, y, prop='|'); m.set(25, y, prop='|')
for x in range(13, 29, 3):
    m.set(x, 28, prop='|')
for (x, y) in [(3, 25), (5, 25), (7, 25), (9, 25), (32, 25), (34, 25), (36, 25), (38, 25),
               (4, 7), (6, 7), (8, 7), (10, 7)]:
    m.set(x, y, prop='H')                                # clock cases
m.set(6, 28, prop='S'); m.set(35, 28, prop='S'); m.set(7, 10, prop='S')   # the three clocks (inspect)
for (x, y) in [(13, 30), (28, 30), (15, 35), (26, 35), (18, 14), (23, 14), (3, 30), (38, 30), (4, 12), (11, 8)]:
    m.set(x, y, prop='^')
for (x, y) in [(17, 22), (24, 22), (17, 17), (24, 17), (19, 6), (22, 6)]:
    m.set(x, y, prop='q')
m.set(21, 34, prop='$')                                  # Hearthstone at the landing
m.set(21, 8, prop='$')                                   # Hearthstone before the Gate (after the Warden)
for (x, y) in [(35, 5), (38, 8), (36, 12)]:
    m.set(x, y, prop='!')
m.set(14, 37, prop='C'); m.set(27, 37, prop='C'); m.set(15, 38, prop='O')

m.spot('entry', 20, 37)
m.spot('gate', 20, 3)
m.spot('warden', 21, 7)
m.spot('balcony', 37, 8)
m.write('c10_spire_halls')
m.preview()
