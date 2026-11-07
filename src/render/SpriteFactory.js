// Procedural chibi character sprites.
//
// A "look" descriptor (see data/looks.js) is painted into a sprite sheet:
//   rows 0-3 : field walk cycles (down, left, right, up) — 3 frames of 24x32
//   row  4   : battle poses (facing left) — 8 frames of 40x32
// The sheet is cached per look id.

import * as THREE from 'three';
import { PixelCanvas, hex, ramp, shade } from './PixelCanvas.js';

export const FIELD_W = 24;
export const FIELD_H = 32;
export const BATTLE_W = 40;
export const BATTLE_H = 32;
export const FIELD_DIRS = ['down', 'left', 'right', 'up'];
export const BATTLE_POSES = ['idle', 'idle2', 'ready', 'attack', 'cast', 'hurt', 'ko', 'victory', 'guard'];
const SHEET_W = BATTLE_W * BATTLE_POSES.length;
const SHEET_H = FIELD_H * 4 + BATTLE_H;

const OUTLINE = hex('#1b1422');

// ---------------------------------------------------------------------------
// Palette preparation
// ---------------------------------------------------------------------------

function preparePalette(look) {
  const o = look.outfit || {};
  const p = {
    skin: ramp(look.skin || '#f0c8a0'),
    hair: ramp(look.hair?.color || '#5a3a28'),
    eye: hex(look.eyes || '#2c3e6b'),
    main: ramp(o.main || '#4a6fa5'),
    accent: ramp(o.accent || '#e8dcc0'),
    trim: ramp(o.trim || '#c9a24a'),
    pants: ramp(o.pants || '#5a4a3a'),
    boots: ramp(o.boots || '#3c2c22'),
    metal: ramp(o.metal || '#9aa4b4'),
    weapon: ramp(look.weaponColor || '#c8d0dc'),
    wood: ramp('#7a5634'),
    gold: ramp('#d9a93c'),
    blush: hex('#e88a8a'),
    white: hex('#fbf7ee'),
  };
  p.lash = shade(p.hair[0], -0.15);
  return p;
}

// ---------------------------------------------------------------------------
// Layout per build
// ---------------------------------------------------------------------------

function layoutFor(look, cx) {
  const build = look.build || 'adult';
  const base = 30; // bottom boot row
  if (build === 'child') {
    return { build, cx, base, hy: 15, torsoY: 21, torsoH: 6, legH: 2, torsoW: 8, headR: 5.8 };
  }
  if (build === 'large') {
    return { build, cx, base, hy: 10.5, torsoY: 17, torsoH: 9, legH: 3, torsoW: 10, headR: 6 };
  }
  if (build === 'tall') {
    return { build, cx, base, hy: 9.5, torsoY: 16, torsoH: 8, legH: 5, torsoW: 8, headR: 5.8 };
  }
  return { build, cx, base, hy: 10.5, torsoY: 17, torsoH: 8, legH: 4, torsoW: 8, headR: 6 };
}

// ---------------------------------------------------------------------------
// Head, face & hair
// ---------------------------------------------------------------------------

function drawHead(pc, look, p, L, view, opts = {}) {
  const { cx, hy, headR } = L;
  pc.shadedEllipse(cx, hy, headR, headR - 0.2, p.skin);

  if (view === 'front') {
    const ey = Math.round(hy + 1);
    const lx = cx - 4, rx = cx + 2;
    if (opts.eyesClosed) {
      pc.rect(lx, ey + 1, 2, 1, p.lash);
      pc.rect(rx, ey + 1, 2, 1, p.lash);
    } else {
      for (const ex of [lx, rx]) {
        pc.rect(ex, ey, 2, 1, p.lash);
        pc.set(ex, ey + 1, p.eye);
        pc.set(ex + 1, ey + 1, shade(p.eye, 0.25));
      }
    }
    if (look.blush) { pc.set(lx - 1, ey + 3, p.blush); pc.set(rx + 2, ey + 3, p.blush); }
    pc.set(cx, ey + 4, p.skin[0]);
  } else if (view === 'side') {
    const ey = Math.round(hy + 1);
    const ex = cx + 3;
    if (opts.eyesClosed) pc.rect(ex, ey + 1, 2, 1, p.lash);
    else {
      pc.rect(ex, ey, 2, 1, p.lash);
      pc.set(ex, ey + 1, p.eye);
      pc.set(ex + 1, ey + 1, shade(p.eye, 0.25));
    }
    if (look.blush) pc.set(ex + 1, ey + 3, p.blush);
    // nose hint
    pc.set(cx + headR, ey + 2, p.skin[1]);
  }
  drawHair(pc, look, p, L, view);
  drawHeadAccessories(pc, look, p, L, view);
}

