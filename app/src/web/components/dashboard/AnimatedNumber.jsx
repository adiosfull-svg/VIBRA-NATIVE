// Port di src/components/dashboard/AnimatedNumber.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect, useState } from 'react';

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
      setCurrent(ease * target);
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setCurrent(target);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target]);
  const formatted = decimals > 0
    ? current.toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(current).toLocaleString('it-IT');
  return <Span>{prefix}{formatted}{suffix}</Span>;
}
