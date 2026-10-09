# Stato lavori VIBRA nativa (da riprendere in una nuova sessione)

## Obiettivo e regole
- Copia **identica** (grafica e funzioni) dell'app web VIBRA su Base44 (app `69de4f1f7f53d9f187d01392`) in React Native/Expo, Android + iOS.
- **Backend: Base44** (decisione dell'utente, ottobre 2026): l'app nativa usa il vero SDK `@base44/sdk` 0.8.53
  con dati, funzioni, automazioni, file e login di Base44. Si riscrive solo l'interfaccia.
- **Sola lettura**: con i tool MCP mai scritture su Base44; l'app nativa è in "modalità prova" (non scrive sui dati
  veri, `app/src/lib/readonlyGuard.ts`) finché l'utente non dà l'ok (`EXPO_PUBLIC_BASE44_READONLY=0`).
- Supabase resta SOLO come stack di prova locale con dati sintetici (`EXPO_PUBLIC_BACKEND=local`) per i confronti grafici.
- Repo: https://github.com/adiosfull-svg/VIBRA-NATIVE (branch `main`).

## Ambiente da ricreare in una nuova sessione
1. Codice originale (riferimento, NON nel repo): rileggerlo da Base44 con `read_file` a blocchi di 50 file
   in `/home/user/vibra-reference` (475 file; elenco con `list_directory` ricorsivo, max_depth 10).
2. Backend locale: `scripts/local/dev_stack.sh --reset` (serve il binario PostgREST v12.2.3 in
   `scripts/local/bin/`: `mkdir -p scripts/local/bin && curl -sSL https://github.com/PostgREST/postgrest/releases/download/v12.2.3/postgrest-v12.2.3-linux-static-x64.tar.xz | tar xJ -C scripts/local/bin`).
   Con admin la lista Clienti locale è vuota (i dati di prova sono di altri promoter): per provare form e dettaglio
   creare un cliente con "Singolo cliente". Prove Playwright con touch: contesto `{ hasTouch: true, isMobile: true }`. Utenti: admin/pr/super4 `@vibra.local`, password `vibra`.
3. App: `cd app && npm install && printf 'EXPO_PUBLIC_BACKEND=local\nEXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\nEXPO_PUBLIC_SUPABASE_ANON_KEY=dev\n' > .env && EXPO_OFFLINE=1 npx expo start --web --port 8081`
   (senza `.env` l'app usa Base44 vero, irraggiungibile dal container: lo prova l'utente con il suo account Google)
   (`EXPO_OFFLINE=1` perché api.expo.dev è bloccato dal proxy; idem per `npx expo install`).
4. App originale di riferimento: `tools/web-ref/setup.sh /home/user/vibra-reference` poi `tools/web-ref/run.sh`
   (porta 5173, `?as=pr|admin|super4`). Confronti con Playwright (Chromium in /opt/pw-browsers).
5. Tool del codemod: `cd scripts/port && npm install`.
6. Confronto originale vs nativo (entrambe le app avviate): `node tools/compare/measure.mjs <out> /clienti pr,admin,super4`
   (screenshot `<ruolo>-ref.png`/`-nat.png` + posizione verticale dei testi comuni, `dy` = scostamento) e
   `node tools/compare/probe.mjs <ruolo> /clienti "<testo>"` (stili calcolati della catena di antenati, per la causa).
   Nota: dy/dx piccoli su pillole, pulsanti, iniziali avatar sono normali (nel web il testo è misurato sul contenitore);
   "Weekend"/"Cerca"/"Chiudi" con dy enormi sono elementi nascosti con la stessa etichetta.
   Tab e dialog: quarto argomento con i passi, uguali sulle due app (`tools/compare/steps.mjs`), es.
   `node tools/compare/measure.mjs out/growth /clienti pr "click:Growth;wait:2500"`,
   `"click:Sofia Colombo;wait:2500"` (dettaglio cliente; per super4 "Alessandro Conti"), `"click:Singolo cliente"`,
   `"click:Importa più clienti"`, `"click:Aggiungi presenze"`. Anche `probe.mjs` accetta i passi (5° argomento).

