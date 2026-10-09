// Sul web: i veri window/document/navigator/localStorage, tranne lo scroll della pagina, che qui
// è quello dello ScrollView di Page e non della finestra (vedi pageScroll.ts e dom.ts).
import { pageScroll } from './pageScroll';

type AnyFn = (...a: any[]) => any;

function scrollToArgs(a: unknown, b?: unknown): [number, boolean] {
  if (a && typeof a === 'object') {
    const o = a as { top?: number; behavior?: string };
    return [o.top ?? pageScroll.y, o.behavior === 'smooth'];
  }
  return [Number(b ?? 0), false];
}

const scrollOverrides: Record<string, unknown> = {
  addEventListener: (type: string, fn: AnyFn, opts?: unknown) =>
    (type === 'scroll' ? pageScroll.on(fn) : window.addEventListener(type, fn, opts as AddEventListenerOptions)),
  removeEventListener: (type: string, fn: AnyFn, opts?: unknown) =>
    (type === 'scroll' ? pageScroll.off(fn) : window.removeEventListener(type, fn, opts as EventListenerOptions)),
  scrollTo: (a: unknown, b?: unknown) => pageScroll.scrollTo(...scrollToArgs(a, b)),
  scrollBy: (a: unknown, b?: unknown) => {
    const [dy, smooth] = scrollToArgs(a, b);
    pageScroll.scrollTo(pageScroll.y + dy, smooth);
  },
};

export const win: any = new Proxy(window, {
  get(target, key) {
    if (key === 'scrollY' || key === 'pageYOffset') return pageScroll.y;
    if (typeof key === 'string' && key in scrollOverrides) return scrollOverrides[key];
    const v = Reflect.get(target, key);
    return typeof v === 'function' ? v.bind(target) : v;
  },
});

const documentElement = new Proxy(document.documentElement, {
  get(target, key) {
    if (key === 'scrollHeight') return pageScroll.contentHeight;
    if (key === 'scrollTop') return pageScroll.y;
    const v = Reflect.get(target, key);
    return typeof v === 'function' ? v.bind(target) : v;
  },
});

export const doc: any = new Proxy(document, {
  get(target, key) {
    if (key === 'documentElement') return documentElement;
    if (key === 'addEventListener' || key === 'removeEventListener') {
      return (type: string, fn: AnyFn, opts?: unknown) =>
        (type === 'scroll' ? (key === 'addEventListener' ? pageScroll.on(fn) : pageScroll.off(fn)) : (target as any)[key](type, fn, opts));
    }
    const v = Reflect.get(target, key);
    return typeof v === 'function' ? v.bind(target) : v;
  },
});

export const nav: any = navigator;
export const storage: Storage = localStorage;
export const storageReady = Promise.resolve();
export const CustomEvt = CustomEvent;
export const url = URL;
