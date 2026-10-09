// Lo scroll della pagina: sul web originale era quello della finestra (window.scrollY, evento
// "scroll", window.scrollTo); qui ogni pagina è uno ScrollView (Page.tsx). Page registra il suo
// ScrollView e riporta posizione e altezza del contenuto; win.scrollY/scrollTo e i listener
// "scroll" (shims/dom) leggono e comandano la pagina in primo piano.
type Scroller = { scrollTo: (y: number, animated: boolean) => void; y: number; contentHeight: number };
type Listener = (e: { type: 'scroll' }) => void;

const stack: Scroller[] = [];
const listeners = new Set<Listener>();
const top = () => stack[stack.length - 1];

export const pageScroll = {
  get y() { return top()?.y ?? 0; },
  get contentHeight() { return top()?.contentHeight ?? 0; },

  /** Page al montaggio: restituisce le funzioni per riportare lo stato e per deregistrarsi. */
  register(scrollTo: Scroller['scrollTo']) {
    const s: Scroller = { scrollTo, y: 0, contentHeight: 0 };
    stack.push(s);
    return {
      report(y: number) {
        s.y = y;
        if (top() === s) listeners.forEach((fn) => fn({ type: 'scroll' }));
      },
      setContentHeight(h: number) { s.contentHeight = h; },
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
