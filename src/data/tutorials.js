// Tutorials: a card the first time the player meets each system (ui/Tutorial.js), each
// pointing at the Guide entry (ui/menu/screens.js, GUIDE) that keeps the full story.
// A card is shown once per save (state.vars.tutorials) and only while Settings →
// Tutorials is on. Text follows docs/STYLE.md: what the thing is, then what to do,
// the term taught in *bold* once. {key:action} shows that action's key as the player
// has it bound (ui/Tutorial.js), so remaps show.
//
// Where each one is triggered:
//   battle, encounters, big_attacks, link_arts, foes, mastery  battle/BattleScene.js
//   poise, afterglow                                            story/prologue.js
//   crests                                                      story/ch2_thistle.js
//   formation                                                   story/ch4a.js
//   equipment, side_quests                                      script/ScriptContext.js (give, quest)
//   saving                                                      world/FieldScene.js (Hearthstone)
//   world_map                                                   world/WorldMapScene.js
//   riding                                                      story/mount.js
//   compendium, marks                                           story/hunt.js
//   lost_crests                                                 story/lost.js

/** @type {Record<string, { title: string, guide: string, text: () => string[] }>} */
export const TUTORIALS = {
  battle: {
    title: 'Battle', guide: 'Turn Order',
    text: () => [
      'Turns run on the *timeline* at the top left: quick characters act more often. On your turn, pick a command: Attack, a Crest\'s Arts, Items, Guard (halve the damage and act sooner) or Flee.',
      `Don't feel like fighting this one? *Auto* lets the party fight on its own ({key:info} turns it on and off), and *Skip* plays the whole battle out at once and shows the results.`,
    ],
  },
  encounters: {
    title: 'Random Battles', guide: 'Auto-Battle & Skipping',
    text: () => [
      'Out in the wilds, the *orb* in the lower left warms from green to red as a random battle draws near.',
      'Settings can change how they go: *Encounter Rate* halves them or turns them off (story battles still happen), *Auto-Battle* starts them on auto, and *Skip Random Battles* resolves them at once. You still earn the EXP, gold and drops.',
    ],
  },
  poise: {
    title: 'Poise & Breaks', guide: 'Poise & Breaks',
    text: () => [
      'Each foe has a *Poise* shield: the number under it. Hit its weaknesses to chip it away.',
      'At zero it *Breaks*: it loses its next turn and takes 50% more damage until it recovers. Weaknesses start hidden, so try everything.',
    ],
  },
  afterglow: {
    title: 'Afterglow', guide: 'Afterglow',
    text: () => [
      'The party shares the *Afterglow* gauge. It fills when you strike weaknesses, Break foes, land criticals and take hits.',
      `In the command menu, press {key:pageLeft} / {key:pageRight} to *Surge*: spend it to strengthen the action you pick.`,
    ],
  },
  big_attacks: {
    title: 'Big Attacks', guide: 'Big Attacks',
    text: () => [
      'A foe that is *Charging* (⚡) or *Winding Up* (⚠) will unleash something big on its next turn.',
      'Guard to halve it. Better: Break the foe before it acts, and the attack is lost.',
    ],
  },
  link_arts: {
    title: 'Link Arts', guide: 'Afterglow',
    text: () => [
      '*Link Arts* are combination techniques between friends. When enough Afterglow is stored and the partners are free to act, pick *Link Arts* in the command menu.',
      'A Link Art spends the Afterglow shown beside it and pushes the partners\' next turns back a little.',
    ],
  },
  foes: {
    title: 'How Foes Fight', guide: 'How Foes Fight',
    text: () => [
      'Foes think. A *healer* mends the most hurt of its side, so put it down first. A pack piles onto whoever its leader has *Marked*: Guard, or keep that friend healed.',
      'A *thief* steals gold and runs; fell it before it goes and you get the gold back. And once a status bounces off someone, foes stop trying it on them.',
    ],
  },
  crests: {
    title: 'Crests & Supports', guide: 'Crests',
    text: () => [
      `In the menu ({key:menu}), *Crests* sets each character's *Primary* Crest (stats, weapons, Arts) and *Secondary* Crest (its Arts too). Crests rank up with CP from battle.`,
      'Each rank teaches an Art or a *Support*, a passive that stays yours whatever you wear. Equip Supports under *Supports*. Two Crests at rank 5 braid into a Tier II Crest.',
    ],
  },
  mastery: {
    title: 'Mastery & Ascension', guide: 'Mastery & Ascension',
    text: () => [
      'A Crest at rank 10 is *mastered*: it leaves a *Legacy*, a bonus that stays with that character whatever Crest they wear.',
      'Its CP keeps flowing into five *Ascension* stars: more stats and stronger Arts, and two *Mastery Arts* to learn. Read every Art in detail under *Arts* in the menu.',
    ],
  },
  formation: {
    title: 'Formation', guide: 'Formation',
    text: () => [
      'Only the first four in your *Formation* fight. Change the order on the menu\'s Formation screen.',
      'In battle, *Swap* brings a reserve member in for the one whose turn it is.',
    ],
  },
  equipment: {
    title: 'Equipment', guide: 'Equipment',
    text: () => [
      `New gear! Open *Equipment* in the menu ({key:menu}) to put it on. What each character can wear depends on their primary Crest.`,
      `Press {key:info} there to *Optimize*: the best you own, all at once.`,
    ],
  },
  saving: {
    title: 'Saving', guide: 'Saving',
    text: () => [
      '*Hearthstones* restore the party and let you save. You can also save from the menu almost anywhere.',
      `The game *autosaves* too, into three rotating slots. On the Save or Load screen, {key:info} exports a save to a file or imports one.`,
    ],
  },
  world_map: {
    title: 'The World Map', guide: 'Travel',
    text: () => [
      'Pick a place and go. The marker shows where your objective lies, and blue ones mark side quests.',
      'Towns and the Hearthstones you have touched can be reached at once with *Travel* in the menu.',
    ],
  },
  side_quests: {
    title: 'Side Quests', guide: 'Side Quests',
    text: () => [
      'A *side quest*: optional, and kept in the *Journal* in the menu.',
      'Blue *◆* markers show where side quests lead: over people and places, on the minimap and on the world map. Settings → Side Quest Markers turns them off.',
    ],
  },
  riding: {
    title: 'Riding', guide: 'Riding Kindle',
    text: () => [
      `*Kindle* the Emberhart carries you on open roads and in the wilds. Press {key:ride} to ride, and again to get down.`,
      'Kindle runs faster than you can, and nothing from the Gloam catches you while you ride: no random battles. Towns, buildings and dungeons are on foot.',
    ],
  },
  compendium: {
    title: 'The Compendium', guide: 'Compendium',
    text: () => [
      `*The Compendium* is in the menu ({key:menu}). It records every creature you meet, chapter by chapter, with *???* where something is still out there.`,
      `It fills in as you learn: weaknesses you strike or Scan, resistances you run into, moves you see. Fell three of a kind to learn its tactics. {key:pageLeft} / {key:pageRight} turn the sections.`,
    ],
  },
  marks: {
    title: 'Marks', guide: 'Marks',
    text: () => [
      'A *mark*: a named rare beast on Greer\'s Ledger. It hits hard, can\'t be fled, and winds up for a big move.',
      'Hunt it now, or leave it be and come back stronger. Tell Greer when you fell one: she pays for every mark.',
    ],
  },
  lost_crests: {
    title: 'Lost Callings', guide: 'Crests',
    text: () => [
      'A *Lost Calling*: a Crest the Choir struck from its rolls. Its quest leads to a slab of crest-glass where a guardian waits.',
      'Win, and the Crest is yours to wear like any other. The Crests screen shows a rumor of where each lost one begins.',
    ],
  },
};
