// Genera app/src/ui/map/leafletAssets.generated.ts: Leaflet e leaflet.markercluster (stesse versioni
// dell'app web originale: 1.9.4 e 1.5.3) come stringhe, per la pagina della mappa (ui/map/leafletHtml.ts)
// mostrata in un iframe (web) o in una WebView (telefono) senza dipendere da un CDN.
// Uso: node scripts/gen_leaflet.mjs [node_modules=app/node_modules]
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const nm = process.argv[2] ?? path.join(import.meta.dirname, '../app/node_modules');
const read = (p) => readFileSync(path.join(nm, p), 'utf8');
const version = (pkg) => JSON.parse(read(`${pkg}/package.json`)).version;

const assets = {
  LEAFLET_JS: read('leaflet/dist/leaflet.js'),
  LEAFLET_CSS: read('leaflet/dist/leaflet.css'),
  MARKERCLUSTER_JS: read('leaflet.markercluster/dist/leaflet.markercluster.js'),
  MARKERCLUSTER_CSS: read('leaflet.markercluster/dist/MarkerCluster.css') + '\n' + read('leaflet.markercluster/dist/MarkerCluster.Default.css'),
};
let out = `// GENERATO da scripts/gen_leaflet.mjs (leaflet ${version('leaflet')}, leaflet.markercluster ${version('leaflet.markercluster')}): non modificare.\n/* eslint-disable */\n`;
for (const [k, v] of Object.entries(assets)) out += `export const ${k} = ${JSON.stringify(v)};\n`;
const dest = path.join(import.meta.dirname, '../app/src/ui/map/leafletAssets.generated.ts');
writeFileSync(dest, out);
console.log(`${dest}: ${Math.round(out.length / 1024)} KB`);
