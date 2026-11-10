// Battle presentation: builds a diorama stage, places battlers, runs the turn
// loop from BattleSystem and choreographs every event (lunges, spells,
// popups, breaks, KOs) before returning the outcome to the field.

import * as THREE from 'three';
import { keyCap } from '../core/Input.js';
import { autoAction } from './AutoPlay.js';
import { BattleSystem } from './BattleSystem.js';
import { BattleUI, ELEM_ICONS } from './BattleUI.js';
import { playEffect, isMelee } from './Effects.js';
import { windUniform } from '../world/MapBuilder.js';
import { buildBattleStage, partySlot, enemySlot, battlerMesh, setBattlePose } from './BattleStage.js';
import { applyMood, MOODS } from '../render/Moods.js';
import { ParticleSystem } from '../render/Particles.js';
import { getCharacterSheet, BATTLE_W, BATTLE_H } from '../render/SpriteFactory.js';
import { getMonsterSprite } from '../render/MonsterFactory.js';
import { PX_PER_UNIT } from '../render/PropFactory.js';
import { STATUSES } from '../data/statuses.js';
import { TROOPS } from '../data/troops.js';
import { BATTLE_BACKGROUNDS } from './Backgrounds.js';
import { el } from '../ui/UI.js';
import { SaveStore } from '../state/GameState.js';

const LETTERS = 'ABCDEFG';
const FOV = 33;

export class BattleScene {
  constructor(game) {
    this.game = game;
    this.sprites = new Map();
    this.time = 0;
    this.shakeAmt = 0;
    this.punch = 0; // camera punch-in on heavy hits: eases back to 0
    this.tempLights = [];
  }

  // =====================================================================
  // Setup
  // =====================================================================

  enter(params) {
    this.params = params;
    const game = this.game;
    const troop = TROOPS[params.troopId];
    this.snapshot = JSON.stringify(game.state.serialize());
    this.sys = new BattleSystem({ state: game.state, troopId: params.troopId, random: !params.boss && params.canFlee !== false && !troop.boss });
    this.scene = new THREE.Scene();
    const bgId = troop.bg || params.bg || 'grass';
    const bg = BATTLE_BACKGROUNDS[bgId] || BATTLE_BACKGROUNDS.grass;
    const base = troop.mood || bg.mood || params.mood || 'day';
    const mood = MOODS[`${base}_battle`] ? `${base}_battle` : base; // battle-tuned variant, if any
    this.env = applyMood(this.scene, mood, game.renderer, 12);
    game.renderer.setFocus(0.5, 0.2);
    const stage = buildBattleStage(this.scene, bg);
    this.stageAnim = stage.animated;
    this.stageLights = stage.lightSources;
    this.particles = new ParticleSystem(this.scene);
    this.particles.setAmbient(bg.particles ?? this.env.mood.particles);
    this.particles.area = { w: 20, d: 10 };

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 300);
    // Colossal foes (sprite size 4) get a wider shot so their silhouette fits.
    const colossal = this.sys.enemies.some((e) => (e.def.sprite.size || 1) >= 4);
    this.camBase = colossal ? new THREE.Vector3(0.6, 5.4, 13.8) : new THREE.Vector3(0.6, 4.6, 11.2);
    this.camLook = new THREE.Vector3(0, colossal ? 1.8 : 1.0, -0.6);
    this.camera.position.copy(this.camBase);
    this.camera.lookAt(this.camLook);

    // Key + fill so battlers read clearly in any mood (caves, night).
    const key = new THREE.DirectionalLight('#fff4e8', 1.1);
    key.position.set(2, 6, 12);
    this.scene.add(key);
    const fill = new THREE.HemisphereLight('#ffffff', '#404050', 0.45);
    this.scene.add(fill);

