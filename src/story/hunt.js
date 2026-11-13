// THE HUNTER'S LEDGER — Greer Thackery, bestiarist of the Aurenne Collegium (data/hunt.js
// holds the marks; content/hunt.js puts her and them on the maps).
//
// Chapter 3: she nearly walks into the party on Aurenne's canal bridge, reads where
// they've been off their boots, and gives them her spare Compendium (the menu's book
// of creatures) and five marks to hunt. She pays for marks felled and for new kinds of
// creature written into the book. After the Sundering she turns up in Keelhaven with
// the book under her arm and five new marks, and any old mark still alive is out
// there again too.

import { MARKS, MARK_IDS, RANKS, KIND_MILESTONES, felled, paid, posted, marksFelled, markAt } from '../data/hunt.js';
import { kindsDefeated } from '../data/monsterInfo.js';

const QUEST = 'hunt';
const TITLE = 'The Hunter\'s Ledger';
const DESC_I = 'Greer Thackery, the Collegium\'s bestiarist, has posted five marks: rare beasts of the old roads. Hunt them, then tell her by the canal bridge in Aurenne. She also pays for new kinds of creature in the Compendium.';
const DESC_II = 'Greer Thackery survived the Sundering and keeps the Ledger in Keelhaven now. Five new marks are posted, and any old mark still alive came through the Sundering too. Hunt them all, then tell her.';

/** The quest's steps, before and after the Sundering (tests/side_quests.test.js checks their markers). */
export const HUNT_STEPS = [DESC_I, DESC_II];

const inParty = (s, id) => s.state.party.includes(id);

/** The Compendium, the quest, the first five marks. */
async function giveBook(s) {
  s.setFlag('compendium');
  s.setFlag('hunt_met');
  if (!s.has('hm_compendium')) await s.give('hm_compendium');
  await s.tutorial('compendium');
  s.quest(QUEST, TITLE, DESC_I);
  s.journal('On a bridge in Aurenne, Greer Thackery the bestiarist gave us her spare Compendium, and five marks to hunt for the Collegium.');
}

