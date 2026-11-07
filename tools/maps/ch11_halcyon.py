"""The Halcyon — Corvin's airship, the party's mobile base in Act III.
Writes halcyon_deck (the open deck) and c11_halcyon_hold (below decks)."""
from ch11_kit import sky, interior

# ------------------------------------------------------------------ the deck
m = sky(26, 19, seed=111)
# Hull: a long ellipse of planks floating in the void, bow to the east.
m.ellipse(13, 8.5, 12.2, 5.2, ground='=', height=2)
m.ellipse(23.5, 8.5, 2.6, 2.6, ground='=', height=2)          # rounded bow
m.rect(1, 5, 6, 8, ground='+', height=3)                       # quarterdeck (stern)
m.rect(20, 6, 5, 6, ground='+', height=3)                      # forecastle (bow)
m.set(25, 8, ground='+', height=3); m.set(25, 9, ground='+', height=3)
# Railing along the hull edge, with gaps for the gangplank and stair landings.
for y in range(m.h):
    for x in range(m.w):
        if m.g[y][x] == ' ':
            continue
        edge = any(not m.inside(x + dx, y + dy) or m.g[y + dy][x + dx] == ' '
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        if edge:
            m.set(x, y, prop='F')
# Gangplank off the port side (south)
m.rect(12, 13, 2, 6, ground='=', height=2)
for x in (12, 13):
    m.set(x, 13, prop=' ')
m.set(11, 17, prop='L'); m.set(14, 17, prop='L')
# Deckhouse with the hatch below
m.building(10, 3, 6, 2, wall='wall_wood', roof='roof_red', h=2.0,
           door={'dx': 3, 'to': 'c11_halcyon_hold', 'tx': 11, 'ty': 9, 'dir': 'up'}, windows=[1, 4])
# Masts and rigging
m.set(8, 7, prop='|'); m.set(17, 7, prop='|')
m.set(8, 6, prop='q'); m.set(17, 6, prop='q')
# Helm on the quarterdeck, lanterns, cargo
m.set(3, 8, prop='S')                                          # the wheel-post
for (x, y) in [(2, 6), (2, 11), (21, 7), (21, 10)]:
    m.set(x, y, prop='^')
for (x, y) in [(6, 5), (5, 11), (9, 11), (10, 11), (15, 11), (18, 5), (19, 5)]:
    m.set(x, y, prop='O')
for (x, y) in [(16, 11), (17, 11), (20, 11)]:
    m.set(x, y, prop='C')
m.set(19, 11, prop='k')
m.set(22, 8, prop='$')                                         # Hearthstone on the forecastle
m.set(14, 13, prop='s')                                        # gangplank sign
m.spot('entry', 12, 8); m.spot('helm', 4, 8); m.spot('hatch', 13, 6)
m.spot('ilse', 9, 9); m.spot('bram', 23, 9); m.spot('pip', 17, 8); m.spot('sable', 2, 9)
m.spot('mags', 19, 9); m.spot('bow', 24, 8); m.spot('stern', 2, 8)
m.spot('gangplank', 12, 18)
m.write('halcyon_deck')
m.preview()

# ------------------------------------------------------------------ below decks
h = interior(24, 11, wall='W', floor='=', seed=112)
for x in (6, 12, 18):                                          # cabin partitions
    h.rect(x, 0, 1, 5, ground='W')
# Corvin's cabin
h.set(1, 2, prop='E'); h.set(2, 2, prop='H'); h.set(4, 3, prop='='); h.set(3, 3, prop='j'); h.set(5, 2, prop='^')
h.set(1, 5, prop='O')
# Galley & Ilse's infirmary
h.set(7, 2, prop='u'); h.set(8, 2, prop='H'); h.set(10, 2, prop='H'); h.set(9, 4, prop='=')
h.set(8, 4, prop='j'); h.set(10, 4, prop='j'); h.set(11, 2, prop='k')
# Bunks
h.set(13, 2, prop='E'); h.set(15, 2, prop='E'); h.set(17, 2, prop='E'); h.set(14, 2, prop='^')
h.set(13, 5, prop='k'); h.set(17, 5, prop='O')
# Engine room & forge
h.set(19, 2, prop='u'); h.set(20, 2, prop='a'); h.set(22, 2, prop='O'); h.set(22, 3, prop='C')
h.set(22, 6, prop='C'); h.set(21, 2, prop='^')
h.rect(11, 10, 2, 1, ground='x')
h.spot('entry', 11, 9); h.spot('nell', 20, 4); h.spot('forge', 20, 2); h.spot('chart', 4, 3)
h.spot('bunk', 15, 2); h.spot('stove', 7, 2)
h.write('c11_halcyon_hold')
h.preview()
