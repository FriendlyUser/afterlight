"""Reachability check for map layouts: BFS over the same walkability rules as
src/world/MapBuilder.js (walls/void/deep water block, solid props block,
building footprints block except their door tile, height steps <= 1 unless stairs).

Usage: python3 tools/reach.py <layout_id> [start_spot] — prints unreachable spots.
"""
import json, os, sys
from collections import deque

ROOT = os.path.join(os.path.dirname(__file__), '..')
BLOCK_GROUND = set('#CBWSPTRIUK ~vl')
DECOR = set(' .ofgnmGxdjq')
HCH = '0123456789abcdefghijklmnopqrstuvwxyz'


def load(mid):
    s = open(os.path.join(ROOT, 'src/data/maps/layouts', mid + '.js')).read()
    return json.loads(s[s.index('export default ') + 15:].rstrip().rstrip(';'))


def walk_grid(d):
    w, h = d['w'], d['h']
    g, p = d['ground'], d['props']
    hg = d.get('height') or ['0' * w] * h
    stairs = {(s['x'], s['y']) for s in d.get('stairs', [])}
    ok = [[g[y][x] not in BLOCK_GROUND and (y >= len(p) or x >= len(p[y]) or p[y][x] in DECOR) for x in range(w)] for y in range(h)]
    for b in d.get('buildings', []):
        door = (b['x'] + b['door'].get('dx', b['w'] // 2), b['y'] + b['d'] - 1) if b.get('door') else None
        for y in range(b['y'], b['y'] + b['d']):
            for x in range(b['x'], b['x'] + b['w']):
                if (x, y) != door and 0 <= y < h and 0 <= x < w:
                    ok[y][x] = False
    for s in d.get('structures', []):
        if s['type'] == 'beacon':
            ok[s['y']][s['x']] = False
        if s['type'] == 'lantern':
            for y in range(s['y'] - 1, s['y'] + 2):
                for x in range(s['x'] - 1, s['x'] + 2):
                    ok[y][x] = False
    level = lambda x, y: HCH.index(hg[y][x]) if hg[y][x] in HCH else 0
    return ok, level, stairs


def reachable(d, start):
    ok, level, stairs = walk_grid(d)
    w, h = d['w'], d['h']
    seen = {tuple(start)}
    q = deque([tuple(start)])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not (0 <= nx < w and 0 <= ny < h) or (nx, ny) in seen or not ok[ny][nx]:
                continue
            if abs(level(nx, ny) - level(x, y)) > 1 and (nx, ny) not in stairs and (x, y) not in stairs:
                continue
            seen.add((nx, ny))
            q.append((nx, ny))
    return seen


if __name__ == '__main__':
    mid = sys.argv[1]
    d = load(mid)
    start = d['spots'][sys.argv[2] if len(sys.argv) > 2 else next(iter(d['spots']))]
    seen = reachable(d, start)
    bad = {k: v for k, v in d['spots'].items() if tuple(v) not in seen}
    # A spot that is itself solid (e.g. an NPC on a prop) counts as reachable if a neighbour is.
    bad = {k: v for k, v in bad.items() if not any((v[0] + a, v[1] + b) in seen for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    print(f"{mid}: {len(seen)} tiles reachable; unreachable spots: {bad or 'none'}")