export const HUNT = {
  /** Aurenne's canal bridge: Greer, nose in a book. */
  async meet(s) {
    if (s.flag('hunt_met')) return;
    s.spawn('greer_m', 'greer', 17, 38, 'right');
    await s.narrate('A woman in a green field coat comes across the bridge reading an enormous book, and very nearly walks into Wren.');
    await s.say('Greer', [
      'Oh! Sorry, sorry. I was in the middle of a moth.',
      '...Wait. Salt on your boots. Crab shell on your sleeve. And that\'s a Wold wolf\'s bite on your shield, if I\'m any judge. You came up the coast road.',
    ]);
    await s.say('Wren', 'Who are you?');
    await s.say('Greer', [
      'Greer Thackery. Bestiarist to the Collegium, for all the good it does me. I\'m writing down every creature the Gloam has touched, before it touches any more.',
      'Three hundred and some, so far. The ones that eat bestiarists won\'t sit still to be counted.',
    ]);
    if (inParty(s, 'bram')) await s.say('Bram', 'That sounds like a lot of creatures.');
    await s.say('Greer', [
      'You\'ve fought them, though. Up close. Here: my spare copy. Keep it, and keep writing in it. Everything you face goes in the book.',
      'And if you\'ve got the stomach for more than notes: the Collegium posts marks. Beasts too big, too old or too strange to be left alone. Five on the board just now.',
      'Fell one and come and tell me. I\'ll be by this bridge, or near it. The Collegium pays, and so do I.',
    ]);
    await giveBook(s);
    await HUNT.ledger(s, 1);
    s.remove('greer_m');
    s.field?.refreshNpcs?.();
  },

  /** Talking to Greer: the book if she hasn't given it, the Keelhaven reunion, pay, then the Ledger. */
  async greer(s) {
    const st = s.state;
    if (!s.flag('hunt_met')) {
      // Old saves past the bridge, or a party that first finds her in Keelhaven.
      await s.say('Greer', [
        'You there. You look like people who have fought a great many things. Greer Thackery, bestiarist. I\'m writing every one of them down.',
        'Here, take my spare copy and keep writing in it. And the Collegium posts marks, if you want work: beasts too big to leave alone.',
      ]);
      await giveBook(s);
    }
    if (s.flag('sundered') && !s.flag('hunt_keelhaven')) {
      s.setFlag('hunt_keelhaven');
      await s.say('Greer', [
        'You\'re alive. Good. So am I, if you can believe it. I was on the Collegium roof when the sky broke.',
        'I held on to the book. Priorities.',
        'Everything out there is new now, and everything is hungry. The board is open again: five new marks.',
        'And the old ones you didn\'t fell came through it all, the stubborn things. I\'ve heard of them, here and there.',
      ]);
      s.quest(QUEST, TITLE, DESC_II);
      s.journal('Greer Thackery lived through the Sundering, book and all. In Keelhaven she posted five new marks, and the old ones still alive are out there again.');
      await HUNT.ledger(s, 2);
    }
    const any = await HUNT.report(s);
    if (st.vars.quests?.[QUEST]?.status === 'done') {
      if (!any) await s.say('Greer', 'The Ledger is finished, Huntmaster. I\'m only writing in the margins now. Come and tell me if you find anything with more teeth than it should have.');
      return;
    }
    if (any) return;
    const pick = await s.choice(['The Ledger', 'The Compendium', 'Nothing'], { prompt: 'Greer looks up from her book.', cancel: 2 });
    if (pick === 0) return HUNT.ledger(s);
    if (pick === 1) {
      const n = kindsDefeated(st);
      const next = KIND_MILESTONES.find((k) => !s.flag(k.flag));
      return s.say('Greer', [
        `${n} kinds felled and written down. ${next ? `Bring the book to ${next.n} and I'll have something for you.` : 'More than I ever managed on my own.'}`,
        'Strike a weakness and the book remembers it. Watch a beast\'s moves and they go in too. Fell a few of a kind and you\'ll learn how it thinks.',
      ]);
    }
    return s.say('Greer', 'Mind the ones with too many eyes. That\'s general advice.');
  },

  /** Greer reads the board: what's open and where (act: only that act's new postings). */
  async ledger(s, act) {
    const open = MARK_IDS.filter((id) => posted(s.state, id) && !felled(s.state, id) && (!act || MARKS[id].act === act));
    const lines = open.map((id) => {
      const m = MARKS[id];
      const back = m.act === 1 && s.flag('sundered');
      return back ? `${m.name}: ${s.state.flags.hunt_keelhaven ? 'came through the Sundering. Someone saw it again out there.' : 'still out there, somewhere.'}` : m.rumour;
    });
    if (!lines.length) return s.say('Greer', 'Nothing open on the board just now. Give the world a minute. It will grow something.');
    return s.say('Greer', lines);
  },

  /** Pay for marks felled, titles earned and kinds recorded. Returns whether anything was paid. */
  async report(s) {
    const st = s.state;
    let any = false;
    for (const id of MARK_IDS) {
      if (!felled(st, id) || paid(st, id)) continue;
      any = true;
      const m = MARKS[id];
      s.setFlag(`hm_${id}_paid`);
      await s.say('Greer', `${m.name}? Truly? Tell me everything. ...Everything. Slower. Here, for the Collegium's thanks, and mine.`);
      await s.gold(m.reward.gold);
      for (const [item, n] of m.reward.items) await s.give(item, n);
    }
    const n = marksFelled(st);
    for (const r of RANKS) {
      if (n < r.n || s.flag(r.flag)) continue;
      any = true;
      s.setFlag(r.flag);
      await s.say('Greer', r.n === 10
        ? ['Ten. Every mark on the board, before the Sundering and after. Nobody has finished the Ledger. Nobody.', 'Take my horn. It was my teacher\'s, and his teacher\'s. You are the Huntmasters now.']
        : [`${n} marks. The Collegium would make you a ${r.title}, if there were still a Collegium. I'll make you one instead.`, 'Here. Every hunter should have something to show for it.']);
      for (const [item, k] of r.items) await s.give(item, k);
    }
    const kinds = kindsDefeated(st);
    for (const k of KIND_MILESTONES) {
      if (kinds < k.n || s.flag(k.flag)) continue;
      any = true;
      s.setFlag(k.flag);
      await s.say('Greer', `${k.n} kinds of creature in the book. ${k.n >= 150 ? 'I had to start a second volume.' : 'That\'s more than most hunters see in a lifetime.'} For the ink.`);
      for (const [item, c] of k.items) await s.give(item, c);
    }
    if (n === MARK_IDS.length && s.flag('hm_rank_3') && st.vars.quests?.[QUEST]?.status !== 'done') {
      s.quest(QUEST, null, null, 'done');
      s.journal('We hunted every mark on Greer Thackery\'s Ledger, before the Sundering and after. She gave us her teacher\'s horn.');
    }
    return any;
  },

  /** A mark in the field: look, then fight or leave it be. */
  async mark(s, id) {
    const m = MARKS[id];
    if (felled(s.state, id) || !markAt(s.state, id)) return;
    const back = m.act === 1 && s.flag('sundered');
    await s.tutorial('marks');
    await s.narrate(back ? `${m.approach} Scarred and thinner, but alive. It came through the Sundering like you did.` : m.approach);
    const pick = await s.choice(['Hunt it', 'Leave it be'], { prompt: `${m.name}, a mark on Greer's Ledger.`, cancel: 1 });
    if (pick !== 0) return;
    const r = await s.battle(`hm_${id}`, { loseOk: true });
    if (r !== 'win') {
      s.heal();
      return s.narrate(`You come to some way off, bruised but whole. ${m.name} is still there. It didn't follow.`);
    }
    s.setFlag(`hm_${id}`);
    s.remove(`mark_${id}`);
    await s.narrate(m.felled);
    s.journal(`We hunted ${m.name} in ${m.where}.`);
    const left = MARK_IDS.filter((k) => posted(s.state, k) && !felled(s.state, k)).length;
    await s.system(left ? `Mark felled. Tell Greer Thackery. (${left} still open on the Ledger.)` : 'Mark felled. Tell Greer Thackery.');
    return null;
  },
};
