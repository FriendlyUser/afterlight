"""Thornwood — the oldest forest in Verdance, withering around Elowen's Lantern.
Trails wind between dead and dying trees; thorn walls bar the deeper glades."""
from ch11_kit import MapCanvas, mooring

m = MapCanvas(40, 46, ground='k', height=1, seed=511)
m.rect(0, 0, 40, 46, prop='T')                              # the wood, everywhere
m.rect(0, 42, 40, 4, ground=' ', height=0, prop=' ')
m.rect(0, 41, 40, 1, ground=' ', height=0, prop=' ')


def clearing(cx, cy, rx, ry, ground='k', height=1):
    m.ellipse(cx, cy, rx, ry, ground=ground, height=height, prop=' ', jitter=0.2)


def trail(points, width=2):
    for (a, b) in zip(points, points[1:]):
        m.line(a[0], a[1], b[0], b[1], width, ':', 1, ' ')


clearing(20, 37, 6, 3.5)                                    # the landing glade
clearing(8, 29, 4.5, 3.5, 'q')                              # Elowen's shrine
clearing(31, 28, 4.5, 3.5)                                  # the fairy ring
clearing(20, 23, 5, 3.5, 'q')                               # the hollow oak
clearing(6, 12, 3.5, 3)                                     # the root hollow
clearing(33, 12, 4, 3.5)                                    # the old grove
clearing(20, 7, 8, 5, ',', 2)                               # the sanctum

trail([(20, 40), (20, 34), (14, 31), (11, 29)])
trail([(20, 34), (25, 30), (29, 28)])
trail([(20, 33), (20, 26)])
trail([(20, 20), (20, 12)])
trail([(16, 21), (9, 16), (7, 13)])
trail([(24, 21), (29, 16), (32, 13)])
m.ramp(19, 13, 2, 'n', 1, 2, width=2, ground=':')

# Withering: dead grass and dead trees creep in from the north.
for y in range(0, 41):
    for x in range(40):
        if m.p[y][x] == 'T' and m.rng.random() < 0.55 - y * 0.011:
            m.p[y][x] = 'D'
        if m.g[y][x] == 'k' and m.rng.random() < 0.4 - y * 0.008:
            m.g[y][x] = 'q'
m.scatter(0, 0, 40, 41, ['f', 'm', 'G', 'g', 'B'], 0.08, on='kq,')
m.scatter(0, 0, 40, 41, ['m', 'G'], 0.08, on=':')

# --- sanctum
m.structure('lantern', 20, 4, lit=False)
m.clear_props(14, 5, 13, 8)
for (x, y) in [(14, 6), (26, 6)]:
    m.set(x, y, prop='K')                                   # two cherry trees, still blooming
m.spot('save', 17, 10); m.set(17, 10, prop='$')
m.spot('boss', 20, 7); m.spot('boss_stand', 20, 9)

# --- the Ember shrine and thorn walls
m.spot('shrine', 7, 28); m.set(7, 28, prop='S')
m.spot('thorn_a', 19, 17)                                   # 2-wide on the north trail
m.spot('thorn_b', 25, 18)                                   # 3-wide on the grove trail
m.spot('hollow', 5, 10)                                     # the root hollow (to the Gloam Rift)
m.set(4, 10, prop='Z'); m.set(6, 9, prop='Z')

# --- story & secrets
m.spot('oak', 20, 22); m.set(20, 22, prop='T')
m.spot('ring', 31, 28)
for (x, y) in [(29, 27), (33, 27), (29, 29), (33, 29), (31, 26), (31, 30)]:
    m.set(x, y, prop='G')
for name, (x, y) in {
    'c_landing': (15, 37), 'c_shrine': (10, 31), 'c_ring': (34, 28), 'c_oak': (23, 24),
    'c_hollow': (8, 13), 'c_grove1': (35, 11), 'c_grove2': (31, 14), 'c_sanct': (25, 5),
}.items():
    m.spot(name, x, y)
m.spot('star', 33, 10)
mooring(m, 19, 41, length=5, height=1)
m.spot('arrival', 20, 37)
m.write('c11_thornwood')
m.preview()
