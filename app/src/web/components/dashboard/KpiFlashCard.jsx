// Port di src/components/dashboard/KpiFlashCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { TrendingUp, TrendingDown } from '@/ui/icons.generated';

import { Btn, Div, P } from '@/ui/html';

// PORT: hook invece del componente <AnimatedNumber/>: il <P> riceve il testo, e ui/text vede l'importo
// ("€257.818") per tenerlo su una riga come nel browser; dentro un componente era opaco e si spezzava
function useAnimatedNumber(target, duration = 1200) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = null;
    let raf = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(ease * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCurrent(target);
    };
    // PORT: a pagina montata e animazioni finite (come AnimatedNumber)
    const idle = InteractionManager.runAfterInteractions(() => { raf = requestAnimationFrame(step); });
    // PORT: il ciclo vecchio si ferma quando cambia il valore (dati in cache, poi dalla rete): prima due cicli
    // insieme si contendevano il numero, che sfarfallava tra i due valori
    return () => { idle.cancel(); cancelAnimationFrame(raf); };
  }, [target]);
  return current;
}

export default function KpiFlashCard({ title, value, rawValue, label, icon: Icon, color = '#a78bfa', trend, delay = 0, onClick }) {
  const current = useAnimatedNumber(rawValue ?? 0);
  return (
    <Btn
      className={`dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 group transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      {/* Glow background */}
      <Div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-10 translate-x-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />

      {/* Accent line top */}
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <Div className="relative flex items-start justify-between gap-3">
        <Div className="flex-1 min-w-0">
          <P className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">{title}</P>
          <P className="text-2xl font-bold text-foreground leading-none">
            {rawValue !== undefined
              ? `${String(value).startsWith('€') ? '€' : ''}${current.toLocaleString('it-IT')}`
              : value
            }
          </P>
          {label && (
            typeof label === 'string'
              ? <P className="text-[11px] mt-2 font-medium" style={{ color: color + 'cc' }}>{label}</P>
              : <Div className="mt-2">{label}</Div>
          )}
          {trend !== undefined && (
            <Div className={`flex items-center gap-1 mt-2 text-[11px] font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend >= 0 ? '+' : ''}{trend}% vs mese scorso
            </Div>
          )}
        </Div>
        {Icon && (
          <Div className="p-2.5 rounded-xl shrink-0" style={{ background: color + '20' }}>
            {React.createElement(Icon, { className: 'w-5 h-5', style: { color } })}
          </Div>
        )}
      </Div>
    </Btn>
  );
}
