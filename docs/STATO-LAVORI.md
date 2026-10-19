# Stato lavori VIBRA nativa (da riprendere in una nuova sessione)

## Obiettivo e regole
- Copia **identica** (grafica e funzioni) dell'app web VIBRA su Base44 (app `69de4f1f7f53d9f187d01392`) in
  React Native/Expo (Expo 57, RN 0.86 nuova architettura), Android + iOS. Si riscrive solo l'interfaccia.
- **Backend: Base44** vero (`@base44/sdk` 0.8.53: dati, funzioni, automazioni, file, login).
- **Sola lettura**: mai scritture su Base44 né sul repo originale; l'app è in "modalità prova"
  (`app/src/lib/readonlyGuard.ts`) finché l'utente non dà l'ok (`EXPO_PUBLIC_BASE44_READONLY=0`).
- Supabase solo come stack di prova locale con dati sintetici (`EXPO_PUBLIC_BACKEND=local`) per i confronti.
- Aggiornamento 15/10: il lavoro sulle prestazioni continua su **`ccr-962ba42f-zm78fv`** (da
  `claude/charming-franklin-gint2k` → `claude/serate-admin-optimization-4ro02f`): audit applicato, risultati e
  lezioni in docs/PIANO-PRESTAZIONI.md (gara del 15/10). Una nuova sessione parte da lì.
- Aggiornamento 17/10: `claude/charming-franklin-gint2k` = ccr-962ba42f + strato ui dell'audit (F34, F25, F33) e
  gara di Serate (PIANO-PRESTAZIONI, gara del 17/10). Da unire in ccr-962ba42f quando l'utente lo chiede.
