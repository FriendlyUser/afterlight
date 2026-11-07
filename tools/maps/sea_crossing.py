"""The fishing boat crossing the strait to the mainland."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(24, 14, ground='~', height=0, seed=44)
m.ellipse(12, 7, 9, 3.6, ground='=', height=2)
m.rect(4, 6, 16, 3, ground='=', height=2)
m.set(12, 6, prop='|')                              # mast
m.set(6, 7, prop='O'); m.set(7, 8, prop='C'); m.set(17, 6, prop='k'); m.set(18, 8, prop='O')
m.spot('wren', 10, 7); m.spot('ilse', 9, 8); m.spot('bram', 14, 7); m.spot('sable', 11, 8); m.spot('tobias', 16, 7)
m.write('sea_crossing')
