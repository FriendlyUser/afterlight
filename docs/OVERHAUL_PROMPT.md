# Afterlight polish pass — the prompt

This is the "commercial-grade overhaul" brief, rewritten so a coding agent can act on
it in this repository. Hand the section **The prompt** (everything below the line) to
the agent, or tell it to follow this file. Each work package stands alone, so you can
also hand over one package at a time.

## What changed from the original brief, and why

- **It asks for working code in this repo, not blueprints.** The original asked for
  data structures "in TypeScript, GDScript, or C#" and prose designs. The game is plain
  JavaScript modules type-checked with JSDoc, so the brief names the files, functions
  and types to change, and the test that proves each feature.
- **It stops asking for things the game already has.** The turn timeline, the
  retry-from-snapshot, hidden weaknesses, the battle speed switch and "first Confirm
  completes the line" all existed. An agent told to "implement" them would build
  duplicates. They are listed under *What exists* instead.
- **It fits the engine instead of fighting it.** Scenes are imperative scripts, so
  "evaluate the scene's terminal payload" becomes "fast-forward the same script", which
  gives the same end state by construction. Speed tags are multipliers because Text
  Speed is a player setting. Pixel and frame counts became tile fractions and seconds,
  with the engine's real numbers.
- **Every package says why, what the player sees, where the code goes, and how it is
  proved.** The original had none of these, so "done" was a matter of opinion.
- **Two packages start by proving their problem exists.** The input buffer and corner
  sliding were specified without evidence that this engine has either defect.
- **Numbers are measured, not assumed.** Balance floors come from a run of the
  simulator on today's data, and known exceptions are named.

## Where the original brief stands

| Original item | Status |
|---|---|
| §1 Branching predicates, fallback branch | **Done.** The line language: `src/script/Lines.js` |
| §1 In-line text tags | **Done:** `{wait=}` `{speed=}` `{shake=}` `{sfx=}`. `{portrait=}` is open (package 7) |
| §1 Procedural per-speaker chirps, ±4% pitch | **Done:** `src/data/voices.js`, `AudioEngine.blip` |
| §2 Hold-to-skip cutscenes | Open (package 1) |
| §2 Backlog of the last 100 lines | **Done:** Up during dialogue |
| §2 Confirm completes the line, then advances | Already in the game |
| §2 Auto-play with `clamp(len × 0.05, 1.2, 4.0)` | **Done:** Settings → Auto-Advance Text |
| §3 Pre-combat snapshot, Retry Encounter | Already in the game (Try again) |
| §3 Load Last Checkpoint | **Done:** "Load last save" on the defeat screen |
| §3 Return to Title | Already in the game |
| §3 Low-pass filter on defeat, cleanup on retry | **Done:** `AudioEngine.muffle`, `BattleScene.exit` |
| §4 Action timeline | Already in the game |
| §4 Preview of turn pushback / advance | **Done:** `BattleSystem.forecast`, `Actions.turnShifts` |
| §4 Hit-stop, weakness / resist / break cues | **Done:** `BattleScene.impact`, SFX `weak` `resist` `crit` `break` |
| §4 1.5× / 2× battle speed | Already in the game (Battle Speed, plus Fast Mode) |
| §4 Weaknesses as `?` until found | Already in the game (bestiary) |
| §5 Quest metadata, difficulty colours, pinned quest | Open (package 2) |
| §6 Corner sliding | Open (package 5) |
| §6 Menu input buffer | Open (package 6) |
| Headless balance runner | Partly: three simulators exist; the pass/fail guard is open (package 3) |
| Save-game migration | Open (package 4) |
| Voice acting | Playback hook **done** (`voice/README.md`). Generating audio is out of scope |

Rough sizes: packages 1 and 2 are the large ones; 3 and 4 are medium and touch tests
almost only; 5 and 6 are small and may turn out to need nothing; 7 is optional.

---

# The prompt

## Goal

Finish the polish pass on Afterlight, a three.js JRPG in this repository. When you are
done a player can skip a cutscene they have seen, can tell from the Journal which
quests the party is ready for and keep one pinned on screen, and no longer catches on
doorway corners; and the project has guards that fail when a fight becomes unwinnable
or an old save stops loading. Deliver working, tested code, one commit per package.

## Read first

