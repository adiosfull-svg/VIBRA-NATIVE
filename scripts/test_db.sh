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

"${PSQL[@]}" <<'SQL'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create publication supabase_realtime;
grant usage on schema public, auth to authenticated, anon;
grant execute on all functions in schema auth to authenticated;
SQL

for f in supabase/migrations/*.sql; do
  echo "applico $f"
  "${PSQL[@]}" -f "$f"
done
"${PSQL[@]}" -c "grant select, insert, update, delete on all tables in schema public to authenticated;"

echo "test RLS"
"${PSQL[@]}" -f scripts/test_rls.sql
echo "OK"
