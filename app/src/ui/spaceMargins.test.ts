import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collapseFirstMargin, stripSpacedMargins } from './spaceMargins.ts';

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

test('primo figlio con mb in un blocco space-y: i margini collassano', () => {
  assert.deepEqual(collapseFirstMargin('grid text-[10px] px-3 mb-1', 8), { className: 'grid text-[10px] px-3' });
  assert.deepEqual(collapseFirstMargin('mb-6 p-2', 8), { className: 'p-2', marginBottom: 16 });
  assert.deepEqual(collapseFirstMargin('my-2', 4), { className: 'mt-2', marginBottom: 4 });
  assert.equal(collapseFirstMargin('sm:mb-2 p-1', 8), null);
});
