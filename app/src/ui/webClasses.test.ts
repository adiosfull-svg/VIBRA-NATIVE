import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeClasses, spacingPx } from './webClasses.ts';
import { themeColor } from './colors.ts';

test('flex del web va in riga', () => {
  assert.equal(normalizeClasses('flex items-center gap-2').box, 'flex items-center gap-2 flex-row');
  assert.equal(normalizeClasses('inline-flex items-center').box, 'flex items-center flex-row');
  assert.equal(normalizeClasses('flex flex-col gap-2').box, 'flex flex-col gap-2');
  assert.equal(normalizeClasses('flex sm:flex-col').box, 'flex sm:flex-col flex-row');
});

test('space-* diventa gap', () => {
  assert.equal(normalizeClasses('space-y-2').box, 'gap-y-2');
  assert.equal(normalizeClasses('sm:space-y-4').box, 'sm:gap-y-4');
});

test('griglia: colonne e gap, varianti responsive scartate', () => {
  const n = normalizeClasses('grid grid-cols-4 gap-1 pl-12 sm:grid-cols-2');
  assert.deepEqual(n.grid, { cols: 4, gapX: 4, gapY: 4 });
  assert.equal(n.box, 'pl-12 flex-row flex-wrap');
  assert.deepEqual(normalizeClasses('grid grid-cols-2 gap-x-3 gap-y-2').grid, { cols: 2, gapX: 12, gapY: 8 });
});

test('gradienti con colori risolti', () => {
  const n = normalizeClasses('rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/15');
  assert.equal(n.box, 'rounded-full');
  assert.deepEqual(n.gradient, { dir: 'br', colors: ['#8b5cf64d', '#d946ef26'] });
});

test('ring diventa bordo', () => {
  assert.equal(normalizeClasses('ring-1 ring-violet-400/40').box, 'border border-violet-400/40');
});

test('line-clamp e classi web senza equivalente', () => {
  const n = normalizeClasses('line-clamp-2 inline-block fixed inset-0');
  assert.equal(n.lineClamp, 2);
  assert.equal(n.box, 'absolute inset-0');
});

test('spacing e colori', () => {
  assert.equal(spacingPx('1.5'), 6);
  assert.equal(spacingPx('[12px]'), 12);
  assert.equal(themeColor('primary/20'), '#561a8e33');
  assert.equal(themeColor('card'), '#131316');
  assert.equal(themeColor('white/10'), '#ffffff1a');
});

test('grid-cols-[1fr_auto]: colonne miste', () => {
  const n = normalizeClasses('grid grid-cols-[1fr_auto] gap-2 px-3');
  assert.deepEqual(n.grid, { cols: 2, gapX: 8, gapY: 8, template: [{ fr: 1 }, { auto: true }] });
  assert.ok(!/flex-wrap/.test(n.box));
  assert.equal(normalizeClasses('grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))]').grid?.template, undefined);
});
