// Attributi data-* del codice web su Div/Btn (data-node-id, data-ui, data-drag-payload, data-client-id...).
// Il codice portato li legge dagli eventi: e.target.closest('[data-x]'), el.getAttribute('data-x'),
// document.elementFromPoint(x, y), el.querySelectorAll('[data-x]').
//  - web: diventano `dataSet` di react-native-web (attributi data-* veri nel DOM)
//  - telefono: registrati sull'istanza nativa (Fabric: e.target è l'elemento, con parentNode e
//    getBoundingClientRect); l'istanza riceve getAttribute/setAttribute/closest/matches/hasAttribute.
//    Selettori supportati: [data-x], [data-x="v"], #id, elenchi separati da virgola. Il resto non trova nulla.
// Nessun import di react-native: chi chiama withDomData/registerData lo fa solo sul telefono (domStyle, gestures).

export type DataAttrs = Record<string, string>;

const DATA_KEY = /^data-/;

/** Separa le prop data-* (valori null/undefined/false scartati, true → ''). Nessuna copia se non ce ne sono. */
export function splitDataProps<P extends object>(props: P): [DataAttrs | null, P] {
  let data: DataAttrs | null = null;
  let rest: Record<string, unknown> | null = null;
  for (const k in props) {
    if (!DATA_KEY.test(k)) continue;
    if (!rest) rest = { ...(props as Record<string, unknown>) };
    const v = rest[k];
    delete rest[k];
    if (v == null || v === false) continue;
    (data ??= {})[k] = v === true ? '' : String(v);
  }
  return [data, (rest ?? props) as P];
}

/** data-node-id → dataSet { nodeId } (react-native-web rimette i trattini). */
export function toDataSet(data: DataAttrs): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) out[k.slice(5).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = v;
  return out;
}

// ── telefono ───────────────────────────────────────────────────────────────
type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
type NativeEl = {
  parentNode?: NativeEl | null;
  getBoundingClientRect?: () => Rect;
  isConnected?: boolean;
};

const attrsOf = new WeakMap<object, DataAttrs>();
/** Elementi con attributi (per elementFromPoint e querySelectorAll). */
const live = new Set<NativeEl>();

type Simple = { attr?: string; value?: string; id?: string };
const selectorCache = new Map<string, Simple[]>();
function parseSelector(sel: string): Simple[] {
  let out = selectorCache.get(sel);
  if (out) return out;
  out = [];
  for (const part of sel.split(',')) {
    const s = part.trim();
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]$/))) out.push({ attr: m[1], value: m[2] });
    else if ((m = s.match(/^#([\w-]+)$/))) out.push({ id: m[1] });
    // tag, classi, selettori composti: sul telefono non ci sono (nessuna corrispondenza)
  }
  selectorCache.set(sel, out);
  return out;
}

function matchesNode(node: object, sel: string): boolean {
  const a = attrsOf.get(node);
  if (!a) return false;
  for (const s of parseSelector(sel)) {
    if (s.attr && s.attr in a && (s.value === undefined || a[s.attr] === s.value)) return true;
    if (s.id && a.id === s.id) return true;
  }
  return false;
}

function closestNode(start: NativeEl | null | undefined, sel: string): NativeEl | null {
  for (let n = start; n; n = n.parentNode) if (matchesNode(n, sel)) return n;
  return null;
}

function contains(root: NativeEl, node: NativeEl) {
  for (let n: NativeEl | null | undefined = node; n; n = n.parentNode) if (n === root) return true;
  return false;
}

function define(node: object, key: string, value: unknown) {
  try { Object.defineProperty(node, key, { value, configurable: true, writable: true }); } catch { /* istanza non estendibile */ }
}

/** Metodi DOM sull'istanza (una volta): servono anche agli elementi senza attributi (e.target di un figlio). */
export function withDomData<T>(node: T): T {
  if (!node || typeof node !== 'object') return node;
  const n = node as unknown as Record<string, unknown>;
  if (n.__domData) return node;
  define(n, '__domData', true);
  define(n, 'getAttribute', (k: string) => attrsOf.get(n)?.[k] ?? null);
  define(n, 'hasAttribute', (k: string) => !!attrsOf.get(n) && k in attrsOf.get(n)!);
  define(n, 'setAttribute', (k: string, v: unknown) => { const a = attrsOf.get(n) ?? {}; a[k] = String(v); attrsOf.set(n, a); live.add(n as NativeEl); });
  define(n, 'removeAttribute', (k: string) => { const a = attrsOf.get(n); if (a) delete a[k]; });
  define(n, 'matches', (sel: string) => matchesNode(n, sel));
  define(n, 'closest', (sel: string) => withDomData(closestNode(n as NativeEl, sel)));
  define(n, 'querySelectorAll', (sel: string) => [...live].filter((x) => x !== n && matchesNode(x, sel) && contains(n as NativeEl, x)));
  define(n, 'querySelector', (sel: string) => [...live].find((x) => x !== n && matchesNode(x, sel) && contains(n as NativeEl, x)) ?? null);
  if (!n.dataset) define(n, 'dataset', {});
  if (!n.classList) define(n, 'classList', { add() {}, remove() {}, toggle() { return false; }, contains: () => false });
  if (!n.addEventListener) { define(n, 'addEventListener', () => {}); define(n, 'removeEventListener', () => {}); }
  return node;
}

/** Registra gli attributi dell'elemento (prev: istanza precedente dello stesso ref, da togliere). */
export function registerData(node: object | null, data: DataAttrs | null, prev?: object | null) {
  if (prev && prev !== node) { live.delete(prev as NativeEl); attrsOf.delete(prev); }
  if (!node) return;
  withDomData(node);
  if (data) { attrsOf.set(node, { ...data }); live.add(node as NativeEl); }
  else if (attrsOf.has(node)) { attrsOf.delete(node); live.delete(node as NativeEl); }
}

/**
 * document.elementFromPoint sul telefono: l'elemento con attributi più piccolo che contiene il punto
 * (coordinate dello schermo, come clientX/Y degli eventi). Gli altri elementi non sono raggiungibili:
 * il codice web lo usa con closest('[data-x]') subito dopo.
 */
export function elementFromPoint(x: number, y: number): object | null {
  let best: NativeEl | null = null;
  let bestArea = Infinity;
  for (const n of live) {
    if (n.isConnected === false) { live.delete(n); continue; }
    let r: Rect | undefined;
    try { r = n.getBoundingClientRect?.(); } catch { r = undefined; }
    if (!r || !r.width || !r.height) continue;
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
    const area = r.width * r.height;
    if (area < bestArea) { best = n; bestArea = area; }
  }
  return best ? withDomData(best) : null;
}