function drawHair(pc, look, p, L, view) {
  const style = look.hair?.style || 'short';
  if (style === 'bald' || style === 'none') return;
  const { cx, hy, headR } = L;
  const R = p.hair;
  const capR = headR + 0.6;
  const top = hy - 2; // forehead line

  // Helper: hair pixels inside an ellipse, with spherical shading.
  const capShape = (pred) => {
    for (let y = Math.floor(hy - capR - 1); y <= Math.ceil(hy + capR); y++) {
      for (let x = Math.floor(cx - capR - 1); x <= Math.ceil(cx + capR); x++) {
        const dx = (x + 0.5 - cx) / capR, dy = (y + 0.5 - (hy - 0.6)) / capR;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1 || !pred(x, y)) continue;
        const lum = -(dx * -0.5 + dy * -0.8) * 0.8 + Math.sqrt(1 - d2) * 0.4 + ((x + y) % 2 ? 0 : 0.05);
        pc.set(x, y, R[lum > 0.85 ? 4 : lum > 0.45 ? 3 : lum > 0.1 ? 2 : 1]);
      }
    }
  };

  if (view === 'back') {
    capShape(() => true);
  } else if (view === 'front') {
    const fringe = style === 'bob' ? [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      : style === 'messy' || style === 'spiky' ? [2, 0, 2, 1, 3, 0, 2, 1, 3, 0, 1, 2, 0, 2]
        : [2, 1, 2, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2];
    capShape((x, y) => {
      const i = x - Math.round(cx - capR);
      const f = fringe[Math.max(0, Math.min(fringe.length - 1, i))];
      return y <= top + f - 1 || x <= cx - headR + 0.5 || x >= cx + headR - 0.5;
    });
  } else {
    // side, facing right: hair covers back half and the crown
    capShape((x, y) => x <= cx - 1 || y <= top + (x > cx + 2 ? 0 : 1));
    pc.set(cx + 4, top + 1, R[2]); // fringe tip
    pc.set(cx, top + 2, R[1]); // sideburn
    pc.set(cx, top + 3, R[1]);
  }

  // Style extensions
  const backView = view === 'back';
  const side = view === 'side';
  if (style === 'long' || style === 'braid' || style === 'twintails') {
    const len = L.torsoY + Math.round(L.torsoH * 0.7);
    if (backView) {
      pc.rect(cx - 6, hy, 12, len - hy, R[2]);
      for (let y = hy; y < len; y++) { pc.set(cx - 6, y, R[1]); pc.set(cx + 5, y, R[1]); }
      pc.rect(cx - 5, len, 10, 1, R[1]);
    } else if (side) {
      pc.rect(cx - 6, hy - 1, 5, len - hy, R[2]);
      pc.rect(cx - 6, hy - 1, 1, len - hy, R[1]);
    } else {
      pc.rect(cx - 7, hy - 1, 2, len - hy - 2, R[2]);
      pc.rect(cx + 5, hy - 1, 2, len - hy - 2, R[1]);
    }
    if (style === 'twintails' && !side) {
      pc.shadedEllipse(cx - 8, hy + 3, 2, 5, R);
      pc.shadedEllipse(cx + 8, hy + 3, 2, 5, R);
    }
  }
  if (style === 'ponytail') {
    if (backView) {
      pc.rect(cx - 1, hy - 1, 3, 10, R[2]);
      pc.rect(cx - 1, hy - 2, 3, 1, p.accent[2]);
    } else if (side) {
      pc.shadedEllipse(cx - 6, hy + 2, 2, 5, R);
      pc.set(cx - 5, hy - 3, p.accent[2]);
    } else {
      pc.rect(cx + 6, hy - 1, 1, 6, R[1]);
    }
  }
  if (style === 'bun') {
    pc.shadedEllipse(cx + (side ? -3 : 0), hy - capR - 0.5, 2.6, 2.3, R);
  }
  if (style === 'spiky') {
    const spikes = side ? [[-4, 0], [-1, -1], [2, 0]] : [[-5, 1], [-2, -1], [1, -1], [4, 1]];
    for (const [ox, oy] of spikes) {
      pc.poly([[cx + ox, hy - capR + 2 + oy], [cx + ox + 3, hy - capR + 2 + oy], [cx + ox + 1.5, hy - capR - 2 + oy]], R[3]);
    }
  }
  if (style === 'bob' && !backView) {
    if (side) pc.rect(cx - 6, hy, 6, 4, R[2]);
    else { pc.rect(cx - 7, hy - 1, 2, 5, R[2]); pc.rect(cx + 5, hy - 1, 2, 5, R[1]); }
  }
  if (style === 'bob' && backView) pc.rect(cx - 6, hy + 2, 12, 3, R[1]);
  if (style === 'messy') {
    pc.set(cx - 3, hy - capR - 0.5, R[3]);
    pc.set(cx + 2, hy - capR - 0.5, R[3]);
  }
}

