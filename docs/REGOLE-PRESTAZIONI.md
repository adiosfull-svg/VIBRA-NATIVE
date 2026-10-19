# Regole di fluidità e reattività (VIBRA nativa)

Obiettivo: l'app nativa deve essere **più veloce e più fluida dell'originale web**. Queste regole
valgono per OGNI pagina e componente, e vanno applicate **durante la conversione**, non dopo:
una pagina convertita "sui binari sbagliati" (non precaricata, lista non virtualizzata, immagini
senza cache in memoria) andrà sempre più lenta e costa il doppio sistemarla dopo.

Una pagina non è "finita" finché non passa la **checklist del §9**.

---

## §0 Il principio: un solo thread JS, 16 ms per frame

- In React Native tutto il codice React (render, effect, setState, logica) gira su **un solo thread JS**.
  Il telefono disegna 60-120 frame al secondo: se il JS è occupato per più di ~16 ms nel momento
  sbagliato (durante uno scroll, un'animazione, un tocco) si vede uno **scatto** (microstuttering).
- Il nostro strato `ui/` (emulazione di classi Tailwind e DOM) rende ogni `Div`/`Btn`/`Span` più costoso
  di una `View` nuda: **meno elementi montati e meno ridisegni** è la leva principale.
- Quindi le regole si riducono a tre:
  1. il lavoro pesante si fa **prima** (precaricamento a app ferma) o **dopo** (a interazione finita),
     mai durante;
  2. le animazioni e lo scroll girano sul **thread UI** (Reanimated / `useNativeDriver: true`), non sul JS;
  3. si monta e si ridisegna **solo quello che si vede e solo quando cambia**.

---

## §1 Precaricamento delle pagine (preload)

- **Tab della nav bar**: sono SEMPRE precaricate (montate in background) dopo l'avvio, una alla volta,
  a app ferma (`InteractionManager.runAfterInteractions`). Elenco e tempi in **`app/src/lib/preloadRoutes.ts`**
  (`PRELOAD_TABS`), usato da `app/(app)/(tabs)/_layout.tsx`.
- **Pagine dello stack** (aperte da sidebar, menu, link): quando se ne converte una che si apre spesso,
  aggiungerla a `PRELOAD_STACK` nello stesso file. Con parsimonia: ogni pagina precaricata resta in memoria.
- **Pannelli e overlay frequenti** (sidebar, menu account, ricerca): montati in anticipo e poi tenuti
  montati (vedi §5, `ui/sideDrawer.tsx`).
- Ogni route di pagina esporta la pagina in **`memo`** (vedi `app/(app)/(tabs)/clienti.tsx`): al focus
  react-navigation ridisegna lo schermo, la pagina senza props non deve ridisegnarsi.
- Il precaricamento non deve mai cambiare pagina: una route che per un ruolo è un `Redirect` non va
  precaricata per quel ruolo (vedi la Dashboard in `usePreloadTabs`).

## §2 Prefetch dei dati (react-query)

- **Stesse `queryKey` dell'originale** e uguali tra pagine: due pagine che leggono gli stessi dati
  devono condividere la cache (es. `['promoters']`, `['clients', promoterId]`). Una chiave diversa per
  gli stessi dati = doppio caricamento e doppio spinner.
- Le opzioni di default (`lib/queryClient.ts`) sono quelle dell'originale: `staleTime` 5 min, `gcTime`
  30 min, niente refetch al focus. Non abbassarle per pagina senza motivo.
- **Precaricare i dati della pagina successiva** quando è probabile che si apra:
  `queryClient.prefetchQuery({ queryKey, queryFn })` al `onPressIn` del pulsante/voce che la apre,
  o all'apertura del dettaglio dalla lista (i dati della riga sono già in cache: passarli come
  `initialData`/`placeholderData` invece di ricaricarli).
- Le pagine precaricate (§1) caricano già i loro dati: non serve altro per le tab.
- Dati che servono a un pannello (es. stato Instagram del menu account): query attiva già al
  montaggio anticipato del pannello, non all'apertura (all'apertura la risposta deve esserci già).
