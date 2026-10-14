import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregateByMonth, coerce, filterEntries, fromDbRow, parseSort, toDbRow } from './entityCore.ts';

test('parseSort interpreta le stringhe Base44', () => {
  assert.deepEqual(parseSort('-date'), { column: 'date', ascending: false });
  assert.deepEqual(parseSort('sort_order'), { column: 'sort_order', ascending: true });
  assert.equal(parseSort(undefined), null);
  assert.equal(parseSort(''), null);
});

test('toDbRow scarta campi sconosciuti e di sola lettura', () => {
  const row = toDbRow('Client', {
    id: 'x', name: 'Mario', promoter_id: 'p1', created_date: '2020-01-01', campo_inesistente: 1,
  });
  assert.deepEqual(row, { name: 'Mario', promoter_id: 'p1' });
  assert.equal(toDbRow('Client', { id: 'x', name: 'M', promoter_id: 'p' }, { keepId: true }).id, 'x');
});

test('coerce normalizza i valori che Postgres rifiuterebbe', () => {
  assert.equal(coerce('date', ''), null);
  assert.equal(coerce('double precision', ''), null);
  assert.equal(coerce('double precision', '12.5'), 12.5);
  assert.equal(coerce('double precision', 'abc'), null);
  assert.equal(coerce('boolean', 'true'), true);
  assert.equal(coerce('text', 42), '42');
  assert.deepEqual(coerce('jsonb', { a: 1 }), { a: 1 });
  assert.equal(coerce('text', undefined), null);
});

test('filterEntries accetta solo uguaglianze su colonne note', () => {
  assert.deepEqual(filterEntries('Client', { promoter_id: 'p1' }), [['promoter_id', 'p1']]);
  assert.throws(() => filterEntries('Client', { boh: 1 }), /sconosciuto/);
  assert.throws(() => filterEntries('Client', { cum_visits: { $gt: 3 } }), /non supportati/);
});

test('aggregateByMonth replica Event.aggregate per mese', () => {
  const out = aggregateByMonth(
    [
      { id: '1', date: '2026-01-03', total_revenue: 100 },
      { id: '2', date: '2026-01-20', total_revenue: 50 },
      { id: '3', date: '2025-12-31', total_revenue: 10 },
      { id: '4', date: null, total_revenue: 999 },
    ],
    'date',
    'total_revenue',
  );
  assert.deepEqual(out.rows, [
    { date: '2025-12', sum_total_revenue: 10, count: 1 },
    { date: '2026-01', sum_total_revenue: 150, count: 2 },
  ]);
});

test('fromDbRow: created_date/updated_date senza fuso come Base44', () => {
  const r = fromDbRow({ id: 'a', created_date: '2026-10-14T02:10:49.748735+00:00', updated_date: '2026-10-14T04:10:49+02:00', date: '2026-10-14' });
  assert.equal(r.created_date, '2026-10-14T02:10:49.748');
  assert.equal(r.updated_date, '2026-10-14T02:10:49.000');
  assert.equal(r.date, '2026-10-14');
  assert.equal(new Date(r.created_date + 'Z').toISOString(), '2026-10-14T02:10:49.748Z');
});
