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
  (6 slots + autosave), shops, world map with fast travel (towns + attuned Hearthstones), fishing.
- Audio: WebAudio synth + sequencer, 30 songs, 46 SFX.
- Title, New Game (difficulty picker → opening movie), New Game+, credits; two endings
  (Evernoon and true).

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
| colosseum | The Bellring, Aurenne's colosseum (Act I): four three-round cups, Bell Tokens, Valka the Undefeated | `colosseum` |
| postgame | Gloam Abyss B1–30, Echo Colosseum (10 rounds), Lysa's Echo, the First Dark | `postgame`, `postgame_finale` |
| opening | The opening movie, New Game difficulty picker, title attract loop | `opening` |
| world map | Fast travel to towns and attuned Hearthstones | `fast_travel` |
| crests | Mastery Legacies, Ascension stars, Mastery Arts, the Arts screen | `crest_ascension`, `crest_balance` |
| lost crests | Four Lost Callings (Tier IV), their quests and guardians | `lost_crests` |
| autosave | Rotating autosaves, triggers, the setting, the Save/Load rows | `autosave` |
| cutscenes | Scripted walkers go around the party | `cutscene_paths` |
| mount | Kindle the Emberhart: the Hollow meeting, riding, the Drift reunion | `mount` |
| side quests | Blue side-quest markers (every step of all 80 quests), the area map; quest dead ends fixed | `side_quests`, `side_markers`, `story_fixes` |
| level up | The level-up screen after a victory | `levelup` |

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
- Prologue balance: `tools/test.sh prologue_balance 300000` plays the opening with the
  party the story really gives you (Wren + Ilse at L1, starting gear, Crests sealed, 4
  Tonics) on Normal: each Tide Caves encounter fresh, then the prologue through
  Brinefang as one run with HP, Tonics and EXP carrying over. The equal-level `balance`
  sim can't see this stretch (it showed every prologue troop at 100% while a real L1
  party lost 59% of Tide Bat fights). `EXTRA='diff=0|2'` for Story / Hard.
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
`.github/workflows/pages.yml` runs `npm ci` + `npm run typecheck` + `npm run build` on
pushes to `main` and deploys `dist/` to GitHub Pages (Settings → Pages → Source: GitHub
Actions); a type error stops the deploy.