function drawHeadAccessories(pc, look, p, L, view) {
  const acc = look.acc || [];
  const { cx, hy, headR } = L;
  const side = view === 'side';
  const back = view === 'back';
  for (const a of acc) {
    switch (a) {
      case 'headband':
      case 'bandana': {
        const y = Math.round(hy - 3);
        const c = a === 'bandana' ? p.accent : p.trim;
        pc.rect(cx - headR, y, headR * 2 + 1, 1, c[2]);
        pc.rect(cx - headR, y + 1, headR * 2 + 1, 1, c[1]);
        if (side || back) { pc.rect(cx - headR - 2, y + 1, 2, 3, c[1]); }
        break;
      }
      case 'circlet': {
        const y = Math.round(hy - 3);
        pc.rect(cx - headR + 1, y, headR * 2 - 1, 1, p.gold[3]);
        if (view === 'front') pc.set(cx, y, hex('#7fe0ff'));
        break;
      }
      case 'hood': {
        const R = p.main;
        for (let y = Math.floor(hy - headR - 1.5); y <= hy + headR; y++) {
          for (let x = Math.floor(cx - headR - 1.5); x <= cx + headR + 1.5; x++) {
            const dx = (x + 0.5 - cx) / (headR + 1.4), dy = (y + 0.5 - hy) / (headR + 1.2);
            if (dx * dx + dy * dy > 1) continue;
            const inFace = view === 'front'
              ? Math.abs(x + 0.5 - cx) < headR - 1 && y >= hy - 2
              : side ? x >= cx && y >= hy - 2 : false;
            if (inFace) continue;
            pc.set(x, y, R[(x + 0.5 < cx) ? 2 : 1]);
          }
        }
        break;
      }
      case 'helmet': {
        const M = p.metal;
        pc.shadedEllipse(cx, hy - 2, headR + 0.8, headR - 1.5, M);
        if (view === 'front') pc.rect(cx - headR, hy - 1, headR * 2 + 1, 1, M[0]);
        if (side) pc.rect(cx, hy - 1, headR, 1, M[0]);
        pc.rect(cx - 1, hy - headR - 2, 2, 2, p.trim[2]);
        break;
      }
      case 'hat_wide': {
        const R = p.accent;
        pc.ellipse(cx, hy - headR + 2, headR + 4, 1.6, R[1]);
        pc.shadedEllipse(cx, hy - headR, headR - 1, 3.2, R);
        pc.rect(cx - headR + 1, hy - headR + 1, headR * 2 - 1, 1, p.trim[2]);
        break;
      }
      case 'hat_wizard': {
        const R = p.main;
        pc.ellipse(cx, hy - headR + 2, headR + 3, 1.5, R[1]);
        pc.poly([[cx - headR + 1, hy - headR + 2], [cx + headR - 1, hy - headR + 2], [cx + (side ? -4 : 2), hy - headR - 7]], R[2]);
        pc.rect(cx - headR + 2, hy - headR + 1, headR * 2 - 3, 1, p.trim[3]);
        break;
      }
      case 'crown': {
        const y = Math.round(hy - headR - 1);
        pc.rect(cx - 4, y, 9, 2, p.gold[3]);
        for (const ox of [-4, 0, 4]) pc.set(cx + ox, y - 1, p.gold[4]);
        break;
      }
      case 'beard': {
        if (back) break;
        const R = p.hair;
        const y0 = Math.round(hy);
        if (side) {
          // jaw from ear to chin, mouth left clear
          pc.rect(cx - 1, y0 + 2, 2, 3, R[2]);
          pc.rect(cx + 1, y0 + 4, 4, 2, R[2]);
          pc.set(cx + 5, y0 + 4, R[1]);
        } else {
          pc.rect(cx - 6, y0 + 1, 1, 4, R[2]);           // sideburns
          pc.rect(cx + 5, y0 + 1, 1, 4, R[1]);
          pc.rect(cx - 5, y0 + 4, 2, 2, R[2]);           // jaw
          pc.rect(cx + 3, y0 + 4, 2, 2, R[1]);
          pc.rect(cx - 3, y0 + 5, 7, 2, R[2]);           // chin
          pc.rect(cx - 1, y0 + 4, 3, 1, R[1]);           // moustache
          pc.set(cx, y0 + 7, R[1]);
        }
        break;
      }
      case 'glasses': {
        if (back) break;
        const ey = Math.round(hy + 1);
        const c = hex('#e8eef5');
        if (side) { pc.rect(cx + 2, ey, 3, 2, c); }
        else { pc.rect(cx - 5, ey, 3, 2, c); pc.rect(cx + 2, ey, 3, 2, c); pc.set(cx - 2, ey, c); pc.set(cx + 1, ey, c); }
        break;
      }
      case 'eyepatch': {
        if (back) break;
        const ey = Math.round(hy + 1);
        if (!side) pc.rect(cx + 2, ey, 2, 2, OUTLINE);
        pc.line(cx - headR, hy - 3, cx + headR, hy - 1, OUTLINE);
        break;
      }
      case 'feather': {
        const x = side ? cx - 4 : cx + 4;
        pc.line(x, hy - headR - 3, x + 2, hy - headR + 1, p.accent[3]);
        pc.line(x + 1, hy - headR - 3, x + 3, hy - headR + 1, p.accent[2]);
        break;
      }
      case 'ribbon': {
        const x = side ? cx - 3 : cx + 3;
        pc.rect(x - 1, hy - headR - 1, 3, 2, p.accent[3]);
        pc.set(x - 2, hy - headR - 2, p.accent[2]);
        pc.set(x + 2, hy - headR - 2, p.accent[2]);
        break;
      }
      case 'horns': {
        pc.poly([[cx - 5, hy - 4], [cx - 3, hy - 5], [cx - 7, hy - 9]], hex('#e8dcc8'));
        pc.poly([[cx + 5, hy - 4], [cx + 3, hy - 5], [cx + 7, hy - 9]], hex('#d8ccb8'));
        break;
      }
      default:
        break;
    }
  }
}

