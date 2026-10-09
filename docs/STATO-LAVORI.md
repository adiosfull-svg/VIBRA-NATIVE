# Stato lavori VIBRA nativa (da riprendere in una nuova sessione)

## Obiettivo e regole
- Copia **identica** (grafica e funzioni) dell'app web VIBRA su Base44 (app `69de4f1f7f53d9f187d01392`) in React Native/Expo, Android + iOS.
- Base44 **solo in lettura**: mai tool di scrittura. Backend nuovo: Supabase.
- Repo: https://github.com/adiosfull-svg/VIBRA-NATIVE (branch `main`).

## Ambiente da ricreare in una nuova sessione
1. Codice originale (riferimento, NON nel repo): rileggerlo da Base44 con `read_file` a blocchi di 50 file
   in `/home/user/vibra-reference` (464 file; elenco con `list_directory` ricorsivo).
2. Backend locale: `scripts/local/dev_stack.sh --reset` (serve il binario PostgREST v12.2.3 in
   `scripts/local/bin/`, scaricabile da GitHub releases). Utenti: admin/pr/super4 `@vibra.local`, password `vibra`.
3. App: `cd app && npm install && cp .env.example .env && EXPO_OFFLINE=1 npx expo start --web --port 8081`
   (`EXPO_OFFLINE=1` perché api.expo.dev è bloccato dal proxy; idem per `npx expo install`).
4. App originale di riferimento: `tools/web-ref/setup.sh /home/user/vibra-reference` poi `tools/web-ref/run.sh`
   (porta 5173, `?as=pr|admin|super4`). Confronti con Playwright (Chromium in /opt/pw-browsers).
5. Tool del codemod: `cd scripts/port && npm install`.

## Fatto
- Schema Supabase generato dalle entità (`scripts/gen_schema.py`), RLS testate (`scripts/test_db.sh`).
- Import dati Base44→Supabase (`scripts/import_base44.py`), guida `docs/MIGRAZIONE.md`.
- Strato di compatibilità web→nativo in `app/src/ui/`:
  `html.tsx` (Div/Span/P/Btn con ereditarietà stili testo), `text.tsx` (font Inter per peso, line-height 1.5,
  flex-shrink 1 come CSS), `webClasses.ts` (flex in riga, space→gap, grid, gradienti, ring),
  `webStyle.ts` (style CSS → RN), `elements.tsx` (img, a, table, input, select, svg),
  componenti shadcn (`button, card, badge, input, dialog, menu, misc`), `icons.generated.ts`
  (178 icone da lucide 0.475 identiche), `motion.tsx` (framer-motion), `recharts.tsx`, `use-toast.tsx`, `sonner.ts`.
- `app/src/lib/base44.ts`: stessa API dello SDK sopra Supabase. `app/src/web/router.tsx`: API react-router.
- Shell portata e verificata uguale all'originale: header, MobileNavBar (pill, drag, menu radiale), Sidebar,
  NotificationBell, AccountMenu. Route con gli stessi percorsi dell'originale.
- Codemod `scripts/port/codemod.mjs` (+ `tree.mjs` per trovare i file di una pagina): converte i file originali
  in `app/src/web/...` mantenendo codice identico; segna i punti manuali con `PORT-TODO`.
- Pagina Clienti: 74 file convertiti, compila e si vede quasi identica all'originale.

## In corso / prossimi passi
1. **Spaziature Clienti**: `gap-y-*` (da `space-y-*`) non generato da NativeWind. Fare:
   - aggiungere in `app/tailwind.config.js` la safelist
     `{ pattern: /^gap-[xy]-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24)$/, variants: ['sm','md','lg'] }`
     (la modifica era stata interrotta, NON è applicata);
   - riavviare Metro con `--clear`, riverificare con lo script di misura (stili calcolati ref vs nativo).
   - rigenerare `node --experimental-strip-types scripts/gen_safelist.mjs` dopo ogni nuovo porting.
2. Sistemare i `PORT-TODO` dei file Clienti (listener window/document, createPortal→Modal, input date/file,
   clipboard/share), poi dettaglio cliente, dialog, tab Gruppi/Parco/Albero/Tabelle/Growth/Analitica.
3. ClientMap (Leaflet) → react-native-maps (ora segnaposto). VibraSearch (pulsante Cerca) da portare.
4. Altre pagine con lo stesso metodo (tree.mjs → codemod → shim → confronto screenshot): Il Mio Vibra,
   Dashboard, Weekend, Semine, Promoter, Serate, Locali, Messaggi, VibraGPT, Report, Impostazioni...
5. Edge Functions Supabase (27 funzioni Base44), cron dei workflow, push con expo-notifications.
6. Logo Vibra e foto: ora URL dello storage Base44 (bloccato dal container, funziona su telefono): da
   includere negli asset / Storage Supabase prima di dismettere Base44.
7. Build: `npx eas-cli build -p android --profile preview` (APK), iOS con Apple Developer.
