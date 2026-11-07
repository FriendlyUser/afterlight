"""Ch10 interiors: the Lorne house in Evernoon — the Keeper's home, and Lysa's
room exactly as it was on the afternoon of the festival."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import interior

m = interior(12, 9, wall='P', floor='=', seed=1313)
m.set(9, 2, prop='E')                      # Lysa's bed
m.set(10, 2, prop='H')
m.set(1, 2, prop='H'); m.set(2, 2, prop='H')
m.set(4, 2, prop='^'); m.set(7, 2, prop='^')
m.set(5, 3, prop='='); m.set(5, 4, prop='j')     # the vanity, the chair
m.set(1, 5, prop='O'); m.set(10, 6, prop='k')
m.set(8, 5, prop='f'); m.set(2, 6, prop='f')     # festival flowers in jars
m.rect(3, 4, 6, 3, ground='x')                   # the good rug
m.spot('entry', 5, 7); m.spot('sable', 5, 4); m.spot('mercy', 9, 6)
m.write('c10_lorne_house')
