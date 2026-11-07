// Battle visual effects keyed by skill `anim`. Each effect is an async
// function using the BattleScene view helpers (particles, flashes, shakes,
// temporary lights and billboard meshes).

import * as THREE from 'three';

export const ELEM_COLORS = {
  fire: ['#fff0a0', '#ffb040', '#ff5a20'],
  ice: ['#ffffff', '#a0e8ff', '#4aa0ff'],
  bolt: ['#ffffff', '#fff070', '#a0c8ff'],
  wind: ['#e8ffe8', '#90f0b0', '#40c080'],
  light: ['#ffffff', '#fff0b0', '#ffd070'],
  dark: ['#e0b0ff', '#9a60f0', '#4a2090'],
  slash: ['#ffffff', '#ffe8c0'],
  pierce: ['#ffffff', '#ffe8c0'],
  blunt: ['#ffffff', '#ffd8a0'],
  none: ['#ffffff', '#e0e0ff', '#ffd0ff'],
  prism: ['#ff8080', '#ffe080', '#80ff80', '#80c0ff', '#e080ff'],
  heal: ['#e0ffe8', '#90f0b0', '#60d090'],
  poison: ['#c0ff80', '#70c040'],
};

const colorsFor = (elem) => ELEM_COLORS[elem] || ELEM_COLORS.none;

// ---------------------------------------------------------------- textures

