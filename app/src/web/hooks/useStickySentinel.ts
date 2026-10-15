// Equivalente di src/hooks/useStickySentinel.jsx: callback ref per la "sentinella" (l'elemento
// subito prima della barra sticky) e lo stato "incollato" della barra. L'originale usava un
// IntersectionObserver; qui la pagina è lo ScrollView di Page: la barra è incollata quando lo
// scroll ha portato la sentinella sopra il `top` della barra (safe area, come
// top-[env(safe-area-inset-top)]). Lo stato cambia solo quando si attraversa la soglia.
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pageScroll } from '../shims/pageScroll';
import { PageLayerContext } from '../../ui/pageLayers';

export function useStickySentinel(): [(node: unknown) => void, boolean] {
  const [stuck, setStuck] = useState(false);
  const insetTop = useSafeAreaInsets().top;
  // scroll della PROPRIA pagina: con quello globale (della pagina visibile) le tab nascoste ricalcolavano
  // lo stato con misure sbagliate, lo vedevano cambiare e si ridisegnavano per intero a ogni cambio tab
  const layer = useContext(PageLayerContext);
  const env = useRef({ layer, insetTop });
  env.current = { layer, insetTop };
  const node = useRef<unknown>(null);
  const off = useRef<(() => void) | null>(null);
  const first = useRef(true);

  // PORT: iscrizione dentro il ref a callback, senza stato. Prima setEl(node) faceva un secondo disegno
  // completo della pagina al montaggio (e due per render con i ref in linea, chiamati con null e poi node).
  // Il nodo può arrivare dopo il primo commit (pagine con un return anticipato prima della sentinella).
  const attach = useCallback((el: unknown) => {
    if (el && el === node.current) return;
    off.current?.();
    off.current = null;
    node.current = el;
    if (!el) return;
    let offset: number | null = null;
    const check = () => {
      // la posizione nel contenuto cambia solo se cambia ciò che sta sopra: rimisura a ogni controllo
      // (measureLayout è sincrono e costa poco), ma setStuck solo quando cambia lo stato
      const { layer: l, insetTop: t } = env.current;
      const o = l ? l.offsetOf(el) : pageScroll.offsetOf(el);
      if (o != null) offset = o;
      if (offset != null) setStuck((l ? l.y() : pageScroll.y) + t > offset);
    };
    check();
    const l = env.current.layer;
    if (l) off.current = l.onScroll(check);
    else { pageScroll.on(check); off.current = () => pageScroll.off(check); }
  }, []);

  // cambio di pagina/safe area: si riaggancia lo stesso nodo
  useEffect(() => {
    if (!first.current && node.current) { const n = node.current; node.current = null; attach(n); }
    first.current = false;
  }, [layer, insetTop, attach]);
  useEffect(() => () => off.current?.(), []);

  return [attach, stuck];
}
