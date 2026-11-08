// Chapter 11 — the seven Remnant dungeons (and their inner rooms).
import SG from './layouts/c11_saltglass.js';
import FH from './layouts/c11_frosthollow.js';
import MF from './layouts/c11_mirefen.js';
import TW from './layouts/c11_thornwood.js';
import SR from './layouts/c11_skyreach.js';
import GN from './layouts/c11_grand_nave.js';
import GG from './layouts/c11_grand_gallery.js';
import LF from './layouts/c11_lf_ruins.js';
import LH from './layouts/c11_lf_home.js';
import LL from './layouts/c11_lf_lantern.js';
import { gangplank } from '../../story/ch11.js';
import { REM, takeStar } from '../../story/ch11_remnants.js';

const at = (L, name) => ({ x: L.spots[name][0], y: L.spots[name][1] });
const chest = (L, prefix, spot, loot) => ({ id: `${prefix}_${spot}`, ...at(L, spot), ...loot });
const notTaken = (key) => (st) => !st.flags[`c11_shard_${key}`];
/** A Starfall Fragment set in a crystal: a blocker to look at, an inspect to take it. */
const star = (L, id) => ({
  blocker: { id: 'star', ...at(L, 'star'), prop: 'crystal' },
  inspect: { ...at(L, 'star'), hint: 'Starlight', cond: (st) => !st.flags[`c11_star_${id}`], run: (s) => takeStar(s, id) },
});
/** The Remnant waiting before its Lantern, and the trigger band that wakes it. */
const remnant = (key, name, look, x, y, band) => ({
  npc: { id: 'remnant', name, look, x, y, dir: 'up', cond: notTaken(key) },
  trigger: { id: `${key}_boss`, ...band, once: false, cond: notTaken(key) },
});
const sky = { backdrop: { plane: '#3a2440', y: -12 } };

// ====================================================================== Saltglass
const sgStar = star(SG, 'salt');
const sgRem = remnant('salt', 'Tamsin', 'tamsin', 20, 6, { x: 9, y: 8, w: 23, h: 1 });
/** @type {import('../../types/data').MapDef} */
const saltglass = {
  ...SG, ...sky,
  id: 'c11_saltglass', name: 'Saltglass', region: 'The Glass Steps',
  mood: 'dusk', music: 'desert', battleBg: 'desert', particles: 'dust_sand',
  encounters: { rate: 1, troops: [['c11_sg_wyrms', 3], ['c11_sg_choir', 2], ['c11_sg_scuttle', 3], ['c11_sg_mix', 2]] },
  signs: [{ x: 20, y: 24, text: 'THE KEEPER\'S HOURS\nThe sun wakes in the east. At noon it stands above us. At evening it goes home to the west.\nRing the hours as the sun walks them, and the Lantern will hear you.' }],
  npcs: [
    { ...sgRem.npc, dir: 'up' },
    { id: 'husk1', name: 'Choir', look: 'c11_choir_husk', x: 18, y: 6, dir: 'up', cond: notTaken('salt') },
    { id: 'husk2', name: 'Choir', look: 'c11_choir_husk', x: 22, y: 6, dir: 'up', cond: notTaken('salt') },
  ],
  chests: [
    chest(SG, 'c11_sg', 'c_islet', { gold: 6000 }),
    chest(SG, 'c11_sg', 'c_mesa_a1', { item: 'horizon' }),
    chest(SG, 'c11_sg', 'c_mesa_a2', { item: 'mega_tonic', count: 3 }),
    chest(SG, 'c11_sg', 'c_mesa_b', { item: 'wanderers_hat' }),
    chest(SG, 'c11_sg', 'c_west1', { item: 'last_whisper' }),
    chest(SG, 'c11_sg', 'c_west2', { item: 'hi_ether', count: 3 }),
    chest(SG, 'c11_sg', 'c_east', { item: 'crest_tome' }),
    chest(SG, 'c11_sg', 'c_sanctum', { item: 'elixir' }),
  ],
  blockers: [
    { id: 'glass_wall', ...at(SG, 'glass_wall'), w: 3, prop: 'crystal' },
    sgStar.blocker,
  ],
  inspect: [
    { ...at(SG, 'bell_morning'), hint: 'Bell', run: (s) => REM.sgBell(s, 'morning') },
    { ...at(SG, 'bell_noon'), hint: 'Bell', run: (s) => REM.sgBell(s, 'noon') },
    { ...at(SG, 'bell_evening'), hint: 'Bell', run: (s) => REM.sgBell(s, 'evening') },
    { x: 19, y: 15, hint: 'Glass wall', cond: (st) => !st.flags.c11_sg_bells, text: 'A wall of glass has grown across the bridge, clear as still water and hard as a vow. Something in the garden below must open it.' },
    { x: 34, y: 13, text: 'A nomad\'s water barrel. On the lid, a tally scratched with a knife: one notch for every day. The notches stop on the day the sun broke. Beside them, in a child\'s hand: STILL HERE. STILL HERE. STILL HERE. Then nothing.' },
    { x: 36, y: 14, text: 'A caravan tent, its poles fused into the glass. Inside, a bedroll, a cold teapot and a child\'s sandal. Whoever lived here packed in a hurry and left the important things.' },
    { x: 30, y: 28, text: 'A Choir pilgrim, still in her travelling sandals, facing the Lantern. She came all this way to hear the Dawnsong one last time.' },
    sgStar.inspect,
  ],
  exits: [gangplank(19, 45)],
  triggers: [
    { id: 'sg_arrive', x: 12, y: 36, w: 17, h: 4, run: (s) => REM.sgArrive(s) },
    { ...sgRem.trigger, run: (s) => REM.sgBoss(s) },
  ],
};

