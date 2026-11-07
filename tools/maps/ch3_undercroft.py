"""The Undercroft beneath Aurenne (Chapter 3), three floors:
  B1 c3_uc_sewers  — walkways and channels; two valves open the sluice gates.
  B2 c3_uc_ossuary — the old catacombs: Long Night memorial, the bell foundry
                     (mid-boss) and the sealed Bell Vault (bell-order puzzle).
  B3 c3_uc_lab     — Sister Mercy's laboratory: cells, the operating theatre,
                     and the Crucible (boss).
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas


def props(m, items):
    for (x, y, p) in items:
        m.set(x, y, prop=p)


# Low-wall chars (defined in each map's `legend`): walls within a few rows south
# of a walkable tile are lowered to a lip so they never hide the party.
LOW = {'S': '6', 'U': '7', 'R': '8', 'B': '9'}


def lower_front_walls(m, depth=3):
    for y in range(m.h):
        for x in range(m.w):
            ch = m.g[y][x]
            if ch not in LOW:
                continue
            for k in range(1, depth + 1):
                if y - k < 0:
                    break
                above = m.g[y - k][x]
                if above not in LOW and above not in LOW.values():
                    m.g[y][x] = LOW[ch]
                    m.p[y][x] = ' '
                    break


# =============================================================== B1 — the sewers
m = MapCanvas(44, 30, ground='B', height=2, seed=311)
W = '_'
m.rect(0, 11, 44, 3, ground=W, height=1)          # north walkway (full length)
m.rect(1, 11, 4, 7, ground=W, height=1)           # west landing
m.rect(5, 14, 36, 2, ground='~', height=0)        # the channel
m.rect(5, 16, 36, 2, ground=W, height=1)          # south walkway
m.rect(40, 11, 4, 7, ground=W, height=1)          # east landing
m.rect(41, 14, 3, 2, ground=W, height=1)
m.rect(12, 16, 5, 2, ground='p', height=0)        # a wading stretch
for bx in (9, 24, 36):
    m.rect(bx, 14, 2, 2, ground='=', height=1)    # footbridges
# North branch -> valve room A
m.rect(14, 5, 2, 6, ground=W, height=1)
m.rect(9, 2, 12, 4, ground=W, height=1)
# South branch -> valve room B
m.rect(19, 18, 2, 6, ground=W, height=1)
m.rect(13, 23, 14, 5, ground=W, height=1)
m.ellipse(20, 25.5, 3.2, 1.4, ground='p', height=0)
# Secret cache behind cracked brickwork (blocker at 27,10)
m.rect(27, 10, 1, 1, ground=W, height=1)
m.rect(25, 6, 5, 4, ground=W, height=1)
# East side room (past the sluice)
m.rect(37, 8, 2, 3, ground=W, height=1)
m.rect(34, 4, 8, 4, ground=W, height=1)
m.rect(0, 11, 1, 3, ground=W, height=1)           # way back up
props(m, [
    (19, 2, '|'), (10, 2, 'O'), (11, 2, 'O'), (9, 5, 'C'), (17, 5, '^'), (12, 2, '^'),
    (25, 23, '|'), (14, 23, '^'), (26, 27, 'O'), (13, 27, 'k'),
    (6, 11, '^'), (18, 11, '^'), (30, 11, '^'), (42, 11, '^'), (22, 17, '^'), (34, 17, '^'),
    (25, 6, 'k'), (29, 9, 'x'), (35, 4, '^'), (41, 7, 'C'), (2, 17, 'O'), (40, 17, 'O'),
])
m.scatter(0, 0, 44, 30, ['x', 'd', 'o'], 0.05, on='_')
m.spot('entry', 1, 12); m.spot('valve_a', 19, 2); m.spot('valve_b', 25, 23); m.spot('crack', 27, 10)
m.spot('stairs', 43, 12)
lower_front_walls(m)
m.write('c3_uc_sewers')
m.preview()
print()

# =============================================================== B2 — the ossuary
m = MapCanvas(46, 34, ground='R', height=2, seed=313)
F = 'r'
m.rect(0, 15, 9, 3, ground=F, height=1)           # entry passage
m.rect(9, 11, 11, 11, ground=F, height=1)         # the Charnel Crossing (hub)
m.rect(12, 8, 3, 3, ground=F, height=1)           # north stair to the memorial hall
m.rect(6, 2, 20, 6, ground='_', height=1)         # the Long Night memorial
m.rect(20, 15, 8, 3, ground=F, height=1)          # passage east
m.rect(28, 9, 14, 15, ground='c', height=1)       # the bell foundry
m.ellipse(35, 16, 4.5, 3.2, ground='_', height=1)
m.rect(37, 24, 2, 4, ground=F, height=1)          # down toward the stair
m.rect(35, 28, 11, 4, ground=F, height=1)         # stair landing
m.rect(13, 22, 3, 3, ground=F, height=1)          # south passage
m.rect(5, 25, 18, 6, ground='_', height=1)        # the Bell Vault antechamber
m.rect(1, 26, 3, 4, ground='X', height=1)         # the vault itself
m.rect(4, 27, 1, 2, ground='_', height=1)         # its door (blocker)
for x in (8, 10, 12, 18, 20, 22):
    for y in (4, 6):
        m.set(x, y, prop='t')
props(m, [
    (16, 2, 'S'), (15, 2, '^'), (17, 2, '^'), (7, 2, '^'), (24, 2, '^'),
    (10, 12, '|'), (18, 12, '|'), (10, 20, '|'), (18, 20, '|'), (17, 13, '$'),
    (29, 10, 'a'), (40, 22, 'u'), (29, 22, 'u'), (35, 11, 'S'), (32, 10, '^'), (38, 10, '^'), (33, 20, '!'),
    (8, 26, '|'), (13, 26, '|'), (18, 26, '|'), (5, 25, '^'), (22, 25, '^'), (1, 26, '^'),
    (36, 28, '^'), (44, 28, '^'), (9, 21, 'O'),
])
m.scatter(0, 0, 46, 34, ['x', 'x', 'd'], 0.09, on='r_c')
m.clear_props(28, 14, 2, 5)
m.spot('entry', 1, 16); m.spot('memorial', 16, 2); m.spot('wight', 35, 15)
m.spot('bell_high', 8, 26); m.spot('bell_low', 13, 26); m.spot('bell_mid', 18, 26); m.spot('vault_door', 4, 27)
m.spot('stairs', 45, 29)
lower_front_walls(m)
m.write('c3_uc_ossuary')
m.preview()
print()

# =============================================================== B3 — the laboratory
m = MapCanvas(40, 32, ground='U', height=2, seed=317)
m.rect(0, 4, 9, 3, ground='_', height=1)          # entry passage
m.rect(9, 5, 30, 3, ground='_', height=1)         # cell row walkway
for cx in (10, 15, 20, 25):
    m.rect(cx, 2, 4, 3, ground='_', height=1)     # the cells
    for x in range(cx, cx + 4):
        m.set(x, 4, prop='F')
m.rect(31, 2, 7, 3, ground='u', height=1)         # the children's pen
for x in range(31, 38):
    m.set(x, 4, prop='F')
m.rect(19, 8, 2, 4, ground='_', height=1)
m.rect(5, 12, 20, 7, ground='_', height=1)        # the operating theatre
m.ellipse(14, 15, 4, 2, ground='u', height=1, jitter=0.3)
m.rect(25, 14, 4, 2, ground='_', height=1)
m.rect(29, 11, 9, 9, ground='_', height=1)        # stores
m.rect(19, 19, 9, 4, ground='_', height=1)        # antechamber (Hearthstone)
m.rect(13, 23, 23, 7, ground='u', height=1)       # the Crucible
m.ellipse(24, 26, 6, 2.5, ground='_', height=1)
props(m, [
    (6, 13, 'H'), (7, 13, 'H'), (10, 14, 'E'), (13, 13, 'E'), (16, 13, 'E'), (19, 14, 'E'),
    (6, 17, 'u'), (23, 13, '='), (22, 13, '='), (23, 17, '%'), (5, 16, '^'),
    (30, 12, 'C'), (31, 12, 'C'), (37, 12, 'O'), (34, 16, 'k'), (30, 19, 'O'), (37, 18, '%'),
    (23, 20, '$'), (19, 20, '^'), (27, 20, '^'),
    (24, 24, 'u'), (20, 24, '%'), (28, 24, '%'), (15, 28, '%'), (34, 28, '%'), (17, 24, '^'), (31, 24, '^'),
    (2, 5, '^'), (9, 6, '%'), (38, 6, '%'),
])
m.scatter(9, 5, 30, 3, ['x', 'd'], 0.08, on='_')
m.spot('entry', 1, 5); m.spot('mercy', 24, 25); m.spot('crucible', 24, 24)
m.spot('rowan', 11, 3); m.spot('nell', 33, 3); m.spot('tuck', 35, 3); m.spot('wick', 34, 2)
lower_front_walls(m)
m.write('c3_uc_lab')
m.preview()
