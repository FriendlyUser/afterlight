# Afterlight — Development Progress

Play: `python3 -m http.server 8765` in this folder, then open http://localhost:8765/.
Debug: `?map=<id>&x=&y=&party=ilse,bram&lv=20` jumps into a map; add `&battle=<troop>&bg=<bg>`,
`&menu=crests|world|settings|shop:<id>`, `&flags=a,b`, `&debug` (fps / draw calls).

## Done (engine)
- Renderer: three.js 2D-HD stack (bloom, tilt-shift DOF, gamma-space grade, vignette),
  15 moods (+ battle-tuned variants), particles, light shafts, dark-mood player light.
- Procedural pixel art: characters (SpriteFactory, Crest costumes), 29 monster
  archetypes, tiles, props — no external assets.
- Field: ASCII-layer maps (`tools/mapkit.py`), heights/ramps/collision, NPCs, chests,
  triggers, exits, blockers, encounters, occlusion fade, cutscene scripting API, party
  followers, minimap, optional floor-decor scatter.
- Battle: CTB timeline, Poise/Break, Afterglow (Surge + Link Arts), 24 Crests × 10 ranks,
  300+ Arts, Supports, statuses, telegraphs that Break can interrupt, scripted boss AI,
  Swap, auto-battle, retry on loss, difficulty and battle speed.
- Menus: main, items, Crests (primary/secondary), Supports, equipment (optimize),
  status, formation, bestiary, journal + quest log, Guide, settings, save/load
  (6 slots + autosave), shops, world map with fast travel, fishing.
- Audio: WebAudio synth + sequencer, 29 songs, 46 SFX.
- Title, New Game, New Game+, credits; two endings (Evernoon and true).

## Content
The 14 story chapters of `docs/STORY.md` (code packs `prologue`, `ch2`–`ch12`), side
content and a post-game, all written and wired end to end (Prologue → `gameClear`).
~74k words of scripted scenes (~6,300 dialogue beats), 145 hand-laid maps + the 30-floor
generated Abyss, 144 quests, 100 scripted battles, 395 enemies, 447 troops, 370 chests.
Estimated 40–60 hours with side content.

| Pack | Story chapter(s) | Smoke tests |
|---|---|---|
| prologue | Ch.1–2: Lanternfall, the Kindling, Brinefang, the crossing | `prologue` |
| ch2 | Ch.3 The Wider World: Port Gale, coast road, Whisperwold, Thistledown | `ch2`, `ch2b` |
| ch3 | Ch.4 City of Bells: Aurenne, Pip, Undercroft, Carillon Wight, Sister Mercy | `ch3`, `ch3_maps`, `ch3_side` |
| ch4a | Ch.5 Pilgrim Road (Sunscar): Tamsin, glass caverns, Wyrm Queen, Whitefang, Garrick | `ch4a`, `ch4a_caverns`, `ch4a_mountain`, `ch4a_finale` |
| ch4b | Ch.5 Pilgrim Road (Mirefen): Mother Osk, Verdance, the sky route, Thunderhead | `ch4b`, `ch4b_layout`, `ch4b_verdance`, `ch4b_sky`, `ch4b_sky2` |
| ch5/ch6 | Ch.6 The Last Sunset (Tidemourner, the Sundering); Ch.7 Afterlight (the Shard Hermitage) | `ch5`, `ch56_layout`, `ch6` |
| ch7 | Ch.8 The Mender of Ash: ruined Aurenne, the Ember Ward | `ch7`, `ch7_side`, `c78_balance` |
| ch8 | Ch.9 Children of the Wreck: Kiteholm | `ch8`, `ch8_side` |
| ch9 | Ch.10 The Halcyon: Corvin's Roost, the airship | `ch9a`, `ch9b`, `ch9c` |
| ch10 | Ch.11 Lysa: the Noon Spire, Evernoon, Mercy, Sable's name | `ch10a`, `ch10b` |
| ch11 | Ch.12 Seven Wounds: Remnants and Rites by airship, the Starseer | `ch11`, `ch11b`, `ch11c`, `ch11d`, `ch11_reach` |
| ch12 | Ch.13–14 Evernoon: the Hierophant, the Noon King, Vesper; the ending | `ch12`, `ch12_evernoon`, `ch12_finale` |
| side | Hunters' Lodge + 10 bounties, Drowned Observatory, Fort Ashwatch, Hollow Bell, Garden That Remembers, 2 hidden hunts | `side`, `side_reach` |
| postgame | Gloam Abyss B1–30, Echo Colosseum (10 rounds), Lysa's Echo, the First Dark | `postgame`, `postgame_finale` |

## Testing
Headless Windows Chrome via WSL, against the local server.
- One test: `SIM=240 tools/test.sh <name> <virtual_ms>` (story tests: 2400000).
  `SIM=240` renders every 240th frame — ~3× faster.