// ====================================================================== Frosthollow
const fhStar = star(FH, 'frost');
const fhRem = remnant('frost', 'Halvard', 'c11_penitence', 22, 6, { x: 11, y: 7, w: 18, h: 1 });
/** @type {import('../../types/data').MapDef} */
const frosthollow = {
  ...FH, ...sky,
  id: 'c11_frosthollow', name: 'Frosthollow', region: 'The Greyspine',
  mood: 'snow', music: 'snow', battleBg: 'snow', treeType: 'pine_snow',
  encounters: { rate: 1, troops: [['c11_fh_stalkers', 3], ['c11_fh_monks', 2], ['c11_fh_wraith', 2], ['c11_fh_mix', 2]] },
  npcs: [fhRem.npc],
  chests: [
    chest(FH, 'c11_fh', 'c_yard_w', { item: 'mega_tonic', count: 3 }),
    chest(FH, 'c11_fh', 'c_yard_e', { item: 'wanderers_mantle' }),
    chest(FH, 'c11_fh', 'c_cloister_w', { item: 'keepers_crook' }),
    chest(FH, 'c11_fh', 'c_cloister_e', { item: 'x_ether' }),
    chest(FH, 'c11_fh', 'c_lake_w', { item: 'guard_fruit' }),
    chest(FH, 'c11_fh', 'c_lake_e', { gold: 8000 }),
    chest(FH, 'c11_fh', 'c_peak', { item: 'dawnguard_regalia' }),
    chest(FH, 'c11_fh', 'c_hall', { item: 'dawn_plume' }),
  ],
  blockers: [
    { id: 'ice_a', ...at(FH, 'ice_a'), w: 2, prop: 'crystal' },
    { id: 'ice_b', ...at(FH, 'ice_b'), w: 2, prop: 'crystal' },
    fhStar.blocker,
  ],
  inspect: [
    { ...at(FH, 'brazier_w'), hint: 'Brazier', run: (s) => REM.fhBrazier(s, 'w') },
    { ...at(FH, 'brazier_e'), hint: 'Brazier', run: (s) => REM.fhBrazier(s, 'e') },
    { x: 19, y: 21, hint: 'Ice', cond: (st) => !st.flags.c11_fh_brazier_w, text: 'A wall of blue ice seals the stair. Deep inside it, the shadow of a monk\'s hand, pressed flat, as if he had tried to hold the avalanche back.' },
    { x: 19, y: 11, hint: 'Ice', cond: (st) => !st.flags.c11_fh_brazier_e, text: 'More ice. Above it, very faintly, a voice reciting the same short prayer over and over.' },
    { ...at(FH, 'cairn'), text: 'A cairn of stones. On the top stone, in charcoal that the snow has somehow never touched: HALVARD. A monk\'s prayer-cord is wrapped around it. Someone came back for him.' },
    { x: 9, y: 24, text: 'Through a cracked shutter: a monk\'s cell. A cot, a candle stub, and a table covered in drawings of a tuning fork, over and over, each with a single note crossed out.' },
    { x: 30, y: 24, text: 'The refectory. Forty bowls set out on a long table, forty spoons beside them. The soup froze a year ago. No one sat down.' },
    { ...at(FH, 'bell'), text: 'The monastery bell lies split in the snow. It rang the hours on this mountain for six hundred years. Then it rang the avalanche.' },
    fhStar.inspect,
  ],
  exits: [gangplank(19, 45)],
  triggers: [
    { id: 'fh_arrive', x: 6, y: 37, w: 28, h: 3, run: (s) => REM.fhArrive(s) },
    { ...fhRem.trigger, run: (s) => REM.fhBoss(s) },
  ],
};

