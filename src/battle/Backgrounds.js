// Battle stage presets. The stage is a small generated diorama using the
// same map legend as the field (see world/Legend.js).
//   ground/back/front/patch: ground chars; props: back-row prop chars;
//   decor: sparse small props on the battlefield; mood: lighting preset.

export const BATTLE_BACKGROUNDS = {
  grass: { ground: '.', back: ',', patch: ':', props: ['T', 'T', 'b', 'B', 'P'], decor: ['f', 'g', 'o'], mood: 'day' },
  beach: { ground: 's', back: '.', front: '~', props: ['Y', 'R', 'b', 'Y'], decor: ['o', 'g'], mood: 'day', backHeight: 1 },
  beach_night: { ground: 's', back: '.', front: '~', props: ['Y', 'R', 'b'], decor: ['o'], mood: 'storm', backHeight: 1 },
  cave: { ground: 'c', back: 'C', patch: 'o', props: ['A', '*', 'A'], decor: ['o', 'G'], mood: 'cave', density: 0.25 },
  tidecave: { ground: 'c', back: 'C', front: 'w', patch: 'o', props: ['A', '*'], decor: ['o', 'G', 'x'], mood: 'cave', density: 0.3 },
  forest: { ground: ',', back: ',', patch: ':', props: ['T', 'P', 'T', 'b'], decor: ['m', 'f', 'g'], mood: 'forest', density: 0.6 },
  wold: { ground: ',', back: ',', patch: 'o', props: ['T', 'Z', 'P', 'b'], decor: ['G', 'm', 'g'], mood: 'forest', density: 0.65, treeType: 'tree_autumn' },
  road: { ground: ':', back: '.', patch: 'd', props: ['T', 'b', 'R', 'F'], decor: ['o', 'g', 'f'], mood: 'day' },
  fields: { ground: 'k', back: 'k', patch: ':', props: ['h', 'F', 'T', 'b'], decor: ['g', 'f'], mood: 'day', treeType: 'tree_autumn' },
  town: { ground: ';', back: ';', props: ['O', 'C', 'L', 'k'], decor: ['o'], mood: 'day' },
  undercroft: { ground: '_', back: 'S', patch: 'p', props: ['^', '|', 'x'], decor: ['x', 'd'], mood: 'cave', density: 0.2 },
  desert: { ground: 's', back: 's', patch: 'g', props: ['c', 'R', 'x', 'c'], decor: ['o', 'x'], mood: 'desert', backHeight: 2 },
  snow: { ground: '*', back: '*', patch: 'i', props: ['P', 'R', 'P'], decor: ['o'], mood: 'snow', treeType: 'pine_snow' },
  swamp: { ground: 'm', back: ',', patch: 'p', props: ['D', 'n', 'T', 'n'], decor: ['n', 'G', 'm'], mood: 'swamp', density: 0.5 },
  verdance: { ground: ',', back: 'o', patch: '.', props: ['T', 'K', 'T', 'Z'], decor: ['G', 'f', 'B'], mood: 'forest', density: 0.7 },
  sky: { ground: '_', back: ' ', props: [], decor: [], mood: 'day', backHeight: 0 },
  temple: { ground: 'M', back: 'K', patch: 'x', props: ['|', 'q', '^'], decor: [], mood: 'temple', density: 0.4 },
  deck: { ground: '=', back: '+', props: ['O', 'C', 'k'], decor: [], mood: 'day', backdrop: 'ocean' },
  ruin: { ground: 'a', back: 'r', patch: 'q', props: ['!', 'd', '%', 'D'], decor: ['d', 'x'], mood: 'ruin', density: 0.45 },
  gloam: { ground: 'u', back: 'U', patch: 'a', props: ['%', 'Z'], decor: ['%'], mood: 'gloam', density: 0.4 },
  evernoon: { ground: 'M', back: 'M', patch: ';', props: ['|', 'Q', 'K', 'S'], decor: ['f'], mood: 'evernoon', density: 0.35, treeType: 'tree_cherry' },
  lantern: { ground: '_', back: 'S', props: ['^', '|'], decor: [], mood: 'dusk', density: 0.3 },
  colosseum: { ground: 's', back: 'M', patch: 'd', props: ['q', '|', '^', 'S'], decor: ['o', 'd'], mood: 'day', density: 0.4, backHeight: 3 },
};
