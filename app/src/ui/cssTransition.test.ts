import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classOpacity, transitionSpec } from './cssTransitionSpec.ts';

test('transizioni dallo style CSS (vetro sticky)', () => {
  assert.deepEqual(transitionSpec('sticky-glass absolute inset-0', 'backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease, background-color 0.2s ease'), { blur: 200, backgroundColor: 200 });
  assert.equal(transitionSpec('', 'none'), null);
  assert.deepEqual(transitionSpec('', 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'), { opacity: 300 });
});

test('transizioni dalle classi Tailwind', () => {
  assert.deepEqual(transitionSpec('relative transition-[transform,opacity] duration-200 opacity-0', undefined), { opacity: 200 });
  assert.deepEqual(transitionSpec('fixed inset-0 transition-opacity', undefined), { opacity: 150 });
  assert.deepEqual(transitionSpec('transition-all duration-300', undefined), { opacity: 300, backgroundColor: 300, blur: 300 });
  assert.equal(transitionSpec('hover:transition-all p-2', undefined), null);
  assert.equal(transitionSpec('p-2', undefined), null);
});

test('opacità delle classi', () => {
  assert.equal(classOpacity('opacity-0 scale-95'), 0);
  assert.equal(classOpacity('x opacity-100'), 1);
  assert.equal(classOpacity('hover:opacity-50'), undefined);
});
