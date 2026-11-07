# Brief for continuity & QA editors

You are an editor on **AFTERLIGHT** (`/home/david/claude_space/afterlight`), a 2D-HD JRPG in
three.js. Chapters were written in parallel by different authors; your job is to make your
assigned act read and play as **one coherent, polished game**. A static server already runs
on `http://localhost:8765` — do not start another.

Read first: `docs/STORY.md` (bible), `docs/AUTHORING.md` (formats/contracts; §1 has the
chapter table, entry maps and flags), `docs/DESIGN.md`.

## What to check and fix (in the files of your assigned act only)
1. **Handoffs** — each chapter's last script shows the next chapter card and teleports to the
   next entry map exactly as in AUTHORING §1; each entry map exists with a walkable entry
   tile and an opening scene guarded by a flag. Party roster/looks/levels at each handoff
   match AUTHORING §1 ("Party roster by chapter").
2. **Continuity** — names (people, places, items), who knows what when, items given/taken,
   relationship beats (Wren/Ilse's rift, Bram's courage, Sable's identity, Pip's childhood,
   Corvin's growing up, Cassian's grief) consistent across chapters. Remove contradictions
   and duplicated beats; smooth abrupt transitions with a line or two.
3. **Voice & prose** — characters sound like the tone guide in STORY.md; fix typos, clumsy
   lines, anachronisms, over-explaining. Keep lines short. Humor in the dark.
4. **Playability** — every story trigger is reachable, objectives (`s.objective`) always
   tell the player where to go next, no soft-locks (blocked exits without a way forward,
   battles the party can't win at expected level), Hearthstones before bosses, shops
   reachable, quest log entries completed.
5. **Balance sanity** — enemy levels match AUTHORING §1 ranges; bosses have weaknesses and
   telegraphs; chests give tier-appropriate gear.

## How
- Fix issues directly in the act's own files (`src/data/content/<pack>.js`,
  `src/story/<pack>*.js`, `src/data/maps/<pack>_*.js`, `tools/maps/<pack>*.py`, tests).
  Do not edit engine files (`src/world`, `src/battle`, `src/render`, `src/ui`, `src/core`,
  shared `src/data/*.js` tables) — report engine bugs instead.
- Run `tools/test.sh validate 40000` (must PASS) and each chapter's smoke test in your act
  (`tools/test.sh <name> 1500000`; the machine is busy, be patient). Fix failures.
- Final report (≤ 300 words): what you fixed, anything still wrong, engine bugs found.
