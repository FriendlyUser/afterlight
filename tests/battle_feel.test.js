// Battle feel: the turn-order preview while choosing a command, impact feedback
// (weakness chime, resist thud, critical crack, hit-stop, camera punch, Break), and
// the defeat screen (muffled music; try again / load last save / title).
// Run: SIM=240 tools/test.sh battle_feel 180000
import { FieldScene } from '../src/world/FieldScene.js';
import { SaveStore } from '../src/state/GameState.js';
import { SKILLS } from '../src/data/skills.js';
import { turnShifts } from '../src/battle/Actions.js';

export async function run(game, h) {
  game.autoBattle = false;
  game.autoConfirm = false;
  const st = game.state;
  for (const id of ['wren', 'ilse', 'bram']) st.joinParty(id).setLevel(12);
  await game.start(new FieldScene(game), { mapId: 'port_gale', x: 10, y: 19, dir: 'up', skipEnterScript: true });
  await h.wait(0.5);
  const field = game.scene;
  const real = (ms) => new Promise((res) => setTimeout(res, ms));
  const press = async (action) => { game.input.edges.add(action); await real(70); };
  const until = async (cond, ms = 8000) => { for (let t = 0; t < ms && !cond(); t += 50) await real(50); return cond(); };
  const chips = () => [...document.querySelectorAll('.b-timeline .tl-item')];
  const nextAt = () => chips().findIndex((c) => c.classList.contains('next'));

  st.gold = 777;
  SaveStore.write(0, st); // "the last save"
  st.gold = 1;

  let result = null;
  field.startBattle('tc_bats', { random: true }).then((r) => { result = r; });
  h.expect(await until(() => document.querySelector('.b-cmd')), 'the command menu opens on the party\'s first turn');
  const scene = game.scene, sys = scene.sys;
  const actor = sys.party.find((p) => p.av === 0) || sys.party[0];
  const foe = sys.enemies[0];

  // ---------------------------------------------------------------- turn-order preview
  h.expect(chips()[0].classList.contains('now') && chips().length >= 6, `the timeline leads with who is acting (${chips().length} chips)`);
  const attackAt = nextAt();
  h.expect(attackAt > 0, `choosing Attack marks the actor's next turn (slot ${attackAt})`);
  const guardRow = [...document.querySelectorAll('.b-cmd .cmd-item')].findIndex((e) => e.textContent.startsWith('Guard'));
  for (let i = 0; i < guardRow; i++) await press('down');
  const guardAt = nextAt();
  h.expect(guardAt > 0 && guardAt <= attackAt && sys.forecast(15, actor, 0.6).indexOf(actor) <= sys.forecast(15, actor, 1).indexOf(actor),
    `Guard brings the next turn forward (slot ${attackAt} → ${guardAt})`);
  for (let i = 0; i < guardRow; i++) await press('up');
  h.expect(sys.forecast(15, actor, 0.5).indexOf(actor) < sys.forecast(15, actor, 2).indexOf(actor), 'quick actions come round sooner than heavy ones');
  h.expect(sys.actionDelay(actor, { kind: 'skill', id: 'guard' }) === 0.6 && sys.actionDelay(actor, { kind: 'item', id: 'tonic' }) === 0.85 && sys.actionDelay(actor, { kind: 'swap' }) === 0.5,
    'Guard, items and swaps cost less than a full turn');
  const pushed = turnShifts(sys, actor, SKILLS.stasis, [foe]);
  const before = sys.forecast(15, actor, 1).indexOf(foe), after = sys.forecast(15, actor, 1, pushed).indexOf(foe);
  h.expect(pushed.get(foe) > 0 && after > before, `Stasis previews its target pushed back (slot ${before} → ${after})`);
  const ally = sys.party.find((p) => p !== actor);
  h.expect(sys.forecast(15, actor, 1, turnShifts(sys, actor, SKILLS.quicken, [ally]))[0] === ally, 'Quicken previews the ally acting next');
  h.expect(turnShifts(sys, actor, SKILLS.attack, [foe]) === null, 'ordinary Arts leave the order alone');
  // Aim Attack: the preview stays up while a target is picked.
  await press('confirm');
  h.expect(await until(() => document.querySelector('.b-target')) && nextAt() > 0, 'the preview stays while aiming');
  await press('cancel');

  // ---------------------------------------------------------------- impact feedback
  game.audio.init();
  const heard = [];
  const sfx = game.audio.sfx;
  game.audio.sfx = (id) => { heard.push(id); return sfx.call(game.audio, id); };
  const hit = (extra) => { heard.length = 0; game.freeze = 0; scene.punch = 0; scene.showDamage({ target: foe, amount: 12, ...extra }); };
  hit({ weak: true });
  h.expect(heard.includes('weak') && game.freeze > 0 && scene.punch > 0, 'a weakness rings, holds the frame and punches the camera in');
  hit({ resisted: true });
  h.expect(heard.includes('resist') && !heard.includes('weak') && !(game.freeze > 0), 'a resisted hit thuds, with no hit-stop');
  hit({ crit: true });
  h.expect(heard.includes('crit') && game.freeze > 0, 'a critical cracks and holds the frame');
  hit({});
  h.expect(!heard.some((id) => ['weak', 'resist', 'crit'].includes(id)) && !(game.freeze > 0), 'an ordinary hit has no extra cue');
  hit({ weak: true, dot: true });
  h.expect(!heard.includes('weak') && !(game.freeze > 0), 'damage over time stays quiet');
  game.freeze = 0;
  const t0 = game.time;
  game.hitStop(0.3);
  await real(150);
  const held = game.time - t0;
  await real(500);
  h.expect(held < 0.02 && game.time - t0 > 0.1, `hit-stop holds game time, then lets go (${held.toFixed(3)}s → ${(game.time - t0).toFixed(2)}s)`);
  heard.length = 0;
  scene.showBreak(foe);
  h.expect(heard.includes('break') && scene.punch >= 1.4, 'Break shatters, with the biggest punch');
  await real(700);
  game.audio.sfx = sfx;

  // ---------------------------------------------------------------- defeat
  for (const p of sys.party) p.hp = 0;
  scene.finish('lose');
  await real(300);
  h.expect(game.audio.muffled && document.querySelector('.gameover'), 'the music muffles as the party falls');
  h.expect(await until(() => document.querySelectorAll('.choice-item').length === 3), 'the defeat screen offers three ways on');
  const options = [...document.querySelectorAll('.choice-item')].map((e) => e.textContent);
  h.expect(options[0] === 'Try again' && options[1].startsWith('Load last save') && options[1].includes('Port Gale') && options[2] === 'Return to title', `try again / load / title (${options.join(' | ')})`);
  h.expect(!game.audio.muffled, 'the filter opens again for the game-over theme');

  await press('confirm'); // Try again
  h.expect(await until(() => document.querySelector('.b-cmd') && game.scene.sys.party.every((p) => p.hp > 0)), 'Try again restarts the fight with the party as it was');
  h.expect(game.scene === scene && !document.querySelector('.gameover') && !(game.freeze > 0), 'same battle scene, nothing left over from the defeat');

  for (const p of game.scene.sys.party) p.hp = 0;
  scene.finish('lose');
  h.expect(await until(() => document.querySelectorAll('.choice-item').length === 3), 'defeated again');
  await press('down');
  await press('confirm'); // Load last save
  h.expect(await until(() => game.scene !== scene && game.scene.mapId === 'port_gale' && !game._transitioning && game.state.gold === 777, 12000),
    `Load last save puts the party back at the save (${game.scene.mapId}, ${game.state.gold} gold)`);
  await until(() => result !== null, 4000);
  h.expect(result === 'lose' && !game.sceneStack.length && !document.querySelector('.b-timeline') && !game.audio.muffled,
    `the battle is gone and the music is clear (result ${result}, stack ${game.sceneStack.length}, hud ${!!document.querySelector('.b-timeline')}, muffled ${game.audio.muffled})`);
  h.expect(game.state.party.length === 3 && game.state.allMembers().every((c) => c.hp > 0), 'the party is as it was saved');
}
