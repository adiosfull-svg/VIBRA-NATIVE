// true quando l'elemento è entro `margin` dallo schermo (una volta visto resta true): per montare
// solo ciò che si sta per guardare. Sul telefono IntersectionObserver è quello di shims/dom (scroll
// della pagina); un elemento non misurabile risulta subito visibile.
import { useEffect, useRef, useState } from 'react';

export function useNearScreen(margin = '300px') {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    if (!ref.current || typeof IntersectionObserver === 'undefined') { setNear(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: `${margin} 0px ${margin} 0px` });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near, margin]);
  return [ref, near];
}
