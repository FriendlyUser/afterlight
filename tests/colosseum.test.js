// The Bellring (Act I colosseum): data is sound; cups open with the story and in order;
// a lost cup heals and resets; a won cup pays its prize, gold and Bell Tokens once and
// Tokens again on a rematch; the prize counter trades Tokens; the world stop and the
// Aurenne crier appear when the colosseum opens and the stop is gone after the Sundering.
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { TROOPS } from '../src/data/troops.js';
import { ITEMS } from '../src/data/items.js';
import { EQUIPMENT } from '../src/data/equipment.js';
import { WORLD_NODES, openNodes } from '../src/data/worldmap.js';
import { getMap } from '../src/data/maps/index.js';
import { CUPS, PRIZES, openCups } from '../src/story/colosseum.js';
import { kitCharacter } from './party_kit.js';
import { bestGear, tierFor } from './balance.test.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;

  // 1. Data.
  for (const cup of CUPS) for (const t of cup.rounds) if (!TROOPS[t]) throw new Error(`${cup.name}: unknown troop ${t}`);
  for (const id of [...CUPS.map((c) => c.prize), ...PRIZES.map(([id]) => id)]) if (!ITEMS[id] && !EQUIPMENT[id]) throw new Error(`unknown prize ${id}`);
  const map = getMap('bc_bellring');
  h.expect(map && map.props.some((r) => r.includes('$')) && map.npcs.some((n) => n.id === 'ottavio'), 'the Bellring has a Hearthstone and a ringmaster');
  h.expect(WORLD_NODES.some((n) => n.id === 'bellring' && n.mapId === 'bc_bellring' && n.act === 1), 'the Bellring is an Act I world stop');

  // 2. Cups open with the story, in order.
  h.expect(openCups(st).length === 0, 'no cups before Pip joins');
  st.flags.c3_pip_joined = true;
  h.expect(openCups(st).map((c) => c.id).join() === 'copper', 'Copper opens when Pip joins');
  st.flags.c4a_corvin_joined = true;
  h.expect(openCups(st).length === 1, 'Silver waits for the Copper Cup');
  st.flags.bc_copper = true;
  h.expect(openCups(st).map((c) => c.id).join() === 'copper,silver', 'Silver opens after Copper, with Corvin');
  delete st.flags.bc_copper;
  delete st.flags.c4a_corvin_joined;
  h.expect(openNodes(st).some((n) => n.id === 'bellring'), 'the world map shows the Bellring');
  h.expect(getMap('aurenne').npcs.find((n) => n.id === 'bc_crier').cond(st), 'the crier stands at Aurenne\'s gate');

  // 3. A party far too weak loses round one: healed, cup not won.
  const roster = ['wren', 'ilse', 'bram', 'sable', 'pip'];
  for (const id of roster) st.joinParty(id).setLevel(3);
  await game.start(new FieldScene(game), { mapId: 'bc_bellring', x: 15, y: 24, dir: 'up', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.idle();
  await h.talk('ottavio');
  h.expect(st.flags.bc_met && st.vars.quests?.bc_cups, 'Ottavio introduces the cups and the quest');
  h.expect(!st.flags.bc_copper && st.activeMembers().every((c) => c.hp === c.stats().hp), 'a lost cup heals the party and stays unwon');

  // 4. A fair party wins the Copper Cup: prize, gold, Tokens.
  for (const id of roster) {
    const ch = st.characters[id];
    ch.setLevel(16);
    kitCharacter(ch, 16);
    bestGear(ch, tierFor(16));
    ch.fullHeal();
  }
  const gold = st.gold;
  await h.talk('ottavio');
  h.expect(st.flags.bc_copper, 'the Copper Cup is won');
  h.expect(st.inventory.count('vigor_bangle') === 1 && st.gold >= gold + 800 && st.vars.bc_tokens === 10, 'prize, purse and 10 Bell Tokens');

  // 5. A rematch pays Tokens only.
  for (const id of roster) st.characters[id].fullHeal();
  await h.talk('ottavio');
  h.expect(st.vars.bc_tokens === 13 && st.inventory.count('vigor_bangle') === 1, 'a rematch pays 3 Tokens and no second prize');

  // 6. The prize counter trades Tokens (auto-confirm keeps picking the first prize).
  const tonics = st.inventory.count('hi_tonic');
  await h.talk('bc_clerk');
  h.expect(st.vars.bc_tokens === 1 && st.inventory.count('hi_tonic') === tonics + 18, '12 Tokens bought six packs of Hi-Tonics');

  // 7. After the Sundering the Bellring is gone with the rest of Act I.
  st.flags.sundered = true;
  h.expect(!openNodes(st).some((n) => n.id === 'bellring'), 'no Bellring after the Sundering');
}
