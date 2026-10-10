// Port di src/hooks/useFlipGesture.js (convertito da scripts/port/codemod.mjs).
import { useState, useEffect, useRef, useCallback } from 'react';

import { nav as webNavigator, win as webWindow } from '@/web/shims/dom';

/**
 * Gesto "flip" semplificato e robusto — approccio a inclinazione + soglia.
 *
 * LOGICHE SEPARATE:
 *
 * ANDROID / DESKTOP
 * - Mantiene la logica originale del gesture.
 * - Il drag viene confermato sulla base del movimento orizzontale.
 * - `preventDefault()` viene usato durante il drag confermato.
 *
 * iOS
 * - Il gesture NON prende il controllo al pointerdown.
 * - Aspetta che il movimento sia chiaramente orizzontale.
 * - Un movimento prevalentemente verticale viene abbandonato
 *   completamente e lasciato al browser.
 * - Solo dopo aver confermato un gesto orizzontale vengono usati
 *   pointer capture e preventDefault().
 * - `touch-action: pan-y` viene applicato al contenitore.
 *
 * ARCHITETTURA:
 * - `rotation` è la source of truth per il transform.
 * - Durante il drag: inclinazione leggera (max ±25°).
 * - Al rilascio: se il drag supera la soglia → CSS transition a ±180°.
 * - Dopo la transizione, la rotazione viene normalizzata.
 */

const SWIPE_THRESHOLD = 60;
const CANCEL_DIST = 8;
const MAX_TILT = 25;
const TRANSITION_MS = 400;

// Solo iOS:
// la decisione verticale/orizzontale è volutamente sbilanciata verso lo scroll
// verticale: un flip richiede un gesto deliberatamente orizzontale, mentre ogni
// movimento con una componente verticale apprezzabile resta allo scroll di Safari.
// (Simulazione: con un dito che nei primi px "deriva" di 30px in orizzontale prima
// di salire dritto, la vecchia soglia 1.6x/14px scambiava per flip il 39% degli
// scroll; con queste soglie lo 0,3%.)
const IOS_VERTICAL_MIN_Y = 10;        // ≥10px di spostamento verticale → scroll, definitivo
const IOS_VERTICAL_RATIO = 0.6;       // Y > 0.6·X (angolo > ~31° dall'orizzontale) → scroll
const IOS_HORIZONTAL_MIN_X = 28;      // servono ≥28px orizzontali per iniziare un flip
const IOS_HORIZONTAL_MAX_SLOPE = 0.25; // e Y ≤ 0.25·X (angolo < ~14°)
const IOS_SEGMENT_RATIO = 2;          // anche l'ultimo tratto deve essere orizzontale (X ≥ 2·Y)

const getIsIOS = () => {
  if (typeof navigator === 'undefined') return false;

  return (/iPhone|iPad|iPod/i.test(webNavigator.userAgent) || (webNavigator.platform === 'MacIntel' && webNavigator.maxTouchPoints > 1));
};