let arcTex = null;
function slashTexture() {
  if (arcTex) return arcTex;
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${1 - i * 0.15})`;
    ctx.lineWidth = 6 - i;
    ctx.beginPath();
    ctx.arc(32, 32, 24 - i * 1.5, -Math.PI * 0.85, Math.PI * 0.15);
    ctx.stroke();
  }
  arcTex = new THREE.CanvasTexture(cv);
  return arcTex;
}

let ringTex = null;
function ringTexture() {
  if (ringTex) return ringTex;
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 18, 32, 32, 31);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  ringTex = new THREE.CanvasTexture(cv);
  return ringTex;
}

function billboard(view, tex, color, size, pos) {
  const mat = new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mesh.position.copy(pos);
  mesh.renderOrder = 20;
  view.scene.add(mesh);
  return mesh;
}

async function fadeMesh(view, mesh, sec, fn) {
  await view.game.tween(sec, (t) => { fn?.(t); mesh.material.opacity = 1 - t; });
  view.scene.remove(mesh);
  mesh.geometry.dispose();
  mesh.material.dispose();
}

// ---------------------------------------------------------------- primitives

function impact(view, pos, elem, scale = 1) {
  const c = colorsFor(elem);
  view.particles.burst({ x: pos.x, y: pos.y, z: pos.z + 0.3, count: Math.round(22 * scale), colors: c, speed: 5 * scale, up: 1, gravity: 6, life: 0.55, size: 0.55 * scale });
  view.tempLight(pos, c[1], 4 * scale, 0.25);
}

async function projectile(view, from, to, elem, sec = 0.22) {
  const c = colorsFor(elem);
  const p = from.clone();
  await view.game.tween(sec, (t) => {
    p.lerpVectors(from, to, t);
    p.y += Math.sin(t * Math.PI) * 0.4;
    view.particles.burst({ x: p.x, y: p.y, z: p.z + 0.3, count: 3, colors: c, speed: 0.4, gravity: 0, life: 0.25, size: 0.45, jitter: 0.05 });
  });
}

// ---------------------------------------------------------------- effects

const FX = {
  async slash(view, user, targets, elem) {
    for (const t of targets) {
      const pos = view.posOf(t);
      const m = billboard(view, slashTexture(), new THREE.Color(colorsFor(elem)[0]), 2.4, pos.clone().add(new THREE.Vector3(0, 0, 0.6)));
      m.rotation.z = Math.random() * Math.PI;
      view.game.audio?.sfx('slash');
      fadeMesh(view, m, 0.28, (k) => { m.rotation.z += 0.12; m.scale.setScalar(1 + k * 0.4); });
      impact(view, pos, elem);
    }
    await view.game.wait(0.18);
  },
  async thrust(view, user, targets, elem) {
    view.game.audio?.sfx('hit');
    for (const t of targets) impact(view, view.posOf(t), elem, 0.8);
    await view.game.wait(0.14);
  },
  async blunt(view, user, targets, elem) {
    view.game.audio?.sfx('blunt');
    for (const t of targets) impact(view, view.posOf(t), elem, 1.1);
    view.shake(0.08, 0.15);
    await view.game.wait(0.14);
  },
  async claw(view, user, targets, elem) { return FX.slash(view, user, targets, elem || 'slash'); },
  async bite(view, user, targets, elem) { return FX.blunt(view, user, targets, elem || 'pierce'); },
  async arrow(view, user, targets, elem) {
    view.game.audio?.sfx('bow');
    await Promise.all(targets.map((t) => projectile(view, view.posOf(user), view.posOf(t), elem || 'pierce', 0.18)));
    for (const t of targets) impact(view, view.posOf(t), elem, 0.8);
  },
  async shot(view, user, targets, elem) {
    view.game.audio?.sfx('gun');
    view.tempLight(view.posOf(user), '#ffd080', 5, 0.08);
    await Promise.all(targets.map((t) => projectile(view, view.posOf(user), view.posOf(t), 'fire', 0.1)));
    for (const t of targets) impact(view, view.posOf(t), elem, 0.7);
  },
  async fire(view, user, targets) {
    view.game.audio?.sfx('fire');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.rise({ x: p.x, y: p.y - 0.8, z: p.z + 0.3, count: 40, colors: ELEM_COLORS.fire, speed: 2.6, width: 1.4, life: 0.8, size: 0.7 });
      view.tempLight(p, '#ff8a30', 6, 0.5);
    }
    await view.game.wait(0.35);
    for (const t of targets) impact(view, view.posOf(t), 'fire', 1.2);
  },
  async ice(view, user, targets) {
    view.game.audio?.sfx('ice');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.burst({ x: p.x, y: p.y + 1.5, z: p.z + 0.3, count: 30, colors: ELEM_COLORS.ice, speed: 2, gravity: 12, life: 0.6, size: 0.6 });
      view.tempLight(p, '#80c8ff', 5, 0.4);
    }
    await view.game.wait(0.3);
    for (const t of targets) impact(view, view.posOf(t), 'ice', 1.1);
  },
  async bolt(view, user, targets) {
    view.game.audio?.sfx('bolt');
    for (const t of targets) {
      const p = view.posOf(t);
      const geo = new THREE.PlaneGeometry(0.35, 9);
      const mat = new THREE.MeshBasicMaterial({ color: '#fffbe0', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(p.x, p.y + 4, p.z + 0.4);
      view.scene.add(m);
      fadeMesh(view, m, 0.25, (k) => { m.scale.x = 1 + Math.sin(k * 40) * 0.5; });
      view.tempLight(p, '#e0f0ff', 9, 0.2);
      impact(view, p, 'bolt', 1.2);
    }
    view.flash('#e8f0ff', 0.15, 0.5);
    await view.game.wait(0.25);
  },
  async wind(view, user, targets) {
    view.game.audio?.sfx('wind');
    await view.game.tween(0.45, (k) => {
      for (const t of targets) {
        const p = view.posOf(t);
        const a = k * 18;
        view.particles.burst({ x: p.x + Math.cos(a) * 0.8, y: p.y - 0.6 + k * 1.6, z: p.z + 0.3 + Math.sin(a) * 0.3, count: 3, colors: ELEM_COLORS.wind, speed: 0.6, gravity: 0, life: 0.4, size: 0.5 });
      }
    });
    for (const t of targets) impact(view, view.posOf(t), 'wind');
  },
  async light(view, user, targets) {
    view.game.audio?.sfx('holy');
    for (const t of targets) {
      const p = view.posOf(t);
      const geo = new THREE.CylinderGeometry(0.7, 0.7, 10, 16, 1, true);
      const mat = new THREE.MeshBasicMaterial({ color: '#fff4c8', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(p.x, p.y + 4, p.z);
      view.scene.add(m);
      fadeMesh(view, m, 0.6, (k) => { m.scale.x = m.scale.z = 1 - k * 0.7; });
      view.particles.rise({ x: p.x, y: p.y - 0.8, z: p.z + 0.3, count: 26, colors: ELEM_COLORS.light, speed: 3, width: 1.2 });
      view.tempLight(p, '#fff0c0', 8, 0.5);
    }
    view.flash('#fff8e0', 0.2, 0.35);
    await view.game.wait(0.35);
  },
  async dark(view, user, targets) {
    view.game.audio?.sfx('dark');
    for (const t of targets) {
      const p = view.posOf(t);
      const m = billboard(view, ringTexture(), new THREE.Color('#a060ff'), 3.5, p.clone().add(new THREE.Vector3(0, 0, 0.5)));
      fadeMesh(view, m, 0.5, (k) => m.scale.setScalar(1.4 - k));
      view.particles.burst({ x: p.x, y: p.y, z: p.z + 0.3, count: 30, colors: ELEM_COLORS.dark, speed: -3, gravity: 0, life: 0.5, size: 0.6, jitter: 2 });
    }
    await view.game.wait(0.4);
    for (const t of targets) impact(view, view.posOf(t), 'dark');
  },
  async quake(view, user, targets) {
    view.game.audio?.sfx('quake');
    view.shake(0.3, 0.5);
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.burst({ x: p.x, y: p.y - 0.9, z: p.z + 0.3, count: 26, colors: ['#c8b090', '#8a7a60'], speed: 4, up: 3, gravity: 12, life: 0.7, size: 0.6, additive: false });
    }
    await view.game.wait(0.35);
  },
  async meteor(view, user, targets) {
    view.game.audio?.sfx('fire');
    await Promise.all(targets.map(async (t, i) => {
      await view.game.wait(i * 0.08);
      const to = view.posOf(t);
      const from = to.clone().add(new THREE.Vector3(-3, 7, 0));
      await projectile(view, from, to, 'fire', 0.35);
      impact(view, to, 'fire', 1.6);
      view.shake(0.18, 0.2);
    }));
    view.flash('#ffd0a0', 0.25, 0.4);
  },
  async burst(view, user, targets, elem) {
    view.game.audio?.sfx('burst');
    for (const t of targets) impact(view, view.posOf(t), elem === 'prism' ? 'prism' : 'none', 1.5);
    view.flash('#ffffff', 0.18, 0.45);
    await view.game.wait(0.2);
  },
  async heal(view, user, targets) {
    view.game.audio?.sfx('heal');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.rise({ x: p.x, y: p.y - 0.8, z: p.z + 0.3, count: 22, colors: ELEM_COLORS.heal, speed: 1.6, width: 1 });
      view.tempLight(p, '#80ffb0', 3, 0.5);
    }
    await view.game.wait(0.4);
  },
  async revive(view, user, targets) {
    view.game.audio?.sfx('revive');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.rise({ x: p.x, y: p.y - 0.8, z: p.z + 0.3, count: 40, colors: ELEM_COLORS.light, speed: 2.4, width: 1 });
      view.tempLight(p, '#fff0c0', 6, 0.7);
    }
    await view.game.wait(0.5);
  },
  async buff(view, user, targets) {
    view.game.audio?.sfx('buff');
    for (const t of targets) {
      const p = view.posOf(t);
      const m = billboard(view, ringTexture(), new THREE.Color('#ffe080'), 1.8, p.clone().add(new THREE.Vector3(0, -0.8, 0.3)));
      m.rotation.x = -Math.PI / 2.4;
      fadeMesh(view, m, 0.6, (k) => { m.position.y = p.y - 0.8 + k * 1.8; });
      view.particles.rise({ x: p.x, y: p.y - 0.8, z: p.z + 0.3, count: 12, colors: ['#fff0a0', '#ffd060'], speed: 1.5, width: 1 });
    }
    await view.game.wait(0.4);
  },
  async debuff(view, user, targets) {
    view.game.audio?.sfx('debuff');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.burst({ x: p.x, y: p.y + 1.2, z: p.z + 0.3, count: 18, colors: ['#c080ff', '#6040a0'], speed: 0.8, gravity: 3, life: 0.8, size: 0.5 });
    }
    await view.game.wait(0.4);
  },
  async song(view, user, targets) {
    view.game.audio?.sfx('song');
    const p = view.posOf(user);
    view.particles.rise({ x: p.x, y: p.y, z: p.z + 0.3, count: 16, colors: ['#ffe8a0', '#ffffff', '#a0d8ff'], speed: 1.2, width: 2, life: 1.2 });
    await view.game.wait(0.3);
    return FX.buff(view, user, targets.filter((t) => t.side === user.side)).then(() => {
      const foes = targets.filter((t) => t.side !== user.side);
      if (foes.length) return FX.debuff(view, user, foes);
      return null;
    });
  },
  async summon(view, user, targets, elem) {
    view.game.audio?.sfx('summon');
    view.flash('#ffffff', 0.3, 0.6);
    const center = targets.length ? view.posOf(targets[0]) : view.posOf(user);
    view.particles.burst({ x: center.x, y: center.y + 2, z: center.z, count: 60, colors: colorsFor(elem || 'light'), speed: 6, gravity: 2, life: 1, size: 0.7 });
    await view.game.wait(0.4);
    for (const t of targets) impact(view, view.posOf(t), elem, 1.4);
    view.shake(0.2, 0.3);
  },
  async flask(view, user, targets, elem) {
    view.game.audio?.sfx('throw');
    await Promise.all(targets.map((t) => projectile(view, view.posOf(user), view.posOf(t), elem || 'poison', 0.3)));
    for (const t of targets) impact(view, view.posOf(t), elem || 'poison', 1.2);
  },
  async item(view, user, targets) {
    view.game.audio?.sfx('item');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.rise({ x: p.x, y: p.y - 0.6, z: p.z + 0.3, count: 14, colors: ['#ffffff', '#c0f0ff'], speed: 1.2, width: 0.8 });
    }
    await view.game.wait(0.3);
  },
  async status(view, user, targets) {
    view.game.audio?.sfx('debuff');
    for (const t of targets) {
      const p = view.posOf(t);
      view.particles.burst({ x: p.x, y: p.y + 0.4, z: p.z + 0.3, count: 14, colors: ['#ffffff', '#ffe0ff'], speed: 1.5, gravity: 0, life: 0.6, size: 0.45 });
    }
    await view.game.wait(0.3);
  },
  async steal(view, user, targets) {
    view.game.audio?.sfx('steal');
    for (const t of targets) impact(view, view.posOf(t), 'none', 0.6);
    await view.game.wait(0.15);
  },
  async jump(view, user, targets) {
    // Landing: handled by the scene's jump choreography; here the impact.
    view.game.audio?.sfx('quake');
    view.shake(0.25, 0.25);
    for (const t of targets) impact(view, view.posOf(t), 'pierce', 1.4);
    await view.game.wait(0.15);
  },
};

export async function playEffect(view, anim, user, targets, elem) {
  const fn = FX[anim] || FX.burst;
  await fn(view, user, targets, elem);
}

/** Whether an animation is a melee move (user steps forward). */
export function isMelee(anim) {
  return ['slash', 'thrust', 'blunt', 'claw', 'bite', 'steal', 'weapon'].includes(anim);
}
