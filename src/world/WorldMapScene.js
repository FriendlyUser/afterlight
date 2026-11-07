// World map: fast travel between unlocked destinations. Painted procedurally
// as pixel art — a parchment continent before the Sundering, a shattered sky
// archipelago with seven burning sun-wounds after it.

import { el } from '../ui/UI.js';
import { keyCap } from '../core/Input.js';
import { WORLD_NODES, openNodes } from '../data/worldmap.js';
import { fbm, RNG } from '../core/util.js';
import { WORLD, activeTargets, route } from './QuestGuide.js';

const W = 320, H = 180;           // pixel-art canvas
const SCALE_X = W / 1000, SCALE_Y = H / 750;

// Biome hints by node id fragments (tints the land near a node).
const BIOMES = [
  { match: /salt|sunscar|desert/, color: [214, 186, 120] },
  { match: /frost|greyspine|snow/, color: [228, 236, 242] },
  { match: /mire|swamp|bog/, color: [104, 128, 84] },
  { match: /thorn|verdance|wold|forest/, color: [70, 112, 70] },
  { match: /aurenne|thistle/, color: [168, 160, 110] },
];

/** Where the info panel may sit, and which markers (map units 1000×750, label included) it would hide. */
const PANEL_CORNERS = [
  { cls: 'bl', covers: (n) => n.x < 370 && n.y > 490 },
  { cls: 'tl', covers: (n) => n.x < 370 && n.y < 290 },
  { cls: 'br', covers: (n) => n.x > 630 && n.y > 465 },
  { cls: 'tr', covers: (n) => n.x > 630 && n.y < 290 },
];

/** Marker style: side quests (diamond), the post-game Abyss (violet), else a town/story dot. */
function nodeKind(n) {
  if (n.id.startsWith('pg_')) return 'deep';
  if (n.id.startsWith('side_')) return 'side';
  return 'story';
}


export class WorldMapScene {
  constructor(game) {
    this.game = game;
    this.time = 0;
  }

  get state() { return this.game.state; }

  enter() {
    const st = this.state;
    const act = st.flags.sundered ? 2 : 1;
    this.act = act;
    this.nodes = openNodes(st);
    const cur = this.nodes.findIndex((n) => n.mapId === st.location.mapId);
    this.index = Math.max(0, cur);

    this.root = el('div', 'worldmap');
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    this.canvas.className = 'wm-canvas';
    this.root.appendChild(this.canvas);
    this.markers = el('div', 'wm-markers');
    this.root.appendChild(this.markers);
    this.info = el('div', 'wm-info panel');
    this.root.appendChild(this.info);
    this.root.appendChild(el('div', 'wm-title', act === 1 ? 'Solmere' : 'The Ruin of Solmere'));
    this.root.appendChild(el('div', 'wm-hint', `${keyCap('left')}${keyCap('up')}${keyCap('down')}${keyCap('right')} Choose · ${keyCap('confirm')} Travel · ${keyCap('cancel')} Close`));
    this.game.ui.layers.menus.appendChild(this.root);
    this.paintBase();
    this.buildMarkers();
    this.refresh();
    this.widget = { el: null, handleInput: (input) => this.handleInput(input) };
    this.game.ui.push(this.widget);
    this.game.audio?.playMusic(act === 1 ? 'field' : 'ruin');
  }

  exit() {
    this.game.ui.remove(this.widget);
    this.root.remove();
  }

  // ------------------------------------------------------------------ painting