- Repo https://github.com/adiosfull-svg/VIBRA-NATIVE. Branch con TUTTO il lavoro (fino al 14/10): **`claude/amazing-babbage-bfbu65`**
  (catena awesome-tesla → ecstatic-dirac → practical-mccarthy → amazing-babbage; NON ancora unito a `main`).
  Una nuova sessione parte da qui (`git checkout -B <suo-branch> origin/claude/amazing-babbage-bfbu65`).
  NB: la cache dell'APK nativo dell'emulatore è per branch: il primo giro su un branch nuovo fa la build completa (~25 min).

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
0. **Regole di fluidità: `docs/REGOLE-PRESTAZIONI.md`** (precaricamento, prefetch, liste virtualizzate,
   niente ridisegni globali, animazioni sul thread UI, cache immagini). Si applicano DURANTE la
   conversione; la checklist del §9 è parte della definizione di "pagina finita".
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
  14/10: Clienti analytics, Notifiche, Formazione, Download, VibraGPT, Ricerca AI, Admin console (confronto
  web uguale), Serate, Importa serata, Locali, Report, Messaggi, dettaglio Promoter (confronto web uguale salvo
  tabella Fatturato per Locale: colonna "Media Tav." che nell'originale va a capo). Emulatore:
  `tests/emulatore/admin/03-pagine-nuove.yaml` le apre tutte (deep link) e cerca la schermata d'errore. Accessi come l'originale: `web/components/RoleGate.jsx` (convertito) nelle route.
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
  - 14/10: griglie a una colonna senza gap orizzontale; icone `inline` nel testo; blocco con `mx-auto` largo
    quanto il contenitore (fino a max-w); elementi con transform disegnati con i posizionati (zIndex 1); style
    con `max()/min()` di lunghezze; recharts senza asse delle categorie se non ci sono dati; `motion.img`.
  - controlli: `<input type=color>` (`colorField`), checkbox/radio (`checkField`: input vero sul web, riquadro
    sul telefono), `<datalist>` (`datalist.tsx`: suggerimenti sotto il campo), `<label>` → `HtmlLabel`
    (riquadro o testo in linea; toccarlo attiva checkbox/radio/Switch dentro, `labelControl.ts`); il Label di
    shadcn passa da HtmlLabel.
  - codemod: dopo il reprint di recast rimette i testi JSX originali (`scripts/port/jsx-text-check.mjs`, perdeva
    spazi: `{mod} ({count})` → `{mod}({count})`); da solo controlla tutti i file convertiti.
  - stack di prova: `entityCore.fromDbRow` dà created_date/updated_date senza fuso come Base44 (con '+00:00'
    il `parseUTC` dell'originale dava "Invalid time value").
  - numeri sul telefono (`fastIntl`): punto delle migliaia già da 4 cifre come Chrome (6.182), non come l'ICU
    di Node/Hermes (6182).
  - min-width: auto (min-content) dei pulsanti in una riga flex: senza testo a capo → flexShrink 0 (statico);
    con testo a capo → web `min-width: min-content`, telefono una misura (onTextLayout, MinContentProbeContext).
    Celle di griglie 3+ colonne sul telefono: parola spezzata → misurata, diventa minWidth (NarrowCellContext).
  - shim visualViewport sul telefono (Keyboard): barra di VibraGPT, ricerca, menu sopra la tastiera; VibraGPT
    senza fuoco automatico sul telefono. Vetro dentro uno sfondo pieno: niente blur della pagina sotto.
  - `calc(100% ± Npx)` di larghezza/altezza con left/top → right/bottom negativo; Path con setAttribute sul
    telefono (bordo del binario di Academy); icone SVG relative sul web (customCss.web.ts).
  - liste lunghe: `web/hooks/useProgressiveList` (montaggio progressivo, righe ad altezza variabile): Serate,
    Promoter > Serate, selettore del Report, conversazioni di Messaggi, log della Console Admin.
  - 14/10 sera: Promoter (lista), Impostazioni app, Academy convertite (58 file). Shim `react-leaflet`/`leaflet`
    (`web/shims`, mappa vera in `ui/map/genericMap` + `leafletGeneric.ts`: GeoJSON con stile/tooltip/hover,
    segnaposto, popup come scheda nativa): mappa di copertura di Napoli. `lib/pagePreload` = no-op.
    Editor di testo formattato `ui/richEditor` (contentEditable vero, WebView sul telefono): notifiche manuali.
  - L'ORIGINALE CAMBIA: confronto automatico dei file convertiti con l'originale di oggi (codemod in una
    cartella temporanea + diff a token): trovata la tab "Comitive" di Clienti (nuova), aggiunta. Rifarlo
    ogni tanto (vedi sessione del 14/10). Icone nuove: `node scripts/gen_icons.mjs <src> tools/web-ref/.app/node_modules`;
    `scripts/port/check-imports.mjs` controlla anche pacchetti npm e icone mancanti.
  - CRASH nativo all'avvio (2 su ~20 giri): SIGSEGV dentro GWP-ASan (android_unsafe_frame_pointer_chase in
    GuardedPoolAllocator::deallocate da libhermesvm), non un errore di memoria dell'app → plugin
    `app/plugins/withGwpAsanOff.js` (android:gwpAsanMode="never"). Verificare nei prossimi giri.
  - `document.getElementById` emulato: registro degli `id` (`ui/domStyle.ts`, Div e input file li registrano;
    il codemod non toglie più `id`), `el.scrollIntoView({block})` scorre la pagina (`pageScroll`). Serve a
    Academy (rotella laterale, salti a una scheda), agli achievement e al click sugli input file nascosti.
    Academy: schede in `memo` (AcademyTileRow) montate a gruppi di 4 (`useProgressiveList`, `showAll()` prima
    di un salto). Il giro emulatore admin del 14/10 (run 38604044643) è fallito per l'emulatore scaricato
    corrotto ("Error on ZipFile unknown archive"), non per l'app.
  - `<style>` dell'originale → `<CssStyleTag />` (ui/cssStyleTag.tsx, non disegna nulla): in CSS conta come
    fratello per `space-*`, quindi l'elemento dopo prende il margine (+16px nella mappa di copertura,
    ClientMap, ComitivaEditor). TabsTrigger applica `data-[state=active|inactive]:` (ui/dataState.ts):
    tab attiva di Promoter con bg-card come nell'originale.
  - Entità nuove dell'originale: Comitiva, ClientLink, ClientMapLayout (schema/entities da Base44, sola lettura;
    `python3 scripts/gen_schema.py schema/entities supabase/migrations`). Sullo stack locale già creato si
    aggiungono a mano le righe nuove delle migrazioni + `NOTIFY pgrst, 'reload schema'`. Ricontrollare ogni tanto
    con list_entity_schemas: senza l'entità il pulsante «Crea comitiva» dava «reading 'create'».
  - `radial-gradient` (12 file: griglia a puntini delle Comitive, aloni di carte e statistiche): sul web CSS,
    sul telefono `experimental_backgroundImage` di RN (con backgroundSize/Position/Repeat).
  - Titolo dell'header sul web: stesso ciclo di FitTitle (adjustsFontSizeToFit c'è solo sul telefono).
  - Precaricamento delle tab: una volta per sessione e solo con le tab a schermo. Da una pagina dello stack
    aperta da un link, il prefetch montava un altro layout delle tab che ripartiva da capo (un giro ogni 2,6 s) e
    il link successivo (vibra://notifiche, flow 03 admin del run 38608694922) non cambiava pagina.
    NB: il job dell'emulatore risulta verde anche con un flow fallito: guardare `esito.txt` nel branch dei risultati.
  - confronti: dopo il login il mouse va a (0,0) (prima restava sopra la pagina e attivava `group-hover`).
    Il titolo dell'header troncato sul web è normale (adjustsFontSizeToFit funziona solo sul telefono).
  - Barra in basso e menu laterale (17/10, thread "Navbar e logo del menu"): il menu laterale non usa più
    `display: none` (Fabric ricreava tutte le viste e ricaricava le immagini a ogni apertura: il logo VIBRA
    compariva ~1 s dopo il pannello); resta montato fuori schermo. MobileNavBar: tocchi e trascinamento sul
    thread UI con RNGH `useManualGesture` + Reanimated (pillola, scala e colore delle icone come le transizioni
    CSS dell'originale); al JS arriva solo l'esito (`scheduleOnRN`). Verifica: video della gara navbar (logo
    visibile in ogni frame dell'apertura), flow pr 05-tab-ritorno e 07-menu-laterali superati (run 39049187912).
  - Secondo giro (17/10, dopo la prova dell'APK: menu che lagga, barra non fluida al trascinamento, cambio pagina
    non fulmineo): flag Reanimated `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS`; contesti separati per i pannelli aperti
    (`useLayoutUIOpen`: aprire il menu non ridisegna la barra); contenuto del menu laterale aggiornato solo da
    fermo; navigatore delle tab proprio (`ui/vibraTabs.tsx`, cambio pagina sul thread UI al rilascio del dito,
    velo sul vetro finché il blur insegue). Percorso `tests/emulatore/fluidita-nav/`. Strumento `profilo_js: si`.

## Fluidità (12/10) — regole in `docs/REGOLE-PRESTAZIONI.md`
- Menu laterali (burger e ingranaggio): erano `<Modal>` montati all'apertura e il menu account era nell'header
  di OGNI pagina (con le tab precaricate se ne aprivano 5 insieme). Ora un pannello unico per tipo nel layout
  (`ui/sideDrawer.tsx`: Reanimated sul thread UI, contenuto premontato in memo, `display: none` da chiuso,
  tasto Indietro, elevation sopra la nav bar), `layoutUI` con contesti stato/azioni separati
  (`useLayoutUIActions` negli header: aprire un menu non ridisegna le pagine). Test `pr/07-menu-laterali`.
- Elementi `fixed` delle pagine (`ui/fixedPortal.tsx`): solo quelli della pagina in primo piano (il pulsante
  di ricerca di Clienti compariva su tutte le tab), nell'host `FixedHost` del layout sotto i pannelli.
- Immagini: `ui/imageCache.ts` (`IMAGE_CACHE` = memory-disk, `prefetchImages`, immagini "già caricate"
  mostrate da CachedImage senza dissolvenza); il default di expo-image era solo disco (flash al rimontaggio).
- Precaricamento: elenco unico `lib/preloadRoutes.ts`. Liste in riquadri: `ui/windowedList.tsx`
  (selettore "Tramite" di ClientSourceDisplay). Pull-to-refresh nativo della pagina
  (`hooks/usePullToRefresh.native.jsx` → RefreshControl di Page; Semine).
- Textarea con `leading-*`: interlinea sulla dimensione del campo (nota delle semine a 11px).
- **Cambio tab senza ridisegni**: `useRoutePath`/`useNavigation`/`useFocusEffect` di expo-router leggono un
  contesto che cambia a OGNI navigazione: tutte le pagine montate si ridisegnavano (Il Mio Vibra ~400 elementi
  a ogni ritorno). Ora `web/screenNavigation.ts` (contesto stabile dello schermo), percorso proprio da
  `OwnPathProvider` (in Page), AppHeader in memo; `useRoleAccess` e `stickyHeaderContext` con valori stabili.
  Verificato sull'emulatore: dopo il caricamento Il Mio Vibra non si ridisegna più cambiando tab.
- Diagnostica: `useWhyRender(nome, valori)` (`lib/testDiag.ts`, build di test) dice perché un componente si
  ridisegna (logcat "VIBRA why"); metterlo in cima al componente, poi toglierlo.
- Stato vuoto di Clienti: già identico all'originale (verificato sul web svuotando i clienti del pr).

## Fluidità (14/10) — misure sull'emulatore
- **Intl lento su Hermes Android** (causa dei blocchi di 6-14 s dopo il login): `localeCompare`,
  `toLocaleString`, `toLocaleDateString` passano da Java/ICU a ogni chiamata; l'ordinamento delle ~950 località
  di `web/lib/campaniaLocations.jsx` (caricato dal precaricamento di Weekend) bloccava il JS. Ora
  `lib/fastIntl.ts` (installato da `lib/fastIntlInstall.ts` in `app/_layout.tsx`, solo telefono): confronto e
  numeri it-IT in JS puro, verificati contro ICU (`lib/fastIntl.test.ts`; attenzione: in italiano 1000 senza
  punto, 12.345 col punto; arrotondamento sulle cifre decimali come Intl). Dopo: spariti i blocchi lunghi.
- **Pagine precaricate montate in una transition** (`Page.tsx`, `startTransition`): React cede il passo ai tocchi.
- **Blur durante lo scroll**: sull'emulatore (GPU software) senza blur i frame dello scroll costano ~1/3
  (~240 ms contro ~700 ms). Sui telefoni veri il blur Android 12+ è su GPU: NON tolto; da verificare sul
  telefono dell'utente se lo scroll scatta (eventuale ripiego: velo senza blur durante lo scroll).
- Restano i montaggi delle pagine (1-4 s sull'emulatore, migliaia di Div): si sta misurando quanto pesa il
  corpo di `Div`/`Text` (`div-corpo`/`text-corpo` nel battito) rispetto a NativeWind/React.
- Strumenti di misura (solo build di test, `lib/testDiag.ts`): battito con `frameMax` (frame JS più lungo) e
  tempi `| nome:ms` (`diagTime`/`diagTimed`), `VIBRA mark` (layout/route/Page), `VIBRA query` (avvio/fetch/
  success con righe), `useWhyRender`. Script di analisi: per ogni battito con ritardo, il passo Maestro
  precedente (confronta i timestamp di `maestro-debug/*/*/commands.json` col logcat; vedi sessione del 14/10,
  ricrearlo: ~30 righe Python).

## EMULATORE ANDROID (strumento principale da ora: lavorare in autonomia)
Workflow `.github/workflows/emulatore.yml` (runner GitHub con KVM, gratis: repo pubblico):
- APK x86_64 col backend di PROVA locale (stack Postgres+PostgREST+gateway avviato sul runner, `adb reverse
  tcp:54321`), accesso automatico `EXPO_PUBLIC_TEST_LOGIN` (authLocal.ts), 450 clienti sintetici, Android 14,
  grafica `swangle_indirect` (swiftshader fa cadere l'emulatore scorrendo i grafici), avvisi ANR spenti.
- APK nativo in cache (chiave: package-lock, app.json, patches, assets, plugins): se cambia solo il JS si
  rigenera il bundle Hermes e lo si sostituisce nell'APK (giro ~6-7 min; build completa ~20 min).
- Matrice per utente `admin` e `pr` in parallelo: percorsi Maestro in `tests/emulatore/<utente>/*.yaml`
  (sotto-percorsi `tests/emulatore/sub/`: login di riserva, chiusura avvisi di sistema), `tests/emulatore/run.sh`.
- Risultati: branch `emulatore-risultati-<run_id>-<utente>` (e `emulatore-risultati-<utente>` l'ultimo):
  `git clone --depth 1 -b <branch> https://github.com/adiosfull-svg/VIBRA-NATIVE`; screenshot in
  `maestro-debug/*/<flow>/takeScreenshot` e `/screenshots` (fallimenti), `logcat-full.txt`, `*.log` di Maestro.
- Avvio: push con `[emu]` nel messaggio, oppure MCP GitHub `actions_run_trigger` run_workflow `emulatore.yml`
  sul branch con input: `flows` (file o cartella), `app_ref` (SHA COMPLETO: confronto con versioni vecchie),
  `extra_env` (es. `EXPO_PUBLIC_TEST_TRACE=1`, `EXPO_PUBLIC_TEST_NO_BLUR=1`, separati da ;), `gpu`.
  Stato: `curl -s https://api.github.com/repos/adiosfull-svg/VIBRA-NATIVE/actions/runs/<id>` (pubblico).
- Diagnostica nelle build di test (`lib/testDiag.ts`, `EXPO_PUBLIC_TEST_DIAG=1`): nel logcat (tag ReactNativeJS)
  "VIBRA diag battito" ogni 2 s (se si ferma il JS è bloccato) con i render di div/btn/text; "VIBRA layout"
  = radiografia della pagina 9 s dopo l'apertura (albero con [x,y LxA] e testo, dalle API DOM di Fabric):
  trova subito elementi giganti/coperti. `EXPO_PUBLIC_TEST_TRACE=1`: una riga per elemento disegnato
  (l'ultima prima di un blocco dice dove).
- Concorrenza a livello di job in entrambi i workflow (i push senza tag non annullano build in corso).
- APK per il telefono dell'utente: `[apk]` o run_workflow `android-apk.yml`; link fisso release "anteprima".
- Gara barra in basso e menu (17/10): input `gara: navbar` (anche `app_ref`). `tools/gara/navbar.mjs` fa gli
  stessi tocchi adb su nativa e originale (Chrome, :5173) e registra il video dal lato host (`adb emu
  screenrecord`, ~13 fps; quello del telefono dà ~3 fps); `tools/gara/navbar_analisi.py` → `navbar.md`.
  Limite: con swangle l'emulatore disegna ~1,5 frame/s sia per la nativa sia per Chrome, quindi i ms sono
  dominati dall'emulatore. Serve per vedere cosa compare frame per frame (es. il logo del menu), non per
  misurare la fluidità: quella si giudica sui telefoni veri.

## Lezioni sullo strato ui/ e sul telefono (10-11/10, tutto verificato sull'emulatore)
- **17/10 barre orizzontali delle tab (sticky e non)**: dopo uno scorrimento il primo tap su una tab andava
  perso (emulatore: 0 su 12). Due cause, corrette in `ScrollBox` di `ui/html.tsx` (solo Android, `overflow-x`):
  1) lo scroller nativo resta "in corso" (coda del lancio, rimbalzo invisibile al bordo) e HorizontalScrollView
  si prende il tocco → si ferma al bordo o sotto 0,15 dp/ms, solo per i lanci del dito (lo scrollTo smooth
  della tab attiva di Il Mio Vibra non va fermato), `overScrollMode="never"`;
  2) il tocco arriva alla barra (touchstart/touchend) ma non al pulsante (responder di RN dopo il gesto annullato
  dal nativo) → tap di riserva: la barra riconosce il tap e lo consegna al Btn sotto il dito (`HScrollTapContext`).
  Prova: `tests/emulatore/pr/08-sticky-tap.yaml` + `.sh` (run.sh esegue `<percorso>.sh` dopo il percorso),
  `EXPO_PUBLIC_TEST_NO_FLINGSTOP=1` = comportamento di prima. Risultato: 23 tap su 24, percorsi admin/pr verdi
  (run 39047119059). run.sh taglia il logcat oltre 90 MB (GitHub rifiuta file >100 MB).
  Seconda causa trovata la sera del 17/10 (il tocco "non immediato" sul telefono): il tocco sulla SCRITTA o
  sull'ICONA della tab non arrivava mai al pulsante, solo quello sul bordo del pulsante. Le classi `hover:`
  (es. `hover:text-foreground` delle tab non attive, ereditata dal testo) fanno aggiungere a NativeWind un
  `onPress` vuoto al Text, che diventa premibile e si tiene il tocco; l'Svg dell'icona idem. Nella barra lo
  salvava il tap di riserva (+150-450 ms), fuori dalle barre il tocco sulla scritta andava perso.
  Corretto: `nativeTextClass` in `ui/text.tsx` toglie hover:/focus:/active: dal testo sul telefono, icone con
  `pointerEvents="none"` (`ui/icon.tsx`), tap di riserva dopo 50 ms. Emulatore (run 39067905613): 17 tap su 20
  arrivano direttamente al pulsante, evidenziazione ~20 ms dopo il rilascio (prima ~180 ms); pr verdi
  (run 39067907202). Regola: mai classi con stato (hover/active/focus) passate a un Text o a una View senza tocco.
- **Classi**: NativeWind scarta dvh/env()/calc() → `viewportSizeStyle` (webStyle) le calcola; le classi
  `transition-*/duration-*/ease-*/delay-*` NON vanno a NativeWind (la sua interop mandava in loop il JS:
  "Scudo OOM" nel logcat e app uccisa, era il crash del dettaglio cliente) → `ui/cssTransition.ts` anima
  opacità/sfondo/blur con Animated (anche da `style.transition`). Tailwind legge anche i COMMENTI di `src/`:
  mai scrivere classi con `env(...)` nei commenti (bundle Android rotto).
- **DOM**: `shims/dom.ts` definisce `Image` e `IntersectionObserver` globali; `ui/domStyle.ts` dà ai ref
  nativi (Div, campi) un `style` alla DOM (`el.style.x = ...` → setNativeProps o ignorato). Cercare altre API
  del browser usate senza shim quando l'utente segnala un `ReferenceError`/`TypeError`.
- **Blur** (Dimezis, `ui/pageLayers.tsx`): la nav bar sfoca la pagina
  in primo piano (BlurTargetView di Page); la barra sticky sfoca i fratelli che la seguono (`StickySplit`).
  Bersaglio della sticky oltre 8192 px (Clienti, Il mio VIBRA): Dimezis dimensiona il nodo del blur su
  tutto il bersaglio e oltre il limite delle texture non disegna → velo `background/92` (`StickyBlurTooTallContext`).
  Barra di stato e barra di navigazione di Android: colore pieno del body (`SystemBarsFill` in `(app)/_layout`).
  Entrate di `motion` con y di pochi px (6-14 → 0): niente spostamento, solo dissolvenza (richiesta utente).
- **Tab veloci**: tab precaricate dopo l'avvio (`(tabs)/_layout.tsx`), pagine in `memo`, `useLocation`
  per pagina (`LocationPublisher` + `useRoutePath`; Sidebar `useCurrentLocation`), scroll per pagina nel
  `PageLayer` (useStickySentinel, usePageWindow), contesti del layout con valore memoizzato. Regola: niente
  che si iscriva a stato GLOBALE di navigazione/scroll dentro una pagina, o tutte le tab si ridisegnano.
- **Altro**: `h-full` nelle celle di griglia = "allungati alla riga"; nav bar: vetro con pointerEvents none,
  voce da pageX; tocchi inoltrati a window/document (`windowTouchSink`); textarea `overflow-hidden` →
  `scrollEnabled={false}`.
- **Diagnostica** (solo build di test, `extra_env` del workflow): `EXPO_PUBLIC_TEST_TRACE=1` (riga per ogni
  elemento disegnato: cosa si ridisegna e quando), `EXPO_PUBLIC_TEST_CUT=<id>:<a>-<b>|<id>:none` (bisezione
  dei figli di `<TestCut id>`; nel dettaglio cliente: overlay/dialog/detail), `EXPO_PUBLIC_TEST_STRIP=<regex>`
  (toglie classi), `EXPO_PUBLIC_TEST_NO_BLUR=1`. Più giri in parallelo con `actions_run_trigger`. Per i tempi
  contano i battiti (`ritardo=`) e la traccia, non la durata dei `tapOn` di Maestro.
- **Test emulatore**: admin 01-dashboard, 02-navbar; pr 01-il-mio-vibra, 02-clienti, 03-weekend,
  04-dettaglio, 05-tab-ritorno, 06-semine. Tutti PASSATI sull'ultimo commit. Dati di prova: 450 clienti +
  12 semine (create nel workflow). I flussi pr lanciati a mano falliscono anche per admin (normale).

## Animazioni fluide (17/10) — branch `claude/animazioni-fluide`
- `ui/cssTransition`: `transition-transform`/`transition`/`transition-all` animano anche scale/rotate/translate delle
  classi (sul driver nativo); prima scattavano (scale-95 dei popup, frecce rotate-180, pallino degli Switch).
- Dettaglio cliente e hub Aggiungi Presenze: dissolvenza + scale-95 con Animated.Value avviato nel gestore del tocco,
  prima del setState (la chiusura non aspetta il ridisegno); grafici e conteggio del radar a animazione finita.
- Shim `requestIdleCallback` = dopo le animazioni in corso (InteractionManager, timeout ≥ 320 ms): prima 1 ms.
- `ui/cssAnimation`: keyframe una tantum dell'index.css (menu-pop-in/out, backdrop-fade-in/out, search-*,
  heatmap-row-in, chart-fs-in). `dash-fade-up` resta senza animazione (entrate senza spostamento, richiesta utente).
- `ui/enterView`: entrata di Dialog/AlertDialog (fade + zoom-in-95) e di Popover/Dropdown/Select (fade + 8 px).
  Le uscite restano immediate (rn-primitives smonta subito).
- `AnimatePresence` (ui/motion) ora fa le uscite `exit` (anche mode="wait", initial={false}); toast con uscita.
- Percorso `tests/emulatore/pr/09-dettaglio-apri-chiudi.yaml` (con `fluidita: si`). NB: sull'emulatore senza GPU
  gfxinfo dà il 100% di frame persi: non serve a confrontare animazioni brevi, servono i telefoni veri.
- Unito ccr-962ba42f @d2e1119 (correzione della barra delle tab, e9581c1): giro emulatore 39050068064 tutto verde
  (admin e pr, 09 compreso). Test Lab 39050065368 (Robo, S24 e Pixel 8 Pro): passato, nessun crash, frame persi
  15,6% / 8,4% (mattina: 17,8% / 7,7%; percorsi Robo diversi, non confrontabili alla lettera); Robo non ha aperto
  il dettaglio cliente.

## I Miei Guadagni virtualizzata (17/10, branch `claude/guadagni-virtualizzati`)
- `MieiGuadagniSerate.jsx`: prima tutte le righe montate (a blocchi che raddoppiavano) e ogni tasto negli input
  ridisegnava la lista intera. Ora tab "guadagni" a finestra sullo scroll della pagina con
  `usePageWindowVariable` (nuovo, `web/hooks/usePageWindow.js`: righe ad altezza variabile misurate con onLayout,
  posizione assoluta, gap = space-y), tab "serate" con `useProgressiveList`; righe in `memo` con callback stabili.
- Emulatore `tests/emulatore/pr/11-guadagni.yaml`: schermate identiche alla versione prima (app_ref e502de4).
  Dopo `openLink` (che rimonta tutta l'app) la pillola della barra resta su Semine con la versione nuova (2 giri su 2;
  la vecchia è su Il Mio): corsa nella MobileNavBar al rimontaggio, da vedere nel thread della barra.

## Altre liste virtualizzate (18/10, branch `claude/liste-virtualizzate`)
- Nuovi strumenti (REGOLE §3): `PageWindowList`, `WindowedListVariable`, `useStripWindow`; Select del telefono scorrevoli.
- Virtualizzate: griglie Semine (telefono), striscia Semine del weekend in Programmazione, heatmap Costanza,
  Target "Mostra tutti", Promoter (telefono, non in modalità manuale), Achievement (telefono), SettingsDatabase
  (eventi, categorie, clienti, achievement, ranghi), storico in ClientDetailDialog, EventCompareDialog,
  CreditUsageDashboard (ore IG), EmojiPicker, conversazioni di ChatStrategica.
- Sul telefono le card Semine eliminate spariscono senza dissolvenza (niente AnimatePresence nella griglia a finestra).
- Emulatore: `pr/12-liste.yaml`, `admin/06-promoter.yaml`; il seed ha 60 semine. Target e Costanza non si possono
  provare con i dati sintetici (0 clienti per locale, nessun dato costanza).
- Achievement era già molto lento sull'emulatore prima (swipe 4×~800 s con cc7842b); con la finestra 4×~300 s.
  Da capire la causa (animazioni continue delle card?).
- Restano da fare: tabella eventi di ReportPreview, conversazione di InstagramDMsTab, chip mobile di SeminaSidebar,
  ClientFamilyTreeMobile, MapBottomBar, sidebar di ComitivaEditor, SmartBatchImport/AttendanceHub, grafici
  "Tutti" di ClientiAnalytics, limite di EventCompareReport.

## Comitive (17/10, branch `claude/comitive-funnel`)
- Crash all'apertura di una comitiva sul telefono: l'editor era il codemod del 14/10 senza adattamenti
  (`new ResizeObserver` → ReferenceError, `el.addEventListener`, `e.target.closest`, `elementFromPoint`).
  Riconvertite le 4 parti dall'originale del 16/10 (paganti di altri PR e promoter con
  `getComitiveDirectory`, ammessa in modalità prova perché legge soltanto; dimensione delle card; ecc.).
- Strato ui: `ui/domData.ts` = attributi data-* su Div (web: dataSet; telefono: registro sull'istanza con
  closest/getAttribute/setAttribute/querySelectorAll, `document.elementFromPoint` tra gli elementi con
  attributi). Il codemod ora TIENE data-* su Div/Btn/Path (i file convertiti prima non li hanno: riconvertire
  quando serve, es. ClientSerateMenu/menu del tasto lungo). `ui/gestures`: un pointer per dito (pinch).
  Shim: ResizeObserver, matchMedia('(pointer: coarse)') vero. webStyle: color-mix(in srgb).
- Animazioni della tela sul telefono (17/10): `comitive/comitiveAnim.jsx`, un orologio Reanimated per tela (fermo
  durante pan/zoom/trascinamento e a schermata non a fuoco). Particelle, anelli cm-end-pulse e battito cm-beat sono
  View sopra l'Svg (solo transform/opacity): le prop animate di react-native-svg (cx, r...) ridisegnano tutta la
  tela a ogni frame. cm-wire-flow (fili obiettivo e filo in costruzione) = Svg piccolo attorno al filo con
  strokeDashoffset animato. cm-pop-in = Keyframe; cm-drop-ring, etichetta trascinata (cm-ghost-*) e
  .cm-list-dragging (setNativeProps sulle righe) rifatti. Particelle solo fino a 60 fili. Senza blur.
  Flow emulatore: la tab Comitive sta PRIMA di Tabelle nella barra (si cerca a passi brevi).
  Fili: Svg dimensionato sui nodi (react-native-svg non disegna fuori dal riquadro). Tocco sui fili: distanza
  dalla curva (PORT in ComitivaEditor). Emulatore: `tests/emulatore/pr/10-comitive.yaml`.
- Secondo crash (nativo) appena c'è un filo: il Path di aggancio ha `pointerEvents: 'stroke'` e RNSVG su Android
  va in IllegalArgumentException (`No enum constant ...STROKE`). `ui/elements` Path ora passa a react-native-svg
  solo auto/none/box-none/box-only. webClasses: `minmax(0,1fr)` nei grid-template (TopBar dell'editor).
  Verifica 17/10: giro 39049796947 (crea, riapre, filo "Amici", pannello card, pan) senza crash; la versione
  vecchia (eef7cd4, giro 39049798881) va in errore JS al primo tocco sulla card (onPointerDown).

## Cornice dell'app: funzioni mancanti (19/10, branch `claude/cornice-mancante`)
- **Menu del promoter col tasto lungo** (PromoterContextMenu + Info rapide + Ultime serate), montato nel layout
  `(app)/_layout.tsx`, attivo su ogni `[data-promoter-id]` (rimessi in PromoterCard, PromoterCardMobile,
  ActivePromotersPopup, LiveRankingWidget). Strato ui: i tocchi della radice arrivano ai listener touch di
  window/document (`hoverRootProps` → `rootTouch` in `ui/gestures.ts`; prima `touchstart` non arrivava MAI a
  document, quindi nessun menu della pressione lunga globale poteva partire, nemmeno ClientSerateMenu),
  `touches[i].target`, `click` in cattura di document chiamati da Btn prima dell'onClick (`clickBlocked`,
  il click guard dei menu), Btn registra i data-* come Div, Div con data-* non appiattita.
  Sul telefono il Pressable fa il click al rilascio anche dopo una pressione lunga: il menu lo ferma finché è aperto.
- **ClientSerateMenu**: `data-no-multiselect` come l'originale (card dell'editor Comitive: solo menu).
- **Swipe dal bordo sinistro** (`web/hooks/useSwipeToOpenSidebar.ts`): gesto manuale RNGH sul thread UI attorno
  alle pagine (`(app)/_layout.tsx`), stesse soglie dell'originale (zona 5-35%, fuori dai 100 px in basso,
  > 50 px e più orizzontale che verticale), apertura con l'animazione di ui/sideDrawer. Con i listener su
  document non funzionava: su Android lo ScrollView della pagina prende il tocco al primo scarto verticale di
  8 dp e a JS arriva touchcancel. Il gesto prende il tocco a 12 dp verso destra (gli scroll orizzontali nativi
  lo prendono prima, a 8 dp: restano loro); pulsanti, `<div>` con gesti propri e grafici uPlot lo bloccano dal
  JS (`touchBlockSink` in ui/gestures).
- **Scorrimento veloce col pollice** (`ui/fastScroll.tsx`, uno per Page): posizione da `useScrollOffset`,
  trascinamento con gesto RNGH + `scrollTo` di Reanimated, tutto sul thread UI.
- **Precaricamento delle foto** (Client/Semina/PromoterPhotosPreloader, VenueLogosPreloader) nel layout dopo
  2,5 s + InteractionManager; `queueImagePrefetch` (ui/imageCache): coda a concorrenza 4, priorità, max 150
  immagini in memoria poi solo disco (come preloadImages dell'originale). `legacy preloadImages` usa la coda.
- **Notifiche push**: parte client pronta (`web/hooks/usePushNotifications.ts`, expo-notifications installato,
  voce "Attiva/Disattiva notifiche Push" nel menu account, tocco sulla notifica → `action_url`), SPENTA finché
  manca il projectId EAS (`EXPO_PUBLIC_EAS_PROJECT_ID`). Il server Base44 invia solo web push (VAPID:
  `dispatchPushOnNotification`, `sendPushNotification`). Per le push sul telefono servono: progetto EAS +
  credenziali FCM (google-services.json) e APNs, e lato Base44 l'invio ai token `expo:` salvati in
  PushSubscription (API push di Expo) — decisione dell'utente, Base44 non toccato.
- **ui/html, Div che scorre con animazione** (menu-pop-in, motion): il contenitore animato prende posizione e
  misure (stile e classi: `fixed`, `w-[248px]`, `z-...`), lo ScrollView lo riempie. Prima il contenitore era
  0 di altezza: il menu si vedeva ma non riceveva tocchi né compariva a Maestro (vale anche per
  ClientSerateMenu e SeminaPasteMenu).
- Percorsi emulatore: `admin/07-menu-promoter`, `pr/13-swipe-menu`, `pr/14-fast-scroll`. Corsa completa su
  c5d47b6 (run 39275181161): admin tutti verdi, pr 01-11 verdi; la corsa pr è stata fermata dal limite di 75
  min durante 12-liste (10-comitive ~22 min e 12-liste ~41 min anche prima di questo lavoro), quindi 12, 13 e
  14 a parte sullo stesso commit: 39287139437, 39287143146, 39287147841, verdi. Il limite del job non basta
  più per tutti i percorsi pr in una corsa sola.
- Restano: data-client-id negli altri ~20 file dell'originale (ClientRowCard, ClientTableRow, RecontactList,
  SeminaCard, LeadersList...): il menu serate dei clienti sul telefono funziona solo dove l'attributo c'è
  (Comitive); riconvertirli per avere il menu del tasto lungo anche nelle liste.

## PROSSIMO PASSO
- **Crash dell'app sull'emulatore: CHIUSO (17/10).** Scansione dei logcat di tutti i 219 giri: crash dell'app
  solo (a) 10/10, Scudo OOM nel thread JS (loop delle transition di NativeWind, corretto con `ui/cssTransition.ts`);
  (b) 14/10, due SIGSEGV identici all'avvio dentro GWP-ASan (`android_unsafe_frame_pointer_chase` ←
  `GuardedPoolAllocator::deallocate` ← libhermesvm, giri 38497270069 e 38596753210), sparito dopo
  `plugins/withGwpAsanOff.js` (c9827f4): 0 crash in ~80 giri dopo e in 6 giri di ripetizione del 17/10 su c2ae595;
  (c) 14/10, NumberFormatException `calc(100% + 16px)` in RNSVG (Academy, corretto). Gli altri "Fatal" sono app di
  sistema (googlequicksearchbox, Gmail). Da ora `tests/emulatore/crash.awk` cerca i crash dell'app nel logcat:
  se ce n'è uno il giro risulta fallito, `crash.txt` con la traccia nel branch dei risultati, `crash: N` in esito.txt.
