import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stripSpacedMargins } from './spaceMargins.ts';

test('space-y annulla mt/mb/my dei figli (anche con varianti e negativi)', () => {
  assert.equal(stripSpacedMargins('text-xs text-primary hover:underline mt-1', { y: 16 }), 'text-xs text-primary hover:underline');
  assert.equal(stripSpacedMargins('mt-2 rounded-lg sm:mb-4 -mt-1 my-[3px] ml-2', { y: 16 }), 'rounded-lg ml-2');
});

test('m-N resta solo sull\'asse non gestito da space-*', () => {
  assert.equal(stripSpacedMargins('m-2 p-1', { y: 8 }), 'mx-2 p-1');
  assert.equal(stripSpacedMargins('sm:-m-1', { x: 8 }), 'sm:-my-1');
  assert.equal(stripSpacedMargins('m-2 mt-1 ml-1', { x: 4, y: 4 }), '');
});

test('space-x tocca solo ml/mr/mx; niente margini: stessa stringa', () => {
  assert.equal(stripSpacedMargins('ml-auto mt-1 mr-2', { x: 8 }), 'mt-1');
  const cls = 'flex items-center gap-2 mx-auto';
  assert.equal(stripSpacedMargins(cls, { y: 8 }), cls);
});
