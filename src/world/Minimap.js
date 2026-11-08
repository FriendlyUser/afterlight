// Field minimap: the current map's floor plan, drawn once per scene into an
// offscreen canvas (floor, water, raised ground, exits, Hearthstones, doors),
// then blitted each frame with the party's position and facing, and the quest
// markers (gold diamonds; blue for side quests). Hidden during scripted scenes,
// on single-room maps, and when the player turns it off in Settings.
//
// The Map key (M) — or the ⤢ button on the minimap — enlarges it into an area map in
// the middle of the screen: the whole map at a readable scale, its name, where each
// exit leads, and a legend. The party stops while it's open; Map, Cancel or Confirm
// closes it.

import { el } from '../ui/UI.js';
import { keyCap } from '../core/Input.js';
import { MAPS } from '../data/maps/index.js';

const MAX_SIZE = 168; // CSS pixels for the longer side
const LARGE_SIZE = 900; // canvas pixels for the longer side of the area map
const SMALL_MAP = 300; // tiles: rooms and huts smaller than this get no minimap
const COLORS = {
  floor: '#cdbf9c', high: '#e6dcc0', water: '#4f86b8', exit: '#ffd070', save: '#7ff0ff', door: '#ffb070',
};

export class Minimap {
  constructor(field) {
    this.field = field;
    const { w, h } = field.grid;
    this.tiny = w * h < SMALL_MAP; // a single room needs no map
    this.large = false;
    this.el = el('div', 'minimap');
    this.title = el('div', 'mm-title', `<b>${field.map.name || ''}</b><span>${field.map.region || ''}</span>`);
    this.canvas = document.createElement('canvas');
    this.legend = el('div', 'mm-legend', [
      '<i class="you">▲</i> You', '<i class="obj">◆</i> Objective', '<i class="side">◆</i> Side quest',
      '<i class="exit">■</i> Exit', '<i class="save">■</i> Hearthstone', '<i class="door">■</i> Door',
    ].map((s) => `<span>${s}</span>`).join('') + `<span class="mm-close">${keyCap('map')} Close</span>`);
    this.expand = el('button', 'mm-expand', '⤢');
    this.expand.title = 'Enlarge the map';
    this.expand.addEventListener('click', (e) => { e.stopPropagation(); this.toggleLarge(); });
    this.el.append(this.title, this.canvas, this.legend, this.expand);
    field.hud.appendChild(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.setScale(Math.max(2, Math.floor(MAX_SIZE / Math.max(w, h))));
  }

  /** Can this map be shown at all (the area map ignores the Settings toggle). */
  get available() { return !this.tiny && !this.field.map.noMinimap; }

  setScale(k) {
    const { w, h } = this.field.grid;
    this.scale = k;
    this.base = this.drawBase();
    this.canvas.width = w * k;
    this.canvas.height = h * k;
    this.last = '';
  }

  /** Open or close the area map. Returns false when there's no map of this place. */
  toggleLarge(on = !this.large) {
    if (on && !this.available) return false;
    if (on === this.large) return true;
    this.large = on;
    const { w, h } = this.field.grid;
    this.el.classList.toggle('large', on);
    this.setScale(on ? Math.max(6, Math.min(18, Math.floor(LARGE_SIZE / Math.max(w, h)))) : Math.max(2, Math.floor(MAX_SIZE / Math.max(w, h))));
    this.field.game.audio?.sfx(on ? 'confirm' : 'cancel');
    this.update();
    return true;
  }

  /** The static floor plan (with exit names on the area map). */
  drawBase() {
    const { grid, map, built } = this.field;
    const k = this.scale;
    const cv = document.createElement('canvas');
    cv.width = grid.w * k;
    cv.height = grid.h * k;
    const g = cv.getContext('2d');
    const baseLevel = this.commonLevel();
    for (let y = 0; y < grid.h; y++) {
      for (let x = 0; x < grid.w; x++) {
        const d = grid.def(x, y);
        if (d.void || (!grid.walkable(x, y) && !d.water)) continue;
        g.fillStyle = d.water ? COLORS.water : grid.level(x, y) > baseLevel ? COLORS.high : COLORS.floor;
        g.fillRect(x * k, y * k, k, k);
      }
    }
    const mark = (x, y, w, h, color) => { g.fillStyle = color; g.fillRect(x * k, y * k, w * k, h * k); };
    for (const e of map.exits || []) mark(e.x, e.y, e.w || 1, e.h || 1, COLORS.exit);
    for (const [key, tag] of grid.tags) if (tag.door) { const [x, y] = key.split(',').map(Number); mark(x, y, 1, 1, COLORS.door); }
    for (const i of built.interactables || []) if (i.kind === 'save') mark(i.x - 0.25, i.y - 0.25, 1.5, 1.5, COLORS.save);
    if (this.large) this.labelExits(g);
    return cv;
  }

  /** Area map: where each exit leads, written beside it (kept inside the map). */
  labelExits(g) {
    const { grid, map } = this.field;
    const k = this.scale;
    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-caps').trim() || 'serif';
    g.font = `${Math.max(11, Math.round(k * 1.05))}px ${family}`;
    g.textBaseline = 'middle';
    const seen = new Set();
    for (const e of map.exits || []) {
      const name = e.to === '@world' ? 'World map' : MAPS[e.to]?.name;
      if (!name || seen.has(`${name}@${e.x},${e.y}`)) continue;
      seen.add(`${name}@${e.x},${e.y}`);
      const cx = (e.x + (e.w || 1) / 2) * k, cy = (e.y + (e.h || 1) / 2) * k;
      const tw = g.measureText(name).width;
      // Push the label inward from whichever edge the exit sits on (side exits: just
      // above the opening, where the party marker won't cover it on arrival).
      let x = cx - tw / 2, y = cy;
      if (e.x <= 1) { x = e.x * k + 2; y = e.y * k - k * 0.8; }
      else if (e.x + (e.w || 1) >= grid.w - 1) { x = (e.x + (e.w || 1)) * k - tw - 2; y = e.y * k - k * 0.8; }
      if (e.y <= 1) y = (e.y + (e.h || 1)) * k + k * 0.9;
      else if (e.y + (e.h || 1) >= grid.h - 1) y = e.y * k - k * 0.9;
      x = Math.max(2, Math.min(grid.w * k - tw - 2, x));
      y = Math.max(k, Math.min(grid.h * k - k, y));
      g.lineWidth = 3;
      g.strokeStyle = 'rgba(20, 14, 10, 0.85)';
      g.strokeText(name, x, y);
      g.fillStyle = '#ffe3a0';
      g.fillText(name, x, y);
    }
  }

  /** The most common floor height, so higher ground can be drawn lighter. */
  commonLevel() {
    const { grid } = this.field;
    const count = new Map();
    for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) if (grid.walkable(x, y)) count.set(grid.level(x, y), (count.get(grid.level(x, y)) || 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  }

  update() {
    const f = this.field;
    if (this.large && (f.busy || !this.available)) this.toggleLarge(false); // a scene started
    const show = this.available && (this.large || !f.state.settings.hideMinimap) && !f.busy;
    this.el.style.display = show ? '' : 'none';
    if (!show) return;
    const p = f.player;
    const quest = f.quest?.group.visible ? f.quest.spots : [];
    const key = `${p.x.toFixed(1)},${p.z.toFixed(1)},${p.dir}|${quest.map((q) => `${q.x.toFixed(1)},${q.z.toFixed(1)}${q.side ? 's' : ''}`).join(';')}`;
    if (key === this.last) return; // redraw only when the party moved
    this.last = key;
    const k = this.scale, c = this.ctx;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.drawImage(this.base, 0, 0);
    const px = p.x * k, py = p.z * k, r = Math.max(4, k * (this.large ? 0.8 : 1.4));
    const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir] || [0, 1];
    const qr = Math.max(4, k * (this.large ? 0.75 : 1.5));
    for (const q of [...quest].sort((a, b) => (b.side ? 1 : 0) - (a.side ? 1 : 0))) this.drawQuest(q.x * k, q.z * k, qr, q.side); // gold on top
    c.fillStyle = 'rgba(255, 250, 235, 0.45)'; // halo so the marker reads on any floor
    c.beginPath();
    c.arc(px, py, r * 1.9, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#ff5a3c';
    c.strokeStyle = '#2a1008';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(px + dx * r * 1.6, py + dy * r * 1.6); // arrow tip in the facing direction
    c.lineTo(px - dy * r - dx * r * 0.6, py + dx * r - dy * r * 0.6);
    c.lineTo(px + dy * r - dx * r * 0.6, py - dx * r - dy * r * 0.6);
    c.closePath();
    c.fill();
    c.stroke();
  }

  /** A quest marker: a gold diamond (blue for a side quest). */
  drawQuest(x, y, r, side = false) {
    const c = this.ctx;
    c.fillStyle = side ? '#6cc0ff' : '#ffd36a';
    c.strokeStyle = side ? '#08223a' : '#3a2408';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(x, y - r * 1.3);
    c.lineTo(x + r, y);
    c.lineTo(x, y + r * 1.3);
    c.lineTo(x - r, y);
    c.closePath();
    c.fill();
    c.stroke();
  }
}
