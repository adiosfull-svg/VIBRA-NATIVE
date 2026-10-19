// Classi in conflitto nello STESSO className dell'originale (es. "text-muted-foreground ... text-destructive"):
// in CSS vince quella che viene DOPO nel foglio di stile generato da Tailwind, nel nativo (tailwind-merge
// in ui/cn.ts e NativeWind) vince l'ultima scritta. Questo script trova le coppie in cui le due regole
// danno un risultato diverso e scrive app/src/ui/cssOrder.generated.ts (usato da ui/cssOrder.ts).
// Uso (con l'originale avviato da tools/web-ref/run.sh su :5173):
//   node scripts/port/css-order.mjs [cartella-src-originale=/home/claude/vibra-reference/src]
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const { twMerge } = createRequire(path.join(ROOT, 'app/package.json'))('tailwind-merge');
const SRC = process.argv[2] || '/home/claude/vibra-reference/src';
const css = await (await fetch('http://127.0.0.1:5173/src/index.css?direct')).text();

// posizione di ogni classe semplice (senza varianti) nel CSS compilato dell'originale
const rank = new Map();
let i = 0;
for (const m of css.matchAll(/(?:^|\n|\})\s*\.((?:\\.|[A-Za-z0-9_-])+)\s*[,{ ]/g)) {
  const cls = m[1].replace(/\\(.)/g, '$1');
  if (!rank.has(cls)) rank.set(cls, i++);
}

const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(t|j)sx?$/.test(f) ? [p] : []; });
const wins = new Map(); // classe che in CSS vince → classi che tailwind-merge le farebbe perdere
const where = [];
for (const file of walk(SRC)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    const toks = (m[1] ?? m[2]).replace(/\$\{[^}]*\}/g, ' ').split(/\s+/).filter(Boolean);
    const kept = new Set(twMerge(toks.join(' ')).split(/\s+/));
    toks.forEach((r, idx) => {
      if (kept.has(r) || r.includes(':')) return;
      for (const k of toks.slice(idx + 1)) {
        if (!kept.has(k) || k.includes(':') || twMerge(`${r} ${k}`) !== k) continue;
        const rr = rank.get(r), rk = rank.get(k);
        if (rr == null || rk == null || rr < rk) continue;
        if (!wins.has(r)) wins.set(r, new Set());
        if (!wins.get(r).has(k)) where.push(`${r} > ${k}: ${path.relative(SRC, file)}`);
        wins.get(r).add(k);
      }
    });
  }
}
const body = [...wins].sort().map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify([...v].sort())},`).join('\n');
writeFileSync(path.join(ROOT, 'app/src/ui/cssOrder.generated.ts'),
  `// Generato da scripts/port/css-order.mjs: non modificare a mano.\n// classe → classi dello stesso className a cui in CSS (ordine del foglio di Tailwind) la classe vince anche se scritta prima.\nexport const CSS_WINS: Record<string, string[]> = {\n${body}\n};\n`);
console.log(where.join('\n'));
