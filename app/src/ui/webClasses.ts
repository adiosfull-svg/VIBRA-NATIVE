// Traduce le classi Tailwind del web nelle equivalenti per React Native/NativeWind, dove le
// regole differiscono:
//  - `flex`/`inline-flex` sul web vanno in riga, in RN in colonna → aggiunge flex-row
//  - `space-y-N`/`space-x-N` (margini tra figli) → gap-y-N/gap-x-N
//  - `ring-N ring-<colore> ring-offset-N` → boxShadow (anello fuori dal bordo, come in CSS)
//  - `grid grid-cols-N gap-*` → descrittore griglia (resa da Div con righe a capo)
//  - `bg-gradient-to-* from-* via-* to-*` → descrittore gradiente (reso con LinearGradient)
//  - `line-clamp-N` → numberOfLines
// Le varianti responsive (sm:, md:, lg:...) restano a NativeWind, che le valuta sulla larghezza
// dello schermo; le classi di griglia responsive invece si scartano (sul telefono vale la base).
import { themeColor } from './colors.ts';

/** Colonna di grid-cols-[...]: frazione (1fr), larghezza del contenuto (auto) o fissa (px). */
export type GridTrack = { fr: number } | { auto: true } | { px: number };
export type Grid = { cols: number; gapX: number; gapY: number; template?: GridTrack[]; rows?: GridTrack[] };

/** 'repeat(5, 1fr) 80px' → '1fr_1fr_1fr_1fr_1fr_80px' (forma delle classi grid-cols-[...]). */
export function expandGridTemplate(css: string): string {
  return css.replace(/repeat\(\s*(\d+)\s*,\s*([^)]+?)\s*\)/g, (_, n: string, t: string) => Array(Number(n)).fill(t.trim()).join(' '))
    .trim().split(/\s+/).join('_');
}

/** grid-cols-[1fr_auto_120px] → colonne; null se contiene forme non gestite (repeat, minmax...). */
export function parseGridTemplate(v: string): GridTrack[] | null {
  const tracks: GridTrack[] = [];
  for (const t of v.split('_')) {
    let m: RegExpMatchArray | null;
    if ((m = t.match(/^(\d+(?:\.\d+)?)fr$/))) tracks.push({ fr: Number(m[1]) });
    else if (t === 'auto' || t === 'min-content' || t === 'max-content') tracks.push({ auto: true });
    else if ((m = t.match(/^(\d+(?:\.\d+)?)(px|rem)$/))) tracks.push({ px: Number(m[1]) * (m[2] === 'rem' ? REM : 1) });
    else return null;
  }
  return tracks.length ? tracks : null;
}
export type Gradient = { dir: string; colors: string[] };
export type Normalized = { box: string; grid?: Grid; gradient?: Gradient; lineClamp?: number; ring?: string };

const REM = 16;
/** Scala spacing di Tailwind (n × 0.25rem) e valori arbitrari [12px]. */
export function spacingPx(v: string): number {
  const arb = v.match(/^\[(\d+(?:\.\d+)?)(px|rem)\]$/);
  if (arb) return Number(arb[1]) * (arb[2] === 'rem' ? REM : 1);
  if (v === 'px') return 1;
  const n = Number(v);
  return Number.isFinite(n) ? n * 4 : 0;
}

const BREAKPOINT = /^(sm|md|lg|xl|2xl|max-sm|max-md|max-lg):/;

// Le stesse classi tornano a ogni render di ogni elemento: il risultato (sola lettura) si tiene in cache.
const normalizedCache = new Map<string, Normalized>();

export function normalizeClasses(className?: string): Normalized {
  const key = className ?? '';
  let out = normalizedCache.get(key);
  if (!out) {
    if (normalizedCache.size > 5000) normalizedCache.clear();
    out = computeNormalized(className);
    normalizedCache.set(key, out);
  }
  return out;
}