- `docs/PROGRESS.md`: what exists and how it is tested. Its *Testing* section has
  every command.
- `docs/AUTHORING.md`: the script API (section 5), map and enemy formats, the party
  roster by chapter (section 1).
- The code each package names under *Where it goes*.
- `src/types/data.d.ts`: the data shapes. New data gets a type there.

## Ground rules

- **Plain JavaScript modules with JSDoc types. No build step to play or test.** Do not
  convert files to TypeScript or add runtime dependencies. The game is served as-is
  (`python3 -m http.server 8765`); Vite only bundles releases.
- **`tools/npm.sh run typecheck` stays at 0 errors.** Type new data in `data.d.ts` and
  annotate it with JSDoc `@type`, as the existing data files do.
- **The headless suite stays green** (`SIM=240 tools/test_all.sh`, about 70 tests,
  over an hour in one lane; split it with regex filters such as
  `SIM=240 tools/test_all.sh '^(ch1|ch2|ch3)'`). If a test fails, run it on the commit
  before your work. If it fails there too, say so and leave it; do not loosen it.
- **Settings live in `state.settings`**, so they travel with saves and exported save
  files. A new setting needs a default in the `GameState` constructor and a row in
  `SettingsScreen.options()` (`src/ui/menu/screens.js`). `GameState.deserialize` merges
  saved settings over the defaults, so an old save picks the default up.
- **Respect Settings → Flashes & Shake.** Anything that shakes, flashes or zooms scales
  with `game.shakeScale` or `renderer.flashScale`.
- **Never signal by colour alone.** Pair every colour cue with a glyph or a word.
- **Story scripts are imperative `async (s) => { … }` functions**: about 7,000 lines of
  dialogue across `src/story/`. Do not rewrite scenes into data. Use the line language
  only where you edit a scene anyway.
- **Anything a player can see gets an entry** in the in-game Guide (`GUIDE` in
  `src/ui/menu/screens.js`), and a new key gets a row in the README controls table.
- Commit on `main`, one commit per package. Do not push.

## How the engine works (facts the packages rely on)

- **Units.** One tile is one world unit. The player is a circle of radius 0.28 tile
  (`Actor.radius`) walking at 3.9 tiles/s and running at 6.4 (`WALK_SPEED`,
  `RUN_SPEED` in `src/world/FieldScene.js`).
- **Two clocks.** `Game.tick(rawDt)` computes the game clock as
  `dt = rawDt × timeScale × speedFactor`. `speedFactor` is Fast Mode (2–4×);
  `timeScale` is Battle Speed. Everything a scene does over time runs on the game
  clock through `game.tasks`: `game.wait`, `game.tween`, `game.fadeOut` / `fadeIn`,
  `Actor.walkPath`, camera pans. The UI clock is `rawDt`: menus, key repeat, dialogue
  input. `game.hitStop(seconds)` zeroes the game clock for a moment.
- **Real-time timers.** In scene code only cosmetic ones use `setTimeout`: area
  banners, toasts, popup removal, and `DialogueBox`'s `opts.auto` (which no story
  script uses today).
- **Scripts.** `FieldScene.runScript(fn)` sets `field.busy`, runs `fn(new
  ScriptContext(game, field))`, and clears `busy` in `finally`. A scene that continues
  on another map does not keep running the old function: it ends with `s.teleport`,
  and the new map's `onEnter` (held in `field.pendingScript`) picks the story up from
  the flags. So **"the scene is over"** means, for one whole frame:
  `!scene.busy && !scene.pendingScript && !game._transitioning && !game.sceneStack.length`.
  The test harness's `h.idle()` waits on exactly this.
- **Input.** `Input.edges` is a `Set` of actions pressed this frame, cleared by
  `endFrame()`. `pressed(a)` reads an edge, `down(a)` reads a held key, `repeat(a)` adds
  auto-repeat. Only the top widget on `ui.stack` receives input. Actions are listed in
  `ACTIONS` (`src/core/Input.js`) and are remappable; Esc is fixed to `cancel` + `menu`.
