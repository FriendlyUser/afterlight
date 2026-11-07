# AFTERLIGHT

*The world ended on the day I came of age. This is what we built after.*

A 2D-HD JRPG built with three.js — pixel-art characters in lit, depth-of-field
dioramas — about a girl who causes the end of the world at sixteen, and grows up anyway.

## Play

```bash
python3 -m http.server 8765
```
Open <http://localhost:8765/> in a modern browser (WebGL2). No build step, no assets:
every sprite, texture and note of music is generated at runtime (only the fonts are
files, in `fonts/`).

**Controls:** arrows/WASD move · Shift run · Z/Enter confirm & talk · X/Esc cancel ·
C menu · Q/E switch leader (field) or Surge (battle) · F auto-battle / optimize gear.
Gamepads work. Settings include text size/speed, encounter rate, difficulty (Story /
Normal / Hard), battle speed, minimap, and reduced flashes & shake.

## Web build (Vite)
The game needs no build to run or develop. For a release, Vite bundles and minifies it
into `dist/` (one HTML file, a CSS file, ~25 JS chunks: the engine, three.js, and one per
chapter; ~2.9 MB, ~0.9 MB gzipped). Upload the contents of `dist/` to any static host
(itch.io HTML5, GitHub Pages, Netlify…); all paths are relative.

```bash
npm install          # once (Vite is the only dependency)
npm run build        # -> dist/
npm run preview      # serve dist/ on http://localhost:8767/
npm run dev          # optional Vite dev server on http://localhost:8766/
```
From WSL without Linux Node, use `tools/npm.sh install`, `tools/npm.sh run build`, etc.:
it runs the Windows npm against the WSL folder (and makes Vite poll for file changes,
since native watching doesn't work across that share). Windows npm can't delete a
`node_modules/` on that share, so for `npm ci` remove the folder from WSL first.

### GitHub Pages
`.github/workflows/pages.yml` builds and publishes the game on every push to `main`
(or manually from the Actions tab): `npm ci` → `npm run build` → deploy `dist/`.
1. Push this folder as the repository root (the workflow must sit at `.github/` there).
2. In the repository's Settings → Pages, set Source to **GitHub Actions** (once).
3. Push to `main`; the game appears at `https://<user>.github.io/<repo>/`.

`dist/` and `node_modules/` are git-ignored; CI rebuilds them. Commit
`package-lock.json` so `npm ci` installs the exact same Vite.

Notes: three.js stays vendored in `vendor/three` and both setups use it; the headless
tests run against the unbundled source, and the build leaves the test harness out.
The fonts (Alegreya, Alegreya Sans SC, Cinzel; Latin subsets) are self-hosted in
`fonts/` with their OFL licenses, so the game makes no external requests and works
offline; the build copies the licenses to `dist/fonts/`.

## Features
- **Battle:** conditional-turn timeline, Poise & Break, the shared Afterglow gauge
  (Surge and duo/trio Link Arts), status effects, scripted bosses whose telegraphed
  attacks you can Guard against or interrupt with a Break, Swap, auto-battle.
- **24 Crests** (8 callings, 10 braided, 6 legendary) × 10 ranks; primary + secondary
  Crest; Support abilities with a point budget; 300+ Arts.
- **Story:** 14 chapters across three acts (~74k words of scenes), plus a post-game descent.
- **Side content:** the Hunters' Lodge bounty board (10 marks + 2 hidden hunts), four
  optional dungeons, fishing, per-town side quests, New Game+.
- Procedural pixel art for characters, monsters, tiles and props; WebAudio soundtrack;
  the party walks the world together as a caravan; a minimap outdoors and in dungeons.

## Project layout
- `src/core` loop & input · `src/render` renderer, post FX, procedural art · `src/world`
  field, maps, actors, world map · `src/battle` rules, AI, presentation · `src/ui` menus ·
  `src/audio` synth & songs · `src/state` save data · `src/data` game data & content packs ·
  `src/story` scripted scenes · `tools/` map painter & test runners · `tests/` headless tests.
- Docs: `docs/STORY.md` (story bible), `docs/AUTHORING.md` (content guide),
  `docs/PROGRESS.md` (status).

## Debug & tests
`?map=<id>&x=&y=&party=ilse,bram&lv=20` jumps into a map; add `&battle=<troop>&bg=<bg>`,
`&menu=crests|world|settings|shop:<id>`, `&flags=a,b`. Headless (Windows Chrome via WSL):
- `tools/test.sh validate 40000` — cross-reference checks for all content.
- `SIM=240 tools/test.sh <test> 2400000` — one story smoke test (`tests/<test>.test.js`).
- `SIM=240 tools/test_all.sh [regex]` — the suite, one test at a time.
- `tools/test.sh balance 1500000` — simulate every troop; `crest_balance` — every Crest;
  `EXTRA='troop=<id>' tools/test.sh fightlog 100000` — one fight, turn by turn.
- `tools/shot.sh "<url>" out.png 9000` — screenshot; `tools/frame.sh "map=…&battle=…" out.jpg`
  — the rendered 3D frame (use for battles). See `docs/PROGRESS.md` for details.