// ====================================================================== Mirefen
const mfStar = star(MF, 'mire');
const mfRem = remnant('mire', 'Osk', 'osk', 20, 5, { x: 10, y: 6, w: 21, h: 1 });
/** @type {import('../../types/data').MapDef} */
const mirefen = {
  ...MF, ...sky,
  id: 'c11_mirefen', name: 'Mirefen', region: 'The Rotting Lake',
  mood: 'swamp', music: 'swamp', battleBg: 'swamp', treeType: 'tree_dead',
  encounters: { rate: 1, troops: [['c11_mf_leeches', 3], ['c11_mf_caps', 2], ['c11_mf_lurker', 2], ['c11_mf_mix', 3]] },
  npcs: [mfRem.npc],
  chests: [
    chest(MF, 'c11_mf', 'c_landing', { item: 'panacea', count: 4 }),
    chest(MF, 'c11_mf', 'c_green', { item: 'rod_of_dusk' }),
    chest(MF, 'c11_mf', 'c_hut', { item: 'tonic_mist', count: 3 }),
    chest(MF, 'c11_mf', 'c_infirm', { item: 'keepers_raiment' }),
    chest(MF, 'c11_mf', 'c_garden_w', { item: 'mega_tonic', count: 4 }),
    chest(MF, 'c11_mf', 'c_garden_e', { item: 'spirit_fruit' }),
    chest(MF, 'c11_mf', 'c_sanct', { item: 'elixir', count: 2 }),
    chest(MF, 'c11_mf', 'c_bank', { item: 'the_last_chronicle' }),
  ],
  blockers: [
    { id: 'rot_a', ...at(MF, 'rot_a'), w: 2, prop: 'crystal_gloam' },
    { id: 'rot_b', ...at(MF, 'rot_b'), w: 2, prop: 'crystal_gloam' },
    mfStar.blocker,
  ],
  inspect: [
    { ...at(MF, 'censer'), hint: 'Herb-shed', run: (s) => REM.mfCenser(s) },
    { x: 18, y: 19, hint: 'Rot-blooms', cond: (st) => !st.flags['blocker:c11_mirefen:rot_a'], run: (s) => REM.mfRot(s, 'rot_a') },
    { x: 19, y: 19, hint: 'Rot-blooms', cond: (st) => !st.flags['blocker:c11_mirefen:rot_a'], run: (s) => REM.mfRot(s, 'rot_a') },
    { x: 19, y: 10, hint: 'Rot-blooms', cond: (st) => !st.flags['blocker:c11_mirefen:rot_b'], run: (s) => REM.mfRot(s, 'rot_b') },
    { x: 20, y: 10, hint: 'Rot-blooms', cond: (st) => !st.flags['blocker:c11_mirefen:rot_b'], run: (s) => REM.mfRot(s, 'rot_b') },
    { x: 21, y: 28, text: 'The village well. A bucket on a rope. The water at the bottom is perfectly clear: the only clean water in Mirefen. Osk kept it that way to the end.' },
    { x: 15, y: 22, text: 'Through the window of the stilt-house: rows of cots, each one neatly made, each one empty. A chalkboard: NAME / HOUR / MEDICINE, filled in until the chalk ran out, then filled in with charcoal, then with a burnt stick.' },
    { x: 24, y: 22, text: 'A child\'s wooden boat on the windowsill, carved with more love than skill. Painted on the side: FOR MOTHER OSK, WHO MADE ME BETTER.' },
    { x: 6, y: 25, text: 'Osk\'s hut. Herbs hang from every beam. On the door, a list of names in her neat hand, each one crossed out, gently, with a single line.' },
    mfStar.inspect,
  ],
  exits: [gangplank(19, 45)],
  triggers: [
    { id: 'mf_arrive', x: 13, y: 36, w: 14, h: 4, run: (s) => REM.mfArrive(s) },
    { ...mfRem.trigger, run: (s) => REM.mfBoss(s) },
  ],
};