- **Tests.** `tests/<name>.test.js` exports `run(game, h)`. Helpers on `h`: `newGame()`,
  `goto(map, x, y, dir)`, `stepOn(x, y)`, `talk(npcId)`, `idle()`, `wait(gameSeconds)`,
  `flags()`, `expect(cond, message)`, `log(text)`. The harness sets `game.autoConfirm`
  (dialogue advances itself) and `game.autoBattle`; story tests run on Story
  difficulty. To drive input by hand, turn those off and use
  `game.input.edges.add('confirm')` for a press or `game.input.held.add('menu')` for a
  hold, with `await new Promise((r) => setTimeout(r, ms))` for real time. Run one test
  with `SIM=240 tools/test.sh <name> 2400000`.

## What exists — build on it, do not rebuild it

- **Dialogue:** `s.say` / `s.narrate` / `s.think` / `s.talk` take the line language
  (conditions such as `'party:bram & item:tonic>=2'`, `pick` with a fallback branch,
  `ask` choices, `set`, `run`). The dialogue box types with per-speaker blips, inline
  tags, a backlog on Up (`ui.history`), and auto-advance.
- **Voice:** every line has a stable id (`voiceId`), and a recording listed in
  `voice/manifest.json` plays in place of the blips. `tools/voice.py export` lists the
  lines. Nothing generates audio, and nothing should.
- **Battle:** a turn timeline on Action Value (`baseAV = 10000 / spd`; acting sets
  `av = baseAV × actionDelay(actor, action)`), previewed live while a command is
  chosen. Poise and Break, hidden weaknesses remembered in `state.bestiary`, hit-stop,
  impact sounds, Battle Speed, Fast Mode.
- **Defeat:** `BattleScene` keeps `this.snapshot`, the serialized state taken as the
  battle began. The defeat screen offers Try again (restore it), Load last save
  (`game.loadSave(SaveStore.latestSlot())`) and the title.
- **Quests:** `s.quest(id, title, desc, status)` writes
  `state.vars.quests[id] = { id, title, desc, status: 'active' | 'done' }`. Calling it
  again with a new `desc` is how a quest moves to its next step. The Journal
  (`JournalScreen`) lists them; it is a static page with no cursor. Blue markers come
  from `src/data/objectives/side*.js`, matched by quest id and the start of `desc`.
  The gold main objective is separate: the string `state.vars.objective`.
- **Simulators:** `tests/balance.test.js` exports `simulate(troopId, level, seed,
  roster, tweak)` and `makeParty(level, roster)`: every troop against a four-person
  party at the troop's level, kitted by `tests/party_kit.js`, auto-played by
  `src/battle/AutoPlay.js`. `prologue_balance` plays the real opening party with state
  carried between fights. `crest_balance` checks every Crest. All three print a table
  and fail nothing.
- **Saves:** `GameState.serialize()` writes `version: SAVE_VERSION` (1, never yet
  changed). `GameState.deserialize(data)` is the single way back in, used by the title
  screen, `game.loadSave`, the battle retry and `SaveStore.importFile`.

## Package 1 — Hold to skip a cutscene

**Why.** Replaying after a defeat, or on New Game+, means sitting through scenes again.

**What the player sees.** During any scene, holding the Menu button (C, Tab, Esc or
Start by default) shows a ring that fills in one second. When it completes the screen
dips to black for a moment and the scene is over: everyone is where the scene leaves
them, items are in the bag, the objective has changed. Letting go early does nothing.
If the scene reaches a choice or a battle, the skip stops there and the player takes
over.

**How.** Fast-forward the same script. Do not compute an end state separately.

1. Add `game.skipping` (boolean), `game.startSkip()` and `game.stopSkip(reason)`.
2. While `game.skipping`:
   - `Game.speedFactor` returns a large value (start with 40), so every wait, tween,
     walk, pan and fade finishes within a frame or two. `rawDt` is already clamped by
     `game.maxDt`, so one frame advances at most about two game seconds.
   - `UI.dialogue()` records the line in `ui.history` and resolves at once without
     creating a box or playing a voice line.
   - `UI.message()` (the "Obtained …", "… joined the party!" popups used by `s.give`,
     `s.gold`, `s.join`, `s.learnCrest`) becomes a toast and resolves at once, so
     nothing is granted silently.
   - `AudioEngine.sfx()` and typing blips are silent. Music changes still apply, so
     the right track is playing when the skip ends.
