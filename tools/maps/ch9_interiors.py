"""Ch9 interiors: the Last Call (bar & inn), the Ledger House (Odessa's counting
room), the Benediction's captain's cabin, and the Halcyon's deck in flight."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# --- The Last Call: bar along the north wall, card table, stair to the rooms.
m = interior(14, 10, wall='W', floor='+', seed=91)
for x in range(2, 9):
    m.set(x, 3, prop='=')                       # the bar
m.set(1, 2, prop='O'); m.set(2, 2, prop='O'); m.set(3, 2, prop='H'); m.set(4, 2, prop='H')
m.set(6, 2, prop='^'); m.set(9, 2, prop='^')
m.set(5, 2, prop='O'); m.set(7, 2, prop='k')
for x in (3, 5, 7):
    m.set(x, 4, prop='j')                       # stools
m.set(10, 6, prop='='); m.set(9, 6, prop='j'); m.set(11, 6, prop='j'); m.set(10, 5, prop='j')  # card table
m.set(3, 7, prop='='); m.set(2, 7, prop='j'); m.set(4, 7, prop='j')
m.set(12, 2, prop='E'); m.set(11, 2, prop='E')  # rooms upstairs (curtained beds)
m.set(12, 4, prop='C'); m.set(1, 6, prop='C'); m.set(12, 8, prop='O')
m.rect(6, 9, 2, 1, ground='x')
m.spot('entry', 6, 8); m.spot('corvin', 8, 4); m.spot('tuck', 5, 2)
m.write('c9_last_call')

# --- The Ledger House: Odessa's counting room. Ledgers to the ceiling.
m = interior(12, 9, wall='S', floor='=', seed=92)
for x in (1, 2, 3, 8, 9, 10):
    m.set(x, 2, prop='H')
m.set(5, 2, prop='^'); m.set(6, 2, prop='^')
m.rect(4, 3, 4, 1, prop='=')                    # Odessa's desk
m.set(5, 4, prop=' '); m.set(6, 4, prop=' ')
m.rect(3, 5, 6, 3, ground='x')                  # the carpet debtors stand on
m.set(1, 5, prop='C'); m.set(1, 6, prop='C'); m.set(10, 5, prop='O'); m.set(10, 6, prop='S')
m.set(2, 4, prop='j'); m.set(9, 4, prop='j')
m.spot('entry', 5, 7); m.spot('odessa', 6, 2)
m.write('c9_ledger_house')

# --- Captain's cabin of the Benediction, tilted and dripping.
m = interior(10, 8, wall='W', floor='=', seed=93)
m.set(1, 2, prop='E'); m.set(8, 2, prop='H'); m.set(7, 2, prop='H')
m.set(4, 3, prop='='); m.set(5, 3, prop='='); m.set(4, 4, prop='j')
m.set(3, 2, prop='^'); m.set(1, 5, prop='O'); m.set(8, 5, prop='d'); m.set(7, 6, prop='d')
m.set(2, 6, prop='x')
m.set(6, 2, prop='H')                       # the shelf where the clock sits
m.spot('entry', 4, 6)
m.write('c9_benediction_cabin')

# --- The Halcyon in flight: a deck alone in the bruised sky.
m = MapCanvas(26, 16, ground=' ', height=0, seed=94)
hull = [(8, 3, 9), (6, 4, 13), (5, 5, 15), (4, 6, 17), (4, 7, 18), (4, 8, 18), (4, 9, 17), (5, 10, 15), (6, 11, 13), (8, 12, 9)]
for (x0, y, w) in hull:
    m.rect(x0, y, w, 1, ground='=', height=2)
m.building(6, 5, 4, 3, wall='wall_wood', roof='roof_red', h=2.2, windows=[1, 2])   # wheelhouse
for (x, y, p) in [(12, 6, '|'), (17, 6, '|'), (12, 5, 'q'), (17, 5, 'q'), (14, 4, 'O'), (15, 4, 'C'),
                  (20, 8, 'L'), (5, 9, 'L'), (9, 11, 'k'), (16, 11, 'O'), (21, 7, 'C')]:
    m.set(x, y, prop=p)
for x in range(9, 17):
    m.set(x, 12, prop='F')                     # stern rail
m.spot('wheel', 10, 8); m.spot('bow', 21, 8)
m.write('c9_halcyon_flight')
