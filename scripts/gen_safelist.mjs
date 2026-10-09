// Le classi prodotte a runtime da app/src/ui/webClasses.ts (space-y-3 → gap-y-3, ring-1 → border,
// flex → flex-row...) non compaiono nei sorgenti, quindi NativeWind non le genererebbe.
// Questo script passa tutte le classi dei sorgenti dal normalizzatore e scrive quelle risultanti
// in app/src/ui/safelist.generated.txt (incluso nel "content" di tailwind.config.js).
// Uso: node --experimental-strip-types scripts/gen_safelist.mjs
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';

register('../app/test/resolve-hook.mjs', import.meta.url);
const { normalizeClasses } = await import('../app/src/ui/webClasses.ts');

const root = path.resolve(import.meta.dirname, '../app/src');
const walk = (d, o = []) => { for (const f of readdirSync(d)) { const p = path.join(d, f); statSync(p).isDirectory() ? walk(p, o) : /\.(jsx?|tsx?)$/.test(f) && o.push(p); } return o; };
const out = new Set();
for (const file of walk(root)) {
  const code = readFileSync(file, 'utf8');
  // tutte le stringhe/template che sembrano liste di classi
  for (const m of code.matchAll(/(["'`])((?:(?!\1)[^\n\\])*)\1/g)) {
    const str = m[2];
    if (!/\b(space-[xy]|ring|flex|inline-flex|grid|fixed)\b/.test(str)) continue;
    const before = new Set(str.split(/\s+/));
    for (const c of normalizeClasses(str.replace(/\$\{[^}]*\}/g, ' ')).box.split(/\s+/)) if (c && !before.has(c)) out.add(c);
  }
}
const list = [...out].sort();
writeFileSync(path.join(root, 'ui/safelist.generated.txt'), `# GENERATO da scripts/gen_safelist.mjs\n${list.join('\n')}\n`);
console.log(`${list.length} classi`);