3. The skip **stops by itself** when the scene is over (the four-part condition
   above, held for one frame), or when the script asks for the player: `UI.choice`,
   `FieldScene.startBattle`, any menu `Screen.open()` (shops, the save menu),
   `playFishing`, `FieldScene.openWorldMap`. Each of those calls `game.stopSkip()`
   first. Because the skip survives `s.teleport` and continues into the next map's
   `onEnter`, a scene that spans maps is skipped whole.
4. **The hold.** A small controller updated from `Game.tick` with `rawDt` (the UI
   clock, so Fast Mode does not shorten it): while a scene is running, the top widget
   is a dialogue box or nothing, and `input.down('menu')`, add to a timer; otherwise
   reset it. Draw a ring with the label "Skip" in the bottom-right corner once the
   timer passes 0.15 s; at 1.0 s call `game.startSkip()`.
5. **The curtain.** On start, fade a dedicated full-screen element (not `#fader`,
   which scripts drive) to black in 0.2 s of UI clock; on stop, snap the camera to the
   player, regroup the followers, and fade it away in 0.3 s. Scripts may fade and
   teleport freely underneath.
6. **Opting out.** `s.noSkip()` marks the running scene unskippable until it ends
   (tutorial tips, the ending). The ring then shows a crossed-out state instead of
   filling. Skipping is never offered inside a battle or the opening movie, which has
   its own skip.

**Where it goes.** `src/core/Game.js` (flag, `speedFactor`, start / stop, the hold
controller or a new `src/core/Skip.js`), `src/ui/UI.js` (`dialogue`, `message`,
`choice`), `src/audio/Audio.js` (`sfx`, `blip`), `src/world/FieldScene.js`
(`startBattle`, `openWorldMap`, the end-of-scene check in `update`),
`src/ui/menu/common.js` (`Screen.open`), `src/ui/Fishing.js`,
`src/script/ScriptContext.js` (`noSkip`), `css/style.css` (ring, curtain).

**Prove it** in `tests/skip.test.js`. Play the prologue with the harness to just
before each scene, keep `JSON.stringify(game.state.serialize())`, run the scene
watched, record the result, restore the kept state with `GameState.deserialize`,
re-enter the map, run the scene skipped, and compare. Compare `flags`, `vars`, `party`,
`inventory`, `gold`, `chapter`, `location` and `unlockedCrests`; leave out `playtime`,
`stats`, `bestiary` and character HP, MP and EXP, which battles randomise.

| Scene | How to start it | What it must show |
|---|---|---|
| Nana's house, first visit (dialogue, an item, a join, a quest) | `h.goto('lf_nana_house', 4, 6, 'up')`, `h.talk('nana')` | Skipped state equals watched state; `fishing_net` in the bag; a toast for it |
| The Kindling (a long scene that ends by teleporting home) | `h.goto('lf_lantern', 7, 11, 'up')` with `ch1_named` set | Equal states; the skip ends on `lf_wren_house`, not before the teleport |
| The brooch in the Tide Caves (dialogue, battle, dialogue) | `h.goto('lf_tidecaves', 1, 16, 'right')`, `h.stepOn(36, 24)` | The skip stops with `game.scene` a `BattleScene` and `game.skipping === false` |

Also assert: holding for 0.8 s then releasing changes nothing; after every skip
`field.busy === false`, the curtain's opacity is 0, `#fader`'s opacity is 0 and the
camera is following the player again (`field.camTarget === null`); a skip started while
`#fader` is mid-fade ends with the screen visible; `s.noSkip()` makes a full one-second
hold do nothing; the longest skip takes under two seconds of real time (log the figure).

**Watch for.** A script that awaits something off the game clock will stall the
fast-forward: search `src/story` and `src/script` for `setTimeout` and `sleep(` when
you start (there are none today). `game.autoConfirm` in the harness already behaves
much like a skip; turn it off in this test so the skip path is what is measured.

## Package 2 — Quests: levels, colours, a pinned tracker

**Why.** The Journal lists side quests but not which ones the party is ready for,
and nothing on screen tracks a quest the player cares about.

**What the player sees.** Each active quest in the Journal shows a recommended level,
coloured and marked by how the party compares. The Journal has a cursor; Confirm pins
the highlighted quest. The pinned quest sits under the objective in the top-left:
`[SIDE] Three Tin Tags (2/3)`, the count moving as the parts are found.

