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
import { BackHandler, Dimensions, Linking, PixelRatio, Share } from 'react-native';
import { pageScroll } from './pageScroll';

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

/** <a href download>.click(): link http(s) aperti col sistema; i file generati (blob/data) non si scaricano così. */
function anchor() {
  const a = { ...fakeElement(), href: '', download: '', target: '', rel: '' };
  a.click = () => {
    if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/.test(a.href)) Linking.openURL(a.href).catch(() => {});
    else console.warn('[dom] download non supportato sul telefono:', a.href.slice(0, 60));
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
  getElementById: () => null,
  getElementsByClassName: () => [],
  createElement: (tag: string) => (tag === 'a' ? anchor() : fakeElement()),
  createTextNode: () => fakeElement(),
};

// ── window ──────────────────────────────────────────────────────────────────
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
  requestIdleCallback: (cb: AnyFn) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1),
  cancelIdleCallback: (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
  requestAnimationFrame: (cb: FrameRequestCallback) => requestAnimationFrame(cb),
  cancelAnimationFrame: (id: number) => cancelAnimationFrame(id),
  setTimeout, clearTimeout, setInterval, clearInterval,
  matchMedia: (_q: string) => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
  get devicePixelRatio() { return PixelRatio.get(); },
  visualViewport: undefined,
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
