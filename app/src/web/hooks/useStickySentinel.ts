// Equivalente di src/hooks/useStickySentinel.jsx: callback ref per la "sentinella" (l'elemento
// subito prima della barra sticky) e lo stato "incollato" della barra. L'originale usava un
// IntersectionObserver; qui la pagina è lo ScrollView di Page: la barra è incollata quando lo
// scroll ha portato la sentinella sopra il `top` della barra (safe area, come
// top-[env(safe-area-inset-top)]). Lo stato cambia solo quando si attraversa la soglia.
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pageScroll } from '../shims/pageScroll';

export function useStickySentinel(): [(node: unknown) => void, boolean] {
  const [stuck, setStuck] = useState(false);
  const [el, setEl] = useState<unknown>(null);
  const sentinelRef = useCallback((node: unknown) => { setEl(node); }, []);
  const insetTop = useSafeAreaInsets().top;

  useEffect(() => {
    if (!el) return;
    let offset: number | null = null;
    const check = () => {
      // la posizione nel contenuto cambia solo se cambia ciò che sta sopra: rimisura a ogni controllo
      // (measureLayout è sincrono e costa poco), ma setStuck solo quando cambia lo stato
      const o = pageScroll.offsetOf(el);
      if (o != null) offset = o;
      if (offset == null) return;
      setStuck(pageScroll.y + insetTop > offset);
    };
    check();
    pageScroll.on(check);
    return () => pageScroll.off(check);
  }, [el, insetTop]);

  return [sentinelRef, stuck];
}
