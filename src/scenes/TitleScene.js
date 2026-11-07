// Title screen: Lanternfall at dusk behind the logo; New Game / Continue / Load.

import * as THREE from 'three';
import { buildMap, windUniform } from '../world/MapBuilder.js';
import { applyMood } from '../render/Moods.js';
import { ParticleSystem } from '../render/Particles.js';
import { getMap } from '../data/maps/index.js';
import { el } from '../ui/UI.js';
import { GameState, SaveStore, AUTO_SLOT } from '../state/GameState.js';
import { FieldScene } from '../world/FieldScene.js';
import { startNewGame, startNewGamePlus } from '../story/newGame.js';

export class TitleScene {
  constructor(game) {
    this.game = game;
    this.time = 0;
  }

  enter() {
    const game = this.game;
    this.scene = new THREE.Scene();
    this.env = applyMood(this.scene, 'dusk', game.renderer, 26);
    const map = getMap('lanternfall');
    const built = buildMap(map, { windows: true });
    this.scene.add(built.group);
    this.animated = built.animated;
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#2a4a7a' }));
    ocean.position.set(23, -0.2, 18);
    this.scene.add(ocean);
    this.lights = built.lightSources.slice(0, 6).map((s) => {
      const l = new THREE.PointLight(s.color, s.intensity, s.distance || 6, 1.6);
      l.position.set(s.x, s.y, s.z);
      this.scene.add(l);
      return l;
    });
    this.particles = new ParticleSystem(this.scene);
    this.particles.setAmbient('embers_soft');
    this.particles.focus.set(14, 3, 10);
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.5, 400);
    game.renderer.setFocus(0.55, 0.18);

    this.root = el('div', 'title-screen');
    this.root.innerHTML = `
      <div class="ts-logo"><div class="ts-pre">A coming-of-age at the end of the world</div><div class="ts-name">AFTERLIGHT</div><div class="ts-rule"></div></div>
      <div class="ts-menu"></div>
      <div class="ts-foot">Arrow keys / WASD to move · Z / Enter to confirm · X / Esc to cancel · C to open the menu</div>`;
    game.ui.layers.hud.appendChild(this.root);
    this.menuEl = this.root.querySelector('.ts-menu');
    this.hasSave = SaveStore.latestSlot() !== -1;
    this.clearSlot = this.findClearedSave();
    this.options = [
      ...(this.hasSave ? [{ id: 'continue', label: 'Continue' }] : []),
      { id: 'new', label: 'New Game' },
      ...(this.clearSlot !== null ? [{ id: 'ngplus', label: 'New Game+' }] : []),
      { id: 'load', label: 'Load Game', disabled: !this.hasSave },
    ];
    this.index = 0;
    this.renderMenu();
    this.widget = { el: null, handleInput: (input) => this.handleInput(input) };
    game.ui.push(this.widget);
    game.audio?.playMusic('title');
    game.fadeIn(1.5);
  }

  renderMenu() {
    this.menuEl.innerHTML = this.options.map((o, i) => `<div class="ts-item ${i === this.index ? 'sel' : ''} ${o.disabled ? 'off' : ''}">${o.label}</div>`).join('');
  }

  async handleInput(input) {
    if (this.busy) return;
    const n = this.options.length;
    if (input.repeat('up')) { this.index = (this.index + n - 1) % n; this.game.audio?.sfx('cursor'); this.renderMenu(); }
    if (input.repeat('down')) { this.index = (this.index + 1) % n; this.game.audio?.sfx('cursor'); this.renderMenu(); }
    if (!input.pressed('confirm')) return;
    input.consumeAll();
    const o = this.options[this.index];
    if (o.disabled) { this.game.audio?.sfx('buzzer'); return; }
    this.game.audio?.sfx('confirm');
    this.busy = true;
    if (o.id === 'new') await this.newGame();
    else if (o.id === 'ngplus') await this.newGame(this.clearSlot);
    else if (o.id === 'continue') await this.loadSlot(SaveStore.latestSlot());
    else if (o.id === 'load') {
      this.root.style.display = 'none';
      const slot = await this.game.menus.openLoad();
      this.root.style.display = '';
      if (slot !== null && slot !== undefined) await this.loadSlot(slot);
    }
    this.busy = false;
  }

  /** Slot of the most recent save that has finished the story, or null. */
  findClearedSave() {
    let best = null, t = -1;
    for (const slot of [AUTO_SLOT, 0, 1, 2, 3, 4, 5]) {
      const rec = SaveStore.read(slot);
      if (rec?.data?.flags?.gameClear && rec.summary.savedAt > t) { best = slot; t = rec.summary.savedAt; }
    }
    return best;
  }

  async newGame(clearedSlot = null) {
    const game = this.game;
    game.audio?.stopMusic(2);
    await game.fadeOut(1.5);
    this.cleanupUi();
    const settings = game.state.settings; // a new game keeps the player's settings
    Object.assign(game.state, new GameState(), { settings });
    game.applySettings();
    const start = clearedSlot === null
      ? startNewGame(game.state)
      : startNewGamePlus(game.state, GameState.deserialize(SaveStore.read(clearedSlot).data));
    await game.setScene(new FieldScene(game), start);
    await game.fadeIn(1.0);
  }

  async loadSlot(slot) {
    const game = this.game;
    const rec = SaveStore.read(slot);
    if (!rec) return;
    game.audio?.stopMusic(1);
    await game.fadeOut(0.8);
    this.cleanupUi();
    Object.assign(game.state, GameState.deserialize(rec.data));
    game.applySettings();
    const loc = game.state.location;
    await game.setScene(new FieldScene(game), { mapId: loc.mapId, x: loc.x, y: loc.y, dir: loc.dir });
    await game.fadeIn(0.8);
  }

  cleanupUi() {
    this.game.ui.remove(this.widget);
    this.root.remove();
  }

  exit() {
    this.cleanupUi();
    this.particles.dispose(this.scene);
  }

  update(dt) {
    this.time += dt;
    windUniform.value = this.time;
    const a = this.time * 0.04;
    const center = new THREE.Vector3(9, 3, 6);
    this.camera.position.set(center.x - 9 + Math.sin(a) * 7, 4.5 + Math.sin(this.time * 0.1) * 0.4, center.z + 30);
    this.camera.lookAt(center.x + 2, center.y + 5.5, center.z);
    for (const fn of this.animated) fn(this.time);
    this.particles.update(dt, this.camera);
    const sun = this.env.sun;
    sun.target.position.copy(center);
    sun.position.copy(center).add(this.env.sunOffset);
  }

  render(time) { this.game.renderer.render(this.scene, this.camera, time); }
}
