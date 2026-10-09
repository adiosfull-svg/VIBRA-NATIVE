#!/usr/bin/env bash
# Avvia l'app web di riferimento su http://127.0.0.1:5173 (?as=pr|admin|super4 per scegliere l'utente).
set -euo pipefail
cd "$(dirname "$0")/.app"
exec npx vite --host 127.0.0.1 --port 5173 --strictPort
