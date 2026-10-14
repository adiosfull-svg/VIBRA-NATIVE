// Server statico della build dell'originale per la gara: ogni percorso senza file → index.html
// (le route dell'app, come sull'hosting di Base44). Uso: node tools/gara/serve.mjs <cartella> [porta=5173]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const [root, port = '5173'] = process.argv.slice(2);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, path);
  try { if (!(await stat(file)).isFile()) throw 0; } catch { file = join(root, 'index.html'); }
  const body = await readFile(file);
  // asset con hash: in cache come in produzione; index.html sempre fresco
  const cache = file.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable';
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': cache });
  res.end(body);
}).listen(Number(port), '127.0.0.1', () => console.log(`originale su http://127.0.0.1:${port}`));
