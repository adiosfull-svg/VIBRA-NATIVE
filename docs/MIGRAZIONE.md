# Migrazione dati Base44 → Supabase

L'app Base44 resta **intatta e in funzione**: dai suoi dati si fa solo un export in lettura.

## 1. Preparare Supabase
1. Crea un progetto su supabase.com (regione EU).
2. Applica le migrazioni: `supabase link --project-ref <ref>` e poi `supabase db push`,
   oppure esegui in ordine i file `supabase/migrations/*.sql` dall'editor SQL.
3. In *Authentication → Providers* lascia attivo Email; disattiva le registrazioni libere
   (gli account li crea l'admin, come su Base44).

## 2. Creare gli account
Base44 non esporta le password. Per ogni utente (18 a ottobre 2026) crea l'account in
Supabase Auth con *Invite user*, usando la stessa email di Base44: l'utente riceve una mail
per impostare la password. Il trigger `handle_new_user` crea il profilo con ruolo `pr`;
l'import (passo 4) gli assegna ruolo, promoter e id originale.

## 3. Export da Base44 (sola lettura)
Un file JSON per entità in `export/<data>/<Entità>.json` (array di record completi, campi
built-in compresi). Lo fa Claude con lo strumento di lettura Base44 (`query_entities`):
- pagine da 500 record ordinate per `created_date`;
- oltre 10.000 record (es. InstagramMessage) si continua filtrando `created_date > ultimo letto`;
- `User.json` con `id, email, full_name, role, promoter_id`.
Nessuna operazione di scrittura viene eseguita su Base44.

## 4. Import
```bash
python3 scripts/import_base44.py export/<data> > export/<data>/import.sql
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f export/<data>/import.sql
```
Lo script mostra per ogni entità quanti record importa e quali campi scarta.
È rieseguibile (upsert per id): si può fare una prova, poi l'import definitivo al passaggio.

## 5. File e immagini
Foto di clienti/promoter, loghi e materiali sono URL dello storage Base44
(`base44.app/api/apps/<id>/files/...`). Continuano a funzionare finché l'app Base44 è
attiva; prima di dismetterla vanno copiati nello Storage di Supabase e gli URL aggiornati
(script da scrivere nella fase file/upload).

## 6. Verifiche dopo l'import
- Conteggio record per entità: export = tabella.
- Login con un utente admin e uno pr: stessi dati visibili che su Base44.
- Campioni: fatturato totale per serata, presenze di un cliente, statistiche promoter.

## Differenze di comportamento rispetto a Base44
- I campi "required" non sono NOT NULL nel DB (Base44 li validava solo in scrittura).
- `PushSubscription` con regola `user_id = {{user.id}}` senza prefisso `data.`: su Base44
  la regola probabilmente non filtrava; qui filtra davvero per utente.
- Il fatturato per mese (Dashboard) è calcolato lato app invece che con `aggregate` del server.
