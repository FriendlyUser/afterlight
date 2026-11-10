// Resolves battle actions into state changes + a list of presentation events.
//
// Event types (consumed by BattleScene):
//  announce{user,name}  anim{user,anim,targets,elem}  damage{target,amount,crit,weak,resisted,absorbed,ko}
//  miss{target}  heal{target,amount,mp}  status{target,id,on}  stage{target,key,delta}  revive{target}
//  break{target}  reveal{target,elem}  steal{user,target,item}  text{text}  afterglow{value}
//  flee{}  jump{user,up}  summon{battler}  ko{target}

import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { STATUSES, BAD_STATUSES } from '../data/statuses.js';
import { computeDamage, computeHeal, isPhysical, PRISM } from './Formulas.js';
import { interruptTell } from './AI.js';

export const AFTERGLOW_MAX = 300;
/** A telegraphed (e_charge) blow hits this much harder; Guard halves it back. */
export const CHARGE_POWER = 1.5;

export class ActionResolver {
  constructor(battle) {
    this.b = battle; // BattleSystem
    this.rnd = battle.rnd;
  }

  opponentsOf(u) { return u.isParty ? this.b.enemies : this.b.party; }
  alliesOf(u) { return u.isParty ? this.b.party : this.b.enemies; }
  livingOpponents(u) { return this.opponentsOf(u).filter((x) => x.alive && !x.hasStatus('airborne')); }
  livingAllies(u) { return this.alliesOf(u).filter((x) => x.alive); }

  // =====================================================================
  // Entry point
  // =====================================================================

  /**
   * action: { kind: 'skill'|'item'|'link', id, targets: [Battler], surge, linkMembers }
   * Returns an events array.
   */
  execute(user, action) {
    const ev = [];
    if (action.kind === 'item') return this.useItem(user, action, ev);
    const skill = SKILLS[action.id];
    if (!skill) { ev.push({ t: 'text', text: `${user.name} hesitates.` }); return ev; }

    // Costs
    if (action.kind !== 'link') {
      let mp = this.mpCost(user, skill);
      if (user.id === 'corvin' && mp > 0 && this.rnd() < 1 / 6) { action.gambit = true; mp = 0; }
      user.mp = Math.max(0, user.mp - mp);
      if (skill.hpCost) user.hp = Math.max(1, user.hp - Math.floor(user.maxHp * skill.hpCost));
    }
    if (action.id !== 'attack' && action.id !== 'guard') ev.push({ t: 'announce', user, name: action.gambit ? `${skill.name} — Gambit!` : skill.name });

    const repeat = user.hasStatus('doubled') && action.id !== 'double_down' && action.id !== 'attack' ? 2 : 1;
    if (repeat === 2) user.removeStatus('doubled');
    for (let r = 0; r < repeat; r++) this.performSkill(user, skill, action, ev);
    user.lastAction = action;
    return ev;
  }

  mpCost(user, skill) {
    const base = skill.mp || 0;
    const pct = user.mods?.mpCost || 0;
    return Math.max(0, Math.round(base * (1 + pct / 100)));
  }

  // =====================================================================
  // Skills
  // =====================================================================

  resolveTargets(user, skill, chosen) {
    const t = skill.target;
    if (t === 'enemies') return this.livingOpponents(user);
    if (t === 'allies') return skill.revive ? this.alliesOf(user) : this.livingAllies(user);
    if (t === 'self') return [user];
    if (t === 'random') return this.livingOpponents(user);
    if (t === 'ko') return (chosen || []).filter((x) => !x.alive);
    // single target: re-target if the chosen one died meanwhile
    let list = (chosen || []).filter((x) => x.alive || t === 'ko');
    if (!list.length) {
      const pool = t === 'ally' || t === 'allyAny' ? this.livingAllies(user) : this.livingOpponents(user);
      if (pool.length) list = [pool[Math.floor(this.rnd() * pool.length)]];
    }
    return list;
  }

