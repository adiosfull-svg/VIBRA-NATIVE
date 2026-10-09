import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fontSizeOf, inheritedLineHeight, inlineLineBox, lineHeightOf, strutDescent, textClassesFor } from './textLeading.ts';

test('text-[10px] dentro text-xs eredita 16px come in CSS', () => {
  assert.equal(inheritedLineHeight('text-muted-foreground text-xs', 10), 16);
  assert.equal(textClassesFor('text-xs', 'text-[10px] font-medium'), 'text-[10px] font-medium leading-[16px]');
});

test('senza contenitore: preflight 1.5; leading senza unità si moltiplica', () => {
  assert.equal(inheritedLineHeight('', 10), 15);
  assert.equal(inheritedLineHeight('text-sm leading-tight', 12), 15);
  assert.equal(inheritedLineHeight('leading-4', 9), 16);
  assert.equal(inheritedLineHeight('text-6xl', 11), 11);
});

test('leading proprio o dimensione con nome: nulla da fissare', () => {
  assert.equal(textClassesFor('text-xs', 'text-[10px] leading-none'), 'text-[10px] leading-none');
  assert.equal(textClassesFor('text-xs', 'text-sm'), 'text-sm');
});

test('label text-sm leading-none in un blocco text-base: riga di 24px, testo 5.7px più in basso', () => {
  const box = inlineLineBox(fontSizeOf(''), lineHeightOf(''), 14, 14);
  assert.equal(box.height, 24);
  assert.ok(Math.abs(box.top - 5.73) < 0.05, String(box.top));
  assert.equal(lineHeightOf('text-xs'), 16);
  assert.equal(fontSizeOf('text-sm text-[10px]'), 10);
});

test('textarea in un blocco text-base: 6px sotto (discendente dello strut)', () => {
  assert.equal(strutDescent(16, 24), 6.19);
});
