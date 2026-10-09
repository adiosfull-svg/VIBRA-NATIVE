#!/usr/bin/env bash
# Avvia (se spenti) stack locale :54321, app originale :5173 e app nativa web :8081, poi aspetta che rispondano.
# Uso: tools/compare/up.sh   (i log finiscono in ${LOGDIR:-/tmp}/vibra-*.log)
set -u
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
LOG=${LOGDIR:-/tmp}
cd "$ROOT"
curl -s -o /dev/null http://127.0.0.1:54321/rest/v1/ || (nohup scripts/local/dev_stack.sh > "$LOG/vibra-stack.log" 2>&1 &)
curl -s -o /dev/null http://127.0.0.1:5173/ || (nohup tools/web-ref/run.sh > "$LOG/vibra-ref.log" 2>&1 &)
curl -s -o /dev/null http://127.0.0.1:8081/ || (cd app && EXPO_OFFLINE=1 nohup npx expo start --web --port 8081 > "$LOG/vibra-expo.log" 2>&1 &)
for _ in $(seq 1 90); do
  curl -s -o /dev/null http://127.0.0.1:8081/ && curl -s -o /dev/null http://127.0.0.1:5173/ \
    && curl -s -o /dev/null http://127.0.0.1:54321/rest/v1/ && { echo "pronti"; exit 0; }
  sleep 2
done
echo "non pronti: vedi $LOG/vibra-*.log"; exit 1
