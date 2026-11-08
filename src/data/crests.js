// Crests — the class system. "One Crest, one life," says the proverb; the
// party proves it wrong. Each character levels every Crest independently.
//
//  stats:    multipliers applied to the character's base stats while this is the PRIMARY crest
//  weapons:  equippable weapon types; armor: equippable armor weights; shield: may use shields
//  ranks:    10 unlocks (index 0 = rank 1). { skill } actives or { passive } supports.
//  requires: per-character crest ranks needed before an advanced crest can be equipped
//  unlock:   'start' | 'story' | 'stone' (bought/found Crest Stone) | 'requirement'

export const CREST_RANK_CP = [0, 15, 40, 80, 140, 220, 320, 440, 600, 800];
export const MAX_RANK = 10;

/**
 * @param {import('../types/data').CrestDef} def
 * @returns {import('../types/data').CrestDef}
 */
const C = (def) => def;

export const CRESTS = {
  // ======================================================== TIER I — the eight callings
  vanguard: C({
    name: 'Vanguard', tier: 1, icon: '⚔', color: '#e8a050',
    desc: 'Front-line fighter. Sweeping strikes and rallying cries.',
    stats: { hp: 1.1, mp: 0.8, str: 1.15, mag: 0.8, def: 1.05, res: 0.9, spd: 1.0, lck: 1.0 },
    weapons: ['sword', 'greatsword', 'spear', 'axe'], armor: ['heavy', 'light'], shield: true,
    ranks: [{ skill: 'cleave' }, { passive: 'hp_up' }, { skill: 'rally' }, { skill: 'sunder' }, { passive: 'counter' },
      { skill: 'whirlwind' }, { passive: 'str_up' }, { skill: 'valiant_charge' }, { passive: 'last_stand' }, { skill: 'ardent_blade' }],
  }),
  warden: C({
    name: 'Warden', tier: 1, icon: '⛨', color: '#a0b0c8',
    desc: 'Living shield. Draws blows away from friends.',
    stats: { hp: 1.25, mp: 0.8, str: 1.05, mag: 0.75, def: 1.3, res: 1.05, spd: 0.85, lck: 1.0 },
    weapons: ['sword', 'spear', 'axe'], armor: ['heavy', 'light'], shield: true,
    ranks: [{ skill: 'provoke' }, { passive: 'def_up' }, { skill: 'shield_bash' }, { passive: 'cover' }, { skill: 'bulwark_stance' },
      { passive: 'hp_up2' }, { skill: 'guardian_wall' }, { passive: 'steadfast' }, { skill: 'retribution' }, { passive: 'sentinel' }],
  }),
  ranger: C({
    name: 'Ranger', tier: 1, icon: '➶', color: '#8ac070',
    desc: 'Hunter and scout. Precise shots, reads weaknesses.',
    stats: { hp: 1.0, mp: 0.9, str: 1.05, mag: 0.9, def: 0.95, res: 0.95, spd: 1.15, lck: 1.05 },
    weapons: ['bow', 'spear', 'dagger'], armor: ['light'], shield: false,
    ranks: [{ skill: 'aimed_shot' }, { skill: 'scan' }, { passive: 'first_strike' }, { skill: 'arrow_rain' }, { passive: 'evade_up' },
      { skill: 'venom_arrow' }, { skill: 'hunters_mark' }, { passive: 'spd_up' }, { skill: 'galeshot' }, { skill: 'deadeye' }],
  }),
  rogue: C({
    name: 'Rogue', tier: 1, icon: '✦', color: '#c0a0e0',
    desc: 'Quick hands, quicker feet. Steals from anything with pockets.',
    stats: { hp: 0.95, mp: 0.9, str: 1.0, mag: 0.9, def: 0.9, res: 0.95, spd: 1.25, lck: 1.25 },
    weapons: ['dagger', 'sword', 'bow', 'gun'], armor: ['light'], shield: false,
    ranks: [{ skill: 'steal' }, { skill: 'quickstrike' }, { passive: 'gold_up' }, { skill: 'mug' }, { passive: 'evade_up' },
      { skill: 'smoke_bomb' }, { skill: 'eviscerate' }, { passive: 'treasure_sense' }, { skill: 'shadowstep' }, { passive: 'spd_up2' }],
  }),
  mender: C({
    name: 'Mender', tier: 1, icon: '✚', color: '#90e0b0',
    desc: 'Healer of the old Choir tradition. Keeps everyone breathing.',
    stats: { hp: 0.95, mp: 1.25, str: 0.75, mag: 1.1, def: 0.9, res: 1.2, spd: 0.95, lck: 1.0 },
    weapons: ['staff', 'rod'], armor: ['robe', 'light'], shield: false,
    ranks: [{ skill: 'mend' }, { skill: 'purify' }, { skill: 'mend_all' }, { passive: 'mp_up' }, { skill: 'rekindle' },
      { skill: 'aegis' }, { skill: 'mend_ii' }, { passive: 'heal_up' }, { skill: 'renewal' }, { skill: 'second_dawn' }],
  }),
  arcanist: C({
    name: 'Arcanist', tier: 1, icon: '✴', color: '#f08070',
    desc: 'Wielder of the elements. Fragile, devastating.',
    stats: { hp: 0.85, mp: 1.3, str: 0.7, mag: 1.25, def: 0.85, res: 1.1, spd: 1.0, lck: 1.0 },
    weapons: ['rod', 'staff', 'tome'], armor: ['robe'], shield: false,
    ranks: [{ skill: 'ember' }, { skill: 'frost' }, { skill: 'spark' }, { passive: 'mag_up' }, { skill: 'flame_wave' },
      { skill: 'blizzard' }, { skill: 'thunderstorm' }, { passive: 'mp_saver' }, { skill: 'arcane_burst' }, { skill: 'meteor' }],
  }),
  pugilist: C({
    name: 'Pugilist', tier: 1, icon: '✊', color: '#e0c070',
    desc: 'Discipline made flesh. Hits hard, hits often, hits back.',
    stats: { hp: 1.15, mp: 0.7, str: 1.2, mag: 0.7, def: 1.0, res: 0.9, spd: 1.1, lck: 1.0 },
    weapons: ['fist', 'staff'], armor: ['light'], shield: false,
    ranks: [{ skill: 'flurry' }, { passive: 'counter' }, { skill: 'focus' }, { skill: 'palm_strike' }, { passive: 'hp_up' },
      { skill: 'tremor' }, { passive: 'bare_knuckle' }, { skill: 'hundred_fists' }, { passive: 'counter2' }, { skill: 'dragon_fang' }],
  }),
  cantor: C({
    name: 'Cantor', tier: 1, icon: '♪', color: '#f0d080',
    desc: 'Singer of the Lantern hymns. Songs that steady the heart.',
    stats: { hp: 0.95, mp: 1.15, str: 0.85, mag: 1.05, def: 0.9, res: 1.05, spd: 1.05, lck: 1.1 },
    weapons: ['instrument', 'rod', 'dagger'], armor: ['robe', 'light'], shield: false,
    ranks: [{ skill: 'ballad_valor' }, { skill: 'lullaby' }, { skill: 'hymn_ward' }, { passive: 'resonance' }, { skill: 'tempo' },
      { skill: 'dirge' }, { skill: 'dawnsong' }, { passive: 'afterglow_up' }, { skill: 'requiem' }, { skill: 'anthem' }],
  }),

  // ======================================================== TIER II — braided callings
  dawnknight: C({
    name: 'Dawnknight', tier: 2, icon: '☀', color: '#ffe090', requires: { warden: 5, mender: 5 },
    desc: 'Holy knight of the old order. Light in the blade, mercy in the hand.',
    stats: { hp: 1.2, mp: 1.0, str: 1.1, mag: 1.0, def: 1.2, res: 1.15, spd: 0.95, lck: 1.0 },
    weapons: ['sword', 'spear'], armor: ['heavy'], shield: true,
    ranks: [{ skill: 'holy_blade' }, { passive: 'auto_regen' }, { skill: 'lay_hands' }, { skill: 'sanctuary' }, { passive: 'light_ward' },
      { skill: 'judgment' }, { passive: 'martyr' }, { skill: 'radiant_charge' }, { passive: 'hp_up2' }, { skill: 'dawnbreaker' }],
  }),
  runeblade: C({
    name: 'Runeblade', tier: 2, icon: '⚡', color: '#a0c0ff', requires: { vanguard: 5, arcanist: 5 },
    desc: 'Etches elements onto steel. Strikes every weakness.',
    stats: { hp: 1.05, mp: 1.1, str: 1.1, mag: 1.1, def: 1.0, res: 1.0, spd: 1.0, lck: 1.0 },
    weapons: ['sword', 'greatsword', 'rod'], armor: ['light', 'heavy'], shield: false,
    ranks: [{ skill: 'flame_edge' }, { skill: 'frost_edge' }, { skill: 'volt_edge' }, { passive: 'mag_up' }, { skill: 'gale_edge' },
      { skill: 'prismatic_arc' }, { passive: 'mp_saver' }, { skill: 'shadow_edge' }, { passive: 'crit_up' }, { skill: 'sevenfold_edge' }],
  }),
  nightblade: C({
    name: 'Nightblade', tier: 2, icon: '☾', color: '#8070c0', requires: { rogue: 5, pugilist: 5 },
    desc: 'Assassin of the alleys. Strikes before you knew there was a fight.',
    stats: { hp: 0.95, mp: 1.0, str: 1.15, mag: 0.95, def: 0.9, res: 0.95, spd: 1.3, lck: 1.15 },
    weapons: ['dagger', 'sword', 'fist'], armor: ['light'], shield: false,
    ranks: [{ skill: 'silent_cut' }, { passive: 'first_strike' }, { skill: 'mirage' }, { skill: 'deathmark' }, { passive: 'crit_up' },
      { skill: 'shuriken_storm' }, { passive: 'spd_up2' }, { skill: 'nightfall' }, { passive: 'shadow_reflex' }, { skill: 'thousand_cuts' }],
  }),
  sage: C({
    name: 'Sage', tier: 2, icon: '✺', color: '#f0f0c0', requires: { mender: 5, arcanist: 5 },
    desc: 'Scholar of both halves of the art. Heals and harms in equal measure.',
    stats: { hp: 0.95, mp: 1.4, str: 0.7, mag: 1.3, def: 0.9, res: 1.25, spd: 1.0, lck: 1.0 },
    weapons: ['staff', 'rod', 'tome'], armor: ['robe'], shield: false,
    ranks: [{ skill: 'gust' }, { skill: 'holy' }, { passive: 'mp_up2' }, { skill: 'mend_iii' }, { skill: 'dispel' },
      { passive: 'mag_up2' }, { skill: 'tornado' }, { skill: 'reraise' }, { passive: 'mp_half' }, { skill: 'starlight' }],
  }),
  beastcaller: C({
    name: 'Beastcaller', tier: 2, icon: '❦', color: '#a0e0a0', requires: { ranger: 5, cantor: 5 },
    desc: 'Sings the old spirits of the wild into battle.',
    stats: { hp: 1.0, mp: 1.3, str: 0.9, mag: 1.15, def: 0.95, res: 1.1, spd: 1.0, lck: 1.05 },
    weapons: ['bow', 'staff', 'fist'], armor: ['light', 'robe'], shield: false,
    ranks: [{ skill: 'call_hawk' }, { skill: 'call_tortoise' }, { passive: 'beast_lore' }, { skill: 'call_wolf' }, { skill: 'call_stag' },
      { passive: 'mp_up2' }, { skill: 'call_serpent' }, { skill: 'call_bear' }, { passive: 'beast_bond' }, { skill: 'call_phoenix' }],
  }),
  alchemist: C({
    name: 'Alchemist', tier: 2, icon: '⚗', color: '#c0e070', requires: { rogue: 5, mender: 5 },
    desc: 'Flasks, powders and terrible ideas. Makes every item a miracle.',
    stats: { hp: 1.0, mp: 1.1, str: 0.95, mag: 1.1, def: 0.95, res: 1.05, spd: 1.05, lck: 1.15 },
    weapons: ['dagger', 'staff', 'gun'], armor: ['light'], shield: false,
    ranks: [{ passive: 'pharmacist' }, { skill: 'acid_flask' }, { skill: 'fire_flask' }, { passive: 'quick_pockets' }, { skill: 'elixir_mist' },
      { skill: 'alchemize' }, { passive: 'treasure_sense' }, { skill: 'panacea' }, { skill: 'philosophers_bomb' }, { passive: 'auto_potion' }],
  }),
  skylancer: C({
    name: 'Skylancer', tier: 2, icon: '⇡', color: '#90c0f0', requires: { vanguard: 5, ranger: 5 },
    desc: 'Leaps beyond reach, falls like judgment.',
    stats: { hp: 1.1, mp: 0.9, str: 1.2, mag: 0.8, def: 1.1, res: 0.95, spd: 1.05, lck: 1.0 },
    weapons: ['spear'], armor: ['heavy', 'light'], shield: true,
    ranks: [{ skill: 'jump' }, { passive: 'spear_master' }, { skill: 'lance_sweep' }, { skill: 'high_jump' }, { passive: 'hp_up' },
      { skill: 'gale_lance' }, { passive: 'str_up' }, { skill: 'skewer' }, { passive: 'crit_up' }, { skill: 'skyfall' }],
  }),
  timewright: C({
    name: 'Timewright', tier: 2, icon: '⧗', color: '#d0b0ff', requires: { arcanist: 5, cantor: 5 },
    desc: 'Bends the moment. Hastens friends, freezes foes.',
    stats: { hp: 0.9, mp: 1.35, str: 0.7, mag: 1.2, def: 0.9, res: 1.15, spd: 1.15, lck: 1.0 },
    weapons: ['rod', 'staff', 'tome'], armor: ['robe'], shield: false,
    ranks: [{ skill: 'haste' }, { skill: 'slow' }, { skill: 'stasis' }, { passive: 'quick_cast' }, { skill: 'regen' },
      { skill: 'hastega' }, { skill: 'gravity' }, { passive: 'mp_up2' }, { skill: 'quicken' }, { skill: 'event_horizon' }],
  }),
  duskdancer: C({
    name: 'Duskdancer', tier: 2, icon: '❀', color: '#f0a0c0', requires: { cantor: 5, rogue: 5 },
    desc: 'Dances that charm, heal and cut in the same breath.',
    stats: { hp: 0.95, mp: 1.1, str: 1.0, mag: 1.05, def: 0.9, res: 1.0, spd: 1.25, lck: 1.2 },
    weapons: ['dagger', 'instrument', 'fist'], armor: ['light'], shield: false,
    ranks: [{ skill: 'blade_dance' }, { skill: 'allure' }, { passive: 'evade_up2' }, { skill: 'healing_waltz' }, { skill: 'mesmerize' },
      { passive: 'spd_up' }, { skill: 'twilight_tango' }, { skill: 'rejuvenate' }, { passive: 'afterglow_up2' }, { skill: 'grand_finale' }],
  }),
  berserker: C({
    name: 'Berserker', tier: 2, icon: '☠', color: '#e06050', requires: { vanguard: 5, pugilist: 5 },
    desc: 'Pain is a currency. Spend it.',
    stats: { hp: 1.3, mp: 0.6, str: 1.35, mag: 0.6, def: 0.95, res: 0.8, spd: 1.0, lck: 0.95 },
    weapons: ['axe', 'greatsword', 'fist'], armor: ['heavy', 'light'], shield: false,
    ranks: [{ skill: 'rampage' }, { passive: 'hp_up2' }, { skill: 'blood_price' }, { skill: 'war_cry' }, { passive: 'last_stand' },
      { skill: 'earthsplitter' }, { passive: 'str_up2' }, { skill: 'frenzy' }, { passive: 'adrenaline' }, { skill: 'ragnarok' }],
  }),

  // ======================================================== TIER III — legends
  lanternkeeper: C({
    name: 'Lanternkeeper', tier: 3, icon: '♆', color: '#ffd070', unlock: 'story',
    desc: 'The calling of the Keepers. Ysolde\'s light, carried forward.',
    stats: { hp: 1.15, mp: 1.3, str: 1.05, mag: 1.3, def: 1.05, res: 1.25, spd: 1.05, lck: 1.05 },
    weapons: ['staff', 'sword', 'rod'], armor: ['robe', 'light'], shield: false,
    ranks: [{ skill: 'beacon' }, { skill: 'guiding_light' }, { passive: 'keepers_vigil' }, { skill: 'tidesong' }, { passive: 'afterglow_up2' },
      { skill: 'lighthouse' }, { passive: 'mag_up2' }, { skill: 'sunrise' }, { passive: 'hp_up2' }, { skill: 'first_light' }],
  }),
  gloamweaver: C({
    name: 'Gloamweaver', tier: 3, icon: '◐', color: '#b080ff', unlock: 'story',
    desc: 'A Crest no Lantern recognizes. Threads of the dark between worlds.',
    stats: { hp: 0.95, mp: 1.35, str: 0.85, mag: 1.35, def: 0.9, res: 1.2, spd: 1.1, lck: 1.0 },
    weapons: ['rod', 'dagger', 'tome'], armor: ['robe', 'light'], shield: false,
    ranks: [{ skill: 'umbra' }, { skill: 'hex' }, { skill: 'siphon' }, { passive: 'gloamborn' }, { skill: 'nightshade' },
      { skill: 'doom' }, { passive: 'mag_up' }, { skill: 'unmake' }, { passive: 'mp_up2' }, { skill: 'oblivion' }],
  }),
  starseer: C({
    name: 'Starseer', tier: 3, icon: '✧', color: '#a0d0ff', unlock: 'story',
    desc: 'Reads the drowned stars. Fate, a little bent.',
    stats: { hp: 0.95, mp: 1.3, str: 0.9, mag: 1.25, def: 0.95, res: 1.2, spd: 1.1, lck: 1.3 },
    weapons: ['staff', 'rod', 'bow'], armor: ['robe', 'light'], shield: false,
    ranks: [{ skill: 'comet' }, { skill: 'foresight' }, { passive: 'lck_up' }, { skill: 'constellation' }, { skill: 'astral_veil' },
      { passive: 'exp_up' }, { skill: 'eclipse' }, { passive: 'cp_up' }, { skill: 'supernova' }, { passive: 'fate_weaver' }],
  }),
  gambler: C({
    name: 'Gambler', tier: 3, icon: '♠', color: '#e0e0e0', unlock: 'story',
    desc: 'Corvin\'s creed: the house always loses eventually.',
    stats: { hp: 1.0, mp: 1.0, str: 1.05, mag: 1.0, def: 0.95, res: 0.95, spd: 1.15, lck: 1.5 },
    weapons: ['gun', 'dagger', 'sword'], armor: ['light'], shield: false,
    ranks: [{ skill: 'loaded_dice' }, { passive: 'gold_up' }, { skill: 'wild_card' }, { passive: 'lck_up' }, { skill: 'all_in' },
      { skill: 'coin_barrage' }, { passive: 'crit_up' }, { skill: 'double_down' }, { passive: 'lucky_streak' }, { skill: 'royal_flush' }],
  }),
  sunforged: C({
    name: 'Sunforged', tier: 3, icon: '☼', color: '#ffb050', unlock: 'story',
    desc: 'Tempered in a shard of the broken sun.',
    stats: { hp: 1.3, mp: 1.2, str: 1.3, mag: 1.2, def: 1.25, res: 1.2, spd: 1.05, lck: 1.0 },
    weapons: ['sword', 'greatsword', 'spear', 'axe', 'fist'], armor: ['heavy', 'light'], shield: true,
    ranks: [{ skill: 'solar_flare' }, { passive: 'hp_up3' }, { skill: 'forge_strike' }, { passive: 'break_limit' }, { skill: 'sun_aegis' },
      { passive: 'str_up2' }, { skill: 'helios' }, { passive: 'mag_up2' }, { skill: 'corona' }, { passive: 'sun_soul' }],
  }),
  afterlight: C({
    name: 'Afterlight', tier: 3, icon: '❂', color: '#fff0d0', unlock: 'story',
    desc: 'The light that remains after the sun is gone. Everything you have become.',
    stats: { hp: 1.3, mp: 1.3, str: 1.3, mag: 1.3, def: 1.3, res: 1.3, spd: 1.15, lck: 1.15 },
    weapons: ['sword', 'greatsword', 'spear', 'axe', 'dagger', 'bow', 'staff', 'rod', 'fist', 'instrument', 'tome', 'gun'], armor: ['heavy', 'light', 'robe'], shield: true,
    ranks: [{ skill: 'afterglow_strike' }, { passive: 'all_up' }, { skill: 'new_dawn' }, { passive: 'afterglow_up2' }, { skill: 'twilight_requiem' },
      { passive: 'break_limit' }, { skill: 'kindle' }, { passive: 'mp_half' }, { skill: 'eternal_moment' }, { skill: 'afterlight' }],
  }),
};

