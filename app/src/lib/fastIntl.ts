// Confronti e formattazioni "locali" veloci sul telefono (docs/REGOLE-PRESTAZIONI.md §4).
//
// Su Android Hermes implementa localeCompare, Number#toLocaleString e Date#toLocale*String chiamando
// Java (ICU) via JNI e ricreando a OGNI chiamata il collator/formattatore: ordinare ~950 località
// (campaniaLocations, caricata da Weekend) bloccava il JS per secondi all'avvio, e ogni riga dei
// clienti formatta più importi. Qui, solo sul telefono:
//   - String#localeCompare → confronto in JS puro con le regole dell'ordinamento italiano/radice di
//     ICU (maiuscole/minuscole e accenti contano solo a parità di lettere, cifre prima delle lettere,
//     spazi e punteggiatura prima delle cifre; opzioni numeric e sensitivity);
//   - Number#toLocaleString('it-IT', {min/maxFractionDigits}) → formattazione in JS puro (punto delle
//     migliaia, virgola dei decimali, arrotondamento come Intl);
//   - le altre combinazioni e le date → formattatori Intl creati una volta e riusati.
// Va importato prima del resto (app/_layout.tsx). Le funzioni pure sono esportate per i test.

type CompareOpts = { sensitivity?: 'base' | 'accent' | 'case' | 'variant'; numeric?: boolean; ignorePunctuation?: boolean };

// ── confronto ───────────────────────────────────────────────────────────────
// lettere accentate → lettera base (o espansione: æ → ae) + peso dell'accento
const ACCENTED: Record<string, [string, number]> = {};
const add = (chars: string, base: string) => {
  [...chars].forEach((c, i) => { ACCENTED[c] = [base, i + 1]; });
};
add('áàâäãåāăą', 'a'); add('ÁÀÂÄÃÅĀĂĄ', 'A');
add('çćĉċč', 'c'); add('ÇĆĈĊČ', 'C');
add('ďđ', 'd'); add('ĎĐ', 'D');
add('éèêëēĕėęě', 'e'); add('ÉÈÊËĒĔĖĘĚ', 'E');
add('ĝğġģ', 'g'); add('ĜĞĠĢ', 'G');
add('ĥħ', 'h'); add('ĤĦ', 'H');
add('íìîïĩīĭįı', 'i'); add('ÍÌÎÏĨĪĬĮİ', 'I');
add('ĵ', 'j'); add('Ĵ', 'J');
add('ķ', 'k'); add('Ķ', 'K');
add('ĺļľŀł', 'l'); add('ĹĻĽĿŁ', 'L');
add('ñńņňŉ', 'n'); add('ÑŃŅŇ', 'N');
add('óòôöõøōŏő', 'o'); add('ÓÒÔÖÕØŌŎŐ', 'O');
add('ŕŗř', 'r'); add('ŔŖŘ', 'R');
add('śŝşš', 's'); add('ŚŜŞŠ', 'S');
add('ţťŧ', 't'); add('ŢŤŦ', 'T');
add('úùûüũūŭůűų', 'u'); add('ÚÙÛÜŨŪŬŮŰŲ', 'U');
add('ŵ', 'w'); add('Ŵ', 'W');
add('ýÿŷ', 'y'); add('ÝŸŶ', 'Y');
add('źżž', 'z'); add('ŹŻŽ', 'Z');
const EXPAND: Record<string, string> = { 'æ': 'ae', 'Æ': 'AE', 'œ': 'oe', 'Œ': 'OE', 'ß': 'ss', 'ẞ': 'SS' };

// ordine della punteggiatura ASCII in ICU (radice CLDR): prima di cifre e lettere
const PUNCT = '_-,;:!?.\'"()[]{}@*/\\&#%`^+<=>|~$';

type Key = { p: number[]; s: number[]; t: number[] };
const NUM_BASE = 1000;
const LETTER_BASE = 3000;
const OTHER_BASE = 10000;

function isDigit(c: number) { return c >= 48 && c <= 57; }

