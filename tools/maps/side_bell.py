"""Side content — the Hollow Bell: the bell-tower of the Abbey of Hours, torn
loose in the Sundering and hanging upside-down beneath a shard (Act II, Lv ~45).
The shard top, the inverted tower (descending switchbacks), and the belfry."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

PREVIEW = '--preview' in sys.argv


def done(m, mid):
    m.write(mid)
    if PREVIEW:
        m.preview()


# =====================================================================
# side_bell_top — the shard the tower hangs from
# =====================================================================
W, H = 30, 24
m = MapCanvas(W, H, ground=' ', height=0, seed=431)
m.ellipse(15, 11, 13.5, 9.5, ground='a', height=0, jitter=0.3)
m.ellipse(15, 11, 12, 8, ground='q', height=2, jitter=0.35)
m.ellipse(15, 10, 7, 5, ground='a', height=2, jitter=0.4)
m.rect(14, 18, 3, 6, ground=':', height=2)                     # landing
# the tower's foundation, punched up through the rock
m.rect(11, 4, 9, 6, ground='R', height=2)
m.rect(12, 5, 7, 4, ground='r', height=1)
m.rect(14, 9, 3, 1, ground='r', height=1)
m.rect(15, 5, 1, 2, ground='_', height=0)                       # the way down
for (x, y, p) in [(10, 6, '!'), (20, 5, '!'), (9, 9, 'd'), (21, 8, 'd'), (12, 11, 'R'), (19, 12, 'x')]:
    m.set(x, y, prop=p)
# pilgrims' camp
m.set(7, 13, prop='@'); m.structure('tent', 5, 11, color='#6a5a6a')
m.set(23, 13, prop='S')
m.set(19, 15, prop='$')
m.scatter(3, 3, 24, 17, ['D', 'o', '%', 'd'], 0.06, on='qa')
m.clear_props(13, 9, 5, 15)
m.spot('entry', 15, 22)
m.spot('hole', 15, 5)
done(m, 'side_bell_top')

# =====================================================================
# side_bell_nave — the inverted tower: four floors (vaults become floors),
# descending southward in switchbacks; three hour-chimes open the grilles
# =====================================================================
W, H = 40, 44
m = MapCanvas(W, H, ground='K', height=8, seed=432)
bands = [(2, 8), (13, 6), (24, 4), (35, 2)]   # (top row, height)
for (y0, h) in bands:
    m.rect(4, y0, 32, 8 if y0 < 35 else 7, ground='r', height=h)
    m.rect(8, y0 + 2, 24, 4, ground='M', height=h)                # the vault's central rib
m.rect(19, 0, 3, 2, ground='r', height=8)                         # entrance shaft
# alcoves (chimes)
m.rect(36, 4, 3, 4, ground='r', height=8)       # A: east
m.rect(1, 15, 3, 4, ground='r', height=6)       # B: west
m.rect(36, 26, 3, 4, ground='r', height=4)      # C: east
# switchback stairs between floors
m.ramp(6, 10, 3, 's', 8, 6, width=3, ground='_')     # A -> B (west)
m.ramp(32, 21, 3, 's', 6, 4, width=3, ground='_')    # B -> C (east)
m.ramp(6, 32, 3, 's', 4, 2, width=3, ground='_')     # C -> D (west)
m.rect(19, 42, 3, 2, ground='r', height=2)           # D -> belfry shaft
# inner walls: break each floor into rooms
for (x, y0, h) in [(14, 2, 8), (26, 2, 8), (12, 13, 6), (24, 13, 6), (16, 24, 4), (28, 24, 4)]:
    m.rect(x, y0, 1, 8, ground='K', height=h)
    m.rect(x, y0 + 3, 1, 2, ground='r', height=h)    # doorway
# side chapels with chests
m.rect(4, 2, 3, 2, ground='M', height=8)
m.rect(30, 35, 5, 2, ground='M', height=2)
# props: inverted chandeliers (lamps standing on the vault), pews on the ceiling,
# bells hung upside down, saints' statues hanging by their feet
for (y0, h) in bands:
    for x in (9, 31):
        m.set(x, y0 + 1, prop='L')
for (x, y, p) in [(20, 4, 'S'), (20, 16, 'u'), (21, 27, 'u'), (20, 38, 'S'), (5, 6, 'H'), (34, 17, 'H'),
                  (10, 28, 'q'), (33, 30, 'q'), (8, 38, 'j'), (9, 38, 'j'), (10, 38, 'j'), (30, 39, 'j'),
                  (31, 39, 'j'), (17, 7, 'x'), (29, 18, 'd'), (11, 30, 'd'), (24, 40, 'x'), (5, 25, '!'),
                  (34, 3, '!'), (18, 14, '|'), (22, 14, '|'), (18, 19, '|'), (22, 19, '|')]:
    m.set(x, y, prop=p)
m.set(23, 40, prop='$')
m.scatter(4, 2, 32, 40, ['d', 'o'], 0.04, on='rM')
m.clear_props(19, 0, 3, 4)
m.clear_props(5, 9, 5, 5); m.clear_props(31, 20, 5, 5); m.clear_props(5, 31, 5, 5)
m.clear_props(18, 39, 5, 5)
m.spot('entry', 20, 1)
m.spot('chime_a', 37, 5)
m.spot('chime_b', 2, 16)
m.spot('chime_c', 37, 27)
m.spot('sexton', 30, 16)
m.spot('choirmother', 10, 27)
m.spot('exit', 20, 43)
done(m, 'side_bell_nave')

# =====================================================================
# side_bell_belfry — the belfry, open to the abyss, the bell mouth-up
# =====================================================================
W, H = 28, 24
m = MapCanvas(W, H, ground=' ', height=0, seed=433)
m.ellipse(14, 12, 11, 9, ground='K', height=4)
m.ellipse(14, 12, 10, 8, ground='+', height=4)
m.rect(13, 0, 3, 5, ground='r', height=4)                      # shaft from the nave
for y in range(12, H):                                          # the south half is open air
    for x in range(W):
        if m.g[y][x] == 'K':
            m.set(x, y, ground=' ')
for (x, y) in [(5, 8), (23, 8), (6, 16), (22, 16), (9, 4), (19, 4), (10, 19), (18, 19)]:
    m.set(x, y, ground='+', height=4, prop='|')
m.set(14, 12, prop='u')                                         # Gentle Margery, mouth-up
m.set(12, 11, prop='!'); m.set(16, 13, prop='d'); m.set(10, 15, prop='x')
m.spot('entry', 14, 1)
m.spot('agathe', 14, 8)
m.spot('bell', 14, 12)
done(m, 'side_bell_belfry')