## Fatto
- **Collegamento a Base44** (`app/src/lib/`): `base44.ts` sceglie il backend (`backend.ts`);
  `base44Remote.ts` = SDK vero (appId, serverUrl https://base44.app), token in SecureStore/localStorage,
  login Google (web: redirect come l'originale; telefono: `WebBrowser.openAuthSessionAsync` con ritorno
  `Linking.createURL('auth')`, route `app/src/app/auth.tsx`); `readonlyGuard.ts` (+ test) blocca scritture,
  funzioni server e integrazioni; `auth.tsx` = AuthProvider (Base44 o locale `authLocal.ts`);
  `localBackend.ts` = vecchio adattatore Supabase per lo stack di prova.
  Verificato: login web porta a `https://base44.app/api/apps/auth/login?...`; bundle Android compila.
  DA VERIFICARE dall'utente: login Google sul telefono (Base44 potrebbe rifiutare `from_url` exp:// o vibra://:
  in quel caso pagina ponte https che rimbalza il token verso l'app).
- (Storico, non più usato in produzione) Progetto Supabase `iapybtpkvgryqxtapsll` e `supabase/setup_completo.sql`:
  si può eliminare il progetto.
- Schema Supabase dalle entità (`scripts/gen_schema.py`), RLS (`scripts/test_db.sh`): ora serve solo allo stack di prova.
- Strato di compatibilità web→nativo in `app/src/ui/`:
  `html.tsx` (Div/Span/P/Btn con ereditarietà stili testo), `text.tsx` (font Inter per peso, line-height 1.5,
  flex-shrink 1 come CSS), `webClasses.ts` (flex in riga, space→gap, grid, gradienti, ring),
  `webStyle.ts` (style CSS → RN), `elements.tsx` (img, a, table, input, select, svg),
  componenti shadcn (`button, card, badge, input, dialog, menu, misc`), `icons.generated.ts`
  (178 icone da lucide 0.475 identiche), `motion.tsx` (framer-motion), `recharts.tsx`, `use-toast.tsx`, `sonner.ts`.
- `app/src/web/router.tsx`: API react-router.
- Shell portata e verificata uguale all'originale: header, MobileNavBar (pill, drag, menu radiale), Sidebar,
  NotificationBell, AccountMenu. Route con gli stessi percorsi dell'originale.
- Codemod `scripts/port/codemod.mjs` (+ `tree.mjs` per trovare i file di una pagina): converte i file originali
  in `app/src/web/...` mantenendo codice identico; segna i punti manuali con `PORT-TODO`.
- Pagina Clienti: 74 file convertiti, compila e si vede quasi identica all'originale.
- **Spaziature Clienti (ex punto 1) — FATTO**, verificato con `tools/compare/measure.mjs` per pr, admin e super4:
  sezioni e righe della lista nella stessa posizione verticale dell'originale (dy=0).
  - La safelist `gap-x/y-*` (0–24, mezzi passi, px; base/sm/md/lg) era già in `app/tailwind.config.js`
    e funziona (gap-y-3 = 12px); `gen_safelist.mjs` produce solo le classi usate, la safelist resta come rete.
  - Causa vera dello scostamento: in CSS `space-y-N` sono margini sui figli e un figlio con `style={{ marginTop: 0 }}`
    li annulla (i sentinel della tab bar e della ricerca); col gap no. `Div`/`Btn` (`app/src/ui/html.tsx`,
    `spaceOverrides`) ora danno a quei figli margine − gap, attraversando i Fragment.
  - `VirtualizedClientList`: ogni riga è in un contenitore alto 110px con overflow nascosto come nell'originale
    (la card ha `h-full`; prima ogni riga risultava alta 1500px).

- **Pulsanti Clienti — FATTO**: `useMinContentWidth` in `app/src/ui/html.tsx` emula `min-width: auto` per gli
  elementi `whitespace-nowrap` (primo layout alla larghezza naturale → minWidth). Corretto anche un bug: lo `style`
  a funzione del `Pressable` di `Btn` era ignorato sul web (NativeWind); ora array + stato premuto a mano.
- **Shim API del browser — FATTO** (`app/src/web/shims/`): `dom.ts` (telefono: Dimensions, BackHandler per
  history/popstate, Share, expo-clipboard, Linking, AsyncStorage) / `dom.web.ts` (oggetti veri); nessun globale
  (lo SDK Base44 usa `typeof document` per riconoscere RN). `pageScroll.ts` + `Page.tsx`: window.scrollY/scrollTo/
  evento scroll = ScrollView della pagina (ora funzionano barra tab fissa e pulsante "torna su" anche sul web).
  `react-dom.tsx`: createPortal → @rn-primitives/portal. Il codemod li applica da solo (`applyDomShims`);
  per file già portati: `node scripts/port/codemod.mjs --shims <file...>`.
- **onKeyDown dei campi di testo — FATTO**: `app/src/ui/keyEvents.ts` (Invio/Esc; sul telefono Invio =
  onSubmitEditing), usato da HtmlInput/HtmlTextarea/Input/Textarea; ripristinati i 12 handler originali
  (il codemod ora non li toglie più per input/textarea). Verificati typecheck e test; da provare a mano.

- **PORT-TODO di Clienti — FATTO** (resta solo onPaste, vedi sotto):
  - `<form>`: `ui/form.tsx` + `ui/formContext.ts`. `<form onSubmit>` → `Form`; `Btn`/`Button` con `type="submit"`
    inviano il form più vicino (prima il loro onClick), l'Invio nei campi a riga singola lo invia (salvo
    `e.preventDefault()` in onKeyDown), i campi `required` vuoti bloccano l'invio e prendono il fuoco.
    Verificato sul web: "Singolo cliente" → Aggiungi a vuoto non invia, Invio sul nome crea il cliente.
  - Data/ora: `HtmlInput`/`Input` con `type="date|time|datetime-local"` → `ui/dateField.tsx` (telefono,
    @react-native-community/datetimepicker) / `dateField.web.tsx` (input vero trasparente + showPicker).
    Valori come il browser, testo come Chrome in italiano (`ui/dateValue.ts` + test). min/max rispettati.
  - File: `type="file"` → `ui/fileField.tsx` (expo-image-picker per `accept="image/*"`, altrimenti
    expo-document-picker; `ref.current.click()` apre la scelta; i file sono `instanceof File` con uri/name/type
    per il FormData di RN) / `fileField.web.tsx` (input vero).
  - Gesture dei `<div>`: `ui/gestures.ts`, usato da `Div` e `Btn`. Sul web gli handler passano al DOM; sul telefono
    onTouch* ricevono eventi in forma web (touches[i].clientX...), onPointerDown/Move/Up arrivano dai touch,
    onMouse* sono emulati dopo un tap come nel browser del telefono (mouseleave quando si tocca altrove:
    `hoverRootProps` sulla radice in `app/_layout.tsx`), onTouchCancel ricade su onTouchEnd. Ripristinati gli
    handler originali in 9 file (ClientFamilyTree(Mobile), LeadersList, ClientStatsBar, ClientSourceDisplay,
    ClientCostanzaChart, ClientTableRow, ClientDetailDialog, AttendanceHubDialog, ClientSerateMenu).
  - Codemod aggiornato: `<form>` → `Form` con onSubmit, `type="submit"` conservato sui pulsanti, gesture
    conservate su Div/Btn, date/file non più segnati come TODO (restano checkbox/radio/color/range).

