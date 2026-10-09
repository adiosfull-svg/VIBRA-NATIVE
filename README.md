# vibra-mobile

Versione nativa (Android e iOS) di VIBRA, scritta in React Native con Expo. Il backend è lo
stesso dell'app web: **Base44** (dati, funzioni, automazioni, file, login con Google) tramite
lo SDK ufficiale. Finché non si toglie la "modalità prova" l'app legge i dati veri ma non scrive.

## Struttura
| Cartella | Contenuto |
|---|---|
| `app/` | App Expo (SDK 57, expo-router, TypeScript). Le route stanno in `app/src/app/` |
| `app/src/lib/` | client Base44 (`base44Remote.ts`), modalità prova (`readonlyGuard.ts`), auth, ruoli; stack di prova (`localBackend.ts`) |
| `app/src/legacy/` | logica di business copiata 1:1 dall'app Base44 (ranking, achievement, obiettivi...) |
| `app/src/features/` | schermate e componenti per area (clienti, ...) |
| `schema/entities/` | definizioni entità Base44: fonte dello schema |
| `supabase/migrations/` | SQL generato: tabelle, RLS, realtime |
| `supabase/functions/` | Edge Functions (portate dalle funzioni Base44) |
| `scripts/` | generatore schema, import dati, stack locale, test |
| `docs/` | inventario, migrazione, screenshot |

## Avvio rapido (dati veri Base44, sola lettura)
```bash
cd app && npm install
npx expo start --web                  # http://localhost:8081 → "Continua con Google"
npx expo start                        # telefono: Expo Go + QR code
```

## Sviluppo con lo stack di prova (dati sintetici, senza account)
```bash
# 1. backend locale: Postgres + PostgREST + auth di sviluppo su :54321
#    (serve il binario PostgREST in scripts/local/bin/postgrest, v12)
scripts/local/dev_stack.sh            # --reset per ricreare il DB con i dati sintetici

# 2. app
cd app && npm install                 # crea .env con EXPO_PUBLIC_BACKEND=local (vedi .env.example)
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