- Liste e dettagli che cambiano dopo una modifica: aggiornare la cache con `setQueryData`
  (ottimistico, come fa l'originale) invece di invalidare e ricaricare tutto.
- `select` e trasformazioni pesanti (ordinamenti, raggruppamenti, statistiche) in `useMemo` o
  nel `select` della query, mai ricalcolate a ogni render.

## §3 Liste lunghe: virtualizzazione obbligatoria

Regola: **una lista che può superare ~30 righe (o righe pesanti: foto, grafici, card) va virtualizzata**:
si montano solo le righe visibili più un margine (`overscan`).

| Caso | Strumento |
|---|---|
| Lista che scorre con la **pagina** (Clienti, Da ricontattare, classifiche) | `web/hooks/usePageWindow` (vedi `VirtualizedClientList.jsx`, `RecontactList.jsx`, `ClientGrowthLeague.jsx`) |
| Lista in un **riquadro con scroll proprio** (`max-h-* overflow-y-auto`: selettori, dropdown, ricerche) | `ui/windowedList.tsx` → `<WindowedList>` (es. `ClientSourceDisplay.jsx`) |
| Lista o **griglia** con la pagina, righe ad **altezza variabile** (card) | `web/components/shared/PageWindowList.jsx` (`columns`, `gap`, `apiRef.scrollToItem` al posto di `scrollIntoView`; `entering` per non rifare le animazioni d'entrata) |
| Riquadro con scroll proprio, righe ad altezza variabile | `ui/windowedList.tsx` → `<WindowedListVariable>` (con `maxHeight`, o senza per riempire il genitore) |
| Striscia **orizzontale** di card a larghezza fissa | `web/hooks/useStripWindow.js` (spaziatori prima e dopo) |
| Riquadro con scroll proprio che deve restare **identico** (flex-wrap, tabelle con colonne misurate, trascinamenti dentro la lista, chip a larghezza variabile) | `useProgressiveList(n, { box: 'y' \| 'x' })` + `onScroll={onBoxScroll}` sul riquadro (righe montate a blocchi verso la fine); chat che parte dal fondo: `box: 'top'` + `maintainVisibleContentPosition`; `resetKey` per ripartire (pannello riaperto, altra tab) |
| Tabella con righe montate a blocchi | `<Table measureKey={rows}>` (colonne rimisurate solo quando cambia) + righe nascoste alte 0 con i testi più lunghi (es. `ReportPreview`) |
| Grafico a barre orizzontali alto centinaia di righe ("Tutti") | `<BarChart pageWindow …>` (`ui/recharts`): sul telefono disegnato a fasce di 480 px sullo scroll della pagina |
| Pagina che è solo una lista enorme | `FlatList` con `getItemLayout`, `initialNumToRender` ~10, `windowSize` 5-7, `removeClippedSubviews` |

- Righe ad **altezza fissa** e nota (misurata sull'originale): niente misure a runtime.
- `key` stabili (id del record), mai l'indice.
- Il componente riga in **`memo`**, con props stabili (callback con `useCallback`, oggetti in `useMemo`).
- Liste brevi di risultati di ricerca: tenere lo `slice(0, N)` dell'originale.
- Quando l'originale virtualizzava, la conversione virtualizza **sempre** (stesse altezze, stesso overscan).
- Le `SelectContent` lunghe sul telefono scorrono (ScrollView in `ui/menu.tsx`): niente `max-h` che le taglia.
- Cercare le liste da controllare: `.map(` su array di dati (clienti, presenze, eventi, promoter) senza
  `slice` → se possono essere lunghe, virtualizzare.

## §4 Niente ridisegni inutili, nessun componente che "scavalca" un altro

- **Contesti: stato e azioni separati.** Chi deve solo aprire/chiudere qualcosa usa le azioni (valore
  stabile) e non si ridisegna quando lo stato cambia. Esempio: `web/lib/layoutUI.tsx`
  (`useLayoutUIActions` negli header; `useLayoutUI` solo nei pannelli e nella nav bar).
- Valore dei Provider sempre in `useMemo`; callback in `useCallback`.
- **Hook di navigazione nelle pagine**: MAI `useNavigation`, `useFocusEffect`, `useRoutePath`, `usePathname`,
  `useSegments`, `useGlobalSearchParams` di expo-router dentro pagine e componenti di pagina: leggono un
  contesto che cambia a OGNI navigazione (anche di un'altra tab) e ridisegnano tutte le pagine montate
  (Il Mio Vibra si ridisegnava per intero, ~400 elementi, a ogni cambio tab). Usare:
  `useScreenNavigation()` (`web/screenNavigation.ts`: `isFocused`, `addListener('focus'|'blur')`),
  `useLocation`/`useSearchParams`/`useNavigate` di `web/router.tsx` (percorso proprio dato da
  `OwnPathProvider` in `Page`). Solo i componenti del layout possono seguire il percorso globale
  (`useCurrentLocation`, `usePathname` nella nav bar).
- **Mai iscriversi a stato GLOBALE di navigazione o scroll dentro una pagina**: con le tab precaricate
  sono montate 5+ pagine e si ridisegnerebbero tutte. Usare `useLocation` per pagina
  (`LocationPublisher` + `useRoutePath`), lo scroll della propria pagina (`PageLayerContext`).
- **Un componente globale = una sola istanza nel layout.** Pannelli, dialog globali, ricerca,
  calcolatrice stanno in `app/(app)/_layout.tsx`, MAI dentro l'header o il contenuto delle pagine
  (ogni pagina montata ne avrebbe una copia: era il caso del menu account, 5 pannelli aperti insieme).
  Nell'header resta solo il pulsante.
- Niente `setState` a ogni evento di scroll/gesto: valori che cambiano a ogni frame vanno in
  `Animated.Value`/shared value o in un `ref`; lo stato React cambia solo quando cambia ciò che si vede
  (es. `WindowedList` aggiorna lo stato solo quando la finestra si sposta di una riga).
- Lavoro pesante dopo un tocco (salvataggi, ricalcoli, navigazione verso pagine pesanti): far partire
  prima il feedback visivo (animazione, pressed) e poi il lavoro (`InteractionManager.runAfterInteractions`
  o `requestAnimationFrame`).
- **Intl su Android**: Hermes esegue `localeCompare`, `toLocaleString`, `toLocaleDateString` passando da
  Java (ICU) a ogni chiamata. `lib/fastIntl.ts` (installato all'avvio, solo telefono) li rende veloci
  (confronto e numeri it-IT in JS puro, formattatori riusati). Nel codice nuovo: per ordinare date ISO usare
  il confronto diretto delle stringhe (`a < b`), non `localeCompare`; niente `new Intl.*` dentro i render
  (crearli una volta a livello di modulo); niente lavoro pesante al caricamento dei moduli (ordinamenti,
  indici: farli pigri, alla prima richiesta).
- Hook che restituiscono oggetti o funzioni (`useRoleAccess`, fallback dei contesti): valore in `useMemo` /
  costanti di modulo, altrimenti ogni render fa ripartire effect e memo di chi li usa.
- Strumenti per trovare chi si ridisegna: build di test con `EXPO_PUBLIC_TEST_TRACE=1` (cosa si disegna) e
  `useWhyRender(nome, {valori})` di `lib/testDiag.ts` (quale valore è cambiato; "stato interno" = un hook
  con stato proprio o un contesto non elencato).

## §5 Animazioni, pannelli e overlay fluidi

- Animazioni **solo sul thread UI**: Reanimated (`useSharedValue` + `withTiming`/`withSpring` +
  `useAnimatedStyle`) o `Animated` con `useNativeDriver: true`. Animare solo `transform` e `opacity`
  (mai `width`/`height`/`top`/`left`/`margin` durante gesti o transizioni frequenti).
- **Pannelli laterali e overlay frequenti: `ui/sideDrawer.tsx`**:
  - un solo pannello nel layout, **montato in anticipo** a app ferma e poi tenuto montato;
  - contenuto in `memo` senza props che cambiano all'apertura: aprire/chiudere muove solo la shared value;
  - l'azione (`setSidebarOpen`) avvia l'animazione **prima** del setState (`registerDrawerAnimator`):
    anche se il commit è pesante (es. navigazione dalla sidebar) l'animazione non aspetta il JS;
  - da chiuso resta MONTATO fuori schermo (translateX, velo a opacità 0, `pointerEvents: none`, nascosto
    all'accessibilità). MAI `display: none` per cose che si riaprono: in Fabric un nodo `display: none` non ha
    viste native, quindi ogni apertura le ricrea tutte e le immagini ripartono da vuote (il logo della
    sidebar compariva in ritardo a ogni apertura);
  - tasto Indietro di Android gestito (`BackHandler`).
- **Niente `<Modal>` di React Native per cose che si aprono spesso**: su Android crea una finestra nuova
  a ogni apertura e monta il contenuto nel momento in cui deve partire l'animazione. Va bene per dialog
  rari; per i dialog dell'app si usa il Portal di `@rn-primitives` (un solo `PortalHost` alla radice).
- **Gesti continui (barre, trascinamenti) sul thread UI**: react-native-gesture-handler con callback worklet
  (`useManualGesture`/`usePanGesture` + shared value di Reanimated), come la nav bar (`MobileNavBar.tsx`).
  Il PanResponder vive sul thread JS: con il JS occupato il dito resta fermo. Al JS solo l'esito
  (navigazione, vibrazione) con `scheduleOnRN`. Gli stati visivi (attivo, premuto) si leggono dalle shared
  value nei componenti figli, senza setState a ogni tocco.
- **Cambio di tab: `ui/vibraTabs.tsx`** (al posto del Tabs di expo-router). Le tab montate restano attaccate,
  quella visibile a posto e le altre fuori schermo (translateX in un contenitore `overflow: hidden`); quale si
  vede lo dice la shared value `shownTab`, che la barra in basso cambia sul thread UI al rilascio del dito, prima
  che il JS navighi. Motivo (profilo Hermes, `profilo_js: si`): col JS il cambio costava 50-450 ms di render, quasi
  tutto propagazione dei contesti di navigazione in tutte le tab precaricate; un consumer "barriera" non serve
  (React riscende comunque). Una scena che si monta col focus scrive `shownTab` con `runOnUISync` PRIMA dello
  stile iniziale: la scrittura normale dal JS è asincrona e l'aggiornamento di una vista non ancora montata si
  perde (pagina vuota con la sola barra).
- **Flag di Reanimated `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS`** (`app/package.json`, `reanimated.staticFeatureFlags`):
  transform e opacity animati vanno dritti alla vista senza commit dello ShadowTree (menu e barra non aspettano
  i commit di React). Conseguenza: lo stile iniziale di una vista animata deve essere già giusto al primo render.
- Durate e curve come l'originale (`ui/anim.ts`: `EASE_OUT` = cubic-bezier(0.22,1,0.36,1));
  apertura ~280 ms, chiusura ~220 ms.
- Le transizioni CSS (`transition-*`, `duration-*`) NON passano da NativeWind (loop del JS):
  le gestisce `ui/cssTransition.ts`.
- Liste e pagine non devono ridisegnarsi alla fine di un'animazione: niente `onAnimationEnd → setState`
  se non serve (al massimo per smontare/nascondere, una volta).

## §6 Immagini: mai un flash

- **Tutte** le `<Image>` di expo-image usano `cachePolicy={IMAGE_CACHE}` (`ui/imageCache.ts`:
  `'memory-disk'`) e `transition={0}`. Il default di expo-image è solo disco: a ogni rimontaggio
  (cambio tab, riga che rientra in una lista, pannello) l'immagine veniva riletta e restava vuota un frame.
- Nelle pagine convertite le immagini passano da `Img` (`ui/elements.tsx`), che lo fa già, e da
  `CachedImage` (già caricata in questa sessione = compare subito, senza dissolvenza).
- `recyclingKey` = URL nelle righe di liste virtualizzate/riciclate (lo fa `Img`).
- **Precaricare** le immagini che verranno mostrate: `prefetchImages(urls)` (`ui/imageCache.ts`) o
  `preloadImages` (`legacy/utils/imageCache.js`, stesso effetto). Esempi: loghi del guscio all'avvio
  (`app/(app)/_layout.tsx`), foto dei clienti e delle semine al caricamento della pagina, piantine dei locali.
- Dimensioni **fisse** del riquadro dell'immagine (classi `w-*`/`h-*` o `aspect-*`): l'immagine che
  arriva non deve spostare il layout.
- Loghi e immagini fisse dell'app: meglio negli asset del bundle (`require(...)`) che da rete.

## §7 Sovrapposizioni e tocchi

- Ordine di disegno: `zIndex` solo dove serve (lo strato `ui/` dà zIndex 1 agli elementi posizionati,
  come il CSS). Overlay globali in fondo al layout (`app/(app)/_layout.tsx`), dialog nel `PortalHost`.
- Veli e vetri decorativi: `pointerEvents="none"` (non devono rubare i tocchi).
- Overlay chiusi: smontati o `display: none`, mai solo trasparenti (un overlay trasparente sopra
  la pagina blocca i tocchi e costa disegno).
- Scroll annidati: `nestedScrollEnabled` sugli scroll interni (Android); un solo gesto per area.

## §8 Come misurare (prima e dopo)

- Emulatore (vedi STATO-LAVORI, sezione EMULATORE): nel logcat "VIBRA diag battito" con `ritardo=`
  (JS bloccato), `EXPO_PUBLIC_TEST_TRACE=1` per vedere cosa si ridisegna quando.
- Profilo del thread JS: input `profilo_js: si` del workflow dell'emulatore (campionatore di Hermes, anche in
  release); `out/profili/*.json` e `profili.md` con le funzioni più costose nei 600 ms dopo ogni tocco sulla barra
  (`tools/profilo/analizza.py`). Nelle build di test "VIBRA nav <tab> js=.. frame=.." nel logcat.
- Ogni correzione di fluidità ha il suo percorso Maestro in `tests/emulatore/` (es.
  `pr/05-tab-ritorno.yaml`, `pr/07-menu-laterali.yaml`).

## §9 Checklist di conversione di una pagina

Prima di dichiarare convertita una pagina:

- [ ] Route in `memo`; se si apre spesso, aggiunta a `lib/preloadRoutes.ts` (§1).
- [ ] `queryKey` uguali all'originale; dati del dettaglio presi dalla cache della lista; prefetch della
      pagina/dettaglio successivo dove è probabile (§2).
- [ ] Ogni lista che può superare ~30 righe è virtualizzata (`usePageWindow` / `WindowedList` / `FlatList`),
      righe in `memo` con key stabili (§3).
- [ ] Nessun componente globale dentro la pagina; nessuna iscrizione a stato globale di navigazione/scroll
      (niente hook di navigazione di expo-router nelle pagine); contesti con stato/azioni separati; hook che
      restituiscono oggetti/funzioni con valore memoizzato (§4).
- [ ] Verifica con `useWhyRender` (build di test): cambiando tab la pagina non si ridisegna (§8).
- [ ] Animazioni su thread UI, solo transform/opacity; niente `Modal` per pannelli frequenti (§5).
- [ ] Immagini con `IMAGE_CACHE`, dimensioni fisse, precaricate (§6).
- [ ] Veli con `pointerEvents="none"`, overlay chiusi smontati o `display: none` (§7).
- [ ] Percorso Maestro della pagina sull'emulatore, battito senza ritardi durante scroll e aperture (§8).