  performSkill(user, skill, action, ev) {
    let targets = this.resolveTargets(user, skill, action.targets);
    if (skill.special === 'jump' && !action.landing) return this.jumpUp(user, skill, action, ev);
    if (skill.special && SPECIALS[skill.special] && !skill.power && skill.kind !== 'heal') {
      SPECIALS[skill.special](this, user, skill, targets, action, ev);
      this.applySelfEffects(user, skill, ev);
      return;
    }
    ev.push({ t: 'anim', user, anim: skill.anim === 'weapon' ? this.weaponAnim(user) : skill.anim, targets, elem: skill.elem });

    if (skill.kind === 'heal') this.doHeal(user, skill, targets, action, ev);
    else if (skill.kind === 'support') this.doSupport(user, skill, targets, ev);
    else this.doDamage(user, skill, targets, action, ev);

    if (skill.special && SPECIALS[skill.special]) SPECIALS[skill.special](this, user, skill, targets, action, ev);
    this.applySelfEffects(user, skill, ev);
  }

  weaponAnim(user) {
    if (!user.isParty) return user.def.attackAnim || 'claw';
    const wt = user.base.weaponType;
    return { bow: 'arrow', gun: 'shot', spear: 'thrust', dagger: 'thrust', fist: 'blunt', staff: 'blunt', rod: 'blunt', instrument: 'blunt', tome: 'blunt' }[wt] || 'slash';
  }

  applySelfEffects(user, skill, ev) {
    for (const id of skill.selfStatus || []) {
      if (user.addStatus(id, this.statusTurns(user, id))) ev.push({ t: 'status', target: user, id, on: true });
    }
    for (const [k, v] of Object.entries(skill.selfBuffs || {})) {
      const d = user.addStage(k, v, this.buffTurns(user));
      if (d) ev.push({ t: 'stage', target: user, key: k, delta: d });
    }
  }

  buffTurns(user) { return 4 + (user.flags?.has('resonance') ? 2 : 0); }
  statusTurns(user, id) {
    const base = STATUSES[id]?.turns;
    return base ? base + (user.flags?.has('resonance') && !STATUSES[id].bad ? 2 : 0) : base;
  }

  // ------------------------------------------------------------------ damage