// ---------------------------------------------------------------------------
// Body
// ---------------------------------------------------------------------------

function outfitStyle(look) { return look.outfit?.style || 'tunic'; }

function drawTorso(pc, look, p, L, view, x, w) {
  const style = outfitStyle(look);
  const { torsoY: ty, torsoH: th } = L;
  const M = style === 'armor' ? p.metal : p.main;
  pc.shadedRect(x, ty, w, th, M);

  if (view !== 'back') {
    if (style === 'tunic' || style === 'dress' || style === 'robe') {
      pc.rect(x + Math.floor(w / 2) - 1, ty, 2, 2, p.accent[2]); // collar
    }
    if (style === 'vest' || style === 'coat') {
      const sx = view === 'side' ? x + w - 3 : x + Math.floor(w / 2) - 1;
      pc.rect(sx, ty, view === 'side' ? 2 : 2, th - 1, p.accent[2]); // shirt under vest
    }
    if (style === 'priest') {
      pc.rect(x + Math.floor(w / 2) - 2, ty, 1, th, p.trim[3]);
      pc.rect(x + Math.floor(w / 2) + 1, ty, 1, th, p.trim[3]);
    }
    if (style === 'armor') {
      pc.rect(x + 1, ty + 2, w - 2, 1, p.metal[4]);
      pc.set(x + Math.floor(w / 2), ty + 4, p.trim[3]);
    }
    if (style === 'rags') {
      pc.set(x + 1, ty + 3, p.main[0]);
      pc.set(x + w - 2, ty + 5, p.accent[1]);
    }
  }
  // belt
  if (style !== 'robe' && style !== 'priest') {
    pc.rect(x, ty + th - 2, w, 1, p.trim[1]);
    if (view === 'front') pc.set(x + Math.floor(w / 2), ty + th - 2, p.gold[3]);
  }
  if (look.acc?.includes('scarf') && view !== 'back') {
    pc.rect(x, ty, w, 2, p.accent[3]);
    pc.rect(x, ty + 1, w, 1, p.accent[2]);
    if (view === 'side') pc.rect(x - 2, ty + 1, 3, 4, p.accent[2]);
    else pc.rect(x + w - 3, ty + 2, 2, 3, p.accent[2]);
  }
  if (look.acc?.includes('scarf') && view === 'back') {
    pc.rect(x, ty, w, 2, p.accent[2]);
    pc.rect(x + 2, ty + 2, 2, 4, p.accent[1]);
  }
}

