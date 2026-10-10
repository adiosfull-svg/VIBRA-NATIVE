import assert from 'node:assert/strict';
import { test } from 'node:test';
import { focusStyle } from './focusStyle.ts';

test('ring e outline-none dei campi shadcn', () => {
  assert.deepEqual(focusStyle('h-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'),
    { outlineStyle: 'none', boxShadow: '0px 0px 0px 1px #561a8e' });
  assert.deepEqual(focusStyle('focus:ring-2'), { boxShadow: '0px 0px 0px 2px rgba(59,130,246,0.5)' });
});

test('offset, bordo, nessuna classe di fuoco', () => {
  assert.equal(focusStyle('focus:ring-2 focus:ring-offset-2 focus:ring-primary')!.boxShadow, '0px 0px 0px 2px #ffffff, 0px 0px 0px 4px #561a8e');
  assert.equal(focusStyle('focus:border-primary/50')!.borderColor, '#561a8e80');
  assert.equal(focusStyle('border-input px-3'), null);
});
