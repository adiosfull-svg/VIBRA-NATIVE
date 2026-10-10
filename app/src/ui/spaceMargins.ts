// Margini dei figli di space-x/space-y come in Tailwind 3 (usato da spaceOverrides in html.tsx).
import { spacingPx } from './webClasses.ts';

const MARGIN_CLASS = /(^|\s)((?:[\w-]+:)*)(-?)(m[trblxy]?)-(\S+)(?=\s|$)/g;

/**
 * `.space-y-N > :not([hidden]) ~ :not([hidden])` fissa margin-top (gap) e margin-bottom (0) dei figli
 * dopo il primo ed è più specifico di mt-*, mb-*, my-* (anche con varianti sm:, hover:...): quelle
 * classi spariscono, m-N resta solo in orizzontale. Idem space-x con ml/mr/mx.
 */
export function stripSpacedMargins(className: string, gaps: { x?: number; y?: number }): string {
  const lost = new Set<string>();
  if (gaps.y != null) ['mt', 'mb', 'my'].forEach((m) => lost.add(m));
  if (gaps.x != null) ['ml', 'mr', 'mx'].forEach((m) => lost.add(m));
  let changed = false;
  const out = className.replace(MARGIN_CLASS, (all, sp: string, variants: string, neg: string, kind: string, value: string) => {
    if (kind === 'm' && (gaps.x != null) !== (gaps.y != null)) {
      changed = true;
      return `${sp}${variants}${neg}${gaps.y != null ? 'mx' : 'my'}-${value}`;
    }
    if (!lost.has(kind) && kind !== 'm') return all;
    changed = true;
    return sp;
  });
  return changed ? out.replace(/\s+/g, ' ').trim() : className;
}

const FIRST_MB = /(^|\s)(mb|my|m)-(\d+(?:\.\d+)?|px|\[\d+(?:\.\d+)?(?:px|rem)\])(?=\s|$)/;

/**
 * Primo figlio di un blocco space-y-N con mb-M: in CSS i due margini verticali collassano
 * (distanza max(M, N)), col gap di RN si sommerebbero. Ritorna le classi senza il margine sotto e
 * il marginBottom da aggiungere (M − N se M > N), oppure null se non c'è nulla da fare.
 */
export function collapseFirstMargin(className: string, gapY: number): { className: string; marginBottom?: number } | null {
  const m = className.match(FIRST_MB);
  if (!m) return null;
  const px = spacingPx(m[3]);
  const kept = m[2] === 'my' ? `${m[1]}mt-${m[3]}` : m[2] === 'm' ? `${m[1]}mt-${m[3]} mx-${m[3]}` : m[1];
  const cls = className.replace(FIRST_MB, kept).replace(/\s+/g, ' ').trim();
  return px > gapY ? { className: cls, marginBottom: px - gapY } : { className: cls };
}