// ====================================================================== Thornwood
const twStar = star(TW, 'thorn');
const twRem = remnant('thorn', 'Elowen', 'elowen', 20, 7, { x: 12, y: 8, w: 17, h: 1 });
/** @type {import('../../types/data').MapDef} */
const thornwood = {
  ...TW, ...sky,
  id: 'c11_thornwood', name: 'Thornwood', region: 'Verdance',
  mood: 'forest', music: 'forest', battleBg: 'verdance', treeType: 'tree_autumn', particles: 'leaves',
  encounters: { rate: 1, troops: [['c11_tw_bark', 2], ['c11_tw_hounds', 3], ['c11_tw_moths', 2], ['c11_tw_mix', 2]] },
  npcs: [twRem.npc],
  chests: [
    chest(TW, 'c11_tw', 'c_landing', { item: 'x_tonic', count: 2 }),
    chest(TW, 'c11_tw', 'c_shrine', { item: 'godhand' }),
    chest(TW, 'c11_tw', 'c_ring', { item: 'power_fruit' }),
    chest(TW, 'c11_tw', 'c_oak', { item: 'dawnsong_lyre' }),
    chest(TW, 'c11_tw', 'c_hollow', { item: 'crest_tome' }),
    chest(TW, 'c11_tw', 'c_grove1', { item: 'worldcleaver' }),
    chest(TW, 'c11_tw', 'c_grove2', { item: 'megalixir' }),
    chest(TW, 'c11_tw', 'c_sanct', { item: 'keepers_crown' }),
  ],
  blockers: [
    { id: 'thorn_a', ...at(TW, 'thorn_a'), w: 2, prop: 'bush' },
    { id: 'thorn_b', ...at(TW, 'thorn_b'), w: 3, prop: 'bush' },
    twStar.blocker,
  ],
  inspect: [
    { ...at(TW, 'shrine'), hint: 'Shrine', run: (s) => REM.twShrine(s) },
    ...[[19, 17], [20, 17]].map(([x, y]) => ({ x, y, hint: 'Thorns', cond: (st) => !st.flags['blocker:c11_thornwood:thorn_a'], run: (s) => REM.twThorns(s, 'thorn_a') })),
    ...[[25, 18], [26, 18], [27, 18]].map(([x, y]) => ({ x, y, hint: 'Thorns', cond: (st) => !st.flags['blocker:c11_thornwood:thorn_b'], run: (s) => REM.twThorns(s, 'thorn_b') })),
    { ...at(TW, 'oak'), text: 'Carved inside the hollow oak, at a child\'s height: LYSA WAS HERE. Below it, in a careful, very old hand: SO WAS ELOWEN.' },
    { x: 14, y: 6, text: 'A cherry tree, still in blossom. The only living thing in the court. Petals fall and do not land; they hang in the air, as if waiting to be told what to do.' },
    twStar.inspect,
  ],
  exits: [
    gangplank(19, 45),
    { ...at(TW, 'hollow'), to: 'c11_rift', tx: 14, ty: 28, dir: 'up', cond: (st) => st.flags.c11_rift_open, blocked: async (s) => { await REM.twHollow(s); await s.step('player', 1, 0); } },
  ],
  triggers: [
    { id: 'tw_arrive', x: 14, y: 35, w: 13, h: 5, run: (s) => REM.twArrive(s) },
    { id: 'tw_ring', ...at(TW, 'ring'), run: (s) => REM.twRing(s) },
    { ...twRem.trigger, run: (s) => REM.twBoss(s) },
  ],
};

