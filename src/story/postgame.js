// POST-GAME — the Abyss Gate, the Gloam Abyss, the Echo Colosseum and Lysa.
// Reachable from Act III (`act3`: the first ten stairs) and fully after the
// ending (`gameClear`: the rest, the First Dark, the Hiding Place).

import { ENEMIES } from '../data/enemies.js';
import { MAX_RANK } from '../data/crests.js';
import { PARTY_ORDER } from '../data/characters.js';
import GATE from '../data/maps/layouts/postgame_gate.js';
import HIDE from '../data/maps/layouts/postgame_hiding.js';
import { ABYSS_LAYOUTS, FLOORS } from '../data/maps/postgame_abyss_gen.js';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const CHALK_FLOORS = [6, 13, 21, 27];

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Everyone in the party except the leader, spawned on the given tiles. */
function gatherParty(s, spots, dir = 'up') {
  const ids = s.state.party.slice(1, spots.length + 1);
  ids.forEach((id, i) => s.spawn(`pp_${id}`, s.state.characters[id].look, spots[i][0], spots[i][1], dir));
  return ids.map((id) => `pp_${id}`);
}
const dismiss = (s, ids) => ids.forEach((id) => s.remove(id));
const inParty = (s, id) => s.state.party.includes(id);

/** Completion numbers for Orrin's Tally. */
export function tally(st) {
  const total = Object.keys(ENEMIES).length;
  const named = Object.values(st.bestiary || {}).filter((r) => r.defeated > 0).length;
  const per = PARTY_ORDER.filter((id) => st.characters[id]).map((id) => {
    const ch = st.characters[id];
    return [ch.name, Object.keys(ch.crests).filter((c) => ch.rankOf(c) >= MAX_RANK).length];
  });
  const mastered = per.reduce((n, [, k]) => n + k, 0);
  return { total, named, pct: total ? Math.floor((100 * named) / total) : 0, per, mastered, deepest: st.vars.pg_deepest || 0, rank: st.vars.pg_arena || 0 };
}

/** @type {Array<{ pct: number, flag: string, items: Array<[string, number]>, line: string }>} */
const NAME_MILESTONES = [
  { pct: 25, flag: 'pg_tb_25', items: [['megalixir', 2]], line: 'A quarter of everything that crawls. The dark is a little smaller for it. Here — for the road.' },
  { pct: 50, flag: 'pg_tb_50', items: [['pg_tally_lens', 1]], line: 'Half. Half the monsters of the world, named. Take my spare lens. It sees what things are, which is most of the battle.' },
  { pct: 75, flag: 'pg_tb_75', items: [['power_fruit', 1], ['magic_fruit', 1], ['guard_fruit', 1], ['spirit_fruit', 1], ['swift_fruit', 1]], line: 'Three quarters. I had to start a new ledger. I have not started a new ledger in nineteen years.' },
  { pct: 95, flag: 'pg_tb_95', items: [['pg_tally_book', 1]], line: 'That is... nearly all of them. Take the Tally. No — take it. It\'s more yours than mine now.' },
];
/** @type {Array<{ n: number, flag: string, items: Array<[string, number]>, line: string }>} */
const CREST_MILESTONES = [
  { n: 1, flag: 'pg_tc_1', items: [['crest_tome', 3]], line: 'One Crest, mastered all the way down to the bottom. Most people get one in their whole life and never finish it.' },
  { n: 6, flag: 'pg_tc_6', items: [['pg_kindling_lamp', 1]], line: 'Six masteries. You\'re all becoming a great many things. Here: a lamp lit at the Nadir Light. For choosing who you are next.' },
  { n: 24, flag: 'pg_tc_24', items: [['swift_fruit', 2], ['crest_tome', 5]], line: 'Twenty-four. The old proverb says one Crest, one life. I\'m crossing it out. Right here in the ledger. Look.' },
  { n: 72, flag: 'pg_tc_72', items: [['pg_many_lights', 1]], line: 'Seventy-two masteries. I don\'t have a word for what you are anymore. Good. Words are edges. Keep a few of yours loose.' },
];

// ---------------------------------------------------------------------------
// Floors
// ---------------------------------------------------------------------------

const BANTER = {
  1: async (s) => {
    await s.say('Ilse', 'Three things. One: it\'s dark. Two: it\'s very dark. Three—');
    await s.say('Pip', 'It\'s dark?');
    await s.say('Ilse', 'Three: something just breathed on my neck.');
    await s.say('Bram', 'That was me. I am breathing heroically.');
  },
  5: async (s) => {
    await s.say('Corvin', 'A Hearthstone. Down here. Somebody carried that down five flights of nightmare.');
    await s.say('Sable', 'Or somebody forgot it, and it fell.');
    await s.say('Corvin', 'I like my version better, sparrow. Mine has a hero in it.');
  },
  8: async (s) => {
    await s.say('Corvin', 'Streets. Down here.');
    await s.say('Sable', 'A city someone forgot. All of it at once.');
    await s.say('Bram', 'How does one forget an entire *city*?');
    await s.say('Corvin', 'Same way you forget anything, big man. A little at a time, then all at once.');
  },
  12: async (s) => {
    await s.say('Ilse', 'These shelves are full of books.');
    await s.say('Wren', 'Every page is blank.');
    await s.say('Ilse', '...I think that\'s the saddest thing I\'ve ever seen. And I run a hospital.');
  },
  16: async (s) => {
    await s.say('Wren', 'Snow. Underground.');
    await s.say('Sable', 'It is the first winter. The very first one. Nobody remembers it, so it came here.');
    await s.say('Pip', 'Can a winter be lonely?');
    await s.say('Sable', 'Everything can.');
  },
  23: async (s) => {
    await s.say('Ilse', 'It\'s... white.');
    await s.say('Wren', 'I thought the bottom would be black.');
    await s.say('Sable', 'Black is a colour. This is from before colours.');
    await s.say('Corvin', 'I hate it. I hate it in a very specific, educated way.');
  },
  29: async (s) => {
    await s.say('Bram', 'Is anyone else afraid?');
    await s.wait(0.6);
    await s.say('Wren', 'Yes.');
    await s.say('Pip', 'Obviously.');
    await s.say('Bram', 'Good. Then we go together. That\'s how it works. I looked it up.');
  },
};