- **Confronto tab e dialog di Clienti (ex punto 2) — FATTO** per pr/admin/super4: Gruppi, Parco Paganti,
  Albero, Tabelle, Growth, Analitica, dettaglio cliente, Aggiungi presenze, Importa, Singolo cliente coincidono
  con l'originale (scostamenti residui ≤ 8px solo dove il web misura il testo sul contenitore). Correzioni,
  tutte nello strato `app/src/ui/` (valgono per ogni pagina):
  - `flex-shrink: 1` solo ai figli di contenitori flex in CSS (`FlexParentContext` in `text.tsx`): i figli di un
    blocco non si restringono (il dettaglio cliente era tutto sovrapposto).
  - Interlinea ereditata come in CSS (`textLeading.ts` + test): `text-[10px]` dentro `text-xs` ha 16px.
  - `<span>`/`<label>` in linea in un blocco: riga alta quanto l'interlinea del blocco (`useInlineBox`);
    `<textarea>` in un blocco: ~6px sotto (linea di base). Il form "Nuovo Cliente" era 40px più corto.
  - Campi di testo sempre 16px come nell'`index.css` originale (`inputFontSize`, tranne `.semina-note-textarea`).
  - Tabelle con layout automatico del browser (`Table`/`Tr`/`Td` in `elements.tsx`): colonne larghe quanto il
    contenuto (prima tutte uguali: nomi del Growth League tagliati a una lettera).
  - Griglie: Div/Btn figli si allungano all'altezza della riga; `inline-flex`/`inline-block` larghi quanto il
    contenuto e allineati dal `text-align` del contenitore.
  - Testo contiguo (`Tutti ({n})`) in un solo Text: niente gap in mezzo.
  - `style` con `vh/dvh/vw` e `calc()` semplici (`webStyle.ts` + test): il popup Aggiungi presenze era in alto.
  - recharts: tick con `recharts-scale` (stessa libreria dell'originale), radar con raggio, anelli, etichette e
    pallini come recharts.
  - `<svg>` (`Svg` di `elements.tsx`): className e colore ereditato (fill="currentColor") anche sul telefono.
  - Sul telefono i Div con `overflow-*-auto` diventano ScrollView (prima non scorrevano: corpo del dettaglio
    cliente, liste nei dialog, tabelle larghe); onScroll riceve `e.target.scrollTop/...` come sul web.
    Bundle Android verificato (`npx expo export --platform android`), comportamento da provare sul telefono.
  - Differenze note non emulate: i dialog Radix mettono il fuoco sul primo campo (bordo viola della textarea di
    Importa e del riquadro foto); nel form "Nuovo Cliente" l'originale è 7px più largo (dimensione min-content della
    griglia del dialog) e il pulsante del Guidatore tocca l'etichetta; un `<button>` in linea dentro un blocco
    (es. "Carica dal dispositivo") ha la riga 8px più bassa (Btn non distingue `<button>` dai div cliccabili);
    colonne `sticky left-0` delle tabelle non bloccate.