function computeNormalized(className?: string): Normalized {
  const out: Normalized = { box: '' };
  if (!className) return out;
  const list = className.split(/\s+/).filter(Boolean);
  const box: string[] = [];
  let isFlex = false;
  let hasDirection = false;
  let isGrid = false;
  let cols = 1;
  let template: GridTrack[] | undefined;
  let gap: number | null = null;
  let gapX: number | null = null;
  let gapY: number | null = null;
  let gradDir: string | null = null;
  let from: string | undefined;
  let via: string | undefined;
  let to: string | undefined;
  let ring: string | null = null;
  let ringColor: string | null = null;
  let ringOffset = 0;
  let ringOffsetColor = '#ffffff';

  for (const c of list) {
    const responsive = BREAKPOINT.test(c);
    const base = c.replace(BREAKPOINT, '');
    // griglie responsive: sul telefono conta solo la base
    if (responsive && /^(grid|grid-cols-\d+|col-span-\d+|grid-rows-\d+)$/.test(base)) continue;
    let m: RegExpMatchArray | null;
    if (!responsive && (c === 'flex' || c === 'inline-flex')) { isFlex = true; box.push('flex'); continue; }
    if (/^flex-(row|col)(-reverse)?$/.test(base)) { if (!responsive) hasDirection = true; box.push(c); continue; }
    if (!responsive && c === 'grid') { isGrid = true; continue; }
    if (!responsive && (m = c.match(/^grid-cols-(\d+)$/))) { cols = Number(m[1]); continue; }
    if (!responsive && (m = c.match(/^grid-cols-\[(.+)\]$/))) { template = parseGridTemplate(m[1]) ?? undefined; if (template) cols = template.length; continue; }
    if (!responsive && (m = c.match(/^gap-x-(\S+)$/))) { gapX = spacingPx(m[1]); box.push(c); continue; }
    if (!responsive && (m = c.match(/^gap-y-(\S+)$/))) { gapY = spacingPx(m[1]); box.push(c); continue; }
    if (!responsive && (m = c.match(/^gap-(\S+)$/))) { gap = spacingPx(m[1]); box.push(c); continue; }
    if ((m = base.match(/^space-([xy])-(\S+)$/))) {
      box.push(`${responsive ? c.slice(0, c.length - base.length) : ''}gap-${m[1]}-${m[2]}`);
      continue;
    }
    if ((m = base.match(/^bg-gradient-to-(\w+)$/))) { if (!responsive) gradDir = m[1]; continue; }
    if (!responsive && (m = c.match(/^from-(.+)$/))) { from = m[1]; continue; }
    if (!responsive && (m = c.match(/^via-(.+)$/))) { via = m[1]; continue; }
    if (!responsive && (m = c.match(/^to-(.+)$/)) && !/^to-(\d|\[)/.test(c)) { to = m[1]; continue; }
    if (!responsive && (m = c.match(/^ring(?:-(\d))?$/))) { ring = m[1] ?? '3'; continue; }
    if (!responsive && (m = c.match(/^ring-offset-(\d)$/))) { ringOffset = Number(m[1]); continue; }
    if (!responsive && (m = c.match(/^ring-offset-(.+)$/))) { ringOffsetColor = themeColor(m[1]) ?? ringOffsetColor; continue; }
    if (/^ring-offset/.test(base)) continue;
    if (!responsive && (m = c.match(/^ring-(.+)$/)) && themeColor(m[1])) { ringColor = m[1]; continue; }
    if ((m = base.match(/^line-clamp-(\d+)$/))) { out.lineClamp = Number(m[1]); continue; }
    if (c === 'inline-block' || c === 'block' || c === 'inline') continue;
    if (c === 'fixed') { box.push('absolute'); continue; }
    box.push(c);
  }

  if (isFlex && !hasDirection) box.push('flex-row');
  if (ring && ring !== '0') {
    // colore di default di Tailwind 3: blue-500 al 50%
    const color = (ringColor && themeColor(ringColor)) ?? 'rgba(59,130,246,0.5)';
    const w = Number(ring);
    out.ring = ringOffset
      ? `0px 0px 0px ${ringOffset}px ${ringOffsetColor}, 0px 0px 0px ${ringOffset + w}px ${color}`
      : `0px 0px 0px ${w}px ${color}`;
  }
  if (isGrid) {
    out.grid = { cols, gapX: gapX ?? gap ?? 0, gapY: gapY ?? gap ?? 0, ...(template ? { template } : null) };
    // la griglia è resa come righe a capo: i gap li applica Div sui wrapper dei figli
    for (let i = box.length - 1; i >= 0; i--) if (/^gap(-[xy])?-/.test(box[i])) box.splice(i, 1);
    // colonne uguali: righe a capo; colonne miste (template): una riga per gruppo di celle (Div)
    if (!template) box.push('flex-row', 'flex-wrap');
  }
  if (gradDir) {
    const colors = [from, via, to].filter(Boolean).map((c) => themeColor(c as string)).filter(Boolean) as string[];
    // "from-x" senza "to" sfuma verso il trasparente, come in Tailwind
    if (colors.length === 1) colors.push('transparent');
    if (colors.length) out.gradient = { dir: gradDir, colors };
  }
  out.box = box.join(' ');
  return out;
}

const RADIUS: Record<string, number> = { none: 0, sm: 2, '': 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, full: 9999 };
const CORNERS: Record<string, string[]> = {
  '': ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
  t: ['TopLeft', 'TopRight'], b: ['BottomLeft', 'BottomRight'], l: ['TopLeft', 'BottomLeft'], r: ['TopRight', 'BottomRight'],
  s: ['TopLeft', 'BottomLeft'], e: ['TopRight', 'BottomRight'],
  tl: ['TopLeft'], tr: ['TopRight'], bl: ['BottomLeft'], br: ['BottomRight'],
};

/** Raggi degli angoli dati dalle classi rounded-* (senza varianti): per arrotondare uno sfondo senza overflow-hidden. */
export function radiusFromClasses(className: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of className.split(/\s+/)) {
    const m = c.match(/^rounded(?:-(t|b|l|r|s|e|tl|tr|bl|br))?(?:-(none|sm|md|lg|xl|2xl|3xl|full|\[(\d+(?:\.\d+)?)px\]))?$/);
    if (!m) continue;
    const v = m[3] != null ? Number(m[3]) : RADIUS[m[2] ?? ''];
    for (const corner of CORNERS[m[1] ?? '']) out[`border${corner}Radius`] = v;
  }
  return out;
}
