// Logica pura dell'adapter entità (nessuna dipendenza da React Native),
// testabile con `node --test`.
import { SCHEMA, type ColumnType, type EntityName } from './schema.generated.ts';

export type Row = Record<string, unknown> & { id: string };
export type Query = Record<string, unknown>;

/** '-date' -> { column: 'date', ascending: false }, come le stringhe di sort Base44. */
export function parseSort(sort?: string | null): { column: string; ascending: boolean } | null {
  if (!sort) return null;
  const desc = sort.startsWith('-');
  const column = desc ? sort.slice(1) : sort.replace(/^\+/, '');
  return column ? { column, ascending: !desc } : null;
}

export function columnsOf(entity: EntityName): Record<string, ColumnType> {
  return SCHEMA[entity].columns as Record<string, ColumnType>;
}

const READONLY = new Set(['created_date', 'updated_date', 'created_by_id', 'created_by']);

/**
 * Prepara un oggetto per la scrittura: scarta i campi che non esistono nella tabella
 * (Base44 li accettava silenziosamente) e normalizza i valori che Postgres rifiuterebbe,
 * come stringhe vuote in colonne data/numero.
 */
export function toDbRow(entity: EntityName, data: Record<string, unknown>, { keepId = false } = {}) {
  const cols = columnsOf(entity);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const type = cols[key];
    if (!type || READONLY.has(key) || (key === 'id' && !keepId)) continue;
    out[key] = coerce(type, value);
  }
  return out;
}

export function coerce(type: ColumnType, value: unknown): unknown {
  if (value === undefined) return null;
  if (value === null) return null;
  switch (type) {
    case 'double precision': {
      if (value === '') return null;
      const n = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(n) ? n : null;
    }
    case 'boolean':
      if (value === '') return null;
      return value === true || value === 'true' || value === 1;
    case 'date':
    case 'timestamptz':
      return value === '' ? null : value;
    case 'jsonb':
      return value;
    default:
      return typeof value === 'string' ? value : String(value);
  }
}

/** Valida le chiavi di un filtro: solo uguaglianze su colonne esistenti (come usa il frontend). */
export function filterEntries(entity: EntityName, query: Query): [string, unknown][] {
  const cols = columnsOf(entity);
  return Object.entries(query).map(([key, value]) => {
    if (!cols[key]) throw new Error(`${entity}: campo di filtro sconosciuto "${key}"`);
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      throw new Error(`${entity}: operatori di filtro non supportati su "${key}"`);
    }
    return [key, value];
  });
}

/** Raggruppa per mese e somma un campo: sostituisce Event.aggregate({dateBucket, sum}). */
export function aggregateByMonth(rows: Row[], dateField: string, sumField: string) {
  const buckets = new Map<string, { sum: number; count: number }>();
  for (const r of rows) {
    const d = r[dateField];
    if (typeof d !== 'string' || d.length < 7) continue;
    const key = d.slice(0, 7);
    const b = buckets.get(key) ?? { sum: 0, count: 0 };
    b.sum += Number(r[sumField]) || 0;
    b.count += 1;
    buckets.set(key, b);
  }
  return {
    rows: [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, b]) => ({ date, [`sum_${sumField}`]: b.sum, count: b.count })),
    truncated: false,
  };
}
