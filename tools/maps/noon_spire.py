"""The Noon Spire — approach across the greatest Sun Shard (Ch10 entry).

A floating island of sun-glass, warm underfoot, terraced up to the base of the
Spire. The Halcyon drops the party at the southern ledge; pilgrims camp halfway
up; the great gate is sealed, but the Choir's supply lift on the east is not.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

W, H = 36, 46
m = MapCanvas(W, H, ground=' ', height=0, seed=1010)

# --- the shard, terrace by terrace (south low, north high)
m.ellipse(17, 39, 10, 6, ground='#', height=0, jitter=0.3)
m.ellipse(17, 39, 9, 5, ground='g', height=1, jitter=0.25)       # T1 landing
m.ellipse(17, 30, 13, 6, ground='#', height=2, jitter=0.3)
m.ellipse(17, 30, 12, 5, ground='g', height=3, jitter=0.25)      # T2 pilgrim camp
m.ellipse(17, 20, 16, 7, ground='#', height=4, jitter=0.3)
m.ellipse(17, 20, 15, 6, ground='g', height=5, jitter=0.25)      # T3 crystal fields
m.ellipse(17, 9, 14, 7, ground='#', height=6, jitter=0.25)
m.ellipse(17, 9, 13, 6, ground='M', height=7, jitter=0.15)       # T4 Spire plaza
m.rect(15, 41, 4, 5, ground='g', height=1)                       # the ledge under the ladder
m.rect(14, 44, 6, 2, ground=' ', height=0)

# Ramps (terrace to terrace). Each climbs two levels over three tiles.
m.ramp(16, 35, 3, 'n', 1, 3, width=3, ground='M')
m.ramp(12, 26, 3, 'n', 3, 5, width=3, ground='M')
m.ramp(22, 15, 3, 'n', 5, 7, width=3, ground='M')
# Side spurs on T3: west and east crystal ledges
m.ellipse(3, 21, 3, 3, ground='g', height=5, jitter=0.2)
m.ellipse(31, 18, 3, 3.5, ground='g', height=5, jitter=0.2)

# Sun-fire fissures (molten light: solid, glowing)
for pts in [[(8, 19), (12, 22)], [(20, 18), (26, 21)], [(14, 31), (19, 33)], [(25, 28), (27, 30)], [(9, 39), (11, 40)]]:
    m.path(pts, width=1, ground='l', height=None)

# --- the Spire itself: a white wall across the north with a sealed great gate
m.rect(4, 0, 28, 4, ground='K', height=7)
m.rect(14, 0, 8, 1, ground='K', height=7)
m.rect(16, 3, 4, 1, ground='M', height=7)          # gate recess
m.structure('arch', 16, 4, w=4, tex='wall_marble')
m.rect(27, 4, 3, 2, ground='M', height=7)          # supply-lift platform (east)
m.set(28, 3, ground='M', height=7)

# --- the pilgrim camp (T2)
m.structure('tent', 10, 29, color='#c8b890')
m.structure('tent', 24, 30, color='#a8a0c0')
m.structure('tent', 21, 27, color='#c09a7a')
m.set(17, 30, prop='@')
m.set(13, 31, prop='$')
m.set(19, 32, prop='k'); m.set(9, 31, prop='O'); m.set(26, 32, prop='C')

# --- props
for (x, y) in [(10, 8), (24, 8), (6, 11), (28, 11), (13, 13), (21, 13)]:
    m.set(x, y, prop='^')                 # Choir braziers on the plaza
for (x, y) in [(15, 6), (20, 6)]:
    m.set(x, y, prop='S')                 # statues of the Hierophant, arms open
m.set(17, 10, prop='q'); m.set(18, 10, prop='q')
m.scatter(0, 14, W, 14, ['*', '*', 'R', 'o'], 0.08, on='g')
m.scatter(0, 33, W, 12, ['*', 'o', 'R'], 0.06, on='g')
m.scatter(0, 24, W, 10, ['o', '*'], 0.04, on='g')
m.clear_props(14, 33, 6, 12)
m.clear_props(11, 24, 5, 4)
m.clear_props(21, 13, 4, 4)
m.clear_props(15, 3, 6, 3)
m.clear_props(26, 4, 5, 3)

m.spot('entry', 15, 40)
m.spot('gate', 17, 3)
m.spot('lift', 28, 4)
m.spot('camp', 17, 29)
m.write('noon_spire')
m.preview()
