#!/usr/bin/env bash
# Prepara l'app web ORIGINALE (codice letto da Base44) per girare in locale contro lo stack
# di sviluppo, come riferimento visivo e funzionale per il porting nativo.
# Sostituisce solo: SDK Base44 (src/api/base44Client.js), login (src/lib/AuthContext.jsx)
# e vite.config.js. Tutto il resto è il codice originale invariato.
# Uso: tools/web-ref/setup.sh <cartella-sorgente-base44>   poi   tools/web-ref/run.sh
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=${1:?indica la cartella con il codice sorgente Base44}
rm -rf "$HERE/.app/src"
mkdir -p "$HERE/.app"
cp -r "$SRC"/. "$HERE/.app/"
rm -rf "$HERE/.app/base44"           # entità/funzioni server: non servono al frontend
cp -r "$HERE/overrides"/. "$HERE/.app/"
cd "$HERE/.app"
npm install --no-audit --no-fund --silent
npm install --no-audit --no-fund --silent @supabase/supabase-js@2
echo "pronto: tools/web-ref/run.sh"
