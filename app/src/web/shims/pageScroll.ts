// Lo scroll della pagina: sul web originale era quello della finestra (window.scrollY, evento
// "scroll", window.scrollTo); qui ogni pagina è uno ScrollView (Page.tsx). Page registra il suo
// ScrollView e riporta posizione e altezza del contenuto; win.scrollY/scrollTo e i listener
// "scroll" (shims/dom) leggono e comandano la pagina in primo piano.
import { Platform } from 'react-native';

type Scroller = { scrollTo: (y: number, animated: boolean) => void; y: number; contentHeight: number; viewportHeight: number; content: () => any };
type Listener = (e: { type: 'scroll' }) => void;

const stack: Scroller[] = [];
const listeners = new Set<Listener>();
const top = () => stack[stack.length - 1];

export const pageScroll = {
  get y() { return top()?.y ?? 0; },
  get contentHeight() { return top()?.contentHeight ?? 0; },
  /** Altezza visibile della pagina (0 finché lo ScrollView non ha layout). */
  get viewportHeight() { return top()?.viewportHeight ?? 0; },

  /**
   * Distanza di un elemento (ref di Div/View) dall'inizio del contenuto della pagina, indipendente
   * dallo scroll: con lo scroll della pagina dà la posizione nello schermo (getBoundingClientRect
   * del web). Sul telefono measureLayout rispetto al contenuto dello ScrollView (sincrono in
   * Fabric), sul web la differenza dei getBoundingClientRect. null se non misurabile.
   */
  offsetOf(el: any): number | null {
    const content = top()?.content();
    if (!el || !content) return null;
    if (Platform.OS === 'web') {
      if (typeof el.getBoundingClientRect !== 'function' || typeof content.getBoundingClientRect !== 'function') return null;
      return el.getBoundingClientRect().top - content.getBoundingClientRect().top;
    }
    let y: number | null = null;
    try { el.measureLayout?.(content, (_x: number, yy: number) => { y = yy; }, () => {}); } catch { /* elemento smontato */ }
    return y;
  },

  /** Page al montaggio: restituisce le funzioni per riportare lo stato e per deregistrarsi. */
  register(scrollTo: Scroller['scrollTo'], content: Scroller['content'] = () => null) {
    const s: Scroller = { scrollTo, y: 0, contentHeight: 0, viewportHeight: 0, content };
    stack.push(s);
    return {
      report(y: number) {
        s.y = y;
        if (top() === s) listeners.forEach((fn) => fn({ type: 'scroll' }));
      },
      setContentHeight(h: number) { s.contentHeight = h; },
      setViewportHeight(h: number) {
        if (s.viewportHeight === h) return;
        s.viewportHeight = h;
        if (top() === s) listeners.forEach((fn) => fn({ type: 'scroll' }));
      },
      /** La pagina torna in primo piano (navigazione indietro). */
      focus() {
        const i = stack.indexOf(s);
        if (i >= 0 && i !== stack.length - 1) { stack.splice(i, 1); stack.push(s); }
      },
      unregister() {
        const i = stack.indexOf(s);
        if (i >= 0) stack.splice(i, 1);
      },
    };
  },

  scrollTo(y: number, smooth = false) { top()?.scrollTo(Math.max(0, y), smooth); },
  on(fn: Listener) { listeners.add(fn); },
  off(fn: Listener) { listeners.delete(fn); },
};
