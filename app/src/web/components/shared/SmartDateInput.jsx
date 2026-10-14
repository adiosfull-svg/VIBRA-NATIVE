// Port di src/components/shared/SmartDateInput.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/ui/input';

/**
 * Input data "smart" con auto-formattazione GG/MM/AAAA.
 *
 * - "9/11/24"  → "09/11/2024" (zero iniziale auto, anno a 2 cifre → 4 cifre al blur)
 * - "91124"    → "09/11/2024" (senza separatori)
 * - primo digit "alto" (giorno ≥4, mese ≥2) → cifra singola, zero prepended subito
 * - dopo il giorno e dopo il mese completa, lo slash successivo compare in automatico
 * - overflow gestito: cifre oltre il mese finiscono nell'anno (es. "9/1124" → "09/11/2024")
 * - anno 2 cifre: 00-49 → 20xx, 50-99 → 19xx (espansione solo al blur)
 *
 * Emette verso il parent il valore ISO yyyy-mm-dd non appena la data è completa e valida.
 * Mentre il campo ha il focus, il display NON viene mai sovrascritto dal parent
 * (anche se il parent salva '' per una data ancora incompleta): si sincronizza
 * solo quando il campo perde il focus, evitando il reset a metà digitazione.
 */

function smartFormat(str, expandYear = false) {
  if (!str) return '';
  let day = '', month = '', year = '';
  let slot = 0; // 0=giorno, 1=mese, 2=anno
  let daySep = false, monthSep = false;

  for (const ch of str) {
    if (ch === '/' || ch === '-' || ch === '.' || ch === ' ') {
      if (slot === 0 && day) { slot = 1; daySep = true; }
      else if (slot === 1 && month) { slot = 2; monthSep = true; }
      continue;
    }
    if (ch < '0' || ch > '9') continue;

    if (slot === 0) {
      if (day.length === 0 && ch >= '4') { day = '0' + ch; slot = 1; }
      else if (day.length < 2) { day += ch; if (day.length === 2) slot = 1; }
      else {
        slot = 1;
        if (month.length === 0 && ch >= '2') { month = '0' + ch; slot = 2; }
        else if (month.length < 2) { month += ch; if (month.length === 2) slot = 2; }
        else { slot = 2; year += ch; }
      }
    } else if (slot === 1) {
      if (month.length === 0 && ch >= '2') { month = '0' + ch; slot = 2; }
      else if (month.length < 2) { month += ch; if (month.length === 2) slot = 2; }
      else { slot = 2; year += ch; }
    } else {
      if (year.length < 4) year += ch;
    }
  }

  // Pad giorno/mese a una cifra se "chiusi" da un separatore
  if (slot > 0 && day.length === 1) day = '0' + day;
  if (slot > 1 && month.length === 1) month = '0' + month;
  // Espandi anno a 2 cifre → 4 cifre solo al blur: durante la digitazione
  // "20" diventerebbe subito "2020" impedendo di scrivere "2026".
  if (expandYear && year.length === 2) {
    const n = parseInt(year, 10);
    year = n >= 50 ? '19' + year : '20' + year;
  }

  let out = day;
  if (daySep || month.length > 0) out += '/' + month;
  if (monthSep || year.length > 0) out += '/' + year;
  // Slash finale dopo il mese completo (senza separatore e senza anno) per prompt anno
  if (!monthSep && year.length === 0 && month.length === 2) out += '/';
  return out;
}

function parseToDate(display) {
  if (!display) return null;
  const parts = display.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  if (d.length !== 2 || m.length !== 2 || y.length !== 4) return null;
  const dn = parseInt(d, 10), mn = parseInt(m, 10), yn = parseInt(y, 10);
  if (isNaN(dn) || isNaN(mn) || isNaN(yn)) return null;
  if (mn < 1 || mn > 12 || dn < 1 || dn > 31) return null;
  return `${y}-${m}-${d}`;
}

export default function SmartDateInput({ value, onChange, required, focusKey, placeholder = 'GG/MM/AAAA' }) {
  const [display, setDisplay] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Sincronizza dal parent SOLO quando il campo non ha il focus: mentre l'utente
  // digita, il parent potrebbe salvare '' (data incompleta) e sovrascrivere il
  // display cancellando quanto scritto. Con il focus attivo ignoriamo il parent.
  useEffect(() => {
    if (focused) return;
    if (!value) { setDisplay(''); return; }
    const [y, m, d] = value.split('-');
    setDisplay(`${d}/${m}/${y}`);
  }, [value, focused]);

  useEffect(() => {
    if (focusKey !== undefined) inputRef.current?.focus();
  }, [focusKey]);

  const handleChange = (e) => {
    const val = e.target.value;
    let formatted = smartFormat(val);

    // Backspace "trappola": se la cancellazione viene annullata dal riformattatore
    // (slash finale re-inserito), togli l'ultima cifra reale e riformatta.
    if (val.length < display.length && display.length > 0 && formatted === display) {
      const digits = val.replace(/[^\d]/g, '');
      formatted = digits.length > 0 ? smartFormat(digits.slice(0, -1)) : '';
    }

    setDisplay(formatted);
    onChange(parseToDate(formatted) || '');
  };

  const handleBlur = () => {
    const expanded = smartFormat(display, true);
    setDisplay(expanded);
    onChange(parseToDate(expanded) || '');
    setFocused(false);
  };

  return (
    <Input
      ref={inputRef}
      value={display}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      placeholder={placeholder}
      required={required}
      maxLength={10}
      inputMode="numeric"
    />
  );
}