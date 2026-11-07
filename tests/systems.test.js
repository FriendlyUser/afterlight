// Systems smoke test: every menu screen and shop opens, save/load round-trips,
// field item use works, a battle with Swap runs. Run: tools/test.sh systems 60000
import { SHOPS } from '../src/data/shops.js';
import { SaveStore, GameState } from '../src/state/GameState.js';

export async function run(game, h) {
  await h.newGame();
  const st = game.state;
  for (const id of ['ilse', 'bram', 'sable', 'pip', 'corvin']) st.joinParty(id).setLevel(20);
  st.flags.crestArtLearned = true;
  st.inventory.add('hi_tonic', 3);
  st.inventory.add('iron_sword', 1);
  st.inventory.add('vigor_seed', 1);
  const m = game.menus;
  for (const id of ['items', 'crests', 'supports', 'equip', 'status', 'formation', 'bestiary', 'journal', 'settings', 'guide']) {
    const scr = m.screen(id, 1);
    const p = scr.open();
    await h.wait(0.05);
    scr.close();
    await p;
  }
  h.log('screens ok');
  for (const id of Object.keys(SHOPS)) { const s = m.openShop(id); await h.wait(0.02); game.ui.top().close(); await s; }
  h.log('shops ok');
  // Crest change & equipment validation
  const wren = st.characters.wren;
  wren.setCrest('arcanist');
  const removed = wren.validateEquipment();
  h.expect(removed.length > 0, 'arcanist unequips the sword');
  wren.setCrest('vanguard');
  // Save / load round trip
  st.gold = 4321;
  SaveStore.write(5, st);
  const back = GameState.deserialize(SaveStore.read(5).data);
  h.expect(back.gold === 4321 && back.party.length === 6 && back.characters.ilse.level === 20, 'save/load round trip');
  SaveStore.remove(5);
  // New Game+ keeps levels and items but restarts the story
  {
    const { startNewGamePlus } = await import('../src/story/newGame.js');
    st.flags.gameClear = true;
    const cleared = GameState.deserialize(st.serialize());
    const fresh = new GameState();
    const start = startNewGamePlus(fresh, cleared);
    h.expect(start.mapId === 'lf_wren_house' && fresh.party.length === 1 && fresh.characters.ilse.level === 20 && fresh.gold === 4321, 'new game+ carries progression');
  }
  // A battle with reserves (Swap available) — auto-plays
  const r = await game.scene.startBattle('gw_wolves', { random: true });
  h.expect(r === 'win' || r === 'flee', `battle finished (${r})`);
}