/** Skirts, robes and coat tails that cover the legs. */
function drawLowerGarment(pc, look, p, L, view, x, w) {
  const style = outfitStyle(look);
  const { torsoY: ty, torsoH: th, base } = L;
  const top = ty + th - 1;
  if (style === 'robe' || style === 'priest') {
    pc.poly([[x, top], [x + w, top], [x + w + 1, base], [x - 1, base]], p.main[2]);
    pc.rect(x - 1, base - 1, w + 2, 1, p.trim[2]);
    if (style === 'priest' && view !== 'back') pc.rect(x + Math.floor(w / 2) - 1, top, 2, base - top, p.trim[3]);
    for (let y = top; y < base; y++) pc.set(x + w - (view === 'side' ? 0 : 0) , y, p.main[1]);
  } else if (style === 'dress') {
    pc.poly([[x, top], [x + w, top], [x + w + 2, base - 2], [x - 2, base - 2]], p.main[2]);
    pc.rect(x - 2, base - 3, w + 4, 1, p.accent[2]);
  } else if (style === 'coat' && view !== 'front') {
    pc.poly([[x, top], [x + w, top], [x + w + 1, base - 2], [x - 1, base - 2]], p.main[1]);
  } else if (style === 'coat') {
    pc.rect(x - 1, top, 2, base - 2 - top, p.main[1]);
    pc.rect(x + w - 1, top, 2, base - 2 - top, p.main[1]);
  }
}

function legsHidden(look) {
  const s = outfitStyle(look);
  return s === 'robe' || s === 'priest';
}

function drawLegsFront(pc, look, p, L, frame) {
  const { cx, base, legH } = L;
  const top = base - 1 - legH;
  const lift = [0, 1, 0][frame] || 0; // step A lifts left leg
  const liftR = frame === 2 ? 1 : 0;
  const hidden = legsHidden(look);
  const pants = outfitStyle(look) === 'armor' ? p.metal : p.pants;
  const legs = [
    { x: cx - 3, l: lift },
    { x: cx + 1, l: liftR },
  ];
  for (const leg of legs) {
    if (!hidden) pc.rect(leg.x, top, 2, legH - leg.l, pants[2]);
    // boot
    pc.rect(leg.x - (leg.x < cx ? 1 : 0), base - 1 - leg.l, 3, 2, p.boots[2]);
    pc.set(leg.x - (leg.x < cx ? 1 : 0), base - 1 - leg.l, p.boots[3]);
  }
}

function drawLegsSide(pc, look, p, L, frame) {
  const { cx, base, legH } = L;
  const top = base - 1 - legH;
  const hidden = legsHidden(look);
  const pants = outfitStyle(look) === 'armor' ? p.metal : p.pants;
  // [back leg dx, front leg dx]
  const stride = frame === 1 ? [-2, 2] : frame === 2 ? [2, -2] : [0, 0];
  const order = frame === 2 ? [1, 0] : [0, 1];
  for (const k of order) {
    const dx = stride[k];
    const lx = cx - 2 + dx + (k === 1 ? 1 : 0);
    const shadeIdx = k === 0 ? 1 : 2;
    if (!hidden) {
      pc.line(cx - 1 + (k === 1 ? 1 : 0), top, lx, base - 2, pants[shadeIdx]);
      pc.line(cx + (k === 1 ? 1 : 0), top, lx + 1, base - 2, pants[shadeIdx]);
    }
    pc.rect(lx, base - 1, 3, 2, p.boots[shadeIdx + 1 > 3 ? 3 : shadeIdx]);
  }
}

function drawArmsFront(pc, look, p, L, frame, x, w) {
  const { torsoY: ty } = L;
  const sleeve = outfitStyle(look) === 'armor' ? p.metal : p.main;
  const swing = [0, -1, 1][frame] || 0;
  const arms = [{ ax: x - 2, s: swing }, { ax: x + w, s: -swing }];
  for (const { ax, s } of arms) {
    pc.rect(ax, ty + 1, 2, 5 + s, sleeve[ax < x ? 2 : 1]);
    pc.rect(ax, ty + 6 + s, 2, 1, p.skin[2]);
    if (outfitStyle(look) === 'armor') pc.shadedEllipse(ax + 1, ty + 1.5, 2, 1.8, p.metal);
  }
}

