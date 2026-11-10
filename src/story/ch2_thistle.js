// CHAPTER 2 — "The Wider World", part three: Thistledown, the Crestless Sage,
// the Hollow Harvest, Red Tam's quarry, and the road to the City of Bells.

import { spawnParty, clearParty, pc } from './ch2_common.js';

/** @type {import('../types/data').StoryScripts} */
export const THISTLE = {
  // ------------------------------------------------------------------ Arrival
  async arrive(s) {
    if (s.flag('c2_td_arrived')) return;
    s.setFlag('c2_td_arrived');
    s.music('town');
    spawnParty(s, { ilse: [2, 17, 'right'], bram: [2, 19, 'right'], sable: [1, 18, 'right'] });
    s.place('player', 3, 18, 'right');
    s.spawn('reeve_a', 'c2_reeve', 12, 18, 'left');
    await s.wait(0.6);
    await s.say('Wren', 'Sunlight. Actual sunlight! And fields, and cows, and— are those _beehives_?');
    await s.say('Sable', 'The trees here are quiet.');
    await s.say('Ilse', 'Ordinary trees. I could kiss one.');
    await s.say('Bram', 'Please don\'t. They\'ll start talking again.');
    await s.move('reeve_a', [[5, 18]], 2.6);
    await s.say('Reeve Alder', 'Travelers! From the _west_? Through the wold? Nobody comes through the wold. The wold doesn\'t let them.');
    await s.say('Wren', 'It let us. Eventually. We had a talk with it.');
    await s.say('Reeve Alder', 'Well! Well. Welcome to Thistledown. Wilma Alder, Reeve. You\'ve picked a fine week to visit, if you enjoy being robbed.');
    await s.say('Reeve Alder', 'Red Tam and his gang have shut the Aurenne road. Nothing in, nothing out. They\'re squatting in the old quarry north of the east fields and taxing anything with wheels.');
    await s.say('Bram', 'We\'re bound for Aurenne.');
    await s.say('Reeve Alder', 'So was the miller\'s flour. So were Tobble\'s honey-jars. Tam has all of it now.');
    await s.wait(0.5);
    await s.say('Reeve Alder', '...Is that girl all right? She\'s staring at her own hand.');
    await s.say('Sable', 'It is cold again. My Crest.');
    await s.say('Reeve Alder', 'A Crest? At her age? Oh, you\'ll want Old Bethan for that. The cottage up the hill, past the beehives. She knows Crests better than any priest.');
    await s.say('Reeve Alder', 'The Choir threw her out for it, mind. Called her a heretic. _We_ call her "the Crestless Sage", on account of she\'s got about six of the things.');
    await s.say('Ilse', 'Six Crests. That isn\'t possible.');
    await s.say('Reeve Alder', 'I\'d not say that to her face, dear. She boxes.');
    s.remove('reeve_a');
    clearParty(s);
    s.objective('Visit the Crestless Sage in the cottage on the hill, north-east of Thistledown\'s green.');
    s.journal('Thistledown: sunlight, cows, beehives, and a bandit called Red Tam squatting on the Aurenne road. There\'s a woman here they call the Crestless Sage — the Reeve says she has six Crests.');
  },

  // ------------------------------------------------------------------ The Crestless Sage
  async sage(s) {
    if (s.flag('c2_sage_done')) return THISTLE.sageAgain(s);
    s.music('lanternfall');
    spawnParty(s, { ilse: [3, 5, 'up'], bram: [5, 6, 'up'], sable: [4, 4, 'up'] });
    s.place('player', 5, 4, 'up');
    await s.say('Bethan', 'Door was open, so you came in. That\'s either brave or rude. Sit. Both is fine.');
    await s.say('Wren', 'Are you— the Reeve said you\'re the Crestless Sage?');
    await s.say('Bethan', 'The Choir called me that. "The Crestless." Meant it as an insult, the dear things. Name\'s Bethan.');
    await s.say('Bethan', 'Crestless. Ha.');
    await s.narrate('She holds out her hands. Across the backs of them, faded and overlapping like the rings a cup leaves on a table: five Crests.');
    await s.say('Ilse', 'That— that\'s not possible. One Crest, one life.');
    await s.say('Bethan', 'Mender at sixteen. Arcanist at twenty-two, when I got bored of bandages. Ranger at thirty. Cantor at forty, to annoy a bishop.');
    await s.say('Bethan', 'And Pugilist at sixty-one, because a man in Aurenne told me I was too old to learn anything.');
    await s.say('Bram', 'Pugilist. At sixty-one.');
    await s.say('Bethan', 'He was wrong. I showed him how wrong. Twice.');
    await s.say('Wren', 'But _how_?');
    await s.say('Bethan', 'The Lantern doesn\'t _give_ you a Crest, girl. It _finds_ one. It looks into you and picks out the loudest thing — whatever\'s ready. That\'s all a Kindling is. A first draft.');
    await s.say('Bethan', '"One Crest, one life" is a lie. A comfortable one. It keeps farmers farming and soldiers soldiering, and nobody asking awkward questions in the Cathedral.');
    await s.say('Ilse', '_(quietly)_ The light knew I\'d be a Mender. I always knew I would be.');
    await s.say('Bethan', 'Course you did, herb-girl. That\'s your loudest thing. Doesn\'t mean it\'s your _only_ thing.');
    await s.wait(0.6);
    await s.say('Bethan', 'And you. Come here, child. Give me that hand.');
    await s.move(pc('sable'), [[6, 4]], 1.6);
    await s.wait(1.0);
    await s.say('Bethan', '...Gloamweaver.', { speed: 0.6 });
    await s.say('Bethan', 'Sixty years I\'ve been reading Crests. I\'ve never seen this one. Never read of it, neither — and I\'ve read everything the Choir ever tried to burn.');
    await s.say('Sable', 'Is it bad?');
    await s.say('Bethan', 'It\'s _yours_. That\'s all a Crest ever is. ...Cold, though. Like a hand that\'s been in the sea.');
    await s.say('Bethan', 'Whatever made this made it carefully. Mind that.');
    await s.wait(0.6);
    await s.say('Bethan', 'Right. Lesson. Do you want to learn to braid your Crests, or not?');
    await s.say('Wren', 'Yes!');
    await s.say('Ilse', 'Is it legal?');
    await s.say('Bethan', 'No.');
    await s.say('Ilse', '...Yes. Fine. Yes.');
    await s.say('Bethan', 'Then show me what you\'ve got. Outside. I\'ll go easy.');
    await s.say('Bram', 'On us?');
    await s.say('Bethan', 'On my hip.');
    clearParty(s);
    const r = await s.battle('boss_c2_bethan', { bg: 'fields', music: 'battle', loseOk: true });
    s.heal();
    s.music('lanternfall');
    spawnParty(s, { ilse: [3, 5, 'up'], bram: [5, 6, 'up'], sable: [4, 4, 'up'] });
    s.place('player', 5, 4, 'up');
    if (r === 'win') await s.say('Bethan', 'Ha! Not bad. Not bad at all. You hit like a Dawnguard squire. Which one of you\'s the Dawnguard squire? ...Ah. That explains a great deal.');
    else await s.say('Bethan', 'Up you get. No shame losing to an old woman. I\'ve had sixty years\' more practice at being difficult.');
    await s.say('Bethan', 'Did you watch? Every few breaths I was something different. Mender. Arcanist. Pugilist. Same old woman. Different _tools_.');
    await s.say('Bethan', 'Now hold out your hands. All of you. No, the Dawnguard boy too. Don\'t sulk.');
    await s.narrate(['She presses her thumb to each Crest in turn and hums a note so low you feel it in your teeth.', 'Your Crest grows warm. Then, for an instant, it feels like a door you never noticed — standing open.']);
    s.setFlag('crestArtLearned');
    s.setFlag('c2_sage_done');
    s.sfx('revive');
    await s.system('The art of the *Braided Calling* is learned! Crests can now be changed freely, and advanced *Braided* Crests can be earned.');
    await s.say('Bethan', 'Here\'s how it works. I\'ll say it once, because I\'m old and you\'re young and one of us has to save breath.');
    await s.say('Bethan', 'Your *Primary* Crest is what you are today. It shapes your body — strength, speed, how much light can pour through you — and which weapons sit right in your hand.');
    await s.say('Bethan', 'Your *Secondary* Crest is what you\'re learning on the side. You can use its Arts in a fight, but it won\'t change your bones.');
    await s.say('Bethan', 'Every Crest grows on its own as you fight with it. Each rank teaches you an Art — or a *Support*. A habit. A knack.');
    await s.say('Bethan', 'And here\'s the bit the Choir hates: a Support you\'ve learned is yours forever. Learn to counter as a Pugilist and you\'ll still counter as a Mender. Your *Support Points* decide how many knacks you can carry.');
    await s.say('Bethan', 'Raise two Crests to rank five and they\'ll braid into something new. I won\'t spoil it. Experiment.');
    await s.system('Open the menu: *Crests* to set Primary and Secondary Crests; *Supports* to equip learned passives. Braided (Tier II) Crests need rank 5 in two Crests.');
    await s.say('Bethan', 'And a gift. Cantor — the singer\'s Crest. Songs that steady the heart. I learned it at forty to annoy that bishop. It\'ll suit at least one of you.');
    await s.learnCrest('cantor');
    await s.say('Bethan', 'Pedrick at the trading post sells Crest Stones — bits of old Lantern-glass that remember a calling. Dear. Worth it.');
    await s.wait(0.6);
    await s.say('Wren', 'Bethan... why did the Choir really throw you out?');
    await s.wait(1.0);
    await s.say('Bethan', 'I taught a boy, once. In Aurenne. A Keeper\'s son. Clever, sad thing — he\'d lost someone young, and couldn\'t bear to be helpless ever again.');
    await s.say('Bethan', 'He learned every Crest I could give him, and wanted more. The Choir said I\'d made a monster. I said I\'d made a boy who could _do_ things.');
    await s.say('Bethan', '...I\'ve wondered since which of us was right.');
    await s.emote(pc('sable'), '…');
    await s.say('Wren', 'What happened to him?');
    await s.say('Bethan', 'He grew up. That\'s what happens to boys. Mostly.');
    await s.wait(0.6);
    await s.say('Bethan', 'Now. You\'ll want the Aurenne road, and that fool Tam\'s sitting on it. He used to steal my apples when he was eight. He was bad at it then, too.');
    await s.say('Bethan', 'His lads watch the quarry track. But there\'s an herb path behind the hedge at the far east end of the fields — up the hill to the quarry\'s back door. I\'ve used it forty years.');
    await s.say('Bethan', 'Tam doesn\'t know it\'s there, because Tam has never once in his life picked an herb. I\'ll have Corporal Fen pull the hedge back for you.');
    clearParty(s);
    s.objective('Take the Sage\'s herb path (behind the hedge at the east end of the fields) up to Red Tam\'s quarry.');
    s.journal('Bethan, the Crestless Sage, has FIVE Crests. She says "one Crest, one life" is a lie, and taught us to braid our Crests. She once taught a Keeper\'s son who lost someone young. She wonders if she made a monster.');
  },

  async sageAgain(s) {
    if (s.flag('c2_tam_done')) {
      return s.say('Bethan', ['Told you Tam was bad at it.', 'Go on to Aurenne. And when somebody in a fine robe tells you what you are — you remember an old woman with five Crests and a bad hip.']);
    }
    await s.say('Bethan', ['Back already? Pedrick sells Crest Stones. Try a few on. Wear them like hats.', 'Herb path\'s behind the hedge at the east end of the fields. Mind Tam\'s archers.']);
    if (await s.confirm('Ask Bethan for another sparring match?', 'Spar', 'Not now')) {
      const r = await s.battle('boss_c2_bethan', { bg: 'fields', music: 'battle', loseOk: true });
      s.heal();
      await s.say('Bethan', r === 'win' ? 'Ow. Good. Again tomorrow.' : 'Better. Not good. Better.');
    }
  },

  // ------------------------------------------------------------------ The Hollow Harvest (scarecrows)
  async farmer(s) {
    if (s.flag('c2_scare_done')) {
      return s.say('Farmer Dunstan', ['Fields are quiet. Crows are back. I\'ve never been so glad to see crows.', 'Stuffing \'em with honest straw from now on. Honest straw never walked anywhere.']);
    }
    const n = s.vars.c2_scare || 0;
    if (s.flag('c2_scare_quest') && n >= 3) return THISTLE.farmerReward(s);
    if (s.flag('c2_scare_quest')) return s.say('Farmer Dunstan', [`That\'s ${n} of three down. The big one in the north-east field — Old Strawman — he was my granddad\'s. Leave him for last.`]);
    await s.say('Farmer Dunstan', 'Don\'t go in the fields. I mean it. Not the north field, not the south field, not the field I haven\'t named yet.');
    await s.say('Wren', 'Why not?');
    await s.say('Farmer Dunstan', 'Scarecrows. _My_ scarecrows. They\'ve started... walking. At night, first. Now in the day, which is worse, because I can see them doing it.');
    await s.say('Farmer Dunstan', 'Bought new stuffing for \'em off some lads on the road. Two silver a sack. Purple, it was. Glittery. Swore it\'d keep the crows off for good.');
    await s.say('Ilse', 'Purple.');
    await s.say('Wren', 'Like the crystal in the tide caves. The cold one.');
    await s.say('Farmer Dunstan', 'Three of \'em out there. If you\'re the fighting sort — and you\'ve the look — knock \'em down for me. Leave Old Strawman for last; he was my granddad\'s, and he\'s _big_.');
    s.setFlag('c2_scare_quest');
    s.quest('c2_scarecrows', 'The Hollow Harvest', 'Farmer Dunstan\'s scarecrows have come alive after he stuffed them with cheap purple "stuffing". Put down the three in the east fields — Old Strawman last.');
  },

  async scarecrow(s, id, n) {
    if (!s.flag('c2_scare_quest')) {
      return s.narrate('A scarecrow in a battered hat. Its button eyes seem to follow you. That\'s just a thing people say about scarecrows.\n...Isn\'t it?');
    }
    const done = s.vars.c2_scare || 0;
    if (n === 3 && done < 2) return s.narrate('This one is bigger. Older. Its stitched head is turned toward the other scarecrows, as if it is waiting to see what happens to them.');
    await s.narrate(n === 3 ? 'Old Strawman\'s head turns. Its friends are gone, and it has noticed.' : 'The scarecrow\'s head turns. Slowly. Its stitched mouth splits into a grin full of violet dust.');
    const r = await s.battle(n === 3 ? 'boss_c2_strawman' : 'td_scare', { bg: 'fields', music: n === 3 ? 'boss' : 'battle' });
    if (r !== 'win') return;
    s.remove(id);
    s.vars.c2_scare = done + 1;
    s.setFlag(`c2_scare_${n}`);
    if (n === 3) await s.say('Sable', 'There was a voice in the straw. Very small. It said "shoo." Over and over. "Shoo."');
    if (s.vars.c2_scare >= 3) s.quest('c2_scarecrows', null, 'All three scarecrows are down. Tell Farmer Dunstan his fields are safe.'); // side quest, not the main objective
  },

  async farmerReward(s) {
    s.setFlag('c2_scare_done');
    await s.say('Farmer Dunstan', 'All three? Even Old Strawman? ...Granddad would\'ve hated that. He\'d also have hated a walking scarecrow, so. Swings and roundabouts.');
    await s.say('Farmer Dunstan', 'Here. Take one of the horseshoes off the door. I\'ve three. Clearly they weren\'t working.');
    await s.give('c2_pell_horseshoe');
    await s.give('vigor_seed');
    await s.say('Ilse', 'Dunstan — the lads who sold you that stuffing. Where did they say it came from?');
    await s.say('Farmer Dunstan', 'Didn\'t say. Didn\'t have to. They came down the quarry track with it. Tam\'s lot, the thieving—');
    await s.say('Wren', 'So whatever\'s in that quarry, it\'s the same thing that was in the tide caves.');
    s.quest('c2_scarecrows', null, null, 'done');
    s.journal('The scarecrows in Thistledown were stuffed with purple dust — like the crystal in the tide caves. Tam\'s gang sold it. Whatever is in that quarry, it\'s the same thing.');
  },

  // ------------------------------------------------------------------ The quarry
  async picket(s) {
    await s.say('Bandit', 'Oi! Quarry\'s closed. Toll\'s your boots, your purse and your dignity.');
    await s.say('Ilse', 'And the archer on the ridge says the rest. Back, Wren.');
    await s.step('player', 0, 1);
    if (!s.flag('c2_sage_done')) await s.say('Wren', 'Not this way. Somebody in Thistledown must know another way up.');
    else await s.say('Wren', 'Right. Bethan\'s herb path. Behind the hedge, east end of the fields.');
  },

  async hedge(s) {
    if (s.flag('c2_sage_done')) return null;
    return s.narrate('A dense hawthorn hedge. Someone has woven it tight here, on purpose. You can smell rosemary and mint behind it.');
  },

  async yard(s) {
    if (s.flag('c2_yard_fought')) return;
    s.setFlag('c2_yard_fought');
    await s.say('Nib', '—I\'m _telling_ you, it\'s "the red sky weeps."');
    await s.say('Gorse', '"Weeps" was last week. This week it\'s "the red sky sleeps."');
    await s.say('Nib', 'Why\'d he change it?');
    await s.say('Gorse', '\'Cause you told your mum, Nib.');
    await s.say('Nib', 'She _asked_!');
    s.setFlag('c2_password_known');
    await s.wait(0.6);
    s.face('nib', 'player');
    s.face('gorse', 'player');
    await s.say('Gorse', '...Oi. Who are you lot?');
    await s.say('Bram', 'Your mum sent us.');
    const r = await s.battle('gw_bandits', { bg: 'road' });
    if (r !== 'win') return;
    s.remove('nib');
    s.remove('gorse');
    await s.say('Ilse', '"The red sky sleeps." Remember that. Or I will. I\'ll remember it for you.');
  },

  async gate(s) {
    await s.say('Big Hollis', 'Halt. Password.');
    if (s.flag('c2_password_known')) await s.think('Wren', 'Nib and Gorse were arguing about this. Sleeps, not weeps.');
    const pick = await s.choice(['"The red sky weeps."', '"The red sky sleeps."', '"Tam is a genius."']);
    if (pick === 1 || pick === 2) {
      if (pick === 1) await s.say('Big Hollis', 'Right you are. Go on, then. ...Here, I don\'t know your faces—');
      else await s.say('Big Hollis', '...He _is_, though. Nobody ever says it. Go on through. Wait, I don\'t know your faces—');
      await s.say('Wren', 'We\'re new.');
      await s.say('Big Hollis', 'Oh! Welcome! Mind the archers, they\'re twitchy. Hearth\'s warm up top.');
    } else {
      await s.say('Big Hollis', 'WRONG. That\'s _last_ week\'s. Lads!');
      const r = await s.battle('c2_gate_crew', { bg: 'road' });
      if (r !== 'win') return;
    }
    s.setFlag('c2_gate_open');
    s.remove('hollis');
    s.remove('hollis2');
  },

  async tam(s) {
    if (s.flag('c2_tam_done')) return;
    s.stopMusic(1);
    spawnParty(s, { ilse: [27, 6, 'left'], bram: [28, 5, 'left'], sable: [29, 6, 'left'] });
    s.place('player', 28, 7, 'left');
    await s.pan(23, 5, 1.0);
    await s.say('Red Tam', 'Well, well, _well_. Somebody got past Hollis. Somebody always gets past Hollis.');
    s.music('tension');
    await s.move('red_tam', [[25, 5]], 2);
    await s.say('Red Tam', 'Let\'s see. A Dawnguard squire. A hedge-witch. A redheaded fishwife with a sword she don\'t know how to hold. And—');
    await s.wait(0.8);
    await s.say('Red Tam', '—and _there_ she is. Black hair. Pale as milk.', { speed: 0.8 });
    await s.say('Red Tam', 'Sweetheart, you are worth more silver than this whole valley.');
    await s.say('Wren', 'She\'s not for sale.');
    await s.say('Red Tam', 'Everything\'s for sale, girl. That\'s the first thing the road teaches you. The second thing is: duck.');
    await s.say('Bram', 'You\'ll have to go through me.');
    await s.say('Red Tam', 'That\'s the plan, big lad. That\'s _exactly_ the plan.');
    await s.follow(0.4);
    clearParty(s);
    const r = await s.battle('boss_red_tam', { bg: 'road' });
    if (r !== 'win') return;
    s.setFlag('c2_tam_done');
    await THISTLE.tamAfter(s);
  },

  async tamAfter(s) {
    s.remove('tam_b1');
    s.remove('tam_b2');
    s.music('tension');
    spawnParty(s, { ilse: [27, 6, 'left'], bram: [26, 4, 'left'], sable: [28, 5, 'left'] });
    s.place('player', 26, 5, 'left');
    s.place('red_tam', 24, 5, 'right');
    await s.say('Red Tam', 'Alright! Alright. Yield. I yield. Mercy. Uncle. All the good words.');
    await s.say('Wren', 'Who\'s buying? You said she was worth silver. Whose silver?');
    await s.say('Red Tam', '...Dawnguard. Black trim on the shoulders. Lieutenant, name of Harrow.');
    await s.say('Red Tam', 'Rode up the Aurenne road a fortnight back. Paid in good Aurenne silver for my lads to watch the road for a black-haired girl. Sixteen-ish. Pale.');
    await s.wait(0.8);
    await s.say('Ilse', 'A fortnight ago? Sable washed up on Lanternfall barely a _week_ ago.');
    await s.say('Red Tam', 'Then somebody knew she was coming before she did, didn\'t they?');
    await s.say('Red Tam', 'Take her alive, he said. Not a bruise on her. "Unharmed." Said it twice. Made me swear on my mother. I haven\'t _got_ a mother, but I swore.');
    await s.narrate('Tam fishes a folded paper out of his vest and flicks it at Bram. The wax seal is black.');
    await s.give('c2_thorne_writ');
    await s.say('Bram', '"The girl is to be detained and conveyed to the Cathedral of Dawn. Unharmed. By order of the Lord-Commander, Garrick Thorne."', { speed: 0.8 });
    await s.say('Bram', 'That\'s his seal. His own seal. And — the _Cathedral_. Not the barracks.');
    await s.say('Wren', 'The Cathedral\'s where we\'re going anyway. Cassian said the Choir\'s archives could help her.');
    await s.say('Ilse', 'Wren...');
    await s.say('Wren', 'Don\'t. He\'s the one who _sent_ us. If Thorne wants her too, it\'s because— I don\'t know. Because something\'s gone wrong. Because someone\'s lying to him.');
    await s.say('Ilse', 'Mags was right. Thorne doesn\'t say "unharmed" about anyone. So someone told him to.');
    await s.say('Bram', '...Someone he answers to. Yes.');
    await s.say('Wren', 'Then we ask Cassian who. When we get there. Okay?');
    await s.wait(0.8);
    await s.say('Ilse', '...Okay.');
    await s.say('Sable', 'Wren said "okay". She says it when she is not.');
    await s.say('Wren', 'SABLE.');
    await s.say('Red Tam', 'Touching. Truly. Can I go now?');
    s.spawn('fen_q', 'c2_fen', 28, 9, 'up');
    await s.move('fen_q', [[28, 7]], 3);
    await s.say('Corporal Fen', 'Nobody move! Thistledown militia! We\'ve got pitchforks and a— oh. You\'ve done it already.');
    await s.say('Corporal Fen', 'Red Tam. You\'re under arrest for robbery, banditry, extortion and those apples in the spring of eighty-nine.');
    await s.say('Red Tam', 'Those apples were _sour_, Fen!');
    await s.move('red_tam', [[27, 5], [28, 6]], 2);
    s.face('red_tam', 'left');
    await s.say('Red Tam', 'Hey. Redhead. A girl worth more than a valley. Ask yourself why. And ask yourself who\'s _really_ paying.');
    await s.fadeOut(1.0);
    s.remove('red_tam');
    s.remove('fen_q');
    clearParty(s);
    s.objective('Return to Thistledown.', true);
    s.journal('Red Tam was paid by Lieutenant Harrow to catch Sable — a fortnight ago, before she ever washed up on Lanternfall. The writ says "unharmed", "to the Cathedral of Dawn", signed by Garrick Thorne. Somebody told Thorne to say unharmed. It isn\'t Cassian. It can\'t be.');
    await s.teleport('thistledown', 24, 18, 'up');
  },

  /** Back in Thistledown at dusk: the road is open. */
  async celebration(s) {
    if (!s.flag('c2_tam_done') || s.flag('c2_td_party')) return;
    s.setFlag('c2_td_party');
    s.music('town');
    spawnParty(s, { ilse: [23, 19, 'up'], bram: [25, 19, 'up'], sable: [24, 19, 'up'] });
    s.spawn('reeve_p', 'c2_reeve', 24, 15, 'down');
    s.spawn('sage_p', 'sage', 26, 15, 'down');
    await s.wait(0.6);
    await s.say('Reeve Alder', 'The road\'s open! Carts are moving! Tobble\'s bees have stopped sulking! Tam\'s in the root cellar with a very stern goose guarding the door!');
    await s.say('Reeve Alder', 'Thistledown doesn\'t have much, but what it has, it shares. Take this. All of it. Don\'t argue, I\'m the Reeve.');
    await s.gold(600);
    await s.give('hi_tonic', 3);
    await s.say('Bethan', 'Told you he was bad at it.');
    s.face('sage_p', pc('sable'));
    await s.say('Bethan', 'Gloamweaver. Whatever\'s waiting for you in Aurenne — you\'re more than one thing. Remember it, the day somebody tells you otherwise.');
    await s.say('Sable', 'I will remember.');
    await s.say('Bethan', 'Good girl. And eat something. You\'re all elbows.');
    await s.say('Wren', 'That\'s what my mom says. ..."Eat something green once a week."');
    await s.say('Bethan', 'Your mother\'s a wise woman.');
    await s.say('Wren', '...Yeah. She is. Don\'t tell her I said so.');
    s.remove('reeve_p');
    s.remove('sage_p');
    clearParty(s);
    s.objective('The Aurenne road is open. When you\'re ready, leave by the far east end of the fields.');
  },

  // ------------------------------------------------------------------ The road to the City of Bells
  async finale(s) {
    if (s.flag('c2_done')) return;
    if (!(await s.confirm('Leave Thistledown behind and take the road to Aurenne?', 'Onward to Aurenne', 'Not yet'))) {
      await s.step('player', -1, 0);
      return;
    }
    s.setFlag('c2_done');
    s.music('field');
    spawnParty(s, { ilse: [52, 14, 'right'], bram: [52, 16, 'right'], sable: [53, 16, 'right'] });
    s.place('player', 53, 15, 'right');
    await s.wait(0.5);
    await s.say('Wren', 'Aurenne. Two days east. Then the Cathedral. Then answers.');
    await s.say('Ilse', 'Then answers we might not like.');
    await s.say('Bram', 'Then _bread_. I was promised there\'d be bread in the capital. Proper bread. With seeds in.');
    await s.say('Ilse', 'Who promised you that?');
    await s.say('Bram', 'Me. Just now. I\'m holding myself to it.');
    s.stopMusic(2);
    await s.wait(1.0);
    s.sfx('holy');
    await s.narrate('Far off — so faint it might be imagined — the evening wind carries the sound of bells.');
    s.face(pc('sable'), 'right');
    await s.wait(1.0);
    await s.say('Sable', '...I know that sound.');
    await s.say('Wren', 'You\'ve been to Aurenne?');
    await s.say('Sable', 'No.', { speed: 0.8 });
    await s.wait(0.8);
    await s.say('Sable', '...Yes.', { speed: 0.7 });
    await s.wait(1.0);
    await s.say('Sable', 'I do not know.', { speed: 0.7 });
    s.journal('We left Thistledown for Aurenne at dusk. When the wind brought the sound of the city\'s bells, Sable said she knew it. Then she said she didn\'t. Then she said she didn\'t know.');
    await s.fadeOut(1.5);
    clearParty(s);
    await s.chapter(3, 'City of Bells');
    s.objective('Reach the Cathedral of Dawn in Aurenne and deliver Cassian\'s letter.');
    await s.teleport('aurenne', 20, 38, 'up');
  },
};
