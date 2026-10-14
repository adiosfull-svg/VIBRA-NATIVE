# Stato lavori VIBRA nativa (da riprendere in una nuova sessione)

## Obiettivo e regole
- Copia **identica** (grafica e funzioni) dell'app web VIBRA su Base44 (app `69de4f1f7f53d9f187d01392`) in
  React Native/Expo (Expo 57, RN 0.86 nuova architettura), Android + iOS. Si riscrive solo l'interfaccia.
- **Backend: Base44** vero (`@base44/sdk` 0.8.53: dati, funzioni, automazioni, file, login).
- **Sola lettura**: mai scritture su Base44 né sul repo originale; l'app è in "modalità prova"
  (`app/src/lib/readonlyGuard.ts`) finché l'utente non dà l'ok (`EXPO_PUBLIC_BASE44_READONLY=0`).
- Supabase solo come stack di prova locale con dati sintetici (`EXPO_PUBLIC_BACKEND=local`) per i confronti.
- Repo https://github.com/adiosfull-svg/VIBRA-NATIVE. Branch con TUTTO il lavoro: **`claude/amazing-babbage-bfbu65`**
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
  web uguale). Convertite e collegate, confronto DA FARE: Serate, Importa serata, Locali, Report, Messaggi,
  dettaglio Promoter. Accessi come l'originale: `web/components/RoleGate.jsx` (convertito) nelle route.
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
  - confronti: dopo il login il mouse va a (0,0) (prima restava sopra la pagina e attivava `group-hover`).
    Il titolo dell'header troncato sul web è normale (adjustsFontSizeToFit funziona solo sul telefono).

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

## Lezioni sullo strato ui/ e sul telefono (10-11/10, tutto verificato sull'emulatore)
- **Classi**: NativeWind scarta dvh/env()/calc() → `viewportSizeStyle` (webStyle) le calcola; le classi
  `transition-*/duration-*/ease-*/delay-*` NON vanno a NativeWind (la sua interop mandava in loop il JS:
  "Scudo OOM" nel logcat e app uccisa, era il crash del dettaglio cliente) → `ui/cssTransition.ts` anima
  opacità/sfondo/blur con Animated (anche da `style.transition`). Tailwind legge anche i COMMENTI di `src/`:
  mai scrivere classi con `env(...)` nei commenti (bundle Android rotto).
- **DOM**: `shims/dom.ts` definisce `Image` e `IntersectionObserver` globali; `ui/domStyle.ts` dà ai ref
  nativi (Div, campi) un `style` alla DOM (`el.style.x = ...` → setNativeProps o ignorato). Cercare altre API
  del browser usate senza shim quando l'utente segnala un `ReferenceError`/`TypeError`.
- **Blur** (Dimezis, `ui/pageLayers.tsx`): nav bar e fascia dell'orario (`StatusBarGlass`) sfocano la pagina
  in primo piano (BlurTargetView di Page); la barra sticky sfoca i fratelli che la seguono (`StickySplit`).
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

## PROSSIMO PASSO
- **Crash nativo (14/10): non ripetuto.** I due giri completi di verifica sul commit 6bfd611 (38499030579,
  38499032795; pr e admin) sono passati senza crash dell'app (`Fatal signal` nel giro 38499032795 = SIGILL di
  `googlequicksearchbox`, app di sistema, all'avvio dell'emulatore; le righe "app died" = Maestro che chiude l'app
  tra un percorso e l'altro). fastIntl resta. Se ricapita: cercare `Fatal signal` con pid di `com.vibra.mobile`.
- **Misura del giro 38499126870** (02-clienti): nei frame lunghi (1-3,6 s) il corpo di Div pesa 100-670 ms e Text
  <110 ms per battito (es. 827 div/535 text/358 btn: frame 3600 ms, corpi 433 ms) → ~15-35%: il grosso è
  React + jsx di NativeWind (react-native-css-interop) + commit di Fabric. Prossima misura: tempo nel wrapper
  di NativeWind (es. Div senza className a NativeWind, stili già calcolati) prima di ottimizzare DivBoxImpl.
- Ridurre il costo del montaggio delle pagine (in base alla misura div-corpo): cache per className dei calcoli
  rimasti in `DivBoxImpl`, meno hook per Div, meno elementi nelle card più usate.
- L'utente prova l'APK: ultimo 17a7e66 del 14/10 (run 38507316797, dopo il giro emulatore 38505058808 tutto
  verde), con i miglioramenti di fluidità del 14/10. Per ogni glitch: pagina/azione/screenshot.
- Dati Base44 anonimizzati per lo stack di prova: rimandato dall'utente ("più avanti le autorizzazioni Base44").

## Da fare
1. **Prova dell'utente sull'APK** (ultima build: 11/10 sera): Il Mio Vibra (grafici tocco/pinch,
   note trascinabili, chat AI, Calcolatrice trascinabile, tab centrata), Weekend (menu del tasto lungo,
   swipe in Da ricontattare), Semine (Gira e trascinamento delle card), e dalle sessioni prima: selettori
   data/ora, foto/file, swipe dei leader, albero (trascinamento/pinch), chiusura dei dialog toccando fuori,
   scorrimento dei dialog e del dettaglio cliente, export PDF/CSV della Dashboard. Correggere gli errori segnalati.
2. **Pagine ancora `ComingSoon`** (stesso metodo + checklist di `docs/REGOLE-PRESTAZIONI.md` §9): Promoter (lista:
   `tree.mjs` ne elenca 272 file perché importa mezza app, guardare cosa serve davvero), Impostazioni app (~4000
   righe), Academy (~5700 righe).
3. Telefono: `onPaste` (incolla foto/contatto) non esiste su RN (accettato). (Pull-to-refresh di Semine: fatto.)
4. Notifiche push (expo-notifications al posto del web push).
5. Con l'ok dell'utente: togliere la modalità prova e provare i salvataggi su Base44; unire il branch a `main`.

## Differenze note (accettate)
- Dialog Radix: nell'originale il primo campo prende il fuoco all'apertura.
- Form Nuovo Cliente: l'originale è 7px più largo; tabella "Media tavoli": colonna Locale non va a capo.
- «Strada verso la vetta» (Achievement): l'originale è ~20px a sinistra del centro (offsetLeft del DOM).
- Freccia «→»: nel container l'originale usa un font di ripiego (il sottoinsieme latin di Inter non ce l'ha).
- Logo «Vibra» dell'header: immagine esterna non raggiungibile dal container (manca in entrambe).
