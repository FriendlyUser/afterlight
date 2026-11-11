# Afterlight — Content Authoring Guide

Everything a chapter author needs: where files live, the map/script/enemy formats,
conventions, and how to test. Read `docs/STORY.md` first — it is the story bible.

The game is plain ES modules + three.js, no build step. Serve the folder
(`python3 -m http.server 8765` from the project root; a server is usually already
running on 8765) and open `http://localhost:8765/`.

**Types:** data and scripts are type-checked (`tools/npm.sh run typecheck`; CI runs it
before every deploy). Give new content its type with JSDoc, as the existing files do:
`/** @type {import('../../types/data').MapDef} */` on a map object,
`/** @type {import('../types/data').StoryScripts} */` on a story object (its methods
then get `s` typed as the script context), `ContentPack` on a pack's default export.
The shapes, with every optional field the engine reads, are in `src/types/data.d.ts`;
add a field there when the engine learns to read a new one. Keep only scripts
(`async (s, ...args)`) in story objects; helpers that build scripts or definitions go
next to them as plain exported functions.

---

## 1. Chapter layout & contracts

| # | Chapter (card title) | Pack file | Entry map (x,y,dir) | Enemy Lv | Gear tier |
|---|---|---|---|---|---|
| 0 | Prologue — The Eve of Kindling | (done) `story/prologue.js` | `lf_wren_house` | 1–5 | 1 |
| 1 | The Kindling | (done) `story/ch1.js` | `lf_nana_house` | 5–7 | 1 |
| 2 | The Wider World | `content/ch2.js` | `port_gale` (10,20,up) | 6–11 | 2 |
| 3 | City of Bells | `content/ch3.js` | `aurenne` (20,38,up) | 12–16 | 3 |
| 4 | The Pilgrim Road (desert, mountains) | `content/ch4a.js` | `sunscar_road` (4,20,right) | 16–25 | 4 |
| 4 | The Pilgrim Road (swamp, forest, sky) | `content/ch4b.js` | `mirefen_road` (4,20,right) | 23–33 | 5 |
| 5 | The Last Sunset | `content/ch5.js` | `lf_sunset` (23,30,up) | 33–35 | 5 |
| 6 | Afterlight (Act II begins) | `content/ch6.js` | `shard_hermitage` (5,5,down) | 34–39 | 5 |
| 7 | The Mender of Ash | `content/ch7.js` | `ruined_aurenne` (20,38,up) | 38–43 | 6 |
| 8 | Children of the Wreck | `content/ch8.js` | `kiteholm` (4,20,right) | 42–47 | 6 |
| 9 | The Halcyon | `content/ch9.js` | `corvins_roost` (10,20,up) | 46–50 | 7 |
| 10 | Lysa | `content/ch10.js` | `noon_spire` (15,40,up) | 50–56 | 7 |
| 11 | Seven Wounds (Act III) | `content/ch11.js` | `halcyon_deck` (12,8,down) | 56–70 | 8 |
| 12 | Evernoon + Epilogue | `content/ch12.js` | `evernoon_gate` (20,40,up) | 70–80 | 8 |
| — | Post-game | `content/postgame.js` | `abyss_gate` | 75–99 | unique |

**Handoff rule:** the *last* script of your chapter shows the next chapter card and
teleports to the next entry map exactly as in this table:

```js
await s.fadeOut(1.5);
await s.chapter(3, 'City of Bells');
s.objective('...');
await s.teleport('aurenne', 20, 38, 'up');
```

Your chapter's entry map **must** exist with a walkable tile at the listed entry
coordinates. Put your chapter's opening scene in that map's `onEnter`, guarded by a flag.

**Flags** are prefixed by chapter: `c2_...`, `c3_...`, `c4_...`, etc.
Global flags you may read: `kindled`, `crestArtLearned` (set in ch2 by the Crestless
Sage: enables Tier-II Crests), `sundered` (set in ch5 at the end of the world),
`act3` (set at the start of ch11), `gameClear` (set after the ending).

