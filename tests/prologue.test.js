// Smoke test: play the Prologue and Chapter 1 up to the sea crossing.
export async function run(game, h) {
  await h.newGame();
  h.expect(h.flags().p_woke, 'opening played');
  await h.goto('lanternfall', 16, 12);
  await h.goto('lf_nana_house', 4, 6, 'up');
  await h.talk('nana');
  h.expect(h.flags().p_brooch_quest, 'Ilse joined, brooch quest started');
  await h.goto('lanternfall', 24, 12);
  await h.talk('tobias');
  h.expect(h.flags().p_net_done, 'net delivered');
  await h.goto('lf_tidecaves', 1, 16, 'right');
  await h.stepOn(36, 24);
  h.expect(h.flags().p_brooch_got, 'brooch found');
  await h.goto('lanternfall', 43, 16, 'left');
  h.expect(h.flags().p_cassian_arrived, 'Cassian arrived');
  await h.goto('lf_nana_house', 4, 6, 'up');
  await h.talk('nana');
  h.expect(h.flags().p_brooch_done, 'brooch returned');
  await h.goto('lf_wren_house', 4, 7, 'up');
  h.expect(h.flags().p_dinner, 'supper scene');
  await h.goto('lanternfall', 16, 12);
  await h.stepOn(38, 24);
  h.expect(h.flags().p_storm_done, 'storm battle won');
  await h.idle();
  h.expect(h.flags().ch1_named, 'Sable named');
  await h.goto('lanternfall', 8, 6);
  await h.goto('lf_lantern', 7, 11, 'up');
  h.expect(h.flags().kindled, 'kindling');
  await h.idle();
  h.expect(game.scene.mapId === 'lf_wren_house', 'sent home after the Kindling');
  await h.goto('lf_lantern', 7, 11, 'up');
  h.expect(!h.flags().ch1_overheard, 'the Lantern stays empty until Wren has rested');
  await h.goto('lf_wren_house', 1, 3, 'up');
  game.scene.player.face('up');
  game.scene.interact(); // the bed
  await h.idle();
  h.expect(h.flags().ch1_rested && h.flags().ch1_voices && game.state.vars.objective.startsWith('Voices from the Lantern'), 'rested; voices from the Lantern in the night');
  await h.goto('lf_lantern', 7, 11, 'up');
  h.expect(h.flags().ch1_overheard, 'overheard');
  await h.idle();
  h.expect(game.scene.mapId === 'lf_wren_house' && h.flags().ch1_dawn, 'home again, and dawn');
  await h.goto('lanternfall', 16, 12);
  await h.stepOn(23, 27);
  h.expect(h.flags().ch1_departed, 'departed');
  h.log(`party: ${game.state.party.join(',')} lv ${game.state.leader().level}`);
}
