"""Chapter 2 — Port Gale: the mainland harbor town, plus its interiors."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior

# ------------------------------------------------------------------ Port Gale (town)
m = MapCanvas(48, 36, ground='.', height=1, seed=21)

# Sea and the eastern beach
m.rect(0, 19, 48, 17, ground='~', height=0)
m.rect(37, 16, 11, 6, ground='s', height=1)
m.ellipse(43, 21, 6, 2.6, ground='s', height=1, jitter=0.3)
# Northern hills behind the town
m.rect(0, 0, 48, 3, ground=',', height=3)
m.ragged_edge('n', 2, ',', 3, var=1)
m.rect(0, 0, 48, 1, ground='#', height=5)
m.rect(0, 0, 1, 16, ground='#', height=4)
m.rect(47, 0, 1, 9, ground='#', height=4)
m.rect(47, 12, 1, 4, ground='#', height=4)

# Streets
m.rect(1, 16, 37, 3, ground=';')                 # the quay
m.rect(1, 18, 36, 1, ground='=')                 # wharf edge
m.rect(9, 19, 3, 9, ground='=')                  # the long pier (Tobias moors here)
m.rect(33, 19, 2, 5, ground='=')                 # harbormaster's pier
m.rect(1, 8, 46, 2, ground=':')                  # back lane
m.rect(18, 8, 13, 6, ground=';')                 # Lantern Square
m.rect(22, 14, 5, 2, ground=';')                 # main street down to the quay
m.rect(15, 10, 3, 6, ground=';')                 # Chandler's Row
m.rect(7, 10, 2, 6, ground=':')                  # Net Alley (the quiet way)
m.rect(1, 14, 21, 2, ground=';')                 # Low Street
m.rect(30, 9, 18, 3, ground=';')                 # east road / Coast Gate
m.rect(27, 12, 10, 4, ground=';')                # fish market

# Buildings
m.building(20, 3, 8, 5, wall='wall_timber', roof='roof_red', h=3.2, windows=[1, 2, 6],
           door={'dx': 4, 'to': 'c2_pg_inn', 'tx': 6, 'ty': 8, 'dir': 'up'})
m.building(2, 3, 5, 4, wall='wall_plaster', roof='roof_blue', windows=[0, 4],
           door={'dx': 2, 'locked': True, 'lockedText': 'Locked. Behind the door a baby is crying and a man is singing to it, badly.'})
m.building(9, 3, 6, 4, wall='wall_wood', roof='roof_green', windows=[0, 4],
           door={'dx': 2, 'locked': True, 'lockedText': 'Locked. The smell of burnt bread drifts from the window.'})
m.building(32, 3, 6, 5, wall='wall_stone', roof='roof_slate', h=3.4, windows=[1, 4],
           door={'dx': 3, 'locked': True, 'lockedText': 'The Dawn Shrine. A card in the door: CLOSED FOR EVENING PRAYER. (It is morning.)'})
m.building(40, 3, 5, 4, wall='wall_timber', roof='roof_thatch', windows=[3],
           door={'dx': 2, 'locked': True, 'lockedText': 'Locked. A cat flap has been nailed shut, with feeling.'})
m.building(2, 10, 5, 4, wall='wall_wood', roof='roof_blue', windows=[0, 4],
           door={'dx': 2, 'to': 'c2_pg_shop', 'tx': 4, 'ty': 5, 'dir': 'up', 'locked': True, 'unlockFlag': 'c2_stealth_done',
                 'lockedText': 'Shuttered. A notice: CLOSED BY ORDER OF THE DAWNGUARD UNTIL THE SEARCH IS CONCLUDED.'})
m.building(9, 10, 6, 4, wall='wall_stone', roof='roof_slate', windows=[1, 4],
           door={'dx': 3, 'locked': True, 'lockedText': 'Harbormaster\'s Office. A note on the door: GONE TO THE PIER. — Q.'})
m.building(34, 12, 5, 4, wall='wall_wood', roof='roof_slate', h=3.0, windows=[1],
           door={'dx': 2, 'locked': True, 'lockedText': 'GALE TRADING CO. — NO LOITERING. (This means you, Fitch.)'})
m.building(41, 14, 5, 3, wall='wall_plaster', roof='roof_thatch', windows=[1, 3],
           door={'dx': 2, 'to': 'c2_pg_odile', 'tx': 4, 'ty': 5, 'dir': 'up', 'locked': True, 'unlockFlag': 'c2_stealth_done',
                 'lockedText': 'No one answers. Through the window, a single oil lamp is burning.'})

# Lantern Square
m.set(24, 11, prop='Q')                          # fountain
m.set(20, 12, prop='$')                          # Hearthstone
m.set(27, 8, prop='s')                           # notice board
for (x, y) in [(18, 13), (30, 13), (29, 8), (13, 15), (2, 15), (21, 15), (27, 15), (36, 17), (31, 11), (45, 12), (11, 18)]:
    m.set(x, y, prop='L')
m.set(19, 15, prop='s')                          # quay sign
for (x, y) in [(18, 11), (30, 12)]:               # plane trees shading the square
    m.set(x, y, prop='T')
m.rect(1, 14, 6, 2, ground=':')                   # Low Street turns to packed dirt at the west end
m.set(26, 9, prop='B'); m.set(22, 9, prop='B')
# Fish market stalls
for x in (28, 31):
    m.set(x, 13, prop='='); m.set(x + 1, 13, prop='=')
m.set(28, 15, prop='O'); m.set(33, 15, prop='C'); m.set(33, 14, prop='k'); m.set(27, 12, prop='O')
# Crates & barrels along the quay (cover on the quiet side)
for (x, y) in [(2, 17), (3, 17), (5, 16), (6, 18)]:
    m.set(x, y, prop='C')
for (x, y) in [(1, 16), (4, 18), (14, 18), (26, 18), (35, 16), (37, 18)]:
    m.set(x, y, prop='O')
m.set(16, 17, prop='k'); m.set(25, 17, prop='k'); m.set(8, 13, prop='C'); m.set(8, 12, prop='O')
# Moored boats
for (x, y) in [(13, 23), (7, 25), (31, 21), (36, 22), (19, 21)]:
    m.set(x, y, prop='V')
# Back lane & gardens
for (x, y) in [(1, 7), (8, 7), (15, 7), (16, 7), (31, 7), (39, 7), (46, 7)]:
    m.set(x, y, prop='b')
m.rect(15, 3, 4, 1, prop='F')
m.set(16, 5, prop='W')                           # old well behind the inn
m.scatter(15, 4, 4, 3, ['f', 'g'], 0.4, on='.')
m.scatter(38, 4, 2, 4, ['f', 'B'], 0.5, on='.')
m.scatter(0, 0, 48, 3, ['P', 'T', 'P', 'b'], 0.3, on=',')
m.scatter(38, 16, 10, 7, ['o', 'Y'], 0.06, on='s')
m.set(46, 18, prop='Y'); m.set(39, 21, prop='R'); m.set(46, 21, prop='R')

m.spot('arrive', 10, 20)
m.spot('pier_head', 10, 18)
m.spot('inn_door', 24, 8)
m.write('port_gale')
m.preview()

# ------------------------------------------------------------------ The Salt & Lantern (inn)
m = interior(14, 10, wall='T', floor='=', seed=31)
for x in range(3, 8):
    m.set(x, 3, prop='=')                        # bar counter
m.set(1, 2, prop='O'); m.set(2, 2, prop='O'); m.set(1, 3, prop='C'); m.set(1, 6, prop='k')
m.set(9, 2, prop='H'); m.set(12, 2, prop='E'); m.set(11, 2, prop='^'); m.set(4, 2, prop='^')
for (x, y) in [(4, 6), (9, 6), (11, 4)]:
    m.set(x, y, prop='='); m.set(x - 1, y, prop='j'); m.set(x + 1, y, prop='j')
m.set(12, 7, prop='O'); m.set(1, 8, prop='u')
m.rect(6, 9, 2, 1, ground='x')
m.spot('entry', 6, 8); m.spot('mags', 5, 2); m.spot('kitchen', 2, 5)
m.write('c2_pg_inn')

# ------------------------------------------------------------------ Harborside Outfitters
m = interior(10, 7, wall='W', floor='=', seed=32)
m.set(1, 2, prop='H'); m.set(2, 2, prop='a'); m.set(7, 2, prop='H'); m.set(8, 2, prop='O')
m.set(3, 3, prop='='); m.set(4, 3, prop='='); m.set(5, 3, prop='=')
m.set(1, 5, prop='C'); m.set(8, 5, prop='k'); m.set(8, 4, prop='C')
m.spot('entry', 4, 5); m.spot('keeper', 4, 2)
m.write('c2_pg_shop')

# ------------------------------------------------------------------ Odile's cottage
m = interior(9, 7, wall='P', floor='+', seed=33)
m.set(1, 2, prop='E'); m.set(7, 2, prop='^'); m.set(6, 2, prop='='); m.set(3, 2, prop='H')
m.set(4, 4, prop='='); m.set(5, 4, prop='j'); m.set(1, 5, prop='O'); m.set(7, 5, prop='k')
m.spot('entry', 4, 5); m.spot('odile', 6, 3)
m.write('c2_pg_odile')
