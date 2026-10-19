import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cssOrder } from './cssOrder.ts';

test('cssOrder: la classe che in CSS vince va dopo quella che batte', () => {
  assert.equal(cssOrder('ml-auto text-muted-foreground bg-destructive/10 text-destructive px-2'), 'ml-auto bg-destructive/10 text-destructive text-muted-foreground px-2');
  assert.equal(cssOrder('fixed pt-8 p-4 overflow-y-auto'), 'fixed p-4 pt-8 overflow-y-auto');
  // già nell'ordine giusto o senza conflitto: invariato
  assert.equal(cssOrder('p-4 pt-8'), 'p-4 pt-8');
  assert.equal(cssOrder('text-muted-foreground px-2'), 'text-muted-foreground px-2');
  assert.equal(cssOrder('border-transparent border'), 'border-transparent border');
});
