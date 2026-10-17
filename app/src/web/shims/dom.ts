// Sul telefono: equivalenti nativi di window/document/navigator/localStorage usati dal codice
// portato dall'app web (sul web c'è dom.web.ts con gli oggetti veri). Non si definiscono globali:
// lo SDK Base44 usa `typeof document` per riconoscere React Native.
//  - scroll della finestra → ScrollView della pagina (pageScroll.ts)
//  - resize/orientationchange → Dimensions
//  - history.pushState/back + "popstate" → tasto indietro di Android (BackHandler)
//  - navigator.share/clipboard → Share / expo-clipboard; window.open → Linking
//  - localStorage → memoria + AsyncStorage (caricato all'avvio)
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { BackHandler, Dimensions, InteractionManager, Keyboard, Linking, PixelRatio, Platform, Share } from 'react-native';
import { blobToBase64, saveBase64File } from './files';
import { pageScroll } from './pageScroll';
import { windowTouchSink } from '../../ui/gestures';
import { getRegisteredById, setScrollIntoViewImpl } from '../../ui/domStyle';
import { elementFromPoint } from '../../ui/domData';

type AnyFn = (...a: any[]) => any;

// ── eventi ──────────────────────────────────────────────────────────────────
function makeTarget(name: string) {
  const map = new Map<string, Set<AnyFn>>();
  return {
    add(type: string, fn: AnyFn) {
      if (!map.has(type)) map.set(type, new Set());
      map.get(type)!.add(fn);
    },
    remove(type: string, fn: AnyFn) { map.get(type)?.delete(fn); },
    emit(type: string, event: Record<string, unknown> = {}) {
      const e = { type, target: name, preventDefault() {}, stopPropagation() {}, ...event };
      map.get(type)?.forEach((fn) => fn(e));
    },
  };
}
const winEvents = makeTarget('window');
const docEvents = makeTarget('document');
// move/up di un tocco partito su un elemento arrivano anche qui (ui/gestures), come nel browser
windowTouchSink.emit = (type, event) => { winEvents.emit(type, event); docEvents.emit(type, event); };

Dimensions.addEventListener('change', () => {
  winEvents.emit('resize');
  winEvents.emit('orientationchange');
});

// ── history (per i menu che si chiudono col tasto indietro) ────────────────
const states: unknown[] = [];
const history = {
  get state() { return states.length ? states[states.length - 1] : null; },
  get length() { return states.length + 1; },
  pushState(state: unknown) { states.push(state); },
  replaceState(state: unknown) { if (states.length) states[states.length - 1] = state; },
  back() {
    if (!states.length) return;
    states.pop();
    // come il browser: popstate arriva dopo, in modo asincrono
    setTimeout(() => winEvents.emit('popstate', { state: history.state }), 0);
  },
  go(n: number) { for (let i = 0; i < -n; i++) history.back(); },
  forward() {},
};
BackHandler.addEventListener('hardwareBackPress', () => {
  if (!states.length) return false;
  history.back();
  return true;
});

// ── scroll ──────────────────────────────────────────────────────────────────
function scrollToArgs(a: unknown, b?: unknown): [number, boolean] {
  if (a && typeof a === 'object') {
    const o = a as { top?: number; behavior?: string };
    return [o.top ?? pageScroll.y, o.behavior === 'smooth'];
  }
  return [Number(b ?? 0), false];
}

function addListener(target: ReturnType<typeof makeTarget>) {
  return (type: string, fn: AnyFn) => (type === 'scroll' ? pageScroll.on(fn) : target.add(type, fn));
}
function removeListener(target: ReturnType<typeof makeTarget>) {
  return (type: string, fn: AnyFn) => (type === 'scroll' ? pageScroll.off(fn) : target.remove(type, fn));
}

// ── localStorage ────────────────────────────────────────────────────────────
const PREFIX = 'ls:';
const mem = new Map<string, string>();
export const storageReady: Promise<void> = AsyncStorage.getAllKeys()
  .then((keys) => AsyncStorage.multiGet(keys.filter((k) => k.startsWith(PREFIX))))
  .then((pairs) => { for (const [k, v] of pairs) if (v != null && !mem.has(k.slice(PREFIX.length))) mem.set(k.slice(PREFIX.length), v); })
  .catch(() => {});