/** @type {import('../types/data').StoryScripts} */
export const PG = {
  // ------------------------------------------------------------------ the Gate
  async gateEnter(s) {
    if (s.flag('pg_arrived')) return;
    s.setFlag('pg_arrived');
    await s.wait(0.4);
    await s.pan(21, 11, 2);
    await s.narrate([
      'At the lip of the deepest rift in the world, a lighthouse stands with its lamp turned the wrong way.',
      'It does not shine out to sea. It shines *down*.',
    ]);
    await s.say('Wren', 'A Lantern. Out here? There were only ever seven.');
    await s.say('Ilse', 'There were only ever seven *anyone sang about*.');
    await s.follow(1);
    await s.move('orrin', [[24, 16], [22, 16], [22, 28]], 3);
    s.face('orrin', 'down');
    await s.say('Orrin', 'Six. Six of you. Hold still.');
    await s.emote('orrin', '…');
    await s.say('Orrin', 'There. You\'re in the Tally now. Congratulations. It\'s mostly moths.');
    await s.say('Bram', 'Sir, I must protest. We are not moths. We are an elite fellowship of—');
    await s.say('Orrin', 'No. Moths have the sense to stay away from the edge. I\'ll make a note.');
    await s.say('Pip', 'I like him.');
    await s.say('Orrin', 'Orrin Vey. Underkeeper of the Nadir Light — the Eighth Lantern. Nobody sings about it because it doesn\'t raise the sun. It holds something *down*.');
    await s.say('Sable', 'Something is down there.');
    await s.say('Sable', 'It is not angry. It is... unfinished.');
    await s.say('Orrin', '...Yes. That\'s the word. Huh. I\'ve been looking for that word for thirty years.');
    await s.say('Orrin', [
      'Before the Hearthsun there was the First Dark. Not evil. Not anything. The sun gave things *edges* — this is a stone, that is a sea, you are you.',
      'When something is forgotten, it loses its edges and sinks. Down there. Thirty stairs of everything the world ever dropped.',
    ]);
    await s.say('Corvin', 'And you just... live here. On the rim of the bottomless pit of forgotten things.');
    await s.say('Orrin', 'Rent\'s cheap.');
    if (s.flag('gameClear')) {
      await s.say('Orrin', [
        'Funny thing. The sky\'s got a new light in it. Small. Stubborn. Since it came up, my lamp reaches all the way to the bottom.',
        'If you\'re the ones who lit it... well. The First Dark felt it too. It\'s stirring.',
      ]);
    } else {
      await s.say('Orrin', [
        'My light reaches ten stairs down. Below that the dark is too thick for an old lamp. It\'ll take a new kind of light.',
        'I\'ll know it when I see it.',
      ]);
    }
    await s.say('Orrin', 'Go down if you like. Bring back names. I write them all in the Tally — every creature you put a name to is one less thing the dark gets to keep.');
    await s.move('orrin', [[22, 16], [24, 16], [24, 13]], 3);
    s.face('orrin', 'down');
    s.quest('pg_abyss', 'The Gloam Abyss', 'Thirty stairs beneath the Nadir Light. At the bottom, something without edges is waiting.');
    s.quest('pg_tally', 'The Tally', 'Orrin rewards names (the Bestiary) and mastery (Crests at rank 10). Report to him now and then.');
    // Before the ending the Abyss is a side trip: its Journal quest tracks it and the
    // main objective (the Sun Shards) stays put.
    if (s.flag('gameClear')) s.objective('Descend the Gloam Abyss to the thirtieth stair.');
    s.journal('We found an eighth Lantern at the edge of the rift. It shines down. The man who keeps it counts everything, including us.');
  },

  async orrin(s) {
    const pick = await s.choice(['The Tally', 'The Abyss', 'The First Dark', 'Nothing'], { prompt: 'Orrin looks up from his ledger.', cancel: 3 });
    if (pick === 0) return PG.tallyReport(s);
    if (pick === 1) {
      await s.say('Orrin', [
        'Thirty stairs. Gloamdeep first — the newest forgettings, still warm. Then a drowned city. Then the first winter. Then... white.',
        'A Hearthstone every fifth stair; somebody before me was kind. And the Lantern-lift on the rim will stop anywhere you\'ve beaten the warden.',
      ]);
      if (!s.flag('gameClear')) await s.say('Orrin', 'Past the tenth stair the dark is packed solid. It\'ll take a newer light than mine.');
      return;
    }
    if (pick === 2) {
      if (s.flag('pg_first_dark')) {
        return s.say('Orrin', ['You gave it an edge. Dusk, you said?', 'I went down to look. It\'s asleep. It\'s *small*. I sat with it for an hour. First time in thirty years I wasn\'t keeping it down. Just keeping it company.']);
      }
      return s.say('Orrin', [
        'It isn\'t a monster. Monsters have shapes. It\'s the place shapes come from, and go back to.',
        'If you go down there, it will try to take your edges off. Your names, your Crests, the line where you stop and your friends start.',
        'Hold on to them.',
      ]);
    }
    return s.say('Orrin', 'Mind the edge. The edge doesn\'t mind you.');
  },

  async tallyReport(s) {
    const t = tally(s.state);
    await s.system([
      `THE TALLY — Names known: *${t.named}* of ${t.total} (${t.pct}%)`,
      `Crests mastered: *${t.mastered}* — ${t.per.map(([n, k]) => `${n} ${k}`).join(' · ')}`,
    ].join('\n'));
    await s.system([
      `Deepest stair: *B${t.deepest}* of ${FLOORS} · Echo Colosseum: ${t.rank ? `Rank *${ROMAN[t.rank]}*` : 'unranked'}`,
      `The First Dark: ${s.flag('pg_first_dark') ? 'given an edge' : 'unnamed'} · Lysa: ${s.flag('pg_lysa_done') ? 'found' : 'still hiding'}`,
    ].join('\n'));
    let gave = false;
    for (const m of NAME_MILESTONES) {
      if (t.pct < m.pct || s.flag(m.flag)) continue;
      s.setFlag(m.flag);
      await s.say('Orrin', m.line);
      for (const [id, n] of m.items) await s.give(id, n);
      gave = true;
    }
    for (const m of CREST_MILESTONES) {
      if (t.mastered < m.n || s.flag(m.flag)) continue;
      s.setFlag(m.flag);
      await s.say('Orrin', m.line);
      for (const [id, n] of m.items) await s.give(id, n);
      gave = true;
    }
    if (!gave) {
      const nextName = NAME_MILESTONES.find((m) => !s.flag(m.flag));
      const nextCrest = CREST_MILESTONES.find((m) => !s.flag(m.flag));
      const hints = [];
      if (nextName) hints.push(`${nextName.pct}% of the Bestiary`);
      if (nextCrest) hints.push(`${nextCrest.n} Crest${nextCrest.n > 1 ? 's' : ''} mastered`);
      if (hints.length) await s.say('Orrin', `Nothing new for the ledger. Come back at ${hints.join(', or ')}. I\'ll have something put by.`);
      else {
        await s.say('Orrin', 'There\'s nothing left I can give you. You\'ve out-counted me.');
        if (!s.flag('pg_tally_done')) { s.setFlag('pg_tally_done'); s.quest('pg_tally', null, null, 'done'); }
      }
    }
  },

  async sorrel(s) {
    if (!s.flag('pg_sorrel_met')) {
      s.setFlag('pg_sorrel_met');
      await s.say('Sorrel', [
        'Customers! Real ones, with pulses! Welcome to Sorrel\'s Salvage. Everything here fell out of the world and landed in my net.',
        'Swords nobody remembers forging. Tonics nobody remembers brewing. All perfectly good. Mostly.',
      ]);
      if (inParty(s, 'pip')) {
        await s.say('Pip', 'How much for the stuff that\'s *perfectly* good?');
        await s.say('Sorrel', 'Double. And I count my fingers after you leave, sweetheart.');
      }
    }
    return s.shop('pg_salvage');
  },

  async quill(s) {
    const deep = s.state.vars.pg_deepest || 0;
    const rewards = [
      { at: 10, flag: 'pg_quill_10', item: 'feather_cape', line: 'Ten stairs! That\'s further than my last three assistants. They\'re fine. They\'re in Kiteholm. They don\'t write.' },
      { at: 20, flag: 'pg_quill_20', item: 'hunters_eye', line: 'Twenty! The first winter — did it really snow? Don\'t answer. I want to imagine it. Take this; it helped me see in the drifts.' },
      { at: 30, flag: 'pg_quill_30', item: 'lucky_coin', line: 'The bottom. You mapped the *bottom*. I\'m going to frame this. I\'m going to frame *you*. Here — my lucky coin. It\'s done its job.' },
    ];
    if (!s.flag('pg_quill_met')) {
      s.setFlag('pg_quill_met');
      await s.say('Quill', [
        'Hello! Don\'t step on the map. That\'s the map. That\'s also the map. I\'m Quill — I chart the Abyss.',
        'From up here, I mean. Through the telescope. It\'s mostly guesswork and very confident handwriting.',
        'Go down and tell me what\'s there. Every ten stairs you reach, I\'ll pay you for the news.',
      ]);
    }
    let paid = false;
    for (const r of rewards) {
      if (deep < r.at || s.flag(r.flag)) continue;
      s.setFlag(r.flag);
      await s.say('Quill', r.line);
      await s.give(r.item);
      paid = true;
    }
    if (paid) return;
    const tips = [
      'If you see a little golden light flitting about down there — a Wishing Mote — use magic. Blades go right through it. Catch one and it might leave a Crest Tome.',
      'The chests down there that bite are Hoarder Mimics. They\'ve eaten whole fortunes. Pierce them, shock them, and they cough up the most wonderful fruit.',
      'Every fifth stair has a Hearthstone. Somebody put them there. I would very much like to meet that somebody.',
      `Deepest stair you\'ve reached: B${deep}. ${deep >= FLOORS ? 'All of it. Show-off.' : 'The bottom\'s at thirty. Probably. I drew it at thirty.'}`,
    ];
    return s.say('Quill', tips[Math.floor(Math.random() * tips.length)]);
  },

  async tobb(s) {
    if (s.flag('pg_tobb_done')) return s.say('Tobb', ['I read it every morning now. Takes me a long while. I stop in the middle and look at the sky.', 'Thank you. I don\'t say it enough. I\'m saying it.']);
    if (s.has('pg_tobbs_letter')) {
      s.setFlag('pg_tobb_done');
      await s.say('Wren', 'Tobb. We found something on the third stair.');
      await s.take('pg_tobbs_letter');
      await s.wait(0.6);
      await s.say('Tobb', '...That\'s her hand. That\'s Mara\'s hand.');
      await s.say('Tobb', ['I threw it in. Thought if I didn\'t have the letter, I wouldn\'t have the — the rest. The missing her.', 'It didn\'t work. I only missed the letter too.']);
      await s.say('Ilse', 'It doesn\'t work. People keep trying. I\'ve watched them try at the Ward.');
      await s.say('Ilse', 'You don\'t get to keep someone without the hurting. It\'s one thing, not two.');
      await s.say('Tobb', '...One thing. Yes.');
      await s.say('Tobb', 'Here. I brought these to sell to the bookie for a bet I wasn\'t going to make. You have them.');
      await s.give('elixir', 3);
      await s.give('dawn_plume', 2);
      s.quest('pg_tobb', null, null, 'done');
      s.journal('We brought Tobb his daughter\'s letter back up out of the dark. Ilse said the true thing. She usually does.');
      return;
    }
    if (!s.flag('pg_tobb_met')) {
      s.setFlag('pg_tobb_met');
      await s.say('Tobb', [
        'You lot going down? Then mind the third stair. That\'s about where it\'d land.',
        'A letter. From my girl, Mara, before the Sundering took her. I threw it in. I wanted to forget.',
        'Turns out I\'d rather remember and hurt. Bit late to decide, eh.',
      ]);
      s.quest('pg_tobb', 'The Unsent Letter', 'Tobb threw his late daughter\'s letter into the rift. It would have landed around the third stair.');
      return;
    }
    return s.say('Tobb', 'Third stair, or thereabouts. A blue envelope. You\'d know it. It\'s the only thing down there anyone ever loved.');
  },

  async nils(s) {
    if (!s.flag('pg_nils_gift')) {
      s.setFlag('pg_nils_gift');
      await s.say('Nils', [
        'I sang in the Choir. In the Vespersong. I stood in the Grand Lantern and sang the sun to pieces because a kind man told me to.',
        'So now I fill this lamp with oil every morning. It does not make anything even. It is just the next right thing.',
        'Take these. Holy water. I blessed it myself — whatever my blessing is worth now.',
      ]);
      await s.give('holy_water', 5);
      return;
    }
    if (s.flag('gameClear')) return s.say('Nils', 'There is a new sun. A small one. I keep looking up at it to check it\'s still there. It always is. I don\'t know what to do with that.');
    return s.say('Nils', 'Orrin says guilt looks backward and the lamp needs looking after. He is very annoying when he is right.');
  },

  async wick(s) {
    if (inParty(s, 'pip') && !s.flag('pg_wick_pip')) {
      s.setFlag('pg_wick_pip');
      await s.say('Wick', 'PIP. Pip Tallow! In the flesh! You still owe me four coppers.');
      await s.say('Pip', 'You owe ME four coppers.');
      await s.say('Wick', 'I owe *everyone* four coppers, that\'s my whole business model.');
      await s.say('Pip', '...That\'s actually pretty good.');
      await s.say('Wick', 'Dace pays me to run bets. You lot fighting in the Colosseum? I\'m putting my four coppers on you. Everyone\'s four coppers.');
      return;
    }
    const rank = s.state.vars.pg_arena || 0;
    const lines = rank >= 10
      ? ['You beat YOURSELVES. Dace cried. Not the happy kind — he had money on the hollow ones. I didn\'t. I\'m rich. Four coppers rich.']
      : rank >= 5
        ? [`Rank ${ROMAN[rank]}! The odds on you are terrible now. Terrible for me. Everyone bets on you.`]
        : ['The Colosseum\'s through that big door. Dace\'ll fight you against anything the Gloam remembers. Everything you ever beat, it remembers.'];
    return s.say('Wick', lines);
  },

  // ------------------------------------------------------------------ floors
  async floorEnter(s, n) {
    s.state.vars.pg_deepest = Math.max(s.state.vars.pg_deepest || 0, n);
    const key = `pg_b${n}`;
    if (BANTER[n] && !s.flag(key)) {
      s.setFlag(key);
      await s.wait(0.5);
      await BANTER[n](s);
    }
  },

  /** The seal on B10's stair before the new light exists. */
  async deepSeal(s) {
    await s.narrate('Past the stair, the dark is packed solid — so dense the lamplight bends away from it, like water off oil.');
    await s.say('Sable', 'It will not let us through. Not with the light we have.');
    await s.say('Wren', 'Then we come back with a better one.');
    s.quest('pg_abyss', null, 'Thirty stairs beneath the Nadir Light. Below B10 the dark is sealed: it will take a new kind of light. (Continue the story.)');
  },

  async liftUp(s, n) {
    if (!(await s.confirm('Ride the Lantern-lift up to the Abyss Gate?'))) return;
    s.sfx('rumble');
    await s.teleport('abyss_gate', GATE.spots.lift_arrive[0], GATE.spots.lift_arrive[1], 'down');
    if (n === FLOORS) s.toast('The lift remembers the bottom now.');
  },

  async liftDown(s) {
    const stops = [10, 20, 30].filter((n) => s.flag(n === FLOORS ? 'pg_first_dark' : `pg_boss_${n}`));
    if (!stops.length) {
      await s.narrate('A cage on a chain long enough to make you dizzy. It only stops at the stairs where someone has beaten the warden.');
      return;
    }
    const pick = await s.choice([...stops.map((n) => `Down to B${n}`), 'Stay up here'], { prompt: 'The Lantern-lift creaks on its chain.', cancel: stops.length });
    if (pick >= stops.length) return;
    const n = stops[pick];
    const L = ABYSS_LAYOUTS[n];
    s.sfx('rumble');
    await s.fadeOut(0.6);
    await s.teleport(`abyss_${n}`, L.spots.liftArrive[0], L.spots.liftArrive[1], 'down');
  },

  // ------------------------------------------------------------------ wardens
  async knight(s) {
    if (s.flag('pg_boss_10')) return;
    const L = ABYSS_LAYOUTS[10].spots;
    await s.pan(L.exitFront[0], L.exitFront[1], 1);
    await s.narrate('A knight stands before the stair down, its armour fused with the rubble. Its shield has no crest. Its tabard has no colour.');
    await s.say('Unremembered Knight', '...Halt. State your name and company.');
    await s.say('Bram', 'Bram Kestrel. Of — well. Of these people.');
    await s.say('Unremembered Knight', [
      'Name. I had one. They read it out at the funeral and then nobody ever said it again.',
      'Every soldier no one remembers comes here, Kestrel. We are a very large army.',
    ]);
    await s.say('Bram', 'Sir Aldous Venn was remembered. I made sure of it. I say his name every day.');
    await s.say('Unremembered Knight', 'Then you will make sure of nothing else. Draw.');
    await s.follow(0.5);
    if (await s.battle('pg_boss_unremembered') !== 'win') return;
    s.setFlag('pg_boss_10');
    s.remove('pg_knight');
    await s.say('Unremembered Knight', '...Kestrel. Say one more name. Any name. Before I go.');
    await s.say('Bram', '...Aldous Venn.');
    await s.say('Unremembered Knight', 'Good. That one is safe.');
    await s.narrate('The armour comes apart like a held breath let go. For a moment you hear a great many people say thank you.');
    await s.say('Bram', 'I\'m fine. Something in my eye. A knight. A whole knight in my eye.');
    s.toast('The Lantern-lift now stops at B10.');
    if (s.flag('gameClear')) {
      s.clearBlocker('seal');
      s.objective('Descend deeper into the Gloam Abyss.');
    } else {
      await PG.deepSeal(s);
    }
    s.journal('The tenth stair was guarded by every soldier nobody remembered. Bram gave them one name to keep.');
  },

  async sovereign(s) {
    if (s.flag('pg_boss_20')) return;
    const L = ABYSS_LAYOUTS[20].spots;
    await s.pan(L.exitFront[0], L.exitFront[1], 1);
    await s.narrate('The stairwell is sealed by ice as old as the first winter. Something vast is asleep in it, curled around the way down.');
    await s.say('Pip', 'Don\'t. Nobody poke it.');
    await s.say('Corvin', 'Nobody is going to poke the—');
    s.shake(0.4, 1);
    await s.say('Rime Sovereign', '{blue|WHO. REMEMBERS. ME.}');
    await s.say('Sable', 'Nobody. That is why you are here.');
    await s.say('Rime Sovereign', '{blue|THEN I WILL BE REMEMBERED AS THE COLD IN YOUR BONES.}');
    await s.say('Wren', 'Okay. Okay. Big lizard. Fire, everybody.');
    await s.follow(0.5);
    if (await s.battle('pg_boss_rime') !== 'win') return;
    s.setFlag('pg_boss_20');
    s.clearBlocker('seal');
    await s.narrate('The Sovereign shatters into a snowfall so fine it never lands. Something heavy clinks onto the ice where her head was.');
    await s.give('pg_first_crown');
    await s.say('Ilse', 'I\'m writing that one down myself. Orrin can copy it.');
    s.toast('The Lantern-lift now stops at B20.');
    s.objective('Descend to the bottom of the Gloam Abyss.');
    s.journal('The twentieth stair had a queen of snow with no kingdom. Wren\'s plan was "fire." It worked.');
  },

  // ------------------------------------------------------------------ the First Dark
  async firstDark(s) {
    if (s.flag('pg_first_dark')) return;
    s.place('player', 18, 13, 'up');
    const party = gatherParty(s, [[16, 14], [20, 14], [14, 14], [22, 14], [18, 15]]);
    s.stopMusic(2);
    await s.pan(18, 9, 2.5);
    await s.narrate([
      'The marble ends. Beyond it there is no floor, no wall, no colour. Only a white so total it has no direction.',
      'In the middle of the white, something without any edges at all turns its attention toward you.',
    ]);
    s.shake(0.3, 2);
    await s.say('The First Dark', '{purple|...you are very loud.}');
    await s.say('The First Dark', '{purple|all of you. so many edges. doesn\'t it hurt?}');
    await s.say('Wren', 'Sometimes.');
    await s.say('The First Dark', [
      '{purple|come back down. no names. no edges. nothing to lose. nothing to be.}',
      '{purple|you will not have to choose anymore. not one crest. not many. none.}',
    ]);
    await s.say('Ilse', 'It\'s offering us *nothing*.');
    await s.say('Corvin', 'It\'s a very sincere nothing. I almost respect it.');
    await s.say('Sable', [
      'I was made from you. A little. I remember being nothing. It was quiet.',
      'Then someone gave me bread. It was warm.',
      'I would rather have bread.',
    ]);
    await s.say('Pip', 'Me too. I\'d rather have bread than be nothing. That\'s not even close.');
    await s.say('Bram', 'I would rather be afraid than be nothing. I have given this a great deal of thought.');
    await s.say('Wren', 'Edges hurt. That\'s how you know where you stop and someone else starts.');
    await s.say('Wren', 'We\'re keeping ours.');
    await s.say('The First Dark', '{purple|then i will take them off you. gently. one by one.}');
    s.flash('#ffffff', 0.6);
    if (await s.battle('pg_boss_first_dark') !== 'win') return;
    s.setFlag('pg_first_dark');
    s.music('afterlight');
    await s.narrate([
      'The First Dark does not die. There is nothing in it that could.',
      'It shrinks. It folds. The white around it greys, then dims, then — for the first time in all of time — becomes a colour:',
      'the deep blue of the sky an hour after sunset.',
    ]);
    await s.say('The First Dark', '{purple|...what is this.}');
    await s.say('Sable', 'It is called dusk. It is the edge between the day and the night.');
    await s.say('Sable', 'You have one now. An edge.');
    await s.say('The First Dark', '{purple|...it is small.}');
    await s.say('Sable', 'They start small.');
    await s.say('The First Dark', '{purple|...then i will sleep in it. wake me when it is bigger.}');
    await s.narrate('The dark folds itself into the dusk the way a cat folds into a lap, and is still.');
    await s.wait(0.6);
    s.flash('#ffe0a0', 0.8);
    await s.narrate('Something warm moves out of the stillness and into all six of you: a heat like a forge, and a glow like the hour after the sun.');
    await s.learnCrest('sunforged');
    await s.learnCrest('afterlight');
    await s.give('breakers_gem');
    await s.say('Bram', 'We did it. We punched the dark in the face.');
    await s.say('Ilse', 'We gave the dark a bedtime.');
    await s.say('Pip', 'Same thing.');
    await s.narrate('Far, far above, a lamp on a chain begins its long swing down to find you.');
    dismiss(s, party);
    s.quest('pg_abyss', null, null, 'done');
    s.objective('The First Dark sleeps. Ride the Lantern-lift home — and tell Orrin.');
    s.journal('At the bottom of everything was the First Dark. It wanted us to be nothing. Sable gave it dusk instead, and it went to sleep in it like a kid. Two new Crests woke up in all of us.');
    await s.fadeOut(1);
    await s.teleport(`abyss_${FLOORS}`, ABYSS_LAYOUTS[FLOORS].spots.liftArrive[0], ABYSS_LAYOUTS[FLOORS].spots.liftArrive[1], 'up');
  },

  // ------------------------------------------------------------------ Hide and Seek
  async chalkGate(s) {
    const found = CHALK_FLOORS.filter((n) => s.flag(`pg_chalk_${n}`)).length;
    if (found >= CHALK_FLOORS.length) return PG.chalkDoor(s);
    await s.narrate('An old wall, scrawled with chalk: a girl with long black hair and a ribbon, and an arrow pointing down into the rift. Under it, in careful capitals: COUNT TO A HUNDRED. NO PEEKING.');
    if (s.flag('pg_chalk_gate')) {
      if (found) await s.narrate(`You have found ${found} of her chalk marks below.`);
      return;
    }
    s.setFlag('pg_chalk_gate');
    await s.say('Sable', '...That is my face. That is my ribbon.');
    await s.say('Wren', 'Not yours. Hers.');
    await s.say('Sable', 'Lysa. She drew herself. Small. The way children draw themselves when they want to be found.');
    await s.say('Ilse', 'Chalk doesn\'t last forty years in the open.');
    await s.say('Corvin', 'Unless someone keeps redrawing it.');
    s.quest('pg_hideseek', 'Hide and Seek', 'Someone has been leaving chalk marks in the Gloam Abyss. Find them all: they lead somewhere.');
  },

  async chalk(s, n) {
    const LINES = {
      6: 'Chalk on the stone in a child\'s hand: a hopscotch grid, and beside it — I\'M HIDING. DON\'T LOOK HERE. (She was not hiding here.)',
      13: 'A chalk arrow, pointing the way she went. Underneath: WARMER!',
      21: 'Chalk, faded but careful: CASSIAN ALWAYS FINDS ME. HE\'S THE BEST AT THIS GAME. Below it, very small: are you cassian?',
      27: 'A chalk door, drawn small, rubbed out, and drawn again bigger. Under it: I GOT TIRED OF WAITING. I\'M SOMEWHERE NICE NOW. THE DOOR IS WHERE IT STARTED.',
    };
    await s.narrate(LINES[n]);
    if (s.flag(`pg_chalk_${n}`)) return;
    s.setFlag(`pg_chalk_${n}`);
    if (n === 6) await s.say('Pip', 'Hopscotch. Down here. That\'s... that\'s the creepiest nice thing I\'ve ever seen.');
    if (n === 13) await s.say('Sable', 'She is playing. She thinks this is still a game.');
    if (n === 21) {
      await s.say('Wren', '...She\'s waiting for her brother.');
      await s.say('Sable', 'For forty years.');
    }
    const found = CHALK_FLOORS.filter((f) => s.flag(`pg_chalk_${f}`)).length;
    if (found >= CHALK_FLOORS.length) {
      await s.say('Ilse', 'Where it started. The wall by the Gate — that\'s where the first drawing was.');
      s.objective('Lysa\'s chalk marks point back to the wall by the Abyss Gate.');
      s.quest('pg_hideseek', 'Hide and Seek', 'The last chalk mark says the door is "where it started" — the chalk wall at the Abyss Gate.');
    } else {
      s.toast(`Chalk marks found: ${found} / ${CHALK_FLOORS.length}`);
    }
  },

  async chalkDoor(s) {
    if (s.flag('pg_lysa_done')) {
      await s.narrate('The chalk door is still there. It is closed now, and someone has drawn a small, smiling sun above it.');
      return;
    }
    await s.narrate('Where the drawing of the girl was, there is now a door — drawn in chalk, on a wall that has no door. It is slightly open.');
    if (!(await s.confirm('Step through the chalk door?'))) return;
    await s.fadeOut(1, '#fff8e0');
    await s.teleport('pg_hiding_place', HIDE.spots.arrive[0], HIDE.spots.arrive[1], 'up');
  },

  async hidingEnter(s) {
    if (s.flag('pg_lysa_done')) return;
    const spots = Object.keys(HIDING_SPOTS);
    s.state.vars.pg_lysa_spot = spots[Math.floor(Math.random() * spots.length)];
    if (s.flag('pg_hiding_seen')) return;
    s.setFlag('pg_hiding_seen');
    await s.wait(0.6);
    await s.narrate('A summer night in a city that does not exist anymore. Paper lanterns. Bunting. A fountain still warm from the day. Nobody here.');
    await s.say('Corvin', '...Aurenne. The festival. This is the night. The night the Lantern failed.');
    await s.narrate('From somewhere far away, a boy\'s voice, counting: "...ninety-eight... ninety-nine..."');
    await s.wait(0.8);
    await s.narrate('"...a hundred! Ready or not!" The voice stops. It never starts again.');
    await s.wait(0.6);
    await s.narrate('Somewhere in the square, someone small giggles.');
    await s.say('Sable', 'She is hiding. She has been hiding all this time.');
    await s.say('Wren', 'Then let\'s find her.');
    s.objective('Search the festival square for Lysa. (Check the hiding places.)');
  },

  async hideSpot(s, spot) {
    if (s.flag('pg_lysa_done')) return s.narrate('Nobody is hiding here anymore. It\'s just a nice place to sit.');
    const want = s.state.vars.pg_lysa_spot;
    if (spot === want) return PG.lysaFound(s, spot);
    const [ax, ay] = HIDING_SPOTS[spot].at, [bx, by] = HIDING_SPOTS[want].at;
    const d = Math.hypot(ax - bx, ay - by);
    const hint = d < 8 ? '"Warmer! Warmer!"' : d < 15 ? '"Cold!"' : '"Freezing! Brrr!"';
    await s.narrate(`${HIDING_SPOTS[spot].empty} From somewhere across the square, a small voice: ${hint}`);
  },

  async lysaFound(s, spot) {
    const [px, py] = HIDING_SPOTS[spot].pop;
    s.spawn('lysa', 'lysa', px, py, 'down');
    await s.hop('lysa');
    await s.say('Lysa', 'You found me!');
    await s.say('Lysa', 'Nobody EVER finds me. I\'m the best at hiding. Cassian says so.');
    s.setFlag('pg_lysa_found');
    if (inParty(s, 'sable')) {
      await s.emote('lysa', '?');
      await s.say('Lysa', '...You have my face.');
      await s.say('Sable', 'Yes. I am sorry. I did not choose it.');
      await s.say('Lysa', 'It looks nice on you. You\'re taller.');
      await s.say('Lysa', '...Is that what I\'d look like? If I grew up?');
      await s.say('Sable', '...Yes. I think so.');
      await s.say('Lysa', 'Huh.');
    }
    await s.say('Lysa', 'Where\'s Cassian? He\'s supposed to be seeking. He\'s *always* seeking.');
    await s.say('Wren', '...Lysa. How long have you been hiding?');
    await s.say('Lysa', [
      'Since the festival. It got dark all of a sudden — REALLY dark — and I thought: this is the best hiding place ever. Nobody will ever find me in the dark.',
      'And nobody did.',
    ]);
    await s.wait(0.8);
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'I know.');
    await s.say('Lysa', 'It\'s my turn to seek now. That\'s the rule! Whoever gets found has to seek!');
    await s.say('Lysa', 'Ready or not!');
    if (await s.battle('pg_boss_lysa') !== 'win') return;
    s.setFlag('pg_lysa_done');
    s.music('sad');
    await s.narrate('Lysa sits down hard on the edge of the fountain, out of breath and grinning.');
    await s.say('Lysa', 'Okay. Okay, you win. You\'re really good.');
    await s.say('Lysa', 'Did Cassian grow up?');
    await s.say('Wren', 'He did. He got old. He was the most important man in the world.');
    await s.say('Lysa', 'Cassian? He\'s scared of geese.');
    await s.say('Corvin', 'Is he, now.');
    await s.say('Lysa', '...Was he happy?');
    await s.wait(1);
    await s.say(inParty(s, 'sable') ? 'Sable' : 'Wren', [
      'No. He missed you every day. He looked for you for forty years.',
      'He built a whole world to find you in.',
    ]);
    await s.say('Lysa', '...He\'s so *bad* at this game.');
    await s.say('Lysa', 'Did he stop? Looking?');
    if (inParty(s, 'sable')) {
      await s.say('Sable', 'At the very end. He held my hand. And then he let go.');
    } else {
      await s.say('Wren', 'At the very end. He let go.');
    }
    await s.say('Lysa', [
      'Good.',
      'That\'s how it\'s supposed to go. You look and you look, and if you can\'t find them you go home for supper. You\'re not supposed to look forever.',
    ]);
    if (inParty(s, 'sable')) {
      await s.say('Lysa', 'Hey. Face-girl. Will you do something for me? Get really old. Get wrinkly. Get grey hair. Do ALL of it.');
      await s.say('Sable', 'I will. I promise. I will be very wrinkled.');
    }
    await s.say('Lysa', 'And — here. For drawing doors. In case you ever need one.');
    await s.give('pg_chalk_stub');
    await s.say('Lysa', 'I think I\'ll go home now. I\'ve been out *really* late.');
    await s.fadeOut(1.6, '#fff8e0');
    s.remove('lysa');
    await s.wait(0.8);
    await s.fadeIn(1.6);
    await s.narrate('Where she sat there is only a little chalk on the fountain\'s edge, and the warmth of the stone.');
    await s.say('Pip', 'I\'m not crying. There\'s chalk in my eye.');
    await s.say('Bram', 'There is chalk in ALL of our eyes, Pip.');
    s.quest('pg_hideseek', null, null, 'done');
    s.objective('Lysa went home. Return through the chalk door.');
    s.journal('We found Lysa. Forty years of hiding, and she just wanted someone to say "found you." She asked Sable to get old. Sable promised.');
  },

  // ------------------------------------------------------------------ the Colosseum
  async dace(s) {
    if (!s.flag('pg_dace_met')) {
      s.setFlag('pg_dace_met');
      await s.say('Dace', [
        'Ladies! Gentlemen! And things that used to be gentlemen! Welcome to the ECHO COLOSSEUM!',
        'Kiteholm had a colosseum. Then it had a fire. Now it has a very nice memorial. I brought the betting slips.',
        'Here\'s the trick: the Gloam remembers every fight there ever was. I just... ask it to remember them *here*, where I sell tickets.',
        'Ten ranks. Ten memories. Each one nastier than the last. Prizes for the living!',
      ]);
      s.quest('pg_colosseum', 'The Echo Colosseum', 'Dace runs ten ranks of remembered fights beneath the Abyss Gate. Win them all.');
    }
    const cleared = s.state.vars.pg_arena || 0;
    const open = Math.min(ARENA.length, cleared + 1);
    const options = ARENA.slice(0, open).map((r, i) => `Rank ${ROMAN[i + 1]} — ${r.name} (Lv ${r.lv})${i < cleared ? ' ✓' : ''}`);
    const pick = await s.choice([...options, 'Not today'], { prompt: 'Dace fans out a hand of fight cards.', cancel: open });
    if (pick >= open) return s.say('Dace', 'The Gloam will remember you tomorrow. It always does.');
    return PG.bout(s, pick + 1);
  },

  async bout(s, rank) {
    const r = ARENA[rank - 1];
    await s.say('Dace', r.intro);
    s.heal();
    const result = await s.battle(r.troop, { loseOk: true });
    s.heal();
    if (result !== 'win') return s.say('Dace', ['And they\'re DOWN! Medics! Medics, the expensive ones!', 'Don\'t worry about it. Losing to a memory is the most natural thing in the world.']);
    const first = (s.state.vars.pg_arena || 0) < rank;
    if (!first) return s.say('Dace', 'A rematch, and a win! The crowd goes mild!');
    s.state.vars.pg_arena = rank;
    await s.say('Dace', r.win);
    await s.give(r.prize);
    if (rank === ARENA.length) {
      s.quest('pg_colosseum', null, null, 'done');
      s.journal('We fought ourselves in the Echo Colosseum — the versions of us the Gloam would have kept. We won. I don\'t know how to feel about that, but Wick made four coppers.');
    }
  },
};

