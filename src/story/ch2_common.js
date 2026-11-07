// Chapter 2 helpers shared by the story scripts.

const CAST = ['ilse', 'bram', 'sable'];

/** Spawn the walking party (minus the leader) for a cutscene: { ilse: [x, y, dir], ... } */
export function spawnParty(s, spots) {
  for (const id of CAST) {
    const p = spots[id];
    if (p) s.spawn(`${id}_c2`, id, p[0], p[1], p[2] || 'down', { solid: false });
  }
}

export function clearParty(s) {
  for (const id of CAST) s.remove(`${id}_c2`);
}

/** Cutscene actor id for a party member. */
export const pc = (id) => (id === 'wren' ? 'player' : `${id}_c2`);

/** Short "voice of the dead" line, styled as a whisper. */
export function whisper(s, text) {
  return s.say(null, `{purple|_${text}_}`, { style: 'narration', portrait: false, speed: 0.7 });
}

/** Bellamy's coach between Port Gale and Thistledown (the long way round the wold). */
export async function coachRide(s, from) {
  const dest = from === 'port_gale'
    ? { name: 'Thistledown', map: 'thistledown', x: 5, y: 17, dir: 'right' }
    : { name: 'Port Gale', map: 'port_gale', x: 43, y: 10, dir: 'down' };
  await s.say('Bellamy', `Coach to ${dest.name}, the long way round the wold. Two days, forty gold, and you\'ll hear every one of my opinions.`);
  if (!(await s.confirm(`Ride to ${dest.name} for 40 gold? (You have ${s.state.gold})`, 'Ride', 'Not now'))) return;
  if (s.state.gold < 40) { await s.say('Bellamy', 'Forty gold, friend. Opinions are free, the horses aren\'t.'); return; }
  await s.gold(-40, true);
  await s.fadeOut(0.8);
  await s.teleport(dest.map, dest.x, dest.y, dest.dir);
}
