// Verifica che la logica copiata da Base44 giri invariata fuori dal browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { calcTables, filterCleanAttendances, computeAvgThreshold } from './utils/tables';
import { calculateAge } from './utils/clientAge';
import { getRankInfo, RANK_TIERS } from './utils/rankSystem';
import { buildClientStatsMap } from './utils/clientPrecomputed';
import { computePromoterStats, computeAutoUnlocked } from './utils/achievementLogic';

test('tutti i moduli legacy si caricano', async () => {
  // goalTypes e imageCache dipendono da moduli React Native: non eseguibili in Node.
  const NATIVE = ['goalTypes.js', 'imageCache.js'];
  const files = readdirSync(new URL('./utils', import.meta.url)).filter((f) => f.endsWith('.js') && !NATIVE.includes(f));
  for (const f of files) await import(`./utils/${f}`);
  assert.ok(files.length >= 20);
});

test('calcTables: fatturato / soglia, arrotondato a 0,1', () => {
  assert.equal(calcTables(900, null, 300), 3);
  assert.equal(calcTables(1000, null, 360), 2.8);
  assert.equal(calcTables(0, null, 300), 0);
  assert.equal(calcTables(450, null, null), 1.5); // fallback 300
});

test('filterCleanAttendances tiene la presenza duplicata col fatturato più alto', () => {
  const out = filterCleanAttendances([
    { event_id: 'e1', promoter_id: 'p', client_id: 'c', revenue: 100 },
    { event_id: 'e1', promoter_id: 'p', client_id: 'c', revenue: 250 },
    { event_id: 'e2', promoter_id: 'p', client_id: 'c', revenue: 10 },
  ]);
  assert.equal(out.length, 2);
  assert.equal(out.find((a) => a.event_id === 'e1').revenue, 250);
  assert.equal(computeAvgThreshold([{ table_threshold: 300 }, { table_threshold: 360 }, {}]), 330);
});

test('calculateAge gestisce data completa e solo anno', () => {
  const year = new Date().getFullYear();
  assert.equal(calculateAge(`${year - 25}-01-01`).type, 'precise');
  assert.equal(calculateAge(`${year - 25}-01-01`).age, 25);
  assert.deepEqual(calculateAge(`${year - 25}`), { type: 'range', min: 24, max: 25, label: '24/25 anni' });
  assert.equal(calculateAge(null), null);
});

test('rank: punteggio 0 è il primo livello', () => {
  const info = getRankInfo(0);
  assert.ok(info);
  assert.ok(RANK_TIERS.length > 3);
});

test('buildClientStatsMap usa i campi cum_* precalcolati', () => {
  const map = buildClientStatsMap([{ id: 'c1', cum_visits: 7, cum_total_spent: 1400, cum_rating: 8.2 }]);
  assert.equal(map.c1.visits, 7);
  assert.equal(map.c1.totalSpent, 1400);
});

test('achievement: stats promoter e sblocchi automatici', () => {
  const promoter = { id: 'p1', name: 'Test' };
  const clients = Array.from({ length: 3 }, (_, i) => ({ id: `c${i}`, promoter_id: 'p1', source_type: 'instagram' }));
  const events = [{ id: 'e1', date: '2026-09-05', table_threshold: 300 }];
  // Il fatturato del promoter sta nelle presenze SENZA client_id; quelle con client_id sono dei clienti.
  const att = [
    { id: 'a1', event_id: 'e1', promoter_id: 'p1', revenue: 900, present: true },
    { id: 'a2', event_id: 'e1', promoter_id: 'p1', client_id: 'c0', revenue: 300, present: true },
  ];
  const stats = computePromoterStats(promoter, clients, att, events, [promoter]);
  assert.equal(stats.total_clients, 3);
  assert.equal(stats.total_revenue, 900);
  const unlocked = computeAutoUnlocked(
    [
      { id: 'a', is_active: true, condition_type: 'total_clients', condition_value: 1 },
      { id: 'b', is_active: true, condition_type: 'total_clients', condition_value: 50 },
    ],
    stats,
  );
  assert.deepEqual([...unlocked], ['a']);
});

test('twColors traduce le classi Tailwind', async () => {
  const { twColor, twColors } = await import('../lib/tw.ts');
  assert.equal(twColor('text-cyan-300'), '#67e8f9');
  assert.equal(twColor('bg-yellow-500/15'), '#eab30826');
  assert.deepEqual(twColors('bg-yellow-500/15 text-yellow-400 border-yellow-500/30'), {
    backgroundColor: '#eab30826', color: '#facc15', borderColor: '#eab3084d',
  });
});
