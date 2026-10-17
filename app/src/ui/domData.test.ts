import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitDataProps, toDataSet } from './domData.ts';

test('attributi data-* separati dalle altre prop', () => {
  const props = { className: 'x', 'data-node-id': 'c1', 'data-ui': true, 'data-off': undefined, 'data-no': false };
  const [data, rest] = splitDataProps(props);
  assert.deepEqual(data, { 'data-node-id': 'c1', 'data-ui': '' });
  assert.deepEqual(rest, { className: 'x' });
  const plain = { className: 'y' };
  assert.deepEqual(splitDataProps(plain), [null, plain]);
  assert.equal(splitDataProps(plain)[1], plain);
});

test('dataSet di react-native-web', () => {
  assert.deepEqual(toDataSet({ 'data-node-id': 'c1', 'data-ui': '' }), { nodeId: 'c1', ui: '' });
});
