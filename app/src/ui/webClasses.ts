// Traduce le classi Tailwind del web nelle equivalenti per React Native/NativeWind, dove le
// regole differiscono:
//  - `flex`/`inline-flex` sul web vanno in riga, in RN in colonna → aggiunge flex-row
//  - `space-y-N`/`space-x-N` (margini tra figli) → gap-y-N/gap-x-N
//  - `ring-N ring-<colore>` (box-shadow) → bordo
//  - `grid grid-cols-N gap-*` → descrittore griglia (resa da Div con righe a capo)
//  - `bg-gradient-to-* from-* via-* to-*` → descrittore gradiente (reso con LinearGradient)
//  - `line-clamp-N` → numberOfLines
// Le varianti responsive (sm:, md:, lg:...) restano a NativeWind, che le valuta sulla larghezza
// dello schermo; le classi di griglia responsive invece si scartano (sul telefono vale la base).
import { themeColor } from './colors.ts';

export type Grid = { cols: number; gapX: number; gapY: number };
export type Gradient = { dir: string; colors: string[] };
export type Normalized = { box: string; grid?: Grid; gradient?: Gradient; lineClamp?: number };

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

export function normalizeClasses(className?: string): Normalized {
  const out: Normalized = { box: '' };
  if (!className) return out;
  const list = className.split(/\s+/).filter(Boolean);
  const box: string[] = [];
  let isFlex = false;
  let hasDirection = false;
  let isGrid = false;
  let cols = 1;
  let gap: number | null = null;
  let gapX: number | null = null;
  let gapY: number | null = null;
  let gradDir: string | null = null;
  let from: string | undefined;
  let via: string | undefined;
  let to: string | undefined;
  let ring: string | null = null;
  let ringColor: string | null = null;

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
    if (!responsive && (m = c.match(/^ring-([a-z]+-\d+(?:\/\d+)?|white|black|primary|border|background)$/))) { ringColor = m[1]; continue; }
    if (/^ring-offset/.test(base)) continue;
    if ((m = base.match(/^line-clamp-(\d+)$/))) { out.lineClamp = Number(m[1]); continue; }
    if (c === 'inline-block' || c === 'block' || c === 'inline') continue;
    if (c === 'fixed') { box.push('absolute'); continue; }
    box.push(c);
  }

  if (isFlex && !hasDirection) box.push('flex-row');
  if (ring) {
    box.push(ring === '1' ? 'border' : `border-${ring}`);
    if (ringColor) box.push(`border-${ringColor}`);
  }
  if (isGrid) {
    out.grid = { cols, gapX: gapX ?? gap ?? 0, gapY: gapY ?? gap ?? 0 };
    // la griglia è resa come righe a capo: i gap li applica Div sui wrapper dei figli
    for (let i = box.length - 1; i >= 0; i--) if (/^gap(-[xy])?-/.test(box[i])) box.splice(i, 1);
    box.push('flex-row', 'flex-wrap');
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