**Data.** Add `src/data/quests.js` and the types below. Titles and step text stay
where they are (the `s.quest` calls); the registry adds only what those cannot say.
Most quests need no entry at all, because type and level have derived defaults.

```ts
// src/types/data.d.ts
export interface QuestCounter {
  /** Applies while the quest's desc starts with this, the way objectives/side*.js
   *  match a step. Omit it to apply to every step. */
  step?: string;
  need: number;
  /** Count how many of these flags are set… */
  flags?: string[];
  /** …or how many of this item are carried… */
  item?: string;
  /** …or read this story variable. */
  var?: string;
}
export interface QuestDef {
  type?: 'side' | 'bounty' | 'rite' | 'lost';
  /** Party level the quest is tuned for. Derived from its markers' maps when omitted. */
  recLevel?: number;
  /** Flags the quest needs before it can be finished (shown as "Needs …" text). */
  requires?: string[];
  counters?: QuestCounter[];
}
```

- `questType(id)`: the registry's `type`, else by id: ids containing `bounty` or
  starting `side_b_` are bounties, `c11_rite_` are rites, the Lost Callings' ids (see
  `questId` in `src/story/lost.js`) are `lost`, everything else is `side`.
- `questLevel(id, state)`: the registry's `recLevel`, else the highest enemy level
  among the encounter troops of the maps its current markers point at
  (`sideQuestTargets(id, desc)` → `MAPS[map].encounters.troops` → `TROOPS` →
  `ENEMIES[…].level`), else `null` for a quest that never leaves town. A `null` level
  shows no badge.
- Give explicit `recLevel` to quests that end in a boss the map's encounters do not
  predict: the bounties, the rites and the Lost Callings at least.

