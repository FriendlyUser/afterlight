"""The Boneyard — the canyon floor under Corvin's Roost, where the airships fell
when the sky broke. Scrap heaps, crushed hulls, and the Foreman's yard (Ch9)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 48, 36
m = MapCanvas(W, H, ground='#', height=6, seed=331)

# --- floors
m.rect(2, 25, 17, 9, ground='a', height=0)       # SW yard (lift cage)
m.rect(5, 12, 7, 14, ground='d', height=0)       # west gulch
m.rect(2, 2, 13, 9, ground='a', height=1)        # NW pocket (winch)
m.ramp(7, 12, 2, 'n', 0, 1, width=3, ground=':')
m.rect(12, 13, 22, 9, ground='a', height=0)      # the hub, round the Marigold
m.rect(18, 22, 15, 5, ground='a', height=0)      # south of the hub
m.rect(32, 22, 14, 12, ground='d', height=0)     # south-east scrapfield
m.rect(20, 9, 22, 5, ground='a', height=1)       # north approach
m.rect(30, 1, 16, 7, ground='r', height=1)       # the Foreman's yard
m.rect(29, 8, 17, 1, ground='R', height=1)       # wall of fused hulls
m.rect(36, 8, 3, 1, ground='r', height=1)        # its gap (a blocker seals it)
m.rect(18, 22, 1, 12, ground='#', height=6)      # rock spine: SW yard | hub-south

# --- the Marigold: a ferry lying on its keel, walkable deck (h2) with ramps
m.rect(15, 16, 15, 3, ground='=', height=2)
m.ramp(14, 17, 2, 'w', 2, 1, width=1, ground='=')
m.ramp(30, 17, 2, 'e', 2, 1, width=1, ground='=')
for x in range(16, 29, 2):
    m.set(x, 16, prop='j')                       # seats still bolted, facing the windows
m.set(22, 18, prop='d'); m.set(26, 18, prop='O')
# --- the Gilded Gull: an upturned hull in the scrapfield
m.rect(36, 24, 8, 3, ground='W', height=0)
# --- scrap walls between the routes
m.rect(12, 22, 6, 3, ground='R', height=0)
m.rect(19, 27, 3, 6, ground='#', height=6)
m.rect(26, 27, 6, 7, ground='#', height=6)

# Lift cage (entry) in the SW
m.rect(2, 30, 4, 4, ground='=', height=0)
m.set(2, 30, prop='a'); m.set(5, 30, prop='|')
m.set(18, 25, ground='a', height=0); m.set(18, 26, ground='a', height=0)   # the heap gap (blocker)

# --- props
m.scatter(2, 2, 44, 32, ['d', 'd', 'x', 'o', 'O', 'C', '!', 'R'], 0.07, on='ad')
m.scatter(30, 1, 16, 7, ['d', 'x', '!'], 0.06, on='r')
for (x, y) in [(10, 27), (16, 14), (24, 22), (33, 11), (40, 30), (6, 4), (35, 3), (43, 3)]:
    m.set(x, y, prop='^')
m.set(4, 4, prop='a')        # north-west winch
m.set(44, 32, prop='a')      # south-east winch
m.set(31, 11, prop='$')      # Hearthstone before the yard
m.set(12, 3, prop='|')       # crane-tower (Wick's sightline)
m.set(40, 27, prop='C')      # the Gilded Gull's strongbox (a mimic)
m.clear_props(36, 7, 3, 4)
m.clear_props(2, 30, 5, 4)
m.clear_props(6, 12, 5, 3)
m.clear_props(13, 16, 3, 3); m.clear_props(29, 16, 3, 3)

# --- roughen the floor edges so the gulches read as eroded rock, not boxes
SAFE = [(2, 29, 6, 6), (5, 10, 6, 4), (12, 15, 4, 5), (28, 15, 5, 5), (34, 6, 7, 6), (30, 10, 3, 3),
        (16, 23, 5, 5), (42, 30, 4, 4), (2, 2, 4, 4)]
def safe(x, y):
    return any(sx <= x < sx + sw and sy <= y < sy + sh for (sx, sy, sw, sh) in SAFE)
edge = []
for y in range(1, H - 1):
    for x in range(1, W - 1):
        if m.g[y][x] in 'ad' and not safe(x, y):
            if any(m.g[y + dy][x + dx] == '#' for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                edge.append((x, y))
for (x, y) in edge:
    if m.rng.random() < 0.3:
        m.set(x, y, ground='#', height=6, prop=' ')

# --- weathered walls (walls with open floor just north of them stay low, so the camera can see over)
for y in range(H):
    for x in range(W):
        if m.g[y][x] == '#' and any(m.g[y - k][x] not in '# ' for k in range(1, 6) if y - k >= 0):
            m.hg[y][x] = m.rng.choice([2, 2, 3])
        elif m.g[y][x] == '#':
            m.hg[y][x] = m.rng.choice([5, 6, 6, 7, 8])

m.spot('entry', 4, 31)
m.spot('foreman', 37, 3)
m.spot('gate', 36, 8)
m.write('c9_boneyard')
m.preview()
