// Valori dei campi <input type="date|time|datetime-local"> nel formato del browser
// (YYYY-MM-DD, HH:mm, YYYY-MM-DDTHH:mm) e testo mostrato come Chrome in italiano.

export type DateInputType = 'date' | 'time' | 'datetime-local';

export const isDateInputType = (t?: string): t is DateInputType => t === 'date' || t === 'time' || t === 'datetime-local';

const pad = (n: number) => String(n).padStart(2, '0');

/** Valore del campo → Date locale (null se vuoto o non valido). */
export function parseInputValue(type: DateInputType, value?: string | null): Date | null {
  if (!value) return null;
  let m: RegExpMatchArray | null;
  if (type === 'time') {
    if (!(m = value.match(/^(\d{2}):(\d{2})/))) return null;
    const d = new Date();
    d.setHours(Number(m[1]), Number(m[2]), 0, 0);
    return d;
  }
  if (!(m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/))) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 0), Number(m[5] ?? 0));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Date → valore del campo. */
export function formatInputValue(type: DateInputType, d: Date): string {
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (type === 'date') return date;
  if (type === 'time') return time;
  return `${date}T${time}`;
}

/** Testo nel campo, come Chrome con lingua italiana (segnaposto se vuoto). */
export function displayValue(type: DateInputType, value?: string | null): { text: string; empty: boolean } {
  const d = parseInputValue(type, value);
  if (!d) {
    const ph = { date: 'gg/mm/aaaa', time: '--:--', 'datetime-local': 'gg/mm/aaaa, --:--' }[type];
    return { text: ph, empty: true };
  }
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { text: type === 'date' ? date : type === 'time' ? time : `${date}, ${time}`, empty: false };
}

/** Attributi min/max (stesso formato del valore) → Date, per limitare il calendario. */
export function limitDate(type: DateInputType, v?: string | number | null): Date | undefined {
  return v == null || v === '' ? undefined : parseInputValue(type, String(v)) ?? undefined;
}
