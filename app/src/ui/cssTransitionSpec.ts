// Proprietà animate dalle transizioni CSS (parte pura, senza React Native: usata da cssTransition.ts).
export type TransitionSpec = { opacity?: number; backgroundColor?: number; blur?: number; transform?: number };

const PROPS_ALL: (keyof TransitionSpec)[] = ['opacity', 'backgroundColor', 'blur', 'transform'];
const CSS_PROP: Record<string, keyof TransitionSpec | 'all'> = {
  all: 'all', opacity: 'opacity', 'background-color': 'backgroundColor', background: 'backgroundColor',
  'backdrop-filter': 'blur', '-webkit-backdrop-filter': 'blur', transform: 'transform',
};
const TAILWIND_DEFAULT_MS = 150;

function timeMs(t: string): number | undefined {
  const m = t.match(/^([\d.]+)(m?s)$/);
  if (!m) return undefined;
  return Number(m[1]) * (m[2] === 's' ? 1000 : 1);
}

/** Proprietà animate e durata (ms) da style.transition (stringa CSS) e dalle classi transition-*. */
export function transitionSpec(className: string | undefined, styleTransition: unknown): TransitionSpec | null {
  let spec: TransitionSpec | null = null;
  const set = (p: keyof TransitionSpec | 'all', ms: number) => {
    spec ??= {};
    for (const k of p === 'all' ? PROPS_ALL : [p]) spec[k] = ms;
  };
  if (typeof styleTransition === 'string' && styleTransition.trim() !== 'none') {
    for (const part of styleTransition.split(/,(?![^(]*\))/)) {
      const [name, ...rest] = part.trim().split(/\s+/);
      const p = CSS_PROP[name];
      const ms = rest.map(timeMs).find((v) => v != null) ?? 0;
      if (p && ms > 0) set(p, ms);
    }
  }
  if (className && className.includes('transition')) {
    const classes = className.split(/\s+/).filter((c) => !c.includes(':'));
    const dur = classes.map((c) => c.match(/^duration-(\d+)$/)).find(Boolean);
    const ms = dur ? Number(dur[1]) : TAILWIND_DEFAULT_MS;
    for (const c of classes) {
      if (c === 'transition' || c === 'transition-all') set('all', ms);
      else if (c === 'transition-opacity') set('opacity', ms);
      else if (c === 'transition-colors') set('backgroundColor', ms);
      else if (c === 'transition-transform') set('transform', ms);
      else if (c.startsWith('transition-[')) {
        for (const n of c.slice(12, -1).split(',')) { const p = CSS_PROP[n.trim()]; if (p) set(p, ms); }
      }
    }
  }
  return spec;
}

/** opacity-N (senza varianti) → 0..1; undefined se assente. */
export function classOpacity(className: string | undefined): number | undefined {
  const m = className?.match(/(?:^|\s)opacity-(\d+)(?=\s|$)/);
  return m ? Number(m[1]) / 100 : undefined;
}

/** Trasformazioni delle classi Tailwind (senza varianti), in unità di React Native. */
export type ClassTransform = { scale: number; scaleX: number; scaleY: number; rotate: number; translateX: number; translateY: number };
export const IDENTITY_TRANSFORM: ClassTransform = { scale: 1, scaleX: 1, scaleY: 1, rotate: 0, translateX: 0, translateY: 0 };

const SPACING_PX = 4; // 1 unità Tailwind = 0.25rem = 4px
const TRANSFORM_CLASS = /^(-?)(scale|scale-x|scale-y|rotate|translate-x|translate-y)-(.+)$/;

function transformValue(kind: string, raw: string): number | null {
  const arb = raw.match(/^\[(.+)\]$/)?.[1];
  if (kind.startsWith('scale')) {
    if (arb) return /^[\d.]+$/.test(arb) ? Number(arb) : arb.endsWith('%') ? parseFloat(arb) / 100 : null;
    return /^\d+$/.test(raw) ? Number(raw) / 100 : null;
  }
  if (kind === 'rotate') {
    if (arb) return /^-?[\d.]+deg$/.test(arb) ? parseFloat(arb) : null;
    return /^\d+$/.test(raw) ? Number(raw) : null;
  }
  // translate: scala di spaziatura, px e valori arbitrari in px (le percentuali dipendono dalla misura: no)
  if (raw === 'px') return 1;
  if (raw === '0') return 0;
  if (arb) return /^-?[\d.]+px$/.test(arb) ? parseFloat(arb) : arb === '0' ? 0 : null;
  return /^\d+(\.\d+)?$/.test(raw) ? Number(raw) * SPACING_PX : null;
}

/**
 * Trasformazione data dalle classi (scale-95, rotate-180, translate-x-4...): IDENTITY_TRANSFORM se non ce ne
 * sono, `null` se una non è traducibile (percentuali, full): in quel caso l'elemento resta com'è, senza animazione.
 */
export function classTransform(className: string | undefined): ClassTransform | null {
  if (!className || !/(?:^|\s)-?(?:scale|rotate|translate)-/.test(className)) return IDENTITY_TRANSFORM;
  let out: ClassTransform = IDENTITY_TRANSFORM;
  for (const c of className.split(/\s+/)) {
    const m = c.match(TRANSFORM_CLASS);
    if (!m) continue;
    const v = transformValue(m[2], m[3]);
    if (v == null) return null;
    if (out === IDENTITY_TRANSFORM) out = { ...IDENTITY_TRANSFORM };
    const sign = m[1] ? -1 : 1;
    const key = ({ scale: 'scale', 'scale-x': 'scaleX', 'scale-y': 'scaleY', rotate: 'rotate', 'translate-x': 'translateX', 'translate-y': 'translateY' } as const)[m[2] as 'scale'];
    out[key] = key.startsWith('scale') ? v : sign * v;
  }
  return out;
}

/** Toglie le classi di trasformazione (le disegna l'animazione). */
export function withoutClassTransform(className: string): string {
  return className.split(/\s+/).filter((c) => !TRANSFORM_CLASS.test(c)).join(' ');
}
