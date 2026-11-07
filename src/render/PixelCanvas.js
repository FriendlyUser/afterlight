// A tiny indexed-free pixel buffer used to paint all procedural pixel art
// (characters, monsters, tiles, props). Colors are packed 32-bit ABGR so the
// buffer maps 1:1 onto an ImageData Uint32 view.

import { clamp } from '../core/util.js';

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

export const TRANSPARENT = 0;

export function rgba(r, g, b, a = 255) {
  return ((a & 255) << 24 | (b & 255) << 16 | (g & 255) << 8 | (r & 255)) >>> 0;
}

export function unpack(c) {
  return { r: c & 255, g: (c >>> 8) & 255, b: (c >>> 16) & 255, a: (c >>> 24) & 255 };
}

export function hex(str, a = 255) {
  const s = str.replace('#', '');
  const n = parseInt(s.length === 3 ? s.split('').map((ch) => ch + ch).join('') : s, 16);
  return rgba((n >> 16) & 255, (n >> 8) & 255, n & 255, a);
}

export function toCss(c) {
  const { r, g, b, a } = unpack(c);
  return `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255].map((v) => Math.round(clamp(v, 0, 255)));
}

/** Shift a packed color's lightness (and hue toward warm/cool, pixel-art style). */
export function shade(c, amount) {
  const { r, g, b, a } = unpack(c);
  let [h, s, l] = rgbToHsl(r, g, b);
  // Shadows drift toward blue/purple, highlights toward warm yellow.
  const target = amount < 0 ? 250 : 50;
  const dh = ((target - h + 540) % 360) - 180;
  h += dh * Math.min(0.18, Math.abs(amount) * 0.5);
  l = clamp(l + amount, 0.02, 0.98);
  s = clamp(s * (amount < 0 ? 1.05 : 0.95), 0, 1);
  const [nr, ng, nb] = hslToRgb(h, s, l);
  return rgba(nr, ng, nb, a);
}

/** Five-step ramp [darkest, dark, base, light, lightest]. */
export function ramp(base) {
  const c = typeof base === 'string' ? hex(base) : base;
  return [shade(c, -0.24), shade(c, -0.12), c, shade(c, 0.1), shade(c, 0.2)];
}

export function mix(c1, c2, t) {
  const a = unpack(c1), b = unpack(c2);
  return rgba(
    Math.round(a.r + (b.r - a.r) * t),
    Math.round(a.g + (b.g - a.g) * t),
    Math.round(a.b + (b.b - a.b) * t),
    Math.round(a.a + (b.a - a.a) * t),
  );
}

// ---------------------------------------------------------------------------
// PixelCanvas
// ---------------------------------------------------------------------------

export class PixelCanvas {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint32Array(w * h);
  }

  inBounds(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }

  set(x, y, c) {
    x |= 0; y |= 0;
    if (c === undefined || c === null) return;
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.data[y * this.w + x] = c;
  }

  get(x, y) {
    x |= 0; y |= 0;
    return this.inBounds(x, y) ? this.data[y * this.w + x] : 0;
  }

  /** Paint only where a pixel already exists (for shading within a shape). */
  over(x, y, c) {
    if (this.get(x, y)) this.set(x, y, c);
  }

  clear() { this.data.fill(0); }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  /** Filled ellipse with pixel-snapped edges. */
  ellipse(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, c);
      }
    }
  }

  /**
   * Ellipse shaded like a lit sphere using a 5-color ramp.
   * light: normalized 2D direction the light comes FROM (default top-left).
   */
  shadedEllipse(cx, cy, rx, ry, rmp, light = [-0.55, -0.75], dither = true) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1) continue;
        const nz = Math.sqrt(1 - d2);
        let lum = -(dx * light[0] + dy * light[1]) * 0.75 + nz * 0.55; // ~[-0.3, 1.2]
        if (dither && (x + y) % 2 === 0) lum += 0.06;
        const idx = lum > 0.95 ? 4 : lum > 0.62 ? 3 : lum > 0.3 ? 2 : lum > 0.02 ? 1 : 0;
        this.set(x, y, rmp[idx]);
      }
    }
  }

  /** Rectangle with simple top-left lighting. */
  shadedRect(x, y, w, h, rmp) {
    this.rect(x, y, w, h, rmp[2]);
    for (let i = 0; i < w; i++) { this.set(x + i, y, rmp[3]); this.set(x + i, y + h - 1, rmp[1]); }
    for (let j = 1; j < h - 1; j++) { this.set(x, y + j, rmp[3]); this.set(x + w - 1, y + j, rmp[1]); }
  }

  line(x0, y0, x1, y1, c) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  /** Thick line made of stamped squares. */
  thickLine(x0, y0, x1, y1, w, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      this.rect(Math.round(x - w / 2), Math.round(y - w / 2), w, w, c);
    }
  }

  /** Scanline polygon fill. points: [[x,y], ...] */
  poly(points, c) {
    let minY = Infinity, maxY = -Infinity;
    for (const [, y] of points) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      const sy = y + 0.5;
      for (let i = 0; i < points.length; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[(i + 1) % points.length];
        if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) {
          xs.push(x0 + ((sy - y0) / (y1 - y0)) * (x1 - x0));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, c);
      }
    }
  }

  /** Draw a pixel pattern from strings; chars map through `pal` (space/'.' = skip). */
  pattern(x, y, rows, pal, flipX = false) {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === ' ' || ch === '.') continue;
        const c = pal[ch];
        if (c !== undefined) this.set(flipX ? x + row.length - 1 - i : x + i, y + j, c);
      }
    });
  }

  /** Copy another canvas onto this one (transparent pixels skipped). */
  blit(src, dx, dy, { flipX = false, flipY = false } = {}) {
    for (let y = 0; y < src.h; y++) {
      for (let x = 0; x < src.w; x++) {
        const c = src.data[y * src.w + x];
        if (!c) continue;
        this.set(dx + (flipX ? src.w - 1 - x : x), dy + (flipY ? src.h - 1 - y : y), c);
      }
    }
  }

  /** Rotate 90° clockwise into a new canvas. */
  rotated90() {
    const out = new PixelCanvas(this.h, this.w);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      out.set(this.h - 1 - y, x, this.data[y * this.w + x]);
    }
    return out;
  }

  /** Add a 1px outline in transparent pixels bordering opaque ones. */
  outline(c, diagonal = false) {
    const src = this.data.slice();
    const w = this.w, h = this.h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (src[y * w + x]) continue;
        let near = false;
        for (let dy = -1; dy <= 1 && !near; dy++) {
          for (let dx = -1; dx <= 1 && !near; dx++) {
            if (!dx && !dy) continue;
            if (!diagonal && dx && dy) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < w && ny < h && src[ny * w + nx]) near = true;
          }
        }
        if (near) this.data[y * w + x] = c;
      }
    }
  }

  /** Darken pixels whose neighbour in direction (dx,dy) is transparent: cheap rim shadow. */
  rimShade(dx, dy, amount = -0.1) {
    const src = this.data.slice();
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = src[y * this.w + x];
        if (!c) continue;
        const nx = x + dx, ny = y + dy;
        const n = nx >= 0 && ny >= 0 && nx < this.w && ny < this.h ? src[ny * this.w + nx] : 0;
        if (!n) this.data[y * this.w + x] = shade(c, amount);
      }
    }
  }

  /** Recolor every pixel equal to `from` into `to`. */
  replace(from, to) {
    for (let i = 0; i < this.data.length; i++) if (this.data[i] === from) this.data[i] = to;
  }

  /** Render into a new <canvas>, optionally upscaled (nearest). */
  toCanvas(scale = 1) {
    const cv = document.createElement('canvas');
    cv.width = this.w * scale;
    cv.height = this.h * scale;
    const ctx = cv.getContext('2d');
    this.drawTo(ctx, 0, 0, scale);
    return cv;
  }

  drawTo(ctx, dx, dy, scale = 1) {
    const img = new ImageData(new Uint8ClampedArray(this.data.buffer.slice(0)), this.w, this.h);
    if (scale === 1) {
      ctx.putImageData(img, dx, dy);
      return;
    }
    const tmp = document.createElement('canvas');
    tmp.width = this.w; tmp.height = this.h;
    tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, dx, dy, this.w * scale, this.h * scale);
  }

  /** Bounding box of opaque pixels. */
  bounds() {
    let x0 = this.w, y0 = this.h, x1 = -1, y1 = -1;
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.data[y * this.w + x]) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }
}
