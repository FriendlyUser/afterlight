"""The Grand Lantern of Aurenne — the Cathedral of Dawn, roofless, still held by
the Dawnguard. Writes c11_grand_nave (plaza + nave) and c11_grand_gallery
(the lamp gallery at the top of the tower, where Garrick waits)."""
from ch11_kit import sky, interior, mooring

m = sky(40, 46, seed=711)
# --- the plaza: a shelf of the old city, ash and cobbles
m.ellipse(20, 33, 18, 9, ground='a', height=1, jitter=0.3)
m.rect(3, 27, 34, 13, ground='a', height=1)
m.path([(20, 40), (20, 27)], width=4, ground=';', height=1)
m.path([(8, 34), (32, 34)], width=2, ground=';', height=1)
m.building(4, 28, 5, 3, wall='wall_ruin', roof='roof_slate', h=2.0, windows=[1])
m.building(31, 28, 5, 3, wall='wall_ruin', roof='roof_slate', h=2.0, windows=[3])
m.building(5, 35, 4, 2, wall='wall_ruin', roof='roof_red', h=1.8)
m.building(31, 35, 4, 2, wall='wall_ruin', roof='roof_red', h=1.8)
m.scatter(2, 26, 36, 15, ['d', 'd', 'R', 'D', '!', 'o'], 0.08, on='a')
m.set(16, 30, prop='Q')                                    # the Bellwright fountain, dry
m.set(24, 31, prop='S')                                    # statue of the first Hierophant

# --- the cathedral: nave (north-south) and two transepts
m.rect(6, 2, 28, 24, ground='K', height=2)                 # outer shell
m.rect(14, 3, 12, 22, ground='M', height=2)                # nave floor
m.rect(7, 8, 7, 9, ground='M', height=2)                   # west transept (barracks)
m.rect(26, 8, 7, 9, ground='M', height=2)                  # east transept (archive)
m.rect(13, 11, 1, 3, ground='M', height=2)                 # transept arches
m.rect(26, 11, 1, 3, ground='M', height=2)
m.rect(6, 25, 28, 1, ground='a', height=1)                 # south wall: blown out
m.rect(14, 24, 12, 2, ground='M', height=2)
m.rect(6, 17, 28, 8, ground='K', height=2)
m.rect(14, 17, 12, 8, ground='M', height=2)
m.ramp(17, 26, 1, 'n', 1, 1, width=6, ground=';')
for x in (6, 7, 8, 9, 10, 11, 12, 13, 26, 27, 28, 29, 30, 31, 32, 33):
    m.set(x, 25, ground='R', height=1)
m.rect(14, 25, 12, 1, ground='M', height=2)
m.stair(14, 25, 12, 1)
m.rect(16, 6, 8, 18, ground='x', height=2)                 # the long red carpet
m.rect(19, 3, 3, 3, ground='M', height=2)

# pews and pillars
for y in range(14, 24, 2):
    for x in (15, 16, 17, 22, 23, 24):
        m.set(x, y, prop='j')
for y in range(5, 24, 4):
    m.set(14, y, prop='|'); m.set(25, y, prop='|')
for y in (6, 15):
    m.set(15, y, prop='q'); m.set(24, y, prop='q')
m.set(14, 21, prop='!'); m.set(25, 17, prop='!')
m.set(18, 19, prop='d'); m.set(21, 12, prop='d')

# The tower base and its sealed portcullis
m.structure('lantern', 20, 3, lit=False, doorTo='c11_grand_gallery', tx=10, ty=14, dir='up',
            unlockFlag='c11_portcullis', lockedText='The tower door is barred from the far side.')
m.spot('portcullis', 19, 7)                                # 3-wide blocker
for x in (14, 15, 16, 17, 18, 22, 23, 24, 25):
    m.set(x, 7, prop='F')                                  # the iron choir-screen
m.spot('lever', 23, 8)
m.set(23, 8, prop='a')

# West transept — the barracks, Captain Brask
m.set(7, 9, prop='E'); m.set(7, 11, prop='E'); m.set(7, 13, prop='E'); m.set(7, 15, prop='E')
m.set(12, 9, prop='a'); m.set(9, 16, prop='O'); m.set(11, 16, prop='C'); m.set(8, 8, prop='q')
m.spot('brask', 10, 12)

# East transept — the Choir archive
for x in (27, 28, 30, 31, 32):
    m.set(x, 8, prop='H')
m.set(32, 11, prop='H'); m.set(32, 13, prop='H'); m.set(29, 12, prop='='); m.set(28, 12, prop='j')
m.spot('drawing', 30, 9)
m.spot('ledger', 29, 13)

m.spot('save', 17, 9); m.set(17, 9, prop='$')
for name, (x, y) in {
    'c_plaza_w': (5, 32), 'c_plaza_e': (35, 33), 'c_barracks': (8, 14), 'c_archive': (31, 15),
    'c_nave': (24, 21), 'c_apse': (16, 4), 'c_ruin': (10, 38),
}.items():
    m.spot(name, x, y)
m.spot('star', 31, 10)
m.spot('nave_door', 20, 24)
mooring(m, 19, 41, length=5, height=1)
m.spot('arrival', 20, 37)
m.write('c11_grand_nave')
m.preview()

# ------------------------------------------------------------------ the lamp gallery
g = interior(21, 16, wall='K', floor='M', seed=712)
g.rect(1, 2, 19, 13, ground='M', height=0)
g.ellipse(10, 6, 5, 3, ground='X', height=1)               # the lamp dais
g.stair(9, 9, 3, 1)
g.set(10, 4, prop='Q')                                     # the Great Lamp's cradle, dark
for (x, y) in [(3, 4), (17, 4), (3, 10), (17, 10)]:
    g.set(x, y, prop='|')
for (x, y) in [(2, 3), (18, 3)]:
    g.set(x, y, prop='q')
g.set(5, 12, prop='!'); g.set(15, 13, prop='d'); g.set(2, 8, prop='^'); g.set(18, 8, prop='^')
g.rect(9, 15, 3, 1, ground='x')
g.spot('entry', 10, 14); g.spot('garrick', 10, 7); g.spot('wren', 10, 11); g.spot('bram', 11, 10)
g.write('c11_grand_gallery')
g.preview()
