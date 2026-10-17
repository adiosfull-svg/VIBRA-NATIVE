import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classOpacity, classTransform, IDENTITY_TRANSFORM, transitionSpec, withoutClassTransform } from './cssTransitionSpec.ts';

test('transizioni dallo style CSS (vetro sticky)', () => {
  assert.deepEqual(transitionSpec('sticky-glass absolute inset-0', 'backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease, background-color 0.2s ease'), { blur: 200, backgroundColor: 200 });
  assert.equal(transitionSpec('', 'none'), null);
  assert.deepEqual(transitionSpec('', 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'), { opacity: 300 });
});

test('transizioni dalle classi Tailwind', () => {
  assert.deepEqual(transitionSpec('fixed inset-0 transition-opacity', undefined), { opacity: 150 });
  assert.deepEqual(transitionSpec('transition-all duration-300', undefined), { opacity: 300, backgroundColor: 300, blur: 300, transform: 300 });
  assert.equal(transitionSpec('hover:transition-all p-2', undefined), null);
  assert.equal(transitionSpec('p-2', undefined), null);
});

test('opacità delle classi', () => {
  assert.equal(classOpacity('opacity-0 scale-95'), 0);
  assert.equal(classOpacity('x opacity-100'), 1);
  assert.equal(classOpacity('hover:opacity-50'), undefined);
});

test('transizioni delle trasformazioni', () => {
  assert.deepEqual(transitionSpec('w-4 transition-transform duration-200 rotate-180', undefined), { transform: 200 });
  assert.deepEqual(transitionSpec('transition', undefined), { opacity: 150, backgroundColor: 150, blur: 150, transform: 150 });
  assert.deepEqual(transitionSpec('relative transition-[transform,opacity] duration-200 opacity-0', undefined), { opacity: 200, transform: 200 });
});

test('trasformazioni delle classi', () => {
  assert.equal(classTransform('w-4 h-4'), IDENTITY_TRANSFORM);
  assert.deepEqual(classTransform('opacity-0 scale-95'), { ...IDENTITY_TRANSFORM, scale: 0.95 });
  assert.deepEqual(classTransform('rotate-180'), { ...IDENTITY_TRANSFORM, rotate: 180 });
  assert.deepEqual(classTransform('-rotate-90 scale-[1.02]'), { ...IDENTITY_TRANSFORM, rotate: -90, scale: 1.02 });
  assert.deepEqual(classTransform('transform translate-x-4'), { ...IDENTITY_TRANSFORM, translateX: 16 });
  assert.deepEqual(classTransform('translate-x-0.5 -translate-y-px'), { ...IDENTITY_TRANSFORM, translateX: 2, translateY: -1 });
  assert.deepEqual(classTransform('scale-[0.96]'), { ...IDENTITY_TRANSFORM, scale: 0.96 });
  assert.equal(classTransform('-translate-y-1/2'), null);
  assert.equal(classTransform('translate-x-full'), null);
  assert.equal(classTransform('hover:scale-105'), IDENTITY_TRANSFORM);
  assert.equal(withoutClassTransform('w-4 rotate-180 transition-transform'), 'w-4 transition-transform');
});
