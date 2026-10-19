// Animazioni infinite (repeat: Infinity di motion) attive solo quando servono: schermata a fuoco ed
// elemento nello schermo (scroll della pagina). Fuori schermo o in una tab nascosta il risultato a video è
// lo stesso, ma l'animazione teneva lo schermo sempre "in movimento": su Achievement (badge e riquadro
// G.O.A.T. di RankCard, scintillio della barra) i frame non si fermavano mai, anche a card fuori vista.
// Quando l'elemento torna visibile l'animazione riparte dall'inizio del ciclo (come al montaggio).
import { useEffect, useRef, useState } from 'react';
import { useScreenNavigation } from '../web/screenNavigation';

type Entry = { target: unknown; isIntersecting: boolean };
type Observer = { observe: (t: unknown) => void; unobserve: (t: unknown) => void };

// un solo IntersectionObserver (shim dello scroll della pagina sul telefono, quello vero sul web)
const callbacks = new Map<unknown, (v: boolean) => void>();
let shared: Observer | null = null;
function observer(): Observer | null {
  if (shared) return shared;
  const IO = (globalThis as { IntersectionObserver?: new (cb: (e: Entry[]) => void) => Observer }).IntersectionObserver;
  if (!IO) return null;
  shared = new IO((entries) => { for (const e of entries) callbacks.get(e.target)?.(e.isIntersecting); });
  return shared;
}

/**
 * `enabled`: l'elemento ha un'animazione infinita (altrimenti nessun osservatore né listener).
 * Restituisce il ref da dare all'elemento animato e se l'animazione deve girare ora.
 */
export function useLoopActive(enabled: boolean) {
  const nav = useScreenNavigation();
  const ref = useRef<unknown>(null);
  const [focused, setFocused] = useState(true);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    if (!enabled) return undefined;
    const offs: (() => void)[] = [];
    if (nav?.addListener) {
      try { setFocused(nav.isFocused?.() ?? true); } catch { /* fuori da uno schermo */ }
      offs.push(nav.addListener('focus', () => setFocused(true)), nav.addListener('blur', () => setFocused(false)));
    }
    const el = ref.current;
    const io = el ? observer() : null;
    if (io && el) {
      callbacks.set(el, setOnScreen);
      io.observe(el);
      offs.push(() => { io.unobserve(el); callbacks.delete(el); });
    }
    return () => offs.forEach((f) => f());
  }, [enabled, nav]);
  return { ref, active: !enabled || (focused && onScreen) };
}
