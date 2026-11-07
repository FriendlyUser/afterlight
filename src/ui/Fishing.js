// Fishing minigame: wait for a bite, then reel by stopping a sliding marker
// inside the catch zone three times before the line snaps (three misses).

import { el } from './UI.js';
import { keyCap } from '../core/Input.js';
import { FISH, rollFish } from '../data/fish.js';

export function playFishing(game, region) {
  return new Promise((resolve) => {
    const fishId = rollFish(region);
    if (!fishId) { resolve(null); return; }
    const fish = FISH[fishId];
    const zone = [0.34, 0.26, 0.19, 0.13, 0.09][fish.rarity];
    const speed = [0.9, 0.9, 1.25, 1.6, 2.1][fish.rarity];

    const box = el('div', 'panel fishing');
    box.innerHTML = `<div class="fs-title">Fishing</div><div class="fs-msg">Waiting for a bite...</div>
      <div class="fs-bar"><div class="fs-zone"></div><div class="fs-mark"></div></div>
      <div class="fs-pips"></div><div class="fs-hint">${keyCap('confirm')} Reel · ${keyCap('cancel')} Give up</div>`;
    const msg = box.querySelector('.fs-msg');
    const zoneEl = box.querySelector('.fs-zone');
    const mark = box.querySelector('.fs-mark');
    const pips = box.querySelector('.fs-pips');

    let phase = 'wait';
    let waitT = 1.2 + Math.random() * 2.5;
    let pos = 0, dir = 1, hits = 0, misses = 0;
    let zoneStart = 0;
    const newZone = () => {
      zoneStart = 0.05 + Math.random() * (0.9 - zone);
      zoneEl.style.left = `${zoneStart * 100}%`;
      zoneEl.style.width = `${zone * 100}%`;
    };
    const drawPips = () => { pips.innerHTML = `${'◆'.repeat(hits)}${'◇'.repeat(3 - hits)} <span class="fs-miss">${'✕'.repeat(misses)}</span>`; };
    newZone();
    drawPips();

    const finish = (caught) => {
      game.ui.remove(widget);
      if (caught) {
        game.state.inventory.add(fishId, 1);
        const log = (game.state.vars.fishLog = game.state.vars.fishLog || {});
        log[fishId] = (log[fishId] || 0) + 1;
        game.audio?.sfx('item');
        game.ui.toast(`Caught a <span class="hl">${fish.name}</span>!${log[fishId] === 1 ? ' (New!)' : ''}`);
      } else {
        game.audio?.sfx('cancel');
      }
      resolve(caught ? fishId : null);
    };

    const widget = {
      el: box,
      update(dt) {
        if (phase === 'wait') {
          waitT -= dt;
          if (waitT <= 0) { phase = 'reel'; msg.innerHTML = 'A bite! <b>Reel it in!</b>'; game.audio?.sfx('surprise'); }
          return;
        }
        if (phase !== 'reel') return;
        pos += dir * speed * dt;
        if (pos > 1) { pos = 1; dir = -1; }
        if (pos < 0) { pos = 0; dir = 1; }
        mark.style.left = `${pos * 100}%`;
      },
      handleInput(input) {
        if (input.pressed('cancel')) { input.consumeAll(); finish(false); return; }
        if (!input.pressed('confirm')) return;
        input.consumeAll();
        if (phase === 'wait') { msg.textContent = 'Too soon — be patient...'; waitT += 0.8; return; }
        if (phase !== 'reel') return;
        if (pos >= zoneStart && pos <= zoneStart + zone) {
          hits++;
          game.audio?.sfx('confirm');
          if (hits >= 3) { phase = 'done'; msg.innerHTML = `Landed a <b>${fish.name}</b>!`; drawPips(); setTimeout(() => finish(true), 700); return; }
          newZone();
        } else {
          misses++;
          game.audio?.sfx('buzzer');
          if (misses >= 3) { phase = 'done'; msg.textContent = 'The line snapped...'; drawPips(); setTimeout(() => finish(false), 700); return; }
        }
        drawPips();
      },
    };
    game.ui.push(widget, 'dialog');
  });
}