- **Misura del giro 38499126870** (02-clienti): nei frame lunghi (1-3,6 s) il corpo di Div pesa 100-670 ms e Text
  <110 ms per battito (es. 827 div/535 text/358 btn: frame 3600 ms, corpi 433 ms) → ~15-35%: il grosso è
  React + jsx di NativeWind (react-native-css-interop) + commit di Fabric. Prossima misura: tempo nel wrapper
  di NativeWind (es. Div senza className a NativeWind, stili già calcolati) prima di ottimizzare DivBoxImpl.
- Ridurre il costo del montaggio delle pagine (in base alla misura div-corpo): cache per className dei calcoli
  rimasti in `DivBoxImpl`, meno hook per Div, meno elementi nelle card più usate.
- L'utente prova l'APK: ultimo 17a7e66 del 14/10 (run 38507316797, dopo il giro emulatore 38505058808 tutto
  verde), con i miglioramenti di fluidità del 14/10. Per ogni glitch: pagina/azione/screenshot.
- Dati Base44 anonimizzati per lo stack di prova: rimandato dall'utente ("più avanti le autorizzazioni Base44").

## Prestazioni (14/10 sera)
Piano, strumenti e stato in `docs/PIANO-PRESTAZIONI.md` (gara nativa contro originale sullo stesso
emulatore: commit con `[gara]`, risultati in gara.md nel branch emulatore-risultati-<run>-<utente>).

