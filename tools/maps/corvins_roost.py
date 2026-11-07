"""Corvin's Roost — a smugglers' slot canyon in a fallen mountain (Ch9 hub).

The grounded Halcyon fills the northern basin. The town clings to the canyon
walls; the Lip (west) is where the Toll Barge and Corvin's skiff are moored over
the abyss; the Boneyard lift is on the east wall; the canyon mouth opens south.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 46, 38
m = MapCanvas(W, H, ground='#', height=8, seed=909)

# --- canyon floor (union of ellipses so the walls wander)
m.ellipse(23, 9, 15, 7.5, ground='a', height=1, jitter=0.25)       # Halcyon basin
m.ellipse(22, 20, 13, 8, ground='a', height=1, jitter=0.25)        # town
m.ellipse(20, 29, 9, 6, ground='a', height=1, jitter=0.25)         # south bend
m.rect(11, 30, 8, 8, ground='a', height=1)                         # canyon mouth
m.ragged_edge('s', 1, '#', 8, var=1)
m.rect(12, 33, 6, 5, ground=':', height=1)                         # mouth road
# The Lip (west ledge over the abyss)
m.rect(3, 16, 9, 9, ground='d', height=1)
m.rect(0, 14, 3, 13, ground=' ', height=0)
m.rect(3, 14, 2, 1, ground=' ', height=0)
m.rect(3, 25, 2, 2, ground=' ', height=0)
m.rect(1, 17, 4, 2, ground='=', height=1)     # barge pier
m.rect(1, 22, 4, 2, ground='=', height=1)     # skiff pier
# Boneyard lift platform (east)
m.rect(34, 19, 9, 5, ground='a', height=1)
m.rect(39, 20, 4, 3, ground='=', height=1)

# --- the Halcyon, grounded (bow east). Deck height 4, hull flank height 3.
deck = [(15, 5, 16), (14, 6, 19), (13, 7, 21), (14, 8, 19), (15, 9, 16)]
for (x0, y, w) in deck:
    m.rect(x0, y, w, 1, ground='=', height=4)
m.rect(13, 10, 19, 1, ground='d', height=1)          # ash drifted against the keel
m.ramp(26, 13, 4, 'n', 1, 4, width=2, ground='=')    # gangplank up to the deck
# Aft cabin (wheelhouse)
m.building(15, 5, 4, 3, wall='wall_wood', roof='roof_red', h=2.2, windows=[1, 2])
# Masts, rigging, cargo
for (x, y, p) in [(21, 7, '|'), (28, 7, '|'), (21, 6, 'q'), (28, 6, 'q'), (32, 7, '!'),
                  (23, 5, 'O'), (24, 5, 'C'), (19, 9, 'k'), (30, 9, 'O'), (25, 8, 'd'), (31, 6, 'd'),
                  (33, 8, 'd'), (17, 9, 'L'), (30, 5, 'L')]:
    m.set(x, y, prop=p)

# --- town buildings
m.rect(8, 11, 8, 6, ground='a', height=1)
m.building(9, 12, 6, 4, wall='wall_wood', roof='roof_slate', h=2.8,
           door={'dx': 3, 'to': 'c9_last_call', 'tx': 6, 'ty': 8, 'dir': 'up'}, windows=[0, 1, 5])
m.building(30, 12, 6, 4, wall='wall_stone', roof='roof_slate', h=3.2,
           door={'dx': 3, 'to': 'c9_ledger_house', 'tx': 5, 'ty': 7, 'dir': 'up'}, windows=[0, 1, 4, 5])
m.building(24, 26, 4, 3, wall='wall_wood', roof='roof_thatch', h=2.3, windows=[0, 3])     # Ox's workshop
m.building(18, 29, 3, 2, wall='wall_ruin', roof='roof_slate', h=2.2, windows=[1])           # Hesper's shack
m.structure('tent', 20, 17, color='#a85a3a')      # the Exchange stall awning

# --- roads
m.path([(15, 32), (16, 26), (20, 22), (24, 18), (26, 14)], width=2, ground=':', height=1)
m.path([(12, 16), (12, 19), (16, 20), (20, 21)], width=2, ground=':', height=1)
m.path([(33, 16), (31, 19), (26, 20)], width=2, ground=':', height=1)
m.path([(28, 21), (36, 21), (39, 21)], width=2, ground=':', height=1)
m.path([(4, 20), (9, 20), (12, 19)], width=2, ground=':', height=1)

# --- props
m.set(19, 22, prop='$')                                  # Hearthstone
m.set(28, 17, prop='u')                                  # Marta's stew-pot
m.set(21, 18, prop='=')                                  # Exchange counter
m.set(22, 18, prop='C'); m.set(19, 18, prop='O')
for (x, y) in [(15, 17), (25, 16), (29, 18), (17, 25), (23, 25), (8, 22), (35, 22), (14, 30)]:
    m.set(x, y, prop='L')
for (x, y) in [(9, 16), (15, 16), (30, 16), (36, 16), (38, 20), (38, 23)]:
    m.set(x, y, prop='^')
m.set(26, 24, prop='F'); m.set(28, 24, prop='F')         # the stocks
m.set(23, 29, prop='a'); m.set(28, 27, prop='C'); m.set(28, 28, prop='O')   # Ox's anvil
m.set(41, 19, prop='a'); m.set(42, 23, prop='O')         # lift winch
m.set(5, 16, prop='O'); m.set(6, 16, prop='C'); m.set(4, 24, prop='k'); m.set(7, 24, prop='=')   # Wick's chart table
m.set(2, 17, prop='V')                                   # the Toll Barge (the skiff is a map blocker)
m.set(23, 13, prop='@')                                  # kids' fire by the gangplank
for (x, y) in [(13, 21), (24, 22), (30, 23), (18, 27), (11, 23), (36, 18)]:
    m.set(x, y, prop='q')
m.scatter(6, 3, 34, 32, ['d', 'o', 'x', 'd'], 0.05, on='a')
m.scatter(3, 16, 9, 9, ['o', 'd'], 0.08, on='d')
m.scatter(0, 0, W, H, ['R', 'D'], 0.015, on='a')
m.clear_props(9, 19, 3, 3)
m.clear_props(25, 11, 4, 4)
# NPC standing spots (see src/data/maps/ch9_roost.js)
NPCS = [(21, 19), (29, 8), (24, 15), (21, 13), (22, 14), (5, 18), (7, 23), (22, 28), (17, 30), (17, 22),
        (27, 24), (32, 17), (29, 17), (14, 27), (15, 28), (12, 17), (33, 16), (40, 21), (5, 22), (6, 20)]
for (x, y) in NPCS:
    m.set(x, y, prop=' ')

# Weathered canyon walls: vary the rock heights so the cliffs read as stone; walls with
# open floor just north of them stay low so they never hide the party from the camera.
for y in range(H):
    for x in range(W):
        if m.g[y][x] == '#' and any(m.g[y - k][x] not in '# ' for k in range(1, 6) if y - k >= 0):
            m.hg[y][x] = m.rng.choice([2, 2, 3])
        elif m.g[y][x] == '#':
            m.hg[y][x] = m.rng.choice([7, 8, 8, 9, 10])

# --- spots
m.spot('entry', 10, 20)
m.spot('corvin_ramp', 26, 14)
m.spot('mags', 29, 8)
m.spot('skiff', 2, 23)
m.spot('barge', 2, 19)
m.spot('lift', 41, 21)
m.spot('mouth', 14, 36)
m.write('corvins_roost')
m.preview()
