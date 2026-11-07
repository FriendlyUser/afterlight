"""Lanternfall interiors: Wren's house, Nana Brisa's, the Gull's Rest inn, Marlow's store, Tobias's shack."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import interior

# --- Halloway house (Wren & Ysolde)
m = interior(10, 9, wall='T', floor='=', seed=11)
m.set(1, 2, prop='E'); m.set(8, 2, prop='H'); m.set(7, 2, prop='H')
m.set(4, 4, prop='='); m.set(3, 4, prop='j'); m.set(5, 4, prop='j')
m.set(1, 6, prop='O'); m.set(8, 6, prop='u'); m.set(2, 2, prop='^'); m.set(6, 2, prop='^')
m.set(8, 4, prop='k')
m.rect(4, 8, 2, 1, ground='x')
m.spot('entry', 4, 7); m.spot('ysolde', 6, 5); m.spot('bed', 2, 3); m.spot('door', 4, 8)
m.write('lf_wren_house')

# --- Nana Brisa & Ilse's house (herbalist)
m = interior(10, 8, wall='P', floor='+', seed=12)
m.set(1, 2, prop='H'); m.set(2, 2, prop='H'); m.set(8, 2, prop='E')
m.set(5, 3, prop='u'); m.set(3, 4, prop='='); m.set(7, 5, prop='k'); m.set(1, 5, prop='O')
m.set(4, 2, prop='^'); m.set(6, 2, prop='f')
m.spot('entry', 4, 6); m.spot('nana', 4, 3); m.spot('ilse', 6, 4); m.spot('bed', 8, 3)
m.write('lf_nana_house')

# --- The Gull's Rest (inn & tavern)
m = interior(13, 10, wall='S', floor='=', seed=13)
for x in (2, 6, 10):
    m.set(x, 5, prop='='); m.set(x - 1, 5, prop='j'); m.set(x + 1, 5, prop='j')
m.rect(1, 2, 4, 1, prop='O'); m.set(9, 2, prop='H'); m.set(10, 2, prop='H'); m.set(11, 2, prop='E')
m.set(6, 2, prop='='); m.set(7, 2, prop='=')
m.set(1, 7, prop='C'); m.set(11, 7, prop='O'); m.set(3, 2, prop='^'); m.set(8, 2, prop='^')
m.spot('entry', 5, 8); m.spot('keeper', 6, 3); m.spot('bram', 10, 6); m.spot('sailor', 2, 6)
m.write('lf_inn')

# --- Marlow's Goods (store)
m = interior(9, 7, wall='W', floor='=', seed=14)
m.set(1, 2, prop='H'); m.set(2, 2, prop='H'); m.set(6, 2, prop='H'); m.set(7, 2, prop='H')
m.set(3, 3, prop='='); m.set(4, 3, prop='='); m.set(5, 3, prop='=')
m.set(1, 5, prop='C'); m.set(7, 5, prop='O'); m.set(7, 4, prop='k')
m.spot('entry', 4, 5); m.spot('marlow', 4, 2)
m.write('lf_store')

# --- Tobias's shack
m = interior(7, 6, wall='W', floor='+', seed=15)
m.set(1, 2, prop='E'); m.set(5, 2, prop='O'); m.set(5, 3, prop='C'); m.set(3, 2, prop='^')
m.spot('entry', 3, 4)
m.write('lf_tobias')