// ====================================================================== Skyreach
const srStar = star(SR, 'sky');
const srRem = remnant('sky', 'Vasha', 'vasha', 20, 6, { x: 10, y: 7, w: 21, h: 1 });
/** @type {import('../../types/data').MapDef} */
const skyreach = {
  ...SR, ...sky,
  id: 'c11_skyreach', name: 'Skyreach', region: 'Stormcrown',
  mood: 'storm', music: 'tension', battleBg: 'sky', battleMood: 'storm', particles: 'rain',
  encounters: { rate: 1, troops: [['c11_sr_drakes', 2], ['c11_sr_hawks', 3], ['c11_sr_sentinel', 2], ['c11_sr_mix', 2]] },
  npcs: [srRem.npc],
  chests: [
    chest(SR, 'c11_sr', 'c_landing', { item: 'x_ether', count: 2 }),
    chest(SR, 'c11_sr', 'c_west', { item: 'skypiercer' }),
    chest(SR, 'c11_sr', 'c_east', { item: 'swift_fruit' }),
    chest(SR, 'c11_sr', 'c_hub', { gold: 10000 }),
    chest(SR, 'c11_sr', 'c_wreck1', { item: 'last_word' }),
    chest(SR, 'c11_sr', 'c_wreck2', { item: 'dawn_plume', count: 2 }),
    chest(SR, 'c11_sr', 'c_aerie', { item: 'crown_of_dawn' }),
    chest(SR, 'c11_sr', 'c_crown', { item: 'megalixir' }),
  ],
  blockers: [{ id: 'ward', ...at(SR, 'ward'), w: 3, prop: 'crystal' }, srStar.blocker],
  inspect: [
    { ...at(SR, 'rod_w'), hint: 'Lightning rod', run: (s) => REM.srRod(s, 'rod_w') },
    { ...at(SR, 'rod_e'), hint: 'Lightning rod', run: (s) => REM.srRod(s, 'rod_e') },
    { ...at(SR, 'rod_n'), hint: 'Lightning rod', run: (s) => REM.srRod(s, 'rod_n') },
    { x: 20, y: 16, hint: 'Storm-ward', cond: (st) => !st.flags['blocker:c11_skyreach:ward'], text: 'A ward of raw lightning hangs across the bridge, humming like a hive. Your hair stands on end from three paces away.' },
    { x: 18, y: 22, text: 'A storm-rider of Stormcrown, carved in stone, arm flung up to the sky. The inscription: FLY INTO IT. Someone has added, underneath: BUT MAYBE NOT TODAY.' },
    { x: 22, y: 22, text: 'Another rider, younger, laughing. The sculptor caught a crack in the stone running right across the smile, and kept it.' },
    { x: 36, y: 13, text: 'The Stormcrown Pride, Vasha\'s flagship, broken across the rocks. Her figurehead is the Ardent herself, carved mid-shout, finger pointing at a horizon that isn\'t there.' },
    { ...at(SR, 'vasha_log'), text: 'Vasha\'s flight log, under a stone. Last entry: "Gave the Dawnstone to the Hierophant today. He held my hands and thanked me. I have never been so certain of anything." A week later, written so hard the pen tore the page: "WHAT HAVE I DONE."' },
    srStar.inspect,
  ],
  exits: [gangplank(19, 45)],
  triggers: [
    { id: 'sr_arrive', x: 13, y: 36, w: 14, h: 4, run: (s) => REM.srArrive(s) },
    { ...srRem.trigger, run: (s) => REM.srBoss(s) },
  ],
};