// Hiding places in the festival square: inspect tiles, a centre for hot/cold, and where Lysa pops out.
export const HIDING_SPOTS = {
  red_stall: { tiles: [[7, 9]], at: [7, 9], pop: [7, 10], empty: 'Under the red stall: candied plums, a lost shoe. Nobody.' },
  blue_stall: { tiles: [[27, 9]], at: [27, 9], pop: [27, 10], empty: 'Behind the blue stall: a stack of paper kites. Nobody.' },
  yellow_stall: { tiles: [[9, 19]], at: [9, 19], pop: [9, 20], empty: 'Inside the yellow stall: a fortune-teller\'s cards, all blank. Nobody.' },
  barrels: { tiles: [[24, 18], [25, 18], [24, 19]], at: [24, 18], pop: [25, 19], empty: 'Behind the barrels: cider, by the smell. Nobody.' },
  crates: { tiles: [[4, 13], [5, 13]], at: [4, 13], pop: [4, 14], empty: 'Behind the crates: bunting, unpacked. Nobody.' },
  hay: { tiles: [[29, 15]], at: [29, 15], pop: [29, 16], empty: 'In the hay: a pony\'s hat. No pony. Nobody.' },
  well: { tiles: [[13, 20]], at: [13, 20], pop: [13, 21], empty: 'Down the well: your own face, and stars. Nobody.' },
  fountain: { tiles: [[17, 13]], at: [17, 13], pop: [17, 14], empty: 'Around the fountain: coins, a hundred wishes. Nobody.' },
  cauldron: { tiles: [[21, 9]], at: [21, 9], pop: [21, 10], empty: 'In the sweet-seller\'s cauldron: cold toffee. Nobody.' },
};

