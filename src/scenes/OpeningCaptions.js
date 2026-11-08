// Captions for the opening movie: region tags, cast cards, spoken lines, big words,
// battle callouts, the Crest roll and the logo. Each caption's fade and slide is a
// pure function of shot time (not CSS transitions), so captions stay locked to the
// shots at any frame rate and under headless virtual time.

import { el, richText } from '../ui/UI.js';
import { getPortrait } from '../render/SpriteFactory.js';
import { resolveLook } from './OpeningStages.js';

const FADE = { tag: 0.35, card: 0.3, line: 0.45, big: 0.4, pop: 0.12, crests: 0.2, logo: 1.4 };

/** Build the DOM for one caption spec; returns { el, spec, step? }. */
function build(spec) {
  switch (spec.kind) {
    case 'tag':
      return { el: el('div', 'op-tag', `<div class="op-tag-name">${richText(spec.name)}</div><div class="op-tag-rule"></div><div class="op-tag-sub">${richText(spec.sub || '')}</div>`) };
    case 'card': {
      const c = el('div', 'op-card', `<div class="op-card-art"></div><div class="op-card-text"><div class="op-card-crest">${richText(spec.crest || '')}</div><div class="op-card-name">${richText(spec.name)}</div><div class="op-card-title">${richText(spec.title || '')}</div></div>`);
      c.querySelector('.op-card-art').appendChild(getPortrait(resolveLook(spec.look), 6));
      return { el: c };
    }
    case 'line':
      return { el: el('div', 'op-line', `${richText(spec.text)}${spec.by ? `<span class="op-by">— ${richText(spec.by)}</span>` : ''}`) };
    case 'big':
      return { el: el('div', 'op-big', richText(spec.text)) };
    case 'pop':
      return { el: el('div', `op-pop ${spec.tone || ''}`, richText(spec.text)) };
    case 'crests': {
      const root = el('div', 'op-crests');
      const names = spec.names.map((n) => root.appendChild(el('div', 'op-crest', n)));
      return { el: root, names };
    }
    case 'logo':
      return { el: el('div', 'op-logo', `<div class="ts-pre">${richText(spec.pre || '')}</div><div class="ts-name">AFTERLIGHT</div><div class="ts-rule"></div>`) };
    default:
      throw new Error(`Opening: unknown caption kind ${spec.kind}`);
  }
}

export class Captions {
  constructor(root) {
    this.root = root;
    this.items = [];
  }

  /** Show a shot's captions (removing the previous shot's). `dur` = shot length. */
  set(specs = [], dur) {
    this.clear();
    for (const spec of specs) {
      const item = build(spec);
      item.spec = { at: 0, until: dur, ...spec };
      item.el.style.opacity = '0';
      this.root.appendChild(item.el);
      this.items.push(item);
    }
  }

  clear() {
    for (const it of this.items) it.el.remove();
    this.items = [];
  }

  /** Lay out every caption for shot time t. */
  update(t) {
    for (const it of this.items) {
      const { kind, at, until } = it.spec;
      const fade = it.spec.fade ?? FADE[kind];
      const inK = clamp01((t - at) / fade);
      const outK = clamp01((until - t) / (kind === 'pop' ? 0.25 : fade));
      const a = Math.min(inK, outK);
      it.el.style.opacity = String(a);
      it.el.style.visibility = a > 0 ? 'visible' : 'hidden';
      const e = 1 - (1 - inK) ** 3;
      if (kind === 'tag') it.el.style.transform = `translateY(${(1 - e) * 14}px)`;
      else if (kind === 'card') it.el.style.transform = `translateX(${(1 - e) * -60}px)`;
      else if (kind === 'big' || kind === 'logo') it.el.style.transform = `scale(${1.06 - 0.06 * e})`;
      else if (kind === 'pop') it.el.style.transform = `translate(-50%, -50%) scale(${1.7 - 0.7 * e}) rotate(-4deg)`;
      if (it.names) this.rollCrests(it, t - at);
    }
  }

  /** The Crest roll: each name flares in turn, then the whole list stays faintly lit. */
  rollCrests(it, t) {
    const every = it.spec.every;
    const cur = Math.floor(t / every);
    it.names.forEach((n, i) => {
      const lit = i === cur ? 1 : i < cur ? 0.32 : 0;
      n.style.opacity = String(lit);
      n.classList.toggle('on', i === cur);
    });
  }
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