export function useFlipGesture(flipped, setFlipped) {
  const [rotation, setRotation] = useState(flipped ? 180 : 0);
  const [transition, setTransition] = useState(true);

  const flippedRef = useRef(flipped);
  flippedRef.current = flipped;

  const rotationRef = useRef(rotation);
  rotationRef.current = rotation;

  const gestureSetFlip = useRef(false);
  const normalizeTimeout = useRef(null);

  const innerRef = useRef(null);

  const isIOS = getIsIOS();

  const g = useRef({
    active: false,
    startX: 0,
    startY: 0,
    pointerId: null,
    moved: false,
    direction: null,
    startFlipped: false,
    startRotation: 0,
    captured: false,
    lastDx: 0,
    lastDy: 0,
  });

  /*
   * iOS:
   * il browser deve mantenere il controllo dello scroll verticale.
   */
  useEffect(() => {
    if (!isIOS || !innerRef.current) return;

    innerRef.current.style.touchAction = 'pan-y';

    return () => {
      if (innerRef.current) {
        innerRef.current.style.touchAction = '';
      }
    };
  }, [isIOS]);

  // Applica il snap finale sia al DOM che allo stato React.
  const snapTo = useCallback((targetRotation) => {
    if (innerRef.current) {
      innerRef.current.style.transition =
        `transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`;

      innerRef.current.style.transform =
        `rotateY(${targetRotation}deg)`;
    }

    setTransition(true);
    setRotation(targetRotation);
  }, []);

  // Sync rotation quando `flipped` cambia esternamente.
  useEffect(() => {
    if (gestureSetFlip.current) {
      gestureSetFlip.current = false;
      return;
    }

    if (!g.current.active) {
      setTransition(true);
      setRotation(flipped ? 180 : 0);
    }
  }, [flipped]);

  // Safety net globale.
  useEffect(() => {
    const onGlobalUp = () => {
      if (!g.current.active) return;

      const startRotation = g.current.startRotation;
      const wasMoved = g.current.moved;

      g.current.active = false;
      g.current.moved = false;
      g.current.captured = false;
      g.current.direction = null;

      webWindow.__seminaFlipActive = false;

      // iOS: gesto mai diventato flip → nessuna scrittura sulla card.
      if (isIOS && !wasMoved) return;

      snapTo(startRotation);
    };

    webWindow.addEventListener('pointerup', onGlobalUp);
    webWindow.addEventListener('pointercancel', onGlobalUp);

    return () => {
      webWindow.removeEventListener('pointerup', onGlobalUp);
      webWindow.removeEventListener('pointercancel', onGlobalUp);
    };
  }, [isIOS, snapTo]);

  const onPointerDown = useCallback((e) => {
    if (e.pointerType !== 'touch' && e.pointerType !== 'mouse') return;

    if (normalizeTimeout.current) {
      clearTimeout(normalizeTimeout.current);
      normalizeTimeout.current = null;
    }

    g.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      pointerId: e.pointerId,
      moved: false,
      direction: null,
      startFlipped: flippedRef.current,
      startRotation: rotationRef.current,
      captured: false,
      lastDx: 0,
      lastDy: 0,
    };

    // iOS: al pointerdown NON si tocca nulla (né stato React né stile inline).
    // Modificare l'elemento toccato (transition/re-render su un layer 3D con
    // will-change) nel momento stesso del touchstart fa sì che Safari non avvii
    // lo scroll verticale partendo da quel punto (una volta partito lo scroll da
    // un punto vuoto, continua a funzionare anche sopra le card). La transition
    // viene disattivata solo quando il gesto è confermato orizzontale.
    if (!isIOS) {
      setTransition(false);

      // Disabilita immediatamente la transition durante il tilt.
      if (innerRef.current) {
        innerRef.current.style.transition = 'none';
      }
    }

    /*
     * IMPORTANTE:
     *
     * Su iOS NON impostiamo qui __seminaFlipActive.
     *
     * Il semplice pointerdown non significa ancora che l'utente
     * voglia fare un flip: potrebbe essere l'inizio di uno scroll.
     *
     * Il flag viene impostato solamente quando il movimento viene
     * confermato come orizzontale.
     */
    if (!isIOS) {
      webWindow.__seminaFlipActive = true;
    }
  }, [isIOS]);

  const onPointerMove = useCallback((e) => {
    const s = g.current;

    if (!s.active || e.pointerId !== s.pointerId) return;

    const dx = e.clientX - s.startX;

    /*
     * ============================================================
     * iOS
     * ============================================================
     *
     * Qui siamo volutamente molto conservativi.
     *
     * Prima di prendere il controllo del gesto:
     *
     * 1. aspettiamo un minimo movimento;
     * 2. controlliamo X/Y;
     * 3. se è verticale → abbandoniamo definitivamente;
     * 4. se è chiaramente orizzontale → possiamo fare il flip.
     *
     * Finché non arriviamo al punto 4:
     * - niente preventDefault()
     * - niente pointer capture
     * - niente __seminaFlipActive
     */
    if (isIOS) {
      const dy = e.clientY - s.startY;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (!s.moved && !s.direction) {
        // Ultimo tratto di movimento (rispetto all'evento precedente).
        const segX = Math.abs(dx - s.lastDx);
        const segY = Math.abs(dy - s.lastDy);
        s.lastDx = dx;
        s.lastDy = dy;

        // Movimento ancora troppo piccolo: non decidere nulla.
        if (Math.max(absX, absY) < CANCEL_DIST) {
          return;
        }

        /*
         * Qualsiasi componente verticale apprezzabile → scroll di Safari,
         * decisione definitiva per tutto il tocco.
         */
        if (
          absY >= IOS_VERTICAL_MIN_Y ||
          absY > absX * IOS_VERTICAL_RATIO
        ) {
          s.active = false;
          s.moved = false;
          s.direction = 'vertical';
          s.captured = false;

          webWindow.__seminaFlipActive = false;

          return;
        }

        /*
         * Flip solo se il gesto è deliberatamente orizzontale:
         *
         * - almeno 28px in orizzontale
         * - angolo stretto (Y ≤ 0.25·X)
         * - anche l'ULTIMO tratto di movimento è orizzontale (non solo il
         *   totale): un dito che parte con una deriva laterale e poi sale
         *   dritto non deve essere scambiato per un flip.
         */
        if (
          absX >= IOS_HORIZONTAL_MIN_X &&
          absY <= absX * IOS_HORIZONTAL_MAX_SLOPE &&
          segX >= segY * IOS_SEGMENT_RATIO
        ) {
          s.moved = true;
          s.direction = 'horizontal';

          // Solo ora il gesture diventa realmente attivo.
          webWindow.__seminaFlipActive = true;

          // Ora (e solo ora) disattiva la transition per il tilt.
          setTransition(false);
          if (innerRef.current) {
            innerRef.current.style.transition = 'none';
          }

          try {
            e.currentTarget.setPointerCapture(s.pointerId);
            s.captured = true;
          } catch {}

        } else {
          // Movimento ancora ambiguo: non prendere il controllo.
          return;
        }
      }

      /*
       * Se il gesto non è stato confermato come orizzontale,
       * non tocchiamo il browser.
       */
      if (s.direction !== 'horizontal') return;

      // Da questo punto in poi il flip ha il controllo.
      e.preventDefault();

      const tiltDeg = Math.max(
        -MAX_TILT,
        Math.min(MAX_TILT, dx * 0.3)
      );

      const newRotation =
        s.startRotation + tiltDeg;

      if (innerRef.current) {
        innerRef.current.style.transform =
          `rotateY(${newRotation}deg)`;
      }

      return;
    }

    /*
     * ============================================================
     * ANDROID / DESKTOP
     * ============================================================
     *
     * Manteniamo la logica originale.
     */
    if (!s.moved) {
      if (Math.abs(dx) < CANCEL_DIST) return;

      s.moved = true;

      try {
        e.currentTarget.setPointerCapture(s.pointerId);
        s.captured = true;
      } catch {}
    }

    // Comportamento originale.
    e.preventDefault();

    const tiltDeg = Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, dx * 0.3)
    );

    const newRotation =
      s.startRotation + tiltDeg;

    if (innerRef.current) {
      innerRef.current.style.transform =
        `rotateY(${newRotation}deg)`;
    }
  }, [isIOS]);

  const onPointerUp = useCallback((e) => {
    const s = g.current;

    if (!s.active) return;

    const startRotation = s.startRotation;
    const startFlipped = s.startFlipped;
    const wasMoved = s.moved;
    const direction = s.direction;
    const wasCaptured = s.captured;

    s.active = false;
    s.moved = false;
    s.captured = false;

    webWindow.__seminaFlipActive = false;

    if (wasCaptured) {
      try {
        e.currentTarget.releasePointerCapture(s.pointerId);
      } catch {}
    }

    /*
     * Su iOS, un gesto verticale non deve fare assolutamente nulla.
     * Il browser ha/aveva il controllo dello scroll.
     */
    if (isIOS && direction === 'vertical') {
      s.direction = null;
      return;
    }

    /*
     * Se non c'è stato un drag confermato,
     * torniamo semplicemente alla posizione iniziale.
     */
    if (!wasMoved) {
      snapTo(startRotation);
      s.direction = null;
      return;
    }

    /*
     * Drag confermato:
     * sopprimi il click sintetico successivo.
     */
    const swallow = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      innerRef.current?.removeEventListener(
        'click',
        swallow,
        true
      );
    };

    innerRef.current?.addEventListener(
      'click',
      swallow,
      true
    );

    setTimeout(() => {
      innerRef.current?.removeEventListener(
        'click',
        swallow,
        true
      );
    }, 0);

    const dx =
      (e?.clientX ?? s.startX) - s.startX;

    const willFlip =
      Math.abs(dx) >= SWIPE_THRESHOLD;

    /*
     * Drag orizzontale ma sotto soglia:
     * torna alla posizione iniziale.
     */
    if (!willFlip) {
      snapTo(startRotation);
      s.direction = null;
      return;
    }

    // Flip nella direzione del drag.
    const delta =
      dx >= 0 ? 180 : -180;

    const targetRotation =
      startRotation + delta;

    const targetFlipped =
      !startFlipped;

    snapTo(targetRotation);

    if (targetFlipped !== startFlipped) {
      gestureSetFlip.current = true;
      setFlipped(targetFlipped);
    }

    // Normalizzazione della rotazione.
    const normalizedTarget = targetFlipped
      ? (dx >= 0 ? 180 : -180)
      : 0;

    if (targetRotation !== normalizedTarget) {
      normalizeTimeout.current = setTimeout(() => {
        normalizeTimeout.current = null;

        if (g.current.active) return;

        setTransition(false);
        setRotation(normalizedTarget);

        requestAnimationFrame(() => {
          setTransition(true);
        });
      }, TRANSITION_MS);
    }

    s.direction = null;
  }, [isIOS, setFlipped, snapTo]);

  const onPointerCancel = useCallback((e) => {
    const s = g.current;

    if (!s.active) return;

    const startRotation = s.startRotation;

    s.active = false;
    s.moved = false;
    s.captured = false;
    s.direction = null;

    const wasMoved = s.moved;

    webWindow.__seminaFlipActive = false;

    try {
      e.currentTarget?.releasePointerCapture(s.pointerId);
    } catch {}

    // iOS: il pointercancel è il segnale che Safari ha preso lo scroll verticale.
    // Se il flip non era mai partito non c'è niente da ripristinare: evitiamo di
    // scrivere stato/stile sulla card mentre sta iniziando lo scroll.
    if (isIOS && !wasMoved) return;

    snapTo(startRotation);
  }, [isIOS, snapTo]);

  return {
    rotation,
    transition,
    innerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}