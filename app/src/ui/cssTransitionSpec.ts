// Proprietà animate dalle transizioni CSS (parte pura, senza React Native: usata da cssTransition.ts).
export type TransitionSpec = { opacity?: number; backgroundColor?: number; blur?: number };

const PROPS_ALL: (keyof TransitionSpec)[] = ['opacity', 'backgroundColor', 'blur'];
const CSS_PROP: Record<string, keyof TransitionSpec | 'all'> = {
  all: 'all', opacity: 'opacity', 'background-color': 'backgroundColor', background: 'backgroundColor',
  'backdrop-filter': 'blur', '-webkit-backdrop-filter': 'blur',
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
