import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDataState } from './dataState.ts';

test('data-[state=active]: vale solo sulla tab attiva', () => {
  const cls = 'px-3 text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=inactive]:opacity-50';
  assert.equal(resolveDataState(cls, true), 'px-3 text-muted-foreground bg-card text-foreground');
  assert.equal(resolveDataState(cls, false), 'px-3 text-muted-foreground opacity-50');
  assert.equal(resolveDataState('px-3', true), 'px-3');
  assert.equal(resolveDataState(undefined, true), undefined);
});