## In corso / prossimi passi
1. **Da provare sul telefono** (Expo Go / build): selettori data/ora (Android: data poi ora per datetime-local,
   "Cancella" svuota; iOS: pannello in basso), scelta foto/file e caricamento su Base44 (quando si toglie la
   modalità prova: `UploadPublicFile` con il File "nativo" di `ui/fileField.tsx`), swipe dei leader, trascinamento
   e pinch dell'albero, chiusura dei dialog toccando fuori, tooltip del grafico costanza col tap.
   Restano 2 PORT-TODO accettati: `onPaste` (incolla foto con Ctrl+V in ClientFormDialog, incolla in
   QuickContactEdit) non esiste su RN; l'Instagram si normalizza già all'onBlur.
   Nuovo da provare: scorrimento del dettaglio cliente, delle liste nei dialog e della tabella Growth League
   (ScrollView sul telefono), icone svg (WhatsApp, auto "Non guidatore") con dimensione e colore giusti.
2. ClientMap (Leaflet) → react-native-maps (ora segnaposto). VibraSearch (pulsante Cerca) da portare.
3. Altre pagine con lo stesso metodo (tree.mjs → codemod → confronto screenshot): Il Mio Vibra,
   Dashboard, Weekend, Semine, Promoter, Serate, Locali, Messaggi, VibraGPT, Report, Impostazioni...
4. Notifiche push sul telefono: l'originale usa web push (PushSubscription + sendPushNotification); valutare
   expo-notifications. Funzioni server, automazioni, file: restano su Base44.
5. Quando l'utente dà l'ok: togliere la modalità prova (`EXPO_PUBLIC_BASE44_READONLY=0`) e provare i salvataggi.
6. Build: `npx eas-cli build -p android --profile preview` (APK), iOS con Apple Developer.

## In attesa dell'utente
- Prova del login Google con Base44 vero: sul PC (`npx expo start --web`, http://localhost:8081) e sul telefono
  (Expo Go). Se Base44 rifiuta il ritorno (`from_url` localhost / exp:// / vibra://): pagina ponte https che
  rimbalza `access_token` all'app.
