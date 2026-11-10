# Afterlight polish pass — the prompt

This is the "commercial-grade overhaul" brief, rewritten so a coding agent can act on
it in this repository. Hand the section **The prompt** (everything below the line) to
the agent, or tell it to follow this file.

## What changed from the original brief, and why

- **It asks for working code in this repo, not blueprints.** The original asked for
  data structures "in TypeScript, GDScript, or C#" and prose designs. The game is plain
  JavaScript modules type-checked with JSDoc, so the brief now names the files, the
  types to extend and the tests that prove each feature.
- **It stops asking for things the game already has.** The turn timeline, the
  retry-from-snapshot, hidden weaknesses, the battle speed switch and "first Confirm
  completes the line" all existed. An agent told to "implement" them would build
  duplicates. They are listed under *Already in the game* instead.
- **It fits the engine instead of fighting it.** Scenes are imperative scripts, so
  "evaluate the scene's terminal payload" becomes "fast-forward the same script", which
  gives the same end state by construction. Speed tags are multipliers because Text
  Speed is a player setting. Pixel and frame counts became tile fractions and seconds.
- **Every item has an acceptance test and a stated reason.** The original had neither,
  so "done" was a matter of opinion.
- **Scope is explicit.** It is ordered, says what is out of scope (voice generation,
  rewriting old scenes, new story), and says how to verify and report.

## Where the original brief stands

| Original item | Status |
|---|---|
| §1 Branching predicates, fallback branch | **Done.** The line language: `src/script/Lines.js` |
| §1 In-line text tags | **Done:** `{wait=}` `{speed=}` `{shake=}` `{sfx=}`. `{portrait=}` is open (package 5) |
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
| §6 Menu input buffer | Open (package 3) |
| §6 Corner sliding | Open (package 4) |
| Headless balance runner | Partly: three simulators exist; the pass/fail guard is open (package 6) |
| Voice acting | Playback hook **done** (`voice/README.md`). Generating audio is out of scope |

---

# The prompt

## Goal

Finish the polish pass on Afterlight, a three.js JRPG in this repository: make
cutscenes skippable, give quests levels and a pinned tracker, smooth two rough edges
in input and movement, and add guards that catch unwinnable fights and broken saves
before a player does. Players should feel the difference within the first hour.
Deliver working, tested code, one commit per package.

## Read first

- `docs/PROGRESS.md` for what exists and how it is tested (the *Testing* section has
  every command).
- `docs/AUTHORING.md` for the script API and data formats.
- `src/script/Lines.js`, `src/script/ScriptContext.js`, `src/ui/UI.js` (dialogue),
  `src/world/FieldScene.js` (`runScript`, movement), `src/battle/BattleSystem.js`.
- `src/types/data.d.ts` for the data shapes. New data gets a type there.

## Ground rules

- **Plain JavaScript modules with JSDoc types; no build step to play or test.** Do not
  convert files to TypeScript or add runtime dependencies.
- **`tools/npm.sh run typecheck` stays at 0 errors**, and the headless suite
  (`SIM=240 tools/test_all.sh`) stays green apart from failures that predate your
  work. If a test was already failing, say so; do not "fix" it by loosening it.
- **Settings live in `state.settings`** so they travel with saves and exported save
  files. A new setting needs a default in `GameState` and a row in the Settings screen.
- **Respect Settings → Flashes & Shake.** Anything that shakes, flashes or zooms scales
  with `game.shakeScale` / `renderer.flashScale`.
- **Story scripts are imperative `async (s) => { … }` functions**, about 7,000 lines of
  dialogue across `src/story/`. Do not rewrite scenes into data. Use the line language
  only where you touch a scene anyway.
- **Verify a problem exists before building its fix.** For packages 3 and 4, first write
  the test that shows the defect. If you cannot make it fail, report that and skip the
  package.
- Commit on `main`, one commit per package. Do not push.

## Already in the game — build on these, do not rebuild them

- **Dialogue:** `s.say` / `s.narrate` / `s.think` / `s.talk` take the line language
  (conditions such as `'party:bram & item:tonic>=2'`, `pick` with a fallback branch,
  `ask` choices, `set`, `run`). The dialogue box types text with per-speaker blips,
  inline tags, a backlog on Up, and auto-advance.
