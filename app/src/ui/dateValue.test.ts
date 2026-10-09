import assert from 'node:assert/strict';
import { test } from 'node:test';
import { displayValue, formatInputValue, parseInputValue } from './dateValue.ts';

test('date: andata e ritorno nel formato del browser', () => {
  const d = parseInputValue('date', '2026-02-28')!;
  assert.equal(d.getDate(), 28);
  assert.equal(formatInputValue('date', d), '2026-02-28');
});

test('datetime-local e time', () => {
  const d = parseInputValue('datetime-local', '2026-10-09T21:05')!;
  assert.equal(formatInputValue('datetime-local', d), '2026-10-09T21:05');
  assert.equal(formatInputValue('time', parseInputValue('time', '07:30')!), '07:30');
});

test('valori vuoti o non validi', () => {
  assert.equal(parseInputValue('date', ''), null);
  assert.equal(parseInputValue('date', 'abc'), null);
  assert.deepEqual(displayValue('date', ''), { text: 'gg/mm/aaaa', empty: true });
  assert.deepEqual(displayValue('time', null), { text: '--:--', empty: true });
});

test('testo mostrato come Chrome in italiano', () => {
  assert.equal(displayValue('date', '2026-03-05').text, '05/03/2026');
  assert.equal(displayValue('datetime-local', '2026-03-05T09:07').text, '05/03/2026, 09:07');
});