  doDamage(user, skill, targets, action, ev) {
    const hits = (skill.hits || 1);
    let power = (skill.power ?? 100) * (user.artPower?.[action.id] || 1);
    if (action.gambit) power *= 2;
    if (skill.special === 'revenge') power += 200 * (1 - user.hp / user.maxHp);
    if (skill.special === 'afterglowScale') power *= 1 + this.b.afterglow / 150;
    if (user.hasStatus('charging')) { power *= CHARGE_POWER; user.removeStatus('charging'); }
    const forceWeak = skill.special === 'allWeak';
    const random = skill.target === 'random';
    let totalDealt = 0;

    const strike = (target) => {
      if (!target.alive) return;
      // Cover: an ally with Cover steps in front of a weakened target.
      target = this.coverRedirect(user, target, skill, ev);
      if (target.hasStatus('veil') && isPhysical(skill)) {
        const st = target.statuses.get('veil');
        st.charges -= 1;
        if (st.charges <= 0) { target.removeStatus('veil'); ev.push({ t: 'status', target, id: 'veil', on: false }); }
        ev.push({ t: 'miss', target, text: 'Dodged!' });
        if (target.flags.has('evadeCounter')) this.queueCounter(target, user);
        return;
      }
      const r = computeDamage(user, target, skill, { power, surge: action.surge || 0, rnd: this.rnd, forceWeak });
      if (r.miss) {
        ev.push({ t: 'miss', target });
        if (target.flags.has('evadeCounter')) this.queueCounter(target, user);
        return;
      }
      if (r.immune) { ev.push({ t: 'damage', target, amount: 0, immune: true, elem: r.elem }); return; }
      if (r.absorbed) {
        const h = target.heal(r.amount);
        ev.push({ t: 'heal', target, amount: h, absorbed: true });
        return;
      }
      this.reveal(target, r.elem, r.weak, ev);
      const dealt = this.applyDamage(target, r.amount, ev, { crit: r.crit, weak: r.weak, resisted: r.resisted, elem: r.elem, source: user });
      totalDealt += dealt;
      if (r.weak) this.poiseHit(user, target, 1 + (action.surge || 0) + (action.kind === 'link' ? 1 : 0), ev);
      if (r.crit) this.gainAfterglow(user, 4, ev);
      if (r.weak) this.gainAfterglow(user, 6, ev);
      // Status riders
      for (const [id, chance] of skill.status || []) this.tryStatus(user, target, id, chance, ev);
      if (user.id === 'sable' && this.rnd() < 0.12) this.tryStatus(user, target, this.randomBad(), 0.6, ev);
      for (const [k, v] of Object.entries(skill.debuffs || {})) this.stage(target, k, v, ev);
      if (target.hasStatus('sleep') && dealt > 0) { target.removeStatus('sleep'); ev.push({ t: 'status', target, id: 'sleep', on: false }); }
      if (action.id === 'attack' && user.id === 'pip' && this.rnd() < 0.25) SPECIALS.steal(this, user, skill, [target], action, ev, true);
      // Counter
      if (isPhysical(skill) && skill.target !== 'enemies' && target.alive && !random) {
        const c = target.mods?.counter || 0;
        if (c && this.rnd() * 100 < c) this.queueCounter(target, user);
      }
    };

    for (let h = 0; h < hits; h++) {
      if (random) {
        const pool = this.livingOpponents(user);
        if (!pool.length) break;
        strike(pool[Math.floor(this.rnd() * pool.length)]);
      } else {
        for (const t of targets) strike(t);
      }
    }
    if (skill.drain && totalDealt > 0) {
      const h = user.heal(Math.round(totalDealt * skill.drain));
      if (h) ev.push({ t: 'heal', target: user, amount: h });
    }
  }

  /** Apply raw damage with death-defying passives. Returns damage dealt. */
  applyDamage(target, amount, ev, info = {}) {
    // Bram's Bulwark: take a lethal blow for an ally.
    if (target.isParty && amount >= target.hp) {
      const bram = this.b.party.find((p) => p.alive && p.flags.has('bulwark') && p !== target && !p.flagsUsed.has('bulwark'));
      if (bram && amount < bram.hp + bram.maxHp * 0.5) {
        bram.flagsUsed.add('bulwark');
        ev.push({ t: 'text', text: `${bram.name} throws himself in the way!` });
        target = bram;
        amount = Math.round(amount * 0.6);
      }
    }
    let survived = false;
    if (amount >= target.hp && target.flags.has('resolve') && !target.flagsUsed.has('resolve') && target.hp > 1) {
      target.flagsUsed.add('resolve');
      amount = target.hp - 1;
      survived = true;
    }
    target.damage(amount);
    ev.push({ t: 'damage', target, amount, ...info, ko: !target.alive });
    if (survived) ev.push({ t: 'text', text: `${target.name} refuses to fall!` });
    if (target.isParty) {
      this.gainAfterglow(target, target.flags.has('adrenaline') ? 7 : 3, ev);
      if (target.alive && target.flags.has('autoPotion') && !target.flagsUsed.has('autoPotion') && target.hp < target.maxHp * 0.3) {
        target.flagsUsed.add('autoPotion');
        const h = target.heal(Math.round(target.maxHp * 0.3));
        ev.push({ t: 'heal', target, amount: h, text: 'Auto-Tonic' });
      }
    }
    if (!target.alive) this.onKo(target, ev);
    return amount;
  }

  onKo(target, ev) {
    const reraise = target.hasStatus('reraise');
    target.statuses.clear();
    target.stages = {};
    if (target.isParty) this.gainAfterglow(target, 15, ev);
    if (target.isEnemy) this.b.noteDefeat(target);
    if (reraise) {
      target.revive(0.25);
      ev.push({ t: 'revive', target, text: 'Reraise!' });
    }
  }