export const storage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => { mem.set(k, String(v)); AsyncStorage.setItem(PREFIX + k, String(v)).catch(() => {}); },
  removeItem: (k: string) => { mem.delete(k); AsyncStorage.removeItem(PREFIX + k).catch(() => {}); },
  clear: () => { for (const k of mem.keys()) AsyncStorage.removeItem(PREFIX + k).catch(() => {}); mem.clear(); },
  key: (i: number) => [...mem.keys()][i] ?? null,
  get length() { return mem.size; },
};

// ── sessionStorage: in memoria, dura quanto l'app è aperta (come una scheda del browser) ──
const sessionMem = new Map<string, string>();
export const sessionStore = {
  getItem: (k: string) => (sessionMem.has(k) ? sessionMem.get(k)! : null),
  setItem: (k: string, v: string) => { sessionMem.set(k, String(v)); },
  removeItem: (k: string) => { sessionMem.delete(k); },
  clear: () => { sessionMem.clear(); },
  key: (i: number) => [...sessionMem.keys()][i] ?? null,
  get length() { return sessionMem.size; },
};

// ── navigator ──────────────────────────────────────────────────────────────
export const nav = {
  userAgent: 'ReactNative',
  platform: 'ReactNative',
  language: 'it-IT',
  onLine: true,
  maxTouchPoints: 5,
  /** Condivisione di sistema: testo e link sì, file no (canShare({ files }) → false, come i browser che non li supportano). */
  async share(data: { title?: string; text?: string; url?: string; files?: unknown[] }) {
    if (data?.files?.length) throw Object.assign(new Error('Condivisione di file non supportata'), { name: 'NotAllowedError' });
    const message = [data?.text, data?.url].filter(Boolean).join('\n');
    const res = await Share.share({ title: data?.title, message, url: data?.url });
    if (res.action === Share.dismissedAction) throw Object.assign(new Error('Condivisione annullata'), { name: 'AbortError' });
  },
  canShare: (data?: { files?: unknown[] }) => !data?.files?.length,
  clipboard: {
    writeText: (t: string) => Clipboard.setStringAsync(String(t)).then(() => undefined),
    readText: () => Clipboard.getStringAsync(),
    read: () => Promise.reject(new Error('Lettura immagini dagli appunti non supportata')),
    write: () => Promise.reject(new Error('Copia di immagini negli appunti non supportata')),
  },
};

// ── document ────────────────────────────────────────────────────────────────
const noopClassList = { add() {}, remove() {}, toggle() { return false; }, contains: () => false };
const fakeElement = () => ({
  style: {} as Record<string, unknown>, dataset: {} as Record<string, string>, classList: noopClassList,
  setAttribute() {}, removeAttribute() {}, appendChild() {}, removeChild() {}, remove() {},
  addEventListener() {}, removeEventListener() {}, focus() {}, blur() {}, click() {},
  getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }),
});

// ── URL.createObjectURL: blob tenuti qui, così <a href=blob: download>.click() può salvarli ──
const blobs = new Map<string, Blob>();
let blobSeq = 0;
export const url = {
  createObjectURL(blob: Blob) { const u = `blob:vibra/${++blobSeq}`; blobs.set(u, blob); return u; },
  revokeObjectURL(u: string) { blobs.delete(u); },
};

/**
 * <a href download>.click(): link http(s) aperti col sistema; con `download` un blob (URL.createObjectURL) o un
 * data: URL diventa un file salvato e condiviso (files.ts), come il download del browser.
 */
function anchor() {
  const a = { ...fakeElement(), href: '', download: '', target: '', rel: '' };
  a.click = () => {
    const blob = blobs.get(a.href);
    const data = a.href.match(/^data:([^;,]*)(;base64)?,(.*)$/);
    if (blob) {
      void blobToBase64(blob).then((b64) => saveBase64File(a.download || 'file', b64, blob.type || 'application/octet-stream'));
    } else if (data) {
      const b64 = data[2] ? data[3] : globalThis.btoa(unescape(encodeURIComponent(decodeURIComponent(data[3]))));
      void saveBase64File(a.download || 'file', b64, data[1] || 'application/octet-stream');
    } else if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/.test(a.href)) Linking.openURL(a.href).catch(() => {});
    else console.warn('[dom] link non supportato sul telefono:', a.href.slice(0, 60));
  };
  return a;
}

