// Field minimap: the current map's floor plan, drawn once per scene into an
// offscreen canvas (floor, water, raised ground, exits, Hearthstones, doors),
// then blitted each frame with the party's position and facing. Hidden during
// scripted scenes, on single-room maps, and when the player turns it off in Settings.

import { el } from '../ui/UI.js';

const MAX_SIZE = 168; // CSS pixels for the longer side
const SMALL_MAP = 300; // tiles: rooms and huts smaller than this get no minimap
const COLORS = {
  floor: '#cdbf9c', high: '#e6dcc0', water: '#4f86b8', exit: '#ffd070', save: '#7ff0ff', door: '#ffb070',
};

export class Minimap {
  constructor(field) {
    this.field = field;
    const { w, h } = field.grid;
    this.scale = Math.max(2, Math.floor(MAX_SIZE / Math.max(w, h)));
    this.tiny = w * h < SMALL_MAP; // a single room needs no map
    this.base = this.drawBase();
    this.el = el('div', 'minimap');
    this.canvas = document.createElement('canvas');
    this.canvas.width = w * this.scale;
    this.canvas.height = h * this.scale;
    this.el.appendChild(this.canvas);
    field.hud.appendChild(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.last = '';
  }

  /** The static floor plan. */
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
    return cv;
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
    const show = !this.tiny && !f.state.settings.hideMinimap && !f.busy && !f.map.noMinimap;
    this.el.style.display = show ? '' : 'none';
    if (!show) return;
    const p = f.player;
    const key = `${p.x.toFixed(1)},${p.z.toFixed(1)},${p.dir}`;
    if (key === this.last) return; // redraw only when the party moved
    this.last = key;
    const k = this.scale, c = this.ctx;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.drawImage(this.base, 0, 0);
    const px = p.x * k, py = p.z * k, r = Math.max(4, k * 1.4);
    const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir] || [0, 1];
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
}