- Suite: `SIM=240 tools/test_all.sh '<regex>'` — one test at a time; two suites in
  parallel are fine (~50 min for all 46 in two lanes). It runs from a snapshot of
  `tools/test.sh`, but don't edit `test_all.sh` itself while it runs.
- Story smoke tests run on **Easy** and auto-battle: they check flow (auto-battle can't
  use Link Arts, Surge or Swap). `?testdiff=1` runs them on Normal. Mid-story tests give
  the party a plausible build with `tests/party_kit.js`.
- Balance: `tools/test.sh balance 1500000` simulates every troop with an equal-level party
  (tier gear, Crests ranked by level, secondary Crest + Supports from L20, the shared
  auto-play). `EXTRA='only=<regex>&n=16&party=a,b,c,d&lvadj=-3'` narrows/varies it;
  `EXTRA='troop=<id>&lv=<n>' tools/test.sh fightlog 100000` prints one fight turn by turn.
- Crest viability: `tools/test.sh crest_balance 900000` — Wren takes each of the 24 Crests
  as primary against six mid/late bosses.
- Visuals: `tools/shot.sh "<url>" out.png 9000` (page + UI); `tools/frame.sh
  "map=…&battle=…" out.jpg` (the rendered 3D frame — use it for battles).

## Build
`npm run build` (or `tools/npm.sh run build` from WSL) bundles the game with Vite into
`dist/` for any static host; see README "Web build". `vite.config.js` aliases `three`
to `vendor/three`, drops the dev import map, splits three.js into its own chunk, and
keeps relative paths. Content packs load through literal `import()` calls in
`src/data/content/index.js` (one chunk each); `?test=` is disabled in production builds
(`import.meta.env.PROD`), so tests stay out of `dist/`. Fonts are self-hosted in `fonts/`
(`css/fonts.css`, Latin + Latin Extended subsets, three preloaded); the build hashes them
into `dist/assets/` and copies the OFL licenses to `dist/fonts/`. No external requests.
`.github/workflows/pages.yml` runs `npm ci` + `npm run build` on pushes to `main` and
deploys `dist/` to GitHub Pages (Settings → Pages → Source: GitHub Actions).

## Status 2026-11-07 08:30 MST
All packs load; validator PASS (185 maps incl. generated Abyss floors, 395 enemies, 447
troops). **Full regression: 46/46 PASS** — run at 06:25 and again at 08:00 after the
presentation and follower work (a third run is in progress; see below). Balance: 441/447
troops are won every time by an equal-level auto party, 444 at ≥75%; below that only the
optional superbosses (First Dark — a 70+ round marathon the party survives, Black Star)
and Echo Colosseum round 8. Story bosses 80–100%. All 24 Crests viable (89–100%).

The content agents were stopped (memory/time); the remaining verification and tuning was
done directly this session:
- **Test harness:** auto-confirm no longer fires while roaming the field (it kept
  re-talking to the NPC in front of the player, so `idle()` never returned — the ch2
  hang). A lost battle logs `Test: party lost battle '<troop>'` instead of retrying
  forever; idle timeouts print scene, dialogue and battle state.
- **Battle rules:** self-applied statuses no longer expire the turn they're gained, so
  Guard and telegraphs work. Charged blows hit `CHARGE_POWER` = 1.5× (Guard halves
  them); post-game tells show a 'Winding Up' status; Breaking a winding-up foe
  interrupts the attack (own SFX and popup; wind-ups have a warning tone). Enemy
  self-destruct is capped at 35% of each target's max HP (it could one-shot a party).
- **Auto-battle** and the balance sim share `src/battle/AutoPlay.js`: brace against
  telegraphs → revive → heal (items only to save a dying ally) → best power × element
  (never an element the foe absorbs or ignores), focusing enemy healers and known
  weaknesses on winding-up foes.
- **Balance retunes:** Sister Mercy (ch3 and ch10), Whitefang, the Wyrm Queen, What the
  Noon Forgot, the Keeper's Remnant, Vesper (finale), Echo Colosseum round 8 (its echoes
  now take turns winding up), and normal troops that had boss-tier AoEs (Hollow
  Pilgrims, Choir Shades, Drowned Memory, Choir Seraph, Hour Watcher). The side
  `boss()` helper had dropped bosses' EXP/gold/CP — fixed.
- **Party followers** (`src/world/Followers.js`): up to three members trail the leader.
  A follower steps out of view while its character is on the map as another actor
  (cutscene spawns, hub NPCs), so scripts never show anyone twice; dream maps are
  `solo`. With no room behind the leader they regroup to the side, or wait out of sight.
