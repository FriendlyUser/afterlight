"""Skyreach — Stormcrown's shattered aerie, Ardent Vasha's Lantern at its crown.
Marble platforms and airship wrecks hang in a storm that never ends."""
from ch11_kit import sky, island, bridge, mooring

m = sky(40, 46, seed=611)
island(m, 20, 38, 7, 3.4, '_', 1)                          # P1 landing
island(m, 8, 30, 5, 3.6, 'M', 2)                           # P2 west tower
island(m, 32, 30, 5, 3.6, 'M', 2)                          # P3 east tower
island(m, 20, 23, 7, 3.8, '_', 3)                          # P4 the hub
island(m, 33, 15, 6, 3.8, '=', 3, jitter=0.4)               # P5 the airship graveyard
island(m, 7, 15, 5, 3.6, 'M', 3)                           # P6 west aerie
island(m, 20, 6, 10, 4.6, 'M', 4)                          # P7 the crown
m.ellipse(20, 6, 6, 3, ground='X', height=4)               # Vasha's blue carpet, faded

mooring(m, 19, 41, length=5, height=1)
bridge(m, [(14, 37), (10, 33)], 2, width=2)
bridge(m, [(26, 37), (30, 33)], 2, width=2)
bridge(m, [(12, 28), (15, 25)], 3, width=2)
bridge(m, [(28, 28), (25, 25)], 3, width=2)
bridge(m, [(26, 21), (29, 18)], 3, width=2)
bridge(m, [(14, 21), (10, 18)], 3, width=2)
bridge(m, [(20, 19), (20, 11)], 4, width=3)

# --- props: shattered colonnades, wreckage, storm crystals
m.scatter(0, 0, 40, 46, ['!', 'o', 'd', 'R'], 0.06, on='M_')
for (x, y, p) in [(36, 13, 'V'), (30, 13, 'V'), (35, 17, 'O'), (37, 17, 'C'), (29, 15, 'd'), (33, 12, 'q'),
                  (32, 17, 'd'), (38, 14, 'O'), (30, 11, 'C')]:
    m.set(x, y, prop=p)
for pts in [(17, 34, 6, 6), (17, 20, 7, 6), (14, 2, 13, 9), (18, 10, 5, 10)]:
    m.clear_props(*pts)

# --- puzzle: three lightning rods ground the storm-ward
m.spot('rod_w', 7, 29); m.set(7, 29, prop='|')
m.spot('rod_e', 33, 29); m.set(33, 29, prop='|')
m.spot('rod_n', 6, 14); m.set(6, 14, prop='|')
m.spot('ward', 19, 16)                                     # 3-wide blocker on the crown bridge
m.set(18, 22, prop='S'); m.set(22, 22, prop='S')           # Vasha's storm-riders, in stone

# --- crown
m.structure('lantern', 20, 3, lit=False)
m.spot('save', 16, 9); m.set(16, 9, prop='$')
m.spot('boss', 20, 6); m.spot('boss_stand', 20, 8)
for (x, y) in [(13, 5), (27, 5), (14, 8), (26, 8)]:
    m.set(x, y, prop='|')

# --- story & secrets
m.spot('flagship', 34, 13)
m.spot('vasha_log', 31, 16)
for name, (x, y) in {
    'c_landing': (24, 39), 'c_west': (5, 31), 'c_east': (35, 31), 'c_hub': (25, 23),
    'c_wreck1': (37, 15), 'c_wreck2': (31, 18), 'c_aerie': (4, 16), 'c_crown': (26, 3),
}.items():
    m.spot(name, x, y)
m.spot('star', 9, 12)
m.spot('arrival', 20, 38)
m.write('c11_skyreach')
m.preview()
