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
// pacchetti npm importati che non sono in node_modules (es. react-leaflet dell'originale non sostituito)
const NM = path.resolve(SRC, '../node_modules');
for (const file of walk(SRC)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/^import[^'\n]*'([^.@/][^']*|@(?!\/)[^']*)'/gm)) {
    if (m[1].startsWith('node:')) continue;
    const pkg = m[1].startsWith('@') ? m[1].split('/').slice(0, 2).join('/') : m[1].split('/')[0];
    if (!existsSync(path.join(NM, pkg))) { missing++; console.log(`${path.relative(SRC, file)}: pacchetto mancante ${pkg}`); }
  }
}
// icone importate da @/ui/icons.generated che il file generato non esporta (scripts/gen_icons.mjs da rilanciare)
const ICONS = readFileSync(path.join(SRC, 'ui/icons.generated.ts'), 'utf8');
const iconNames = new Set([...ICONS.matchAll(/export const (\w+)/g)].map((m) => m[1]));
for (const g of ICONS.matchAll(/export \{([^}]*)\}/g)) for (const x of g[1].split(',')) iconNames.add(x.trim().split(' as ').pop());
for (const file of walk(SRC)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/import \{([^}]*)\} from '@\/ui\/icons\.generated'/g)) {
    for (const n of m[1].split(',').map((x) => x.trim().split(' as ')[0].trim()).filter(Boolean)) {
      if (!iconNames.has(n)) { missing++; console.log(`${path.relative(SRC, file)}: icona mancante ${n} (node scripts/gen_icons.mjs)`); }
    }
  }
}
console.log(missing ? `${missing} import non risolti` : 'tutti gli import risolti (@/, pacchetti, icone)');
process.exit(missing ? 1 : 0);
