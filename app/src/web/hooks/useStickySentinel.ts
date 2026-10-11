// Equivalente di src/hooks/useStickySentinel.jsx: callback ref per la "sentinella" (l'elemento
// subito prima della barra sticky) e lo stato "incollato" della barra. L'originale usava un
// IntersectionObserver; qui la pagina è lo ScrollView di Page: la barra è incollata quando lo
// scroll ha portato la sentinella sopra il `top` della barra (safe area, come
// top-[env(safe-area-inset-top)]). Lo stato cambia solo quando si attraversa la soglia.
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pageScroll } from '../shims/pageScroll';
import { PageLayerContext } from '../../ui/pageLayers';

export function useStickySentinel(): [(node: unknown) => void, boolean] {
  const [stuck, setStuck] = useState(false);
  const [el, setEl] = useState<unknown>(null);
  const sentinelRef = useCallback((node: unknown) => { setEl(node); }, []);
  const insetTop = useSafeAreaInsets().top;
  // scroll della PROPRIA pagina: con quello globale (della pagina visibile) le tab nascoste ricalcolavano
  // lo stato con misure sbagliate, lo vedevano cambiare e si ridisegnavano per intero a ogni cambio tab
  const layer = useContext(PageLayerContext);

  useEffect(() => {
    if (!el) return;
    let offset: number | null = null;
    const check = () => {
      // la posizione nel contenuto cambia solo se cambia ciò che sta sopra: rimisura a ogni controllo
      // (measureLayout è sincrono e costa poco), ma setStuck solo quando cambia lo stato
      const o = layer ? layer.offsetOf(el) : pageScroll.offsetOf(el);
      if (o != null) offset = o;
      if (offset == null) return;
      setStuck((layer ? layer.y() : pageScroll.y) + insetTop > offset);
    };
    check();
    if (layer) return layer.onScroll(check);
    pageScroll.on(check);
    return () => pageScroll.off(check);
  }, [el, insetTop, layer]);

  return [sentinelRef, stuck];
}
