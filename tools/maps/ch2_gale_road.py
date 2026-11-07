"""Chapter 2 — the Gale Coast Road: clifftop road from Port Gale to the Whisperwold."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

m = MapCanvas(60, 32, ground='.', height=4, seed=41)

# Sea and the cove beach under the cliffs
m.rect(0, 26, 60, 6, ground='~', height=0)
m.rect(0, 22, 60, 4, ground='s', height=1)
for x in range(60):                               # ragged tideline
    if m.rng.random() < 0.45:
        m.set(x, 25, ground='w', height=1)
    if m.rng.random() < 0.25:
        m.set(x, 22, ground='.', height=4)        # cliff lip wobble
# Northern hills
m.rect(0, 0, 60, 6, ground=',', height=6)
m.ragged_edge('n', 7, ',', 6, var=2)
m.rect(0, 0, 60, 1, ground='#', height=8)
# Tall grass meadows on the clifftop
m.ellipse(10, 9, 6, 2.5, ground='"', jitter=0.4)
m.ellipse(50, 17, 6, 3, ground='"', jitter=0.4)
m.ellipse(20, 18, 5, 2, ground='"', jitter=0.4)

# The gorge of the Gale river, with the stone bridge
m.rect(36, 4, 6, 18, ground='~', height=1)
m.ellipse(38.5, 6, 4, 3, ground='~', height=1)
m.rect(36, 22, 6, 4, ground='w', height=1)        # river mouth: wade across at low tide
m.rect(36, 11, 6, 3, ground='_', height=4)        # the bridge

# The road
m.path([(0, 14), (8, 14), (16, 13), (26, 12), (36, 12)], width=3, ground=':')
m.path([(41, 12), (48, 12), (54, 11), (59, 11)], width=3, ground=':')
m.path([(25, 13), (26, 9)], width=2, ground=':')    # to the hermit's camp
m.path([(12, 15), (13, 18)], width=1, ground=':')   # to the Gull Light

# Hermit Hesketh's hut and camp (a level shelf cut into the hillside)
m.rect(19, 4, 13, 7, ground='.', height=4)
m.building(22, 5, 4, 3, wall='wall_wood', roof='roof_thatch', windows=[0],
           door={'dx': 2, 'locked': True, 'lockedText': 'Hesketh\'s hut. It smells of woodsmoke, fish and old pipe tobacco.'})
m.rect(22, 8, 8, 3, ground='d')
m.set(27, 9, prop='@')
m.set(26, 10, prop='h'); m.set(28, 8, prop='h'); m.set(23, 9, prop='O'); m.set(29, 10, prop='C')
m.rect(20, 5, 1, 4, prop='F')

# The Gull Light — the coast's old oil lighthouse, dark for twenty years
m.structure('lantern', 13, 19, lit=False)

# Goat path down the cliff (blocked by a rockfall until Hesketh shows the way)
m.ramp(29, 19, 4, 's', 4, 1, width=2, ground=':')
for y in range(19, 23):                           # rock walls flank the cut
    m.set(28, y, ground='#', height=5); m.set(31, y, ground='#', height=5)
# East climb back up to the road
m.ramp(46, 22, 4, 'n', 1, 4, width=2, ground=':')
for y in range(19, 23):
    m.set(45, y, ground='#', height=5); m.set(48, y, ground='#', height=5)
# Cove beach details: the three cairns
for (x, y) in [(24, 23), (19, 23), (14, 23)]:
    m.set(x, y, prop='R')
m.ellipse(56, 23, 3, 2, ground='c', height=1)    # sea-cave nook
m.rect(57, 21, 3, 2, ground='#', height=6)

# Props
m.scatter(0, 0, 60, 7, ['P', 'P', 'T', 'b', 'R'], 0.3, on=',')
m.scatter(0, 7, 60, 15, ['b', 'f', 'g', 'R', 'o'], 0.05, on='."')
m.scatter(0, 7, 36, 15, ['P'], 0.015, on='.')
m.scatter(42, 7, 18, 15, ['P', 'T'], 0.03, on='.')
m.scatter(0, 22, 60, 4, ['o', 'R', 'x'], 0.05, on='s')
for (x, y) in [(5, 16), (17, 11), (34, 14), (43, 14), (52, 13)]:
    m.set(x, y, prop='F')
m.set(9, 15, prop='s')
m.set(44, 10, prop='s')
m.clear_props(0, 12, 3, 5)
m.clear_props(57, 9, 3, 5)
m.clear_props(28, 17, 4, 6)
m.clear_props(45, 18, 4, 6)

m.spot('west', 1, 14)
m.spot('east', 58, 11)
m.spot('hermit', 28, 10)
m.write('c2_gale_road')
m.preview()
