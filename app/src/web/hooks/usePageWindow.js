// Finestra di una lista virtualizzata sullo scroll della pagina, come le liste "window-based"
// dell'originale (VirtualizedClientList, RecontactList): lì leggevano getBoundingClientRect().top
// del contenitore a ogni scroll della finestra. Qui la pagina è lo ScrollView di Page: la posizione
// del contenitore nel contenuto (pageScroll.offsetOf) meno lo scroll dà lo stesso "top".
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { pageScroll } from '@/web/shims/pageScroll';

/** top del contenitore rispetto alla parte visibile della pagina (null se non misurabile). */
export function pageTopOf(el) {
  const offset = pageScroll.offsetOf(el);
  return offset == null ? null : offset - pageScroll.y;
}

function viewportHeight() {
  return pageScroll.viewportHeight || Dimensions.get('window').height;
}

/**
 * count elementi alti itemHeight: restituisce il ref del contenitore (alto count * itemHeight) e
 * l'intervallo [start, end) da rendere, con overscan elementi in più sopra e sotto.
 */
export function usePageWindow(count, itemHeight, overscan, initial = 20) {
  const containerRef = useRef(null);
  const [view, setView] = useState({ start: 0, end: Math.min(count, initial) });

  const compute = useCallback(() => {
    const top = pageTopOf(containerRef.current);
    if (top == null) return;
    const vh = viewportHeight();
    const height = count * itemHeight;
    // Fuori schermo (sopra o sotto): salta senza ricalcolare
    if (top > vh || top + height < 0) return;
    const start = Math.max(0, Math.floor(-top / itemHeight) - overscan);
    const end = Math.min(count, Math.ceil((vh - top) / itemHeight) + overscan);
    setView(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [count, itemHeight, overscan]);

  useEffect(() => {
    // primo calcolo dopo il layout del contenitore
    let raf = requestAnimationFrame(compute);
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    pageScroll.on(onScroll);
    return () => { cancelAnimationFrame(raf); pageScroll.off(onScroll); };
  }, [compute]);

  // la lista si accorcia (filtro): l'intervallo non deve uscire dai limiti
  const start = Math.min(view.start, count);
  const end = Math.min(view.end, count);
  return { containerRef, start, end, compute };
}