- **Voice:** every line has a stable id (`voiceId`), and a recording listed in
  `voice/manifest.json` plays in place of the blips. `tools/voice.py export` lists the
  lines. Nothing generates audio, and nothing should.
- **Battle:** a CTB timeline on Action Value (`baseAV = 10000 / spd`; acting sets
  `av = baseAV × actionDelay`), with a live preview while choosing a command. Poise and
  Break, hidden weaknesses remembered in `state.bestiary`, hit-stop
  (`game.hitStop(seconds)`), impact sounds, Battle Speed and Fast Mode.
- **Defeat:** the battle keeps a serialized snapshot of the state taken as it began.
  The defeat screen offers Try again (restore it), Load last save, and the title.
- **Quests:** `s.quest(id, title, desc, status)` writes `state.vars.quests`; the Journal
  lists them; gold (main) and blue (side) markers come from `src/data/objectives/`.
- **Simulators:** `tests/balance.test.js` (every troop, equal-level party),
  `prologue_balance` (the real opening party, state carried between fights) and
  `crest_balance`.

## Work packages, in order

### 1. Hold to skip a cutscene

**Why:** replaying after a defeat or on New Game+ means sitting through scenes again.

- Hold Cancel for 1.0 s while a script is running: a ring fills beside the dialogue
  box (UI clock, so Fast Mode does not shorten it), and releasing early cancels it.
- Skipping **fast-forwards the same script** rather than jumping to an end state:
  `game.skipping` makes dialogue close at once (lines still enter the backlog), waits,
  tweens, walks and fades complete immediately, and sound effects and voice are muted.
  The end state is then identical to watching the scene, by construction.
- The skip **stops by itself** when the script ends or reaches something only the
  player can do: a choice, a battle, a shop or save menu, fishing, the world map.
- Cover the fast-forward with its own curtain (fade to black in 0.2 s, back in when
  the skip ends) so script fades and teleports underneath cannot fight it.
- `s.give` popups during a skip become toasts, so nothing is granted silently.
- A script can refuse: `s.noSkip()` for tutorials and one-time tips.

**Accept when** a new `tests/skip.test.js` shows, for three scenes including one with a
teleport and one with a mid-scene battle: (a) the serialized state after a skipped run
equals the state after a watched run from the same save; (b) control returns with the
camera on the player and `field.busy === false`; (c) the skip halts at the choice and at
the battle; (d) releasing before 1.0 s does nothing; (e) starting a skip during a fade
leaves the screen fully visible afterwards.

### 2. Quests: levels, colours, a pinned tracker

**Why:** the Journal lists quests but not which ones the party is ready for.

- Add `src/data/quests.js`: `{ id, title, type: 'main' | 'side' | 'bounty' | 'rite',
  recLevel, requires?: string[], steps?: [{ text, count?: { flags?: string[], item?:
  string, need: number } }] }`, typed as `QuestDef` in `data.d.ts`. `s.quest` keeps
  working as it does; the registry adds what it cannot know. Take `recLevel` from the
  enemies the quest leads to.
- Difficulty from `Δ = partyLevel(state) − recLevel` (`partyLevel` is in
  `script/Lines.js`): `Δ ≥ 2` green `#4CAF50`; `−1 ≤ Δ ≤ 1` gold `#FFD700`; `Δ ≤ −2`
  red `#E53935` with a skull. Show it in the Journal as "Lv N" in that colour, never by
  colour alone.
- Pin one quest from the Journal. It shows under the objective tracker (top-left; the
  minimap owns the top-right) as `[SIDE] Ancient Relics (2/3)`, the count read live
  from the step's flags or item count. The pin is saved with the game.

**Accept when** `tests/quests.test.js` shows the three colour bands at their boundary
levels, a counter moving 1/3 → 2/3 → 3/3 as flags are set, the pin surviving save and
load, and every quest id passed to `s.quest(` in `src/story/` having a registry entry
(scan the sources as `tests/objectives.test.js` does).

### 3. Menu input buffer

**Why (to be confirmed):** a press that lands while a menu is opening may be dropped.

