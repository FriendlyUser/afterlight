// The dialogue line language and the dialogue box: conditions, conditional lines,
// branches with a fallback, choices, talk-mode speakers, text tokens, timing tags,
// speaker blips, voice ids (in step with tools/voice.py), the voice-line hook,
// auto-advance and the backlog.
// Run: SIM=240 tools/test.sh lines 120000
import { FieldScene } from '../src/world/FieldScene.js';
import { testCond, splitSpeaker, voiceId, spokenText } from '../src/script/Lines.js';
import { blipFor } from '../src/data/voices.js';

export async function run(game, h) {
  const st = game.state;
  st.joinParty('wren');
  st.joinParty('ilse');
  await game.start(new FieldScene(game), { mapId: 'port_gale', x: 10, y: 19, dir: 'up', skipEnterScript: true });
  await h.wait(0.5);
  const field = game.scene;
  const ui = game.ui;
  const said = () => ui.history.map((l) => `${l.speaker || '-'}: ${l.text}`);
  /** Run a script with dialogue auto-confirmed; returns what was said during it. */
  const play = async (fn) => {
    ui.history.length = 0;
    let result;
    await field.runScript(async (s) => { result = await fn(s); });
    return { lines: said(), result };
  };

  // ---------------------------------------------------------------- conditions
  st.flags.met = true;
  st.flags.count = 2;
  st.flags['chest:port_gale:c1'] = true;
  st.vars.c2_scare = 3;
  st.vars.quests = { c2_cat: { id: 'c2_cat', status: 'done' }, c2_net: { id: 'c2_net', status: 'active' } };
  st.gold = 120;
  st.chapter = 2;
  st.inventory.add('tonic', 2);
  const yes = ['met', '!unmet', 'count=2', 'count>=2', 'party:ilse', '!party:bram', 'item:tonic', 'item:tonic>=2', '!item:ether',
    'quest:c2_cat', 'quest:c2_cat=done', 'quest:c2_net=active', '!quest:nope', 'var:c2_scare>=3', 'gold>=100', 'chapter>=2', 'level>=1',
    'met & party:ilse', 'unmet | met', 'unmet & met | party:ilse', 'flag:chest:port_gale:c1'];
  const no = ['unmet', '!met', 'count>2', 'party:bram', 'item:tonic>=3', 'quest:c2_cat=active', 'var:c2_scare<3', 'gold>=121', 'met & party:bram', 'unmet | party:bram'];
  h.expect(yes.every((c) => testCond(c, st)), `conditions that hold (${yes.filter((c) => !testCond(c, st)).join(', ') || 'all'})`);
  h.expect(no.every((c) => !testCond(c, st)), `conditions that don't (${no.filter((c) => testCond(c, st)).join(', ') || 'none'})`);
  h.expect(testCond({ all: ['met', { not: 'party:bram' }] }, st) && testCond({ any: ['unmet', (s) => s.gold === 120] }, st) && testCond(['met', 'party:ilse'], st) && testCond(undefined, st),
    'object, array, function and missing conditions');
  let threw = 0;
  for (const bad of ['blocker:map:id', 'met &', 'a b']) { try { testCond(bad, st); } catch { threw++; } }
  h.expect(threw === 3, 'malformed conditions throw instead of passing silently');

  // ---------------------------------------------------------------- conditional lines
  let r = await play((s) => s.say('Garrick', [
    'You came.',
    { if: 'party:ilse', text: 'And you brought the healer.' },
    { if: 'party:bram', text: 'And you brought him.' },
    { unless: 'party:bram', by: 'Ilse', text: 'He stayed behind.' },
    st.flags.unmet && 'Never said.',
    { if: 'met', lines: ['One.', { by: 'Wren', text: 'Two.' }, 'Three.'] },
  ]));
  h.expect(r.lines.join(' / ') === 'Garrick: You came. / Garrick: And you brought the healer. / Ilse: He stayed behind. / Garrick: One. / Wren: Two. / Garrick: Three.',
    `lines appear by condition, with other speakers cutting in (${r.lines.length} lines)`);

  const branch = (s) => s.say('Dunstan', { pick: [
    { if: 'var:c2_scare>=5', text: 'All five down!' },
    { if: 'var:c2_scare>=3', lines: ['Three down.', 'Two to go.'] },
    { text: 'They are still out there.' },
  ] });
  r = await play(branch);
  h.expect(r.lines.join(' / ') === 'Dunstan: Three down. / Dunstan: Two to go.', 'pick plays the first branch that holds');
  st.vars.c2_scare = 0;
  r = await play(branch);
  h.expect(r.lines.join(' / ') === 'Dunstan: They are still out there.', 'pick falls back to the branch with no condition');

  // ---------------------------------------------------------------- talk mode, choices, effects
  game.autoConfirm = true; // the harness confirms the first open option
  r = await play((s) => s.talk([
    'The kettle starts to sing.',
    'Ysolde: Wren? You\'ve gone pale.',
    'Wren (thought): Stay. Here. Forever.',
    { if: 'party:ilse', text: 'Ilse: She does that.' },
    { by: 'Nana Brisa', text: 'Remember: tea first.' },
    { ask: 'Stay?', id: 'stay', options: [
      { text: 'Stay.', if: 'unmet' },
      { text: 'Wake up.', set: 'woke', lines: ['Wren: ...No.'] },
      { text: 'Say nothing.' },
    ] },
    { if: 'woke', narrate: 'The light goes white.' },
    { set: { tally: 3 }, run: (s) => { s.vars.ran = true; } },
  ]));
  h.expect(r.lines.join(' / ') === '-: The kettle starts to sing. / Ysolde: Wren? You\'ve gone pale. / Wren: Stay. Here. Forever. / Ilse: She does that. / Nana Brisa: Remember: tea first. / Wren: ...No. / -: The light goes white.',
    `talk names speakers per line and narrates bare strings (${r.lines.length} lines)`);
  h.expect(ui.history[2].style === 'thought' && ui.history[0].style === 'narration', '(thought) and narration styles');
  h.expect(r.result.stay === 1 && st.flags.woke === true, 'a hidden option is skipped; the picked one sets its flag and reports its index');
  h.expect(st.flags.tally === 3 && st.vars.ran === true, 'set and run nodes take effect');
  h.expect(splitSpeaker('Fisher Tobias: Mornin\'!').by === 'Fisher Tobias' && splitSpeaker('Three things. One: we go.').by === null && splitSpeaker('???: I don\'t have one.').by === '???',
    'speaker prefixes are read strictly');

  r = await play((s) => s.say('Marlow', 'You have {gold} gold, {item:tonic} tonics, {var:c2_scare} scares, {name:ilse}.'));
  h.expect(r.lines[0] === 'Marlow: You have 120 gold, 2 tonics, 0 scares, Ilse.', `text tokens fill in (${r.lines[0]})`);

  // An NPC's talk uses the same language.
  field.spawnActor({ id: 't_npc', name: 'Hanna', look: 'villager_3', x: 11, y: 19, talk: ['Morning.', { if: 'woke', text: 'You look rested.' }, { if: 'unmet', text: 'Never.' }] });
  ui.history.length = 0;
  await field.talkTo(field.actors.get('t_npc'));
  h.expect(said().join(' / ') === 'Hanna: Morning. / Hanna: You look rested.', 'NPC talk takes conditional lines');

  // ---------------------------------------------------------------- voice ids (tools/voice.py check prints the same)
  const ids = [voiceId('Wren', 'There — in the pool! Something silver.'), voiceId('Nana Brisa', 'Oh, you poor duck.'),
    voiceId(null, 'The Lantern _gutters_.{wait=0.6} For one heartbeat the hall goes dark.'), voiceId('???', 'I don\'t have one.')];
  h.expect(ids.join(' ') === 'wren/16a51049c75d nana_brisa/a815349cd05b narrator/7974bd867138 unknown/36a7f05047ad', `voice ids match tools/voice.py (${ids.join(' ')})`);
  h.expect(spokenText('  The *Lantern*  _gutters_.{wait=0.6} {red|Dark}. ') === 'The Lantern gutters. Dark.', 'spoken text drops tags and markup');
  h.expect(voiceId('Wren', 'Hello there.') === voiceId('wren', 'Hello{wait=1} *there*.'), 'markup and timing don\'t change a line\'s id');

  // ---------------------------------------------------------------- the dialogue box
  game.autoConfirm = false;
  st.settings.textSpeed = 1;
  const press = async (action) => { game.input.edges.add(action); await new Promise((res) => setTimeout(res, 60)); };
  const real = (ms) => new Promise((res) => setTimeout(res, ms));
  let shakes = 0;
  const shake = field.shake;
  field.shake = (...a) => { shakes++; return shake.apply(field, a); };
  let done = false;
  ui.dialogue('Wren', 'One.{wait=0.5} Two{shake=0.2}{speed=3} and three.', {}).then(() => { done = true; });
  await real(60);
  const box = ui.top();
  h.expect(box.textEl.textContent === 'One. Two and three.' && box.cues.size === 2, 'timing tags are lifted out of the text');
  await real(350);
  h.expect(box.shown === 4 && !box.done, `{wait} holds the line (${box.shown} characters shown)`);
  await real(1200);
  h.expect(box.done && shakes === 1 && box.rate === 3, '{shake} and {speed} fire as the text reaches them');
  await press('up');
  h.expect(document.querySelector('.backlog .bl-row') && ui.top() !== box, 'Up opens the backlog');
  h.expect(document.querySelectorAll('.backlog .bl-row').length === ui.history.length && document.querySelector('.backlog').textContent.includes('One. Two and three.'), 'the backlog lists the lines so far, tags removed');
  await press('cancel');
  h.expect(!document.querySelector('.backlog') && ui.top() === box, 'Cancel closes it, back to the line');
  await press('confirm');
  h.expect(done, 'Confirm moves on');
  field.shake = shake;

  for (let i = 0; i < 130; i++) ui.history.push({ speaker: 'x', text: 'y' });
  ui.dialogue(null, 'Trim.', { auto: 0.01 });
  await real(200);
  h.expect(ui.history.length === 100 && ui.history[99].text === 'Trim.', `the backlog keeps the last 100 lines (${ui.history.length})`);
  ui.history.length = 0;

  // First press completes the line, second moves on.
  done = false;
  ui.dialogue('Ilse', 'A fairly long line that takes a moment to type out in full.').then(() => { done = true; });
  await real(60);
  await press('confirm');
  h.expect(ui.top().done && !done, 'the first Confirm completes the line');
  await press('confirm');
  h.expect(done, 'the second moves on');

  // Auto-advance.
  st.settings.autoAdvance = true;
  done = false;
  const t0 = performance.now();
  ui.dialogue('Ilse', 'Short.').then(() => { done = true; });
  await real(900);
  h.expect(!done, 'auto-advance gives a short line at least 1.2 s');
  await real(1400);
  h.expect(done, `auto-advance moves on by itself (${((performance.now() - t0) / 1000).toFixed(1)} s)`);
  done = false;
  ui.dialogue(null, 'A tip waits for a key.', { style: 'system' }).then(() => { done = true; });
  await real(2500);
  h.expect(!done, 'tips are not auto-advanced');
  await press('confirm'); await press('confirm');
  st.settings.autoAdvance = false;

  // ---------------------------------------------------------------- speaker blips
  const wren = blipFor('Wren'), bram = blipFor('Bram'), hanna = blipFor('Hanna');
  h.expect(wren.freq !== bram.freq && wren.wave !== bram.wave, 'party members have their own blip voices');
  h.expect(hanna === blipFor('Hanna') && hanna.freq >= 480 && hanna.freq <= 1140, 'anyone else gets a steady voice from their name');
  h.expect(blipFor('Wren', 'thought').vol < wren.vol && blipFor(null).vol < wren.vol && blipFor('Wren', 'system') !== wren, 'thoughts, narration and tips are softer');

  // ---------------------------------------------------------------- recorded voice lines
  const voice = game.voiceLines;
  await voice.ready;
  h.expect(voice.count === 0 && voice.play('wren/16a51049c75d') === null, 'no voice pack: nothing plays, dialogue just blips');
  game.audio.init();
  if (game.audio.ctx) {
    const id = voiceId('Wren', 'A recorded line.');
    voice.lines = { [id]: 'wren/test.ogg' };
    voice.cache.set(id, Promise.resolve(game.audio.ctx.createBuffer(1, 4410, 44100)));
    let blips = 0;
    const blip = game.audio.blip;
    game.audio.blip = () => { blips++; };
    done = false;
    field.runScript((s) => s.say('Wren', 'A recorded line.')).then(() => { done = true; });
    await real(250);
    const voiced = ui.top();
    h.expect(voiced.voice?.id === id && game.audio.ducked, 'a line with a recording plays it and ducks the music');
    h.expect(blips === 0, 'a voiced line doesn\'t blip');
    await press('confirm'); await press('confirm');
    await real(100);
    h.expect(done && voiced.voice.done && !game.audio.ducked && voice.current === null, 'moving on cuts the recording off and restores the music');
    done = false;
    field.runScript((s) => s.say('Wren', { text: 'Pinned to an id.', voice: id })).then(() => { done = true; });
    await real(150);
    h.expect(ui.top().voice?.id === id, 'an explicit voice id overrides the derived one');
    await press('confirm'); await press('confirm');
    game.audio.blip = blip;
    voice.lines = {};
  } else {
    h.log('no AudioContext: voice playback not exercised');
  }
  h.expect(game.audio.musicFilter ? game.audio.musicFilter.frequency.value > 10000 : true, 'the music filter stands open');
}
