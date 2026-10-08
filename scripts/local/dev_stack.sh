#!/usr/bin/env bash
# Avvia uno stack "Supabase-like" locale per sviluppare l'app senza account:
#   Postgres (dati in scripts/local/.data) + PostgREST + gateway auth/REST su :54321
# Uso: scripts/local/dev_stack.sh [--reset]
#   --reset  ricrea il database da zero (migrazioni + seed sintetico)
# Nell'app: EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321  EXPO_PUBLIC_SUPABASE_ANON_KEY=dev
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd ../.. && pwd)
PGBIN=$(ls -d /usr/lib/postgresql/*/bin | tail -1)
DATA=$PWD/.data
SOCK=$DATA/sock
PORT=55433
JWT_SECRET=vibra-local-dev-secret-at-least-32-characters
[ -x bin/postgrest ] || { echo "manca scripts/local/bin/postgrest (vedi README)"; exit 1; }

as_pg() { if [ "$(id -u)" = 0 ]; then su postgres -c "$*"; else bash -c "$*"; fi; }

if [ "${1:-}" = "--reset" ] && [ -d "$DATA" ]; then
  as_pg "'$PGBIN/pg_ctl' -D '$DATA/pg' stop -m fast" >/dev/null 2>&1 || true
  rm -rf "$DATA"
fi

FRESH=0
if [ ! -d "$DATA/pg" ]; then
  mkdir -p "$SOCK"; [ "$(id -u)" = 0 ] && chown -R postgres "$DATA"
  as_pg "'$PGBIN/initdb' -D '$DATA/pg' -U postgres -A trust >/dev/null"
  FRESH=1
fi
as_pg "'$PGBIN/pg_ctl' -D '$DATA/pg' status" >/dev/null 2>&1 || \
  as_pg "'$PGBIN/pg_ctl' -D '$DATA/pg' -o '-p $PORT -k $SOCK -c listen_addresses=127.0.0.1 -c wal_level=logical' -l '$DATA/pg.log' start -w" >/dev/null

PSQL=(psql -h "$SOCK" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q)
if [ $FRESH = 1 ]; then
  "${PSQL[@]}" -f stub.sql
  for f in "$ROOT"/supabase/migrations/*.sql; do "${PSQL[@]}" -f "$f"; done
  "${PSQL[@]}" -f seed.sql
  echo "database creato con dati sintetici"
fi

cat > "$DATA/postgrest.conf" <<EOF
db-uri = "postgres://authenticator:authenticator@127.0.0.1:$PORT/postgres"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$JWT_SECRET"
server-port = 54330
server-host = "127.0.0.1"
EOF

# ferma le istanze precedenti (pidfile) e attende che le porte si liberino
for name in postgrest gateway; do
  if [ -f "$DATA/$name.pid" ]; then
    pid=$(cat "$DATA/$name.pid")
    kill "$pid" 2>/dev/null || true
    for _ in $(seq 20); do kill -0 "$pid" 2>/dev/null || break; sleep 0.25; done
    rm -f "$DATA/$name.pid"
  fi
done
nohup bin/postgrest "$DATA/postgrest.conf" > "$DATA/postgrest.log" 2>&1 &
echo $! > "$DATA/postgrest.pid"
PSQL_ARGS=$(printf '["-h","%s","-p","%s","-U","postgres","-d","postgres"]' "$SOCK" "$PORT")
JWT_SECRET=$JWT_SECRET PSQL_ARGS=$PSQL_ARGS nohup node gateway.mjs > "$DATA/gateway.log" 2>&1 &
echo $! > "$DATA/gateway.pid"
sleep 2
curl -sf http://127.0.0.1:54321/rest/v1/ >/dev/null && echo "stack pronto su http://127.0.0.1:54321 (login: admin@vibra.local / pr@vibra.local, password: vibra)"