// Battle costumes per Crest (applied when a character wears a Crest other than
// their own starting one): outfit overrides + extra accessories.
const COSTUMES = {
  vanguard: { style: 'tunic', main: '#a8583a', accent: '#e8dcc0', trim: '#c9a24a' },
  warden: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#3a5a8a', trim: '#d7a83a', acc: ['cape'], capeColor: '#3a5a8a' },
  ranger: { style: 'coat', main: '#4a6a3a', accent: '#d8c8a0', trim: '#7a5a30', acc: ['feather'] },
  rogue: { style: 'vest', main: '#3a3a4a', accent: '#a83a3a', trim: '#2a2a30', acc: ['scarf'] },
  mender: { style: 'robe', main: '#ece6d8', accent: '#5ab07a', trim: '#5ab07a' },
  arcanist: { style: 'robe', main: '#3a3a7a', accent: '#e0c060', trim: '#e0c060', acc: ['hat_wizard'] },
  pugilist: { style: 'vest', main: '#a84a3a', accent: '#e8dcc0', trim: '#3a2a20', acc: ['headband'] },
  cantor: { style: 'coat', main: '#c8a040', accent: '#f4ecd8', trim: '#8a4a2a', acc: ['feather'] },
  dawnknight: { style: 'armor', main: '#ddd', metal: '#e8e0c8', accent: '#d7a83a', trim: '#d7a83a', acc: ['cape'], capeColor: '#e8d8a0' },
  runeblade: { style: 'coat', main: '#2a4a8a', accent: '#8ac8ff', trim: '#c0c8e0', acc: ['circlet'] },
  nightblade: { style: 'vest', main: '#1e1e2a', accent: '#5a4a8a', trim: '#5a4a8a', acc: ['scarf'] },
  sage: { style: 'priest', main: '#f0ead8', accent: '#3a6a5a', trim: '#d0a040', acc: ['hat_wizard'] },
  beastcaller: { style: 'coat', main: '#5a7a3a', accent: '#c8a878', trim: '#7a5a30', acc: ['feather'] },
  alchemist: { style: 'coat', main: '#7a5a3a', accent: '#a0d070', trim: '#c9a24a', acc: ['glasses'] },
  skylancer: { style: 'armor', main: '#888', metal: '#7a9ac8', accent: '#2a4a8a', trim: '#e0e0f0', acc: ['helmet'] },
  timewright: { style: 'robe', main: '#5a3a7a', accent: '#d0b0ff', trim: '#e0c060', acc: ['circlet'] },
  duskdancer: { style: 'dress', main: '#c85a8a', accent: '#f0c0d8', trim: '#e0c060', acc: ['ribbon'] },
  berserker: { style: 'rags', main: '#8a2a2a', accent: '#3a2a20', trim: '#2a1a10', acc: ['headband'] },
  lanternkeeper: { style: 'robe', main: '#2f4a6a', accent: '#e8dcc0', trim: '#d9b04a', acc: ['circlet', 'cape'], capeColor: '#d9b04a' },
  gloamweaver: { style: 'robe', main: '#2a2638', accent: '#b07aff', trim: '#7a6aa8', acc: ['hood'] },
  starseer: { style: 'robe', main: '#1a2a5a', accent: '#c0d8ff', trim: '#e0e8ff', acc: ['circlet'] },
  gambler: { style: 'coat', main: '#1a1a1a', accent: '#a82a2a', trim: '#e0c060', acc: ['hat_wide'] },
  sunforged: { style: 'armor', main: '#c8a040', metal: '#e0b050', accent: '#ff8a30', trim: '#ffe0a0', acc: ['cape'], capeColor: '#ff8a30' },
  afterlight: { style: 'coat', main: '#f4f0e8', accent: '#ffd890', trim: '#ffd890', acc: ['cape'], capeColor: '#fff0d0' },
};
for (const [id, c] of Object.entries(COSTUMES)) CRESTS[id].costume = c;

export const CREST_ORDER = Object.keys(CRESTS);

/** Cumulative CP needed to reach `rank` (1-based). */
export function cpForRank(rank) {
  return CREST_RANK_CP[Math.max(0, Math.min(MAX_RANK, rank) - 1)];
}
