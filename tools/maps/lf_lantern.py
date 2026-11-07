"""The Lantern of Lanternfall — the Kindling hall at the top of the tower."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import interior

m = interior(15, 13, wall='S', floor='_', seed=21)
m.rect(5, 2, 5, 3, ground='M', height=1)           # dais
m.stair(6, 5, 3, 1)
m.rect(6, 5, 3, 1, ground='M', height=0)
m.rect(7, 6, 1, 7, ground='x')                     # carpet aisle
for y in (4, 7, 10):
    m.set(3, y, prop='|'); m.set(11, y, prop='|')
for y in (5, 8):
    m.set(2, y, prop='^'); m.set(12, y, prop='^')
m.set(2, 2, prop='q'); m.set(12, 2, prop='q')
m.set(1, 11, prop='j'); m.set(13, 11, prop='j')
m.structure('beacon', 7, 2)
m.spot('lamp', 7, 2); m.spot('cassian', 7, 4); m.spot('ysolde', 9, 4); m.spot('entry', 7, 11)
m.spot('kneel', 7, 6); m.spot('wren_wait', 5, 8); m.spot('ilse_wait', 9, 8); m.spot('sable_wait', 6, 9); m.spot('bram_wait', 10, 9)
m.write('lf_lantern')