// ====================================================================== the Grand Lantern
const glStar = star(GN, 'grand');
/** @type {import('../../types/data').MapDef} */
const grandNave = {
  ...GN, ...sky,
  id: 'c11_grand_nave', name: 'The Grand Lantern', region: 'Aurenne, the City of Bells',
  mood: 'ruin', music: 'aurenne', battleBg: 'temple',
  encounters: { rate: 0.9, troops: [['c11_gl_knights', 3], ['c11_gl_elites', 2], ['c11_gl_bell', 2], ['c11_gl_mix', 3]] },
  npcs: [
    { id: 'brask', name: 'Captain Brask', look: 'c11_brask', ...at(GN, 'brask'), dir: 'right', cond: (st) => !st.flags.c11_gl_brask, run: (s) => REM.glBrask(s) },
    { id: 'gl_guard', name: 'Dawnguard', look: 'dawnguard', x: 20, y: 22, dir: 'down', cond: (st) => !st.flags.c11_shard_grand,
      talk: ['Halt. ...No, I can\'t remember why I\'m meant to say that either. Go on in. Everyone else is dead or upstairs.'] },
  ],
  chests: [
    chest(GN, 'c11_gl', 'c_plaza_w', { item: 'x_tonic', count: 3 }),
    chest(GN, 'c11_gl', 'c_plaza_e', { item: 'mountainfall' }),
    chest(GN, 'c11_gl', 'c_barracks', { item: 'wall_of_dawn' }),
    chest(GN, 'c11_gl', 'c_archive', { item: 'magic_fruit' }),
    chest(GN, 'c11_gl', 'c_nave', { item: 'dawnforged_blade' }),
    chest(GN, 'c11_gl', 'c_apse', { item: 'crest_tome', count: 2 }),
    chest(GN, 'c11_gl', 'c_ruin', { gold: 12000 }),
  ],
  blockers: [{ id: 'portcullis', ...at(GN, 'portcullis'), w: 3, prop: 'pillar' }, glStar.blocker],
  inspect: [
    { ...at(GN, 'lever'), hint: 'Lock-lever', run: (s) => REM.glLever(s) },
    { x: 30, y: 8, hint: 'Shelf', run: (s) => REM.glDrawing(s) },
    { x: 29, y: 12, hint: 'Ledger', run: (s) => REM.glLedger(s) },
    { x: 16, y: 30, text: 'The Bellwright Fountain. Dry for a year. Someone has dropped a single coin in it anyway, very recently, for luck.' },
    { x: 24, y: 31, text: 'A statue of the first Hierophant, arms raised to the sun. Someone has chalked a moustache on him. It is a very good moustache.' },
    { x: 7, y: 9, text: 'A Dawnguard cot, the blanket squared to regulation. Pinned above it: a child\'s drawing of a knight with a very large sword, signed TO DAD.' },
    glStar.inspect,
  ],
  exits: [gangplank(19, 45)],
  triggers: [{ id: 'gl_arrive', x: 14, y: 34, w: 12, h: 5, run: (s) => REM.glArrive(s) }],
};

/** @type {import('../../types/data').MapDef} */
const grandGallery = {
  ...GG,
  id: 'c11_grand_gallery', name: 'The Lamp Gallery', region: 'The Grand Lantern',
  mood: 'temple', music: (st) => (st.flags.c11_shard_grand ? 'aurenne' : null), camera: { dist: 16, pitch: 0.72 },
  battleBg: 'temple', particles: 'dust', noBanner: false,
  npcs: [{ id: 'garrick', name: 'Garrick', look: 'garrick', ...at(GG, 'garrick'), dir: 'down', cond: notTaken('grand') }],
  inspect: [{ x: 10, y: 4, text: 'The cradle of the Great Lamp of Aurenne. The glass is cracked from rim to base. It was the brightest light in the world for nine hundred years.' }],
  exits: [{ x: 9, y: 15, w: 3, to: 'c11_grand_nave', tx: 20, ty: 5, dir: 'down' }],
  onEnter: async (s) => { if (!s.flag('c11_shard_grand')) await REM.glBoss(s); },
};

