// Port di src/lib/uplotTouchZoom.js (convertito da scripts/port/codemod.mjs).
/**
 * Pinch-to-zoom + drag (pan) nativi per grafici uPlot su touch/mobile.
 * Non tocca la logica desktop (wheel/drag con mouse) — si aggiunge come
 * listener separato.
 * - 2 dita: pinch-to-zoom.
 * - 1 dito: se il grafico è zoomato e il gesto è prevalentemente orizzontale,
 *   trascina (pan) il grafico; altrimenti lascia lo scroll verticale di pagina.
 *
 * Le chiamate a setTarget (u.setScale) sono batchate via requestAnimationFrame:
 * su mobile touchmove può sparare decine di eventi per frame e ridisegnare il
 * canvas (soprattutto con molte serie spline) ad ogni evento causa lag. Con il
 * batching ridisegniamo al massimo una volta per frame. Durante il pan attivo
 * saltiamo l'aggiornamento del cursor (costoso e inutile mentre si trascina).
 */
export function attachPinchZoom(u, boundMin, boundMax, getTarget, setTarget) {
  let pinchStartDist = 0, pinchStartMin = 0, pinchStartMax = 0, pinchStartMidVal = 0;
  let panStartX = 0, panStartMin = 0, panStartMax = 0, panActive = false, panDeciding = false;

  // RAF batching: coalesce multipli touchmove in un solo redraw per frame
  let rafId = null;
  let pending = null;
  const flush = () => {
    rafId = null;
    if (pending) { const p = pending; pending = null; setTarget(p[0], p[1]); }
  };
  const scheduleSet = (min, max) => {
    pending = [min, max];
    if (rafId == null) rafId = requestAnimationFrame(flush);
  };

  const dist = (touches) => Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );

  const isZoomed = () => {
    const t = getTarget();
    return (t.max - t.min) < (boundMax - boundMin) - 0.01;
  };

  const updateCursor = (touch) => {
    const rect = u.over.getBoundingClientRect();
    u.setCursor({ left: touch.clientX - rect.left, top: touch.clientY - rect.top });
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      panActive = false;
      panDeciding = false;
      e.preventDefault();
      pinchStartDist = dist(e.touches);
      const t = getTarget();
      pinchStartMin = t.min;
      pinchStartMax = t.max;
      const rect = u.over.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      pinchStartMidVal = u.posToVal(midX, 'x');
    } else if (e.touches.length === 1) {
      pinchStartDist = 0;
      const t = getTarget();
      panStartX = e.touches[0].clientX;
      panStartMin = t.min;
      panStartMax = t.max;
      panDeciding = isZoomed();
      panActive = false;
      updateCursor(e.touches[0]);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDist) {
      e.preventDefault();
      const newDist = dist(e.touches);
      const range = pinchStartMax - pinchStartMin;
      let newRange = range * (pinchStartDist / newDist);
      newRange = Math.min(boundMax - boundMin, Math.max(3, newRange));

      const rect = u.over.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midVal = u.posToVal(midX, 'x');

      const ratio = (pinchStartMidVal - pinchStartMin) / (range || 1);
      let newMin = pinchStartMidVal - newRange * ratio;
      let newMax = newMin + newRange;

      // Segue lo spostamento delle dita (pan) oltre allo zoom
      const shift = pinchStartMidVal - midVal;
      newMin += shift;
      newMax += shift;

      if (newMin < boundMin) { newMax -= (newMin - boundMin); newMin = boundMin; }
      if (newMax > boundMax) { newMin -= (newMax - boundMax); newMax = boundMax; }

      scheduleSet(newMin, newMax);
    } else if (e.touches.length === 1) {
      if (panDeciding) {
        const dx = e.touches[0].clientX - panStartX;
        if (!panActive) {
          if (Math.abs(dx) < 6) return;
          panActive = true;
        }
        e.preventDefault();
        const rect = u.over.getBoundingClientRect();
        const valPerPx = (panStartMax - panStartMin) / rect.width;
        const shift = -dx * valPerPx;
        let newMin = panStartMin + shift, newMax = panStartMax + shift;
        if (newMin < boundMin) { newMax -= (newMin - boundMin); newMin = boundMin; }
        if (newMax > boundMax) { newMin -= (newMax - boundMax); newMax = boundMax; }
        scheduleSet(newMin, newMax);
      } else {
        updateCursor(e.touches[0]);
      }
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length < 2) pinchStartDist = 0;
    if (e.touches.length === 0) {
      panActive = false;
      panDeciding = false;
      u.setCursor({ left: -1, top: -1 });
    }
  };

  u.over.style.touchAction = 'pan-y';
  u.over.addEventListener('touchstart', onTouchStart, { passive: false });
  u.over.addEventListener('touchmove', onTouchMove, { passive: false });
  u.over.addEventListener('touchend', onTouchEnd);
  u.over.addEventListener('touchcancel', onTouchEnd);

  return () => {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    pending = null;
    u.over.removeEventListener('touchstart', onTouchStart);
    u.over.removeEventListener('touchmove', onTouchMove);
    u.over.removeEventListener('touchend', onTouchEnd);
    u.over.removeEventListener('touchcancel', onTouchEnd);
  };
}