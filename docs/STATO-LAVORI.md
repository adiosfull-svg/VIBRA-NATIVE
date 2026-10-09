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
   `scripts/local/bin/`, scaricabile da GitHub releases). Utenti: admin/pr/super4 `@vibra.local`, password `vibra`.
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

## In corso / prossimi passi
1. **Larghezza pulsanti Clienti**: "Importa più clienti / Aggiungi presenze / Singolo cliente" nel nativo si
   restringono e troncano il testo; nell'originale i flex item hanno `min-width: auto` (non scendono sotto il
   contenuto, la riga sborda a destra). Emulare `min-width: auto` (es. minWidth dal contenuto per i flex item
   con testo `whitespace-nowrap`). Dopo ogni nuovo porting: `node --experimental-strip-types scripts/gen_safelist.mjs`.
2. Sistemare i `PORT-TODO` dei file Clienti (listener window/document, createPortal→Modal, input date/file,
   clipboard/share), poi dettaglio cliente, dialog, tab Gruppi/Parco/Albero/Tabelle/Growth/Analitica.
3. ClientMap (Leaflet) → react-native-maps (ora segnaposto). VibraSearch (pulsante Cerca) da portare.
4. Altre pagine con lo stesso metodo (tree.mjs → codemod → shim → confronto screenshot): Il Mio Vibra,
   Dashboard, Weekend, Semine, Promoter, Serate, Locali, Messaggi, VibraGPT, Report, Impostazioni...
5. Funzioni server, automazioni, file: restano su Base44 (niente da riscrivere). Notifiche push sul telefono:
   l'originale usa web push (PushSubscription + sendPushNotification); per l'app nativa valutare expo-notifications.
6. Quando l'utente dà l'ok: togliere la modalità prova (`EXPO_PUBLIC_BASE44_READONLY=0`) e provare i salvataggi.
7. Build: `npx eas-cli build -p android --profile preview` (APK), iOS con Apple Developer.
