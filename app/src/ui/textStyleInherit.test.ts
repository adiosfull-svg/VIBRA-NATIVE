import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextTextStyle, pickTextStyle, weightClass, withoutClassOverrides } from './textStyleInherit.ts';

test('<p style={{ color }}><span>: il colore passa ai figli', () => {
  assert.deepEqual(nextTextStyle({}, 'text-xl font-black', { color: '#f00', marginTop: 4 }), { color: '#f00' });
});

test('le classi proprie vincono sullo style ereditato', () => {
  assert.deepEqual(withoutClassOverrides({ color: '#f00', fontSize: 20 }, 'text-blue-400'), { fontSize: 20 });
  assert.deepEqual(withoutClassOverrides({ color: '#f00', fontSize: 20 }, 'text-sm hover:text-primary'), { color: '#f00' });
  assert.deepEqual(withoutClassOverrides({ textAlign: 'center' }, 'text-right'), {});
  assert.deepEqual(pickTextStyle({ color: 'red', width: 3 }), { color: 'red' });
  assert.equal(weightClass(700), 'font-bold');
});
