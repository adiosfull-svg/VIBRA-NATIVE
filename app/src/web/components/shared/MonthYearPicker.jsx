// Port di src/components/shared/MonthYearPicker.jsx (convertito da scripts/port/codemod.mjs).
/**
 * MonthYearPicker — replaces native <select> for month/year combos.
 * Uses shadcn Select (Radix) which works perfectly on both desktop and mobile.
 */
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';

const MONTH_LABELS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const YEARS = Array.from({ length: 8 }, (_, i) => 2023 + i);

export function MonthSelect({ value, onChange, className = '' }) {
  return (
    <Select value={String(value)} onValueChange={v => onChange(Number(v))}>
      <SelectTrigger className={`h-8 sm:h-11 text-xs sm:text-sm w-[64px] sm:w-[80px] bg-secondary border-border ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MONTH_LABELS.map((m, i) => (
          <SelectItem key={i} value={String(i)} className="text-sm py-3">{m}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function YearSelect({ value, onChange, className = '' }) {
  return (
    <Select value={String(value)} onValueChange={v => onChange(Number(v))}>
      <SelectTrigger className={`h-8 sm:h-11 text-xs sm:text-sm w-[68px] sm:w-[88px] bg-secondary border-border ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {YEARS.map(y => (
          <SelectItem key={y} value={String(y)} className="text-sm py-3">{y}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}