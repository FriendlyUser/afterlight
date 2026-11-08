// Arts: every Art a party member knows, by Crest, with full details (data/artInfo.js).
// The Arts of the primary and secondary Crests come first — those are usable in battle —
// then their Mastery Arts still to unlock (with the CP to go), then Arts learned on
// other Crests (equip that Crest to use them).

import { el, richText } from '../UI.js';
import { header, KEYS, ListView } from './common.js';
import { MemberScreen } from './CrestScreen.js';
import { CRESTS, ASCEND_CP } from '../../data/crests.js';
import { SKILLS } from '../../data/skills.js';
import { artDetails } from '../../data/artInfo.js';

export class ArtsScreen extends MemberScreen {
  constructor(menus, memberIndex) {
    super(menus, 'arts-screen', memberIndex);
    this.build();
  }

  /** [{ id, crest, slot: 'primary'|'secondary'|'other', rank?, stars?, locked }] */
  entries() {
    const ch = this.ch;
    const out = [];
    const seen = new Set();
    const add = (crest, slot) => {
      CRESTS[crest].ranks.forEach((u, i) => {
        if (!u.skill || i >= ch.rankOf(crest) || seen.has(u.skill)) return;
        seen.add(u.skill);
        out.push({ id: u.skill, crest, slot, rank: i + 1, locked: false });
      });
      for (const m of ch.masteryArts(crest)) {
        if (seen.has(m.skill) || (!m.learned && slot === 'other')) continue;
        seen.add(m.skill);
        out.push({ id: m.skill, crest, slot, stars: m.stars, locked: !m.learned });
      }
    };
    if (!ch.sealed) {
      add(ch.crest, 'primary');
      if (ch.secondary) add(ch.secondary, 'secondary');
    }
    for (const c of Object.keys(ch.crests)) if (c !== ch.crest && c !== ch.secondary) add(c, 'other');
    // Usable first, then locked previews, then other Crests.
    const order = (e) => (e.slot === 'other' ? 2 : e.locked ? 1 : 0);
    return out.sort((a, b) => order(a) - order(b));
  }

  build() {
    const ch = this.ch;
    this.el.innerHTML = header(`Arts — ${ch.name}`, `${KEYS.nav} ${KEYS.back} ${KEYS.swap}`);
    const body = el('div', 'cs-body arts-body');
    const left = el('div', 'cs-left panel');
    const items = this.entries();
    this.list = new ListView({
      items,
      pageSize: 15,
      empty: ch.sealed ? 'Their Crest has not awakened yet.' : 'No Arts yet. Rank up a Crest to learn them.',
      render: (e) => {
        const s = SKILLS[e.id];
        const c = CRESTS[e.crest];
        const tag = e.stars ? `<span class="am">★${e.stars}</span>` : '';
        const mp = s.mp ? `<span class="amp">${s.mp} MP</span>` : '';
        return `<span class="ci" style="color:${c.color}">${c.icon}</span><span class="an ${e.slot === 'other' || e.locked ? 'locked' : ''}">${e.locked ? '🔒 ' : ''}${s.name}</span>${tag}${mp}`;
      },
    });
    left.appendChild(this.list.el);
    this.detail = el('div', 'cd-panel panel arts-detail');
    body.append(left, this.detail);
    this.el.appendChild(body);
    this.renderDetail();
  }

  renderDetail() {
    const e = this.list.current;
    if (!e) {
      this.detail.innerHTML = '<div class="dim">Arts are learned from Crest ranks; mastered Crests teach two Mastery Arts more, at their first and third Ascension stars (★).</div>';
      return;
    }
    const ch = this.ch;
    const s = SKILLS[e.id];
    const c = CRESTS[e.crest];
    const mods = ch.modifiers().mods;
    const mp = s.mp ? Math.max(0, Math.round(s.mp * (1 + (mods.mpCost || 0) / 100))) : 0;
    const d = artDetails(s, { mp, powerMult: ch.artPower()[e.id] || 1 });
    const source = e.stars ? `Mastery Art — ★${e.stars}` : `Rank ${e.rank}`;
    let status;
    if (e.locked) {
      const need = ASCEND_CP[e.stars - 1] - (ch.crests[e.crest] || 0);
      status = `<div class="art-state no">Unlocks at ${c.name} ★${e.stars} — ${need} CP to go${ch.rankOf(e.crest) < 10 ? ' (master the Crest first)' : ''}</div>`;
    } else if (e.slot === 'other') {
      status = `<div class="art-state no">Equip ${c.name} as primary or secondary Crest to use it in battle.</div>`;
    } else {
      status = `<div class="art-state ok">Usable in battle (${e.slot} Crest).</div>`;
    }
    this.detail.innerHTML = `<div class="cd-name">${s.name}</div>
      <div class="cd-tier"><span style="color:${c.color}">${c.icon} ${c.name}</span> · ${source}</div>
      ${status}
      <div class="art-line big">${d.line}</div>
      ${d.effects.length ? `<ul class="art-fx-list">${d.effects.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
      <div class="cd-desc">${richText(s.desc || '')}</div>`;
  }

  handleInput(input) {
    if (this.switchMember(input)) return;
    const r = this.list.handle(input, (x) => this.sfx(x));
    if (r === 'move') this.renderDetail();
    if (r === 'cancel') { this.sfx('cancel'); this.close(); }
  }
}
