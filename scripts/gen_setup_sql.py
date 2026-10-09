# Crea supabase/setup_completo.sql: un unico file da incollare nel SQL Editor di un progetto
# Supabase di PROVA = azzeramento + migrazioni + permessi API + dati di prova (supabase/seed_demo.sql).
# Rieseguibile: all'inizio CANCELLA lo schema public e gli utenti @vibra.local (mai su dati veri).
# Uso: python3 scripts/gen_setup_sql.py
import glob, os
root = os.path.join(os.path.dirname(__file__), '..')
parts = ['-- GENERATO da scripts/gen_setup_sql.py - non modificare a mano.\n'
         '-- Per un progetto Supabase di PROVA: si può rieseguire, ma CANCELLA e ricrea tutti i dati.\n'
         'begin;\n'
         '\n-- ===== azzeramento =====\n'
         "delete from auth.identities where user_id in (select id from auth.users where email like '%@vibra.local');\n"
         "delete from auth.users where email like '%@vibra.local';\n"
         'drop schema if exists public cascade;\n'
         'create schema public;\n'
         'grant usage, create on schema public to postgres, anon, authenticated, service_role;\n'
         'alter default privileges in schema public grant all on tables to anon, authenticated, service_role;\n'
         'alter default privileges in schema public grant all on functions to anon, authenticated, service_role;\n'
         'alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;\n']
for f in sorted(glob.glob(os.path.join(root, 'supabase/migrations/*.sql'))):
    parts.append(f'\n-- ===== {os.path.basename(f)} =====\n' + open(f).read())
parts.append('''
-- ===== permessi Data API (le regole RLS restano quelle delle migrazioni) =====
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;
''')
parts.append('\n-- ===== dati di prova =====\n' + open(os.path.join(root, 'supabase/seed_demo.sql')).read())
parts.append('\ncommit;\n')
open(os.path.join(root, 'supabase/setup_completo.sql'), 'w').write(''.join(parts))
print('scritto supabase/setup_completo.sql')
