"""Side content — the Garden That Remembers (the Hushgarden): a cemetery garden
that bloomed after the Sundering, where white flowers replay the last words of
the dead. The gate & outer beds, the hedge maze, and the heart (Act II, Lv ~60)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

PREVIEW = '--preview' in sys.argv


def done(m, mid):
    m.write(mid)
    if PREVIEW:
        m.preview()


# =====================================================================
# side_garden_gate — the lychgate, the outer beds, Thessaly's cottage
# =====================================================================
W, H = 40, 30
m = MapCanvas(W, H, ground=' ', height=0, seed=441)
m.ellipse(20, 14, 19.5, 14, ground='a', height=0, jitter=0.25)
m.ellipse(20, 14, 18, 12.5, ground='.', height=2, jitter=0.2)
m.rect(18, 25, 5, 5, ground='o', height=2)                         # approach
# the garden wall (ruin), with the lychgate south and the inner gate north
m.rect(4, 3, 33, 1, ground='R', height=2)
m.rect(4, 3, 1, 22, ground='R', height=2)
m.rect(36, 3, 1, 22, ground='R', height=2)
m.rect(4, 24, 33, 1, ground='R', height=2)
m.rect(19, 24, 3, 1, ground='o', height=2)
m.structure('arch', 19, 24, w=3, tex='wall_ruin')
m.rect(19, 0, 3, 4, ground='o', height=2)
# moss paths and beds
m.path([(20, 24), (20, 16), (20, 4)], width=3, ground='o')
m.path([(6, 14), (34, 14)], width=2, ground='o')
for (x, y, w, h) in [(7, 5, 10, 7), (24, 5, 10, 7), (7, 17, 10, 6), (24, 17, 6, 6)]:
    m.rect(x, y, w, h, ground=',', height=2)
    m.scatter(x, y, w, h, ['f', 'f', 'g'], 0.5, on=',')
# graves among the flowers, white rememberworts (solid bushes you face)
for (x, y) in [(9, 6), (13, 6), (9, 9), (14, 10), (26, 6), (31, 7), (8, 19), (12, 21), (27, 19)]:
    m.set(x, y, prop='t')
# pond (east-south)
m.ellipse(32, 20, 3.4, 2.5, ground='w', height=1)
m.ellipse(32, 20, 2.2, 1.4, ground='~', height=1)
m.rect(28, 20, 1, 1, ground='=', height=2)
# Thessaly's potting shed and wheelbarrow corner
m.set(16, 12, prop='u'); m.set(5, 12, prop='O'); m.set(5, 16, prop='h')
m.set(17, 4, prop='L'); m.set(23, 4, prop='L'); m.set(17, 23, prop='L'); m.set(23, 23, prop='L')
m.set(22, 14, prop='$')
m.set(35, 5, prop='K'); m.set(5, 22, prop='K'); m.set(35, 23, prop='K')
m.clear_props(18, 0, 5, 30)
m.clear_props(5, 13, 31, 3)
m.spot('entry', 20, 28)
m.spot('north', 20, 1)
m.spot('thornmaiden', 31, 9)
done(m, 'side_garden_gate')

# =====================================================================
# side_garden_maze — hedges of yew and briar; the white flowers grow thick
# =====================================================================
CW, CH = 13, 10        # maze cells
W, H = CW * 3 + 1 + 4, CH * 3 + 1 + 5     # 44 x 36
m = MapCanvas(W, H, ground=' ', height=0, seed=442)
OX, OY = 2, 2
m.rect(0, 0, W, H, ground='a', height=0)
m.rect(1, 1, W - 2, H - 2, ground=',', height=4)                  # all hedge to start
rng = m.rng
seen = set()
stack = [(6, 9)]
seen.add((6, 9))


def floor_cell(cx, cy):
    m.rect(OX + cx * 3 + 1, OY + cy * 3 + 1, 2, 2, ground='o', height=2)


floor_cell(6, 9)
while stack:
    cx, cy = stack[-1]
    nbrs = [(cx + dx, cy + dy, dx, dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
            if 0 <= cx + dx < CW and 0 <= cy + dy < CH and (cx + dx, cy + dy) not in seen]
    if not nbrs:
        stack.pop()
        continue
    nx, ny, dx, dy = rng.choice(nbrs)
    seen.add((nx, ny))
    floor_cell(nx, ny)
    # knock out the wall between
    wx = OX + cx * 3 + 1 + (2 if dx == 1 else -1 if dx == -1 else 0)
    wy = OY + cy * 3 + 1 + (2 if dy == 1 else -1 if dy == -1 else 0)
    if dx:
        m.rect(wx, wy, 1, 2, ground='o', height=2)
    else:
        m.rect(wx, wy, 2, 1, ground='o', height=2)
    stack.append((nx, ny))
# a few extra loops so it is a garden, not a trap
for (x, y, w, h) in [(9, 9, 1, 2), (30, 12, 1, 2), (15, 24, 2, 1), (27, 18, 1, 2), (6, 21, 2, 1), (36, 27, 2, 1)]:
    m.rect(OX + x, OY + y, w, h, ground='o', height=2)
# the centre court (the white flower) and the north court (Hearthstone)
m.rect(17, 14, 10, 7, ground='.', height=2)
m.rect(17, 2, 10, 4, ground='.', height=2)
m.rect(20, 0, 4, 3, ground='o', height=2)
m.rect(20, H - 3, 4, 3, ground='o', height=2)
m.rect(21, H - 6, 2, 4, ground='o', height=2)
m.rect(21, 5, 2, 3, ground='o', height=2)
# hedge tops: bushes and briars on the raised hedge
m.scatter(1, 1, W - 2, H - 2, ['b', 'b', 'B', 'b'], 0.55, on=',')
m.scatter(17, 14, 10, 7, ['f', 'f', 'g'], 0.35, on='.')
m.scatter(1, 1, W - 2, H - 2, ['f', 'g'], 0.08, on='o')
m.set(21, 16, prop='B')            # the white flower
m.set(18, 15, prop='t'); m.set(25, 19, prop='t')
m.set(24, 3, prop='$')
m.set(18, 3, prop='L'); m.set(26, 3, prop='L')
m.clear_props(20, 0, 4, 8)
m.clear_props(20, H - 6, 4, 6)
m.spot('entry', 21, H - 2)
m.spot('exit', 21, 0)
m.spot('white', 21, 16)
done(m, 'side_garden_maze')

# =====================================================================
# side_garden_heart — the Everbloom, and the ones who stayed to listen
# =====================================================================
W, H = 30, 26
m = MapCanvas(W, H, ground=' ', height=0, seed=443)
m.ellipse(15, 12, 14, 11.5, ground='a', height=0, jitter=0.2)
m.ellipse(15, 12, 12.5, 10, ground='.', height=2, jitter=0.2)
m.ellipse(15, 9, 5, 3.5, ground='w', height=1)                    # the mourning pool
m.ellipse(15, 8, 2.2, 1.6, ground='o', height=2)                  # the island
m.rect(14, 10, 3, 3, ground='=', height=2)                        # little bridge
m.rect(13, 21, 4, 5, ground='o', height=2)
m.path([(15, 24), (15, 13)], width=2, ground='o')
m.structure('beacon', 15, 7, lit=True, color='#f0e8ff')            # the Everbloom's glow
m.set(13, 7, prop='K'); m.set(17, 7, prop='K'); m.set(15, 6, prop='K')
m.scatter(3, 2, 24, 20, ['f', 'f', 'f', 'g'], 0.4, on='.')
for (x, y) in [(6, 7), (24, 7), (7, 15), (23, 15), (10, 19), (20, 19)]:
    m.set(x, y, prop='t')
m.clear_props(13, 12, 5, 14)
m.spot('entry', 15, 24)
m.spot('bloom', 15, 7)
done(m, 'side_garden_heart')
