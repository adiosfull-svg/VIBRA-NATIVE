// Il confronto e la formattazione in JS puro (lib/fastIntl) devono dare gli stessi risultati di ICU.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fastItNumber, fastLocaleCompare } from './fastIntl.ts';

const sign = (n: number) => (n < 0 ? -1 : n > 0 ? 1 : 0);

const WORDS = [
  'Marco', 'marco', 'MARCO', 'Márco', 'Mario', 'Ammare Frontemare', 'Ammare', 'ammare frontemare', 'Arenile', 'Duel Club',
  'Èrcolano', 'Ercolano', 'ercolano', 'Città', 'Citta', 'citta', 'Zoe', 'Zoë', 'Ñapoli', 'Napoli', 'napoli centro',
  'Napoli Centro', 'Napoli-Centro', 'Napoli_Centro', "D'Amico", 'Damico', 'D Amico', 'de luca', 'De Luca', 'DeLuca',
  'Sofia Esposito', 'Sofia  Esposito', 'sofia esposito', 'Semina 2', 'Semina 10', 'Semina 1', 'Semina 02', '2026-10-11',
  '2026-09-30', '2026-10-01T10:00:00Z', '2025-12-31', '', ' ', 'a', 'A', 'b', 'B', 'à', 'À', 'á', 'z', '1', '10', '9', 'x1', 'x10',
  'Hi.Club Brass', 'Hi Club', 'Mantra', 'Toma', 'Extra - Festivi', 'Superstar Pineta', 'Nemesi Club Type', 'Sant’Anastasia',
  'San Giorgio a Cremano', 'San Giuseppe Vesuviano', 'Pozzuoli', 'Posillipo', 'Pianura', 'Piscinola', 'Ischia', 'Ischia Porto',
];

test('localeCompare: stesso ordine di ICU (it)', () => {
  for (const a of WORDS) for (const b of WORDS) {
    assert.equal(sign(fastLocaleCompare(a, b)), sign(a.localeCompare(b, 'it')), `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  }
});

test('localeCompare: opzioni numeric e sensitivity base', () => {
  for (const a of WORDS) for (const b of WORDS) {
    assert.equal(sign(fastLocaleCompare(a, b, { numeric: true })), sign(a.localeCompare(b, 'it', { numeric: true })), `numeric ${a} vs ${b}`);
    assert.equal(sign(fastLocaleCompare(a, b, { sensitivity: 'base' })), sign(a.localeCompare(b, 'it', { sensitivity: 'base' })), `base ${a} vs ${b}`);
  }
});

test('localeCompare: ordinamento di nomi casuali come ICU', () => {
  const letters = 'aAbBcCeEèéìòùàÀÈoOsSzZ .-\'0123456789';
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const list = Array.from({ length: 600 }, () => Array.from({ length: 1 + Math.floor(rnd() * 8) }, () => letters[Math.floor(rnd() * letters.length)]).join(''));
  const icu = [...list].sort((x, y) => x.localeCompare(y, 'it'));
  const fast = [...list].sort((x, y) => fastLocaleCompare(x, y));
  // stesse posizioni a meno di stringhe che ICU considera uguali
  for (let i = 0; i < icu.length; i++) assert.equal(icu[i].localeCompare(fast[i], 'it'), 0, `posizione ${i}: ${icu[i]} / ${fast[i]}`);
});

// Chrome (il browser dell'app originale) raggruppa anche le migliaia di 4 cifre (6.182); l'ICU di Node segue la
// regola CLDR più recente (minimumGroupingDigits 2: 6182). Il riferimento è Chrome.
const chrome = (s: string) => s.replace(/^(-?)(\d)(\d{3})(?=,|$)/, '$1$2.$3');

test('toLocaleString it-IT: stesso testo di Intl in Chrome', () => {
  const values = [0, -0, 1, -1, 5, 12, 999, 1000, 1234, 12345, 123456, 1234567, 1234567.891, 0.5, 0.125, 1.005, 2.675, -1234.5, 1e15, 0.0004, -0.0004, 99.9999, 5144, 315.333333];
  for (const v of values) {
    assert.equal(fastItNumber(v), chrome(v.toLocaleString('it-IT')), `${v}`);
    assert.equal(fastItNumber(v, 2, 2), chrome(v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })), `${v} 2/2`);
    assert.equal(fastItNumber(v, 0, 2), chrome(v.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })), `${v} 0/2`);
    assert.equal(fastItNumber(v, 1, 1), chrome(v.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })), `${v} 1/1`);
  }
  let seed = 3;
  for (let i = 0; i < 3000; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const v = ((seed / 2147483648) - 0.3) * 10 ** (i % 9);
    assert.equal(fastItNumber(v), chrome(v.toLocaleString('it-IT')), `${v}`);
  }
});
