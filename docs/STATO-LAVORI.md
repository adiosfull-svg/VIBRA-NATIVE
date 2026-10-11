# Stato lavori VIBRA nativa (da riprendere in una nuova sessione)

## Obiettivo e regole
- Copia **identica** (grafica e funzioni) dell'app web VIBRA su Base44 (app `69de4f1f7f53d9f187d01392`) in
  React Native/Expo (Expo 57, RN 0.86 nuova architettura), Android + iOS. Si riscrive solo l'interfaccia.
- **Backend: Base44** vero (`@base44/sdk` 0.8.53: dati, funzioni, automazioni, file, login).
- **Sola lettura**: mai scritture su Base44 né sul repo originale; l'app è in "modalità prova"
  (`app/src/lib/readonlyGuard.ts`) finché l'utente non dà l'ok (`EXPO_PUBLIC_BASE44_READONLY=0`).
- Supabase solo come stack di prova locale con dati sintetici (`EXPO_PUBLIC_BACKEND=local`) per i confronti.
- Repo https://github.com/adiosfull-svg/VIBRA-NATIVE. Lavoro sul branch **`claude/awesome-tesla-ovfcmf`**
  (NON ancora unito a `main`; PR adiosfull-svg/VIBRA-NATIVE#1). Dal 10/10 sera si lavora su
  **`claude/ecstatic-dirac-k411yk`** (parte da awesome-tesla, contiene tutto: prestazioni + emulatore).
  Dall'11/10 si lavora su **`claude/practical-mccarthy-js3v4k`** (parte da ecstatic-dirac, contiene tutto).
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

## Lavoro del 10/10 (branch ecstatic-dirac) — fatto e verificato sull'emulatore
- Prestazioni: liste virtualizzate (`web/hooks/usePageWindow.js`; Clienti, Da ricontattare, Growth League),
  misurato sul web prod CPU 4x: dettaglio cliente 4,7→0,83 s, ritorno al tab 6,4→1,7 s. `useFlipFace` senza
  Animated.Value per ogni Div, cache di `cn()`. React Compiler provato e scartato (nessun guadagno).
- `webStyle`: `style={{position:'absolute'}}` veniva scartato. `Tbody` inoltra il ref.
- Sticky e blur (`ui/pageLayers.tsx`): sticky vera (translateY col driver nativo dallo scroll di Page, posizione
  misurata sul contenuto della PROPRIA pagina), `useStickySentinel` reale, blur Dimezis
  (`dimezisBlurViewSdk31Plus`) con BlurTargetView: nav bar → pagina (Page avvolta), barra sticky → fratelli
  successivi (`StickySplit` in html.tsx). Sull'emulatore: barre incollate su Clienti/Il Mio Vibra/Weekend ok.
- Dashboard (bug dell'utente): `h-full` nelle celle di griglia → "allungati alla riga" (Yoga dava card di
  25.000 px: pagina vuota sotto la Classifica e intestazione coperta). Ora identica al web.
- Nav bar (bug dell'utente): il vetro `absolute inset-0` stava sopra le icone (zIndex dei posizionati) e
  prendeva i tocchi → `pointerEvents="none"`; voce calcolata da pageX meno bordo barra (locationX è relativo
  all'icona); tap breve per orari nativi anche se il timer del ventaglio scatta in ritardo.
- `ui/gestures`: un tocco iniziato su un elemento con onPointerDown/onTouchStart/onMouseDown inoltra
  move/up/cancel anche ai listener di window/document (shim dom: `windowTouchSink`). Prima la pressione lunga
  della card record non si annullava mai: scorrendo su Il Mio Vibra si apriva la condivisione.
- Icone con absolute/translate avvolte in una View (la lente dei campi di ricerca usciva dal campo).
- Esito ultimi giri: admin Dashboard + nav bar PASSATI; pr Il Mio Vibra, Clienti (lista), Weekend PASSATI.

## Lavoro dell'11/10 (branch practical-mccarthy) — fatto e verificato sull'emulatore
- **Crash del dettaglio cliente RISOLTO** (tutti i 6 percorsi admin/pr passati, nessun OOM). Causa: le classi
  di transizione CSS del contenitore (`transition-[transform,opacity] duration-200` con `opacity-0 scale-95`)
  che l'interop di NativeWind trasforma in animazioni: il thread JS restava bloccato e allocava milioni di
  oggetti nativi ("Scudo OOM ... size class 144" nel logcat) fino all'uccisione dell'app. Correzione in
  `ui/webClasses.ts`: sul telefono si tolgono `transition-*`, `duration-*`, `ease-*`, `delay-*` (anche con
  varianti); le animazioni vere restano a `motion.tsx`. Sul web le classi restano al CSS.
- Classi di dimensione relative alla finestra (`h-/min-h-/max-h-/w-...[...]` con vh/dvh/env()/calc(), anche con
  `sm:`/`max-sm:`): NativeWind le scartava; ora calcolate al render (`viewportSizeStyle` in `webStyle.ts`,
  `env(safe-area-inset-*)` dalle aree sicure reali). Il dettaglio cliente ora ha l'altezza massima del web.
- ATTENZIONE: Tailwind legge anche i commenti dei file in `src/`: scrivere `env(...)` dentro una classe in un
  commento genera CSS non valido e blocca il bundle Android (`Unexpected token Delim('.')`).
- Strumenti di diagnostica nuovi (solo build di test, inerti nelle normali), da passare in `extra_env`:
  - `EXPO_PUBLIC_TEST_CUT=<id>:<da>-<a>` oppure `<id>:none` (più tagli con virgole): `<TestCut id>` di
    `lib/testDiag.ts` tiene solo i figli con quegli indici (bisezione). Nel dettaglio cliente: `overlay`
    (sfondo, contenitore), `dialog` (intestazione, corpo), `detail` (sezioni del corpo 0-14).
  - `EXPO_PUBLIC_TEST_STRIP=<regex>`: classi tolte ovunque (es. per provare se una classe causa un blocco).
  - Si possono lanciare più giri in parallelo con `actions_run_trigger` (input diversi) e confrontare.

## Lavoro dell'11/10 sera (dopo la prova dell'utente sull'APK) — verificato sull'emulatore
L'utente ha segnalato: crash aprendo Il Mio Vibra/Clienti (`ReferenceError: Property 'Image' doesn't exist`),
blur che entra a scatto, fascia dell'orario non sfocata, nav bar senza blur, Weekend che si apre in ~2 s.
- Crash: `new Image()` del browser in `MaterialeLocaliSection` → `preloadImages` (expo-image). In più
  `shims/dom.ts` definisce globali `Image` e `IntersectionObserver` se mancano (altri punti simili non cadono).
  (I test non lo vedevano: i dati di prova non hanno piantine/listini dei locali.)
- Nav bar senza blur: in `Page.tsx` il ref del BlurTargetView arrivava PRIMA dell'effect che registra la
  pagina → bersaglio perso, solo velo. Corretto (ora sfoca, visto sull'emulatore).
- Fascia dell'orario: `StatusBarGlass` in `app/(app)/_layout.tsx` (blur della pagina + bg-background/30).
- Transizioni CSS sul telefono: `ui/cssTransition.ts` (+ `cssTransitionSpec.ts`, testato) anima con Animated
  opacità, sfondo e comparsa/scomparsa del blur, da `style.transition` e dalle classi transition-*/duration-*
  (che NativeWind non riceve più). Il vetro sticky ora entra in dissolvenza (0,2 s come il web).
- Lentezza del cambio tab (misurata con la traccia: ~500 elementi ridisegnati e JS bloccato a ogni tocco):
  1. tab precaricate in background dopo l'avvio (`router.prefetch` in `(tabs)/_layout.tsx`; Dashboard solo per
     chi la vede, per gli altri è un Redirect); una pagina montata senza focus va in fondo agli stack di
     pageScroll e del bersaglio del blur;
  2. `web/router.tsx`: `useLocation` non usa più usePathname in ogni pagina; `LocationPublisher` nel layout,
     ogni pagina segue solo il proprio percorso (`useRoutePath`), la Sidebar usa `useCurrentLocation`;
  3. pagine delle tab in `memo` (il focus della tab non ridisegna la pagina);
  4. `PageLayer` con scroll per pagina (`y`, `viewportHeight`, `onScroll`): `useStickySentinel` e
     `usePageWindow` seguono la propria pagina (prima quelle nascoste ricalcolavano con lo scroll di
     un'altra pagina e si ridisegnavano per intero);
  5. `calcolatriceContext`: valore memoizzato (il layout si ridisegna a ogni percorso → Il Mio Vibra pure).
  Risultato sull'emulatore: aprire Weekend ridisegna ~12 elementi (prima ~540), tornarci 4, percorsi di test
  20-35% più veloci. Resta: tornando su Il Mio Vibra si ridisegna ancora (~540 elementi), da indagare.
- Test nuovo `tests/emulatore/pr/05-tab-ritorno.yaml` (tempi del cambio tab; con `EXPO_PUBLIC_TEST_TRACE=1`
  la traccia dice cosa si ridisegna a ogni tocco). Lanciato a mano fallisce per admin (è un percorso pr).
- NB per misurare: il tempo di `tapOn` di Maestro include la sua attesa; contano i battiti (`ritardo=`) e la
  traccia nel logcat.

## PROSSIMO PASSO
- Prova dell'utente sull'APK con tutte le correzioni (link fisso release "anteprima"); l'utente dice che è
  "piena di glitch": chiedere screenshot/descrizioni precise per ognuno e riprodurli sull'emulatore.
- Ridisegno di Il Mio Vibra quando ci si torna (vedi sopra).
- Crash Semine (`Cannot set property 'height' of undefined`, effect del textarea delle note) risolto in modo
  generale: `ui/domStyle.ts` dà ai ref nativi (Div, campi di testo) un `style` alla DOM che traduce le
  scritte in setNativeProps (o le ignora); c'erano ~40 `el.style.x = ...` nel codice portato.
  Semine nei dati di prova dell'emulatore + test `pr/06-semine.yaml`.
- Da controllare: il textarea della nota nelle card di Semine resta alto una riga (sul web cresce col
  testo) e il testo sembra più grande degli 11px dell'originale (`.semina-note-textarea`).
- Differenze viste su Clienti (admin, nessun cliente): stato vuoto con pulsante "Aggiungi Cliente" squadrato
  e a sinistra (web: arrotondato, centrato). Da allargare i test: altre tab di Clienti, Semine, dialog, menu.
- Copia ANONIMIZZATA dei dati Base44 (MCP Base44 `query_entities` in sola lettura, app
  `69de4f1f7f53d9f187d01392`, 500-2000 clienti; l'utente ha dato l'ok) nel seed dello stack di prova.
- Livello B (più avanti): utente di prova Base44 o token come segreto GitHub per provare il backend vero.

## Da fare
1. **Prova dell'utente sull'APK** (build del 10/10 con tutto il lavoro): Il Mio Vibra (grafici tocco/pinch,
   note trascinabili, chat AI, Calcolatrice trascinabile, tab centrata), Weekend (menu del tasto lungo,
   swipe in Da ricontattare), Semine (Gira e trascinamento delle card), e dalle sessioni prima: selettori
   data/ora, foto/file, swipe dei leader, albero (trascinamento/pinch), chiusura dei dialog toccando fuori,
   scorrimento dei dialog e del dettaglio cliente, export PDF/CSV della Dashboard. Correggere gli errori segnalati.
2. **Pagine ancora `ComingSoon`** (stesso metodo, DOPO le prestazioni): Promoter (lista e dettaglio `promoter/[id]`), Serate,
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
