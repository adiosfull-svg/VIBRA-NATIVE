// Elenca i file dell'app web necessari a una pagina (import locali transitivi), escludendo quelli
// già coperti dallo strato nativo (ui shadcn, utils copiate, SDK, auth...).
// Uso: node scripts/port/tree.mjs <src-originale> <file-pagina>
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const [srcRoot, entry] = process.argv.slice(2);
const COVERED = /^@\/(components\/ui\/|utils\/|api\/base44Client$|lib\/AuthContext$|lib\/viewAsPromoterContext$|lib\/utils$|lib\/layoutUIContext$|hooks\/useRoleAccess$)/;
const seen = new Set();
function resolve(spec) {
  const base = path.join(srcRoot, spec.replace(/^@\//, ''));
  for (const ext of ['', '.jsx', '.js', '/index.jsx', '/index.js']) if (existsSync(base + ext) && !base.endsWith('/')) {
    try { if (readFileSync(base + ext)) return base + ext; } catch { /* directory */ }
  }
  return null;
}
function visit(file) {
  if (seen.has(file)) return;
  seen.add(file);
  const code = readFileSync(file, 'utf8');
  for (const m of code.matchAll(/(?:import[^'"]*from\s*|import\s*\(\s*)['"](@\/[^'"]+|\.{1,2}\/[^'"]+)['"]/g)) {
    let spec = m[1];
    if (spec.startsWith('.')) spec = '@/' + path.relative(srcRoot, path.resolve(path.dirname(file), spec));
    if (COVERED.test(spec)) continue;
    const f = resolve(spec);
    if (f) visit(f);
  }
}
visit(path.resolve(entry));
for (const f of [...seen].sort()) console.log(path.relative(srcRoot, f), readFileSync(f, 'utf8').split('\n').length);
