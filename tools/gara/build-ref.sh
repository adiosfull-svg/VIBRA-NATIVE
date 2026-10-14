#!/usr/bin/env bash
# Build di produzione dell'app web ORIGINALE per la gara (docs/PIANO-PRESTAZIONI.md), con la sonda
# tools/gara/probe-web.js in testa a index.html. Richiede tools/web-ref/setup.sh già eseguito.
# Uso: tools/gara/build-ref.sh <cartella-di-uscita>
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${1:?cartella di uscita}
cd "$HERE/../web-ref/.app"
VIBRA_GARA=1 npx vite build --outDir "$OUT" --emptyOutDir --logLevel error
node -e '
const fs = require("fs");
const [file, probe] = process.argv.slice(1);
const html = fs.readFileSync(file, "utf8");
if (html.includes("window.__gara")) process.exit(0);
fs.writeFileSync(file, html.replace("<head>", "<head><script>" + fs.readFileSync(probe, "utf8") + "</script>"));
' "$OUT/index.html" "$HERE/probe-web.js"
echo "originale con sonda in $OUT"