/** Single near-side arm for side views. hand offset (hx, hy) relative to shoulder. */
function drawArmSide(pc, look, p, L, sx, sy, hx, hy) {
  const sleeve = outfitStyle(look) === 'armor' ? p.metal : p.main;
  pc.thickLine(sx, sy, sx + hx * 0.6, sy + hy * 0.6, 2, sleeve[2]);
  pc.thickLine(sx + hx * 0.6, sy + hy * 0.6, sx + hx, sy + hy, 2, sleeve[1]);
  pc.rect(Math.round(sx + hx - 0.5), Math.round(sy + hy), 2, 2, p.skin[2]);
}

function drawCape(pc, look, p, L, view, x, w) {
  if (!look.acc?.includes('cape') && outfitStyle(look) !== 'cloak') return;
  const C = ramp(look.capeColor || look.outfit?.accent || '#7a2a2a');
  const { torsoY: ty, base } = L;
  if (view === 'back') {
    pc.poly([[x - 1, ty], [x + w + 1, ty], [x + w + 2, base - 2], [x - 2, base - 2]], C[2]);
    for (let y = ty; y < base - 2; y += 3) pc.set(x + 2, y, C[1]);
  } else if (view === 'side') {
    pc.poly([[x - 1, ty], [x + 2, ty], [x, base - 2], [x - 4, base - 3]], C[1]);
  } else {
    pc.rect(x - 2, ty, 1, base - 3 - ty, C[1]);
    pc.rect(x + w + 1, ty, 1, base - 3 - ty, C[0]);
  }
}

// ---------------------------------------------------------------------------
// Weapons
// ---------------------------------------------------------------------------

/** Draw a weapon held at (hx,hy) pointing along unit vector (dx,dy). */
function drawWeapon(pc, type, p, hx, hy, dx, dy) {
  const W = p.weapon;
  const at = (t) => [Math.round(hx + dx * t), Math.round(hy + dy * t)];
  const nx = -dy, ny = dx; // perpendicular
  switch (type) {
    case 'sword':
    case 'greatsword': {
      const len = type === 'greatsword' ? 13 : 10;
      const [bx, by] = at(-2);
      const [ex, ey] = at(len);
      pc.line(bx, by, hx, hy, p.wood[1]);
      pc.line(Math.round(hx + nx * 2), Math.round(hy + ny * 2), Math.round(hx - nx * 2), Math.round(hy - ny * 2), p.gold[3]);
      const [sx, sy] = at(1);
      pc.thickLine(sx, sy, ex, ey, type === 'greatsword' ? 3 : 2, W[2]);
      pc.line(sx, sy, ex, ey, W[4]);
      break;
    }
    case 'dagger': {
      const [ex, ey] = at(6);
      pc.line(hx, hy, ex, ey, W[3]);
      pc.set(Math.round(hx + nx), Math.round(hy + ny), p.gold[2]);
      break;
    }
    case 'spear': {
      const [bx, by] = at(-5);
      const [ex, ey] = at(14);
      pc.line(bx, by, ex, ey, p.wood[2]);
      const [tx, ty] = at(17);
      pc.thickLine(ex, ey, tx, ty, 2, W[3]);
      break;
    }
    case 'axe': {
      const [ex, ey] = at(10);
      pc.thickLine(hx, hy, ex, ey, 1, p.wood[2]);
      const [mx, my] = at(8);
      pc.ellipse(mx + nx * 2, my + ny * 2, 2.5, 2.5, W[2]);
      pc.set(Math.round(mx + nx * 3), Math.round(my + ny * 3), W[4]);
      break;
    }
    case 'staff':
    case 'rod': {
      const [bx, by] = at(-6);
      const [ex, ey] = at(type === 'rod' ? 7 : 11);
      pc.line(bx, by, ex, ey, p.wood[2]);
      pc.shadedEllipse(ex + 0.5, ey + 0.5, 2, 2, ramp(p.orb || '#6fd3ff'));
      break;
    }
    case 'bow': {
      for (let t = -6; t <= 6; t++) {
        const bend = 3 - (t * t) / 12;
        pc.set(Math.round(hx + dx * bend + nx * t), Math.round(hy + dy * bend + ny * t), p.wood[2]);
      }
      pc.line(Math.round(hx + nx * 6), Math.round(hy + ny * 6), Math.round(hx - nx * 6), Math.round(hy - ny * 6), p.white);
      break;
    }
    case 'fist':
      pc.rect(hx - 1, hy - 1, 3, 3, p.trim[2]);
      break;
    case 'lute': {
      pc.shadedEllipse(hx + dx * 2, hy + dy * 2 + 1, 3, 2.5, p.wood);
      const [ex, ey] = at(-6);
      pc.line(hx, hy, ex, ey, p.wood[1]);
      break;
    }
    case 'tome':
      pc.shadedRect(hx - 1, hy - 2, 4, 5, p.main);
      pc.rect(hx - 1, hy - 2, 1, 5, p.gold[3]);
      break;
    case 'gun': {
      const [ex, ey] = at(7);
      pc.thickLine(hx, hy, ex, ey, 2, W[1]);
      pc.rect(hx - 1, hy, 2, 3, p.wood[2]);
      break;
    }
    case 'shield': {
      pc.shadedEllipse(hx, hy, 3, 4, p.metal);
      pc.set(Math.round(hx), Math.round(hy), p.gold[3]);
      break;
    }
    default:
      break;
  }
}

