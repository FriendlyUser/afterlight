// Smoke test, Chapter 4a part one: the Pilgrim Road, the Halcyon, Saltglass, Pip's Kindling.
// (Continued in ch4a_caverns, ch4a_mountain and ch4a_finale.)

/** Party as Chapter 3 hands it over, plus tier-4 gear so auto-battle can keep up. */
export function setupParty(game, ids, level) {
  const st = game.state;
  for (const id of ids) st.joinParty(id);
  const gear = {
    wren: { weapon: 'silversteel_saber', body: 'silver_mail_shirt' }, ilse: { weapon: 'silver_staff', body: 'silk_robe' },
    bram: { weapon: 'silversteel_saber', offhand: 'silversteel_shield', body: 'silversteel_plate' }, sable: { weapon: 'silver_rod', body: 'silk_robe' },
    pip: { weapon: 'silversteel_kris', body: 'silver_mail_shirt' }, corvin: { weapon: 'silversteel_carbine', body: 'silver_mail_shirt' },
  };
  for (const c of st.allMembers()) {
    c.sealed = c.id === 'pip' && !st.flags.c4a_pip_kindled;
    Object.assign(c.equipment, gear[c.id] || {});
    c.setLevel(level);
    c.fullHeal();
  }
  st.inventory.add('tuning_fork', 1);
  st.inventory.add('hi_tonic', 20);
  st.inventory.add('ember_feather', 10);
  Object.assign(st.flags, { kindled: true, crestArtLearned: true });
  st.chapter = 4;
}

export async function run(game, h) {
  const f = h.flags;
  await h.newGame();
  setupParty(game, ['wren', 'ilse', 'bram', 'sable', 'pip'], 24);
  game.state.gold = 2000;

  await h.goto('sunscar_road', 4, 20, 'right');
  h.expect(f().c4a_arrived, 'road opening');
  await h.goto('c4a_dunes', 1, 21, 'right');
  await h.stepOn(32, 22);
  h.expect(f().c4a_smoke_seen, 'smoke seen');
  await h.goto('c4a_halcyon', 18, 28, 'up');
  h.expect(f().c4a_corvin_joined && game.state.party.includes('corvin'), 'Corvin joined after Sandmaw');
  h.expect(game.state.characters.corvin.level >= 18, 'Corvin levelled');
  await h.goto('c4a_dunes', 41, 1, 'down');
  await h.stepOn(30, 27);
  h.expect(f().c4a_mirage_wren, 'Wren\'s mirage');

  await h.goto('c4a_saltglass', 2, 19, 'right');
  h.expect(f().c4a_saltglass_arrived && game.state.vars.quests?.c4a_lift_glass, 'Saltglass arrival + lift-glass quest');
  await h.goto('c4a_sg_lantern', 7, 11, 'up');
  h.expect(f().c4a_tamsin_met && f().c4a_pip_kindled && !game.state.characters.pip.sealed, 'Tamsin met; Pip Kindled');
  await h.goto('c4a_sg_house', 4, 5, 'up');
  await h.talk('asha');
  h.expect(f().c4a_jorah_taken, 'Jorah quest');
  await h.goto('c4a_sg_inn', 6, 8, 'up');
  await h.talk('ines');
  h.expect(f().c4a_debt_paid && game.state.inventory.count('lucky_coin') === 1, 'Corvin\'s debt paid');

  h.log(`party ${game.state.party.join(',')} lv ${game.state.leader().level}`);
}
