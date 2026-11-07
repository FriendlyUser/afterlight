// Playable characters: base stats, growth flavor, starting crest and gear.
// Stat curve (before multipliers) is defined in state/Character.js.

export const CHARACTERS = {
  wren: {
    name: 'Wren', title: 'The Restless Heart', age: 16, look: 'wren',
    mult: { hp: 1.0, mp: 1.0, str: 1.05, mag: 0.95, def: 1.0, res: 0.95, spd: 1.05, lck: 1.05 },
    startCrest: 'vanguard', startLevel: 1,
    personal: { name: 'Resolve', desc: 'Afterglow gain +25%. Once per battle, survive a lethal blow at 1 HP.' },
    equip: { weapon: 'driftwood_blade', body: 'fishers_vest', head: 'cloth_cap' },
    bio: 'Daughter of the Keeper of Lanternfall. Reads every book the tide brings in. Wants, more than anything, to leave.',
  },
  ilse: {
    name: 'Ilse', title: 'The Careful Hand', age: 16, look: 'ilse',
    mult: { hp: 0.9, mp: 1.2, str: 0.85, mag: 1.12, def: 0.9, res: 1.15, spd: 0.98, lck: 1.0 },
    startCrest: 'mender', startLevel: 1,
    personal: { name: 'Triage', desc: 'Healing on allies below 30% HP is 50% stronger.' },
    equip: { weapon: 'walking_stick', body: 'linen_robe', head: 'straw_hat' },
    bio: 'Wren\'s best friend since before either could walk. Herbalist\'s apprentice. Has a plan for everything, including the plan failing.',
  },
  bram: {
    name: 'Bram', title: 'The Frightened Shield', age: 19, look: 'bram',
    mult: { hp: 1.2, mp: 0.8, str: 1.08, mag: 0.8, def: 1.2, res: 0.95, spd: 0.88, lck: 0.95 },
    startCrest: 'warden', startLevel: 3,
    personal: { name: 'Bulwark', desc: 'Once per battle, take a lethal blow meant for an ally.' },
    equip: { weapon: 'iron_sword', offhand: 'buckler', body: 'padded_mail', head: 'leather_helm' },
    bio: 'Squire of the Dawnguard, exiled to Lanternfall after he froze during his knighting trial. Loud. Kind. Certain he is a coward.',
  },
  sable: {
    name: 'Sable', title: 'The Girl from the Sea', age: 16, look: 'sable',
    mult: { hp: 0.85, mp: 1.25, str: 0.85, mag: 1.25, def: 0.85, res: 1.1, spd: 1.05, lck: 1.0 },
    startCrest: 'gloamweaver', startLevel: 2,
    personal: { name: 'Gloamtouch', desc: 'Attacks may inflict a random ailment. Immune to Doom.' },
    equip: { weapon: 'willow_wand', body: 'linen_robe' },
    bio: 'Washed ashore in a storm with no memory and a Crest no Lantern has ever seen.',
  },
  pip: {
    name: 'Pip', title: 'The Gutter Prince', age: 11, look: 'pip',
    mult: { hp: 0.85, mp: 0.9, str: 0.95, mag: 0.9, def: 0.88, res: 0.95, spd: 1.3, lck: 1.3 },
    startCrest: 'rogue', startLevel: 8,
    personal: { name: 'Pilfer', desc: 'Basic attacks may steal.' },
    equip: { weapon: 'iron_dagger', body: 'leather_jerkin' },
    bio: 'Aurenne street kid. Steals for a living, lies for fun, and would die before admitting he\'s eleven.',
  },
  corvin: {
    name: 'Corvin', title: 'The Runaway Captain', age: 34, look: 'corvin',
    mult: { hp: 1.05, mp: 0.95, str: 1.05, mag: 0.95, def: 1.0, res: 0.95, spd: 1.1, lck: 1.2 },
    startCrest: 'rogue', startLevel: 14,
    personal: { name: 'Gambit', desc: '1 in 6 chance a skill costs no MP and hits twice as hard.' },
    equip: { weapon: 'steel_revolver', body: 'brigandine', head: 'leather_hat' },
    bio: 'Captain of the airship Halcyon. Smuggler, gambler, Dawnguard deserter. Owes everyone money, including himself.',
  },
};

export const PARTY_ORDER = ['wren', 'ilse', 'bram', 'sable', 'pip', 'corvin'];
