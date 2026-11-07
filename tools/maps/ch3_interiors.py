"""Aurenne interiors (Chapter 3): the Ringing Bell inn, Bellwright's shop, the
Cathedral of Dawn (nave, Cassian's study, the Choir archives), Tolliver's bell
tower, the Venn house and the Low Town almshouse.

Convention: walls N/W/E, open south edge; the exit row is the bottom row and
the arrival tile is one row above it.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import interior


def props(m, items):
    for (x, y, p) in items:
        m.set(x, y, prop=p)


# --- The Ringing Bell (inn & tavern) ---------------------------------------
m = interior(15, 11, wall='T', floor='=', seed=31)
m.rect(1, 2, 5, 3, ground='+')                       # behind the bar
props(m, [(1, 2, 'O'), (2, 2, 'O'), (3, 2, 'H'), (4, 2, 'H'), (2, 4, '='), (3, 4, '='), (4, 4, '='), (5, 4, '='),
          (7, 2, '^'), (10, 2, 'E'), (12, 2, 'E'), (11, 2, 'k'), (13, 2, 'H'), (13, 5, 'u'),
          (8, 5, '='), (7, 5, 'j'), (9, 5, 'j'), (11, 7, '='), (10, 7, 'j'), (12, 7, 'j'),
          (3, 7, '='), (2, 7, 'j'), (4, 7, 'j'), (1, 9, 'C'), (13, 9, 'O'), (6, 2, 'q')])
m.rect(6, 10, 3, 1, ground='x')
m.spot('entry', 7, 9); m.spot('marta', 3, 3); m.spot('lark', 13, 7); m.spot('bed_wren', 10, 3); m.spot('bed_ilse', 12, 3)
m.write('c3_inn')

# --- Bellwright Arms & Sundries ----------------------------------------------
m = interior(11, 8, wall='P', floor='=', seed=32)
props(m, [(1, 2, 'H'), (2, 2, 'H'), (8, 2, 'H'), (9, 2, 'H'), (4, 3, '='), (5, 3, '='), (6, 3, '='),
          (9, 4, 'a'), (1, 5, 'C'), (9, 6, 'O'), (1, 4, 'O'), (3, 2, '^'), (7, 2, '^')])
m.spot('entry', 5, 6); m.spot('oswin', 5, 2)
m.write('c3_shop')

# --- The Cathedral of Dawn: nave ---------------------------------------------
m = interior(23, 21, wall='K', floor='M', seed=33)
m.rect(7, 2, 9, 3, height=1)                         # the altar dais
m.stair(10, 4, 3, 1)
m.rect(10, 5, 3, 16, ground='x')                     # the long aisle
m.rect(8, 2, 7, 2, ground='x', height=1)
m.set(3, 1, ground='M'); m.set(19, 1, ground='M')    # doors: study (W), archives (E)
props(m, [(11, 2, 'S'), (8, 2, '^'), (14, 2, '^'), (2, 2, 'q'), (4, 2, 'q'), (18, 2, 'q'), (20, 2, 'q'),
          (7, 4, 'q'), (15, 4, 'q')])
for y in (6, 10, 14, 18):
    m.set(5, y, prop='|'); m.set(17, y, prop='|')
for y in (8, 11, 14, 17):
    for x in (6, 7, 8):
        m.set(x, y, prop='=')
    for x in (14, 15, 16):
        m.set(x, y, prop='=')
for y in (5, 9, 13, 17):
    m.set(1, y, prop='^'); m.set(21, y, prop='^')
m.spot('entry', 11, 19); m.spot('imre', 9, 6); m.spot('altar', 11, 3); m.spot('study_door', 3, 2); m.spot('archive_door', 19, 2)
m.write('c3_cathedral')

# --- Cassian's study ------------------------------------------------------------
m = interior(13, 10, wall='P', floor='+', seed=34)
m.rect(4, 6, 5, 2, ground='X')
props(m, [(1, 2, 'H'), (2, 2, 'H'), (3, 2, 'H'), (9, 2, 'H'), (10, 2, 'H'), (11, 2, 'H'),
          (5, 4, '='), (6, 4, '='), (7, 4, '='), (11, 5, 'S'), (1, 5, '^'), (11, 7, 'O'), (1, 7, 'k'),
          (5, 2, 'q'), (7, 2, 'q')])
m.spot('entry', 6, 8); m.spot('cassian', 6, 3); m.spot('painting', 6, 1); m.spot('window', 8, 3)
m.write('c3_study')

# --- The Choir archives -----------------------------------------------------------
m = interior(17, 12, wall='S', floor='+', seed=35)
m.rect(11, 2, 5, 4, ground='X')                       # the restricted alcove (rope at 13,6)
props(m, [(1, 2, 'H'), (2, 2, 'H'), (3, 2, 'H'), (4, 2, 'H'), (5, 2, 'H'), (8, 2, '^'),
          (2, 5, 'H'), (3, 5, 'H'), (4, 5, 'H'), (5, 5, 'H'),
          (2, 8, 'H'), (3, 8, 'H'), (4, 8, 'H'), (5, 8, 'H'),
          (10, 6, 'H'), (11, 6, 'H'), (12, 6, 'H'), (14, 6, 'H'), (15, 6, 'H'),
          (10, 2, 'H'), (10, 3, 'H'), (10, 4, 'H'), (10, 5, 'H'),
          (11, 2, 'H'), (12, 2, 'H'), (14, 2, 'H'), (15, 2, 'H'),
          (8, 5, '='), (9, 5, '='), (11, 9, '='), (12, 9, '='), (10, 9, 'j'), (13, 9, 'j'), (1, 10, 'k'), (15, 10, 'C')])
m.spot('entry', 8, 10); m.spot('quill', 8, 4); m.spot('rope', 13, 6)
m.write('c3_archives')

# --- Tolliver's bell tower (ground floor) ------------------------------------
m = interior(9, 9, wall='S', floor='_', seed=36)
props(m, [(1, 2, 'E'), (2, 2, 'k'), (7, 2, 'H'), (4, 4, '='), (5, 4, 'j'), (7, 4, 'a'), (1, 6, 'O'), (7, 6, 'C'), (4, 2, '^')])
m.rect(3, 2, 3, 1, ground='+')
m.spot('entry', 4, 7); m.spot('tolliver', 4, 3); m.spot('rope', 6, 2)
m.write('c3_tolliver')

# --- The Venn house ---------------------------------------------------------------
m = interior(11, 8, wall='P', floor='X', seed=37)
props(m, [(1, 2, 'H'), (2, 2, 'H'), (9, 2, 'E'), (5, 2, 'q'), (8, 4, 'S'), (3, 4, '='), (4, 4, '='), (2, 4, 'j'),
          (1, 6, 'B'), (9, 6, 'B'), (6, 2, '^')])
m.spot('entry', 5, 6); m.spot('orsolya', 6, 3); m.spot('portrait', 4, 1); m.spot('armor', 8, 4)
m.write('c3_venn')

# --- The almshouse of the Sisters of Small Mercies --------------------------------
m = interior(14, 10, wall='S', floor='_', seed=38)
for x in (2, 4, 6, 8, 10):
    m.set(x, 2, prop='E')
for x in (8, 10):
    m.set(x, 5, prop='E')
props(m, [(12, 3, 'u'), (12, 5, 'k'), (12, 6, 'O'), (2, 5, '='), (3, 5, '='), (1, 7, 'C'), (1, 2, '^'), (12, 2, '^'), (5, 6, 'j')])
m.rect(5, 9, 3, 1, ground='x')
m.spot('entry', 6, 8); m.spot('constance', 3, 4); m.spot('ledger', 2, 5); m.spot('soup', 12, 4)
m.write('c3_almshouse')
