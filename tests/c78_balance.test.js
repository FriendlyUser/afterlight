// Balance probe (not a story test): auto-battle the ch7/ch8 bosses at the intended levels.
// tools/test.sh c78_balance 900000  — logs win/lose and game-seconds per fight.
import { FieldScene } from '../src/world/FieldScene.js';
import { EQUIPMENT } from '../src/data/equipment.js';

const KIT = {
  wren: { weapon: 'ashen_blade', body: 'ashen_armor', head: 'ashen_helm' },
  ilse: { weapon: 'ashen_staff', body: 'ashen_robe', head: 'ashen_veil' },
  pip: { weapon: 'ashen_fang', body: 'ashen_coat', head: 'ashen_hood' },
  bram: { weapon: 'starsteel_sword', offhand: 'ashen_bulwark', body: 'ashen_armor', head: 'ashen_helm' },
};

export async function run(game, h) {
  const st = game.state;
  const setParty = (ids, lv) => {
    st.party = [];
    for (const id of ids) {
      const c = st.joinParty(id);
      c.level = 1;
      c.setLevel(lv);
      for (const [slot, item] of Object.entries(KIT[id])) if (EQUIPMENT[item]) c.equipment[slot] = item;
      c.crests[c.crest] = 440; // rank 8: a plausible Act II main Crest
      c.fullHeal();
    }
  };
  setParty(['wren'], 40);
  game.start(new FieldScene(game), { mapId: 'ruined_aurenne', x: 20, y: 30, dir: 'up' });
  Object.assign(st.flags, { c7_arrived: true });
  await h.idle();
  const fight = async (troop, ids, lv) => {
    setParty(ids, lv);
    const t0 = game.time;
    let r;
    await game.scene.runScript(async (s) => { r = await s.battle(troop, { loseOk: true }); });
    await h.idle();
    h.log(`${troop} ${ids.join('+')}@${lv}: ${r} in ${Math.round(game.time - t0)}s`);
  };
  await fight('c7_boss_choir', ['wren', 'ilse'], 41);
  await fight('c7_boss_clapper', ['wren', 'ilse'], 42);
  await fight('c8_boss_engine', ['wren', 'ilse', 'pip'], 44);
  await fight('c8_boss_penitent', ['wren', 'ilse', 'bram'], 46);
}
