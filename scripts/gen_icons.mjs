// Genera app/src/ui/icons.generated.ts con i disegni SVG delle icone lucide usate dall'app
// web originale, presi dalla STESSA versione di lucide-react (0.475): icone identiche e
// stessi nomi di import, anche quelli rinominati o rimossi nelle versioni successive.
// Uso: node scripts/gen_icons.mjs <src-app-web> <node_modules-con-lucide-react@0.475>
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [srcDir, nodeModules] = process.argv.slice(2);
const lucideDir = path.join(nodeModules, 'lucide-react');
const version = JSON.parse(readFileSync(path.join(lucideDir, 'package.json'), 'utf8')).version;

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(f)) out.push(p);
  }
  return out;
}

// Nomi importati da 'lucide-react' nel codice originale
const names = new Set();
for (const file of walk(srcDir)) {
  const code = readFileSync(file, 'utf8');
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  }
}

// Nome esportato -> file dell'icona, dalla mappa di export di lucide-react
const index = readFileSync(path.join(lucideDir, 'dist/esm/lucide-react.js'), 'utf8');
const fileOf = new Map();
for (const m of index.matchAll(/export \{([^}]*)\} from '\.\/icons\/([a-z0-9-]+)\.js'/g)) {
  for (const part of m[1].split(',')) {
    const alias = part.trim().split(/\s+as\s+/).pop().trim();
    if (alias) fileOf.set(alias, m[2]);
  }
}

const nodes = {};
const missing = [];
for (const name of [...names].sort()) {
  const file = fileOf.get(name);
  if (!file) { missing.push(name); continue; }
  const mod = await import(pathToFileURL(path.join(lucideDir, 'dist/esm/icons', `${file}.js`)).href);
  nodes[name] = mod.__iconNode.map(([tag, { key, ...attrs }]) => [tag, attrs]);
}
if (missing.length) throw new Error(`icone non trovate: ${missing.join(', ')}`);

const lines = [
  `// GENERATO da scripts/gen_icons.mjs da lucide-react ${version} - non modificare a mano.`,
  `import { makeIcon, type IconNode } from './icon';`,
  '',
  ...Object.entries(nodes).map(([name, node]) => `export const ${name} = makeIcon('${name}', ${JSON.stringify(node)} as IconNode);`),
  '',
];
writeFileSync(path.join(process.cwd(), 'app/src/ui/icons.generated.ts'), lines.join('\n'));
console.log(`${Object.keys(nodes).length} icone (lucide-react ${version})`);
