// Smoke test: Chapter 3 side quests (Posy, Hettie & Rowan, Ambrose, Hollis, Tolliver,
// the Chronicle pages, Sir Pounce, the Bell Vault). Run: tools/test.sh ch3_side 900000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { ch3Start, helpers, liveFlags } from './ch3.test.js';

export async function run(game, h) {
  await contentReady;
  const t = helpers(game, h);
  const st = game.state;
  ch3Start(game, 13);
  const F0 = st.flags;
  for (const f of ['c3_arrived', 'c3_thief', 'c3_chase', 'c3_roof_intro', 'c3_roof_t1', 'c3_pip_joined', 'c3_mercy_met', 'c3_summoned', 'c3_met', 'c3_dusk_talk']) F0[f] = true;
  st.joinParty('pip');
  st.characters.pip.setLevel(13);
  st.characters.pip.sealed = true;
  game.start(new FieldScene(game), { mapId: 'aurenne', x: 13, y: 28, dir: 'down' });
  game.fadeIn(0.1);
  await h.idle();
  const F = liveFlags(game);
  const has = (id) => st.inventory.count(id) > 0;
  const done = (q) => st.vars.quests?.[q]?.status === 'done';

  // Bell Market & town
  await h.talk('posy');
  h.expect(F.c3_posy_paid && done('c3_posy'), 'Pip\'s debt paid');
  await h.talk('hettie');
  h.expect(F.c3_rowan_quest, 'Hettie\'s quest started');
  await h.talk('ambrose');
  h.expect(F.c3_ambrose && has('choir_staff'), 'Ambrose tested Ilse');
  await h.talk('hollis');
  h.expect(F.c3_hollis, 'sparred with Hollis');

  await h.goto('c3_tolliver', 4, 7, 'up');
  await h.talk('tolliver');
  h.expect(F.c3_hammer_quest && F.c3_peal_known, 'Tolliver\'s hammer quest');

  await h.goto('c3_archives', 8, 10, 'up');
  await h.talk('quill');
  h.expect(F.c3_pages_quest && game.scene.grid.walkable(13, 6), 'Chronicle quest; rope lifted');
  await t.inspect(3, 8, 3, 9);
  await t.inspect(12, 2, 12, 3);
  h.expect(st.inventory.count('c3_chronicle_page') === 2, 'two archive pages');

  await h.goto('c3_venn', 5, 6, 'up');
  await h.talk('orsolya');
  h.expect(F.c3_cat_quest, 'Sir Pounce quest');
  await h.goto('c3_rooftops', 28, 3, 'right');
  await h.talk('pounce');
  h.expect(F.c3_cat_found && has('c3_sir_pounce'), 'Sable carries Sir Pounce');
  await h.goto('c3_venn', 5, 6, 'up');
  await h.talk('orsolya');
  h.expect(F.c3_cat_done && has('c3_venn_signet') && done('c3_pounce'), 'cat returned; Venn signet');

  // Below the city
  Object.assign(F, { c3_morning: true, c3_mag: true, c3_key: true, c3_uc_open: true, c3_uc_entered: true, c3_sluice: true });
  await h.goto('c3_uc_ossuary', 12, 27, 'up');
  await t.inspect(4, 27, 5, 27);
  for (const [x, note] of [[8, 'high'], [13, 'low'], [8, 'high'], [18, 'mid'], [8, 'high']]) {
    await t.inspect(x, 26, x, 27);
    h.log(`rang ${note}`);
  }
  h.expect(F.c3_vault_open && game.scene.grid.walkable(4, 27), 'Bell Vault opened by the Dawn Peal');
  await t.inspect(24, 4, 24, 5);
  st.inventory.add('c3_bell_hammer');
  await h.goto('c3_uc_lab', 6, 14, 'up');
  await t.inspect(6, 13, 6, 14);
  h.expect(st.inventory.count('c3_chronicle_page') === 4, 'all four pages');
  await t.inspect(11, 4, 11, 5);
  h.expect(F.c3_rowan_found, 'found Rowan in the cells');

  // Payoffs
  await h.goto('c3_tolliver', 4, 7, 'up');
  await h.talk('tolliver');
  h.expect(F.c3_hammer_done && has('c3_earplugs') && done('c3_gloria'), 'Gloria returned; earplugs');
  await h.goto('c3_archives', 8, 10, 'up');
  await h.talk('quill');
  h.expect(F.c3_pages_done && has('scholars_monocle') && done('c3_chronicle'), 'Chronicle restored');
  Object.assign(F, { c3_mercy_down: true, c3_condemned: true });
  await h.goto('aurenne', 13, 28, 'down');
  await h.talk('hettie');
  h.expect(F.c3_rowan_done && has('regen_bangle') && done('c3_rowan'), 'Rowan home; Hettie\'s reward');
}