- First write a test that presses Confirm then Down on consecutive frames across a menu
  opening, a submenu opening and a screen loaded with `import()`. If no press is lost,
  stop and report.
- If presses are lost: buffer edges only (never held state) for at most 4 frames
  (about 66 ms), first in first out, cleared on scene change. Never carry a press into
  a dialogue box or a choice, where it would skip a line or pick an option unseen.

### 4. Corner sliding in the field

**Why (to be confirmed):** the player can catch on the corner of a wall or doorway.

- First write a test that walks the player at a doorway offset sideways by 0.1 tile
  and shows them stopping.
- In `Actor.tryMove`, when the move is blocked by a single tile corner and the overlap
  is at most 0.12 tile, slide perpendicular toward the open side at no more than the
  current speed. Apply it to the player and the mount only, never to scripted walks.

**Accept when** the doorway test passes, the player cannot squeeze between two blocked
tiles that touch at a corner, and `shop_counter` (door bumping) still passes.

### 5. Optional: expression portraits and battle barks

- `{portrait=shock}` in a line swaps the speaker's portrait. This needs expression
  variants in `SpriteFactory.getPortrait` (brows, eyes, mouth), which is most of the work.
- Boss taunts (`c.say(…)` in boss AI) get voice ids too, as `battle/<enemy>/<hash>`, and
  appear in `tools/voice.py export`.

Do these only if packages 1–4 and 6–7 are finished.

### 6. Balance guard: unwinnable fights and statuses that never end

**Why:** the simulators print a table but fail nothing, so a regression can ship.

- Add `tests/balance_guard.test.js` on the pure battle logic (no rendering), auto-play
  from `src/battle/AutoPlay.js`, fixed seeds, at least 1,000 actor-turns per troop:
  - no story troop under 60% wins, and no boss under 40%, at the troop's level with
    the party the story has at that point (`tests/party_kit.js`);
  - no fight reaching the 400-turn cap (a stall is a failure, not a draw);
  - every status applied ends: it expires within its declared duration + 1 turn, is
    cured, or its bearer falls. No status ticks on a fallen battler, and a battler
    killed by poison or burn is counted once (one KO, one reward).
- Print the worst ten troops whether or not it fails, so a near miss is visible.

### 7. Save migration

**Why:** `SAVE_VERSION` is 1 and has never changed, so the path is untested.

- Add `migrate(data)` in `GameState`: an ordered table of `version → function`, run on
  load and on import, ending at `SAVE_VERSION`. Leave the version at 1 unless a change
  in this pass needs it.
- Add `tests/fixtures/save-v1.json`, a real mid-game save captured now, and a test that
  loads it, checks party, flags, inventory, settings defaults for keys the save lacks
  (`voiceVolume`, `autoAdvance`), and walks a few steps.

## Edge cases to prove with tests

- Skip started during a screen fade, during a walk with followers, across a teleport,
  with Fast Mode on, and with the backlog open.
- Skip reaching a choice, a battle and a shop: each stops the skip.
- A voice line playing when a skip starts is cut off, and auto-advance resumes after.
- Defeat with a status ticking, after a mid-battle swap, and after a summon: Try again
  restores HP, MP, statuses, items used and the summon's absence.
- Load last save with no save present: the option is not offered.
- An autosave is never written between a defeat and the choice that follows it.
- A save from before this pass loads with every new setting at its default.

## Out of scope

Generating voice audio or calling any speech service; converting existing scenes to
the line language wholesale; new story content; changing the renderer or the engine.

## Done means

- `tools/npm.sh run typecheck`: 0 errors.
- `SIM=240 tools/test_all.sh`: every test passes, or each failure is shown to predate
  the work by running it on the commit before yours.
- `tools/npm.sh run build` succeeds.
- `docs/PROGRESS.md` has an entry per package, `docs/AUTHORING.md` covers any new script
  API, and the in-game Guide (`src/ui/menu/screens.js`) explains anything a player
  can see.

## Report back with

For each package: what was built, the test that proves it, and anything you chose not
to do and why. List any test that failed and whether it also fails on the commit
before your work. Give measured numbers (win rates, timings), not adjectives.