const body = fakeElement();
export const doc = {
  body,
  head: fakeElement(),
  documentElement: {
    ...fakeElement(),
    get scrollHeight() { return pageScroll.contentHeight; },
    get scrollTop() { return pageScroll.y; },
    get clientHeight() { return Dimensions.get('window').height; },
    get clientWidth() { return Dimensions.get('window').width; },
  },
  activeElement: null,
  fullscreenElement: null,
  visibilityState: 'visible',
  hidden: false,
  title: '',
  exitFullscreen: async () => {},
  addEventListener: addListener(docEvents),
  removeEventListener: removeListener(docEvents),
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: (id: string) => getRegisteredById(id),
  // solo elementi con attributi data-* (ui/domData): il codice web lo usa con closest('[data-x]')
  elementFromPoint: (x: number, y: number) => elementFromPoint(x, y),
  getElementsByClassName: () => [],
  createElement: (tag: string) => (tag === 'a' ? anchor() : fakeElement()),
  createTextNode: () => fakeElement(),
};

// ── window ──────────────────────────────────────────────────────────────────
// ── el.scrollIntoView sul telefono: scroll della pagina in primo piano fino all'elemento ───────────────
setScrollIntoViewImpl((node, opts) => {
  const top = pageScroll.offsetOf(node);
  if (top == null) return;
  const o = typeof opts === 'object' && opts ? opts : {};
  const block = typeof opts === 'boolean' ? (opts ? 'start' : 'end') : o.block ?? 'start';
  const vh = pageScroll.viewportHeight || Dimensions.get('window').height;
  const h = (node as { getBoundingClientRect?: () => { height: number } }).getBoundingClientRect?.().height ?? 0;
  const y = block === 'center' ? top - (vh - h) / 2 : block === 'end' ? top - vh + h : top;
  pageScroll.scrollTo(Math.max(0, y), o.behavior === 'smooth');
});

// ── visualViewport: area visibile sopra la tastiera (eventi Keyboard di RN) ─────────────────────────
// L'originale la usa per tenere sopra la tastiera la barra di VibraGPT, la ricerca, i menu.
let keyboardHeight = 0;
const vvListeners: Record<string, Set<AnyFn>> = { resize: new Set(), scroll: new Set() };
const fireViewport = () => { for (const fn of [...vvListeners.resize, ...vvListeners.scroll]) fn({ type: 'resize' }); };
const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
Keyboard.addListener(showEvt, (e) => { keyboardHeight = e.endCoordinates?.height ?? 0; fireViewport(); });
Keyboard.addListener(hideEvt, () => { keyboardHeight = 0; fireViewport(); });
const visualViewport = {
  get width() { return Dimensions.get('window').width; },
  get height() { return Math.max(0, Dimensions.get('window').height - keyboardHeight); },
  offsetTop: 0, offsetLeft: 0, pageTop: 0, pageLeft: 0, scale: 1,
  addEventListener(type: string, fn: AnyFn) { vvListeners[type]?.add(fn); },
  removeEventListener(type: string, fn: AnyFn) { vvListeners[type]?.delete(fn); },
};


// requestIdleCallback: "quando il browser è libero" = a fine animazioni e tocchi in corso
// (InteractionManager), con il timeout dell'originale come limite. Prima era un setTimeout di 1 ms:
// grafici (DeferredChart) e lavori "rimandati" partivano in mezzo all'animazione d'apertura.
type IdleHandle = { done: boolean; task?: { cancel: () => void }; timer?: ReturnType<typeof setTimeout> };
function requestIdle(cb: AnyFn, opts?: { timeout?: number }): IdleHandle {
  const h: IdleHandle = { done: false };
  const run = (didTimeout: boolean) => {
    if (h.done) return;
    h.done = true;
    h.task?.cancel();
    if (h.timer) clearTimeout(h.timer);
    cb({ didTimeout, timeRemaining: () => 50 });
  };
  h.task = InteractionManager.runAfterInteractions(() => { h.timer = setTimeout(() => run(false), 0); });
  if (opts?.timeout) {
    // a fine timeout comunque, ma non prima che l'animazione d'apertura più lunga (~300 ms) sia finita
    const ms = Math.max(opts.timeout, 320);
    const t = setTimeout(() => run(true), ms);
    const prev = h.task;
    h.task = { cancel: () => { prev.cancel(); clearTimeout(t); } };
  }
  return h;
}
function cancelIdle(h: IdleHandle | undefined) {
  if (!h || h.done) return;
  h.done = true;
  h.task?.cancel();
  if (h.timer) clearTimeout(h.timer);
}

