"""Shared painting helpers for Chapter 11 ("Seven Wounds") layouts.

After the Sundering the world is islands adrift over the abyss, so most maps
start as void (' ') and paint land masses, plank bridges and the Halcyon's
mooring onto it.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior, cave, carve  # noqa: F401  (re-exported)


def sky(w, h, seed):
    """A blank canvas of open sky."""
    return MapCanvas(w, h, ground=' ', height=0, seed=seed)


def island(m, cx, cy, rx, ry, ground, height, jitter=0.25, rim=None):
    """A floating landmass. `rim` paints a crumbling 1-tile edge band."""
    m.ellipse(cx, cy, rx, ry, ground=ground, height=height, jitter=jitter)
    if rim:
        for y in range(m.h):
            for x in range(m.w):
                if m.g[y][x] != ground or m.hg[y][x] != height:
                    continue
                edge = any(m.inside(x + dx, y + dy) and m.g[y + dy][x + dx] == ' '
                           for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                if edge:
                    m.set(x, y, ground=rim)


def bridge(m, points, height, width=2, ground='='):
    """Plank bridge over the void between islands."""
    m.path(points, width=width, ground=ground, height=height)


def mooring(m, x, y, length=4, height=1):
    """The Halcyon's gangplank: a plank pier running south off the map edge
    from (x, y). Spot 'entry' is its top end; 'gangplank' its south end."""
    m.rect(x, y, 2, length, ground='=', height=height)
    m.set(x - 1, y + length - 1, prop='L')
    m.set(x + 2, y + length - 1, prop='L')
    m.spot('entry', x, y)
    m.spot('gangplank', x, y + length - 1)


def ruin_wall_ring(m, x, y, w, h, wall='R', gaps=()):
    """Broken wall outline with gaps (list of (x, y))."""
    for i in range(x, x + w):
        for j in (y, y + h - 1):
            if (i, j) not in gaps:
                m.set(i, j, ground=wall)
    for j in range(y, y + h):
        for i in (x, x + w - 1):
            if (i, j) not in gaps:
                m.set(i, j, ground=wall)


def plaza(m, cx, cy, r, ground, height):
    m.ellipse(cx, cy, r, r * 0.8, ground=ground, height=height)
