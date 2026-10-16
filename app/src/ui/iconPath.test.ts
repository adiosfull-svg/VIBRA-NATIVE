import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinedD, opaque, shapeToD } from './iconPath.ts';

test('forme lucide → sottotracciati', () => {
  assert.equal(shapeToD('line', { x1: '12', x2: '12.01', y1: '16', y2: '16' }), 'M12 16L12.01 16');
  assert.equal(shapeToD('circle', { cx: '12', cy: '12', r: '10' }), 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z');
  assert.equal(shapeToD('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }),
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2Z');
  assert.equal(shapeToD('rect', { x: '1', y: '1', width: '4', height: '2' }), 'M1 1h4v2h-4Z');
  assert.equal(shapeToD('polyline', { points: '22 12 18 12 15 21' }), 'M22 12L18 12L15 21');
  assert.equal(shapeToD('polygon', { points: '1,2 3,4 5,6' }), 'M1 2L3 4L5 6Z');
  assert.equal(combinedD([['path', { d: 'M1 1' }], ['line', { x1: '0', y1: '0', x2: '1', y2: '1' }]]), 'M1 1M0 0L1 1');
  assert.equal(combinedD([['path', { d: 'M1 1' }], ['foo', {}]]), null);
  // Search: cerchio + "m21 21-4.3-4.3" (relativa all'origine, non alla fine del cerchio)
  assert.equal(shapeToD('path', { d: 'm21 21-4.3-4.3' }), 'M0 0m21 21-4.3-4.3');
});

test('colore pieno', () => {
  assert.ok(opaque('#ffffff'));
  assert.ok(opaque('#fffffffF'));
  assert.ok(!opaque('#ffffff80'));
  assert.ok(!opaque('currentColor'));
  assert.ok(!opaque('rgba(1,2,3,0.5)'));
  assert.ok(opaque('rgba(1,2,3,1)'));
});
