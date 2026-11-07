"""Frosthollow — the broken monastery on the Greyspine, climbing in four
frozen terraces to Brother Halvard's dead Lantern."""
from ch11_kit import MapCanvas, mooring

m = MapCanvas(40, 46, ground='#', height=9, seed=311)
m.rect(0, 42, 40, 4, ground=' ', height=0)                 # the mountain's broken foot

# --- terraces (south -> north)
m.rect(5, 34, 30, 8, ground='*', height=1)                 # T1: the gate yard
m.ragged_edge('s', 1, ' ', 0, var=0)
m.rect(3, 22, 34, 10, ground='*', height=3)                # T2: the cloister
m.rect(5, 12, 30, 9, ground='*', height=5)                 # T3: the frozen lake
m.rect(11, 2, 18, 9, ground='*', height=7)                 # T4: the peak
for (x, y, w, h, hh) in [(5, 34, 30, 8, 1), (3, 22, 34, 10, 3), (5, 12, 30, 9, 5), (11, 2, 18, 9, 7)]:
    # crumble the terrace corners so they read as natural ledges
    for (cx, cy) in [(x, y), (x + w - 1, y), (x, y + h - 1), (x + w - 1, y + h - 1)]:
        m.set(cx, cy, ground='#', height=hh + 4)
m.rect(5, 40, 30, 2, ground='*', height=1)
m.rect(4, 41, 32, 1, ground=' ', height=0)
m.rect(0, 41, 40, 1, ground=' ', height=0)

# --- ramps between terraces
m.ramp(19, 33, 3, 'n', 1, 3, width=3, ground='_')
m.ramp(19, 22, 3, 'n', 3, 5, width=2, ground='_')
m.ramp(19, 12, 3, 'n', 5, 7, width=2, ground='_')

# --- the frozen lake and its islet
m.ellipse(20, 16, 9, 3.4, ground='i', height=5)
m.ellipse(9, 15, 2.2, 1.6, ground='*', height=5)
m.set(9, 15, prop=' ')

# --- monastery: cloister halls against the cliff, the gatehouse arch
m.building(6, 22, 7, 3, wall='wall_stone', roof='roof_slate', h=3.0, windows=[1, 5])
m.building(27, 22, 7, 3, wall='wall_stone', roof='roof_slate', h=3.0, windows=[1, 5])
m.building(13, 2, 4, 3, wall='wall_stone', roof='roof_slate', h=2.4, windows=[1])
m.structure('arch', 18, 37, w=4, tex='wall_stone')
m.structure('lantern', 22, 4, lit=False)

# --- decoration
m.scatter(0, 0, 40, 42, ['P', 'P', 'R', 'o'], 0.07, on='*')
for (x, y) in [(15, 27), (24, 27), (15, 30), (24, 30)]:
    m.set(x, y, prop='S')                                   # kneeling monk statues
m.set(10, 37, prop='R'); m.set(11, 38, prop='R'); m.set(28, 35, prop='R'); m.set(29, 36, prop='o')
m.clear_props(17, 31, 6, 4)
m.clear_props(17, 20, 6, 3)
m.clear_props(17, 9, 6, 4)
m.clear_props(14, 4, 13, 7)
for (x, y) in [(15, 6), (27, 6)]:
    m.set(x, y, prop='^')

# --- puzzle: two braziers, two ice walls
m.spot('brazier_w', 4, 27); m.set(4, 27, prop='u')
m.spot('brazier_e', 33, 14); m.set(33, 14, prop='u')
m.spot('ice_a', 19, 21)                                     # 2-wide blocker on ramp T2->T3
m.spot('ice_b', 19, 11)                                     # 2-wide blocker on ramp T3->T4
m.spot('golem', 31, 15)
m.clear_props(28, 12, 7, 7)

# --- story points
m.spot('cairn', 31, 38); m.set(31, 38, prop='t')
m.spot('cell_note', 9, 25)
m.spot('bell', 23, 36); m.set(23, 36, prop='!')
m.spot('save', 17, 8); m.set(17, 8, prop='$')
m.spot('boss', 22, 6)
m.spot('boss_stand', 22, 8)

# --- chests & secrets
for name, (x, y) in {
    'c_yard_w': (6, 36), 'c_yard_e': (33, 39), 'c_cloister_w': (4, 30), 'c_cloister_e': (35, 29),
    'c_lake_w': (7, 13), 'c_lake_e': (33, 18), 'c_peak': (27, 3), 'c_hall': (20, 25),
}.items():
    m.spot(name, x, y)
m.spot('star', 9, 15)
mooring(m, 19, 41, length=5, height=1)
m.spot('arrival', 20, 38)
m.write('c11_frosthollow')
m.preview()
