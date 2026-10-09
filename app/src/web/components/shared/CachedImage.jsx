// Port di src/components/shared/CachedImage.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { acquireImage, canCacheImage, peekImage, pickDisplaySrc, rememberShown, isShown } from '@/legacy/utils/publicImageCache';

import { Img } from '@/ui/elements';

const EMPTY = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * CachedImage — mostra un'immagine senza flashare.
 *
 * REGOLE ANTI-FLASH
 * 1. L'URL è scelta UNA volta al mount e non cambia più (nessuno swap a metà vita).
 * 2. La scelta (pickDisplaySrc) privilegia la STESSA URL già mostrata altrove
 *    (lista → dettaglio → programmazione...): URL uguale = il browser ha già
 *    l'immagine decodificata e dipinge il primo frame. Il blob ridimensionato si
 *    usa solo se il preloader l'ha già decodificato; altrimenti si usa l'originale.
 *    Prima: originale al primo mount e blob ai successivi → due URL diverse per la
 *    stessa foto → ogni cambio di URL ripartiva da zero (frame vuoto = flash).
 * 3. Se l'immagine non è già pronta al mount (cold cache), compare con una breve
 *    dissolvenza invece di "saltare" fuori di colpo. Se è già pronta, nessun effetto.
 * 4. Se l'originale fallisce (es. URL Instagram scaduta) si ripiega sulla miniatura
 *    in cache invece di mostrare subito le iniziali.
 */
export default function CachedImage({ src, alt = '', loading = 'eager', decoding = 'async', onLoad, onError, style, ...props }) {
  const ref = useRef(null);
  const aliveRef = useRef(true);
  useEffect(() => { aliveRef.current = true; return () => { aliveRef.current = false; }; }, []);

  const [visible, setVisible] = useState(() => {
    if (loading !== 'lazy') return true;
    if (!canCacheImage(src)) return true;
    return !!peekImage(src);
  });
  useEffect(() => {
    if (visible || loading !== 'lazy') return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, loading]);

  const active = visible || loading !== 'lazy';

  // Avvia fetch + downscale in background (popola la cache per i mount successivi).
  useEffect(() => {
    if (!active || !canCacheImage(src)) return;
    const resource = acquireImage(src);
    return () => resource.release();
  }, [active, src]);

  // Scelta iniziale sincrona (nessun frame con EMPTY) + stato "già pronta".
  const initialRef = useRef(null);
  if (initialRef.current === null) {
    const s = active ? pickDisplaySrc(src) : EMPTY;
    initialRef.current = { s, ready: s !== EMPTY && isShown(src, s) };
  }
  const [lockedSrc, setLockedSrc] = useState(initialRef.current.s);
  const [ready, setReady] = useState(initialRef.current.ready);
  const fadeRef = useRef(false);

  useEffect(() => {
    if (!active) { setLockedSrc(EMPTY); return; }
    setLockedSrc(pickDisplaySrc(src));
  }, [active, src]);

  // Verifica sincrona (prima del paint) se l'immagine è già disponibile.
  useLayoutEffect(() => {
    if (lockedSrc === EMPTY) { fadeRef.current = false; setReady(false); return; }
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) {
      fadeRef.current = false;
      rememberShown(src, lockedSrc);
      setReady(true);
    } else {
      fadeRef.current = true; // arriverà via rete/decodifica: dissolvenza morbida
      setReady(false);
    }
  }, [lockedSrc, src]);

  const handleLoad = (e) => {
    rememberShown(src, lockedSrc);
    setReady(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    // Originale fallita (URL scaduta/offline): usa la miniatura in cache se c'è.
    if (lockedSrc === src && canCacheImage(src)) {
      const blob = peekImage(src);
      if (blob && blob !== src) { setLockedSrc(blob); return; }
      const res = acquireImage(src);
      res.promise.then(url => {
        if (!aliveRef.current) return;
        if (url && url !== src) setLockedSrc(url);
        else onError?.({ type: 'error', target: ref.current, currentTarget: ref.current });
      }).catch(() => {
        if (aliveRef.current) onError?.({ type: 'error', target: ref.current, currentTarget: ref.current });
      }).finally(() => res.release());
      return;
    }
    onError?.(e);
  };

  const fadeStyle = lockedSrc === EMPTY
    ? style
    : { ...style, opacity: ready ? style?.opacity : 0, transition: fadeRef.current && ready ? 'opacity 160ms ease-out' : style?.transition };

  return (
    <Img
      {...props}
      ref={ref}
      src={lockedSrc}
      alt={alt}
      style={fadeStyle}
      onLoad={lockedSrc !== EMPTY ? handleLoad : undefined}
      onError={lockedSrc !== EMPTY ? handleError : undefined} />
  );
}