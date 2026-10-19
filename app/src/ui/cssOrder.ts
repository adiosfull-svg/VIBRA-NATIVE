// Classi in conflitto nello stesso className: in CSS vince la regola che viene dopo nel foglio di Tailwind
// (es. "text-muted-foreground bg-destructive/10 text-destructive" → grigio, "pt-8 p-4" → padding-top 32),
// nel nativo tailwind-merge (ui/cn.ts) e NativeWind fanno vincere l'ultima scritta. Qui la classe che in CSS
// vince viene spostata dopo quelle che batte, così il risultato è quello dell'originale.
// Le coppie vengono da scripts/port/css-order.mjs (cssOrder.generated.ts).
import { CSS_WINS } from './cssOrder.generated';

const KEYS = Object.keys(CSS_WINS);
const cache = new Map<string, string>();

export function cssOrder(className: string): string {
  if (!className || !KEYS.some((k) => className.includes(k))) return className;
  let out = cache.get(className);
  if (out === undefined) {
    const toks = className.split(/\s+/).filter(Boolean);
    for (const k of KEYS) {
      const i = toks.indexOf(k);
      if (i < 0) continue;
      const beaten = CSS_WINS[k];
      let last = -1;
      toks.forEach((t, j) => { if (j > i && beaten.includes(t)) last = j; });
      if (last < 0) continue;
      toks.splice(i, 1);
      toks.splice(last, 0, k); // dopo l'ultima battuta (l'indice è sceso di uno con lo splice)
    }
    out = toks.join(' ');
    if (cache.size > 2000) cache.clear();
    cache.set(className, out);
  }
  return out;
}
