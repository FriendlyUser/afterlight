"""Side content — the Drowned Observatory: tidal flats and causeway, the flooded
galleries, and the Dome of Measures (Act I, Ch3+, Lv ~18)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

PREVIEW = '--preview' in sys.argv


def done(m, mid):
    m.write(mid)
    if PREVIEW:
        m.preview()


# =====================================================================
# side_obs_shore — low tide, a drowned causeway out to the sea-stack
# =====================================================================
W, H = 40, 32
m = MapCanvas(W, H, ground='~', height=0, seed=411)
# sandbars and flats
m.ellipse(20, 26, 17, 7, ground='s', height=1, jitter=0.35)
m.ellipse(8, 18, 6, 5, ground='s', height=1, jitter=0.5)
m.ellipse(31, 17, 7, 5, ground='s', height=1, jitter=0.5)
m.ellipse(31, 17, 4, 3, ground='w', height=0, jitter=0.4)       # Pinch's tidepool
m.ellipse(9, 18, 2.5, 1.6, ground='w', height=0)
m.ellipse(27, 27, 3, 1.5, ground='w', height=0)
m.ellipse(12, 26, 2.2, 1.4, ground='w', height=0)
# the sea-stack and the observatory's sea door
m.ellipse(20, 2, 11, 5, ground='#', height=6, jitter=0.25)
m.rect(16, 4, 9, 2, ground='_', height=1)
# the causeway (old Measurers' road), with a broken stretch to wade
m.rect(18, 6, 5, 25, ground=';', height=1)
m.rect(18, 15, 5, 3, ground='w', height=0)
for y in (8, 12, 20, 24):
    m.set(18, y, prop='!'); m.set(22, y, prop='|' if y % 8 == 0 else '!')
m.structure('arch', 19, 4, w=3, tex='wall_stone')
m.set(17, 5, prop='^'); m.set(23, 5, prop='^')
# side landings onto the flats
m.rect(12, 21, 6, 2, ground='s', height=1)
m.rect(23, 18, 4, 2, ground='s', height=1)
# wreckage and shore life
m.set(7, 24, prop='V'); m.set(5, 16, prop='R'); m.set(11, 15, prop='R')
m.set(34, 21, prop='C'); m.set(26, 24, prop='O')
m.scatter(0, 0, W, H, ['o', 'x', 'R', 'n'], 0.07, on='s')
m.clear_props(18, 6, 5, 26)
m.clear_props(17, 29, 7, 3)
m.rect(18, 30, 5, 2, ground='s', height=1)
m.spot('entry', 20, 30)
m.spot('door', 20, 4)
m.spot('pinch', 31, 17)
done(m, 'side_obs_shore')

# =====================================================================
# side_obs_galleries — flooded halls of the Measurers
# =====================================================================
W, H = 46, 36
m = MapCanvas(W, H, ground='S', height=1, seed=412)


def room(x, y, w, h, g='_'):
    m.rect(x, y, w, h, ground=g, height=1)


room(17, 27, 12, 8)                    # entry hall (south)
room(19, 34, 8, 2)                     # the sea door corridor
room(16, 12, 14, 12, 'M')              # central rotunda
room(2, 13, 12, 17)                    # west wing: the drowned library
room(32, 13, 12, 17)                   # east wing: instrument hall
room(21, 2, 4, 10)                     # north stair corridor
room(14, 24, 18, 3)                    # cross gallery south
room(13, 16, 4, 3)                     # rotunda ↔ west
room(29, 16, 4, 3)                     # rotunda ↔ east
room(5, 6, 8, 7)                       # north-west study
room(34, 5, 8, 8)                      # north-east lens room
room(8, 10, 3, 4); room(37, 11, 3, 3)
room(6, 30, 6, 4); room(33, 30, 7, 4)  # south pockets
# water: the library is waist-deep, channels cut through the floors
m.rect(3, 19, 10, 9, ground='w', height=0)
m.rect(6, 22, 4, 4, ground='~', height=0)
m.rect(33, 21, 10, 2, ground='~', height=0)
m.rect(37, 21, 2, 2, ground='=', height=1)          # a plank over the channel
m.rect(17, 30, 3, 4, ground='w', height=0)
m.rect(26, 30, 3, 4, ground='w', height=0)
# rotunda: the dial console ring and a carpet of old star-tiles
m.ellipse(23, 17.5, 4, 3.5, ground='X', height=1)
m.set(23, 17, prop='|')                             # the console pillar
for (x, y) in [(17, 13), (28, 13), (17, 22), (28, 22)]:
    m.set(x, y, prop='|')
m.set(19, 12, prop='$')
# shelves, instruments, wreckage
for x in range(3, 13, 2):
    m.set(x, 14, prop='H')
m.set(3, 16, prop='H'); m.set(12, 16, prop='H')
for (x, y, p) in [(33, 14, '='), (35, 14, '='), (40, 14, 'H'), (42, 14, 'H'), (35, 27, 'C'), (42, 27, 'O'),
                  (6, 7, 'H'), (7, 7, 'H'), (10, 9, '='), (11, 9, 'j'), (35, 6, '*'), (40, 6, '*'),
                  (37, 9, 'S'), (18, 28, 'O'), (28, 28, 'C'), (21, 3, '^'), (24, 3, '^'),
                  (16, 25, 'd'), (30, 25, 'x'), (7, 31, 'x'), (38, 32, 'd')]:
    m.set(x, y, prop=p)
m.scatter(2, 2, 42, 32, ['o', 'd', 'G', '*'], 0.05, on='_M')
m.clear_props(21, 2, 4, 26)
m.clear_props(14, 24, 18, 3)
m.clear_props(13, 16, 20, 3)
m.spot('entry', 23, 34)
m.spot('stair', 22, 2)
m.spot('lens', 7, 20)
done(m, 'side_obs_galleries')

# =====================================================================
# side_obs_dome — the Dome of Measures, where the Dawnsong was written
# =====================================================================
W, H = 30, 26
m = MapCanvas(W, H, ground='K', height=1, seed=413)
m.ellipse(15, 12, 12, 10.5, ground='M', height=1)
m.ellipse(15, 11, 5, 4, ground='X', height=2)
m.rect(14, 21, 3, 5, ground='M', height=1)
m.ramp(15, 16, 2, 'n', 1, 2, width=1, ground='M')
m.structure('beacon', 15, 10, lit=True, color='#9ad0ff')
for (x, y) in [(6, 7), (24, 7), (5, 14), (25, 14), (9, 19), (21, 19), (10, 3), (20, 3)]:
    m.set(x, y, prop='|')
for (x, y) in [(8, 4), (22, 4), (4, 10), (26, 10)]:
    m.set(x, y, prop='*')
m.set(7, 17, prop='H'); m.set(23, 17, prop='H'); m.set(12, 3, prop='H'); m.set(18, 3, prop='H')
m.set(13, 20, prop='^'); m.set(17, 20, prop='^')
m.spot('entry', 15, 24)
m.spot('orrery', 15, 10)
m.spot('chest', 15, 5)
done(m, 'side_obs_dome')