function buildKey(str: string, numeric: boolean, ignorePunct: boolean): Key {
  const p: number[] = [], s: number[] = [], t: number[] = [];
  const pushLetter = (ch: string, accent: number) => {
    const lower = ch.toLowerCase();
    p.push(LETTER_BASE + lower.charCodeAt(0));
    s.push(accent);
    t.push(ch === lower ? 0 : 1);
  };
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const c = str.charCodeAt(i);
    if (isDigit(c)) {
      if (numeric) {
        let j = i;
        while (j < str.length && isDigit(str.charCodeAt(j))) j++;
        const digits = str.slice(i, j).replace(/^0+(?=\d)/, '');
        // numero più lungo = più grande; a parità di lunghezza, cifra per cifra
        p.push(NUM_BASE + 100 + digits.length);
        for (let k = 0; k < digits.length; k++) p.push(NUM_BASE + digits.charCodeAt(k) - 48);
        // zeri iniziali ignorati anche per accenti/maiuscole (ICU: "02" = "2")
        s.push(0); t.push(0);
        i = j - 1;
      } else {
        p.push(NUM_BASE + c - 48); s.push(0); t.push(0);
      }
      continue;
    }
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) { pushLetter(ch, 0); continue; }
    const acc = ACCENTED[ch];
    if (acc) { pushLetter(acc[0], acc[1]); continue; }
    const exp = EXPAND[ch];
    if (exp) { for (const e of exp) pushLetter(e, 1); continue; }
    if (c === 32 || c === 9 || c === 10 || c === 13 || c === 160) {
      if (!ignorePunct) { p.push(10); s.push(0); t.push(0); }
      continue;
    }
    const pi = PUNCT.indexOf(ch);
    if (pi >= 0) {
      if (!ignorePunct) { p.push(20 + pi); s.push(0); t.push(0); }
      continue;
    }
    // altre scritture/simboli: dopo le lettere latine, per codice
    p.push(OTHER_BASE + c); s.push(0); t.push(0);
  }
  return { p, s, t };
}

function cmpArr(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return a.length === b.length ? 0 : a.length < b.length ? -1 : 1;
}

const keyCache = new Map<string, Key>();
function keyOf(str: string, numeric: boolean, ignorePunct: boolean): Key {
  const k = (numeric ? '1' : '0') + (ignorePunct ? '1' : '0') + str;
  let v = keyCache.get(k);
  if (!v) {
    if (keyCache.size > 20000) keyCache.clear();
    v = buildKey(str, numeric, ignorePunct);
    keyCache.set(k, v);
  }
  return v;
}

/** Come a.localeCompare(b, 'it', opts) di ICU, in JS puro. */
export function fastLocaleCompare(a: string, b: string, opts?: CompareOpts): number {
  if (a === b) return 0;
  const numeric = !!opts?.numeric;
  const ka = keyOf(a, numeric, !!opts?.ignorePunctuation);
  const kb = keyOf(b, numeric, !!opts?.ignorePunctuation);
  const sens = opts?.sensitivity ?? 'variant';
  const p = cmpArr(ka.p, kb.p);
  if (p !== 0 || sens === 'base') return p;
  if (sens !== 'case') {
    const s = cmpArr(ka.s, kb.s);
    if (s !== 0 || sens === 'accent') return s;
  }
  return cmpArr(ka.t, kb.t);
}

// ── numeri ──────────────────────────────────────────────────────────────────
function groupThousands(int: string): string {
  // italiano (CLDR): minimumGroupingDigits 2 → 1000 senza punto, 12.345 col punto
  if (int.length <= 4) return int;
  let out = '';
  for (let i = int.length; i > 0; i -= 3) out = int.slice(Math.max(0, i - 3), i) + (out ? '.' + out : '');
  return out;
}

/** Cifre decimali più corte del numero (come le usa ICU), anche da notazione esponenziale. */
function plainDecimal(x: number): string {
  const str = String(x);
  const m = str.match(/^(\d)(?:\.(\d+))?e([+-]\d+)$/);
  if (!m) return str;
  const digits = m[1] + (m[2] ?? '');
  const exp = Number(m[3]);
  if (exp < 0) return '0.' + '0'.repeat(-exp - 1) + digits;
  return digits.length <= exp + 1 ? digits + '0'.repeat(exp + 1 - digits.length) : digits.slice(0, exp + 1) + '.' + digits.slice(exp + 1);
}

