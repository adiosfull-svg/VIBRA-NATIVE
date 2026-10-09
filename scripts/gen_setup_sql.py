# Crea supabase/setup_completo.sql: un unico file da incollare nel SQL Editor di un progetto
# Supabase NUOVO (vuoto) = migrazioni + permessi API + dati di prova (supabase/seed_demo.sql).
# Uso: python3 scripts/gen_setup_sql.py
import glob, os
root = os.path.join(os.path.dirname(__file__), '..')
parts = ['-- GENERATO da scripts/gen_setup_sql.py - non modificare a mano.\n'
         '-- Da eseguire UNA volta nel SQL Editor di un progetto Supabase vuoto.\n'
         'begin;\n']
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
