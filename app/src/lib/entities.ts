// Adapter con la stessa forma di `base44.entities.<Nome>` usata nel codice originale,
// così le schermate portate da Base44 cambiano il meno possibile.
import { supabase } from './supabase';
import { SCHEMA, type EntityName } from './schema.generated.ts';
import { aggregateByMonth, filterEntries, parseSort, toDbRow, type Query, type Row } from './entityCore.ts';

const PAGE = 1000; // limite di righe per richiesta di PostgREST/Supabase

type SubscribeEvent = { type: 'create' | 'update' | 'delete'; id: string; data: Row };
type PageOpts = { sort?: string; limit?: number; cursor?: string; fields?: string[] };
type Page = { items: Row[]; has_more: boolean; next_cursor: string | null };

function fail(entity: string, op: string, error: { message: string } | null): never {
  throw new Error(`${entity}.${op}: ${error?.message ?? 'errore sconosciuto'}`);
}

function makeEntity(entity: EntityName) {
  const table = SCHEMA[entity].table;

  function select(query: Query = {}, sort?: string | null, fields?: string[]) {
    let q = supabase.from(table).select(fields?.length ? fields.join(',') : '*');
    for (const [key, value] of filterEntries(entity, query)) {
      if (value === null) q = q.is(key, null);
      else if (Array.isArray(value)) q = q.in(key, value);
      else q = q.eq(key, value as string);
    }
    const s = parseSort(sort);
    // ordinamento secondario per id: paginazione stabile anche con valori uguali
    if (s) q = q.order(s.column, { ascending: s.ascending, nullsFirst: false });
    return q.order('id', { ascending: true });
  }

  /** Scarica righe da `skip` fino a `limit` (o tutte), a blocchi di PAGE. */
  async function fetchRows(query: Query, sort?: string | null, limit?: number, skip = 0, fields?: string[]) {
    const out: Row[] = [];
    for (let from = skip; ; from += PAGE) {
      const want = limit == null ? PAGE : Math.min(PAGE, limit - out.length);
      if (want <= 0) break;
      const { data, error } = await select(query, sort, fields).range(from, from + want - 1);
      if (error) fail(entity, 'list', error);
      out.push(...((data ?? []) as unknown as Row[]));
      if (!data || data.length < want) break;
    }
    return out;
  }

  /**
   * filter(query, sort?, limit?) -> Row[]
   * filter(query, { sort, limit, cursor, fields }) -> { items, has_more, next_cursor }
   */
  function filter(query: Query, opts: PageOpts): Promise<Page>;
  function filter(query?: Query, sort?: string | null, limit?: number): Promise<Row[]>;
  function filter(query: Query = {}, sortOrOpts?: string | PageOpts | null, limit?: number): Promise<Row[] | Page> {
    if (sortOrOpts && typeof sortOrOpts === 'object') {
      const { sort, limit: pageSize = PAGE, cursor, fields } = sortOrOpts;
      const skip = cursor ? Number(cursor) : 0;
      return fetchRows(query, sort, pageSize + 1, skip, fields).then((rows) => {
        const has_more = rows.length > pageSize;
        return { items: rows.slice(0, pageSize), has_more, next_cursor: has_more ? String(skip + pageSize) : null };
      });
    }
    return fetchRows(query, sortOrOpts, limit);
  }

  return {
    /** list(sort?, limit?, skip?) — senza limit restituisce tutte le righe. */
    list(sort?: string | null, limit?: number, skip?: number) {
      return fetchRows({}, sort, limit, skip);
    },

    filter,

    async get(id: string) {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error) fail(entity, 'get', error);
      return data as Row;
    },

    async create(values: Record<string, unknown>) {
      const { data, error } = await supabase.from(table).insert(toDbRow(entity, values)).select().single();
      if (error) fail(entity, 'create', error);
      return data as Row;
    },

    async bulkCreate(list: Record<string, unknown>[]) {
      if (!list.length) return [];
      const { data, error } = await supabase.from(table).insert(list.map((v) => toDbRow(entity, v))).select();
      if (error) fail(entity, 'bulkCreate', error);
      return data as Row[];
    },

    async update(id: string, values: Record<string, unknown>) {
      const { data, error } = await supabase.from(table).update(toDbRow(entity, values)).eq('id', id).select().single();
      if (error) fail(entity, 'update', error);
      return data as Row;
    },

    /** bulkUpdate([{ id, ...campi }]) — un update per riga, in parallelo. */
    async bulkUpdate(list: ({ id: string } & Record<string, unknown>)[]) {
      return Promise.all(list.map(({ id, ...rest }) => this.update(id, rest)));
    },

    async delete(id: string) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) fail(entity, 'delete', error);
    },

    async deleteMany(query: Query) {
      let q = supabase.from(table).delete();
      const entries = filterEntries(entity, query);
      // PostgREST rifiuta DELETE senza filtro: per "tutto" filtriamo su id non nullo.
      if (!entries.length) q = q.not('id', 'is', null);
      for (const [key, value] of entries) q = value === null ? q.is(key, null) : q.eq(key, value as string);
      const { error } = await q;
      if (error) fail(entity, 'deleteMany', error);
    },

    /** Event.aggregate({ dateBucket: { field, unit: 'month' }, sum }) calcolato lato client. */
    async aggregate(opts: { query?: Query; dateBucket: { field: string; unit: 'month' }; sum: string }) {
      const rows = await fetchRows(opts.query ?? {}, null, undefined, 0, ['id', opts.dateBucket.field, opts.sum]);
      return aggregateByMonth(rows, opts.dateBucket.field, opts.sum);
    },

    /** Notifiche realtime nella forma di Base44: callback({ type, id, data }). */
    subscribe(callback: (event: SubscribeEvent) => void) {
      const channel = supabase
        .channel(`rt-${table}-${Math.random().toString(36).slice(2)}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
          const type = payload.eventType === 'INSERT' ? 'create' : payload.eventType === 'UPDATE' ? 'update' : 'delete';
          const data = (type === 'delete' ? payload.old : payload.new) as Row;
          callback({ type, id: data?.id, data });
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    },
  };
}

export type Entity = ReturnType<typeof makeEntity>;

export const entities = Object.fromEntries(
  (Object.keys(SCHEMA) as EntityName[]).map((name) => [name, makeEntity(name)]),
) as Record<EntityName, Entity>;