export const win = {
  addEventListener: addListener(winEvents),
  removeEventListener: removeListener(winEvents),
  dispatchEvent: (e: { type: string }) => { winEvents.emit(e.type, e as Record<string, unknown>); return true; },
  get innerWidth() { return Dimensions.get('window').width; },
  get innerHeight() { return Dimensions.get('window').height; },
  get outerWidth() { return Dimensions.get('window').width; },
  get outerHeight() { return Dimensions.get('window').height; },
  get scrollY() { return pageScroll.y; },
  get pageYOffset() { return pageScroll.y; },
  scrollX: 0,
  scrollTo: (a: unknown, b?: unknown) => pageScroll.scrollTo(...scrollToArgs(a, b)),
  scrollBy: (a: unknown, b?: unknown) => {
    const [dy, smooth] = scrollToArgs(a, b);
    pageScroll.scrollTo(pageScroll.y + dy, smooth);
  },
  history,
  location: { href: '', pathname: '/', search: '', hash: '', origin: '', reload() {} },
  open: (url?: string) => { if (url) Linking.openURL(url).catch(() => {}); return null; },
  requestIdleCallback: requestIdle,
  cancelIdleCallback: cancelIdle,
  requestAnimationFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
  cancelAnimationFrame: (id: number) => cancelAnimationFrame(id),
  setTimeout, clearTimeout, setInterval, clearInterval,
  // telefono: schermo touch senza hover (pointer: coarse / hover: none come Chrome su Android)
  matchMedia: (q: string) => ({ matches: /\(\s*(pointer\s*:\s*coarse|hover\s*:\s*none|any-pointer\s*:\s*coarse)\s*\)/.test(q), addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
  get devicePixelRatio() { return PixelRatio.get(); },
  visualViewport,
  localStorage: storage,
  navigator: nav,
  document: doc,
};

/** new CustomEvent(type, { detail }) per win.dispatchEvent (sul telefono non esiste CustomEvent). */
export class CustomEvt<T = unknown> {
  type: string;
  detail: T;
  constructor(type: string, init?: { detail?: T }) {
    this.type = type;
    this.detail = init?.detail as T;
  }
}

// ── globali del browser usati dal codice portato senza passare dagli shim ───────────────────────
// (non `document`/`window`: vedi sopra). Su Hermes `new Image()` o `new IntersectionObserver()` in un
// effect facevano cadere l'app (ReferenceError).
const g = globalThis as Record<string, unknown>;
if (typeof g.Image === 'undefined') {
  /** new Image(); img.src = url → precaricamento con la cache di ui/imageCache (memoria + disco), poi onload/onerror. */
  g.Image = class {
    onload: AnyFn | null = null;
    onerror: AnyFn | null = null;
    naturalWidth = 0;
    naturalHeight = 0;
    complete = false;
    private url = '';
    get src() { return this.url; }
    set src(v: string) {
      this.url = v;
      if (!/^https?:/.test(v)) return;
      import('../../ui/imageCache')
        .then(({ prefetchImages }) => prefetchImages([v]))
        .then(() => { this.complete = true; this.onload?.({ type: 'load', target: this }); })
        .catch(() => this.onerror?.({ type: 'error', target: this }));
    }
    decode() { return Promise.resolve(); }
    addEventListener(type: string, fn: AnyFn) { if (type === 'load') this.onload = fn; if (type === 'error') this.onerror = fn; }
    removeEventListener() {}
  };
}
if (typeof g.ResizeObserver === 'undefined') {
  /**
   * ResizeObserver: misura (getBoundingClientRect di Fabric) al frame dopo observe() e quando cambia la
   * finestra (rotazione, tastiera). Basta per i contenitori a tutto schermo del codice web (tela delle
   * Comitive); prima `new ResizeObserver` era un ReferenceError che chiudeva l'app.
   */
  type Entry = { target: unknown; contentRect: { width: number; height: number; top: number; left: number } };
  g.ResizeObserver = class {
    private cb: AnyFn;
    private targets = new Set<{ getBoundingClientRect?: () => { width: number; height: number; top: number; left: number } }>();
    private sub: { remove(): void } | null = null;
    private frame = 0;
    constructor(cb: AnyFn) { this.cb = cb; }
    private fire = () => {
      this.frame = 0;
      const entries: Entry[] = [];
      for (const t of this.targets) {
        try {
          const r = t.getBoundingClientRect?.();
          if (r) entries.push({ target: t, contentRect: { width: r.width, height: r.height, top: 0, left: 0 } });
        } catch { /* elemento smontato */ }
      }
      if (entries.length) this.cb(entries, this);
    };
    private schedule = () => { if (!this.frame) this.frame = requestAnimationFrame(this.fire); };
    observe(t: never) {
      this.targets.add(t);
      if (!this.sub) this.sub = Dimensions.addEventListener('change', () => setTimeout(this.schedule, 50));
      this.schedule();
    }
    unobserve(t: never) { this.targets.delete(t); }
    disconnect() {
      this.targets.clear();
      this.sub?.remove();
      this.sub = null;
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  };
}
if (typeof g.IntersectionObserver === 'undefined') {
  /**
   * IntersectionObserver sullo scroll della pagina (pageScroll): come nel browser, l'elemento risulta
   * visibile quando entra nello schermo (± rootMargin). Lo usa il codice originale per caricare solo ciò
   * che si guarda (immagini lazy di CachedImage, sentinelle). Prima ogni elemento risultava visibile
   * subito: sul telefono si caricava tutto all'apertura. Un elemento non misurabile (pagina in
   * background, modale) resta "visibile subito", come prima.
   */
  const px = (v: string | undefined, vh: number) => {
    if (!v) return 0;
    const n = parseFloat(v);
    return Number.isFinite(n) ? (v.trim().endsWith('%') ? (n / 100) * vh : n) : 0;
  };
  g.IntersectionObserver = class {
    private cb: AnyFn;
    private margin: string[];
    private targets = new Map<unknown, boolean | undefined>();
    private alive = true;
    private scheduled = false;
    private listening = false;
    constructor(cb: AnyFn, opts?: { rootMargin?: string }) {
      this.cb = cb;
      const m = (opts?.rootMargin ?? '0px').trim().split(/\s+/);
      // CSS: 1-4 valori (top right bottom left)
      this.margin = [m[0], m[1] ?? m[0], m[2] ?? m[0], m[3] ?? m[1] ?? m[0]];
    }
    private onScroll = () => this.schedule();
    private schedule() {
      if (this.scheduled || !this.alive) return;
      this.scheduled = true;
      requestAnimationFrame(() => { this.scheduled = false; this.check(); });
    }
    private check() {
      if (!this.alive || !this.targets.size) return;
      const vh = pageScroll.viewportHeight || Dimensions.get('window').height;
      const y = pageScroll.y;
      const rootTop = y - px(this.margin[0], vh);
      const rootBottom = y + vh + px(this.margin[2], vh);
      const entries: unknown[] = [];
      for (const [target, was] of this.targets) {
        const r = pageScroll.rectOf(target);
        // non misurabile (pagina in background) dopo il primo esito: resta com'era. Prima risultava di
        // nuovo "visibile" e lo scroll di un'altra pagina cambiava lo stato (e ridisegnava) quella nascosta.
        // Al primo esito resta "visibile subito" (immagini lazy dentro i dialog).
        if (!r && was !== undefined) continue;
        const inView = r ? r.y < rootBottom && r.y + r.h > rootTop : true;
        if (inView === was) continue;
        this.targets.set(target, inView);
        const top = r ? r.y - y : 0;
        const h = r?.h ?? 0;
        const rect = { top, bottom: top + h, left: 0, right: 0, width: 0, height: h, x: 0, y: top };
        entries.push({ target, isIntersecting: inView, intersectionRatio: inView ? 1 : 0, boundingClientRect: rect, intersectionRect: rect, rootBounds: null, time: Date.now() });
      }
      if (entries.length) this.cb(entries, this);
    }
    observe(target: unknown) {
      if (!this.alive) return;
      this.targets.set(target, undefined);
      if (!this.listening) { this.listening = true; pageScroll.on(this.onScroll); }
      // dopo il layout dell'elemento appena montato
      setTimeout(() => this.schedule(), 0);
    }
    unobserve(target: unknown) { this.targets.delete(target); }
    disconnect() {
      this.alive = false;
      this.targets.clear();
      if (this.listening) { this.listening = false; pageScroll.off(this.onScroll); }
    }
    takeRecords() { return []; }
  };
}
