"""Wreck of the Benediction — a Choir pilgrim galleon pinned to a floating crag
inside a storm that has not stopped for a year (Ch9, second Halcyon part)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 46, 42
m = MapCanvas(W, H, ground=' ', height=0, seed=522)

# --- the crag
m.ellipse(23, 21, 14, 18, ground='#', height=1, jitter=0.4)
m.ellipse(23, 21, 12.5, 16.5, ground='q', height=2, jitter=0.3)
m.ellipse(36, 19, 6, 6, ground='#', height=0, jitter=0.3)
m.ellipse(36, 19, 5, 5, ground='o', height=1, jitter=0.2)         # the spilled hold (east)
m.ellipse(23, 35, 7, 4, ground='q', height=2, jitter=0.2)         # south landing
m.rect(21, 37, 3, 5, ground='=', height=2)                       # barge pier
m.ellipse(5, 13, 3.2, 3, ground='#', height=1, jitter=0.2)
m.ellipse(5, 13, 2.6, 2.4, ground='o', height=2, jitter=0.1)      # the crow's-nest islet (west)

# --- the galleon (bow north). forecastle h6, main deck h5, quarterdeck h6.
hull = {}
for y in range(4, 33):
    if y < 8:
        half = 2 + (y - 4)
    elif y > 29:
        half = 6 - (y - 30) * 2
    else:
        half = 6
    for x in range(23 - half, 24 + half):
        lvl = 6 if y <= 9 or y >= 23 else 5
        m.set(x, y, ground='=', height=lvl)
        hull[(x, y)] = lvl
# hull rim: dark planks one level up so the deck has a gunwale
for (x, y), lvl in list(hull.items()):
    edge = any((x + dx, y + dy) not in hull for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
    if edge:
        m.set(x, y, ground='+', height=lvl + 2)
# breaches and gangways
m.ramp(23, 36, 5, 'n', 2, 6, width=2, ground='=')      # gangway up to the stern
m.ramp(30, 18, 4, 'e', 5, 2, width=2, ground='=')      # broken rail down to the hold
m.set(29, 18, ground='=', height=5); m.set(29, 19, ground='=', height=5)
# the fallen mainyard: a plank bridge west to the crow's-nest islet
m.set(17, 13, ground='=', height=5)
m.line(16, 13, 8, 13, width=1, ground='=', height=4)
m.set(7, 13, ground='=', height=3)
m.set(6, 13, ground='o', height=2)
# mast step: the mainmast stands on a raised platform; ramp south (sealed by a ward)
m.rect(21, 13, 5, 4, ground='+', height=7)
m.set(23, 17, ground='=', height=6)
# stair from main deck to the forecastle and quarterdeck (1 level, just planks)
# captain's cabin on the quarterdeck
# (a low companionway arch; the cabin itself is below decks — see the map's exits)
m.structure('arch', 22, 26, w=3, tex='wall_wood')
for (x, y, p) in [(20, 25, 'O'), (26, 25, 'C'), (21, 24, '^'), (25, 24, '^'), (18, 14, '^'), (28, 14, '^'), (20, 9, '^'), (26, 9, '^')]:
    m.set(x, y, prop=p)

# --- props
m.set(23, 14, prop='|'); m.set(23, 13, prop='q')        # mainmast and its torn sail
m.set(23, 6, prop='|'); m.set(23, 28, prop='|')         # fore and mizzen masts
m.set(23, 8, prop='u')                                  # fore hymn-censer (inspect)
m.set(38, 16, prop='u')                                 # hold hymn-censer (inspect)
m.set(22, 10, prop='$')                                 # Hearthstone on the main deck
for (x, y, p) in [(18, 11, 'O'), (28, 12, 'C'), (19, 21, 'k'), (27, 20, 'O'), (18, 27, 'C'),
                  (28, 28, 'O'), (21, 30, 'k'), (26, 31, 'd'), (20, 7, 'd'), (26, 8, 'x'),
                  (19, 16, 'x'), (27, 15, 'd'), (21, 19, 'L'), (25, 11, 'L'), (19, 29, 'L')]:
    m.set(x, y, prop=p)
for (x, y, p) in [(35, 14, 'C'), (36, 14, 'C'), (39, 19, 'O'), (34, 21, 'k'), (37, 22, 'x'),
                  (40, 17, 'C'), (33, 16, '^')]:
    m.set(x, y, prop=p)
m.scatter(4, 4, 40, 34, ['R', 'd', 'x', 'D', 'o'], 0.08, on='q')
m.set(5, 12, prop='!')                                  # the crow's nest, snapped off
m.clear_props(21, 33, 4, 9)
m.clear_props(30, 17, 5, 4)

m.spot('entry', 22, 39)
m.spot('mast', 23, 16)
m.write('c9_benediction')
m.preview()
