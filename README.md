# vibra-mobile

Versione nativa (Android e iOS) di VIBRA, scritta in React Native con Expo e con backend
Supabase indipendente. L'app web su Base44 resta com'è e serve solo da riferimento
(codice letto in sola lettura).

## Struttura
| Cartella | Contenuto |
|---|---|
| `app/` | App Expo (SDK 57, expo-router, TypeScript). Le route stanno in `app/src/app/` |
| `app/src/lib/` | client Supabase, adapter `entities` compatibile con `base44.entities`, auth, ruoli |
| `app/src/legacy/` | logica di business copiata 1:1 dall'app Base44 (ranking, achievement, obiettivi...) |
| `app/src/features/` | schermate e componenti per area (clienti, ...) |
| `schema/entities/` | definizioni entità Base44: fonte dello schema |
| `supabase/migrations/` | SQL generato: tabelle, RLS, realtime |
| `supabase/functions/` | Edge Functions (portate dalle funzioni Base44) |
| `scripts/` | generatore schema, import dati, stack locale, test |
| `docs/` | inventario, migrazione, screenshot |

## Sviluppo locale (senza account)
```bash
# 1. backend locale: Postgres + PostgREST + auth di sviluppo su :54321
#    (serve il binario PostgREST in scripts/local/bin/postgrest, v12)
scripts/local/dev_stack.sh            # --reset per ricreare il DB con i dati sintetici

# 2. app
cd app && npm install                 # senza .env usa il progetto Supabase predefinito;
#                                       per lo stack locale crea .env come in .env.example
npx expo start                        # Expo Go / dev build;  --web per il browser
```
Utenti di prova: `admin@vibra.local`, `super4@vibra.local`, `pr@vibra.local`, password `vibra`.

## Test
```bash
scripts/test_db.sh                    # migrazioni + test delle policy RLS
cd app && npm test && npx tsc --noEmit
node scripts/e2e_web.mjs <cartella>   # flusso login → clienti → dettaglio nel browser
```

## Schema
Lo schema si rigenera dalle entità: `python3 scripts/gen_schema.py schema/entities supabase/migrations`
(aggiorna anche `schema/schema.json` e `app/src/lib/schema.generated.ts`).

## Build
- Android (APK interno): `npx eas-cli build -p android --profile preview`
- iOS: `npx eas-cli build -p ios` (serve Apple Developer Program), distribuzione TestFlight.

## Stato del porting
Vedi `docs/INVENTARIO.md`. Fatto: schema + RLS, adapter dati, login, navigazione per ruolo,
lista e dettaglio Clienti. Le altre sezioni mostrano "in fase di porting".
