// Link Arts: combination techniques that spend Afterglow. All listed members
// must be in the active party, alive and able to act.

export const LINKS = [
  { id: 'link_tidebound', members: ['wren', 'ilse'], cost: 100, desc: 'Light on all foes. "Same as always?" "Same as always."' },
  { id: 'link_shieldwall', members: ['wren', 'bram'], cost: 100, desc: 'A charging blow that may stun.' },
  { id: 'link_vigil', members: ['bram', 'ilse'], cost: 100, desc: 'Protect, Shell, Regen and defenses up for the party.' },
  { id: 'link_gloamlight', members: ['wren', 'sable'], cost: 200, desc: 'Every element at once.' },
  { id: 'link_slingshot', members: ['bram', 'pip'], cost: 200, desc: 'Bram throws Pip. Pip is delighted.' },
  { id: 'link_mercy', members: ['ilse', 'pip'], cost: 200, desc: 'Revive and heal the whole party.' },
  { id: 'link_broadside', members: ['corvin', 'pip'], cost: 200, desc: 'Eight shots, all at once.' },
  { id: 'link_eclipse', members: ['sable', 'corvin'], cost: 200, desc: 'Dark on all foes; may sleep.' },
  { id: 'link_dawnbreak', members: ['wren', 'ilse', 'bram'], cost: 300, desc: 'The three of Lanternfall.' },
  { id: 'link_afterlight', members: ['wren', 'ilse', 'bram', 'sable'], cost: 300, desc: 'Everything you\'ve been through, together.', requiresFlag: 'act3' },
];