  paintBase() {
    const ctx = this.canvas.getContext('2d');
    const img = ctx.createImageData(W, H);
    const d = img.data;
    const seeds = this.landSeeds();
    const rng = new RNG(7);
    const sundered = this.act === 2;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const n = fbm(x / 22, y / 22, 3, 4);
        let land = -9;
        let biome = null;
        for (const s of seeds) {
          const dx = (x - s.x) / s.r, dy = (y - s.y) / (s.r * 0.8);
          const v = 1 - Math.sqrt(dx * dx + dy * dy);
          if (v > land) { land = v; biome = s.biome; }
        }
        land += (n - 0.5) * 0.5;
        // Shattering: cut the land along jagged fault lines after the Sundering.
        if (sundered) {
          const fault = Math.abs(Math.sin(x * 0.045 + Math.sin(y * 0.09) * 1.7) * Math.cos(y * 0.05 - x * 0.012));
          if (fault < 0.09) land = -1;
        }
        let c;
        if (land > 0.12) {
          const base = biome || [176, 168, 120];
          const shadeV = 0.85 + n * 0.3;
          c = base.map((v) => v * shadeV);
          if (land < 0.18) c = c.map((v) => v * 0.72); // coastline
          if (sundered) c = [c[0] * 0.6 + 40, c[1] * 0.5 + 20, c[2] * 0.6 + 50];
        } else if (sundered) {
          const g = 0.5 + 0.5 * Math.sin(y / 12 + n * 4);
          c = [26 + 30 * g, 14 + 8 * g, 48 + 30 * g]; // the abyss
          if (rng.next() < 0.002) c = [255, 200, 160];
        } else {
          const wave = (Math.sin(x * 0.4 + y * 0.9 + n * 6) > 0.92) ? 18 : 0;
          c = [40 + wave, 76 + wave, 122 + wave];
          if (land > 0.06) c = [70, 120, 160];
        }
        const i = (y * W + x) * 4;
        d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // Mountains & trees glyphs
    ctx.fillStyle = 'rgba(60,50,40,0.6)';
    for (const s of seeds) {
      if (!s.glyph) continue;
      const r2 = new RNG(Math.round(s.x * 31 + s.y));
      for (let k = 0; k < 10; k++) {
        const gx = s.x + r2.range(-s.r * 0.7, s.r * 0.7), gy = s.y + r2.range(-s.r * 0.5, s.r * 0.5);
        if (s.glyph === 'mountain') {
          ctx.fillStyle = '#7a7480'; ctx.beginPath(); ctx.moveTo(gx, gy - 4); ctx.lineTo(gx + 3, gy + 1); ctx.lineTo(gx - 3, gy + 1); ctx.fill();
          ctx.fillStyle = '#f0f4f8'; ctx.fillRect(gx - 1, gy - 4, 2, 2);
        } else if (s.glyph === 'tree') {
          ctx.fillStyle = '#2e5a36'; ctx.fillRect(gx - 1, gy - 2, 3, 3);
        }
      }
    }
    if (sundered) {
      // Seven wounds where the sun broke.
      const wounds = [[40, 20], [85, 12], [130, 24], [170, 10], [215, 22], [260, 14], [295, 28]];
      for (const [wx, wy] of wounds) {
        const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, 10);
        g.addColorStop(0, 'rgba(255,240,200,1)');
        g.addColorStop(0.35, 'rgba(255,150,80,0.9)');
        g.addColorStop(1, 'rgba(255,80,40,0)');
        ctx.fillStyle = g;
        ctx.fillRect(wx - 12, wy - 12, 24, 24);
      }
    } else {
      // Compass rose
      ctx.fillStyle = 'rgba(80,60,40,0.7)';
      ctx.fillRect(290, 140, 1, 24); ctx.fillRect(278, 152, 25, 1);
      ctx.fillStyle = 'rgba(160,40,30,0.8)'; ctx.fillRect(290, 140, 1, 6);
    }
  }

  landSeeds() {
    const seeds = [];
    // Act II draws the old continent too — broken apart by the fault lines.
    for (const n of WORLD_NODES.filter((x) => this.act === 2 || (x.act || 1) === 1)) {
      const id = `${n.id} ${n.region || ''}`.toLowerCase();
      const b = BIOMES.find((bb) => bb.match.test(id));
      const glyph = /frost|greyspine|sky/.test(id) ? 'mountain' : /thorn|verdance|wold/.test(id) ? 'tree' : null;
      seeds.push({ x: n.x * SCALE_X, y: n.y * SCALE_Y, r: /lanternfall|sky/.test(id) ? 12 : 30, biome: b?.color, glyph });
    }
    {
      // The continent body between the towns.
      for (const [x, y, r] of [[480, 470, 70], [600, 380, 60], [400, 360, 45], [700, 450, 55], [560, 560, 50], [660, 260, 45]]) {
        seeds.push({ x: x * SCALE_X, y: y * SCALE_Y, r, biome: null });
      }
    }
    return seeds;
  }

  buildMarkers() {
    this.markers.innerHTML = '';
    const st = this.game.state;
    const here = st.location.mapId;
    // The stop on the way to the current objective (Settings → Quest Guide).
    this.questNode = st.settings.hideQuestGuide ? null : route(WORLD, activeTargets(st), st)?.node ?? null;
    this.markerEls = this.nodes.map((n) => {
      const quest = n === this.questNode ? ' quest' : '';
      const m = el('div', `wm-node ${nodeKind(n)}${n.mapId === here ? ' here' : ''}${quest}`, `<i></i><span>${n.name}</span>`);
      m.style.left = `${(n.x / 1000) * 100}%`;
      m.style.top = `${(n.y / 750) * 100}%`;
      this.markers.appendChild(m);
      return m;
    });
  }

  refresh() {
    this.markerEls.forEach((m, i) => m.classList.toggle('sel', i === this.index));
    const n = this.nodes[this.index];
    const quest = n && n === this.questNode ? '<div class="wm-quest">◆ Your objective lies this way</div>' : '';
    this.info.innerHTML = n ? `<div class="cd-name">${n.name}</div><div class="cd-tier">${n.region || ''}</div><div class="cd-desc">${n.desc || ''}</div>${quest}` : '<div class="dim">Nowhere to go yet.</div>';
    const corner = this.panelCorner();
    for (const c of PANEL_CORNERS) this.info.classList.toggle(c.cls, c === corner);
  }

  /** The first corner where the info panel hides no marker (else the least crowded). */
  panelCorner() {
    const hidden = (c) => this.nodes.filter((n) => c.covers(n)).length;
    return PANEL_CORNERS.find((c) => !hidden(c)) || [...PANEL_CORNERS].sort((a, b) => hidden(a) - hidden(b))[0];
  }

  // ------------------------------------------------------------------ input

  handleInput(input) {
    const dirs = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
    for (const [k, [dx, dy]] of Object.entries(dirs)) {
      if (!input.repeat(k)) continue;
      const cur = this.nodes[this.index];
      let best = -1, bestScore = Infinity;
      this.nodes.forEach((n, i) => {
        if (i === this.index) return;
        const vx = n.x - cur.x, vy = n.y - cur.y;
        const along = vx * dx + vy * dy;
        if (along <= 0) return;
        const across = Math.abs(vx * dy - vy * dx);
        const score = along + across * 2;
        if (score < bestScore) { bestScore = score; best = i; }
      });
      if (best >= 0) { this.index = best; this.game.audio?.sfx('cursor'); this.refresh(); }
    }
    if (input.pressed('cancel')) { input.consumeAll(); this.game.audio?.sfx('cancel'); this.leave(null); }
    if (input.pressed('confirm')) {
      input.consumeAll();
      const n = this.nodes[this.index];
      if (!n) return;
      this.game.audio?.sfx('confirm');
      this.leave(n);
    }
  }

  async leave(dest) {
    if (this.leaving) return;
    this.leaving = true;
    await this.game.fadeOut(0.4);
    this.game.popScene(dest);
    if (!dest) await this.game.fadeIn(0.4);
  }

  update(dt) {
    this.time += dt;
    const pulse = 0.5 + 0.5 * Math.sin(this.time * 4);
    this.markerEls[this.index]?.style.setProperty('--pulse', pulse.toFixed(2));
  }

  render() { /* the 2D overlay is the whole view */ }
}
