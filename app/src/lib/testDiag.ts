// Diagnostica delle build di test sull'emulatore (EXPO_PUBLIC_TEST_DIAG=1, workflow "Emulatore"):
// nel logcat (tag ReactNativeJS) un battito ogni 2 s col numero di render di Div/Btn/Text nel
// frattempo. Se il battito si ferma il JS è bloccato; se i render non scendono a zero a pagina
// ferma c'è un ciclo di aggiornamenti. Spenta (nessun costo) nelle build normali.
import './garaStartMark';
import { useRef } from 'react';
export const TEST_DIAG = process.env.EXPO_PUBLIC_TEST_DIAG === '1';

export const diagCounts: Record<string, number> = {};
/** EXPO_PUBLIC_TEST_TRACE=1: una riga nel logcat per ogni elemento disegnato (trovare un blocco). */
const TEST_TRACE = process.env.EXPO_PUBLIC_TEST_TRACE === '1';
let traceN = 0;
export function diagCount(name: string, detail?: string) {
  if (TEST_GARA) { garaActivity(true); garaLast = detail ? `${name}:${detail}` : name; }
  if (!TEST_DIAG) return;
  diagCounts[name] = (diagCounts[name] ?? 0) + 1;
  if (TEST_TRACE) console.log(`VIBRA trace ${++traceN} ${name} ${(detail ?? '').slice(0, 80)}`);
}
// ── Gara con l'originale (docs/PIANO-PRESTAZIONI.md, EXPO_PUBLIC_TEST_GARA=1) ──
// Stessa definizione della sonda dell'originale (tools/gara/probe-web.js): dalla navigazione (link
// vibra://...) a quando la pagina smette di cambiare (nessuna richiesta di rete in corso e nessun
// ridisegno per 300 ms). "primo" = primo ridisegno dopo la navigazione. Riga nel logcat:
// "VIBRA gara pronta <percorso> primo=.. pronta=.. render=.. rete=..".
export const TEST_GARA = process.env.EXPO_PUBLIC_TEST_GARA === '1';
const QUIET_MS = 300;
const LIMIT_MS = 15000;
const gara = { t0: -1, first: -1, last: 0, inflight: 0, label: '', renders: 0, fetches: 0, frame: 0, jsMax: 0, jsBusy: 0 };
// ultimo elemento ridisegnato (chi tiene la pagina "in movimento"): nome e classi
let garaLast = '';
function garaActivity(render: boolean) {
  const n = performance.now();
  gara.last = n;
  if (!render) return;
  gara.renders++;
  if (gara.t0 >= 0 && gara.first < 0) gara.first = n;
}
function garaCheck() {
  if (gara.t0 < 0) return;
  const n = performance.now();
  // thread JS occupato: buchi tra due frame oltre il frame (16,7 ms)
  const gap = n - gara.frame;
  gara.frame = n;
  if (gap > gara.jsMax) gara.jsMax = gap;
  if (gap > 50) gara.jsBusy += gap - 16.7;
  const timeout = n - gara.t0 > LIMIT_MS;
  if (timeout || (gara.inflight === 0 && gara.first >= 0 && n - gara.last >= QUIET_MS)) {
    garaReport(n, timeout);
    return;
  }
  requestAnimationFrame(garaCheck);
}
function garaReport(n: number, timeout: boolean, extra = '') {
  {
    const end = timeout ? n : gara.last;
    console.log(`VIBRA gara pronta ${gara.label} primo=${Math.round((gara.first < 0 ? end : gara.first) - gara.t0)} pronta=${Math.round(end - gara.t0)} render=${gara.renders} rete=${gara.fetches} jsMax=${Math.round(gara.jsMax)} jsOccupato=${Math.round(gara.jsBusy)} fine=${Date.now() - Math.round(n - end)}${timeout ? ' NONSIFERMA' : ''}${extra} ultimo=${garaLast.replace(/\s+/g, '_').slice(0, 80)}`);
    gara.t0 = -1;
  }
}
/** Avvio: la misura finisce quando parte il precaricamento delle altre tab (lavoro in background,
 *  l'app è già usabile); "pronta" = ultima modifica prima di quel momento. */