  coverRedirect(user, target, skill, ev) {
    if (!user.isEnemy || !target.isParty || !isPhysical(skill) || skill.target !== 'enemy') return target;
    if (target.hp > target.maxHp * 0.3) return target;
    const coverer = this.b.party.find((p) => p !== target && p.alive && p.flags.has('cover') && !p.hasStatus('sleep') && !p.hasStatus('stun'));
    if (!coverer || this.rnd() > (coverer.flags.has('martyr') ? 0.9 : 0.6)) return target;
    ev.push({ t: 'text', text: `${coverer.name} covers ${target.name}!` });
    return coverer;
  }

  queueCounter(from, to) {
    if (!from.alive || !to.alive || from.hasStatus('sleep') || from.hasStatus('stun')) return;
    this.b.pendingCounters.push({ from, to });
  }

  reveal(target, elem, weak, ev) {
    if (!target.isEnemy || !elem || elem === 'none') return;
    if (weak && !target.revealed.has(elem)) {
      target.revealed.add(elem);
      ev.push({ t: 'reveal', target, elem });
      this.b.noteWeakness(target, elem);
    }
  }

  poiseHit(user, target, n, ev) {
    if (!target.isEnemy || target.broken || !target.alive) return;
    target.poise = Math.max(0, target.poise - n);
    ev.push({ t: 'poise', target, value: target.poise });
    if (target.poise === 0) {
      target.broken = true;
      target.av += target.baseAV();
      ev.push({ t: 'break', target });
      if (interruptTell(target)) ev.push({ t: 'interrupt', target });
      this.gainAfterglow(user, 20, ev);
    }
  }

  gainAfterglow(who, n, ev) {
    if (!who.isParty) return;
    const mult = 1 + ((who.mods?.afterglow || 0) + (who.flags.has('resolve') ? 25 : 0)) / 100;
    const before = this.b.afterglow;
    this.b.afterglow = Math.min(AFTERGLOW_MAX, this.b.afterglow + Math.round(n * mult));
    if (this.b.afterglow !== before) ev.push({ t: 'afterglow', value: this.b.afterglow });
  }

  tryStatus(user, target, id, chance, ev) {
    if (!target.alive || target.immune.has(id)) return false;
    if (target.isEnemy && target.def.boss && ['doom', 'stun', 'charm', 'sleep'].includes(id)) chance *= 0.25;
    const luck = (user.lck - target.lck) / 200;
    if (this.rnd() > chance + luck) return false;
    if (target.addStatus(id, this.statusTurns(user, id))) ev.push({ t: 'status', target, id, on: true });
    if (id === 'stun') target.av += target.baseAV() * 0.6;
    return true;
  }

  randomBad() {
    const pool = ['poison', 'blind', 'silence', 'sleep', 'slow', 'burn'];
    return pool[Math.floor(this.rnd() * pool.length)];
  }

  stage(target, key, delta, ev, turns = 4) {
    const d = target.addStage(key, delta, turns);
    if (d) ev.push({ t: 'stage', target, key, delta: d });
  }

  // ------------------------------------------------------------------ healing / support

  doHeal(user, skill, targets, action, ev) {
    for (const t of targets) {
      if (skill.revive && !t.alive) {
        t.revive(skill.revive);
        ev.push({ t: 'revive', target: t });
        continue;
      }
      if (!t.alive) continue;
      if (skill.power) {
        let amt = computeHeal(user, t, skill.power * (user.artPower?.[action.id] || 1) * (action.gambit ? 2 : 1) * (1 + 0.5 * (action.surge || 0)));
        const h = t.heal(amt);
        ev.push({ t: 'heal', target: t, amount: h });
      }
      if (skill.cure === 'bad') for (const id of t.cureBad()) ev.push({ t: 'status', target: t, id, on: false });
      else for (const id of skill.cure || []) if (t.removeStatus(id)) ev.push({ t: 'status', target: t, id, on: false });
      for (const [id, chance] of skill.status || []) this.tryStatus(user, t, id, chance, ev);
      for (const [k, v] of Object.entries(skill.buffs || {})) this.stage(t, k, v, ev, this.buffTurns(user));
    }
  }

