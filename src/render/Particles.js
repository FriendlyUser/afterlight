// Pixel-square particle system: ambient weather around a focus point plus
// one-shot bursts (hits, spells, sparkles). One draw call per blend mode.

import * as THREE from 'three';

const VERT = /* glsl */`
  attribute float size;
  attribute vec4 color;
  varying vec4 vColor;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */`
  varying vec4 vColor;
  uniform float soft;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = max(abs(p.x), abs(p.y));
    if (d > 0.5) discard;
    float a = vColor.a;
    if (soft > 0.5) a *= smoothstep(0.5, 0.15, length(p));
    gl_FragColor = vec4(vColor.rgb, a);
  }
`;

class Pool {
  constructor(max, additive) {
    this.max = max;
    this.count = 0;
    this.p = [];
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 4);
    this.size = new Float32Array(max);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.geometry = g;
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
      uniforms: { soft: { value: additive ? 1 : 0 } },
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 10;
  }

  add(part) {
    if (this.p.length >= this.max) this.p.shift();
    this.p.push(part);
  }

  update(dt) {
    const alive = [];
    for (const q of this.p) {
      q.age += dt;
      if (q.age >= q.life) continue;
      q.vy -= (q.gravity || 0) * dt;
      q.vx *= 1 - (q.drag || 0) * dt;
      q.vy *= 1 - (q.drag || 0) * dt;
      q.vz *= 1 - (q.drag || 0) * dt;
      if (q.wobble) { q.vx += Math.sin(q.age * q.wobble + q.seed) * dt * 0.6; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt;
      alive.push(q);
    }
    this.p = alive;
    const n = Math.min(alive.length, this.max);
    for (let i = 0; i < n; i++) {
      const q = alive[i];
      const t = q.age / q.life;
      const fade = q.fadeIn ? Math.min(1, t * 5) * Math.min(1, (1 - t) * 3) : 1 - t * t;
      const tw = q.twinkle ? 0.55 + 0.45 * Math.sin(q.age * q.twinkle + q.seed) : 1;
      this.pos[i * 3] = q.x; this.pos[i * 3 + 1] = q.y; this.pos[i * 3 + 2] = q.z;
      this.col[i * 4] = q.r; this.col[i * 4 + 1] = q.g; this.col[i * 4 + 2] = q.b;
      this.col[i * 4 + 3] = q.a * fade * tw;
      this.size[i] = q.size * (q.shrink ? 1 - t * 0.7 : 1);
    }
    this.geometry.setDrawRange(0, n);
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }
}

// Ambient presets: spawn rate, region, motion, look.
const AMBIENT = {
  pollen: { rate: 6, colors: ['#fff6c0', '#ffffff'], size: [0.35, 0.6], life: [4, 7], vel: [0.2, 0.05, 0.1], additive: true, twinkle: 3, fadeIn: true, yRange: [0.2, 3] },
  fireflies: { rate: 7, colors: ['#d8ff8a', '#fff0a0'], size: [0.6, 0.9], life: [3, 6], vel: [0.25, 0.15, 0.25], additive: true, twinkle: 5, fadeIn: true, wobble: 2, yRange: [0.3, 2.5] },
  embers_soft: { rate: 5, colors: ['#ffb070', '#ff8a4a'], size: [0.35, 0.55], life: [3, 5], vel: [0.2, 0.4, 0.1], additive: true, twinkle: 6, fadeIn: true, yRange: [0, 2] },
  rain: { rate: 120, colors: ['#a8c0e0'], size: [0.25, 0.35], life: [0.6, 0.8], vel: [-1, -16, 0.5], alpha: 0.55, yRange: [8, 12] },
  snow: { rate: 40, colors: ['#ffffff', '#e8f0ff'], size: [0.35, 0.6], life: [5, 8], vel: [0.3, -1.1, 0.1], wobble: 1.5, alpha: 0.9, yRange: [6, 10], fadeIn: true },
  ash: { rate: 26, colors: ['#bcb0b8', '#8a8088', '#ff9a6a'], size: [0.3, 0.55], life: [5, 8], vel: [0.5, -0.5, 0.1], wobble: 1.2, alpha: 0.85, yRange: [5, 9], fadeIn: true },
  leaves: { rate: 4, colors: ['#8ab84a', '#c8a03a', '#6a9a3a'], size: [0.45, 0.6], life: [5, 7], vel: [0.6, -0.6, 0.1], wobble: 2.5, alpha: 1, yRange: [5, 8], fadeIn: true },
  dust: { rate: 6, colors: ['#ffe8c8', '#d8d0c0'], size: [0.2, 0.35], life: [5, 8], vel: [0.08, 0.03, 0.05], additive: true, alpha: 0.6, fadeIn: true, yRange: [0.3, 3] },
  dust_sand: { rate: 20, colors: ['#f0d8a8', '#e0c890'], size: [0.25, 0.4], life: [2, 3], vel: [3, 0.1, 0.2], alpha: 0.6, fadeIn: true, yRange: [0.1, 2] },
  gloam: { rate: 12, colors: ['#b080ff', '#6040c0', '#ff80d0'], size: [0.35, 0.7], life: [3, 6], vel: [0.1, 0.35, 0.1], additive: true, twinkle: 4, fadeIn: true, wobble: 1, yRange: [0, 2] },
  motes_gold: { rate: 14, colors: ['#ffe8a0', '#fff8e0'], size: [0.3, 0.6], life: [4, 7], vel: [0.05, 0.12, 0.05], additive: true, twinkle: 2, fadeIn: true, yRange: [0, 4] },
};

function hexToRgb(h) {
  const c = new THREE.Color(h);
  return [c.r, c.g, c.b];
}

export class ParticleSystem {
  constructor(scene) {
    this.normal = new Pool(1200, false);
    this.additive = new Pool(1200, true);
    scene.add(this.normal.points);
    scene.add(this.additive.points);
    this.ambient = null;
    this.ambientAccum = 0;
    this.focus = new THREE.Vector3();
    this.area = { w: 24, d: 18 };
  }

  setAmbient(type) { this.ambient = AMBIENT[type] || null; }

  /** Spawn a burst. opts: {x,y,z,count,colors,speed,spread,up,gravity,life,size,additive,drag,shrink} */
  burst(o) {
    const pool = o.additive === false ? this.normal : this.additive;
    const colors = (o.colors || ['#ffffff']).map(hexToRgb);
    for (let i = 0; i < (o.count || 12); i++) {
      const a = Math.random() * Math.PI * 2;
      const e = (Math.random() - 0.5) * (o.spread ?? Math.PI);
      const sp = (o.speed || 3) * (0.4 + Math.random() * 0.6);
      const [r, g, b] = colors[Math.floor(Math.random() * colors.length)];
      pool.add({
        x: o.x + (Math.random() - 0.5) * (o.jitter || 0.2),
        y: o.y + (Math.random() - 0.5) * (o.jitter || 0.2),
        z: o.z + (Math.random() - 0.5) * (o.jitter || 0.2),
        vx: Math.cos(a) * Math.cos(e) * sp,
        vy: Math.sin(e) * sp + (o.up || 0),
        vz: Math.sin(a) * Math.cos(e) * sp * 0.4,
        gravity: o.gravity ?? 4, drag: o.drag ?? 1.5,
        life: (o.life || 0.7) * (0.6 + Math.random() * 0.4), age: 0,
        size: (o.size || 0.5) * (0.6 + Math.random() * 0.6),
        r, g, b, a: o.alpha ?? 1, shrink: o.shrink ?? true, seed: Math.random() * 10,
      });
    }
  }

  /** Rising column of motes (heals, buffs). */
  rise(o) {
    const pool = this.additive;
    const colors = (o.colors || ['#ffffff']).map(hexToRgb);
    for (let i = 0; i < (o.count || 16); i++) {
      const [r, g, b] = colors[i % colors.length];
      pool.add({
        x: o.x + (Math.random() - 0.5) * (o.width || 1), y: o.y + Math.random() * 0.3, z: o.z + (Math.random() - 0.5) * 0.4,
        vx: 0, vy: (o.speed || 1.6) * (0.5 + Math.random()), vz: 0, gravity: 0, drag: 0.5,
        life: o.life || 1.1, age: 0, size: o.size || 0.45, r, g, b, a: 1, shrink: true, twinkle: 8, seed: Math.random() * 10,
      });
    }
  }

  update(dt, camera) {
    const amb = this.ambient;
    if (amb) {
      this.ambientAccum += amb.rate * dt;
      const pool = amb.additive ? this.additive : this.normal;
      while (this.ambientAccum >= 1) {
        this.ambientAccum -= 1;
        const c = hexToRgb(amb.colors[Math.floor(Math.random() * amb.colors.length)]);
        const life = amb.life[0] + Math.random() * (amb.life[1] - amb.life[0]);
        pool.add({
          x: this.focus.x + (Math.random() - 0.5) * this.area.w,
          y: this.focus.y + amb.yRange[0] + Math.random() * (amb.yRange[1] - amb.yRange[0]),
          z: this.focus.z + (Math.random() - 0.6) * this.area.d,
          vx: (Math.random() - 0.3) * amb.vel[0] * 2, vy: amb.vel[1] * (0.6 + Math.random() * 0.8), vz: (Math.random() - 0.5) * amb.vel[2] * 2,
          gravity: 0, drag: 0, life, age: 0,
          size: amb.size[0] + Math.random() * (amb.size[1] - amb.size[0]),
          r: c[0], g: c[1], b: c[2], a: amb.alpha ?? 1,
          twinkle: amb.twinkle, wobble: amb.wobble, fadeIn: amb.fadeIn, seed: Math.random() * 10,
        });
      }
    }
    this.normal.update(dt);
    this.additive.update(dt);
  }

  dispose(scene) {
    scene.remove(this.normal.points, this.additive.points);
    this.normal.geometry.dispose();
    this.additive.geometry.dispose();
  }
}
