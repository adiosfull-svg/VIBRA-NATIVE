// <datalist id> + <input list>: i suggerimenti del browser. HtmlDatalist pubblica le opzioni per id,
// il campo con `list` le mostra sotto di sé mentre ha il fuoco (filtrate dal testo scritto).
import { Children, isValidElement, useEffect, useSyncExternalStore, type ReactNode } from 'react';

const lists = new Map<string, string[]>();
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

export function HtmlDatalist({ id, children }: { id?: string; children?: ReactNode }) {
  const values = Children.toArray(children).filter(isValidElement)
    .map((c) => String((c.props as { value?: unknown }).value ?? '')).filter(Boolean);
  const key = values.join('\u0000');
  useEffect(() => {
    if (!id) return;
    lists.set(id, key ? key.split('\u0000') : []);
    notify();
    return () => { lists.delete(id); notify(); };
  }, [id, key]);
  return null;
}

/** Opzioni del <datalist> con quell'id (undefined se non c'è). */
export function useDatalist(id?: string): string[] | undefined {
  return useSyncExternalStore(subscribe, () => (id ? lists.get(id) : undefined), () => undefined);
}

/** Suggerimenti da mostrare: contengono il testo scritto (senza maiuscole), escluso il valore identico. */
export function datalistMatches(options: string[] | undefined, value: unknown, max = 8): string[] {
  if (!options) return [];
  const v = String(value ?? '').trim().toLowerCase();
  return options.filter((o) => o.toLowerCase() !== v && o.toLowerCase().includes(v)).slice(0, max);
}