### Party roster by chapter
- Ch2: Wren, Ilse, Bram, Sable (Lv ~7). Ch3: **Pip joins** (`s.join('pip')`; set
  `s.state.characters.pip.sealed = true` — he's too young to be Kindled).
- Ch4a: Pip receives an illegal early Kindling from Keeper Tamsin in Saltglass →
  `s.awaken('pip')`. **Corvin joins** in the Sunscar desert.
- Ch5 end (the Sundering): everyone but Wren leaves the party (`s.leave(id)`).
- Ch6: Wren alone (look `wren_ruin`). Ch7: Ilse rejoins (look `ilse_ruin`).
  Ch8: Pip (`pip_ruin`) and Bram (`bram_ruin`) rejoin. Ch9: Corvin rejoins.
  Ch10: Sable rejoins (`sable` look again after she chooses her name).
- When someone rejoins after a gap, call `s.state.characters.<id>.setLevel(n)` to an
  appropriate level first.

### Crest unlocks (story)
`s.learnCrest(id)` unlocks a Crest for the party. Base crests: ch2 Thistledown shop
sells Crest Stones; the Crestless Sage gifts `cantor` and sets `crestArtLearned`.
`gambler`: ch9 (Corvin). `gloamweaver` for everyone: ch10. `lanternkeeper`: ch11
(Ysolde's Remnant). `starseer`: ch11 side-quest. `sunforged`/`afterlight`: post-game/ch12.

---

## 2. Content packs

Each chapter file default-exports:

```js
export default {
  maps: [ /* map definitions (see §4) */ ],
  enemies: [ /* enemy defs (see §6) */ ],
  troops: { /* id: { enemies: [...], boss?, music?, bg? } */ },
  looks: { /* id: sprite look (see §7) */ },
  bossAI: { /* name: (ctx) => action */ },
  shops: { /* id: { name, items: [...] } */ },
  worldNodes: [ /* fast-travel destinations (see §8) */ ],
};
```

Keep big packs readable: put story scripts in `src/story/chN.js` (export an object of
async functions like `src/story/ch1.js`), map gameplay in the pack or in
`src/data/maps/chN_*.js`, and import them into your pack. **Only edit files you own**
(your pack, your story file(s), your map files, your `tools/maps/*.py` scripts, your
tests). Never edit shared engine files; if you need an engine feature, note it in your
final report.

---

## 3. Map layouts (tools/mapkit.py)

Layouts are generated by small Python scripts in `tools/maps/<id>.py` that write
`src/data/maps/layouts/<id>.js`. Run with `python3 tools/maps/<id>.py`.

```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from mapkit import MapCanvas, interior, cave, carve

m = MapCanvas(40, 30, ground='.', height=1, seed=5)   # w, h, default ground char + height
m.rect(x, y, w, h, ground=';', height=1, prop=None)   # fill a rectangle
m.ellipse(cx, cy, rx, ry, ground='s', height=0, jitter=0.2)
m.path([(x0,y0), (x1,y1), ...], width=2, ground=':')   # roads
m.ragged_edge('n', 3, '#')                             # organic border band
m.border('#')                                          # 1-tile wall around the map
m.scatter(x, y, w, h, ['T','b','f'], 0.1, on='.,')     # random props on given ground chars
m.set(x, y, ground=None, height=None, prop='L')        # single tile
m.ramp(x, y, length, 'n'|'s'|'e'|'w', start_h, end_h, width=1, ground=':')  # walkable slope
m.building(x, y, w, d, wall='wall_timber', roof='roof_red', h=2.6,
           door={'dx': 2, 'to': 'map_id', 'tx': 4, 'ty': 7, 'dir': 'up'}, windows=[0, 3])
m.structure('lantern'|'tent'|'arch'|'beacon', x, y, ...)  # 3D set pieces
#   lantern: the Lantern tower (doorTo, tx, ty, dir, unlockFlag, lit=False for a dark tower)
#   beacon: glowing lamp on a pedestal (lit, color='#ffd27a') — shrines, Dawnstone housings
m.spot('name', x, y)                                   # named coordinate (exported as L.spots.name)
m.write('map_id'); m.preview()                          # write + print ASCII preview
```
Helpers: `interior(w, h, wall='W', floor='=')` (walls N/W/E, open south edge for the
cutaway view; put the exit on the bottom row), `cave(m, x, y, w, h)` cellular cave,
`carve(m, points, width=3)` guaranteed corridor through a cave.

**Coordinates:** x → east, y → south. The camera looks north, so the bottom of the
map is nearest the viewer. Put tall stuff (cliffs, forests, buildings) toward the top
or edges; keep the south edge open/low. Pad outdoor maps with trees/cliffs/water so
the void isn't visible; for coasts use `backdrop: 'ocean'` in the map file.

### Ground chars (height is per tile, 0–9 = 0.5 world units each)
| char | terrain | | char | terrain |
|---|---|---|---|---|
| `.` | grass | | `,` | dark grass |
| `"` | tall grass (auto tufts) | | `k` | autumn grass |
| `q` | dead grass | | `:` | dirt path |
| `d` | dirt | | `;` | cobblestone |
| `_` | stone floor | | `M` | marble |
| `=` | wood planks | | `+` | dark planks |
| `s` | sand | | `*` | snow |
| `m` | mud | | `c` | cave floor |
| `r` | ruin tiles | | `g` | saltglass (desert) |
| `a` | ash (post-Sundering) | | `i` | ice |
| `o` | moss stone | | `x` / `X` | red / blue carpet |
| `u` | gloam ground | | `l` | lava (solid, glows) |
| `~` | deep water (blocks) | | `w` | shallow water (walkable) |
| `p` | swamp water (shallow) | | ` ` / `v` | void (nothing) |
| `#` | rock cliff wall | | `C` | cave wall |
| `B` | brick wall | | `W` | wood wall |
| `S` | stone wall | | `P` | plaster wall |
| `T` | timber wall | | `R` | ruin wall |
| `I` | ice wall | | `U` | gloam wall |
| `K` | marble wall | | | |

Walls are solid blocks raised above the tile height. Walking between tiles is allowed
when heights differ by ≤ 1 level, or across `ramp`/`stair` tiles.

What the renderer adds on its own (`world/MapBuilder.js`), so maps need no extra chars:
- **Stairs** (`ramp`/`stair` tiles) are drawn as steps: each climbing tile gets a
  half-step toward the tile above it and riser faces matched to its ground (stone,
  marble, wood, ruin, cave, or timber-edged earth for natural ground), and feet climb
  them smoothly (`TileGrid.surfaceAt`). A stair tile with nothing higher beside it
  stays flat (a landing).
- **Ground transitions**: where two grounds meet on one level, the more natural one
  spills a ragged edge over the other (snow > grasses > moss > dead grass > ash >
  sand > path > dirt > mud; cobble, ruin, cave, ice and saltglass receive; paving,
  marble, wood and carpet stay crisp). Grassy and snowy cliff tops hang a ragged lip.
- **Water** knows its distance to the shore and its depth: shallows are clear, deep
  water opaque, wavelets drift, foam breathes on the shore. Shallow `w` pools one tile
  wide keep open water in the middle.
- **Trees, bushes, rocks, cacti and crystals** are nudged off the tile center, sized and
  mirrored a little differently (the same every load), so rows read as growth.

### Prop chars
`T` tree (or `treeType` of the map) · `P` pine · `Y` palm · `D` dead tree · `K` cherry ·
`Z` gloam-crystal tree · `b` bush · `B` flowering bush · `R` rock · `o` pebble* ·
`f` flowers* · `g` grass tuft* · `n` reeds* · `m` mushroom* · `G` glowing mushroom* ·
`A` stalagmite · `*` crystal (blue light) · `%` gloam crystal (violet light) ·
`L` lamp post (lit at night) · `^` torch · `@` campfire · `F` fence · `O` barrel ·
`C` crate · `k` sack · `h` hay bale · `W` well · `t` tombstone · `S` statue · `|` pillar ·
`!` broken pillar · `c` cactus · `x` bones* · `d` debris* · `E` bed · `H` bookshelf ·
`=` table · `j` chair* · `u` cauldron · `a` anvil · `q` banner* · `Q` fountain ·
`$` Hearthstone (save point + heal) · `s` sign (text from `signs`) · `V` boat.
(* = decorative, not solid.) `treeType` options: `tree`, `tree_autumn`, `tree_cherry`,
`pine`, `pine_snow`, `palm`, `tree_dead`, `tree_crystal`.

Building wall textures: `wall_timber wall_plaster wall_stone wall_brick wall_wood
wall_ruin wall_marble wall_ice wall_gloam`. Roofs: `roof_red roof_blue roof_green
roof_slate roof_thatch`.

---

## 4. Map gameplay definitions

```js
import L from '../maps/layouts/port_gale.js';
export const portGale = {
  ...L,                              // ground/height/props/buildings/structures/stairs/spots
  id: 'port_gale', name: 'Port Gale', region: 'The Gale Coast',
  mood: 'day',                       // or (state) => 'dusk'
  music: 'town',                     // or (state) => ...
  backdrop: 'ocean',                 // optional: 'ocean' | { plane: '#color', y } | (state) => ...
  battleBg: 'road',                  // default battle background
  treeType: 'pine', particles: 'leaves', camera: { dist: 20, pitch: 0.68 },
  noSave: false, noMenu: false, noTravel: false,   // set noTravel: true in dungeons (disables menu fast travel)
  solo: false,                                     // true for dreams/visions: no party followers
  noMinimap: false,                                // true where a floor plan would spoil a puzzle or a reveal
  scatter: { types: ['rock_small', 'bones'], density: 0.04, seed: 5 }, // optional non-solid floor decor
  encounters: { rate: 1, bg: 'road', onTiles: '"', cond: (st) => true,
                troops: [['troop_id', weight], ...] },
  signs: [{ x, y, text }],
  npcs: [{ id, name, look, x, y, dir, wander: 2, cond: (st) => bool, hint: 'Shop',
           talk: 'line' | ['lines'] | async (s, actor) => {},  // or run: async (s, actor) => {}
           noTurn: false }],
  chests: [{ id: 'unique_id', x, y, item: 'hi_tonic', count: 2 } | { id, x, y, gold: 300 }],
  inspect: [{ x, y, text: '...' } | { x, y, hint: 'Examine', run: async (s) => {}, cond }],
  exits: [{ x, y, w: 1, h: 3, to: 'map_id', tx, ty, dir, cond: (st) => bool,
            blocked: async (s) => {} }],   // to: '@world' opens the world map
  triggers: [{ id, x, y, w, h, once: true, cond: (st) => bool, run: async (s) => {} }],
  blockers: [{ id, x, y, w: 1, h: 1, prop: 'rock'|'crate'|'barrel'|'statue'|'pillar'|'crystal_gloam'|..., cond }],
                                     // solid until a script calls s.clearBlocker(id) (persists)
  onEnter: async (s) => {},          // runs every time the map loads (guard with flags!)
};
```
Moods: `day morning dusk night storm interior cave forest desert snow swamp temple ruin
gloam evernoon` (`ruin` draws the seven burning sun-wounds in the sky). Music ids: `title lanternfall kindling field sea forest town aurenne cave
tension battle boss victory sad cassian ruin desert snow swamp gloam evernoon finalboss
afterlight inn gameover airship resolve remnant abyss`. Battle backgrounds: `grass beach beach_night cave tidecave
forest wold road fields town undercroft desert snow swamp verdance sky temple deck ruin
gloam evernoon lantern`.

Interiors: use `mood: 'interior'`, `camera: { dist: 15, pitch: 0.75 }`, `noBanner: true`,
and an exit row on the bottom edge back to the town door. Town doors are created by
`m.building(..., door={...})`; the door tile is the building's bottom row at `x+dx`.
Arriving in town from an interior, place the player one tile south of the door.

Every town should have: an inn (`await s.inn(price, 'name')`), a shop
(`await s.shop('shop_id')`), a Hearthstone (`$`), 8–20 NPCs with personality, a few
`inspect` points, and a side quest or two. Dungeons: chests (6–12), a Hearthstone
before the boss, 1–3 puzzles/branches, encounters, a boss.

---

## 5. Script API (`s` in every script)

Dialogue: `await s.say(name, text | [lines], opts)` (opts: `{ style: 'thought'|'narration'|'system', speed, portrait: false }`),
`await s.narrate(lines)`, `await s.think(name, text)`, `await s.system(text)`,
`await s.choice(['A','B'], { prompt, cancel })` → index, `await s.confirm(prompt)` → bool.
Markup in text: `*gold highlight*`, `_italic_`, `{red|colored}` (red/blue/green/purple/dim).
Portraits appear automatically for main-cast names and LOOKS ids matching the
speaker's first name in lowercase.

**Conditional lines (the line language, `src/script/Lines.js`).** Wherever lines go —
`s.say`, `s.narrate`, `s.think`, `s.talk`, an NPC's `talk` — an entry can be data
instead of a string, so a scene needs no `if` around every line:

```js
await s.say('Garrick', [
  'You came.',
  { if: 'party:bram', text: 'And you brought him.' },          // only if it holds
  { unless: 'c3_forks', by: 'Ilse', text: 'He stayed behind.' }, // someone else cuts in
  { if: 'item:tonic>=2 & !c2_cat_done', lines: ['…', '…'] },     // a conditional block
  { pick: [                                                      // first branch that holds;
    { if: 'var:c2_scare>=3', text: 'Three down.' },             // one without a condition
    { text: 'They are still out there.' },                      // is the fallback
  ] },
  cond && 'A JS condition works too: falsy entries are skipped.',
]);
```

- **Conditions** (`if` / `unless`): `'flag'`, `'!flag'`, `'flag=2'`, `'party:bram'`,
  `'item:tonic'`, `'item:tonic>=2'`, `'quest:c2_cat'` (known), `'quest:c2_cat=done'`,
  `'var:c2_scare>=3'`, `'gold>=100'`, `'chapter>=3'`, `'level>=10'` (average active
  level), joined with `&` and `|` (`&` binds tighter, no parentheses). A flag whose name
  has a colon is `'flag:chest:map:id'`. For anything else: `{ all: […] }`,
  `{ any: […] }`, `{ not: … }`, or a function `(st) => bool`. A condition the reader
  cannot parse throws, so a typo fails loudly. `s.test(cond)` checks one in script code.
- **`s.talk([...])`** is a conversation as data: each string names its speaker,
  `'Ilse: You\'re late.'`; a bare string is narration; `'Wren (thought): …'` is a thought.
  Use `{ by: 'Name', text }` when a line itself begins with `Word: `.
- **Choices and effects inside lines:** `{ ask: 'Stay?', id: 'stay', options: [{ text:
  'Stay.', set: 'c12_stayed', lines: […] }, { text: 'Wake up.', if: '!locked' }] }` (options
  whose condition fails are hidden; `say`/`talk` resolve to `{ stay: pickedIndex }`),
  `{ set: 'flag' }`, `{ run: async (s) => { … } }`.
- **Text tokens** keep a line's text fixed whatever the values (unlike a `${}` template
  string): `{gold}`, `{var:name}`, `{item:id}` (count carried), `{name:charId}`.
- **Timing tags** inside a line: `{wait=0.4}` (seconds), `{speed=0.5}` (multiplier from
  there on), `{shake=0.3}`, `{sfx=bell}`. They never show, and a player who skips the
  typing skips them.
- Lines are type-checked (`LineSpec` in `src/types/data.d.ts`): a misspelled key is an error.

**Skipping.** A player can hold Menu for a second to skip any scene. The skip
fast-forwards your script — lines go to the backlog, waits, walks and fades finish at
once, `s.give` popups become toasts — so it ends in the same state as watching, and it
stops by itself at a choice, a battle, a shop or any other menu. Two things follow for
authors: keep everything a scene does on the game clock (`s.wait`, `s.move`, `s.fadeOut`;
never `setTimeout`), and call `s.noSkip()` at the top of the rare scene that must be
seen (it lasts until that scene ends).

**Voices.** Speakers type in their own blip voice (`src/data/voices.js`: add a named
profile for anyone important; everyone else gets a steady one from their name). Every
line also has a stable voice id, and a recording listed in `voice/manifest.json` plays
instead of the blips — see `voice/README.md`. To keep ids stable, prefer text tokens to
template strings, and give a line an explicit id (`{ text, voice: 'wren/oath' }`) if its
recording must survive rewording.

Actors: `s.spawn(id, look, x, y, dir, opts)` (look = LOOKS id or object),
`s.remove(id)`, `s.show(id, bool)`, `s.refreshNpcs()` (NPC `cond`s are also re-checked
automatically after every scene ends), `await s.move(id, [[x,y],...], speed)`,
`await s.step(id, dx, dy)`, `s.face(id, dir | otherActorId)`, `s.place(id, x, y, dir)`,
`await s.hop(id)`, `await s.emote(id, '!'|'?'|'…'|'♪')`. Use id `'player'` for the leader.

Camera & fx: `await s.pan(x, y, sec)`, `await s.follow(sec)`, `await s.zoom(dist, sec)`,
`s.shake(intensity, sec)`, `s.flash(color, sec)`, `await s.fadeOut(sec, color)`,
`await s.fadeIn(sec)`, `await s.wait(sec)`, `await s.chapter(n, title)`,
`await s.card(title, subtitle, holdSec)`, `s.banner(title, sub)`, `s.toast(html)`.

Audio: `s.music(id)`, `s.stopMusic(fade)`, `s.sfx(id)` (cursor confirm cancel item chest
save join surprise rumble bolt holy dark heal revive buff debuff quake burst slash...).

State: `s.flag(name)`, `s.setFlag(name, value=true)`, `s.vars` (object),
`await s.give(itemId, n)`, `await s.take(itemId, n)`, `s.has(itemId, n)`,
`await s.gold(n)`, `await s.join(charId, quiet)`, `s.leave(charId)`,
`await s.learnCrest(crestId)`, `s.awaken(charId)`, `s.setLook(charId, lookId)`,
`s.heal()`, `s.objective(text)`, `s.journal(text)`, `s.clearBlocker(id)`, `s.worldMap()`,
`s.quest(id, title, desc)` / `s.quest(id, null, null, 'done')` (side-quest log in the Journal),
`await s.fish(region)` fishing minigame at a spot — use an inspect point facing water:
`{ x, y, hint: 'Fish', run: (s) => s.fish('sea'|'river'|'oasis'|'swamp'|'ice'|'void') }`
(add 1–3 spots per region); an angler NPC can use `import { anglerTalk } from '../../story/fishing.js'`
→ `run: (s) => anglerTalk(s, 'Angler Name')` (rewards for species caught),
`s.state` (full GameState).

Flow: `await s.battle(troopId, { bg, music, loseOk, canFlee })` → `'win'|'lose'|'flee'`
(a loss returns to title unless `loseOk`), `await s.teleport(mapId, x, y, dir)`,
`await s.shop(shopId)`, `await s.inn(price, name)`, `await s.saveMenu()`.

**Script rules:** guard one-shot scenes with flags at the top; set the flag
immediately. Keep scenes tight: short lines, subtext, humor in the dark (see the tone
guide in STORY.md). Always end a story beat by updating `s.objective(...)` and add a
`s.journal(...)` line in Wren's voice.

---

## 6. Enemies & troops

```js
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });
E('dune_scorpion', 'Dune Scorpion', 17, { type: 'scorpion', color: '#c8a050', eye: '#ff4040' }, {
  stats: { hp: 1.1, str: 1.1, def: 1.3, spd: 0.9 },   // multipliers on the level curve
  weak: ['ice', 'blunt'], resist: { fire: 0.5 }, immune: ['poison'], poise: 3,
  skills: [['attack', 3], ['e_sting', 2]],              // weighted default AI
  drops: [['hi_tonic', 0.2], ['saltglass', 0.3]], steal: ['antidote', 'hunters_eye'],
  desc: 'Bestiary text — one or two evocative sentences.',
});
```
Stats come from the level curve in `data/enemies.js` (`enemyStats`). Typical
multipliers 0.6–1.6. **Bosses**: `boss: true`, `stats: { hp: 8–20, exp: 6–10, gold: 6–10, cp: 4 }`,
`poise: 5–10`, `ai: 'script_name'` (define in your pack's `bossAI`), optional
`summons: ['enemy_id']`. Damage types: `slash pierce blunt fire ice bolt wind light dark`.
Every enemy needs 1–3 weaknesses (that's the core of the Break system).

Sprite types (MonsterFactory): `slime hound boar bird bat crab serpent insect spider plant
mushroom golem wisp ghost skeleton eye treant elemental horror drake mimic scorpion knight
humanoid angel bell storm orrery angler`. Fields: `color`, `accent`, `eye`, `size` (1, 1.5, 2, 3, 4; bosses 2–4),
`seed` (varies the shape). `humanoid` uses `look: 'looks_id' | {look object}`; `knight`
uses `color`, `accent`, `weapon`. Palette swaps of the same type at different levels are
encouraged (classic JRPG practice) — give them distinct names.

Enemy skills (`data/skills.js`, prefix `e_`): `e_bite e_claw e_tackle e_slam e_sting
e_spit e_howl e_peck e_gust e_spore e_ember e_firebreath e_frost e_icebreath e_spark
e_thunder e_dark e_darkwave e_drain e_heal e_healall e_buff e_shell e_poison e_blind
e_silence e_sleep e_stun e_sweep e_rampage e_cleave e_crush e_quake e_charge e_steal
e_arrow e_volley e_spear e_slash e_holy e_holyall e_doom e_gravity e_tidal e_constrict
e_wail e_mpdrain e_selfdestruct e_summon e_bigbreath e_vesper e_stillness e_noon e_lament
e_mark e_bulwark e_quicken e_web e_tangle e_soot e_cleanse e_rally e_enrage e_gather e_flee`,
plus `attack`. Party skills can also be used by enemies (e.g. `blizzard`, `holy`).

How ordinary foes choose (`battle/EnemyMind.js`): each skill's weight is bent by how much
sense it makes this turn (heals only for the hurt, no re-inflicting an ailment already
on a target or tried on someone immune, whole-party moves while the party is whole,
finishing blows, elements the target resists avoided), then the target is judged the
same way. Judgement scales with difficulty (`JUDGEMENT`) and level (`judgementOf`:
low-level critters are dimmer). `traits` on an enemy adds
behavior: `pack` (packmates pile onto one quarry, or a Marked party member; hounds are
packs by default), `thief` (steals with `e_steal`, then runs; felling it returns the
gold), `enrage` (STR up once when badly hurt), `guardian` (shields the hurt/Broken; implied
by `e_bulwark`), `coward` (runs when last and hurt). Give a foe a role through its kit:
a healer (`e_heal`, `e_cleanse`), a leader (`e_mark`, `e_rally`), a support (`e_quicken`).
The Compendium writes the foe's tactics from the same kit (`data/monsterInfo.js`), so a
new enemy needs no extra text. `chapter` (a number, or `'side'`) puts it in a Compendium
section when its id has no `cN_` prefix.

Hunt marks (`data/hunt.js`, `content/hunt.js`, `story/hunt.js`): an entry in `MARKS` (its
enemy, act, `home` spot and for Act I an `after` spot, rumor, approach and reward), an
enemy with `mark: true` and a boss script, and a troop `hm_<id>`; the pack puts it on
its maps as a monster-look NPC and side6.js marks it blue.

Boss AI script (ctx): `c.turn`, `c.hpPct`, `c.partyAlive`, `c.allies`, `c.rnd()`,
`c.m` (memory object), `c.use(skillId, targets?)`, `c.pick([[skill, weight], ...])`,
`c.once(key)` (true the first time), `c.say(text)` (shown before the action). Return an
action; telegraph big attacks with `e_charge` the turn before. It puts the boss in the
`charging` status: its next damaging skill hits `CHARGE_POWER` (1.5×) harder, and Guard
halves it back — so a telegraphed hit should be survivable when guarded and dangerous
when not. Alternatively give the move its full power and telegraph it with a support
skill that sets `selfStatus: ['windup']` (a visible warning, no bonus; see
`postgame_battle.js`). Players and auto-battle both read these statuses. Breaking a
winding-up boss interrupts the move: the engine rolls back whatever memory keys your
script set on the wind-up turn (except `c.once()` keys), so keep "release next turn"
state in `c.m` and it just works.

Tuning rules of thumb (checked by the simulator, see below):
- Normal troops: a party at the troop's level should win ~100% in 2–4 rounds. Avoid boss
  AoEs (`e_lament`, `e_vesper`, `e_noon`, `e_bigbreath`) on normal enemies.
- Story bosses: ~70–100% for an auto-playing party of equal level; optional and
  post-game superbosses may be lower. Summoners should resummon only when their adds
  are gone, or fights turn into attrition.
- Multi-hit skills multiply: 12 hits × 62 power charged is 1,100 power. Add it up.

Check a troop with `EXTRA='only=^my_troop&n=16' tools/test.sh balance 600000`
(add `party=wren,ilse,bram,pip` for the story's actual line-up, `lvadj=-3` to test
an under-levelled party) and read one fight turn by turn with
`EXTRA='troop=my_troop&lv=40' tools/test.sh fightlog 100000`.

```js
bossAI: {
  sand_queen(c) {
    if (c.hpPct < 0.5 && c.once('burrow')) { c.say('The Queen burrows beneath the glass!'); return c.use('e_charge'); }
    if (c.turn % 3 === 0) return c.use('e_quake');
    return c.pick([['e_bite', 3], ['e_sting', 2]]);
  },
}
```

Troops: `{ enemies: ['a', 'a', 'b'], boss: true, music: 'boss', canFlee: false, bg: 'desert' }`.
Normal troops: 1–4 enemies. Name troops `<area>_<desc>`.

---

## 7. Looks (NPC sprites)

See `data/looks.js`. A look: `{ id, skin, hair: { style, color }, eyes, outfit: { style, main,
accent, trim, pants, boots, metal }, acc: [...], build, weapon, shield, blush }`.
Hair styles: `short long ponytail bob bun messy braid spiky twintails bald none`.
Outfits: `tunic dress robe armor coat vest rags priest cloak`.
Accessories: `scarf cape hood helmet hat_wide hat_wizard circlet headband bandana beard
glasses eyepatch feather ribbon crown horns`. Builds: `adult child large tall`.
For anonymous townsfolk use `villager_1` … `villager_64` (varied presets).
Main cast looks exist: `wren ilse bram sable pip corvin cassian ysolde mercy garrick
penitent tamsin halvard osk elowen vasha fennick sage red_tam` and post-Sundering
variants `wren_ruin ilse_ruin bram_ruin pip_ruin sable_lysa`, plus `lysa cassian_young
acolyte dawnguard vesper_soldier cultist bandit tobias nana_brisa`.

---

## 8. Items, gear, shops, world nodes

Items (`data/items.js`): tonic hi_tonic mega_tonic x_tonic tonic_mist ether hi_ether
x_ether elixir megalixir ember_feather dawn_plume antidote eye_drops echo_herb
smelling_salts burn_salve panacea bedroll smoke_ball flash_powder fire_bomb frost_bomb
bolt_bomb gale_bomb holy_water gloam_shard starfall_bomb afterglow_vial vigor_seed
wisdom_seed power_fruit magic_fruit guard_fruit spirit_fruit swift_fruit crest_tome
stone_* (crest stones) and materials/key items. Equipment ids are generated from names
in `data/equipment.js` (e.g. `steel_longsword`, `silversteel_saber`, `brigandine`,
`choir_vestment`, `starweave_robe`); accessories are listed there too
(`swift_boots`, `ribbon`, `hunters_eye`, `phoenix_charm`, ...). If you need a new key
item or unique accessory, add it in your pack by mutating the tables at module load:

```js
import { ITEMS } from '../items.js';
ITEMS.tamsins_bell = { name: "Tamsin's Bell", kind: 'key', desc: '...', icon: '✪' };
```
Chests should give gear of the chapter's tier, consumables, and the occasional
accessory or stat fruit. Shops: `shops: { saltglass_market: { name, items: [...] } }`.

World nodes (fast travel; the world map opens from exits with `to: '@world'`):
`{ id, name, region, act: 1 (before Sundering) | 2 (after), x, y (0–1000 map coords), mapId, tx, ty, dir, unlock: 'flag' | (state) => bool, desc }`
(e.g. `unlock: (st) => st.chapter >= 3`).
Route and dungeon Hearthstones can be fast-travel points too: add `mapId: 'node_id'` to
`WAYSTONES` in `src/data/waystones.js` (the node it hangs off). Walking within 2 tiles of
the map's Hearthstone attunes it; the world map then offers it as an arrival point under
that node, following the node's act and unlock. Leave out one-way story maps.

Side quests: every `s.quest(id, title, desc)` step needs an entry in
`src/data/objectives/side1–4.js` (`{ quest, step?, at }`, targets as for objectives;
`after`/`unless` may list several flags) — the blue markers. `tools/test.sh side_quests`
lists any step without one.

Cutscene movement: `s.move`/`s.step` legs that would pass through someone (the player,
followers, other actors) are re-routed around them (`world/CutscenePath.js`); a leg with
nobody in the way is walked exactly as written, an NPC sent onto someone's tile stops
beside it, and the player always ends exactly on its waypoint (doors, triggers).

Autosave: `world/Autosave.js` writes the three rotating autosaves on arrival, chapter
changes, story beats and a timer, once the player is in control; maps with
`noSave: true` never autosave.

Riding: Kindle (the party's mount) can be called only on maps listed in `RIDE_MAPS` in
`src/data/mount.js` — open roads and wilds, never towns, interiors, dungeons or dreams.
A rider gets down automatically on talking, chests, doors and any script that lasts
past its first frame (`runScript(fn, { keepMount: true })` opts out).
Act I geography (x,y): Lanternfall (90,520) far west; Port Gale (240,500); Whisperwold
(330,440); Thistledown (420,470); Aurenne (520,420) center; Sunscar/Saltglass (600,640)
south; Greyspine/Frosthollow (560,180) north; Mirefen (760,560) southeast;
Verdance/Thornwood (820,320) east; Skyreach (700,120) far north-east, in the sky.

---

## 9. Testing (required)

1. `python3 tools/maps/<id>.py` — regenerate layouts; check the ASCII preview.
2. `tools/test.sh validate 30000` — must print `PASS` (cross-reference checks).
3. Write a smoke test `tests/<chapter>.test.js` driving your chapter's main scenes
   (see `tests/prologue.test.js`): `h.newGame()`, `h.goto(map,x,y)`, `h.talk(npcId)`,
   `h.stepOn(x,y)` (fires triggers/exits), `h.expect(cond, msg)`, `h.flags()`,
   plus direct state setup like `game.state.flags.c2_x = true` or
   `game.state.joinParty('pip')` to start mid-story. Battles auto-play; dialogue
   auto-advances. Run: `SIM=240 tools/test.sh <name> 2400000` (a few minutes of real
   time; split long chapters into several tests). Must end with `PASS`.
   - Story tests run on Easy and auto-battle; they check flow, not balance. A lost
     battle prints `Test: party lost battle '<troop>'`; an `idle()` timeout prints the
     scene, open dialogue and battle state — start debugging there.
   - Starting mid-story? Give the party a plausible build with `kitCharacter(ch, level)`
     from `tests/party_kit.js` (Crest ranks, secondary Crest, Supports) plus tier gear.
4. Visual check: `tools/shot.sh "index.html?map=<id>&x=10&y=12&party=ilse,bram&lv=10&dtmax=0.5" out.png 9000`
   then view the PNG. Battles: headless screenshots show the battle UI over a black
   canvas, so grab the rendered frame instead:
   `tools/frame.sh "map=<id>&x=&y=&party=ilse,bram&lv=30&battle=<troop>&bg=<bg>" out.jpg`.
   A battle background can get a battle-only lighting variant by defining
   `<mood>_battle` in `render/Moods.js` (see `evernoon_battle`).
5. Balance: see the simulator commands at the end of section 6.

Keep code clean: small functions, named flags, no dead code, comments only where they
add context. No external assets — everything is procedural.