/** Precaricamento delle tab finito (il banco di prova aspetta questo prima di misurare le pagine). */
export function garaPreloadEnd() {
  if (TEST_GARA) console.log('VIBRA gara precarica fine');
}
export function garaPreloadStart() {
  if (TEST_GARA && gara.t0 >= 0 && gara.label === 'avvio') garaReport(performance.now(), false, ' precarica=1');
}
function garaStart(label: string) {
  const wasIdle = gara.t0 < 0;
  Object.assign(gara, { t0: performance.now(), first: -1, label, renders: 0, fetches: 0, jsMax: 0, jsBusy: 0 });
  gara.frame = gara.t0;
  gara.last = gara.t0;
  if (wasIdle) requestAnimationFrame(garaCheck);
}
if (TEST_GARA) {
  // le richieste di rete (supabase-js usa fetch: questo modulo va importato prima di lib/supabase)
  const g = globalThis as { fetch: typeof fetch };
  const realFetch = g.fetch;
  g.fetch = ((...args: Parameters<typeof fetch>) => {
    gara.inflight++;
    gara.fetches++;
    garaActivity(false);
    return realFetch(...args).finally(() => { gara.inflight--; garaActivity(false); });
  }) as typeof fetch;
  // la navigazione: link vibra://percorso dal banco di prova (adb), come history.pushState nell'originale
  const { Linking } = require('react-native') as typeof import('react-native');
  Linking.addEventListener('url', ({ url }) => garaStart(url.replace(/^vibra:\/\//, '/')));
  garaStart('avvio');
}

/** Traccia di un punto preciso del codice (solo con EXPO_PUBLIC_TEST_TRACE=1). */
export function diagTrace(label: string) {
  if (TEST_DIAG && TEST_TRACE) console.log(`VIBRA trace ${++traceN} ${label}`);
}

/** Tempo (ms) speso in un punto del codice nel battito corrente (solo build di test). */
export const diagTimes: Record<string, number> = {};
export function diagTime(name: string, ms: number) {
  if (!TEST_DIAG) return;
  diagTimes[name] = (diagTimes[name] ?? 0) + ms;
}
/** Avvolge una funzione misurandone il tempo (identità invariata fuori dalle build di test). */
export function diagTimed<F extends (...a: any[]) => any>(name: string, fn: F): F {
  if (!TEST_DIAG) return fn;
  return ((...a: any[]) => {
    const t = Date.now();
    try { return fn(...a); } finally { diagTime(name, Date.now() - t); }
  }) as F;
}

if (TEST_DIAG) {
  let last = Date.now();
  // frame del thread JS: il buco più lungo tra due requestAnimationFrame (= scatto più lungo)
  let frameMax = 0;
  let lastFrame = Date.now();
  const onFrame = () => {
    const now = Date.now();
    frameMax = Math.max(frameMax, now - lastFrame);
    lastFrame = now;
    requestAnimationFrame(onFrame);
  };
  requestAnimationFrame(onFrame);
  setInterval(() => {
    const now = Date.now();
    const parts = Object.entries(diagCounts).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' ');
    const times = Object.entries(diagTimes).filter(([, v]) => v).map(([k, v]) => `${k}:${Math.round(v)}ms`).join(' ');
    // ritardo del timer: quanto il thread JS è rimasto occupato
    console.log(`VIBRA diag battito ritardo=${now - last - 2000}ms frameMax=${frameMax}ms ${parts}${times ? ` | ${times}` : ''}`);
    for (const k of Object.keys(diagCounts)) diagCounts[k] = 0;
    for (const k of Object.keys(diagTimes)) diagTimes[k] = 0;
    frameMax = 0;
    last = now;
  }, 2000);
}

/**
 * Radiografia del layout (solo diagnostica): albero degli elementi nativi sotto `root` con
 * posizione/dimensioni (getBoundingClientRect delle API DOM di Fabric) e l'inizio del testo.
 * Scende fino a `maxDepth` livelli e salta i rami piccoli e senza testo, per restare leggibile.
 */
export function dumpLayout(label: string, root: unknown, maxDepth = 14) {
  if (!TEST_DIAG || !root) return;
  const lines: string[] = [];
  const visit = (node: any, depth: number) => {
    if (!node || depth > maxDepth || lines.length > 400) return;
    let r: { x: number; y: number; width: number; height: number } | null = null;
    try { r = node.getBoundingClientRect?.() ?? null; } catch { r = null; }
    const text = String(node.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 50);
    if (r) lines.push(`${'  '.repeat(depth)}[${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}] ${node.nodeName ?? ''} "${text}"`);
    const kids = Array.from((node.children ?? []) as ArrayLike<any>);
    // rami con un solo figlio: non conta come livello (wrapper)
    for (const k of kids) visit(k, kids.length === 1 ? depth : depth + 1);
  };
  visit(root, 0);
  // il logcat tronca le righe lunghe: un messaggio per gruppo di righe
  for (let i = 0; i < lines.length; i += 20) console.log(`VIBRA layout ${label} ${i / 20}\n${lines.slice(i, i + 20).join('\n')}`);
}

/**
 * Bisezione sull'emulatore (EXPO_PUBLIC_TEST_CUT=<id>:<da>-<a> oppure <id>:none, più tagli separati da virgola): dei figli di
 * <TestCut id> tiene solo quelli con indice nell'intervallo, per trovare la parte che blocca.
 * Senza la variabile (build normali) restituisce i figli così come sono.
 */
const TEST_CUT = process.env.EXPO_PUBLIC_TEST_CUT ?? '';
export function TestCut({ id, children }: { id: string; children?: unknown }): any {
  const m = TEST_CUT.match(new RegExp(`(?:^|,)${id}:(none|(\\d+)-(\\d+))(?:,|$)`));
  if (!m) return children;
  console.log(`VIBRA taglio ${id}:${m[1]}`);
  if (m[1] === 'none') return null;
  const list = Array.isArray(children) ? children : [children];
  return list.filter((_, i) => i >= Number(m[2]) && i <= Number(m[3]));
}
// senza taglio attivo è trasparente per gli space-y/gap del contenitore (ui/html cssChildren)
(TestCut as { cssTransparent?: boolean }).cssTransparent = !TEST_CUT;

/**
 * Perché un componente si ridisegna (solo build di test): nel logcat "VIBRA why <nome>" con i valori
 * cambiati dal render precedente (per identità), o "(stato interno)" se nessuno è cambiato.
 * Uso: useWhyRender('Pagina', { user, location, ... }) in cima al componente.
 */
const whyPrev = new Map<string, Record<string, unknown>>();
export function useWhyRender(name: string, values: Record<string, unknown>) {
  if (!TEST_DIAG || !name) return;
  const prev = whyPrev.get(name);
  whyPrev.set(name, values);
  if (!prev) { console.log(`VIBRA why ${name} primo render`); return; }
  const changed = Object.keys(values).filter((k) => !Object.is(prev[k], values[k]));
  console.log(`VIBRA why ${name} ${changed.length ? changed.join(',') : '(stato interno o hook non elencato)'}`);
}

// Risposte di rete: tempo del parse JSON (sul thread JS) e richieste grosse (solo build di test)
if (TEST_DIAG && typeof Response !== 'undefined') {
  const proto = Response.prototype as unknown as { json: () => Promise<unknown>; text: () => Promise<string> };
  const origText = proto.text;
  proto.json = async function json(this: Response) {
    const body = await origText.call(this);
    const t = Date.now();
    const out = JSON.parse(body);
    const ms = Date.now() - t;
    diagTime('json', ms);
    diagCount('richieste');
    if (ms > 40 || body.length > 300000) {
      const u = (this.url || '').replace(/^https?:\/\/[^/]+/, '').slice(0, 90);
      console.log(`VIBRA rete ${u} ${Math.round(body.length / 1024)}KB parse=${ms}ms`);
    }
    return out;
  };
}

/** Query avviate (solo build di test): una riga per chiave, per trovare caricamenti doppi. */
export function diagQueries(cache: { subscribe: (fn: (e: { type: string; query: { queryKey: unknown } }) => void) => () => void }) {
  if (!TEST_DIAG) return;
  cache.subscribe((e) => {
    if (e.type === 'added') console.log(`VIBRA query ${JSON.stringify(e.query.queryKey).slice(0, 120)}`);
    const st = (e as unknown as { action?: { type?: string } }).action?.type;
    if (e.type === 'updated' && (st === 'success' || st === 'fetch')) {
      const data = (e.query as unknown as { state: { data?: unknown } }).state.data;
      console.log(`VIBRA query ${st} ${JSON.stringify(e.query.queryKey).slice(0, 80)}${st === 'success' && Array.isArray(data) ? ` righe=${data.length}` : ''}`);
    }
  });
}

/** Segnaposto temporale nel logcat (solo build di test): "VIBRA mark <etichetta>". */
export function diagMark(label: string) {
  if (TEST_DIAG) console.log(`VIBRA mark ${label}`);
}

/** Diagnostica dei ridisegni: nel logcat quali valori hanno cambiato identità dal disegno precedente. */
export function useDiagWhy(label: string, values: Record<string, unknown>) {
  const prev = useRef<Record<string, unknown> | null>(null);
  if (!TEST_DIAG) return;
  const p = prev.current;
  const changed = p ? Object.keys(values).filter((k) => !Object.is(p[k], values[k])) : ['(montaggio)'];
  console.log(`VIBRA perché ${label} ${changed.join(',') || '(niente: genitore o stato)'}`);
  prev.current = values;
}