**Difficulty.** `Δ = partyLevel(state) − questLevel` (`partyLevel` is exported by
`src/script/Lines.js`: the floor of the active party's average level).

| Δ | Colour | Mark | Word |
|---|---|---|---|
| `Δ ≥ 2` | `#4CAF50` | ● | Safe |
| `−1 ≤ Δ ≤ 1` | `#FFD700` | ◆ | Even |
| `Δ ≤ −2` | `#E53935` | ☠ | Dangerous |

**Journal.** Give `JournalScreen` a cursor over the active quests (Up / Down; the
existing `ListView` in `src/ui/menu/common.js` does this). Each row: type tag, title,
`Lv N` with the colour, mark and word above, where it leads (already computed by
`where(q)`), and the description. Confirm pins or unpins. Finished quests stay listed
below, unselectable. Cancel closes, as now.

**Pin.** Store `state.vars.pinnedQuest` (a quest id, or absent). Draw it in
`QuestMarkers.refresh()` as a second block inside `.quest-tracker`, under the
objective: `[TYPE] Title`, then ` (n/need)` when a counter applies to the current
step, then the first sentence of the description in small text. Clear the pin when
the quest is done. The count is read live: `QuestMarkers.refresh()` already runs
after every script and on returning from a menu; also refresh it when the inventory
count it watches changes. Settings → Side Quest Markers (`hideSideQuests`) hides the
pin block along with the blue markers.

**Prove it** in `tests/quests.test.js`:
- With a quest of level 10: party average 12 gives Safe, 11 and 9 give Even, 8 gives
  Dangerous. Check the class, the mark and the word in the Journal's DOM.
- `questType` returns bounty, rite, lost and side for one real id of each kind.
- `questLevel` for a quest whose marker is in the Tide Caves equals the highest level
  among that map's encounter enemies.
- Pin a three-part quest with a `flags` counter: the tracker reads `(0/3)`, then
  `(1/3)`, `(2/3)`, `(3/3)` as the flags are set; an `item` counter follows
  `inventory.add`.
- The pin survives `serialize` → `deserialize`, and clears when the quest is marked
  done.
- Every quest id the story passes to `s.quest(` resolves a type, and every `flags`
  entry in a counter is a flag some story file sets (scan `src/story/` as
  `tests/side_quests.test.js` does).

## Package 3 — Balance guard: unwinnable fights and statuses that never end

**Why.** The simulators print tables and fail nothing, so a balance regression or a
stalling boss can ship. One nearly did: the `ch8` story test was seen timing out past
turn 820 against its boss in two runs of three, and nothing but luck showed it.

**Baseline, measured today** with `tools/test.sh balance 1500000` (463 troops, four
fights each at the troop's level, Normal difficulty):

- Two of 1,852 fights hit the simulator's 400-turn cap: one each for
  `pg_boss_first_dark` and `pg_arena_10`. The balance table counts a capped fight as a
  loss without saying so.
- Lowest win rates: `pg_boss_first_dark` 0%, `side_hidden_star` 0%, `pg_arena_8` 50%,
  `bc_c4_phalanx` 75%, `c12t_watchers` 75%, then five troops at 83%. With four fights
  per troop each figure is only good to ±25 points.

**Build** `tests/balance_guard.test.js` on the pure battle logic (no rendering), reusing
`makeParty` and the loop in `simulate` (copy the loop so you can instrument it; raise
its cap to 1,200 actor-turns). Fixed seeds, Normal difficulty, and enough fights per
troop to reach at least 1,000 actor-turns and at least 30 fights.

1. **Classify each troop.** *Encounter*: listed in some map's `encounters.troops`.
   *Story boss*: `boss: true` and started by a literal `s.battle('<id>'` in a main
   chapter file under `src/story/` (not `side*`, `postgame*`, `lost*`, `mount*`).
   *Optional*: everything else, including ids starting `side_`, `pg_`, `lc_`, `bc_`.
2. **Floors.** Encounter troops win at least 90% of fights. Story bosses at least 60%.
   Optional troops at least 40%.
3. **No stalls.** No fight reaches the 1,200-turn cap. Report capped fights separately
   from losses.
4. **Statuses end.** Instrument the loop after every `endTurn`:
   - a status with `STATUSES[id].turns > 0` is gone within `turns + 1` of its bearer's
     own turns, unless it was re-applied (track the last application);
   - `airborne`, `doubled`, `charging` and `windup` never last more than two of the
     bearer's own turns, and `doom` never more than four;
   - a fallen battler has no statuses and no stat stages (`onKo` clears them), and
     nothing ticks on it;
   - a battler killed at the start of its turn by poison, burn or doom does not act
     that turn, appears once in `sys.defeated`, and its EXP is counted once in
     `applyRewards()`.
5. **A ratchet, not a wish.** Keep a `KNOWN` table in the test:
   `{ troopId: { floor, reason } }` for troops that miss a floor today for an
   understood reason (the two post-game superbosses are tuned for Link Arts, which
   auto-play cannot use). A known troop must still beat its own recorded floor. Any
   other troop under its floor fails the test.
6. Print the ten weakest troops and every capped fight whether or not the test fails.

**Do not rebalance anything in this package.** If a story troop misses its floor, list
it in your report with the measured rate; do not add it to `KNOWN` on your own.

**Prove it.** The test passes on the current data with only justified `KNOWN` entries.
Then show it has teeth: temporarily give one encounter enemy ×5 HP and confirm the
test names that troop; temporarily make `tickDurations` skip `sleep` and confirm the
status check fails. Describe both runs in the report and revert them.

## Package 4 — Save migration

**Why.** `SAVE_VERSION` is 1 and has never changed, so the day a save format changes
is the first time the path runs. Players keep saves for months and can export them.

1. Add `migrate(data)` to `src/state/GameState.js`: an ordered table
   `{ 1: (d) => d, … }` keyed by the version a function upgrades *from*, applied in a
   loop until `data.version === SAVE_VERSION`. Call it at the top of
   `GameState.deserialize`, so the title screen, `game.loadSave`, the battle retry and
   `SaveStore.importFile` all get it. A save from a newer version is still refused
   with the existing message.
2. Leave `SAVE_VERSION` at 1 unless something in this pass really changes the shape.
   `state.vars.pinnedQuest` and new settings do not: missing keys already default.
3. Add `tests/fixtures/save-v1.json`: a real mid-game save in the exported format
   (`SaveStore.exportFile(slot)`: `{ format: 'afterlight-save', version, exportedAt,
   summary, data }`). Produce it by running the Chapter 3 story test to its end with a
   temporary line that writes the export into the page, and save that JSON. Expect
   30–60 KB. Commit it; never regenerate it, since it stands for a save from today.
4. `tests/save_migration.test.js`:
   - `SaveStore.importFile(0, fixtureText)` succeeds; loading slot 0 enters the saved
     map with the saved party, gold, flags, inventory, Crests and objective; the party
     can walk three tiles and open the menu.
   - Strip `settings.voiceVolume`, `settings.autoAdvance` and `settings.keys` from a
     copy: it loads with 0.8, `false`, and the default bindings.
   - Strip `vars.quests`, `bestiary` and `stats` from a copy: it loads, and the
     Journal and Bestiary screens open without error.
   - A copy with `version: 99` is refused with "newer version", and the slot is
     untouched.
   - A fake `0 → 1` step registered for the test runs exactly once on a copy marked
     `version: 0` and not at all on the fixture.
   - The old save shows quest markers: the main objective's gold marker resolves for
     its `vars.objective` text.

## Package 5 — Corner sliding in the field (prove the catch first)

**The suspected defect.** `Actor.tryMove(dx, dz, grid, blockers)` tests four corner
points at ±0.28 tile and applies the x and z parts separately, so the player already
slides along walls when moving diagonally. But the player is 0.56 tile wide and a
doorway is 1 tile, leaving 0.22 tile of margin each side. Walking straight at a
one-tile gap while more than 0.22 tile off its centre line, one corner point lands in
the wall, the move is refused, and with no sideways input nothing slides: the player
stops dead with up to 0.28 tile of shoulder caught.

1. **Show it.** In `tests/corner_slide.test.js`, register a small test map with
   `registerMaps` from `src/data/maps/index.js` (a 7×7 room whose `ground` rows are
   `=` floor with a row of `W` wall across the middle and a one-tile gap in it). Place
   the player below the gap, 0.3 tile left of its centre line, hold Up for one second,
   and assert `player.z` has not passed the wall row. If the player gets through,
   there is no defect: stop, report, and skip the rest.
2. **Fix it** in `tryMove`, for single-axis moves only. When the move is refused, and
   the tile straight ahead of the actor's *centre* is steppable (`grid.canStep`), and
   the refusal came from the tile corners on one side only (not from another actor):
   move the actor perpendicular toward the centre line of its own column by at most
   `|move|` this frame, through the same `ok()` test. The next frames continue until
   the corner clears. Never slide when the centre tile ahead is blocked: that is
   walking into a wall, and it must stay a stop.
3. Enable it for the player only (walking, running and riding Kindle) through an
   `opts.slide` argument that `FieldScene.handlePlayerInput` passes. NPC wandering,
   followers and scripted walks (`walkPath`) do not use `tryMove`'s slide.

**Prove it.** The test from step 1 now passes the gap, from both sides and for all
four directions of travel. Walking straight into the middle of a wall still stops
with `player.moving === false`. The player cannot pass between two blocked tiles that
touch only at a corner. A door is still opened by walking into it from 0.3 tile off
centre (`FieldScene.tryDoor`), and `tests/shop_counter.test.js` and
`tests/cutscene_paths.test.js` still pass.

## Package 6 — Menu input (prove the drop first)

**The suspected defect** is a press lost while a menu opens. This engine has no
sliding panels: every menu is a DOM widget drawn in the same frame its input arrives.
A press can only be lost in three places, so test those and build only what fails.

| Where | Why a press could be lost | Test |
|---|---|---|
| `input.consumeAll()` after Confirm or Cancel (41 call sites in 13 files) | It clears every edge of the frame, so a direction pressed in the same frame as Confirm vanishes | Add `confirm` and `down` to `input.edges` in one frame on the main menu; expect the submenu to open with its second row selected |
| A frame with no widget on top: `game._transitioning` fades, and the first `await import()` of `WorldMapScene` or `BattleScene` | Edges are cleared at `endFrame()` with nobody listening | Press Menu, then Down two frames later; open the world map from the menu and press Down during its fade |
| Two presses of one key inside one frame | `edges` is a `Set` | Dispatch two `keydown` / `keyup` pairs for ArrowDown between frames; expect the cursor to move twice |

- If the first case fails, fix it at the source: in list-driven screens consume only
  the action that was handled (`input.consume('confirm')`). No buffer is needed for it.
- If the second or third fails **and** it is reachable by a player at normal speed,
  add the buffer: a queue of at most 4 frames (about 66 ms) of edges, first in first
  out, delivered one frame's worth at a time to the top widget, cleared on scene
  change. It never delivers into a `DialogueBox` or a `ChoiceBox` that was not on
  screen when the key was pressed, so a late press cannot skip a line or pick an
  option unseen.
- If nothing fails, add the tests as regression cover and report that the buffer was
  not needed.

## Package 7 — Optional: expression portraits and battle barks

Do these only when packages 1–6 are finished.

- `{portrait=shock}` in a line swaps the speaker's portrait for that line (and
  `{portrait}` restores it). Portraits are cropped from the character's field sprite
  (`getPortrait(look, scale)` in `src/render/SpriteFactory.js`), so this needs
  expression variants painted there: brows, eyes and mouth for `neutral`, `smile`,
  `shock`, `anger`, `sad`. That painting is nearly all of the work. Handle the tag in
  `DialogueBox.runCues` beside `wait`, `speed`, `shake` and `sfx`, add it to
  `CONTROL_TAG` in `src/ui/UI.js`, and to the tag lists in `spokenText`
  (`src/script/Lines.js`) and `spoken_text` (`tools/voice.py`) so voice ids do not
  change. An unknown expression falls back to neutral with a console warning.
- Boss taunts (`c.say('…')` in boss AI, shown by `BattleUI.message`) get voice ids as
  `battle/<enemy id>/<hash>` and rows in `tools/voice.py export`. Keep the two hash
  implementations in step: `tools/voice.py check` and `tests/lines.test.js` print and
  assert the same sample ids.

## Edge cases to prove with tests

| Case | Expected |
|---|---|
| Skip started while `#fader` is mid-fade | Screen fully visible when the skip ends |
| Skip during a walk with three followers | Followers regrouped behind the leader, none left mid-path |
| Skip across a teleport | Ends on the destination map after its `onEnter` scene |
| Skip with Fast Mode on | The hold still takes 1.0 s of real time |
| Skip with the backlog open | The hold does not count; closing the backlog allows it again |
| Skip reaching a choice, a battle or a shop | The skip stops there; the curtain lifts first |
| A voice line playing when a skip starts | Cut off; none start during the skip |
| Auto-advance on, after a skip | Resumes on the next line shown |
| Defeat with poison ticking, after a swap, after a summon | Try again restores HP, MP, statuses, items used, and the summon is gone |
| Load last save with no save present | The option is not offered |
| Autosave between a defeat and the choice | None is written |
| Pinned quest finished during a skipped scene | The pin is cleared when the skip ends |
| A save from before this pass | Loads; every new setting at its default; markers resolve |
| A status applied on the bearer's own turn | Survives that turn's tick (`skipTick`), then ends on schedule |

## Out of scope

Generating voice audio or calling any speech service. Converting existing scenes to
the line language wholesale. New story content. Rebalancing fights (package 3 reports,
it does not tune). Changing the renderer, the engine, or the no-build setup.

## Done means

- `tools/npm.sh run typecheck`: 0 errors.
- `SIM=240 tools/test_all.sh`: every test passes, or each failure is shown to predate
  the work by running it on the commit before yours.
- `tools/npm.sh run build` succeeds.
- New tests: `skip`, `quests`, `balance_guard`, `save_migration`, `corner_slide`, and
  `menu_input` if package 6 found anything.
- `docs/PROGRESS.md` has an entry per package; `docs/AUTHORING.md` covers `s.noSkip`,
  the quest registry and counters; the in-game Guide explains skipping, quest levels
  and pinning; the README controls table has the hold-to-skip row.
- One commit per package on `main`, with a message that says what changed and which
  test proves it. Nothing pushed.

## Report back with

For each package:
1. What was built, in two or three sentences, and the files it touched.
2. The test that proves it and its result.
3. Measured numbers: the longest skip in seconds; the weakest ten troops with win
   rates and fight counts; the number of capped fights; the fixture's size.
4. Anything you chose not to build and the evidence (for packages 5 and 6, the result
   of the "prove it first" test).
5. Any test that failed, and whether it also fails on the commit before your work.

Lead with what is not done or not verified. Give figures, not adjectives.
