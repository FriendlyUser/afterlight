// CHAPTER 4b — "The Pilgrim Road" (II): the Stormcrown.
// Corvin flies a broken ship into a storm. Vasha has already said yes. Six of seven are his —
// and the last stone is in Lanternfall, with Wren's mother.
import { stage, unstage, moveAll } from './ch4b_common.js';

const CORES = ['c4b_core1', 'c4b_core2', 'c4b_core3'];
const PYLONS = ['c4b_pylon_w', 'c4b_pylon_e', 'c4b_pylon_s'];
const count = (s, flags) => flags.filter((k) => s.flag(k)).length;

/** @type {import('../types/data').StoryScripts} */
export const C4S = {
  // ================================================================ Stormfoot
  async footArrive(s) {
    if (s.flag('c4b_foot_arrived')) return;
    s.setFlag('c4b_foot_arrived');
    const P = stage(s, {
      wren: [6, 28, 'right'], ilse: [5, 27, 'right'], bram: [4, 28, 'right'],
      sable: [5, 29, 'right'], pip: [7, 29, 'up'], corvin: [7, 27, 'up'],
    });
    await s.wait(0.5);
    await s.narrate('The Stormcrown: a mountain with a storm for a crown, and the crown never comes off. The rain comes sideways. The air tastes of copper.');
    await s.pan(23, 8, 1.8);
    await s.narrate([
      'And at the foot of it, on a cradle of timber and chain, sits a ship.',
      'A long dark hull, two masts, sails furled tight against the wind. Even grounded, she looks like she\'s leaning into a gale.',
    ]);
    await s.say('Corvin', 'There she is.');
    await s.follow(1.0);
    await s.say('Pip', 'It\'s a boat. On a hill.');
    await s.say('Corvin', 'She\'s a _ship_. And she isn\'t on a hill. She\'s waiting.');
    await s.say('Ilse', 'She was in pieces in the desert.');
    await s.say('Corvin', 'She was in _several_ pieces. Now she\'s in one large, deeply offended piece. I left word with the caravans at Saltglass before we went up the mountain.');
    s.face('joss', 'down');
    await s.move('joss', [[11, 26], [9, 27]], 3);
    await s.say('Joss', 'ASHE! You owe me forty crowns and a mule!');
    await s.say('Corvin', 'Joss. I owe everybody forty crowns and a mule.');
    await s.say('Joss', 'The mule died, Ashe. Hauling your boat out of the Sunscar.');
    await s.say('Corvin', '...I\'m genuinely sorry about the mule.');
    await s.say('Joss', 'Her name was Patience.');
    await s.say('Corvin', 'Of course it was.');
    await s.wait(0.5);
    await s.say('Corvin', 'Right. Shape of it. The singing glass we set in the desert keeps her floating. And I\'ve a hold full of spare Saltglass panes.');
    await s.say('Corvin', 'But floating isn\'t climbing, and the Stormcrown is all climb. Sunlight won\'t carry her through that. For that, the glass needs _lightning_.');
    await s.say('Joss', 'Storm-seams, up on the crags. Lightning hits the same three rocks every night up here, and the glass in the strike-holes fuses solid. Full to the brim with thunder.');
    await s.say('Joss', 'Storm cores, the prospectors call them. Mind you, the prospectors mostly don\'t come back.');
    await s.say('Corvin', 'Three cores. One for each lift-cell. Then she\'ll fly.');
    await s.say('Pip', 'For how long?');
    await s.say('Corvin', 'Long enough.');
    await s.say('Pip', 'That\'s not a number.');
    await s.say('Corvin', 'It\'s the only number I\'ve got, kid.');
    await s.say('Bram', 'And the crags have... things living on them?');
    await s.say('Joss', 'Things _made_ of lightning, big man.');
    await s.say('Bram', 'Wonderful. Just wonderful.');
    await s.move('joss', [[11, 26], [11, 23]], 3);
    s.face('joss', 'down');
    if (P.corvin !== 'player') {
      await s.move(P.corvin, [[12, 26], [20, 18], [22, 13]], 4);
      s.remove(P.corvin);
      P.corvin = null;
    }
    s.spawn('corvin_f', 'corvin', 22, 12, 'down', { name: 'Corvin', run: (sc) => C4S.corvinFoot(sc) });
    unstage(s, P, [6, 28, 'right']);
    s.objective('Take three Storm Cores from the lightning-struck crags around Stormfoot (west, north-east, south-east), then bring them to Corvin at the Halcyon.');
    s.journal('The Halcyon is waiting at the foot of the Stormcrown. Corvin needs three storm cores to make her fly. He says she\'ll fly "long enough." Pip says that isn\'t a number.');
  },

  async joss(s) {
    if (s.flag('c4b_launched')) return s.say('Joss', 'You came back down? ...No. No, you didn\'t. I\'m talking to myself again.');
    if (count(s, CORES) === 3) return s.say('Joss', ['Three cores! Go on, then. Fly. I\'ll stand here and pray, which I haven\'t done since I was six.']);
    return s.say('Joss', [
      'Three seams: the west crag, the high one north-east, and the shelf to the south-east.',
      'Mind the crag golems. Mostly rock, entirely temper.',
      'And the mule\'s name was Patience. I want that on the record.',
    ]);
  },

  async core(s, n) {
    const key = `c4b_core${n}`;
    if (s.flag(key)) return s.narrate('The seam is spent: a crater of blackened glass, still warm to the touch.');
    await s.narrate('A crater of black glass where lightning has struck a thousand times. At its heart, a fist of saltglass crackles with trapped light.');
    if (n === 1) await s.say('Sable', 'It is loud. Inside. Like a crowd that wants to get out.');
    if (n === 2) await s.say('Pip', 'Can I touch it? I\'m gonna touch it.');
    if (n === 3) await s.say('Bram', 'My hair is standing up. All of it. Even hair I didn\'t know I had.');
    s.shake(0.25, 0.6);
    await s.narrate('The air thickens. The rocks around the seam begin, grumbling, to stand up.');
    const r = await s.battle('c4b_sf_core', { bg: 'road' });
    if (r !== 'win') return;
    s.setFlag(key);
    s.sfx('bolt');
    await s.give('c4b_storm_core');
    const k = count(s, CORES);
    if (k === 3) s.objective('You have three Storm Cores. Bring them to Corvin at the Halcyon.');
    else s.toast(`<span class="hl">Storm Cores</span> — ${k} of 3`);
  },

  async corvinFoot(s) {
    if (count(s, CORES) < 3 && !s.flag('c4b_patched')) {
      return s.say('Corvin', ['Storm cores, sparrow. Three. West crag, north-east crag, the south-east shelf.', 'I\'ll be here, talking to my ship. She\'s a better listener than any of you.']);
    }
    if (!s.flag('c4b_patched')) {
      s.setFlag('c4b_patched');
      await s.take('c4b_storm_core', 3);
      await s.narrate([
        'Corvin fits the storm cores into the Halcyon\'s lift-cells one by one, swearing gently at each of them.',
        'The Saltglass panes along her hull begin to glow — then to _sing_, a low hum that climbs up through the soles of your boots.',
      ]);
      await s.say('Corvin', 'That\'s her. Lift-cells charged, glass singing. She\'ll fly.');
      await s.wait(0.8);
      await s.narrate('His hands are shaking.');
      await s.say('Pip', 'Your hands are shaking.');
      await s.say('Corvin', 'It\'s cold.');
      await s.say('Pip', 'It\'s not _that_ cold.');
      await s.wait(0.8);
      await s.say('Corvin', '...Last time I took her into weather, I came down in a desert. Lost half my crew to the sand, and the other half to good sense, after.');
      await s.say('Corvin', 'And the Stormcrown isn\'t weather. It\'s weather\'s big angry father.');
      await s.say('Bram', 'You don\'t have to fly it, Corvin. We could find another way—');
      await s.say('Corvin', 'Course I don\'t have to. Nobody _has_ to do anything, big man. That\'s the whole trouble with being a grown-up.');
      await s.say('Corvin', 'Kid. You want to know how you can tell I\'m still alive?');
      await s.say('Pip', 'How?');
      await s.say('Corvin', 'I\'m terrified every single time.');
    }
    const go = await s.confirm('Board the Halcyon and fly for Skyreach? (There is no coming back down until she\'s repaired.)', 'Fly', 'Not yet');
    if (!go) return s.say('Corvin', 'Take your time. The storm\'s not going anywhere. That\'s rather the problem.');
    if (!s.flag('c4b_corder_beaten')) {
      const won = await C4S.ambush(s);
      if (!won) return;
    }
    s.setFlag('c4b_launched');
    await s.fadeOut(1.0);
    await s.teleport('c4b_halcyon_deck', 13, 7, 'right');
  },

  async ambush(s) {
    s.remove('corvin_f');
    s.music('tension');
    const P = stage(s, {
      wren: [21, 14, 'down'], ilse: [20, 13, 'down'], bram: [23, 15, 'down'],
      sable: [22, 14, 'down'], pip: [24, 14, 'down'], corvin: [22, 12, 'down'],
    });
    s.spawn('corder', 'c4b_corder', 23, 26, 'up');
    s.spawn('lancer1', 'dawnguard', 22, 27, 'up');
    s.spawn('lancer2', 'dawnguard', 24, 27, 'up');
    await s.say('???', 'BRAM KESTREL! Step away from the girl!');
    await moveAll(s, [['corder', [[23, 18]]], ['lancer1', [[21, 19]]], ['lancer2', [[25, 19]]]], 3.2);
    await s.say('Captain Corder', 'Captain Corder, of the Lord-Commander\'s Sunspears. We were in the same squire class, Kestrel. Remember? You were the big one who froze.');
    await s.say('Bram', '...I remember.');
    await s.say('Captain Corder', 'The Lord-Commander\'s been and gone from Skyreach already. Their Ardent handed him the stone with a smile. You\'re too late. You\'re always too late.');
    await s.say('Captain Corder', 'But he\'ll forgive a great deal if I bring him the girl. Step aside, and I\'ll tell him you were useful. For once.');
    await s.wait(1.0);
    await s.narrate('Bram looks at Sable. His sword-hand is shaking. Then, very slowly, he steps in front of her.');
    await s.move(P.bram, [[23, 16]], 1.2);
    await s.say('Bram', 'I\'m still frozen, Corder. I\'m frozen right here.');
    await s.say('Bram', 'You\'ll have to move me.');
    await s.say('Captain Corder', 'Gladly.');
    const r = await s.battle('c4b_boss_corder', { bg: 'road' });
    if (r !== 'win') return false;
    s.setFlag('c4b_corder_beaten');
    await s.say('Captain Corder', 'This isn\'t over, Kestrel.');
    await s.say('Bram', 'I know. I\'m terrified.');
    await moveAll(s, [['corder', [[23, 26], [23, 33]]], ['lancer1', [[21, 27], [21, 33]]], ['lancer2', [[25, 27], [25, 33]]]], 4);
    ['corder', 'lancer1', 'lancer2'].forEach((id) => s.remove(id));
    await s.say('Corvin', 'Good man. _Now_ everybody on the ship!');
    unstage(s, P);
    return true;
  },

  // ================================================================ the flight
  async flight(s) {
    if (s.flag('c4b_flight_done')) return;
    const P = stage(s, {
      corvin: [7, 7, 'right'], wren: [13, 7, 'right'], ilse: [12, 8, 'up'],
      bram: [16, 8, 'up'], sable: [20, 7, 'right'], pip: [15, 6, 'right'],
    });
    await s.wait(0.6);
    await s.narrate('The Halcyon lifts off her cradle with a groan of timber and a sound from the Saltglass like a choir clearing its throat.');
    s.shake(0.3, 1.2);
    await s.say('Corvin', 'Come on, girl. Come on. _Up._');
    s.flash('#e8f0ff', 0.3);
    s.sfx('bolt');
    await s.hop(P.pip);
    await s.say('Pip', 'WE\'RE FLYING! WE\'RE ACTUALLY—');
    await s.say('Corvin', 'Don\'t say it!');
    await s.say('Pip', '—FLYING!');
    await s.say('Corvin', 'He said it.');
    s.shake(0.4, 0.8);
    s.sfx('bolt');
    await s.say('Bram', 'I am a Warden of the Dawnguard. I do not get airsick. This is my normal color.');
    await s.say('Ilse', 'You said that on the boat.');
    await s.say('Bram', 'It was my normal color then, too.');
    await s.wait(0.6);
    s.face(P.sable, 'up');
    await s.say('Sable', 'There is something in the clouds. Several somethings.');
    await s.narrate('Shapes uncoil out of the thunderheads — long, winged, crackling — and turn toward the ship.');
    await s.say('Corvin', 'Drakes! Everybody who isn\'t steering — _fight!_');
    const r = await s.battle('c4b_flight_drakes', { bg: 'sky' });
    if (r !== 'win') return;
    s.setFlag('c4b_flight_done');
    s.shake(0.5, 1.0);
    await s.narrate('With a crack like a bone breaking, the first lift-cell goes dark. Then the second.');
    await s.say('Corvin', 'That\'s one flight! I _said_ one! I was _very clear!_');
    await s.say('Ilse', 'Corvin — look up!');
    s.flash('#ffffff', 0.8);
    await s.narrate([
      'Above the storm, the clouds tear open — and there, hanging in a sky of impossible blue, is an island.',
      'Green fields. White walls. Windmills turning in a wind from nowhere.',
    ]);
    await s.say('Wren', 'Skyreach.');
    await s.narrate('The last lift-cell sputters.');
    await s.say('Corvin', 'Everybody hold on to something you love!');
    await s.say('Pip', 'BRAM!');
    await s.say('Bram', 'PIP!');
    s.shake(0.8, 1.2);
    s.sfx('quake');
    await s.fadeOut(0.6, '#ffffff');
    unstage(s, P);
    await s.teleport('c4b_skyreach', 13, 31, 'up');
  },

  // ================================================================ Skyreach
  async skyArrive(s) {
    if (s.flag('c4b_sky_arrived')) return;
    s.setFlag('c4b_sky_arrived');
    s.remove('ilka');
    const P = stage(s, {
      wren: [12, 30, 'up'], ilse: [11, 31, 'up'], bram: [13, 32, 'up'],
      sable: [10, 30, 'up'], pip: [14, 31, 'up'], corvin: [10, 32, 'right'],
    });
    s.shake(0.3, 0.6);
    await s.wait(0.8);
    await s.narrate([
      'Dust. Feathers. A great deal of timber that used to be a shed.',
      'The Halcyon lies nose-down in a shipwright\'s yard, steaming gently. Somewhere, a chicken is complaining.',
    ]);
    await s.say('Pip', 'Are we dead? Is this the sky-afterlife?');
    await s.say('Ilse', 'Everyone count your arms. Two each. Good.');
    s.spawn('ilka_a', 'c4b_ilka', 19, 26, 'left');
    await s.move('ilka_a', [[15, 29]], 4);
    s.face('ilka_a', P.corvin);
    await s.say('Ilka', 'CORVIN. _ASHE._');
    await s.say('Corvin', 'Ilka! You look wonderful. Have you done something with your—');
    await s.say('Ilka', 'You put your ship through my roof.');
    await s.say('Corvin', 'Through your _shed_.');
    await s.say('Ilka', 'My shed is where I _keep_ my roof!');
    await s.say('Ilka', 'Eleven years. Eleven years, Ashe, and you owe me nine hundred crowns, and you come back through the _sky_.');
    await s.say('Corvin', 'Where else would I come back through? It\'s a floating island.');
    await s.wait(0.8);
    await s.say('Ilka', '...Is anyone hurt? Are _you_ hurt?');
    await s.say('Corvin', 'Only my pride.');
    await s.say('Ilka', 'Your pride was always the most breakable thing on that ship.');
    await s.say('Ilka', 'And you\'re flying _children_ about now? Have you finally lost your mind?');
    await s.say('Corvin', 'They\'re not children. They\'re—');
    await s.wait(0.6);
    await s.say('Corvin', '...Yes. They\'re children.');
    await s.say('Pip', 'I\'m eleven and a half.');
    await s.say('Ilka', 'Of course you are.');
    s.spawn('tern', 'c4b_skyfolk2', 22, 24, 'left');
    await s.move('tern', [[17, 28]], 5);
    await s.say('Skyfolk Runner', 'Shipwright Ilka! The Ardent saw the crash from the Lantern. She wants the ones who came up through the storm brought to her. _Now._');
    s.face('tern', P.sable);
    await s.say('Skyfolk Runner', '...Especially her.');
    await s.say('Ilka', 'Well, go on. Vasha doesn\'t like to be kept waiting, and I need time to work out what to charge you.');
    await s.move('tern', [[22, 24], [25, 12]], 5);
    s.remove('tern');
    s.remove('ilka_a');
    s.spawn('ilka', 'c4b_ilka', 15, 30, 'left', { name: 'Ilka', run: (sc) => C4S.ilka(sc) });
    unstage(s, P, [12, 30, 'up']);
    s.objective('Go to Ardent Vasha at the Lantern, on the northern terrace of Skyreach.');
    s.journal('We made it to Skyreach. Mostly. The Halcyon is in a shed, and the shed is no longer a shed. The Ardent wants to see Sable.');
  },

  async ilka(s) {
    if (s.flag('c4b_six_of_seven')) {
      return s.say('Ilka', [
        'She\'s refit. Skyreach-cut crystals, new rigging, and the whole bill on an account in his name I\'ll be collecting on until one of us dies.',
        'Look after him. He\'s not as brave as he pretends to be.',
        '...He\'s braver. Don\'t tell him I said so.',
      ]);
    }
    if (s.flag('c4b_vasha_met')) {
      return s.say('Ilka', [
        'Ashe and I flew cargo together, eleven years back. Then one morning he flew off with my best lift-crystal and a note that said "back by supper."',
        'He\'s very late for supper.',
        'Go on — do whatever the Ardent asked. I\'ll start on the hull. Somebody has to.',
      ]);
    }
    return s.say('Ilka', 'Go and see the Ardent. I\'m busy deciding which of his limbs to take as a deposit.');
  },

  async tamm(s) {
    if (s.flag('c4b_thunderhead_beaten')) return s.say('Keel-warden Tamm', ['A full fathom! A fathom and a half! I could kiss you.', 'I won\'t. Keel-crew don\'t kiss. But I _could_.']);
    if (s.flag('c4b_vasha_met')) return s.say('Keel-warden Tamm', ['The Ardent sent word. The lift\'s yours — east edge, just past me.', 'Hold on tight going down. The wind under the isle is mean, and it holds a grudge.']);
    return s.say('Keel-warden Tamm', ['The Keel Lift goes down to the Undercradle. Keel-crew only. Ardent\'s orders.', 'The isle\'s been dropping. A hand\'s width a day. We don\'t talk about it.']);
  },

  async kesi(s) {
    if (s.flag('c4b_kesi_done')) return s.say('Kesi', ['I\'m still hanging chimes. But I\'m hanging them for everybody who flies now. Not just Papa.', 'Listen! That\'s the new one. It sounds like a bird with hiccups.']);
    if (s.has('c4b_aram_log')) {
      s.setFlag('c4b_kesi_done');
      await s.say('Wren', 'Kesi. We found something. Under the isle.');
      await s.take('c4b_aram_log');
      await s.narrate('Kesi holds the logbook in both hands and does not open it for a long time.');
      await s.say('Kesi', 'Will you read the last page? I can\'t. My eyes have gone blurry.');
      await s.say('Wren', '"Kesi — the storm is louder than my heart today, but not by much. I can hear your chimes. I\'m following them home.');
      await s.say('Wren', 'If I\'m late, start supper without me. Don\'t wait up. Don\'t stop—"');
      await s.wait(1.0);
      await s.say('Wren', '...That\'s where it stops.');
      await s.say('Kesi', '"Don\'t stop."');
      await s.say('Kesi', 'He was so close. He could hear them.');
      await s.say('Kesi', 'He wanted me to keep hanging chimes. Didn\'t he?');
      await s.wait(0.8);
      await s.say('Wren', 'Maybe. Or maybe he meant — don\'t stop everything else. Don\'t stop living, just because he\'s late.');
      await s.say('Kesi', '...Maybe both.');
      await s.say('Wren', 'Yeah. Maybe both.');
      await s.say('Kesi', 'These were his spare goggles. He\'d want them to fly. Not sit in a drawer.');
      await s.give('c4b_pilot_goggles');
      s.quest('c4b_q_kesi', null, null, 'done');
      return;
    }
    if (s.flag('c4b_kesi_asked')) return s.say('Kesi', 'Papa\'s glider was called _Kesi\'s Wind_. It had yellow wings. If you see yellow wings anywhere — anywhere at all...');
    s.setFlag('c4b_kesi_asked');
    await s.say('Kesi', 'I\'m hanging chimes. Hundreds and hundreds. So when Papa flies home through the storm, he can hear which way Skyreach is.');
    await s.say('Kesi', 'He went out a year ago, in his glider. Everyone says he\'s gone. Everyone says I should stop.');
    await s.say('Wren', '...How long have you been hanging them?');
    await s.say('Kesi', 'A year.');
    await s.wait(0.8);
    await s.say('Wren', 'My dad\'s boat went down when I was nine. I used to leave a lamp in the window.');
    await s.say('Kesi', 'Did he come home?');
    await s.wait(1.0);
    await s.say('Wren', '...No.');
    await s.say('Kesi', 'Oh.');
    await s.say('Kesi', 'I\'m going to keep hanging them anyway.');
    await s.say('Wren', 'Yeah. I know.');
    s.quest('c4b_q_kesi', 'Chimes in the Wind', 'Kesi\'s father Aram flew his yellow-winged glider into the storm a year ago and never came home. If there is any sign of him below the isle, find it.');
  },

  async kites(s) {
    if (s.flag('c4b_kite')) return s.say('Kite-flier', 'Come back and fly the red one again whenever! My brother still doesn\'t know.');
    s.setFlag('c4b_kite');
    await s.say('Kite-flier', 'Wanna fly one? You can borrow the red one. It\'s the best one. It\'s my brother\'s. Don\'t tell him.');
    await s.say('Pip', 'Dunno. Kites are for kids.');
    await s.say('Kite-flier', 'You ARE a kid.');
    await s.wait(0.6);
    await s.say('Pip', '...Give it here.');
    await s.narrate('Pip flies a red kite off the edge of the world. For ten whole minutes, he forgets to look cool.');
    await s.say('Pip', 'If I ever get a town of my own — it\'s gonna have kites. Loads of \'em. Everywhere.');
    await s.say('Ilse', 'Is that a plan?');
    await s.say('Pip', 'It\'s a _policy_.');
    s.journal('Pip flew a kite on Skyreach. He laughed the whole time and then pretended he hadn\'t. He says if he ever has a town, it\'ll be full of kites.');
  },

  // ================================================================ Vasha
  async hallEnter(s) {
    if (!s.flag('c4b_vasha_met')) return C4S.vashaMeet(s);
    if (s.flag('c4b_thunderhead_beaten') && !s.flag('c4b_six_of_seven')) return C4S.aftermath(s);
    return null;
  },

  async vashaMeet(s) {
    s.setFlag('c4b_vasha_met');
    s.music('tension');
    const P = stage(s, {
      wren: [7, 7, 'up'], ilse: [6, 8, 'up'], bram: [8, 8, 'up'],
      sable: [7, 8, 'up'], pip: [5, 8, 'up'], corvin: [9, 8, 'up'],
    });
    s.spawn('vasha_s', 'vasha', 7, 4, 'down', { name: 'Ardent Vasha', run: (sc) => C4S.vasha(sc) });
    await s.wait(0.6);
    await s.narrate('The Lantern hall is cold and bright and humming. In the brass cradle where the Dawnstone should be, a single silver fork stands upright, singing to itself.');
    await s.say('Ardent Vasha', 'So. The children of Lanternfall.');
    await s.say('Ardent Vasha', 'And the girl.');
    await s.say('Ardent Vasha', 'He said you would come.');
    await s.say('Wren', 'Who did?');
    await s.say('Ardent Vasha', 'His Grace. He wrote to me. "If they come, Vasha, be kind to them. They are frightened, and they do not yet understand."');
    await s.say('Ardent Vasha', 'Especially you, little sister.');
    await s.say('Sable', 'I am not your sister.');
    await s.say('Ardent Vasha', 'No. You\'re _his_.');
    await s.wait(1.0);
    await s.say('Wren', 'Your Dawnstone. Where is it?');
    await s.say('Ardent Vasha', 'Where it belongs. With the Hierophant.');
    await s.say('Ardent Vasha', 'I put it into the Lord-Commander\'s hands myself, three weeks ago, on the steps of this Lantern. Gladly.');
    await s.say('Ilse', '_Gladly?_');
    await s.say('Ardent Vasha', 'Do you know what the Stormcrown takes from us, Mender? Every year? Ships. Sons. Daughters.');
    await s.say('Ardent Vasha', 'My husband went down into it eleven years ago in a skiff called the _Lark_, and it did not even give me back the wood.');
    await s.say('Ardent Vasha', 'His Grace is building a world where nothing is ever lost again. Where the good days — the very best days — never end.');
    await s.say('Ardent Vasha', 'I said yes before he had finished the sentence.');
    await s.say('Corvin', 'Vasha. He\'s taking the stones from Keepers who say no. Osk nearly died. Elowen got picked up and set down on a log.');
    await s.say('Ardent Vasha', 'Then they should have said yes.');
    await s.say('Bram', 'Halvard said no. Halvard is _dead_.');
    await s.wait(0.8);
    await s.say('Ardent Vasha', '...I grieve for Halvard. Truly. He was a good man and a stubborn one.');
    await s.say('Ardent Vasha', 'When the song is sung, perhaps we will have him back as well.');
    await s.move(P.sable, [[7, 6]], 1.2);
    await s.say('Sable', 'Your fork is singing.');
    await s.say('Ardent Vasha', 'It is harmonizing. Waiting for the others.');
    await s.say('Sable', 'It is singing backwards. All of them are. They are waiting for sunset.');
    await s.wait(0.8);
    await s.say('Ardent Vasha', '...Yes. That\'s right. At sunset, all seven together. His Grace calls it the _Vespersong_.');
    await s.say('Wren', 'All seven? You don\'t _have_ seven. Lanternfall—');
    s.music('cassian');
    await s.say('Ardent Vasha', 'Six of seven are his.');
    await s.say('Ardent Vasha', 'Saltglass. Frosthollow — the Lord-Commander\'s men went back for it, after the snow. Mirefen. Thornwood. Skyreach. And the Grand Lantern itself.');
    await s.say('Bram', 'They went _back_? After Halvard — they went back up the mountain for it?');
    await s.say('Ardent Vasha', 'His Grace does not leave things unfinished.');
    await s.say('Ardent Vasha', 'Only Lanternfall remains.');
    await s.say('Wren', '...My mother won\'t give it to him. She\'s already told him no.');
    await s.say('Ardent Vasha', 'He knows. He told me not to worry about Lanternfall.');
    await s.say('Ardent Vasha', 'He said the last stone would come to him freely. He said the Keeper\'s daughter would bring it.');
    await s.wait(2.0);
    await s.say('Wren', '...I would _never_.', { speed: 0.7 });
    await s.say('Ardent Vasha', 'He seemed very sure.');
    await s.wait(0.8);
    s.face(P.ilse, P.wren);
    await s.wait(0.8);
    // The island lurches.
    s.shake(0.6, 1.4);
    s.sfx('quake');
    await s.narrate('The whole hall lurches, like a ship striking a reef. Somewhere below, thunder answers — from _underneath_.');
    await s.say('Ardent Vasha', '...It\'s nothing. The isle settles. It does that.');
    s.spawn('tern', 'c4b_skyfolk2', 7, 11, 'up');
    await s.move('tern', [[7, 9]], 5);
    await s.say('Skyfolk Runner', 'Ardent! The Keel\'s dropped another fathom! The old lift-pylons in the Undercradle are failing — and the Thunderhead\'s _climbing_. You can see it from the edge!');
    await s.say('Ardent Vasha', 'It will hold until the Long Light. His Grace promised. He\'ll send the stone back harmonized, before—');
    await s.say('Wren', 'Before your whole island falls into the storm?');
    await s.wait(1.0);
    await s.say('Ardent Vasha', '...Without the stone, the Lantern cannot hold the Thunderhead down. It never could. The Lantern was always what kept it below us.');
    await s.say('Ilse', 'And you didn\'t think about that when you gave it away?');
    await s.say('Ardent Vasha', 'I thought about it. I _believed_ him.');
    await s.wait(1.0);
    await s.say('Ardent Vasha', 'The Keel Lift is at the east edge. If someone charged the three old pylons beneath the isle, Skyreach might hold. And the Thunderhead—');
    await s.say('Corvin', 'Let me guess. Somebody has to go and punch the weather.');
    await s.say('Ardent Vasha', 'I can\'t leave the Lantern. I won\'t. Not now.');
    await s.say('Ardent Vasha', 'You owe me nothing. You don\'t believe what I believe. Why would you go?');
    await s.say('Wren', 'Because it\'s falling. And we\'re here.');
    await s.wait(1.2);
    await s.say('Ardent Vasha', '...Ysolde\'s girl.');
    await s.say('Ardent Vasha', 'Go. Tell Tamm at the lift that I sent you. Corvin — there are Saltglass sockets in every pylon. You\'ll know what to do.');
    await s.move('tern', [[7, 11]], 5);
    s.remove('tern');
    unstage(s, P, [7, 9, 'down']);
    s.objective('Take the Keel Lift (east edge of Skyreach) down into the Undercradle. Charge the three lift-pylons, then face the Thunderhead.');
    s.journal('Six of seven are his. Vasha gave him hers gladly. She says he told her the last stone would come to him freely — that the Keeper\'s daughter would bring it. I would never. I would NEVER. ...And Skyreach is falling into the storm.');
  },

  async vasha(s) {
    if (s.flag('c4b_six_of_seven')) {
      return s.say('Ardent Vasha', [
        'Go home, Ysolde\'s daughter. I will pray that you find your mother well.',
        'I will pray for His Grace as well. I no longer know if those are the same prayer.',
      ]);
    }
    if (s.flag('c4b_thunderhead_beaten')) return null;
    return s.say('Ardent Vasha', ['The Keel Lift is on the east edge. Go, if you are going.', 'I will be here. With my light.', '...With what is left of it.']);
  },

  async aftermath(s) {
    s.setFlag('c4b_six_of_seven');
    s.music('cassian');
    const P = stage(s, {
      wren: [7, 7, 'up'], ilse: [6, 8, 'up'], bram: [8, 8, 'up'],
      sable: [7, 8, 'up'], pip: [5, 8, 'up'], corvin: [9, 8, 'up'],
    });
    await s.wait(0.5);
    await s.say('Ardent Vasha', 'The isle is holding. Tamm says we\'ve risen a full fathom since you went below.');
    await s.say('Ardent Vasha', 'You went down into the Stormcrown for an island that gave your enemy exactly what he wanted.');
    await s.say('Wren', 'He\'s not my enemy.');
    await s.wait(0.8);
    await s.say('Wren', '...I don\'t know what he is.');
    await s.say('Ardent Vasha', 'I believe in him still. I will not pretend otherwise for your sake.');
    await s.say('Ardent Vasha', 'But I will not pretend you didn\'t save my people, either. Ilka is refitting your captain\'s ship. Skyreach-cut crystals. She\'ll fly anywhere now.');
    await s.say('Ardent Vasha', 'Where will you go?');
    await s.wait(1.5);
    await s.say('Wren', 'Six of seven.');
    await s.say('Wren', 'Saltglass. Frosthollow. Mirefen. Thornwood. Skyreach. Aurenne.');
    await s.say('Wren', 'And he said the last one would come to him freely. That the Keeper\'s daughter would bring it.');
    await s.say('Wren', 'Mom\'s alone on that island. With the last stone in the world. And he _knows_.');
    await s.say('Ilse', 'Then we go home.');
    await s.say('Wren', 'We go home.');
    await s.say('Ardent Vasha', 'His Grace said the song would be sung at sunset, on the Long Light. That is soon, Wren Halloway. Very soon.');
    await s.say('Ardent Vasha', 'If you reach him before then — what will you do?');
    await s.wait(1.5);
    await s.say('Wren', 'Talk to him. He\'ll listen to me.');
    await s.say('Wren', 'He always — he writes back. He always writes back.');
    s.face(P.ilse, P.wren);
    await s.narrate('Ilse looks at Wren for a long moment, and says nothing at all.');
    s.face(P.sable, 'up');
    await s.say('Sable', 'It is louder now. The fork. All of them are.');
    await s.say('Sable', 'They know the sun is going down.');
    unstage(s, P, [7, 9, 'down']);
    s.objective('When you are ready, find Corvin on the Skyreach docks and fly home to Lanternfall.');
    s.journal('Six of seven are his. Lanternfall is the last — Mom is the last. Cassian told Vasha the Keeper\'s daughter would bring him the stone. We\'re going home. I\'ll talk to him. He always writes back.');
  },

  // ================================================================ the Undercradle
  async underEnter(s) {
    await s.narrate('Beneath Skyreach, the island is a great hanging root of stone, open to the sky on every side. Far below, the Stormcrown boils — and something in it is climbing.');
    await s.say('Corvin', 'For the record, I was promised the hard part was over.');
    await s.say('Ilse', 'Nobody promised you that.');
    await s.say('Corvin', 'I promised me that.');
  },

  async pylon(s, which) {
    const key = `c4b_pylon_${which}`;
    if (s.flag(key)) return s.narrate('The pylon hums, steady and bright. The Saltglass in its heart is singing.');
    await s.narrate('An old brass pylon, thick with cables, bolted deep into the stone. The saltglass heart at its top is cracked and dark.');
    const intro = {
      w: 'Brass eyes open in the rock around it. The Keel Sentinels have been guarding this pylon for three hundred years, and they are not about to stop now.',
      e: 'A drake is coiled around the pylon\'s cables, warming itself on what little charge is left. It does not want to share.',
      s: 'The cables shudder. Something is climbing them from below.',
    }[which];
    s.shake(0.2, 0.5);
    await s.narrate(intro);
    const r = await s.battle('c4b_uc_pylon', { bg: 'sky' });
    if (r !== 'win') return;
    s.setFlag(key);
    await s.narrate('Corvin wedges a pane of desert glass into the socket. The pylon drinks the storm-light out of the air — and roars.');
    s.flash('#a8d8ff', 0.6);
    s.sfx('bolt');
    const n = count(s, PYLONS);
    s.clearBlocker(`gate${n}`);
    await s.narrate('Somewhere along the central bridge, a wall of storm-crystal cracks, and falls away into the sky.');
    if (n === 3) {
      await s.say('Ilse', 'That\'s all three. The way down is open.');
      s.objective('All three pylons are charged. Take the central bridge down and face the Thunderhead.');
    } else {
      s.toast(`<span class="hl">Lift-pylons</span> — ${n} of 3 charged`);
    }
  },

  async gate(s) {
    await s.narrate('A wall of blue storm-crystal has grown across the bridge, crackling and spitting.');
    await s.say('Ilse', 'It\'s feeding off the storm. If those pylons were working, they\'d drink it dry.');
  },

  async glider(s) {
    if (s.flag('c4b_glider')) return s.narrate('The wreck of a little yellow-winged glider, tangled in the cables. The wind plays it like a harp.');
    s.setFlag('c4b_glider');
    await s.narrate([
      'Tangled in the cables under the rock: the wreck of a one-man glider. Yellow canvas wings, in tatters.',
      'A name is painted on the strut: _KESI\'S WIND_.',
      'Strapped beneath the seat, in an oilskin pouch, is a logbook.',
    ]);
    await s.give('c4b_aram_log');
    await s.say('Wren', s.flag('c4b_kesi_asked') ? 'Kesi\'s father. He was so close. He was right under the isle.' : 'There\'s a name in the front. "Aram, Skyreach." Somebody up there might be waiting for this.');
  },

  async thunderhead(s) {
    if (s.flag('c4b_thunderhead_beaten')) return;
    s.music('tension');
    await s.narrate([
      'The bottom of the isle. Here the stone simply ends, and below it there is nothing but storm — a vast, slow wheel of cloud and lightning, turning.',
      'And in the middle of the wheel, something opens.',
    ]);
    s.shake(0.5, 1.2);
    s.sfx('bolt');
    await s.say('Sable', 'It is looking at us.');
    await s.say('Bram', 'Can weather look at you? Is that allowed?');
    await s.say('Corvin', 'Up here, big man, everything\'s allowed.');
    await s.say('Wren', 'Then we\'re allowed to hit it. Everyone — _now!_');
    const r = await s.battle('c4b_boss_thunderhead', { bg: 'sky' });
    if (r !== 'win') return;
    s.setFlag('c4b_thunderhead_beaten');
    s.music('town');
    s.flash('#ffffff', 0.8);
    await s.narrate('The Thunderhead tears apart into rain. Above you, all three pylons blaze at once, and the whole island shudders — and _rises_.');
    await s.say('Corvin', 'Did we just — did we just punch the weather?');
    await s.say('Pip', 'WE PUNCHED THE WEATHER!');
    await s.say('Ilse', 'We should go back up. Vasha needs to know.');
    s.objective('Return to Ardent Vasha at the Skyreach Lantern.');
    s.journal('We fought a storm. An actual storm, with an eye in the middle. And Skyreach is rising again.');
  },

  // ================================================================ homeward
  async depart(s) {
    await s.say('Corvin', 'She\'s ready when you are, sparrow. Say the word and we fly west.');
    const go = await s.confirm('Fly home to Lanternfall? (This ends the chapter.)', 'Fly home', 'Not yet');
    if (!go) return s.say('Corvin', 'Take your time. Just — not too much of it.');
    s.spawn('ilka_d', 'c4b_ilka', 20, 30, 'right');
    await s.move('ilka_d', [[23, 30]], 3);
    s.face('ilka_d', 'corvin_d');
    s.face('corvin_d', 'ilka_d');
    await s.say('Ilka', 'Ashe.');
    await s.say('Corvin', 'Ilka.');
    await s.say('Ilka', 'Stay. Fly cargo for me. Get old. Get fat. Pay me back nine hundred crowns at a crown a week.');
    await s.say('Corvin', '...That\'s the best offer I\'ve had in eleven years.');
    await s.say('Ilka', 'But.');
    await s.say('Corvin', 'But I\'ve got passengers.');
    await s.say('Ilka', 'You have never once in your life stayed where you were needed.');
    await s.wait(0.8);
    s.face('corvin_d', 'player');
    await s.say('Corvin', 'I know.');
    await s.say('Corvin', 'Thought I\'d give it a try.');
    await s.narrate('Ilka punches him in the shoulder, hard. Then she kisses him on the cheek, harder.');
    await s.say('Ilka', 'Bring my crystals back in one piece. And yourself. In that order.');
    s.setFlag('c4b_homeward');
    await s.fadeOut(1.2);
    s.remove('ilka_d');
    await s.teleport('c4b_halcyon_deck', 21, 7, 'right');
  },

  async homeward(s) {
    if (s.flag('c4b_done')) return;
    s.setFlag('c4b_done');
    const P = stage(s, {
      wren: [22, 7, 'right'], corvin: [7, 7, 'right'], ilse: [19, 8, 'right'],
      bram: [12, 8, 'up'], sable: [16, 6, 'right'], pip: [13, 7, 'up'],
    });
    await s.wait(0.8);
    await s.narrate([
      'The Halcyon flies west through the evening, out of the Stormcrown\'s shadow, over the fens and the forests and the long brown road.',
      'Nobody sleeps.',
    ]);
    await s.narrate('At the bow, Wren takes out her father\'s compass. The needle points west. It always points west.');
    await s.move(P.ilse, [[21, 8]], 1.5);
    s.face(P.ilse, P.wren);
    s.face(P.wren, P.ilse);
    await s.say('Ilse', 'Three things.');
    await s.say('Wren', 'Ilse—');
    await s.say('Ilse', 'One: you\'re going to want to talk to him. Cassian. Two: I am going to be standing right next to you when you do.');
    await s.say('Wren', 'And three?');
    await s.say('Ilse', 'Three: if he says anything — _anything_ — that makes you want to give him that stone, you look at me first.');
    await s.wait(1.0);
    await s.say('Wren', 'I would never give it to him.');
    await s.say('Ilse', 'Then it\'s an easy promise.');
    await s.wait(1.5);
    await s.say('Wren', '...Okay.');
    await s.wait(1.0);
    s.face(P.sable, 'right');
    await s.say('Sable', 'The sun is going down.');
    await s.say('Pip', 'It does that.');
    await s.say('Sable', 'Not for much longer, I think.');
    await s.say('Corvin', 'Lanternfall by morning, sparrow. Hold on to something.');
    s.face(P.wren, 'right');
    await s.think('Wren', 'Hold on, Mom. I\'m coming home.');
    s.journal('We\'re flying home. Ilse made me promise to look at her first, if Cassian says anything that makes me want to give him the stone. I said okay.');
    await s.fadeOut(1.5);
    unstage(s, P);
    await s.chapter(5, 'The Last Sunset');
    s.objective('Get home to Lanternfall.', true);
    await s.teleport('lf_sunset', 23, 30, 'up');
  },
};
