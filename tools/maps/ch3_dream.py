"""Sable's dream (Chapter 3): Cathedral Square forty years ago, on a summer
festival afternoon, a heartbeat before the Grand Lantern goes dark."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(26, 20, ground='M', height=1, seed=309)
m.rect(0, 0, 26, 3, ground='K', height=2)            # cathedral wall line
m.rect(0, 0, 2, 20, ground=',', height=1)
m.rect(24, 0, 2, 20, ground=',', height=1)
m.rect(9, 7, 9, 10, ground='x', height=1)            # festival carpet to the Lantern
m.rect(2, 17, 22, 3, ground='.', height=1)
m.structure('lantern', 13, 5)
for (x, y, p) in [(13, 12, 'Q'), (5, 4, 'q'), (8, 4, 'q'), (18, 4, 'q'), (21, 4, 'q'),
                  (4, 8, '='), (5, 8, '='), (20, 8, '='), (21, 8, '='), (4, 9, 'j'), (21, 9, 'j'),
                  (6, 13, 'L'), (20, 13, 'L'), (3, 15, 'S'), (22, 15, 'S')]:
    m.set(x, y, prop=p)
m.scatter(0, 0, 2, 20, ['K', 'K', 'B'], 0.6, on=',')
m.scatter(24, 0, 2, 20, ['K', 'K', 'B'], 0.6, on=',')
m.scatter(2, 17, 22, 3, ['f', 'f', 'g', 'B'], 0.3, on='.')
m.scatter(2, 4, 22, 12, ['f'], 0.05, on='M')
m.spot('start', 13, 17); m.spot('boy', 13, 8); m.spot('lysa_stop', 13, 9)
m.write('c3_dream')
m.preview()