## Da fare
1. **Prova dell'utente sull'APK** (ultima build: 11/10 sera): Il Mio Vibra (grafici tocco/pinch,
   note trascinabili, chat AI, Calcolatrice trascinabile, tab centrata), Weekend (menu del tasto lungo,
   swipe in Da ricontattare), Semine (Gira e trascinamento delle card), e dalle sessioni prima: selettori
   data/ora, foto/file, swipe dei leader, albero (trascinamento/pinch), chiusura dei dialog toccando fuori,
   scorrimento dei dialog e del dettaglio cliente, export PDF/CSV della Dashboard. Correggere gli errori segnalati.
2. Pagine: tutte convertite (restano fuori AccessoApp, ingresso della PWA, e OAuthConsent, non collegata).
   Da rifinire: confronti scheda per scheda di Impostazioni app e Academy, editor delle Comitive sul telefono.
3. Telefono: `onPaste` (incolla foto/contatto) non esiste su RN (accettato). (Pull-to-refresh di Semine: fatto.)
4. Notifiche push: parte client fatta (19/10, spenta); servono credenziali FCM/APNs + EAS e l'invio lato Base44.
5. Con l'ok dell'utente: togliere la modalità prova e provare i salvataggi su Base44; unire il branch a `main`.

## Differenze note (accettate)
- Dialog Radix: nell'originale il primo campo prende il fuoco all'apertura.
- Form Nuovo Cliente: l'originale è 7px più largo; tabella "Media tavoli": colonna Locale non va a capo.
- «Strada verso la vetta» (Achievement): l'originale è ~20px a sinistra del centro (offsetLeft del DOM).
- Freccia «→»: nel container l'originale usa un font di ripiego (il sottoinsieme latin di Inter non ce l'ha).
- Logo «Vibra» dell'header: immagine esterna non raggiungibile dal container (manca in entrambe).
