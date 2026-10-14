// Port di src/components/promoter/PromoterChartLegend.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Btn, Div, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

/**
 * Legenda custom per i grafici di confronto: schema a griglia con foto profilo
 * (o iniziale colorata), pensato per restare leggibile anche su mobile.
 * Se viene passata `onToggle`, ogni chip diventa un bottone cliccabile che
 * include/esclude il promoter dal grafico (come le chip in cima alla pagina).
 */
export default function PromoterChartLegend({ payload, promoters = [], colors, onToggle, selectedIds }) {
  const interactive = typeof onToggle === 'function';

  const items = payload && payload.length
    ? payload.map((entry) => {
        const name = entry.value?.replace('_t', '');
        const promoter = promoters.find((p) => p.name === name);
        return { name, color: entry.color, promoter };
      })
    : promoters.map((p, i) => ({ name: p.name, color: colors?.[i], promoter: p }));

  if (!items.length) return null;

  const isSelected = (item) => !interactive || !item.promoter || (selectedIds == null || selectedIds.includes(item.promoter.id));

  const Chip = ({ item, children }) => {
    const selected = isSelected(item);
    if (!interactive) {
      return <Div className="flex items-center gap-1.5 min-w-0">{children}</Div>;
    }
    return (
      <Btn
        button
        onClick={(e) => item.promoter && onToggle(item.promoter.id, e)}
        className={`flex items-center gap-1.5 min-w-0 rounded-full pl-1 pr-2 py-0.5 border transition-all duration-200 ${
          selected ? 'bg-white/[0.04] border-white/10' : 'bg-transparent border-white/[0.04] opacity-40 hover:opacity-70'
        }`}
        style={selected ? { boxShadow: `0 0 0 1px ${item.color}33` } : undefined}>
        {children}
      </Btn>
    );
  };

  return (
    <Div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 sm:gap-x-16 gap-y-2 mt-2 px-1 mx-auto w-fit max-w-full">
      {items.map((item, i) => {
        const selected = isSelected(item);
        return (
          <Chip key={i} item={item}>
            {item.promoter?.photo_url ? (
              <Img
                src={item.promoter.photo_url}
                alt=""
                className="w-5 h-5 rounded-full object-cover shrink-0 border"
                style={{ borderColor: item.color, opacity: selected ? 1 : 0.5 }}
              />
            ) : (
              <Span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: item.color, opacity: selected ? 1 : 0.5 }}
              >
                {item.name?.charAt(0).toUpperCase()}
              </Span>
            )}
            <Span className="text-xs truncate" style={{ color: item.color }}>{item.name}</Span>
          </Chip>
        );
      })}
    </Div>
  );
}