  doSupport(user, skill, targets, ev) {
    for (const t of targets) {
      if (!t.alive) continue;
      for (const [id, chance] of skill.status || []) {
        const ok = this.tryStatus(user, t, id, chance, ev);
        if (!ok && STATUSES[id]?.bad) ev.push({ t: 'miss', target: t, text: 'Resisted' });
      }
      for (const [k, v] of Object.entries(skill.buffs || {})) this.stage(t, k, v, ev, this.buffTurns(user));
      for (const [k, v] of Object.entries(skill.debuffs || {})) this.stage(t, k, v, ev);
    }
  }

  // ------------------------------------------------------------------ jump

  jumpUp(user, skill, action, ev) {
    user.addStatus('airborne');
    user.pendingJump = { ...action, landing: true };
    ev.push({ t: 'jump', user, up: true });
    ev.push({ t: 'text', text: `${user.name} leaps into the sky!` });
  }

  // =====================================================================
  // Items
  // =====================================================================

  useItem(user, action, ev) {
    const item = ITEMS[action.id];
    const use = item.use;
    this.b.inventory.remove(action.id, 1);
    ev.push({ t: 'announce', user, name: item.name });
    const potency = 1 + (user.mods?.itemPct || 0) / 100;
    let targets;
    if (use.target === 'allies') targets = use.revive ? this.alliesOf(user) : this.livingAllies(user);
    else if (use.target === 'enemies') targets = this.livingOpponents(user);
    else if (use.target === 'self') targets = [user];
    else targets = action.targets || [];
    ev.push({ t: 'anim', user, anim: use.damage ? 'flask' : 'item', targets, elem: use.elem });

    if (use.special === 'escape') return SPECIALS.escape(this, user, null, [], action, ev);
    if (use.special === 'kindle') { this.b.afterglow = Math.min(AFTERGLOW_MAX, this.b.afterglow + 100); ev.push({ t: 'afterglow', value: this.b.afterglow }); return ev; }

    for (const t of targets) {
      if (use.revive) {
        if (!t.alive) { t.revive(use.revive); ev.push({ t: 'revive', target: t }); }
        continue;
      }
      if (!t.alive) continue;
      if (use.damage) {
        let dmg = use.damage * potency;
        const em = t.elementMultiplier(use.elem);
        dmg = Math.round(dmg * Math.max(0, em) * (t.broken ? 1.5 : 1));
        const weak = t.weak.has(use.elem);
        this.reveal(t, use.elem, weak, ev);
        this.applyDamage(t, dmg, ev, { weak, elem: use.elem });
        if (weak) this.poiseHit(user, t, 1, ev);
      }
      if (use.heal) ev.push({ t: 'heal', target: t, amount: t.heal(Math.round(use.heal * potency)) });
      if (use.healPct) ev.push({ t: 'heal', target: t, amount: t.heal(Math.round(t.maxHp * use.healPct / 100)) });
      if (use.mp || use.mpPct) {
        const before = t.mp;
        t.mp = Math.min(t.maxMp, t.mp + Math.round((use.mp || 0) * potency + t.maxMp * (use.mpPct || 0) / 100));
        ev.push({ t: 'heal', target: t, amount: t.mp - before, mp: true });
      }
      if (use.cure === 'bad') for (const id of t.cureBad()) ev.push({ t: 'status', target: t, id, on: false });
      else for (const id of use.cure || []) if (t.removeStatus(id)) ev.push({ t: 'status', target: t, id, on: false });
      for (const [id, ch] of use.status || []) this.tryStatus(user, t, id, ch, ev);
    }
    return ev;
  }
}

// =====================================================================
// Special handlers: (resolver, user, skill, targets, action, ev, quiet?)
// =====================================================================

