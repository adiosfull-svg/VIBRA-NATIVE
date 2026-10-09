// Port di src/components/shared/DeferredChart.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - window.requestIdleCallback
//  - window.cancelIdleCallback
import React, { useEffect, useRef, useState } from 'react';

import { Div } from '@/ui/html';

/**
 * Wrapper che ritarda il render dei figli (tipicamente ResponsiveContainer di
 * Recharts) fino a quando il browser è idle (requestIdleCallback). Questo evita
 * che il layout/paint costoso dei grafici saturi il main thread durante le
 * animazioni di entrata delle pagine (framer-motion), causando stutter.
 *
 * Accetta className e/o style per il sizing (come un div normale).
 * Mostra uno skeleton trasparente con la stessa altezza finché non è pronto.
 */
export default function DeferredChart({ children, className = '', style, ...props }) {
  const [ready, setReady] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 50));
    rafRef.current = ric(() => setReady(true), { timeout: 300 });
    return () => {
      if (window.cancelIdleCallback && rafRef.current) {
        window.cancelIdleCallback(rafRef.current);
      }
    };
  }, []);

  return (
    <Div className={className} style={style} {...props}>
      {ready ? children : null}
    </Div>
  );
}