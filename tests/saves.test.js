// The save points in saves/ (tools/make_saves.sh): every file is an intact save the game
// accepts, opens on its map at a tile the player can stand on, carries default settings,
// and the index lists it.
// Run: SIM=240 tools/test.sh saves 600000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { GameState, SaveStore } from '../src/state/GameState.js';
import { MAPS } from '../src/data/maps/index.js';

export async function run(game, h) {
  await contentReady;
  const listing = await (await fetch('../saves/')).text();
  const files = [...listing.matchAll(/href="((?:ch\d\d|pg)_\d\d_[\w-]+\.json)"/g)].map((m) => m[1]);
  h.expect(files.length > 0, `${files.length} save files`);
  const index = await (await fetch('../saves/README.md')).text();
  const defaults = new GameState().settings;
  let first = true;
  const problems = [];
  for (const f of files) {
    const rec = SaveStore.parseFile(await (await fetch(`../saves/${f}`)).text());
    const st = GameState.deserialize(rec.data);
    const loc = st.location;
    if (!MAPS[loc.mapId]) { problems.push(`${f}: unknown map ${loc.mapId}`); continue; }
    if (st.settings.difficulty !== defaults.difficulty) problems.push(`${f}: difficulty ${st.settings.difficulty}`);
    if (!index.includes(f)) problems.push(`${f}: not in README.md`);
    if (f.startsWith('ch') && Number(f.slice(2, 4)) !== st.chapter) problems.push(`${f}: chapter ${st.chapter}`);
    if (f.startsWith('pg') && !st.flags.gameClear && !st.flags.act3) problems.push(`${f}: not past the ending`);
    Object.assign(game.state, st);
    if (first) { await game.start(new FieldScene(game), { mapId: loc.mapId, x: loc.x, y: loc.y, dir: loc.dir, skipEnterScript: true }); first = false; }
    else await game.scene.goto(loc.mapId, loc.x, loc.y, loc.dir, { skipEnterScript: true });
    await h.wait(0.2);
    const g = game.scene.grid;
    if (!g.walkable(loc.x, loc.y) && !g.isStairs(loc.x, loc.y)) problems.push(`${f}: stands on an unwalkable tile ${loc.x},${loc.y} of ${loc.mapId}`);
  }
  if (problems.length) console.error(problems.join('\n'));
  h.expect(!problems.length, `every save opens where the player can stand (${problems.length} problems)`);
}
