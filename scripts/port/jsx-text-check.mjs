// Confronta i testi JSX (come li vede React: righe ripulite e unite da uno spazio) tra i file originali
// e quelli convertiti in app/src/web: il reprint di recast a volte perde spazi ({mod} ({count}) → {mod}({count})).
// Uso: node scripts/port/jsx-text-check.mjs <src-originale> [file-convertiti...]  (default: tutti in app/src/web)
// Con --fix corregge nel file convertito i testi abbinati in ordine quando il numero di testi coincide.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import * as babel from '@babel/parser';

const args = import.meta.url === `file://${process.argv[1]}` ? process.argv.slice(2) : [];
const fix = args.includes('--fix');
const [srcRoot, ...files0] = args.filter((a) => a !== '--fix');
const webRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../app/src/web');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.jsx$/.test(f) ? [p] : []; });
const files = !srcRoot ? [] : files0.length ? files0.map((f) => path.resolve(f)) : walk(webRoot);

// testo JSX come React (babel cleanJSXElementLiteralChild)
function clean(value) {
  const lines = value.split(/\r\n|\n|\r/);
  let last = 0;
  lines.forEach((l, i) => { if (/[^ \t]/.test(l)) last = i; });
  let str = '';
  lines.forEach((line, i) => {
    let t = line.replace(/\t/g, ' ');
    if (i !== 0) t = t.replace(/^[ ]+/, '');
    if (i !== lines.length - 1) t = t.replace(/[ ]+$/, '');
    if (t) { if (i !== last) t += ' '; str += t; }
  });
  return str;
}
function texts(code) {
  const ast = babel.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  const out = [];
  (function visit(n) {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(visit);
    if (n.type === 'JSXText') { const c = clean(n.value); if (c) out.push({ c, start: n.start, end: n.end, raw: n.value }); }
    for (const k in n) if (k !== 'loc' && k !== 'leadingComments' && k !== 'trailingComments') visit(n[k]);
  })(ast.program);
  return out;
}

/** Testi JSX del convertito riportati a quelli originali (abbinati in ordine). Restituisce null se i
 *  testi coincidono o se il loro numero è diverso (abbinamento non sicuro). */
export function restoreJsxText(origCode, convCode) {
  const a = texts(origCode), b = texts(convCode);
  if (a.length !== b.length || a.every((t, i) => t.c === b[i].c)) return null;
  let out = convCode, fixed = 0;
  for (let i = b.length - 1; i >= 0; i--) if (a[i].c !== b[i].c) { out = out.slice(0, b[i].start) + a[i].raw + out.slice(b[i].end); fixed++; }
  return { code: out, fixed };
}

const isCli = import.meta.url === `file://${process.argv[1]}`;
let bad = 0;
for (const file of isCli ? files : []) {
  const rel = path.relative(webRoot, file).replace(/\.jsx$/, '');
  const orig = ['.jsx', '.js'].map((e) => path.join(srcRoot, rel + e)).find(existsSync);
  if (!orig) continue;
  let a, b, conv = readFileSync(file, 'utf8');
  try { a = texts(readFileSync(orig, 'utf8')); b = texts(conv); } catch (e) { console.log(`${rel}: non analizzabile (${e.message})`); continue; }
  const bset = new Map(); for (const t of b) bset.set(t.c, (bset.get(t.c) ?? 0) + 1);
  const missing = a.filter((t) => { const n = bset.get(t.c) ?? 0; if (n) { bset.set(t.c, n - 1); return false; } return true; });
  if (!missing.length) continue;
  bad++;
  console.log(`${rel}: ${missing.length} testi diversi`);
  for (const t of missing.slice(0, 6)) console.log(`   originale: ${JSON.stringify(t.c)}`);
  if (fix && a.length === b.length) {
    // abbina in ordine e sostituisce il testo convertito con quello originale (stessa semantica)
    let outCode = conv;
    for (let i = b.length - 1; i >= 0; i--) if (a[i].c !== b[i].c) outCode = outCode.slice(0, b[i].start) + a[i].raw + outCode.slice(b[i].end);
    writeFileSync(file, outCode);
    console.log('   corretto');
  } else if (fix) console.log(`   NON corretto: numero di testi diverso (${a.length} vs ${b.length})`);
}
if (isCli) console.log(`${bad} file con differenze`);