// ====================================================================== Lanternfall
/** @type {import('../../types/data').MapDef} */
const lfRuins = {
  ...LF, ...sky,
  id: 'c11_lf_ruins', name: 'Lanternfall', region: 'The Westmost Isle',
  mood: (st) => (st.flags.c11_shard_home ? 'night' : 'ruin'),
  music: 'lanternfall', battleBg: 'ruin', treeType: 'tree_dead', particles: 'ash',
  encounters: { rate: 0.8, cond: (st) => st.flags.c11_lf_arrived && !st.flags.c11_shard_home,
    troops: [['c11_lf_memories', 3], ['c11_lf_gulls', 2], ['c11_lf_wrack', 2], ['c11_lf_moths', 2]] },
  chests: [
    chest(LF, 'c11_lf', 'c_beach', { item: 'megalixir' }),
    chest(LF, 'c11_lf', 'c_hills', { item: 'crest_tome' }),
    chest(LF, 'c11_lf', 'c_store', { item: 'x_tonic', count: 3 }),
    chest(LF, 'c11_lf', 'c_square', { item: 'vigor_seed', count: 2 }),
    chest(LF, 'c11_lf', 'c_dock', { item: 'phoenix_charm' }),
    chest(LF, 'c11_lf', 'c_bluff', { item: 'elixir', count: 2 }),
  ],
  inspect: [
    { ...at(LF, 'well'), hint: 'Well', run: (s) => REM.lfWell(s) },
    { x: 14, y: 12, hint: 'Garden', run: (s) => REM.lfGarden(s) },
    { ...at(LF, 'cold_stone'), text: 'The village Hearthstone. Cold, for the first time in anyone\'s memory. Someone has left a bunch of dried sea-lavender on it.' },
    { x: 37, y: 20, text: 'Tobias\'s shack. A note pinned under a stone in his square capitals: BACK SOON. DON\'T TOUCH THE NETS. The nets are still here. Nobody touched them.' },
    { x: 24, y: 11, text: 'Nana Brisa\'s house. Through the window, jars of herbs labelled in tiny exact handwriting. One just says: DO NOT. LET WREN. TOUCH.' },
  ],
  exits: [gangplank(23, 35)],
  triggers: [
    { id: 'lf_square', x: 21, y: 16, w: 5, h: 2, once: false, cond: (st) => st.flags.c11_lf_arrived && !st.flags.c11_lf_mem_well, run: (s) => REM.lfWell(s) },
  ],
  onEnter: async (s) => { await REM.lfArrive(s); },
};

/** @type {import('../../types/data').MapDef} */
const lfHome = {
  ...LH,
  id: 'c11_lf_home', name: 'Halloway House', mood: 'interior', music: 'sad',
  camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'ash', battleBg: 'ruin',
  inspect: [
    { x: 4, y: 4, text: 'Two plates. Two cups. A year of ash on both.' },
    { x: 1, y: 2, text: 'Your bed. Unmade, obviously. Some things survive the end of the world.' },
    { x: 7, y: 2, text: 'Your father\'s books. Sea charts, star charts, and the pirate-queen novel with the last chapter torn out. Tucked in its place, a folded paper in your mother\'s hand: "She ends up happy. Don\'t tell Wren, she\'ll want to read it herself."' },
    { x: 8, y: 2, text: 'Your own books, salt-stiff. The Sunward Atlas is not among them. You took it with you. You remember choosing it over a sweater.' },
  ],
  exits: [{ x: 4, y: 8, w: 2, to: 'c11_lf_ruins', tx: 16, ty: 12, dir: 'down' }],
  onEnter: async (s) => { await REM.lfHome(s); },
};

/** @type {import('../../types/data').MapDef} */
const lfLantern = {
  ...LL,
  id: 'c11_lf_lantern', name: 'The Lantern of Lanternfall',
  mood: (st) => (st.flags.c11_shard_home ? 'night' : 'temple'), music: null,
  camera: { dist: 17, pitch: 0.72 }, particles: (st) => (st.flags.c11_shard_home ? 'dust' : 'motes_gold'), battleBg: 'lantern',
  npcs: [{ id: 'remnant', name: 'Ysolde', look: 'c11_ysolde_remnant', ...at(LL, 'remnant'), dir: 'up', cond: notTaken('home') }],
  inspect: [
    { x: 7, y: 2, text: 'The great lamp of Lanternfall, dark. Inside the brass, where the Dawnstone used to sleep, nothing at all. It is only a lamp now.', cond: (st) => st.flags.c11_shard_home },
    { x: 12, y: 5, hint: 'Lantern log', run: (s) => REM.lfLog(s) },
  ],
  exits: [{ x: 6, y: 12, w: 3, to: 'c11_lf_ruins', tx: 8, ty: 5, dir: 'down' }],
  onEnter: async (s) => { if (!s.flag('c11_shard_home')) await REM.lfBoss(s); },
};

export const REMNANT_MAPS = [saltglass, frosthollow, mirefen, thornwood, skyreach, grandNave, grandGallery, lfRuins, lfHome, lfLantern];
