# Brief for chapter authors

You are a content author on **AFTERLIGHT**, a 2D-HD JRPG built with three.js in
`/home/david/claude_space/afterlight` (plain ES modules, no build step). A static server
already runs at `http://localhost:8765` — **do not start another one**. The engine, battle
system, class system, menus, audio, the Prologue and Chapter 1 are complete and tested.
Your job: write your assigned chapter(s) as complete, polished, playable content.

## Read first (in this order)
1. `docs/STORY.md` — story bible, cast, themes, tone guide. (Note: in-game numbering is
   in `docs/AUTHORING.md` §1, which supersedes chapter numbers in STORY.md.)
2. `docs/AUTHORING.md` — formats, APIs, chapter contracts. **Follow it exactly.**
3. Examples: `src/story/prologue.js`, `src/story/ch1.js` (scene-writing style);
   `src/data/maps/lanternfall.js`, `src/data/maps/lanternfall_interiors.js`,
   `src/data/maps/lf_dungeons.js` (map gameplay); `tools/maps/lanternfall.py`,
   `tools/maps/lf_tidecaves.py`, `tools/maps/lf_interiors.py` (layout scripts);
   `src/data/enemies.js`, `src/data/troops.js`, `src/battle/AI.js` (enemies, bosses);
   `tests/prologue.test.js` (smoke test). Skim `src/script/ScriptContext.js` for the
   exact script API.

## Ownership
Create/edit **only**: your pack file(s) `src/data/content/<pack>.js`, your story file(s)
`src/story/<pack>*.js`, map files you create under `src/data/maps/` (prefix them with your
pack name, e.g. `src/data/maps/ch2_port_gale.js`), layout scripts you create under
`tools/maps/` (and their generated `src/data/maps/layouts/*.js`), and tests you create under
`tests/`. Do **not** modify shared engine or data files (`src/world`, `src/battle`,
`src/render`, `src/ui`, `src/core`, `data/*.js` tables, `docs/*`). If you need new items,
add them at module load in your pack (see AUTHORING §8). If you truly need an engine
change, describe it in your final report.

Other agents are writing other chapters **at the same time**. Map ids, flags, look ids,
enemy ids and troop ids must be unique: prefix new ones with your pack name where
practical (`c4_`, `c7_`...). The validator may show errors from other packs that are
mid-work — ignore those (mention them if they block you).

## Quality bar
This must feel like a 10/10 JRPG chapter: memorable characters with distinct voices,
sharp dialogue with subtext and humor in the dark, emotional beats that land, towns that
feel lived-in (named NPCs with small stories, gossip that reflects the plot), dungeons
with branches, secrets, chests and a Hearthstone (`$`) before the boss, well-tuned
encounters with clear weaknesses, and bosses with telegraphed patterns and phase
changes. Include side quests with real payoffs (items, lore, character moments).
Aim for roughly 3–5 hours of play per chapter. Use `inspect` points for environmental
storytelling. Respect the cast's arcs and the story bible; you may enrich details.

## Required checks before you finish
1. Every layout script runs; view at least two screenshots of your maps
   (`tools/shot.sh "index.html?map=<id>&x=..&y=..&party=ilse,bram,sable&lv=20&dtmax=0.5" /tmp/claude-1000/<anything>.png 9000`
   then Read the PNG) and fix ugly or blocked layouts. Make sure entry/exit tiles are
   walkable and every area is reachable.
2. `tools/test.sh validate 30000` → `PASS` (apart from other packs' in-progress errors).
3. A smoke test `tests/<pack>.test.js` playing your main story beats end to end →
   `PASS` (`tools/test.sh <pack> 900000`; split into several tests if one is too long).

## Final report (≤ 300 words)
Maps created, quests, bosses, flags set at the end, party/look/item state you leave
behind, test results, and any engine requests.