/** How far a turn-delaying Art pushes a target back, in its own base waits (bosses resist). */
const pushback = (t, all) => (t.isEnemy && t.def.boss ? (all ? 0.5 : 0.4) : 1);

/**
 * How an Art would move others on the timeline, for the turn-order preview: a Map of
 * battler -> Action Value added (Stasis, Eternal Moment) or -Infinity (Quicken: at once).
 * Null when the Art leaves the order alone.
 */
export function turnShifts(sys, user, skill, targets) {
  const shift = new Map();
  if (skill?.special === 'delay') for (const t of targets) shift.set(t, t.baseAV() * pushback(t, false));
  else if (skill?.special === 'delayAll') for (const t of sys.resolver.livingOpponents(user)) shift.set(t, t.baseAV() * pushback(t, true));
  else if (skill?.special === 'quicken') for (const t of targets) { if (t !== user) shift.set(t, -Infinity); }
  return shift.size ? shift : null;
}

const SPECIALS = {
  guard(r, user, skill, targets, action, ev) {
    user.addStatus('guard', 1);
    ev.push({ t: 'status', target: user, id: 'guard', on: true });
    if (user.flags.has('sentinel')) {
      const h = user.heal(Math.round(user.maxHp * 0.05));
      if (h) ev.push({ t: 'heal', target: user, amount: h });
    }
  },
  steal(r, user, skill, targets, action, ev, quiet = false) {
    const t = targets[0];
    if (!t || !t.isEnemy) return;
    if (!quiet) ev.push({ t: 'anim', user, anim: 'steal', targets: [t] });
    if (t.stolen) { if (!quiet) ev.push({ t: 'text', text: 'Nothing left to steal.' }); return; }
    const list = t.def.steal || [];
    const bonus = (user.mods?.dropPct || 0) / 100;
    const chance = 0.45 + (user.lck - t.lck) / 150 + bonus * 0.2;
    if (!list.length || r.rnd() > chance) { if (!quiet) ev.push({ t: 'text', text: 'Couldn\'t steal anything.' }); return; }
    const rare = list[1] && r.rnd() < 0.12 + bonus * 0.1;
    const item = rare ? list[1] : list[0];
    t.stolen = true;
    r.b.inventory.add(item, 1);
    ev.push({ t: 'steal', user, target: t, item });
  },
  scan(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'status', targets });
    for (const t of targets) {
      if (!t.isEnemy) continue;
      for (const e of t.weak) { t.revealed.add(e); r.b.noteWeakness(t, e); }
      t.scanned = true;
      ev.push({ t: 'scan', target: t });
    }
  },
  scanAll(r, user, skill, targets, action, ev) {
    SPECIALS.scan(r, user, skill, r.livingOpponents(user), action, ev);
  },
  escape(r, user, skill, targets, action, ev) {
    if (r.b.boss) { ev.push({ t: 'text', text: 'There is no escape!' }); return ev; }
    r.b.fled = true;
    ev.push({ t: 'flee' });
    return ev;
  },
  focus(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'heal', targets: [user] });
    const h = user.heal(Math.round(user.maxHp * 0.3));
    ev.push({ t: 'heal', target: user, amount: h });
    for (const id of user.cureBad()) ev.push({ t: 'status', target: user, id, on: false });
  },
  dispel(r, user, skill, targets, action, ev) {
    if (!skill.power) ev.push({ t: 'anim', user, anim: 'debuff', targets });
    for (const t of targets) if (t.alive && t.clearBuffs()) ev.push({ t: 'text', text: `${t.name}'s protections unravel.` });
  },
  partyHeal15(r, user, skill, targets, action, ev) {
    for (const a of r.livingAllies(user)) ev.push({ t: 'heal', target: a, amount: a.heal(Math.round(a.maxHp * 0.15)) });
  },
  mist(r, user, skill, targets, action, ev) {
    for (const a of r.livingAllies(user)) {
      ev.push({ t: 'heal', target: a, amount: a.heal(Math.round(a.maxHp * 0.25)) });
      const before = a.mp;
      a.mp = Math.min(a.maxMp, a.mp + Math.round(a.maxMp * 0.1));
      ev.push({ t: 'heal', target: a, amount: a.mp - before, mp: true });
    }
  },
  alchemize(r, user, skill, targets, action, ev) {
    const t = targets[0];
    if (!t) return;
    ev.push({ t: 'anim', user, anim: 'steal', targets: [t] });
    const g = Math.round(t.level * 12 * (0.8 + r.rnd() * 0.4));
    r.b.bonusGold += g;
    ev.push({ t: 'text', text: `Transmuted ${g} gold!` });
  },
  delay(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'debuff', targets });
    for (const t of targets) {
      t.av += t.baseAV() * pushback(t, false);
      ev.push({ t: 'text', text: `${t.name} is pushed back in time.` });
    }
  },
  delayAll(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'dark', targets });
    for (const t of r.livingOpponents(user)) t.av += t.baseAV() * pushback(t, true);
    ev.push({ t: 'text', text: 'Time stands still.' });
  },
  quicken(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'buff', targets });
    for (const t of targets) { if (t !== user) t.av = 0; }
    ev.push({ t: 'text', text: `${targets[0]?.name} moves at once!` });
  },
  gravity(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'dark', targets });
    for (const t of targets) {
      const frac = t.isEnemy && t.def.boss ? 0.08 : 0.25;
      r.applyDamage(t, Math.max(1, Math.floor(t.hp * frac)), ev, { elem: 'dark' });
    }
  },
  mpGift(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'heal', targets });
    for (const t of targets) {
      const before = t.mp;
      t.mp = Math.min(t.maxMp, t.mp + 25);
      ev.push({ t: 'heal', target: t, amount: t.mp - before, mp: true });
    }
  },
  finale(r, user, skill, targets, action, ev) {
    for (const a of r.livingAllies(user)) ev.push({ t: 'heal', target: a, amount: a.heal(Math.round(a.maxHp * 0.5)) });
  },
  heal60(r, user, skill, targets, action, ev) {
    for (const a of r.livingAllies(user)) {
      const want = Math.round(a.maxHp * 0.6) - a.hp;
      if (want > 0) ev.push({ t: 'heal', target: a, amount: a.heal(want) });
    }
  },
  fullHeal(r, user, skill, targets, action, ev) {
    for (const a of r.livingAllies(user)) {
      ev.push({ t: 'heal', target: a, amount: a.heal(a.maxHp) });
      for (const id of a.cureBad()) ev.push({ t: 'status', target: a, id, on: false });
    }
  },
  phoenix(r, user, skill, targets, action, ev) {
    for (const a of r.alliesOf(user)) if (!a.alive) { a.revive(0.25); ev.push({ t: 'revive', target: a }); }
  },
  hex(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'status', targets });
    for (const t of targets) if (!r.tryStatus(user, t, r.randomBad(), 0.75, ev)) ev.push({ t: 'miss', target: t, text: 'Resisted' });
  },
  dice(r, user, skill, targets, action, ev) {
    const a = 1 + Math.floor(r.rnd() * 6), b = 1 + Math.floor(r.rnd() * 6);
    ev.push({ t: 'text', text: `Rolled ${a} + ${b}${a === b ? ' — doubles!' : ''}` });
    ev.push({ t: 'anim', user, anim: 'shot', targets });
    const dmg = Math.round((a + b) * user.level * 3.2 * (a === b ? 2 : 1));
    for (const t of targets) if (t.alive) r.applyDamage(t, Math.min(9999, dmg), ev, {});
  },
  wildcard(r, user, skill, targets, action, ev) {
    const roll = r.rnd();
    if (roll < 0.25) {
      ev.push({ t: 'text', text: 'The Sun card! The party is restored.' });
      for (const a of r.livingAllies(user)) ev.push({ t: 'heal', target: a, amount: a.heal(a.maxHp) });
    } else if (roll < 0.5) {
      ev.push({ t: 'text', text: 'The Tower card! Ruin falls on the enemy.' });
      ev.push({ t: 'anim', user, anim: 'meteor', targets: r.livingOpponents(user) });
      for (const t of r.livingOpponents(user)) r.applyDamage(t, Math.round(t.maxHp * (t.def?.boss ? 0.06 : 0.4)), ev, {});
    } else if (roll < 0.75) {
      ev.push({ t: 'text', text: 'The Chariot card! Everyone hastens.' });
      for (const a of r.livingAllies(user)) r.tryStatus(user, a, 'haste', 1, ev);
    } else if (roll < 0.95) {
      ev.push({ t: 'text', text: 'The Fool card. Nothing happens.' });
    } else {
      ev.push({ t: 'text', text: 'The Moon card... the party falls asleep.' });
      for (const a of r.livingAllies(user)) r.tryStatus(user, a, 'sleep', 1, ev);
    }
  },
  coins(r, user, skill, targets, action, ev) {
    const spend = Math.max(10, Math.floor(r.b.state.gold * 0.02));
    r.b.state.gold = Math.max(0, r.b.state.gold - spend);
    ev.push({ t: 'text', text: `Threw ${spend} gold!` });
    ev.push({ t: 'anim', user, anim: 'shot', targets: r.livingOpponents(user) });
    for (const t of r.livingOpponents(user)) r.applyDamage(t, Math.min(9999, spend * 2), ev, {});
  },
  kindle(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'buff', targets: [user] });
    r.b.afterglow = Math.min(AFTERGLOW_MAX, r.b.afterglow + 100);
    ev.push({ t: 'afterglow', value: r.b.afterglow });
  },
  charge(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'buff', targets: [user] });
    user.addStatus('charging');
    ev.push({ t: 'status', target: user, id: 'charging', on: true });
    ev.push({ t: 'text', text: `${user.name} is gathering power...` });
  },
  enemySteal(r, user, skill, targets, action, ev) {
    const g = Math.min(r.b.state.gold, Math.round(user.level * 6));
    ev.push({ t: 'anim', user, anim: 'steal', targets });
    if (g <= 0) { ev.push({ t: 'text', text: 'Nothing to steal!' }); return; }
    r.b.state.gold -= g;
    r.b.goldStolen += g;
    ev.push({ t: 'text', text: `${user.name} pinched ${g} gold!` });
  },
  mpDrain(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'dark', targets });
    for (const t of targets) {
      const n = Math.min(t.mp, Math.round(5 + user.level * 0.8));
      t.mp -= n;
      ev.push({ t: 'text', text: `${t.name} loses ${n} MP.` });
    }
  },
  selfDestruct(r, user, skill, targets, action, ev) {
    ev.push({ t: 'anim', user, anim: 'burst', targets: r.livingOpponents(user) });
    // Scales with the bomber's remaining HP, but never takes more than ~a third of anyone.
    const dmg = Math.round(user.hp * 0.8 + user.level * 4);
    for (const t of r.livingOpponents(user)) r.applyDamage(t, Math.min(dmg, Math.round(t.maxHp * 0.35)), ev, { elem: 'fire' });
    user.damage(user.hp);
    ev.push({ t: 'damage', target: user, amount: 0, ko: true, silent: true });
    r.onKo(user, ev);
  },
  summon(r, user, skill, targets, action, ev) {
    const pool = user.def?.summons || [];
    if (!pool.length || r.b.enemies.filter((e) => e.alive).length >= 5) { ev.push({ t: 'text', text: 'No one answers.' }); return; }
    const id = pool[Math.floor(r.rnd() * pool.length)];
    const nb = r.b.spawnEnemy(id);
    if (nb) ev.push({ t: 'summon', battler: nb, text: `${user.name} calls ${nb.name}!` });
  },
};

export { SPECIALS, BAD_STATUSES, PRISM };