    this.pointLights = [];
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight('#ffffff', 0, 8, 1.5);
      this.scene.add(l);
      this.pointLights.push(l);
    }

    this.ui = new BattleUI(this);
    this.placeBattlers();
    this.ui.buildParty(this.sys.party);
    for (const e of this.sys.enemies) this.ui.buildEnemyTag(e);

    const music = params.music || troop.music || (troop.boss ? 'boss' : 'battle');
    game.audio?.playMusic(music, { restart: true });
    this.done = false;
    this.autoToggle = false;
    this.autoEl = el('div', 'b-auto', 'AUTO');
    this.ui.root.appendChild(this.autoEl);
    this.ui.root.appendChild(el('div', 'b-keys', `${keyCap('info')} Auto`));
    game.timeScale = [1, 1.5, 2][game.state.settings.battleSpeed || 0];
    this.run().catch((e) => { console.error(e); this.finish('win'); });
  }

  placeBattlers() {
    this.sys.party.forEach((b, i) => this.addSprite(b, partySlot(i)));
    const enemies = this.sys.enemies;
    // Biggest sprites take the front/central slots so a giant never hangs off-screen.
    const bySize = [...enemies].sort((a, b) => (b.def.sprite.size || 1) - (a.def.sprite.size || 1));
    enemies.forEach((b) => this.addSprite(b, this.enemySlot(bySize.indexOf(b), enemies.length, b)));
  }

  enemySlot(i, n, b) { return enemySlot(i, n, (b.def.sprite.size || 1) >= 2); }

  addSprite(b, pos) {
    let tex, w, h, sheet = null;
    if (b.isParty) {
      sheet = getCharacterSheet(b.ch.battleLook());
      tex = sheet.texture;
      w = BATTLE_W / PX_PER_UNIT;
      h = BATTLE_H / PX_PER_UNIT;
    } else {
      const spr = getMonsterSprite(b.def.sprite);
      tex = spr.texture;
      w = spr.width;
      h = spr.height;
    }
    const mesh = battlerMesh(tex, w, h);
    mesh.position.copy(pos);
    this.scene.add(mesh);
    const s = { b, mesh, sheet, base: pos.clone(), offset: new THREE.Vector3(), h, w, pose: 'idle', poseLock: 0, alpha: 1, seed: Math.random() * 10 };
    this.sprites.set(b, s);
    if (sheet) this.setPose(b, 'idle');
    return s;
  }

  setPose(b, pose, lockSec = 0) {
    const s = this.sprites.get(b);
    if (!s?.sheet) return;
    s.pose = pose;
    s.poseLock = lockSec;
    setBattlePose(s.mesh, s.sheet, pose);
  }

  /** 'A', 'B'... when several enemies share a name; '' otherwise. */
  enemyLetter(b) {
    if (!b.isEnemy) return '';
    const same = this.sys.enemies.filter((e) => e.def.id === b.def.id);
    return same.length < 2 ? '' : LETTERS[same.indexOf(b)] || '';
  }

  /** Toggle auto-battle (F). */
  setAuto(on) {
    this.autoToggle = on;
    this.autoEl.classList.toggle('on', on);
    this.game.audio?.sfx(on ? 'confirm' : 'cancel');
  }

  exit() {
    this.game.timeScale = 1;
    this.game.freeze = 0; // no hit-stop, shake or punch outlives the battle (or leaks into a retry)
    this.shakeAmt = 0;
    this.punch = 0;
    this.game.audio?.muffle(false);
    this.ui.dispose();
    this.highlightEls?.forEach((e) => e.remove());
    this.particles.dispose(this.scene);
    this.scene.traverse((o) => {
      const m = /** @type {THREE.Mesh} */ (o);
      if (m.geometry) m.geometry.dispose();
      if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat.dispose());
    });
  }

  // =====================================================================
  // View helpers used by Effects
  // =====================================================================

  posOf(b) {
    const s = this.sprites.get(b);
    if (!s) return new THREE.Vector3();
    return s.mesh.position.clone().add(new THREE.Vector3(0, s.h * 0.45, 0));
  }

  screenOf(b, where = 'head') {
    const s = this.sprites.get(b);
    const p = s.mesh.position.clone();
    p.y += where === 'foot' ? -0.05 : where === 'mid' ? s.h * 0.5 : s.h * 0.85;
    p.project(this.camera);
    return { x: (p.x * 0.5 + 0.5) * window.innerWidth, y: (-p.y * 0.5 + 0.5) * window.innerHeight };
  }

  tempLight(pos, color, intensity, sec) {
    const l = this.pointLights.find((x) => !x.userData.busy) || this.pointLights[0];
    l.userData.busy = true;
    l.position.copy(pos).add(new THREE.Vector3(0, 0.3, 0.8));
    l.color.set(color);
    l.distance = 8;
    this.game.tween(sec, (t) => { l.intensity = intensity * (1 - t); }).then(() => { l.userData.busy = false; l.intensity = 0; });
  }

  flash(color, sec = 0.2, amount = 0.5) {
    const r = this.game.renderer;
    return this.game.tween(sec, (t) => r.setFlash(amount * (1 - t), color)).then(() => r.setFlash(0));
  }

  shake(intensity, sec) {
    const amt = intensity * (this.game.shakeScale ?? 1);
    return this.game.tween(sec, (t) => { this.shakeAmt = amt * (1 - t); }).then(() => { this.shakeAmt = 0; });
  }

  highlight(list) {
    this.highlightEls?.forEach((e) => e.remove());
    this.highlightEls = list.map((b) => {
      const e = el('div', 'b-cursor', '▼');
      this.ui.root.appendChild(e);
      e._b = b;
      return e;
    });
    this.highlighted = list;
  }

  // =====================================================================
  // Battle loop
  // =====================================================================

  async run() {
    const sys = this.sys;
    const opening = sys.start();
    this.trace('intro');
    await this.intro(opening);
    this.trace('loop');
    let outcome = null;
    while (!(outcome = sys.outcome())) {
      const actor = sys.nextActor();
      if (!actor) break;
      this.trace(`turn ${sys.turn} ${actor.name}`);
      this.ui.setActive(actor.isParty ? actor : null);
      this.ui.refreshTimeline(actor);
      const turn = sys.beginTurn(actor);
      await this.present(turn.events);
      if (sys.outcome()) break;
      if (turn.skip || !actor.alive) {
        await this.present(sys.endTurn(actor, null));
        continue;
      }
      let action = turn.auto;
      if (!action) {
        if (actor.isParty && (this.game.autoBattle || this.autoToggle)) {
          action = this.autoAction(actor);
          await this.game.wait(0.2);
        } else if (actor.isParty) {
          this.setPose(actor, 'ready');
          this.stepForward(actor, true);
          action = await this.ui.chooseAction(actor);
          this.stepForward(actor, false);
        } else {
          action = sys.enemyAction(actor);
          await this.game.wait(0.25);
        }
      }
      const ev = sys.act(actor, action);
      await this.present(ev, actor, action);
      this.ui.hideBanner();
      if (sys.outcome()) break;
      await this.present(sys.endTurn(actor, action));
      this.ui.refreshParty();
    }
    await this.finish(sys.outcome() || 'win');
  }

  trace(msg) { if (this.game.debugTrace) this.game.debugTrace(msg); }

  async intro(opening) {
    const counts = new Map();
    for (const e of this.sys.enemies) counts.set(e.name, (counts.get(e.name) || 0) + 1);
    const names = [...counts].map(([n, c]) => (c > 1 ? `${n} ×${c}` : n));
    const zoom = this.camBase.clone().add(new THREE.Vector3(-2, 1.5, 4));
    const base = this.camBase.clone();
    this.camOverride = zoom.clone();
    await this.game.tween(0.9, (t) => { this.camOverride.lerpVectors(zoom, base, t); }, (t) => 1 - Math.pow(1 - t, 3));
    this.camOverride = null;
    if (this.sys.boss) {
      const boss = this.sys.enemies.find((e) => e.def.boss) || this.sys.enemies[0];
      this.ui.bigText(this.screenOf(boss, 'mid'), boss.name, 'boss-name');
      this.flash('#ffffff', 0.3, 0.4);
      this.shake(0.15, 0.4);
      await this.game.wait(1.3);
      return;
    }
    let text = `${names.join(', ')} ${this.sys.enemies.length > 1 ? 'appear' : 'appears'}!`;
    if (opening === 'preemptive') text = 'Preemptive strike! You have the upper hand.';
    if (opening === 'ambush') text = 'Ambushed!';
    await this.ui.message(text, 0.9);
  }

  /** Auto-battle: shared party AI (src/battle/AutoPlay.js). */
  autoAction(actor) { return autoAction(this.sys, actor); }

  stepForward(b, on) {
    const s = this.sprites.get(b);
    if (!s) return;
    const target = on ? -0.6 : 0;
    const from = s.offset.x;
    this.game.tween(0.15, (t) => { s.offset.x = from + (target - from) * t; });
  }

  // =====================================================================
  // Event presentation
  // =====================================================================

  async present(events, actor, action) {
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      switch (e.t) {
        case 'announce':
          this.ui.showBanner(e.name);
          if (e.user.isParty) this.setPose(e.user, 'ready', 0.4);
          break;
        case 'anim': await this.animate(e, action); break;
        case 'damage': this.showDamage(e); await this.game.wait(e.dot ? 0.4 : 0.12); break;
        case 'heal': this.showHeal(e); await this.game.wait(0.1); break;
        case 'miss':
          this.ui.popup(this.ui_screen(e.target), e.text || 'Miss', 'miss');
          this.dodge(e.target);
          await this.game.wait(0.15);
          break;
        case 'status':
          if (e.on && (e.id === 'charging' || e.id === 'windup')) this.game.audio?.sfx('windup');
          if (STATUSES[e.id]) this.ui.popup(this.ui_screen(e.target, 'mid'), `${e.on ? '' : '−'}${STATUSES[e.id].name}`, e.on ? (STATUSES[e.id].bad ? 'status-bad' : 'status-good') : 'status-off');
          this.refreshBattler(e.target);
          await this.game.wait(0.08);
          break;
        case 'stage':
          this.ui.popup(this.ui_screen(e.target, 'mid'), this.ui.stageText(e.key, e.delta), e.delta > 0 ? 'status-good' : 'status-bad');
          this.refreshBattler(e.target);
          await this.game.wait(0.08);
          break;
        case 'revive':
          this.revived(e.target);
          if (e.text) this.ui.popup(this.ui_screen(e.target), e.text, 'status-good');
          await this.game.wait(0.3);
          break;
        case 'break': await this.showBreak(e.target); break;
        case 'interrupt':
          this.game.audio?.sfx('interrupt');
          this.ui.popup(this.ui_screen(e.target, 'mid'), 'Interrupted!', 'status-off');
          await this.ui.message(`${e.target.name}'s attack is interrupted!`, 0.9);
          break;
        case 'recover':
          this.ui.popup(this.ui_screen(e.target), 'Recovered', 'status-off');
          this.ui.refreshEnemyTag(e.target);
          await this.game.wait(0.35);
          break;
        case 'poise': this.ui.refreshEnemyTag(e.target); break;
        case 'reveal': this.ui.refreshEnemyTag(e.target); this.ui.popup(this.ui_screen(e.target, 'mid'), `${ELEM_ICONS[e.elem]?.[0] || ''} Weakness!`, 'weak'); break;
        case 'scan': this.ui.refreshEnemyTag(e.target); await this.ui.message(`${e.target.name}: HP ${e.target.hp}/${e.target.maxHp}. Lv ${e.target.level}.`, 1.1); break;
        case 'steal':
          await this.ui.message(`${e.user.name} stole *${this.game.state.inventory.itemName(e.item)}*!`, 0.9);
          break;
        case 'text': await this.ui.message(e.text, 1.0); break;
        case 'afterglow': this.ui.refreshGlow(); break;
        case 'flee': await this.fleeAnim(); break;
        case 'jump': await this.jumpAnim(e.user, e.up, action); break;
        case 'summon': await this.summoned(e); break;
        case 'ko': break;
        case 'swap': await this.swapAnim(e.out, e.in); break;
        default: break;
      }
    }
    this.ui.refreshParty();
    for (const en of this.sys.enemies) this.ui.refreshEnemyTag(en);
  }

  ui_screen(b, where = 'head') { return this.screenOf(b, where); }

  /** Ease the camera toward a point of interest, then back. */
  focusCamera(point, amount = 0.18, sec = 0.9) {
    this.camFocusPoint = point.clone();
    const token = (this.camToken = (this.camToken || 0) + 1);
    this.game.tween(0.3, (t) => { if (this.camToken === token) this.camPush = amount * t; }).then(() =>
      this.game.wait(sec).then(() => this.game.tween(0.5, (t) => { if (this.camToken === token) this.camPush = amount * (1 - t); })));
  }

  async animate(e, action) {
    const { user, targets } = e;
    const anim = e.anim;
    const s = this.sprites.get(user);
    if (targets?.length && this.sprites.get(targets[0])) {
      const mid = this.posOf(user).lerp(this.posOf(targets[0]), 0.5);
      const big = ['meteor', 'summon', 'light', 'burst'].includes(anim) || action?.kind === 'link';
      this.focusCamera(mid, big ? 0.3 : 0.16, big ? 1.2 : 0.7);
    }
    if (action?.kind === 'link' && !e.linkShown) {
      e.linkShown = true;
      this.game.audio?.sfx('summon');
      this.ui.bigText({ x: window.innerWidth / 2, y: window.innerHeight * 0.32 }, 'LINK ART', 'link');
      this.flash('#ffe8a0', 0.4, 0.5);
      for (const p of action.partners || []) {
        this.setPose(p, 'cast', 1.2);
        const ps = this.sprites.get(p);
        if (ps) this.particles.rise({ x: ps.mesh.position.x, y: 0, z: ps.mesh.position.z + 0.2, count: 18, colors: ['#ffe8a0', '#ffffff'], speed: 2.2 });
      }
      await this.game.wait(0.5);
    }
    if (action?.surge && e.user.isParty && !e.surgeShown) {
      e.surgeShown = true;
      this.game.audio?.sfx('surge');
      if (s) this.particles.rise({ x: s.mesh.position.x, y: 0, z: s.mesh.position.z + 0.2, count: 14 * action.surge, colors: ['#ff9a4a', '#ffe090'], speed: 2.6 });
      this.ui.popup(this.screenOf(user, 'head'), `SURGE ${'◆'.repeat(action.surge)}`, 'surge');
    }
    const melee = isMelee(anim) && targets.length && targets[0] !== user && targets[0].side !== user.side;
    if (melee && s) {
      // Dash toward the first target.
      const t = this.sprites.get(targets[0]);
      const dir = t ? t.mesh.position.clone().sub(s.base).multiplyScalar(user.isParty ? 0.55 : 0.45) : new THREE.Vector3();
      dir.y = 0;
      const from = s.offset.clone();
      if (user.isParty) this.setPose(user, 'ready', 1);
      await this.game.tween(0.16, (k) => s.offset.copy(from).lerp(dir, k));
      if (user.isParty) this.setPose(user, 'attack', 1);
      await playEffect(this, anim === 'weapon' ? 'slash' : anim, user, targets, this.elemFor(e));
      this.returnHome(user);
    } else {
      if (user.isParty) this.setPose(user, 'cast', 1);
      else this.enemyPulse(user);
      if (s) this.tempLight(this.posOf(user), '#ffe8c0', 2.5, 0.35);
      this.game.audio?.sfx('cast');
      await this.game.wait(0.2);
      if (targets.length) await playEffect(this, anim, user, targets, this.elemFor(e));
      if (user.isParty) this.returnHome(user);
    }
  }

  elemFor(e) {
    const el0 = e.elem;
    if (el0 === 'weapon') return e.user.isParty ? e.user.base.weaponElem : 'slash';
    return el0 || 'none';
  }

  returnHome(b) {
    const s = this.sprites.get(b);
    if (!s) return;
    const from = s.offset.clone();
    this.game.tween(0.22, (k) => s.offset.copy(from).lerp(new THREE.Vector3(), k)).then(() => {
      if (b.isParty && b.alive) this.setPose(b, 'idle');
    });
  }

  enemyPulse(b) {
    const s = this.sprites.get(b);
    if (!s) return;
    this.game.tween(0.3, (k) => { s.mesh.material.emissiveIntensity = Math.sin(k * Math.PI) * 0.6; });
  }

  showDamage(e) {
    const b = e.target;
    if (e.silent) { if (e.ko) this.knockOut(b); return; }
    const scr = this.screenOf(b, 'mid');
    if (e.immune) { this.ui.popup(scr, 'Immune', 'miss'); this.game.audio?.sfx('resist'); return; }
    let cls = 'dmg';
    if (e.crit) cls += ' crit';
    if (e.weak) cls += ' weakhit';
    if (e.resisted) cls += ' resist';
    if (b.isParty) cls += ' onparty';
    this.ui.popup(scr, `${e.amount}`, cls);
    if (e.crit) this.ui.popup({ x: scr.x, y: scr.y - 28 }, 'Critical!', 'tag crit');
    if (e.weak) this.ui.popup({ x: scr.x, y: scr.y - 28 }, 'WEAK', 'tag weak');
    this.hurt(b, e.crit || e.weak ? 0.22 : 0.12);
    if (b.isParty) this.game.audio?.sfx('hurt');
    this.impact(e);
    if (e.ko) this.knockOut(b);
    this.refreshBattler(b);
  }

  /**
   * What the blow meant, felt before the number is read: a chime and a held frame for
   * a weakness, a crack for a critical, a dull thud for a resisted hit. Damage over
   * time stays quiet.
   */
  impact(e) {
    if (e.dot) return;
    const audio = this.game.audio;
    if (e.weak) audio?.sfx('weak');
    else if (e.resisted) audio?.sfx('resist');
    if (e.crit) audio?.sfx('crit');
    if (e.weak || e.crit) {
      this.hitStop(e.weak && e.crit ? 6 : 4);
      this.punch = Math.max(this.punch, e.crit ? 1 : 0.7);
    }
  }

  /** Freeze the scene for a few frames (at 60 fps), whatever the battle speed. */
  hitStop(frames) { this.game.hitStop(frames / 60); }

  showHeal(e) {
    const scr = this.screenOf(e.target, 'mid');
    this.ui.popup(scr, `${e.amount}`, e.mp ? 'mp' : 'heal');
    this.refreshBattler(e.target);
  }

  refreshBattler(b) {
    if (b.isParty) this.ui.refreshParty();
    else this.ui.refreshEnemyTag(b);
  }

  hurt(b, amt) {
    const s = this.sprites.get(b);
    if (!s) return;
    if (b.isParty && b.alive) this.setPose(b, 'hurt', 0.4);
    const mat = s.mesh.material;
    this.game.tween(0.35, (k) => {
      s.shakeX = Math.sin(k * 40) * amt * (1 - k);
      mat.emissiveIntensity = (1 - k) * 0.8;
      mat.emissive.set(b.isParty ? '#ff6060' : '#ffffff');
    }).then(() => { s.shakeX = 0; mat.emissiveIntensity = 0; });
  }

  dodge(b) {
    const s = this.sprites.get(b);
    if (!s) return;
    this.game.tween(0.3, (k) => { s.offset.x = Math.sin(k * Math.PI) * (b.isParty ? 0.6 : -0.6); });
  }

  knockOut(b) {
    const s = this.sprites.get(b);
    if (!s) return;
    if (b.isParty) {
      this.setPose(b, 'ko');
      this.game.audio?.sfx('ko');
      return;
    }
    this.game.audio?.sfx('enemyDie');
    const p = this.posOf(b);
    this.particles.burst({ x: p.x, y: p.y, z: p.z + 0.2, count: 40, colors: ['#ffffff', '#e0d0ff', '#a080ff'], speed: 2.5, up: 1.5, gravity: -1, life: 1.0, size: 0.5 });
    const mat = s.mesh.material;
    mat.transparent = true;
    this.game.tween(0.6, (k) => {
      mat.opacity = 1 - k;
      mat.emissiveIntensity = 1 - k;
      mat.emissive.set('#ffffff');
      s.mesh.scale.x = 1 + k * 0.3;
      s.mesh.scale.y = 1 - k * 0.2;
    }).then(() => { s.mesh.visible = false; });
    this.ui.refreshEnemyTag(b);
  }

  revived(b) {
    const s = this.sprites.get(b);
    if (!s) return;
    s.mesh.visible = true;
    s.mesh.material.opacity = 1;
    if (b.isParty) this.setPose(b, 'idle');
    this.refreshBattler(b);
  }

  async showBreak(b) {
    this.game.audio?.sfx('break');
    const p = this.posOf(b);
    this.particles.burst({ x: p.x, y: p.y, z: p.z + 0.4, count: 50, colors: ['#ffffff', '#a0e0ff', '#ffe080'], speed: 6, gravity: 5, life: 0.8, size: 0.6 });
    this.ui.bigText(this.screenOf(b, 'mid'), 'BREAK', 'break');
    this.flash('#ffffff', 0.15, 0.35);
    this.shake(0.15, 0.25);
    this.hitStop(6);
    this.punch = 1.4;
    this.ui.refreshEnemyTag(b);
    await this.game.wait(0.45);
  }

  async summoned(e) {
    const b = e.battler;
    const s = this.addSprite(b, this.enemySlot(this.sys.enemies.length - 1, this.sys.enemies.length, b));
    s.mesh.material.transparent = true;
    this.ui.buildEnemyTag(b);
    if (e.text) await this.ui.message(e.text, 0.8);
    await this.game.tween(0.5, (k) => { s.mesh.material.opacity = k; });
  }

  async jumpAnim(b, up, action) {
    const s = this.sprites.get(b);
    if (!s) return;
    if (up) {
      this.setPose(b, 'ready');
      this.game.audio?.sfx('jump');
      await this.game.tween(0.4, (k) => { s.offset.y = k * k * 12; });
      s.mesh.visible = false;
    } else {
      const target = action?.targets?.[0] || this.sys.enemies.find((e) => e.alive);
      const ts = target && this.sprites.get(target);
      s.mesh.visible = true;
      const dest = ts ? ts.mesh.position.clone().sub(s.base) : new THREE.Vector3();
      dest.y = 0;
      this.setPose(b, 'attack');
      await this.game.tween(0.25, (k) => { s.offset.set(dest.x * k, (1 - k) * 12, dest.z * k); });
      this.returnHome(b);
    }
  }

  async swapAnim(out, inn) {
    const s = this.sprites.get(out);
    if (!s) return;
    this.game.audio?.sfx('confirm');
    await this.game.tween(0.25, (k) => { s.offset.x = k * 6; });
    this.scene.remove(s.mesh);
    this.sprites.delete(out);
    const ns = this.addSprite(inn, s.base.clone());
    ns.offset.x = 6;
    this.ui.replaceMember(out, inn);
    await this.ui.message(`${inn.name} steps in!`, 0.5);
    await this.game.tween(0.25, (k) => { ns.offset.x = 6 * (1 - k); });
  }

  async fleeAnim() {
    this.game.audio?.sfx('flee');
    await this.ui.message('Escaped!', 0.4);
    await this.game.tween(0.5, (k) => {
      for (const b of this.sys.party) { const s = this.sprites.get(b); if (s) s.offset.x = k * 8; }
    });
  }

  // =====================================================================
  // End of battle
  // =====================================================================

  async finish(outcome) {
    if (this.done) return;
    this.done = true;
    const game = this.game;
    this.ui.setActive(null);
    if (outcome === 'win') {
      game.audio?.playMusic('victory', { once: true });
      for (const b of this.sys.party) if (b.alive) this.setPose(b, 'victory');
      await game.wait(0.8);
      const summary = this.sys.applyRewards();
      this.sys.commit('win');
      await this.ui.showVictory(summary);
      await this.ui.showLevelUps(summary);
    } else if (outcome === 'flee') {
      this.sys.commit('flee');
      game.state.stats.escapes++;
    } else {
      this.sys.commit('lose');
      if (!this.params.loseOk && game.autoConfirm) {
        // Headless tests: surface the loss instead of auto-retrying forever.
        console.error(`Test: party lost battle '${this.params.troopId}' (levels ${this.sys.party.map((b) => b.level).join('/')})`);
      } else if (!this.params.loseOk) {
        const choice = await this.defeatScreen();
        if (choice === 'retry') {
          // Restore the pre-battle state and fight again.
          const { GameState } = await import('../state/GameState.js');
          const restored = GameState.deserialize(JSON.parse(this.snapshot));
          Object.assign(game.state, restored);
          await game.fadeOut(0.5);
          this.exit();
          this.sprites.clear();
          this.time = 0;
          this.enter(this.params);
          await game.fadeIn(0.5);
          return;
        }
        game.defeatChoice = choice === 'load' ? 'load' : null; // main.js: load the last save, or the title
      } else {
        for (const c of game.state.activeMembers()) if (c.hp <= 0) c.hp = 1;
      }
    }
    await game.fadeOut(0.4);
    const lost = outcome === 'lose' && !this.params.loseOk;
    game.popScene(lost ? 'lose' : outcome);
    if (!lost) await game.fadeIn(0.4); // after a defeat, the title or the loaded save fades itself in
  }

  /**
   * The party has fallen: the battle music sinks behind a low-pass, then the choice —
   * fight again from the moment before the battle, go back to the last save, or the title.
   * @returns {Promise<'retry' | 'load' | 'title'>}
   */
  defeatScreen() {
    const game = this.game;
    game.audio?.muffle(true);
    return new Promise((resolve) => {
      const box = el('div', 'gameover');
      box.innerHTML = '<div class="go-title">The light fades...</div><div class="go-sub">but it has not gone out.</div>';
      game.ui.layers.top.appendChild(box);
      setTimeout(async () => {
        game.audio?.playMusic('gameover');
        game.audio?.muffle(false);
        const last = SaveStore.read(SaveStore.latestSlot())?.summary;
        const options = [['retry', 'Try again'], ...(last ? [['load', `Load last save — ${last.location || 'saved game'}`]] : []), ['title', 'Return to title']];
        const i = await game.ui.choice(options.map((o) => o[1]), { prompt: '' });
        box.remove();
        resolve(/** @type {'retry' | 'load' | 'title'} */ (options[i][0]));
      }, 1200);
    });
  }

  // =====================================================================
  // Frame update
  // =====================================================================

  update(dt) {
    this.time += dt;
    windUniform.value = this.time;
    if (this.game.input.pressed('info') && !this.done) { this.game.input.consume('info'); this.setAuto(!this.autoToggle); }
    for (const fn of this.stageAnim) fn(this.time);
    for (const [b, s] of this.sprites) {
      if (!s.mesh.visible) continue;
      let bob = 0;
      if (b.isParty) {
        if (s.poseLock > 0) s.poseLock -= dt;
        else if (b.alive && ['idle', 'idle2', 'hurt'].includes(s.pose)) {
          const want = b.hp < b.maxHp * 0.25 ? 'hurt' : (Math.floor(this.time * 2 + s.seed) % 2 ? 'idle' : 'idle2');
          if (want !== s.pose) this.setPose(b, want);
        }
      } else if (b.alive) {
        bob = Math.sin(this.time * 2.2 + s.seed) * 0.05;
        if (b.broken) bob = -0.1;
      }
      s.mesh.position.set(s.base.x + s.offset.x + (s.shakeX || 0), s.base.y + s.offset.y + bob, s.base.z + s.offset.z);
    }
    this.statusFx(dt);
    // Camera: gentle sway + shake
    const base = (this.camOverride || this.camBase).clone();
    const look = this.camLook.clone();
    if (this.camPush && this.camFocusPoint) {
      // Move toward the action and look at it.
      base.lerp(this.camFocusPoint.clone().add(new THREE.Vector3(0.3, 2.2, 6.5)), this.camPush);
      look.lerp(this.camFocusPoint, this.camPush * 1.6);
    }
    this.camera.position.set(
      base.x + Math.sin(this.time * 0.3) * 0.25 + (Math.random() - 0.5) * this.shakeAmt,
      base.y + Math.sin(this.time * 0.23) * 0.1 + (Math.random() - 0.5) * this.shakeAmt,
      base.z,
    );
    this.camera.lookAt(look);
    // A heavy hit punches the lens in for a moment.
    if (this.punch > 0) {
      this.punch = this.punch < 0.01 ? 0 : this.punch * Math.exp(-9 * dt);
      this.camera.fov = FOV - this.punch * 1.6 * (this.game.shakeScale ?? 1);
      this.camera.updateProjectionMatrix();
    }
    this.particles.focus.set(0, 0, -1);
    this.particles.update(dt, this.camera);
    // Sun
    const sun = this.env.sun;
    sun.target.position.set(0, 0, 0);
    sun.position.copy(this.env.sunOffset);
    // UI tracking
    this.ui.positionTags((b, where) => this.screenOf(b, where));
    if (this.highlightEls) {
      for (const e of this.highlightEls) {
        const p = this.screenOf(e._b, 'head');
        e.style.left = `${p.x}px`;
        e.style.top = `${p.y - 14}px`;
      }
    }
  }

  /** Periodic particles showing each battler's active statuses. */
  statusFx(dt) {
    this.statusT = (this.statusT || 0) - dt;
    if (this.statusT > 0) return;
    this.statusT = 0.45;
    const FX = {
      poison: ['#a0f070', '#60c040'], burn: ['#ffb060', '#ff6030'], sleep: ['#c0c8ff', '#ffffff'],
      regen: ['#a0ffc0', '#ffffff'], haste: ['#a0e8ff', '#ffffff'], slow: ['#8090c0', '#5a6090'],
      doom: ['#c080ff', '#6040a0'], charm: ['#ff90c0', '#ffd0e0'], charging: ['#ffe080', '#ffffff'], windup: ['#ff9a60', '#ffe0c0'],
      protect: ['#a0c0ff'], shell: ['#c0a0ff'], berserk: ['#ff5050'],
    };
    for (const [b, s] of this.sprites) {
      if (!b.alive || !s.mesh.visible) continue;
      for (const id of b.statuses.keys()) {
        const colors = FX[id];
        if (!colors) continue;
        const p = s.mesh.position;
        const rising = ['poison', 'burn', 'sleep', 'regen', 'charging', 'windup'].includes(id);
        this.particles.burst({
          x: p.x, y: p.y + s.h * (rising ? 0.6 : 0.4), z: p.z + 0.3, count: id === 'charging' || id === 'windup' ? 6 : 2, colors,
          speed: rising ? 0.5 : 1.2, up: rising ? 1.2 : 0, gravity: rising ? -0.5 : 0, life: 0.9, size: 0.4, jitter: s.w * 0.5,
        });
      }
    }
  }

  render(time) {
    this.game.renderer.render(this.scene, this.camera, time);
  }
}
