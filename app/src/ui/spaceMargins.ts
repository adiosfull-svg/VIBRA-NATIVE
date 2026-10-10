// Margini dei figli di space-x/space-y come in Tailwind 3 (usato da spaceOverrides in html.tsx).

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