// ---------------------------------------------------------------------------
// Frame painters
// ---------------------------------------------------------------------------

function paintFieldFrame(look, p, dir, frame) {
  const pc = new PixelCanvas(FIELD_W, FIELD_H);
  const L = layoutFor(look, 12);
  const bob = frame === 0 ? 0 : -1;
  const Lb = { ...L, hy: L.hy + bob, torsoY: L.torsoY + bob };

  if (dir === 'down' || dir === 'up') {
    const view = dir === 'down' ? 'front' : 'back';
    const x = L.cx - L.torsoW / 2;
    if (view === 'front') drawCape(pc, look, p, Lb, 'front', x, L.torsoW);
    drawLegsFront(pc, look, p, L, frame);
    drawLowerGarment(pc, look, p, Lb, view, x, L.torsoW);
    drawTorso(pc, look, p, Lb, view, x, L.torsoW);
    drawArmsFront(pc, look, p, Lb, frame, x, L.torsoW);
    if (view === 'back') drawCape(pc, look, p, Lb, 'back', x, L.torsoW);
    drawHead(pc, look, p, Lb, view);
  } else {
    // Paint facing right; 'left' is mirrored afterwards.
    const x = L.cx - 3;
    const w = Math.max(6, L.torsoW - 2);
    drawCape(pc, look, p, Lb, 'side', x, w);
    drawLegsSide(pc, look, p, L, frame);
    drawLowerGarment(pc, look, p, Lb, 'side', x, w);
    drawTorso(pc, look, p, Lb, 'side', x, w);
    const swing = frame === 1 ? 2 : frame === 2 ? -2 : 0;
    drawArmSide(pc, look, p, Lb, L.cx, Lb.torsoY + 1, swing, 5);
    drawHead(pc, look, p, Lb, 'side');
  }
  pc.outline(OUTLINE);
  if (dir === 'left') {
    const m = new PixelCanvas(FIELD_W, FIELD_H);
    m.blit(pc, 0, 0, { flipX: true });
    return m;
  }
  return pc;
}