export const ARENA = [
  { name: 'The Tide Remembers', troop: 'pg_arena_1', lv: 72, prize: 'regen_bangle',
    intro: 'Rank One! From the black rocks of Lanternfall, the very first nightmare: the Drowned Hound — as you remember it!', win: 'The Hound is down! Prize: one Mossy Bangle. It grows on you. Literally.' },
  { name: 'Strait Terror', troop: 'pg_arena_2', lv: 75, prize: 'scholars_monocle',
    intro: 'Rank Two! It guarded the strait! It ate a boat! Two boats, the way sailors tell it: BRINEFANG!', win: 'Serpent subdued! Take this monocle. Makes you learn faster. Makes you look smarter. Only one of those is guaranteed.' },
  { name: 'Highway Royalty', troop: 'pg_arena_3', lv: 78, prize: 'thiefs_glove',
    intro: 'Rank Three! Eight feet tall! Undefeated! Never lied once! RED TAM, as told by Red Tam!', win: 'Legend deflated! The Thief\'s Glove is yours. Tam left it here. He says.' },
  { name: 'Undercroft Hymnal', troop: 'pg_arena_4', lv: 81, prize: 'crest_brooch',
    intro: 'Rank Four! She sings! She saves! She does NOT take requests! SISTER MERCY and her poor, poor beast!', win: 'The hymn is over! A Crest Brooch for the choir — learn your Crests twice as fast.' },
  { name: 'Glass and Sand', troop: 'pg_arena_5', lv: 84, prize: 'haste_anklet',
    intro: 'Rank Five! From under the Sunscar dunes — when the sand hums, RUN! The GLASSWYRM!', win: 'Wyrm wrangled! Quicksilver Anklet — start every fight already running.' },
  { name: 'The Hollow Knight', troop: 'pg_arena_6', lv: 87, prize: 'ember_heart',
    intro: 'Rank Six! Black armour! Hollow mask! THE PENITENT! ...Is it me, or is it colder in here?', win: 'The knight kneels for good! Ember Heart — burns brighter, faster.' },
  { name: 'Lord-Commander', troop: 'pg_arena_7', lv: 90, prize: 'champions_belt',
    intro: 'Rank Seven! Head of the Dawnguard! Sword of the Hierophant! The man himself: GARRICK THORNE!', win: 'The Lord-Commander falls! The Champion\'s Belt — you\'ve earned the buckle!' },
  { name: 'Remnant Chorus', troop: 'pg_arena_8', lv: 93, prize: 'archmage_ring',
    intro: 'Rank Eight! Three Keepers who became something else, singing in harmony! The REMNANT CHORUS!', win: 'The chorus is silenced! An Archmage Ring, for the one doing the thinking.' },
  { name: 'High Noon', troop: 'pg_arena_9', lv: 96, prize: 'phoenix_charm',
    intro: 'Rank Nine! The sun stood still for him! Shield your eyes! THE NOON KING!', win: 'Noon is OVER! Phoenix Charm — get up again, once, every fight.' },
  { name: 'Mirror Match', troop: 'pg_arena_10', lv: 99, prize: 'pg_echo_laurel',
    intro: 'The final rank. The Gloam remembers everyone who ever fought here... including YOU. As you were. At your worst. HOLLOW!', win: 'You beat yourselves! The crowd is screaming! I am screaming! The Echo Laurel — CHAMPIONS!' },
];
