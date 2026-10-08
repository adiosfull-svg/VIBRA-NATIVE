#!/usr/bin/env bash
# Applica le migrazioni su un Postgres locale usa-e-getta con uno stub minimo
# di Supabase (schema auth, ruoli, publication realtime) ed esegue i test RLS.
# Uso: scripts/test_db.sh
set -euo pipefail
cd "$(dirname "$0")/.."

PGBIN=$(ls -d /usr/lib/postgresql/*/bin | tail -1)
DIR=$(mktemp -d)
PORT=55432
trap '"$PGBIN/pg_ctl" -D "$DIR/data" stop -m immediate >/dev/null 2>&1 || true; rm -rf "$DIR"' EXIT

run_pg() { if [ "$(id -u)" = 0 ]; then chown -R postgres "$DIR"; su postgres -c "$*"; else bash -c "$*"; fi; }

run_pg "'$PGBIN/initdb' -D '$DIR/data' -U postgres -A trust >/dev/null"
run_pg "'$PGBIN/pg_ctl' -D '$DIR/data' -o '-p $PORT -k $DIR -c listen_addresses=' -l '$DIR/log' start -w >/dev/null"

PSQL=(psql -h "$DIR" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q)

"${PSQL[@]}" -f scripts/local/stub.sql

for f in supabase/migrations/*.sql; do
  echo "applico $f"
  "${PSQL[@]}" -f "$f"
done

echo "test RLS"
"${PSQL[@]}" -f scripts/test_rls.sql
echo "OK"