/** Battle poses are painted facing right, then mirrored to face left (party side). */
function paintBattleFrame(look, p, pose) {
  const pc = new PixelCanvas(BATTLE_W, BATTLE_H);
  const weapon = look.weapon || 'sword';
  const cxBase = 18;
  let lean = 0, frame = 0, hyOff = 0, eyesClosed = false;
  if (pose === 'attack') { lean = 3; frame = 1; }
  if (pose === 'ready') { lean = -1; frame = 2; }
  if (pose === 'hurt') { lean = -2; eyesClosed = true; }
  if (pose === 'idle2') { hyOff = 1; }
  if (pose === 'cast') { frame = 0; }
  if (pose === 'victory') { hyOff = -1; }
  if (pose === 'guard') { lean = -1; frame = 1; }

  const L = layoutFor(look, cxBase + lean);
  const Lb = { ...L, hy: L.hy + hyOff, torsoY: L.torsoY + Math.max(0, hyOff) };
  const x = Lb.cx - 3;
  const w = Math.max(6, L.torsoW - 2);

  if (pose === 'ko') {
    // Lie the standing pose on its side.
    const stand = new PixelCanvas(24, 32);
    const Ls = layoutFor(look, 12);
    drawLegsSide(stand, look, p, Ls, 0);
    drawLowerGarment(stand, look, p, Ls, 'side', 9, w);
    drawTorso(stand, look, p, Ls, 'side', 9, w);
    drawArmSide(stand, look, p, Ls, 12, Ls.torsoY + 1, 0, 5);
    drawHead(stand, look, p, Ls, 'side', { eyesClosed: true });
    const rot = stand.rotated90();
    // rotated90: head ends up on the right. Place at the bottom.
    pc.blit(rot, 4, BATTLE_H - rot.h + 6);
    pc.outline(OUTLINE);
    return mirror(pc);
  }

  // Weapon behind the body for some poses
  const sy = Lb.torsoY + 1;
  let hand = [3, 5];
  let wdir = [0.5, 0.86];
  if (pose === 'attack') { hand = [7, 1]; wdir = [1, -0.15]; }
  if (pose === 'ready') { hand = [-3, -3]; wdir = [-0.4, -0.9]; }
  if (pose === 'cast') { hand = [5, -2]; wdir = [0.2, -1]; }
  if (pose === 'victory') { hand = [2, -6]; wdir = [0.1, -1]; }
  if (pose === 'guard') { hand = [5, 2]; wdir = [0.6, -0.8]; }
  if (pose === 'idle' || pose === 'idle2' || pose === 'hurt') { hand = [3, 5]; wdir = [0.7, -0.7]; }
  if (weapon === 'bow' && (pose === 'attack' || pose === 'ready')) { hand = [6, 1]; wdir = [1, 0]; }
  if (weapon === 'staff' || weapon === 'rod') {
    if (pose === 'idle' || pose === 'idle2') { hand = [3, 4]; wdir = [0.15, -1]; }
  }
  const norm = Math.hypot(wdir[0], wdir[1]);
  wdir = [wdir[0] / norm, wdir[1] / norm];

  drawCape(pc, look, p, Lb, 'side', x, w);
  if (look.shield) drawWeapon(pc, 'shield', p, x - 1, Lb.torsoY + 3, 0, 1);
  drawLegsSide(pc, look, p, L, frame);
  drawLowerGarment(pc, look, p, Lb, 'side', x, w);
  drawTorso(pc, look, p, Lb, 'side', x, w);
  drawHead(pc, look, p, Lb, 'side', { eyesClosed });
  const hx = Lb.cx + hand[0], hy = sy + hand[1];
  drawWeapon(pc, weapon, p, hx, hy, wdir[0], wdir[1]);
  drawArmSide(pc, look, p, Lb, Lb.cx, sy, hand[0], hand[1]);
  pc.outline(OUTLINE);
  return mirror(pc);
}

function mirror(pc) {
  const m = new PixelCanvas(pc.w, pc.h);
  m.blit(pc, 0, 0, { flipX: true });
  return m;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const sheetCache = new Map();

/**
 * Build (or fetch cached) sprite sheet for a look.
 * Returns { canvas, texture, fieldFrame(dir, frame) -> uv rect, battleFrame(pose) -> uv rect }.
 */
export function getCharacterSheet(look) {
  const key = look.id || JSON.stringify(look);
  if (sheetCache.has(key)) return sheetCache.get(key);

  const p = preparePalette(look);
  const sheet = new PixelCanvas(SHEET_W, SHEET_H);
  FIELD_DIRS.forEach((dir, row) => {
    for (let f = 0; f < 3; f++) sheet.blit(paintFieldFrame(look, p, dir, f), f * FIELD_W, row * FIELD_H);
  });
  BATTLE_POSES.forEach((pose, i) => {
    sheet.blit(paintBattleFrame(look, p, pose), i * BATTLE_W, FIELD_H * 4);
  });

  const canvas = sheet.toCanvas();
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  const uv = (x, y, w, h) => ({
    u0: x / SHEET_W, v0: 1 - (y + h) / SHEET_H, u1: (x + w) / SHEET_W, v1: 1 - y / SHEET_H,
  });
  const entry = {
    canvas,
    texture,
    fieldFrame: (dir, frame) => uv(frame * FIELD_W, FIELD_DIRS.indexOf(dir) * FIELD_H, FIELD_W, FIELD_H),
    battleFrame: (pose) => uv(Math.max(0, BATTLE_POSES.indexOf(pose)) * BATTLE_W, FIELD_H * 4, BATTLE_W, BATTLE_H),
  };
  sheetCache.set(key, entry);
  return entry;
}

/** A small portrait canvas (head crop of the front frame), upscaled. */
export function getPortrait(look, scale = 4) {
  const sheet = getCharacterSheet(look);
  const cv = document.createElement('canvas');
  const cropW = 20, cropH = 18;
  cv.width = cropW * scale;
  cv.height = cropH * scale;
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const yOff = (look.build === 'child') ? 5 : 0;
  ctx.drawImage(sheet.canvas, 2, yOff + 1, cropW, cropH, 0, 0, cv.width, cv.height);
  return cv;
}