/** Arrotonda a `fd` decimali con metà verso l'alto (halfExpand di Intl) lavorando sulle cifre decimali. */
function roundDecimal(x: number, fd: number): string {
  const [int, frac = ''] = plainDecimal(x).split('.');
  if (frac.length <= fd) return frac ? `${int}.${frac}` : int;
  const keep = int + frac.slice(0, fd);
  let out = keep;
  if (frac.charCodeAt(fd) >= 53) {
    // +1 sull'ultima cifra tenuta, con riporto
    const d = keep.split('');
    let i = d.length - 1;
    while (i >= 0) {
      if (d[i] === '9') { d[i] = '0'; i--; } else { d[i] = String(Number(d[i]) + 1); break; }
    }
    out = (i < 0 ? '1' : '') + d.join('');
  }
  const intLen = out.length - fd;
  return fd ? `${out.slice(0, intLen)}.${out.slice(intLen)}` : out;
}

/** Come n.toLocaleString('it-IT', { minimumFractionDigits, maximumFractionDigits }); null se non gestito. */
export function fastItNumber(n: number, minFD = 0, maxFD = Math.max(minFD, 3)): string | null {
  if (!Number.isFinite(n) || Math.abs(n) >= 1e21 || minFD > maxFD || maxFD > 20) return null;
  const neg = n < 0 || Object.is(n, -0);
  let [int, frac = ''] = roundDecimal(Math.abs(n), maxFD).split('.');
  frac = frac.replace(/0+$/, '');
  while (frac.length < minFD) frac += '0';
  const body = groupThousands(int) + (frac ? ',' + frac : '');
  return neg ? '-' + body : body;
}

// ── installazione (solo telefono) ───────────────────────────────────────────
const isItalian = (l: unknown) => l === undefined || (typeof l === 'string' && /^it(-IT)?$/i.test(l));
const ONLY_FRACTION = /^(minimumFractionDigits|maximumFractionDigits)$/;

export function installFastIntl() {
  const strProto = String.prototype as unknown as { localeCompare: (this: string, that: string, l?: unknown, o?: CompareOpts) => number };
  strProto.localeCompare = function localeCompare(this: string, that: string, _locales?: unknown, options?: CompareOpts) {
    return fastLocaleCompare(String(this), String(that), options);
  };

  const numFormats = new Map<string, Intl.NumberFormat>();
  const nativeNumLocale = Number.prototype.toLocaleString;
  (Number.prototype as unknown as { toLocaleString: (this: number, l?: string, o?: Intl.NumberFormatOptions) => string }).toLocaleString =
    function toLocaleString(this: number, locales?: string, options?: Intl.NumberFormatOptions) {
      const n = Number(this);
      if (isItalian(locales) && (!options || Object.keys(options).every((k) => ONLY_FRACTION.test(k)))) {
        const minFD = options?.minimumFractionDigits ?? 0;
        const maxFD = options?.maximumFractionDigits ?? Math.max(minFD, 3);
        const fast = fastItNumber(n, minFD, maxFD);
        if (fast != null) return fast;
      }
      try {
        const key = `${locales ?? ''}|${options ? JSON.stringify(options) : ''}`;
        let f = numFormats.get(key);
        if (!f) { f = new Intl.NumberFormat(locales, options); numFormats.set(key, f); }
        return f.format(n);
      } catch {
        return nativeNumLocale.call(n, locales, options);
      }
    };

  const dateFormats = new Map<string, Intl.DateTimeFormat>();
  const patchDate = (name: 'toLocaleString' | 'toLocaleDateString' | 'toLocaleTimeString', defaults: Intl.DateTimeFormatOptions) => {
    const proto = Date.prototype as unknown as Record<string, (this: Date, l?: string, o?: Intl.DateTimeFormatOptions) => string>;
    const native = proto[name];
    proto[name] = function (this: Date, locales?: string, options?: Intl.DateTimeFormatOptions) {
      if (Number.isNaN(this.getTime())) return 'Invalid Date';
      try {
        // come lo standard: senza campi di data/ora valgono quelli predefiniti del metodo
        const hasFields = !!options && ['weekday', 'era', 'year', 'month', 'day', 'hour', 'minute', 'second', 'dateStyle', 'timeStyle']
          .some((k) => (options as Record<string, unknown>)[k] !== undefined);
        const opts = hasFields ? options : { ...defaults, ...options };
        const key = `${name}|${locales ?? ''}|${JSON.stringify(opts)}`;
        let f = dateFormats.get(key);
        if (!f) { f = new Intl.DateTimeFormat(locales, opts); dateFormats.set(key, f); }
        return f.format(this);
      } catch {
        return native.call(this, locales, options);
      }
    };
  };
  patchDate('toLocaleString', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
  patchDate('toLocaleDateString', { year: 'numeric', month: 'numeric', day: 'numeric' });
  patchDate('toLocaleTimeString', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
}