- **Fast Mode** (T / left-stick click, Settings → Fast Mode / Fast Mode Speed 2–4×): scales
  the game clock (`Game.speedFactor`) — walking, NPCs, cutscenes, battles (stacking with
  Battle Speed) and dialogue typing — but not the UI clock, so menus, key repeat and the
  fishing minigame keep real-time timing. "▶▶ ×3" badge while on. Test: `fast_mode`
  (clock and walking scale ×3); ch3 and c78_balance also pass with it switched on.
- **Save files:** F on a Save / Load slot exports it as a JSON file or imports
  one (`SaveStore.exportFile` / `importFile`, browser helpers in `src/ui/files.js`).
  Imports are validated (format marker, game version, a full deserialize) before the slot
  is touched. Load Game on the title is always available so a fresh browser can import.
  Tests: `systems` (round trip + rejected files) and `save_files` (the save-screen flow).
- **Minimap** (`src/world/Minimap.js`): floor plan drawn once per map plus a facing
  arrow; hidden in cutscenes, single rooms (<300 tiles), maps with `noMinimap` (the hedge
  maze), or via Settings → Minimap.
- **Key remapping** (Settings → Controls, `src/ui/menu/ControlsScreen.js`): up to three
  keys per action; a key belongs to one action (binding it elsewhere moves it); movement
  and Confirm can't be left keyless; Delete clears a slot; Esc is fixed to Cancel + Menu.
  Bindings live in `settings.keys`, so they save, export and import with the game
  (`normalizeBindings` repairs bad data). On-screen hints read the live bindings
  (`keyCap` / `keysFor`). Tests: `controls`, `systems`.
- **Doors** (`makeDoor` in MapBuilder, `tryDoor` / `enterDoor` / `playEntrance` in
  FieldScene): door tiles are solid; walking into one swings it open, the player steps
  into the doorway and fades into its shadow as the screen fades. Arriving, the player
  walks in from the exit/door behind them while the screen fades in (a building door
  then swings shut; followers fade in behind). Leaving by an exit keeps walking through
  the fade. Locked doors speak once per push. Shopkeepers behind tables can be talked
  to across the counter. validate checks every exit/door arrival (in bounds, not void,
  not on an exit, not inside a building) and that no NPC stands inside a building.
  Test: `shop_counter`.
- **Quest Guide** (`src/world/QuestGuide.js`, `QuestMarkers.js`, targets in
  `src/data/objectives/`): each objective text maps to target(s) — a map, a tile, an NPC
  (`unless: flag` hides finished parts, `after: flag` reveals later steps). The guide
  routes across open exits, doors and the world map (an @world exit or Menu → Travel) and
  marks the next step: a gold gem over the spot / person / exit / door (drawn over
  everything), an edge arrow while it's off screen, a diamond on the minimap, the
  objective in the top-left, and a ◆ on the world-map stop. Keyed by text, so old saves
  get markers. Settings → Quest Guide. Tests: `objectives` (every objective has an entry,
  targets valid), `quest_markers`.
- **Battle presentation:** a wider party diagonal (nobody hidden behind the next); the
  biggest enemies take the central slots and colossal ones (size 4) get a wider shot;
  new monster archetypes `bell`, `storm`, `orrery`, `angler` for bosses that were drawn
  as the wrong thing; a battle-tuned `evernoon_battle` mood (the field mood washed fights
  out to white); the results screen hides the timeline and gauges.
- **Polish:** 'Flashes & Shake: Reduced' and 'Minimap' settings (all settings apply
  through `game.applySettings()`; New Game keeps them); Guide entry on big attacks;
  world-map markers by kind with a "you are here" ring and an info panel that never
  covers a marker; the Belfry's great bell (`bell` prop, wide-prop `footprint`); floor
  decor `scatter` in the nine sparsest dungeons; the lighthouse beam fades out; the
  `?debug` overlay counts the whole frame.

## Next
Everything below is optional; the game is complete and the suite passes.
- **Human playtest** of the first few hours: encounter rate, EXP pacing, how often
  players grind. All tuning so far comes from simulations. Economy estimate: at even
  level, new weapons for the party cost about one tier-window of fights (plus selling
  old gear); full armor sets don't fit — a choose-your-upgrades economy, helped by 370
  chests (48 pieces of gear, 71k gold). Raise enemy gold if playtesters feel starved.
- **Real-GPU performance check.** All tests ran on SwiftShader. Aurenne, the busiest
  town: ~240 draw calls and 26k triangles per frame including post FX — light for WebGL2.
- **Hard mode:** bosses are tuned so *auto-play* wins at equal level. Players with Link
  Arts and Surge will find Normal comfortable; Hard (×1.3 HP / ×1.25 damage) may want
  boss-specific twists rather than bigger numbers.
- **Audio mix pass** across the 29 songs and 46 SFX on real speakers.
