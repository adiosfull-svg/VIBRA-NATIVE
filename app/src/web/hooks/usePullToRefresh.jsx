// Port di src/hooks/usePullToRefresh.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect, useRef, useState } from 'react';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';

/**
 * Pull-to-refresh hook for mobile.
 * Returns { isRefreshing, pullProgress (0–1) }
 * @param {Function} onRefresh - async function to call on refresh
 * @param {Object} opts - { threshold: 72, containerRef? }
 *
 * Nota: i valori letti nei handler (progress, refreshing, onRefresh) vivono in ref,
 * così l'effect ha deps stabili e NON ri-aggancia i listener ad ogni touchmove
 * (che causava stutter e gesture "incastrate" su mobile).
 */
export function usePullToRefresh(onRefresh, { threshold = 72 } = {}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const startYRef = useRef(null);
  const startXRef = useRef(null);
  const isPullingRef = useRef(false);
  const progressRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    // Marca la pagina come dotata di pull-to-refresh: useRubberBandScroll legge
    // questo flag per disabilitare il rubber band al top (evita conflitto).
    webDocument.body.dataset.ptrActive = 'true';

    // Il listener touchmove NON passivo (serve per preventDefault) esiste SOLO
    // mentre un pull è realmente in corso (gesto iniziato in cima alla pagina).
    // Prima era sempre agganciato a document: su iOS un touchmove non passivo
    // permanente fa aspettare il JS ad ogni movimento e, peggio, lo stato di un
    // gesto precedente interrotto (iOS emette touchcancel, che non era gestito)
    // restava "attivo": il touchmove successivo, anche a metà pagina, chiamava
    // preventDefault e lo scroll si bloccava (soprattutto partendo da elementi
    // con gesture proprie, come le card delle semine).
    let moveAttached = false;

    const detachMove = () => {
      if (!moveAttached) return;
      webDocument.removeEventListener('touchmove', onTouchMove);
      moveAttached = false;
    };

    const attachMove = () => {
      if (moveAttached) return;
      webDocument.addEventListener('touchmove', onTouchMove, { passive: false });
      moveAttached = true;
    };

    // Azzera sempre ogni traccia del gesto (anche se interrotto).
    const resetGesture = () => {
      isPullingRef.current = false;
      startYRef.current = null;
      startXRef.current = null;
      progressRef.current = 0;
      detachMove();
    };

    function onTouchStart(e) {
      // Ogni nuovo tocco riparte da zero: lo stato del gesto precedente non deve
      // mai sopravvivere (touchend/touchcancel possono non arrivare).
      resetGesture();
      if (refreshingRef.current) return;
      if (e.touches.length !== 1) return;
      if (webDocument.body.dataset.sidebarOpen) return; // sidebar aperta: niente refresh
      if (webDocument.body.dataset.scrollLock) return;   // overlay/popup aperto: niente refresh
      if (webWindow.scrollY > 0) return; // only when at top
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      isPullingRef.current = true;
      attachMove();
    }

    function onTouchMove(e) {
      if (!isPullingRef.current || refreshingRef.current) { detachMove(); return; }
      // La pagina non è più in cima: non è un pull-to-refresh, lascia lo scroll al browser.
      if (webWindow.scrollY > 0) { setPullProgress(0); resetGesture(); return; }
      const dx = e.touches[0].clientX - (startXRef.current || 0);
      const delta = e.touches[0].clientY - (startYRef.current || 0);
      // Gesto prevalentemente orizzontale (es. swipe sulla tab bar scorrevole):
      // non è un pull-to-refresh — rinuncia e lascia che lo scroll orizzontale
      // proceda, altrimenti il preventDefault sotto blocca la tab e la pagina
      // ha un "saltino".
      if (Math.abs(dx) > Math.abs(delta)) {
        setPullProgress(0);
        resetGesture();
        return;
      }
      // Verso l'alto (scroll normale della pagina): non è un pull, nessun preventDefault.
      if (delta < 0) { setPullProgress(0); resetGesture(); return; }
      // Dampen the pull
      const dampened = Math.min(delta * 0.45, threshold * 1.4);
      progressRef.current = Math.min(dampened / threshold, 1);
      setPullProgress(progressRef.current);
      if (delta > 10 && e.cancelable) e.preventDefault();
    }

    async function onTouchEnd() {
      if (!isPullingRef.current) { resetGesture(); return; }
      const shouldRefresh = progressRef.current >= 1;
      resetGesture();
      if (shouldRefresh) {
        refreshingRef.current = true;
        setIsRefreshing(true);
        setPullProgress(0);
        try { await onRefreshRef.current(); } finally {
          refreshingRef.current = false;
          setIsRefreshing(false);
        }
      } else {
        setPullProgress(0);
      }
    }

    // touchcancel (iOS lo emette quando il sistema/pointer events prendono il
    // gesto): MAI avviare un refresh, solo ripulire lo stato.
    function onTouchCancel() {
      resetGesture();
      setPullProgress(0);
    }

    webDocument.addEventListener('touchstart', onTouchStart, { passive: true });
    webDocument.addEventListener('touchend', onTouchEnd, { passive: true });
    webDocument.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      delete webDocument.body.dataset.ptrActive;
      webDocument.removeEventListener('touchstart', onTouchStart);
      webDocument.removeEventListener('touchend', onTouchEnd);
      webDocument.removeEventListener('touchcancel', onTouchCancel);
      detachMove();
    };
  }, [threshold]);

  return { isRefreshing, pullProgress };
}