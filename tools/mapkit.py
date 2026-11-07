"""
mapkit — a tiny painter for Afterlight map layouts.

Each map layout script builds a MapCanvas and calls .write(id). The output is
src/data/maps/layouts/<id>.js exporting { ground, height, props, buildings,
structures, spots, w, h }. Gameplay (npcs, events) lives in hand-written
src/data/maps/<id>.js which spreads the layout in.

Legend reference: src/world/Legend.js and docs/MAPS.md
"""
import json
import math
import os
import random

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT_DIR = os.path.join(ROOT, 'src', 'data', 'maps', 'layouts')

HEIGHT_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'


class MapCanvas:
    def __init__(self, w, h, ground='.', height=0, seed=1):
        self.w, self.h = w, h
        self.g = [[ground] * w for _ in range(h)]
        self.hg = [[height] * w for _ in range(h)]
        self.p = [[' '] * w for _ in range(h)]
        self.buildings = []
        self.structures = []
        self.stairs = []
        self.spots = {}
        self.rng = random.Random(seed)

    # ------------------------------------------------------------ basics
    def inside(self, x, y):
        return 0 <= x < self.w and 0 <= y < self.h

    def set(self, x, y, ground=None, height=None, prop=None):
        if not self.inside(x, y):
            return
        if ground is not None:
            self.g[y][x] = ground
        if height is not None:
            self.hg[y][x] = height
        if prop is not None:
            self.p[y][x] = prop

    def rect(self, x, y, w, h, ground=None, height=None, prop=None):
        for j in range(y, y + h):
            for i in range(x, x + w):
                self.set(i, j, ground, height, prop)

    def ellipse(self, cx, cy, rx, ry, ground=None, height=None, prop=None, jitter=0.0):
        for j in range(int(cy - ry - 2), int(cy + ry + 3)):
            for i in range(int(cx - rx - 2), int(cx + rx + 3)):
                d = ((i + 0.5 - cx) / rx) ** 2 + ((j + 0.5 - cy) / ry) ** 2
                if jitter:
                    d += (self.rng.random() - 0.5) * jitter
                if d <= 1:
                    self.set(i, j, ground, height, prop)

    def line(self, x0, y0, x1, y1, width=1, ground=None, height=None, prop=None):
        steps = max(abs(x1 - x0), abs(y1 - y0), 1)
        for s in range(steps + 1):
            t = s / steps
            x = round(x0 + (x1 - x0) * t)
            y = round(y0 + (y1 - y0) * t)
            r = width // 2
            for j in range(-r, width - r):
                for i in range(-r, width - r):
                    self.set(x + i, y + j, ground, height, prop)

    def path(self, points, width=2, ground=':', height=None):
        for (a, b) in zip(points, points[1:]):
            self.line(a[0], a[1], b[0], b[1], width, ground, height)

    def border(self, ground='#', height=None, thickness=1, sides='nsew'):
        for t in range(thickness):
            if 'n' in sides:
                self.rect(0, t, self.w, 1, ground, height)
            if 's' in sides:
                self.rect(0, self.h - 1 - t, self.w, 1, ground, height)
            if 'w' in sides:
                self.rect(t, 0, 1, self.h, ground, height)
            if 'e' in sides:
                self.rect(self.w - 1 - t, 0, 1, self.h, ground, height)

    def ragged_edge(self, side, depth, ground, height=None, var=2):
        """Organic edge (coast, forest wall) along a side."""
        n = self.w if side in 'ns' else self.h
        d = depth
        for i in range(n):
            d = max(1, min(depth + var, d + self.rng.choice([-1, 0, 0, 1])))
            for k in range(d):
                if side == 'n':
                    self.set(i, k, ground, height)
                elif side == 's':
                    self.set(i, self.h - 1 - k, ground, height)
                elif side == 'w':
                    self.set(k, i, ground, height)
                else:
                    self.set(self.w - 1 - k, i, ground, height)

    def scatter(self, x, y, w, h, prop, density=0.1, on=None, clear=True):
        """Randomly place prop chars on tiles whose ground is in `on`."""
        for j in range(y, y + h):
            for i in range(x, x + w):
                if not self.inside(i, j):
                    continue
                if on is not None and self.g[j][i] not in on:
                    continue
                if clear and self.p[j][i] != ' ':
                    continue
                if (i, j) in self._reserved():
                    continue
                if self.rng.random() < density:
                    self.p[j][i] = self.rng.choice(prop) if isinstance(prop, (list, tuple)) else prop

    def clear_props(self, x, y, w, h):
        self.rect(x, y, w, h, prop=' ')

    def _reserved(self):
        res = set()
        for b in self.buildings:
            for j in range(b['y'], b['y'] + b['d']):
                for i in range(b['x'], b['x'] + b['w']):
                    res.add((i, j))
            dx = b['x'] + b.get('door', {}).get('dx', b['w'] // 2) if b.get('door') else None
            if dx is not None:
                res.add((dx, b['y'] + b['d']))
        for s in self.spots.values():
            res.add((s[0], s[1]))
        return res

    # ------------------------------------------------------------ features
    def spot(self, name, x, y):
        self.spots[name] = [x, y]
        if self.inside(x, y):
            self.p[y][x] = ' '

    def building(self, x, y, w, d, **kw):
        """kw: h, wall, roof, door={dx,to,tx,ty,dir,locked}, windows=[dx...], roofH"""
        b = {'x': x, 'y': y, 'w': w, 'd': d}
        b.update(kw)
        self.buildings.append(b)
        self.clear_props(x - 1, y, w + 2, d + 1)
        lvl = self.hg[y + d - 1][x]
        self.rect(x, y, w, d, height=lvl)
        return b

    def structure(self, kind, x, y, **kw):
        s = {'type': kind, 'x': x, 'y': y}
        s.update(kw)
        self.structures.append(s)
        return s

    def stair(self, x, y, w=1, h=1):
        for j in range(y, y + h):
            for i in range(x, x + w):
                self.stairs.append({'x': i, 'y': j})

    def ramp(self, x, y, length, direction, start_h, end_h, width=1, ground=None):
        """Height ramp of `length` tiles (direction n/s/e/w), auto-marked as stairs."""
        for k in range(length):
            hval = round(start_h + (end_h - start_h) * (k / max(1, length - 1)))
            for wv in range(width):
                if direction == 's':
                    tx, ty = x + wv, y + k
                elif direction == 'n':
                    tx, ty = x + wv, y - k
                elif direction == 'e':
                    tx, ty = x + k, y + wv
                else:
                    tx, ty = x - k, y + wv
                self.set(tx, ty, ground, hval)
                self.stairs.append({'x': tx, 'y': ty})

    # ------------------------------------------------------------ output
    def layers(self):
        ground = [''.join(r) for r in self.g]
        height = [''.join(HEIGHT_CHARS[max(0, min(35, v))] for v in r) for r in self.hg]
        props = [''.join(r) for r in self.p]
        return ground, height, props

    def write(self, map_id):
        ground, height, props = self.layers()
        os.makedirs(OUT_DIR, exist_ok=True)
        data = {
            'w': self.w, 'h': self.h,
            'ground': ground, 'height': height, 'props': props,
            'buildings': self.buildings, 'structures': self.structures,
            'stairs': self.stairs, 'spots': self.spots,
        }
        body = json.dumps(data, indent=1)
        # keep the ASCII rows readable: one row per line
        path = os.path.join(OUT_DIR, f'{map_id}.js')
        with open(path, 'w') as f:
            f.write(f'// GENERATED by tools/maps/{map_id}.py — edit the script, not this file.\n')
            f.write('export default ')
            f.write(body)
            f.write(';\n')
        print(f'wrote {path} ({self.w}x{self.h}, {len(self.buildings)} buildings)')
        return path

    def preview(self):
        for r in range(self.h):
            row = ''
            for c in range(self.w):
                pr = self.p[r][c]
                row += pr if pr != ' ' else self.g[r][c]
            print(row)


# ---------------------------------------------------------------- helpers

def interior(w, h, wall='W', floor='=', seed=1):
    """Room with back (north) and side walls; the south edge is open (cutaway)."""
    m = MapCanvas(w, h, ground=floor, height=0, seed=seed)
    m.rect(0, 0, w, 2, ground=wall)
    m.rect(0, 0, 1, h, ground=wall)
    m.rect(w - 1, 0, 1, h, ground=wall)
    return m


def cave(m, x, y, w, h, wall='C', floor='c', fill=0.46, steps=4):
    """Cellular-automaton cave inside a rect (wall chars where solid)."""
    cells = [[m.rng.random() < fill for _ in range(w)] for _ in range(h)]
    for _ in range(steps):
        nxt = [[False] * w for _ in range(h)]
        for j in range(h):
            for i in range(w):
                n = 0
                for dj in (-1, 0, 1):
                    for di in (-1, 0, 1):
                        if di == 0 and dj == 0:
                            continue
                        ii, jj = i + di, j + dj
                        if ii < 0 or jj < 0 or ii >= w or jj >= h or cells[jj][ii]:
                            n += 1
                nxt[j][i] = n >= 5 or (n >= 4 and cells[j][i])
        cells = nxt
    for j in range(h):
        for i in range(w):
            m.set(x + i, y + j, wall if cells[j][i] else floor)


def carve(m, points, width=3, ground='c', height=None):
    """Guarantee a walkable corridor along points (wobbly)."""
    for (a, b) in zip(points, points[1:]):
        steps = max(abs(b[0] - a[0]), abs(b[1] - a[1]), 1)
        for s in range(steps + 1):
            t = s / steps
            cx = a[0] + (b[0] - a[0]) * t + m.rng.choice([-1, 0, 0, 1]) * 0.5
            cy = a[1] + (b[1] - a[1]) * t + m.rng.choice([-1, 0, 0, 1]) * 0.5
            r = width / 2
            for j in range(int(cy - r - 1), int(cy + r + 2)):
                for i in range(int(cx - r - 1), int(cx + r + 2)):
                    if (i + 0.5 - cx) ** 2 + (j + 0.5 - cy) ** 2 <= r * r:
                        m.set(i, j, ground, height)
