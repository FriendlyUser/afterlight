// The field main menu: command list + party overview. Opens sub-screens.

import { el } from '../UI.js';
import { Screen, ListView, partyCard, header, KEYS } from './common.js';
import { formatTime } from '../../core/util.js';
import { ACTIVE_PARTY_SIZE } from '../../state/GameState.js';
import { WORLD_NODES } from '../../data/worldmap.js';
import { nodeUnlocked } from '../../world/WorldMapScene.js';

const COMMANDS = [
  { id: 'items', label: 'Items', icon: '⚗' },
  { id: 'crests', label: 'Crests', icon: '✦', pick: true },
  { id: 'supports', label: 'Supports', icon: '❖', pick: true },
  { id: 'equip', label: 'Equipment', icon: '⚔', pick: true },
  { id: 'status', label: 'Status', icon: '☰', pick: true },
  { id: 'formation', label: 'Formation', icon: '⇅' },
  { id: 'travel', label: 'Travel', icon: '✈' },
  { id: 'bestiary', label: 'Bestiary', icon: '❦' },
  { id: 'journal', label: 'Journal', icon: '✎' },
  { id: 'guide', label: 'Guide', icon: '?' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
  { id: 'save', label: 'Save', icon: '✚' },
  { id: 'title', label: 'Quit to Title', icon: '⏻' },
];

export class MainMenu extends Screen {
  constructor(menus, field) {
    super(menus, 'main-menu');
    this.field = field;
    this.mode = 'commands';
    this.cmdList = new ListView({
      items: COMMANDS.map((c) => ({ ...c, disabled: (c.id === 'save' && !this.canSave()) || (c.id === 'travel' && !this.canTravel()) })),
      render: (c) => `<span class="mi-icon">${c.icon}</span>${c.label}`,
      pageSize: 12,
      cls: 'cmd-col',
    });
    this.memberIndex = 0;
    this.build();
  }

  canSave() { return !this.field?.map?.noSave && !this.state.flags.noSave; }

  /** Fast travel needs an unlocked destination and a map that allows it (not dungeons). */
  canTravel() {
    if (!this.field || this.field.map.noTravel || this.state.flags.noTravel) return false;
    const act = this.state.flags.sundered ? 2 : 1;
    return WORLD_NODES.some((n) => (n.act || 1) === act && nodeUnlocked(n, this.state));
  }

  build() {
    this.el.innerHTML = '';
    const left = el('div', 'mm-left panel');
    left.appendChild(this.cmdList.el);
    const right = el('div', 'mm-right');
    this.cards = el('div', 'mm-cards');
    right.appendChild(this.cards);
    const foot = el('div', 'mm-foot panel');
    this.foot = foot;
    this.el.append(left, right, foot);
    this.refresh();
  }

  refresh() {
    this.cards.innerHTML = '';
    this.state.allMembers().forEach((ch, i) => {
      this.cards.appendChild(partyCard(ch, { active: i < ACTIVE_PARTY_SIZE, selected: this.mode === 'pick' && i === this.memberIndex }));
    });
    const loc = this.state.location.name || '';
    this.foot.innerHTML = `<span class="mf-gold"><b>${this.state.gold.toLocaleString()}</b> G</span>
      <span class="mf-time">⏱ ${formatTime(this.state.playtime)}</span>
      <span class="mf-loc">${loc}</span>
      <span class="mf-ch">${this.state.chapter === 0 ? 'Prologue' : `Chapter ${this.state.chapter}`}</span>`;
    this.cmdList.refresh();
  }

  handleInput(input) {
    if (this.mode === 'pick') return this.handlePick(input);
    const r = this.cmdList.handle(input, (s) => this.sfx(s));
    if (r === 'cancel' || input.pressed('menu')) { input.consumeAll(); this.sfx('cancel'); this.close(); return; }
    if (r !== 'confirm') return;
    const cmd = this.cmdList.current;
    if (cmd.disabled) { this.sfx('buzzer'); return; }
    this.sfx('confirm');
    if (cmd.pick) { this.mode = 'pick'; this.pending = cmd.id; this.refresh(); return; }
    this.run(cmd.id);
  }

  handlePick(input) {
    const n = this.state.party.length;
    if (input.repeat('up') || input.repeat('left')) { this.memberIndex = (this.memberIndex + n - 1) % n; this.sfx('cursor'); this.refresh(); }
    if (input.repeat('down') || input.repeat('right')) { this.memberIndex = (this.memberIndex + 1) % n; this.sfx('cursor'); this.refresh(); }
    if (input.pressed('cancel')) { input.consumeAll(); this.sfx('cancel'); this.mode = 'commands'; this.refresh(); return; }
    if (input.pressed('confirm')) {
      input.consumeAll();
      this.sfx('confirm');
      this.mode = 'commands';
      this.run(this.pending, this.memberIndex);
    }
  }

  async run(id, memberIndex = 0) {
    const m = this.menus;
    this.el.classList.add('dim');
    switch (id) {
      case 'items': await m.screen('items').open(); break;
      case 'crests': await m.screen('crests', memberIndex).open(); break;
      case 'supports': await m.screen('supports', memberIndex).open(); break;
      case 'equip': await m.screen('equip', memberIndex).open(); break;
      case 'status': await m.screen('status', memberIndex).open(); break;
      case 'formation': await m.screen('formation').open(); break;
      case 'travel': this.close(); this.field.openWorldMap(); return;
      case 'bestiary': await m.screen('bestiary').open(); break;
      case 'journal': await m.screen('journal').open(); break;
      case 'guide': await m.screen('guide').open(); break;
      case 'settings': await m.screen('settings').open(); break;
      case 'save': await m.openSave(); break;
      case 'title': {
        const yes = await this.game.ui.choice(['Return to title', 'Cancel'], { prompt: 'Unsaved progress will be lost.', cancel: 1 });
        if (yes === 0) { this.close(); this.game.returnToTitle?.(); return; }
        break;
      }
      default: break;
    }
    this.el.classList.remove('dim');
    this.refresh();
  }
}

export { header, KEYS };
