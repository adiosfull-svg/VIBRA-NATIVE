// Import '@/...' che non trovano un file in app/src (il typecheck non guarda i .jsx: un file mancante
// si scopre solo quando il bundle fallisce). Uso: node scripts/port/check-imports.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../app/src');
const EXT = ['', '.ts', '.tsx', '.js', '.jsx', '.web.ts', '.web.tsx', '.native.ts', '.native.tsx', '.native.jsx', '/index.ts', '/index.tsx', '/index.js'];
const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(t|j)sx?$/.test(f) ? [p] : []; });
let missing = 0;
for (const file of walk(SRC)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/(?:from|import)\s*\(?\s*'@\/([^']+)'/g)) {
    const base = path.join(SRC, m[1]);
    if (!EXT.some((e) => existsSync(base + e) && statSync(base + e).isFile())) { missing++; console.log(`${path.relative(SRC, file)}: manca @/${m[1]}`); }
  }
}
console.log(missing ? `${missing} import non risolti` : 'tutti gli import @/ risolti');
process.exit(missing ? 1 : 0);
