# Stato lavori VIBRA nativa (da riprendere in una nuova sessione)

## Obiettivo e regole
- Copia **identica** (grafica e funzioni) dell'app web VIBRA su Base44 (app `69de4f1f7f53d9f187d01392`) in
  React Native/Expo (Expo 57, RN 0.86 nuova architettura), Android + iOS. Si riscrive solo l'interfaccia.
- **Backend: Base44** vero (`@base44/sdk` 0.8.53: dati, funzioni, automazioni, file, login).
- **Sola lettura**: mai scritture su Base44 né sul repo originale; l'app è in "modalità prova"
  (`app/src/lib/readonlyGuard.ts`) finché l'utente non dà l'ok (`EXPO_PUBLIC_BASE44_READONLY=0`).
- Supabase solo come stack di prova locale con dati sintetici (`EXPO_PUBLIC_BACKEND=local`) per i confronti.
- Repo https://github.com/adiosfull-svg/VIBRA-NATIVE. Lavoro sul branch **`claude/awesome-tesla-ovfcmf`**
  (NON ancora unito a `main`; PR adiosfull-svg/VIBRA-NATIVE#1).

## Ambiente (nuova sessione)
1. Originale: `add_repo` adiosfull-svg/VIBRA (sola lettura), poi
   `git clone --depth 1 https://github.com/adiosfull-svg/vibra /home/user/vibra-reference`.
2. Stack locale: `mkdir -p scripts/local/bin && curl -sSL https://github.com/PostgREST/postgrest/releases/download/v12.2.3/postgrest-v12.2.3-linux-static-x64.tar.xz | tar xJ -C scripts/local/bin`
   poi `scripts/local/dev_stack.sh --reset`. Utenti admin/pr/super4 `@vibra.local`, password `vibra`.
   Lo stack accetta scritture: per avere dati (clienti, semine) crearli dai form del nativo.
3. App: `cd app && npm install && printf 'EXPO_PUBLIC_BACKEND=local\nEXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\nEXPO_PUBLIC_SUPABASE_ANON_KEY=dev\n' > .env`
   (`EXPO_OFFLINE=1` per expo: api.expo.dev è bloccato). Codemod: `cd scripts/port && npm install`.
4. Originale avviabile: `tools/web-ref/setup.sh /home/user/vibra-reference` (porta 5173, `?as=pr|admin|super4`).
5. `tools/compare/up.sh` avvia (o riavvia) stack :54321, originale :5173, nativo web :8081.
6. Verifiche: `cd app && npx tsc --noEmit -p . && npm test`; bundle Android:
   `EXPO_OFFLINE=1 npx expo export --platform android --output-dir <tmp>`.
7. APK: commit con `[apk]` nel messaggio → GitHub Actions (~14 min), link fisso
   https://github.com/adiosfull-svg/VIBRA-NATIVE/releases/download/anteprima/vibra.apk
   (stato con l'MCP GitHub `actions_list`). Nella release gli errori JS mostrano la schermata di
   `lib/crashReport.tsx`: chiedere all'utente testo/screenshot.

## Metodo per una pagina
1. File mancanti: `node scripts/port/tree.mjs /home/user/vibra-reference/src /home/user/vibra-reference/src/pages/<Pagina>.jsx`
   (elenco dei file della pagina) e conversione di ognuno che manca in `app/src/web/`:
   `node scripts/port/codemod.mjs <src-originale>/<f> app/src/web/<f> --src /home/user/vibra-reference/src`
   (i `.js` diventano `.jsx`). Il codemod segna i punti manuali con `PORT-TODO`.
2. Route: sostituire il `ComingSoon` in `app/src/app/(app)/...` con `<Page><Pagina /></Page>` (vedi
   `(tabs)/programmazione.tsx`).
3. Confronto: `node tools/compare/measure.mjs <out> /<route> pr,super4 "<passi>"` (screenshot `-ref/-nat` +
   `dy` dei testi comuni; passi: `click:<testo>`, `click~`, `nth:`, `wait:`, `type:`, `key:`, `scroll:`,
   `scrollto:<y>`), causa con `node tools/compare/probe.mjs <ruolo> <route> "<testo>" [livelli] [passi]`.
   Normali: dy/dx piccoli su pulsanti, badge, celle `<td>` (il web misura il contenitore), testi nascosti duplicati.
   La tabella mensile di I Miei Progressi a volte misura righe più alte (intermittente: rimisurare).
4. Correggere nello strato `app/src/ui/` (vale per tutte le pagine), modificare il codice di pagina solo se
   necessario (commento `// PORT:`); dopo ogni correzione rimisurare Clienti/Dashboard/Il Mio Vibra (regressioni).

## Fatto
- **Shell**: header, MobileNavBar, Sidebar, NotificationBell, AccountMenu, Ricerca (VibraSearch), Calcolatrice
  globale (`app/(app)/_layout.tsx`), route con gli stessi percorsi. Login Google con Base44: PC ok; telefono ok
  tramite la pagina ponte `/accesso-app` dell'app Base44 (`LOGIN_BRIDGE_URL` in `base44Remote.ts`, da passare a
  `https://vibrayourparty.com/accesso-app` quando l'utente pubblica).
- **Pagine convertite e identiche all'originale (web, pr/admin/super4)**: Clienti (tutte le tab, dettaglio,
  dialog, Mappa Leaflet in iframe/WebView), Dashboard, Il Mio Vibra (tutte le 8 tab + Calcolatrice),
  Weekend/Programmazione (6 tab, Aggiungi Semina), Semine (card che si girano).
- **APK**: si avvia, login ok (fix TextDecoder latin1 per Hermes, jsPDF caricato solo all'export).
- **Strato `ui/`** (emulazione CSS/DOM, principali regole):
  - testo: ereditarietà classi/stile, Inter per peso, line-height ereditata (`textLeading.ts`), strut delle
    righe per span/label e per inline-flex/inline-block/`<button>` in linea (`inlineBlockMargins`),
    campi di testo a 16px con line-height ereditata e classi `focus:` (ring/bordo, `focusStyle.ts`).
  - layout: flex-shrink solo nei flex CSS, min-width:auto (`useMinContentWidth`, `useRigidMinWidth`; non per
    flex-wrap), space-x/y come gap con le regole CSS (margini inline, figli dopo assoluti, mt/mb annullati,
    primo mb che collassa: `spaceMargins.ts`), griglie (colonne uguali, template fr/auto/px anche da
    `style.gridTemplateColumns`/`repeat()`, righe esplicite e `row-span` con `ExplicitGrid`),
    Fragment/Suspense/AnimatePresence trasparenti (`cssChildren`), tabelle a layout automatico, `fixed` alla radice.
  - aspetto: gradienti (arrotondati col raggio, senza overflow-hidden), `boxShadow` CSS completo, `ring-*` come
    boxShadow, backdrop-blur, zIndex 1 agli elementi posizionati (ordine di disegno CSS), `pointerEvents`,
    radici di Dialog/Popover/Menu/Select con `display: contents`, testo del Select ereditato dal trigger.
  - animazioni: `motion.tsx` (opacity/x/y/scale/rotate, width/height, %; anima il Div stesso).
  - librerie sostituite: recharts (`recharts.tsx`), uPlot (`uplot.tsx`, scala come uPlot), react-markdown
    (`markdown.tsx`), @hello-pangea/dnd (`web/shims/dnd.tsx`), Leaflet (`ui/map/`), Radix (`@rn-primitives`).
  - DOM sul telefono: shim `web/shims/dom.ts` (window/document/localStorage/sessionStorage/scroll della
    pagina/eventi), ref delle ScrollView con `scrollTo({left})`/`scrollLeft`, gesture web sui Div
    (`gestures.ts`), form/data/file nativi; sul web classi proprie dell'index.css in `customCss.web.ts`.
  - card che si gira sul telefono: `ui/flip.tsx` + `web/hooks/useFlipGesture.native.jsx`.

## Da fare
1. **Prova dell'utente sull'APK** (build del 10/10 con tutto il lavoro): Il Mio Vibra (grafici tocco/pinch,
   note trascinabili, chat AI, Calcolatrice trascinabile, tab centrata), Weekend (menu del tasto lungo,
   swipe in Da ricontattare), Semine (Gira e trascinamento delle card), e dalle sessioni prima: selettori
   data/ora, foto/file, swipe dei leader, albero (trascinamento/pinch), chiusura dei dialog toccando fuori,
   scorrimento dei dialog e del dettaglio cliente, export PDF/CSV della Dashboard. Correggere gli errori segnalati.
2. **Pagine ancora `ComingSoon`** (stesso metodo): Promoter (lista e dettaglio `promoter/[id]`), Serate,
   Importa serata, Locali, Messaggi, VibraGPT, Ricerca AI, Report, Clienti analytics, Notifiche,
   Impostazioni app, Formazione, Academy, Download, Admin console.
3. Telefono: pull-to-refresh di Semine (oggi inerte: ascolta i touch del `document`; usare il RefreshControl
   della ScrollView di `Page`); `onPaste` (incolla foto/contatto) non esiste su RN (accettato).
4. Notifiche push (expo-notifications al posto del web push).
5. Con l'ok dell'utente: togliere la modalità prova e provare i salvataggi su Base44; unire il branch a `main`.

## Differenze note (accettate)
- Dialog Radix: nell'originale il primo campo prende il fuoco all'apertura.
- Form Nuovo Cliente: l'originale è 7px più largo; tabella "Media tavoli": colonna Locale non va a capo.
- «Strada verso la vetta» (Achievement): l'originale è ~20px a sinistra del centro (offsetLeft del DOM).
- Freccia «→»: nel container l'originale usa un font di ripiego (il sottoinsieme latin di Inter non ce l'ha).
- Logo «Vibra» dell'header: immagine esterna non raggiungibile dal container (manca in entrambe).
