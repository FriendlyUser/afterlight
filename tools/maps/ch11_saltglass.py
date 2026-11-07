"""Saltglass — the Glass Steps. The Sunscar dunes broke into a stair of floating
glass mesas climbing north to the dead Lantern of Keeper Tamsin."""
from ch11_kit import sky, island, bridge, mooring

m = sky(40, 46, seed=211)

# --- islands (south to north, rising)
island(m, 20, 38, 8, 4.2, 's', 1)                      # landing
island(m, 6, 40, 3, 2.2, 's', 1, jitter=0.1)            # west islet
island(m, 11, 30, 7, 4, 's', 2)                         # mesa A (west)
island(m, 30, 30, 7, 4, 's', 2)                         # mesa B (east)
island(m, 20, 21, 9, 5, 'g', 3)                         # the Bell Garden
island(m, 5, 17, 4.5, 4, 's', 3)                        # west wing
island(m, 35, 16, 4.5, 4.5, 's', 3)                     # east wing (caravan wreck)
island(m, 20, 7, 11, 6, 'g', 4)                         # the sanctum
m.ellipse(20, 6, 5, 3, ground='M', height=4)            # Lantern court

# --- bridges
mooring(m, 19, 41, length=5, height=1)
bridge(m, [(12, 38), (8, 39)], 1)                       # landing -> west islet
bridge(m, [(15, 35), (13, 33)], 2)                      # landing -> mesa A
bridge(m, [(25, 35), (28, 33)], 2)                      # landing -> mesa B
bridge(m, [(14, 27), (16, 24)], 3)                      # mesa A -> garden
bridge(m, [(27, 27), (24, 24)], 3)                      # mesa B -> garden
bridge(m, [(12, 20), (8, 18)], 3)                       # garden -> west wing
bridge(m, [(28, 19), (31, 17)], 3)                      # garden -> east wing
bridge(m, [(20, 16), (20, 12)], 4, width=3)             # garden -> sanctum (sealed)

# --- glass-dune texture
m.scatter(0, 0, 40, 46, ['g'], 0.0)
for (cx, cy) in [(9, 31), (31, 29), (35, 15), (5, 18)]:
    m.ellipse(cx, cy, 2.2, 1.4, ground='g')
m.scatter(1, 22, 38, 22, ['c', 'R', 'o', 'x'], 0.06, on='s')
m.scatter(1, 2, 38, 20, ['c', 'o', 'x', '*'], 0.05, on='sg')

# --- the Bell Garden: three glass bells and the hymn stone
m.clear_props(12, 17, 17, 9)
m.spot('bell_evening', 15, 21); m.set(15, 21, prop='*')
m.spot('bell_noon', 20, 18); m.set(20, 18, prop='*')
m.spot('bell_morning', 25, 21); m.set(25, 21, prop='*')
m.set(20, 24, prop='s')                                  # the hymn stone
m.spot('hymn', 20, 24)
m.set(20, 24, prop='s')
for (x, y) in [(13, 19), (27, 19), (13, 23), (27, 23)]:
    m.set(x, y, prop='|')
m.spot('glass_wall', 19, 15)                             # 3-wide blocker on the bridge

# --- the sanctum
m.clear_props(9, 1, 23, 12)
m.structure('lantern', 20, 3, lit=False)
for (x, y) in [(15, 5), (25, 5), (14, 8), (26, 8)]:
    m.set(x, y, prop='!')
m.set(17, 10, prop='$')
m.spot('save', 17, 10)
m.set(17, 10, prop='$')
m.spot('boss', 20, 6)
m.spot('boss_stand', 20, 8)

# --- caravan wreck (east wing)
m.structure('tent', 36, 14, color='#b08a5a')
m.set(34, 13, prop='O'); m.set(38, 16, prop='C'); m.set(33, 18, prop='k')
m.spot('caravan_log', 35, 17)

# --- chests & secrets
m.spot('c_islet', 5, 40)
m.spot('c_mesa_a1', 8, 29)
m.spot('c_mesa_a2', 13, 32)
m.spot('c_mesa_b', 33, 31)
m.spot('c_west1', 3, 16)
m.spot('c_west2', 6, 19)
m.spot('c_east', 37, 18)
m.spot('c_sanctum', 25, 3)
m.spot('star', 2, 18)                                    # Starfall fragment (west wing tip)
m.spot('skeleton', 31, 28)
m.set(30, 28, prop='x')
m.spot('arrival', 20, 38)
m.write('c11_saltglass')
m.preview()
