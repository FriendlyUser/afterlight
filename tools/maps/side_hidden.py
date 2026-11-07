"""Side content — the two hidden boss arenas: Harrow's Hollow (the den of the
thing that killed the Lodge's founder) and the Zenith, where the Black Star sits."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas

PREVIEW = '--preview' in sys.argv


def done(m, mid):
    m.write(mid)
    if PREVIEW:
        m.preview()


# =====================================================================
# side_bane_hollow — a crater den of bones, forty years deep
# =====================================================================
W, H = 30, 24
m = MapCanvas(W, H, ground=' ', height=0, seed=451)
m.ellipse(15, 11, 14, 10, ground='a', height=1, jitter=0.3)
m.ellipse(15, 11, 12.5, 8.5, ground='q', height=3, jitter=0.3)
m.ellipse(15, 9, 7, 4.5, ground='c', height=1, jitter=0.2)          # the den floor, sunken
m.ramp(15, 17, 3, 'n', 3, 1, width=2, ground='d')                  # down into the den
m.rect(0, 10, 3, 3, ground='d', height=3)                           # trail in (west)
m.path([(1, 11), (8, 14), (14, 17)], width=2, ground='d', height=3)
m.scatter(9, 5, 13, 9, ['x', 'x', 'x', 'd'], 0.35, on='c')
for (x, y) in [(5, 6), (24, 6), (6, 16), (24, 15), (20, 3), (9, 3)]:
    m.set(x, y, prop='D')
m.set(15, 6, prop='%'); m.set(11, 8, prop='R'); m.set(20, 10, prop='R')
m.set(9, 15, prop='@')                                                # Rook's lamp-fire
m.set(4, 13, prop='$')
m.set(22, 13, prop='t')                                               # a cairn: O. HARROW
m.clear_props(14, 9, 3, 10)
m.clear_props(0, 9, 10, 6)
m.spot('entry', 1, 11)
m.spot('den', 15, 9)
done(m, 'side_bane_hollow')

# =====================================================================
# side_nadir — the Zenith, the highest rock in the broken sky
# =====================================================================
W, H = 30, 26
m = MapCanvas(W, H, ground=' ', height=0, seed=452)
m.ellipse(15, 12, 13, 11, ground='u', height=1, jitter=0.35)    # lower ledge
m.ellipse(15, 12, 11.5, 9.5, ground='u', height=3, jitter=0.3)
m.ellipse(15, 9, 6, 4, ground='u', height=1, jitter=0.15)           # the crater
m.ellipse(15, 8, 2.5, 1.8, ground='u', height=0)
m.structure('beacon', 15, 8, lit=True, color='#7a40ff')
m.ramp(15, 15, 3, 'n', 3, 1, width=2, ground='u')
m.rect(13, 21, 4, 5, ground='a', height=3)
for (x, y) in [(6, 6), (24, 6), (5, 14), (25, 14), (9, 19), (21, 19), (12, 3), (18, 3)]:
    m.set(x, y, prop='%')
m.set(20, 17, prop='S')                                               # the Measurers' cairn
m.set(10, 17, prop='$')
m.clear_props(13, 12, 5, 14)
m.spot('entry', 15, 24)
m.spot('star', 15, 8)
done(m, 'side_nadir')
