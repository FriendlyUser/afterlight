// Chapter 3 field helpers: Aurenne's bells and rooftop leaps.

const PEAL = [1, 1.25, 1.5, 1.125, 1.333, 0.75];

/** Ring a peal of synthesized bronze bells (partials 1, 2, 2.76, 5.4 + a hum). */
export function ringBells(s, strikes = 4, base = 196, gap = 0.85) {
  const a = s.game.audio;
  if (!a?.ctx) return;
  const t0 = a.ctx.currentTime + 0.05;
  for (let i = 0; i < strikes; i++) {
    const f = base * PEAL[i % PEAL.length];
    const t = t0 + i * gap;
    a.tone(t, f * 0.5, 3.8, { type: 'sine', vol: 0.05, attack: 0.01 });
    a.tone(t, f, 3.2, { type: 'sine', vol: 0.11, attack: 0.004 });
    a.tone(t, f * 2.0, 2.2, { type: 'sine', vol: 0.05, attack: 0.004 });
    a.tone(t, f * 2.76, 1.3, { type: 'sine', vol: 0.03, attack: 0.002 });
    a.tone(t, f * 5.4, 0.5, { type: 'sine', vol: 0.016, attack: 0.002 });
  }
}

const HOUR = 300; // seconds of play per city "hour"

/** While on this map, the city's bells ring every in-game hour. */
export function startHourlyBells(s) {
  const st = s.state;
  st.vars.c3_bellHour = Math.floor(st.playtime / HOUR);
  s.field.animated.push(() => {
    const hour = Math.floor(st.playtime / HOUR);
    if (hour === st.vars.c3_bellHour) return;
    st.vars.c3_bellHour = hour;
    ringBells(s, 3 + (hour % 4), 174);
    if (!s.field.busy) s.toast('The bells of Aurenne ring the hour.');
  });
}

function dirTo(dx, dz) {
  if (Math.abs(dx) > Math.abs(dz)) return dx > 0 ? 'right' : 'left';
  return dz > 0 ? 'down' : 'up';
}

/** Jump an actor in an arc to a tile (ignores collision; keeps the arc above gaps). */
export async function leap(s, id, tx, ty, { height = 1.1, dur = 0.5 } = {}) {
  const a = s.actor(id);
  if (!a) return;
  const grid = s.field.grid;
  const x0 = a.x, z0 = a.z, e0 = grid.surface(a.tileX, a.tileY);
  const x1 = tx + 0.5, z1 = ty + 0.5, e1 = grid.surface(tx, ty);
  a.face(dirTo(x1 - x0, z1 - z0));
  a.scripted = true;
  s.sfx('jump');
  await s.game.tween(dur, (t) => {
    a.x = x0 + (x1 - x0) * t;
    a.z = z0 + (z1 - z0) * t;
    a.bobOffset = Math.sin(t * Math.PI) * height + (e0 + (e1 - e0) * t - a.elev);
    a.syncMesh();
  });
  a.bobOffset = 0;
  a.placeAt(tx, ty, grid);
  a.scripted = false;
}

/** Inspect handler: leap the party leader across a street from whichever side they stand on. */
export function leapAcross(axis, g0, g1) {
  return async (s) => {
    const p = s.actor('player');
    let tx = p.tileX, ty = p.tileY;
    if (axis === 'x') tx = tx < g0 ? g1 + 1 : g0 - 1;
    else ty = ty < g0 ? g1 + 1 : g0 - 1;
    if (!s.field.grid.walkable(tx, ty)) {
      await s.say('Wren', 'Not from here. I\'d land on a chimney.');
      return;
    }
    await leap(s, 'player', tx, ty);
  };
}

/** Leap inspect points along a street: axis 'x' = street runs north-south between columns g0..g1. */
export function streetLeaps(axis, g0, g1, from, to, cond) {
  const out = [];
  for (let i = from; i <= to; i++) {
    for (const g of new Set([g0, g1])) {
      out.push(axis === 'x'
        ? { x: g, y: i, hint: 'Leap', cond, run: leapAcross('x', g0, g1) }
        : { x: i, y: g, hint: 'Leap', cond, run: leapAcross('y', g0, g1) });
    }
  }
  return out;
}