**Type-checking** (`npm run typecheck`, ~12 s): TypeScript 5.6 checks the plain JS in
place (`tsconfig.json`: `allowJs` + `checkJs`, `noEmit`, not `strict`) — no build step,
the dev server and tests are unchanged. `@types/three@0.170` matches the vendored r170.
`src/types/data.d.ts` describes the data (MapDef and its npcs/exits/triggers/…,
EnemyDef, TroopDef, SkillDef, ItemDef, EquipDef, CrestDef, PassiveDef, ShopDef,
WorldNode, ContentPack, ObjectiveEntry, and `StoryScripts`, which types every story
step's `s` as the ScriptContext); `src/types/globals.d.ts` covers window extras. Every
map object, content pack, enemy/troop helper, data table, objectives table and story
object carries a JSDoc `@type`, so misspelled fields ("Did you mean 'battleBg'?") and
unknown script calls (`s.sya`) fail the check. Fields set at runtime are declared in
constructors (Game hooks, Actor.def/home/wanderT, Battler.acting, Renderer.onResize).
Script factories live outside the story objects (`chime`, `flower` in story/side.js,
`merryDef` in ch2_wold.js). Next step if wanted: `strictNullChecks`, folder by folder
(~480 warnings across the engine today).

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
- **Prologue rebalance (Normal):** a level-1 Wren + Ilse used to win only 41% of Tide Bat
  fights and 27% of the mixed troop; just 18% of runs got through the prologue. Now the
  Tide Bat is level 2 (spd ×1.35, evade 10, bites less), `tc_mix` is bat + crab + jelly
  (the eel stays in `tc_eel` and the brooch fight), supper at home and the morning
  after (Nana's) restore the party, and a tip at the cave mouth explains Tonics,
  Hearthstones, fleeing and autosave. Every cave fight is now a 99%+ win at L1 that
  still costs ~half the party's HP and 1–1.5 Tonics; 91% of runs clear the prologue
  through Brinefang in one go (Story 100%; Hard stays a grind).
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
- **New Game difficulty + opening movie.** New Game (and New Game+) first shows a
  difficulty picker (Story / Normal / Hard with the HP/damage numbers; `data/difficulty.js`
  is the one source for the multipliers, the picker and Settings). A fresh game then plays
  the opening (`scenes/OpeningScene.js` stages the screenplay in `story/opening.js`):
  ~75 s, 29 shots cut to a new `opening` theme — cold open, Lanternfall, an anime-opening-style
  cast roll with portrait cards, Wren cycling through Crest costumes, a six-region world
  montage, three battles (deck, desert, ruin), the sun stopping and splitting into the
  seven wounds, one year later, Evernoon, the logo over Lanternfall's ruins. Shots reuse
  the real maps (`OpeningStages.js`: a map set is a FieldScene without player/HUD/scripts
  that FieldAtmosphere can light; a battle set uses the shared `BattleStage` helpers).
  Captions are DOM, faded by script so they stay on the shot clock. Any confirm/cancel/
  menu press skips; it runs on real time (not Fast Mode) to stay with the music. An idle
  title (45 s) plays it as an attract loop. It avoids the twists (who breaks the sun,
  Sable's face, the Penitent's). Set builds are hidden in white/black cut dips; the
  sequencer now schedules 0.3 s ahead and drops notes a stall made late instead of
  bunching them. Test: `opening` (all shots in order, timing, skip, New Game → Cancel →
  Hard → opening → prologue, attract). Frames: `tools/frame.sh "opening=<shot>&wait=1"`.
- **Hearthstone fast travel.** Towns were already on the world map (unlocked by arrival
  flags); now 21 route and dungeon Hearthstones (`data/waystones.js`, each under the world
  node it hangs off) are attuned by walking within 2 tiles or resting at them
  (`world/Waystones.js`, a toast says so). The world map marks a destination with its count
  (◆2), lists them in the info panel, and on confirm asks where to arrive: the destination
  or an attuned Hearthstone; "you are here" also lights up from inside a dungeon. The node's
  act and unlock still apply, so Act I stones vanish with Act I. Left out: Lanternfall before
  the Sundering, the Last Sunset, the Noon Spire, Evernoon, Abyss floors. Saved in
  `state.vars.waystones` (older saves attune as they revisit). Test: `fast_travel`.
- **The Bellring** (Act I colosseum; pack `content/colosseum.js`, map `maps/bc_bellring.js` +
  `tools/maps/bc_bellring.py`, script `story/colosseum.js`): a world stop by Aurenne from
  `c3_pip_joined`, a crier at Aurenne's gate. Ringmaster Ottavio Brass runs four cups —
  Copper (Lv 14, Pip joined), Silver (21, Corvin joined), Gold (28, Mirefen), Sunsteel (34,
  Elowen's farewell), each needing the one before. A cup is three rounds with HP/MP carried
  over (medics restore 25% between); a loss heals and resets, never game over. First clear:
  prize (Vigor Bangle, Hunter's Eye, Feather Cape, the new Bellring Laurel) + gold; every
  clear: Bell Tokens (10/15/20/30, 3–8 on rematches) for the prize counter (tonics, stat
  fruit, Crest Tomes, Lucky Coin). 12 troops / 14 fighters (`bc_`), four boss scripts with
  telegraphs (Grizzlemaw, Iron Bull, Scythe Matron, Valka), a `colosseum` battle stage and a
  `bell` SFX. Tuned so an auto party at the cup's level wins the whole gauntlet ~70–90%
  (≥90% two levels up). Gone with the rest of Act I at the Sundering. Test: `colosseum`.
- **Crest Mastery and Ascension** (`data/crests.js`, `state/Character.js`): mastering a
  Crest (rank 10, 800 CP) still gives +1% to all stats, and now also its **Legacy** — one
  authored, permanent bonus per Crest (Vanguard STR +5%, Mender healing +10%, Sage MP
  costs −10%…), active whatever Crest is worn; they stack. CP no longer stops at 800: it
  fills five **Ascension stars** (`ASCEND_CP` 1100/1450/1850/2300/2800, then capped). Each
  star: +1% to all stats while that Crest is primary, and +3% power to the Arts it teaches
  wherever they're used (damage and healing, via `Battler.artPower`). A fully Ascended Crest
  adds a Support Point (up to +3). Shown as ★ in place of the rank pips on the Crest and
  Status screens, a Legacy line and star progress in the Crest detail, ★ on the victory
  screen and party card, and a "Mastery & Ascension" help entry. Balance: the sim party only
  masters its primary, so it never sees stars; in A/B runs a 5★ primary is worth about what
  six extra mastered Crests already were (e.g. Echo Colosseum round 10 at Lv 99: 75% → 100%),
  and the First Dark stays out of reach without real preparation. Test: `crest_ascension`.
- **Kindle the Emberhart** (mount; `data/mount.js`, `story/mount.js`, sprite
  `render/MountFactory.js`): a great hart whose antlers burn with Lantern-light. Act I,
  optional: Hesk the forester in Thistledown (from `c2_mother_done`) has seen it in the
  Whisperwold's Hollow; by the Mother's old tree it is beset by shades (`c2_shade_pair`),
  then bonds with Wren, who names it Kindle (flag `mount_kindle`, key item `kindle_ember`,
  quest `mount_kindle`). Act II: crossing onto the Drift's east isle, Kindle finds Wren in
  the ash of Lanternfall — a reunion, or a first meeting if she never went (`kindle_drift`).
  Riding: the new **Ride** action (R; gamepad RT; remappable) on the 25 `RIDE_MAPS` (routes and
  wilds in all three acts) — 9.5 tiles/s (running 6.4), no random encounters, the party
  rides along (followers hidden), embers and hoof-falls. Talking, chests, doors and any
  scene longer than a frame put you on foot; riding carries across route exits and stops
  in towns (`state.vars.riding`). The mounted player is an ordinary `Actor` whose look is
  `{ kind: 'mount', rider }` — a 44×46 sheet (4 directions × stand + 4 gallop frames) with
  the leader's head and torso composited on, cached per rider, with an ember glow mask. On
  the world map Kindle carries the leader from "here" to the chosen stop before the fade.
  Preview: `tools/test_mount.html`; frames: `tools/frame.sh "map=…&ride&hold=right"`.
  Help: "Riding Kindle". Test: `mount`.
- **Side-quest markers, the area map, the level-up screen.** Every step of all 80
  optional quests (101 steps, bounties included) now has blue marker targets in
  `data/objectives/side1–4.js` (`{ quest, step?, at }`; `after`/`unless` may now list
  several flags). Blue gems show over a quest's people and places on the current map, or
  over the door of a building that holds one; the minimap and area map draw blue
  diamonds; the world map floats a blue ◆ over each stop with a side quest and lists them;
  the Journal names where each leads; Settings → Side Quest Markers turns them off. Gold
  (the objective) wins when both mark the same spot, and the edge arrow is gold-only.
  The **area map** (new Map action, M; gamepad LT; or the ⤢ button on the minimap) shows
  the whole map at up to 18 px a tile with its name, where each exit leads and a legend;
  the party waits while it's open. After a victory, a **Level Up!** panel shows a card
  for each member who levelled: old → new level, every stat's gain, and new Support Points.
  Tests: `side_quests` (data), `side_markers` (in play), `levelup`.
- **Chapter 1 evening, reworked.** After the Kindling ("Everyone — home. Now.") Wren is
  sent home at dusk with "rest in your bed" (marker on the bed) instead of being dropped
  outside the Lantern with a hint to come back. Resting (`CH1.restEvening`): she can't
  sleep, the room goes to night (`ch1_night`: Lanternfall and the house dark, day NPCs
  indoors), and voices from the Lantern move the marker there; the Lantern stays empty
  ("I should go home") until she has rested. After the overheard argument she wakes at
  home at dawn (`ch1_dawn`) and leaves for the docks. Old saves mid-step follow the new
  path (their objective now points at the bed). Wren's bed restores HP and MP any time
  (`CH1.bed`). Beds everywhere are repainted to lie back toward their headboard
  (PropFactory `lean`) — sheet, pillow, patchwork quilt — instead of reading as an upright
  wardrobe. Tests: `prologue` (the new sequence), `home_rest`.
- **Autosave and cutscene walking.** Autosave (`world/Autosave.js`) now keeps three
  rotating slots (`AUTO_SLOTS`: the old `auto` plus `auto2`, `auto3`): the newest is updated
  in place for 10 minutes of play, then the next goes to a free slot or over the oldest (a
  game loaded from earlier always rotates, so it never overwrites a later timeline). Saves
  are requested on arrival, chapter change (both immediate), story beats (objective change,
  quest finished, battle won — at least 45 s apart) and every 5 minutes of field play, and
  written only once the player is in control with no menu open, never on `noSave` maps or
  with Settings → Autosave off. A "✦ Autosaved" mark shows in the corner. The Save and Load
  screens list them as A1–A3 (newest first; loadable and exportable, not saved over);
  Continue picks the newest of any save. Cutscenes: `s.move`/`s.step` legs that would pass
  through someone now route around them (`world/CutscenePath.js`: A* over walkable tiles,
  straightened; untouched when nobody is in the way); an NPC sent onto someone's tile stops
  beside it; the player keeps its exact waypoint. Tests: `autosave`, `cutscene_paths`.
- **The Lost Callings** (Tier IV; `data/crests.js`, quests `story/lost.js`, guardians
  `content/lost.js` prefixed `lc_`, markers `objectives/side5.js`). Four Crests the Choir
  struck from its rolls, each remembered through an optional Act II quest: someone who
  remembers the calling points the way; at its slab of crest-glass (a map blocker + inspect)
  a guardian waits; win and the Crest is the party's (`learnCrest`), quest done, journal.
  A loss heals and the glass waits. Until found, each shows on the Crest screen as
  "??? (Lost Crest)" with a rumour (from chapter 8).
  | Crest | Giver (from ch.) | Crest-glass | Guardian (Lv) | Play |
  |---|---|---|---|---|
  | Tidecaller ≋ | Grandmother Wend, Keelhaven (8) | far east end of the Shattered Sea | the Drowned Cantor (46) | ice magic, tide heals, Slow |
  | Bellwright Ω | Founder Hask, ruins of Aurenne (8) | NE of the drowned Undercroft | the Bronze Abbot (45) | bells: stun, silence, turn delay, party guard |
  | Kitewright ◈ | Ada Kestrel, Kiteholm (9) | S end of the Underhang | the Scrap Colossus (50) | wind, item-power bombs, speed, jump |
  | Mnemonist ∞ | Sexton Mabry, the Garden That Remembers (9) | heart of the Garden's maze | the Forgetting (56) | memory: cures, dispel, echoes of fire/ice/sun |
  Each has 10 ranks (7 Arts + 3 Supports; 28 new Arts, 7 new Supports such as Sea Legs,
  Ringing Ears, Updraft, Perfect Recall), a costume, a Legacy and two Mastery Arts.
  Viability (crest_balance): 94–100%, mid-pack. Guardians tuned as optional trials: an auto
  party at their level wins 75–100% and ends around half HP.
- **Mastery Arts and the Arts screen.** Each of the 24 Crests now has two signature
  *Mastery Arts* (48 new Arts in `data/skills.js`, attached as `CRESTS[id].mastery` in
  `data/crests.js`), taught by its first and third Ascension stars — e.g. Vanguard: Banner of
  Dawn (party STR/DEF up, taunt) and Vanguard's Oath (all foes, pierces 30% DEF, DEF down);
  Beastcaller: Call: Emberhart and Call: Leviathan; Afterlight: Remembered Sun and Unending
  Dawn. They're built from existing mechanics, join the Crest's Arts in `unlocksOf` (usable
  as primary or secondary), get the star power bonus, and are announced on the victory
  screen ("ascends: ★1 — Mastery Art …"). `data/artInfo.js` turns any Art's data into a
  detail line (kind · target · power × hits · element · MP) and an effects list (ailments
  with chances, stat stages, cures, revive, drain, piercing, crit, speed, specials, HP cost,
  Ascension bonus) — shown in the Crest screen (now scrollable with ◀ ▶), in battle under
  the highlighted Art, and in the new **Arts** screen (party menu): every Art a member knows
  by Crest, usable ones first, locked Mastery Arts with the CP to go, other Crests' Arts
  marked "equip to use". validate checks each Crest has two Mastery Arts at ★1/★3, unique.
  The balance sim never earns stars; in A/B runs fully Ascended parties gain a little
  over stars alone (Mother of the Deep ~13 → ~8.5 rounds; the First Dark still ~0–8%).
- **Two side-quest dead ends fixed** (found while mapping the markers). *Hide and Seek*:
  if the Hollow Mother fell before Merry was found three times, her goodbye (which only
  played in the Mother's aftermath) never came and the quest stayed open. Now, once the
  Mother is at rest, finding Merry again gives the acorn and her goodbye on the spot; a
  save already stuck gets it at her grave; and if nobody met her before the Mother fell,
  she isn't there. *Glassback / the Lidless*: Warden Hale stopped paying bounties once
  the Unmoored was dead (he checked that first); he now pays first. Test: `story_fixes`.

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
