// Port di src/components/dashboard/AnimatedNumber.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

import { Span } from '@/ui/html';

export default function AnimatedNumber({ target, prefix = '', suffix = '', duration = 1200, decimals = 0 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let rafId;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      // PORT: valore arrotondato a quello che si vede (con lo stesso numero React non ridisegna): prima un
      // ridisegno a ogni frame per 1,2 s anche quando la cifra mostrata non cambiava
      const f = 10 ** decimals;
      setCurrent(decimals > 0 ? Math.round(ease * target * f) / f : Math.floor(ease * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setCurrent(target);
    };
    // PORT: il conteggio parte a pagina montata e animazioni finite (prima si contendeva il thread JS con
    // il montaggio della Dashboard, che è quando si vede di più)
    const idle = InteractionManager.runAfterInteractions(() => { rafId = requestAnimationFrame(step); });
    return () => { idle.cancel(); cancelAnimationFrame(rafId); };
  }, [target]);
  const formatted = decimals > 0
    ? current.toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(current).toLocaleString('it-IT');
  return <Span>{prefix}{formatted}{suffix}</Span>;
}
