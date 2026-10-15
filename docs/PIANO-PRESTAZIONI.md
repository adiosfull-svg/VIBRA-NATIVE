# Piano prestazioni: l'app nativa più veloce dell'originale in ogni sezione

Obiettivo: su ogni pagina, tab, lista e dialog l'app nativa deve essere **più veloce dell'app web
originale** (React web nel browser del telefono), e senza difetti grafici rispetto all'originale.

## Come si misura: la «gara» (stesso telefono, stessi dati)

Sull'emulatore Android del workflow, a parità di condizioni:
- **originale**: build di produzione (vite build) in Chrome sul telefono, contro lo stack di prova;
- **nativa**: APK di prova, stesso stack di prova e stessi utenti (admin, pr).

Per ogni pagina si misurano, con la stessa definizione nelle due app:

| misura | definizione |
|---|---|
| **primo disegno** | ms dalla navigazione al primo contenuto della pagina nuova |
| **pronta** | ms dalla navigazione a quando la pagina smette di cambiare (nessuna richiesta di rete in corso e nessun ridisegno/modifica del contenuto per 300 ms) |
| **scorrimento** | frame persi e intervallo p90/p99 tra i frame (SurfaceFlinger) durante 5 scorrimenti uguali |
| **memoria** | PSS totale (app nativa / processi di Chrome) |
| **avvio** | da app chiusa a Dashboard pronta (nativa) contro primo caricamento della pagina (originale) |

La navigazione parte nello stesso modo nelle due app (link interno, non un tocco), così il confronto
non dipende dalla velocità del robot che tocca lo schermo. Una pagina che «non smette mai di cambiare»
entro 15 s viene segnalata: di solito è un ridisegno continuo (un difetto da correggere).

Risultato: tabella nativa contro originale per sezione nel branch `emulatore-risultati-<run>-<utente>`
(`gara.md`), con le sezioni dove la nativa perde in cima.

## Fasi

1. **Banco di prova** (questa settimana): strumenti di misura nelle due app, script della gara,
   job dell'emulatore con `[gara]` nel messaggio del commit.
2. **Prima misura**: classifica delle sezioni dove la nativa è più lenta o scatta di più.
3. **Correzioni**, dalla sezione peggiore: ogni correzione si rimisura con la gara (prima/dopo).
   Obiettivo per ogni riga: pronta ≤ originale, scorrimento con meno frame persi dell'originale.
4. **Difetti grafici sul telefono**: screenshot di ogni pagina e tab sullo stesso emulatore,
   originale (Chrome) e nativa affiancati alla stessa risoluzione; oltre ai confronti sul web già fatti.
5. **Guardia**: la gara gira sui commit `[gara]`; una sezione che peggiora rispetto al run precedente
   va corretta prima di andare avanti.

## Note
- L'emulatore non ha GPU: i numeri assoluti sono più lenti di un telefono vero, ma il confronto è alla
  pari (stessa macchina, stesso disegno software per le due app).
- La build dell'originale per la gara è `tools/gara/riferimento.tar.gz` (solo stack di prova, dati finti).
  Quando l'originale cambia: `tools/web-ref/setup.sh <sorgente>`, `tools/gara/build-ref.sh /tmp/ref`,
  `tar -C /tmp/ref -czf tools/gara/riferimento.tar.gz .`.
- Lanciare la gara: commit con `[gara]` nel messaggio (o Actions → Emulatore → gara=si).

## Stato al 14/10 sera (gara sull'emulatore)

Fatto:
- avvio: moduli eseguiti al primo uso (metro `inlineRequires`), font dentro l'app (plugin expo-font),
  R8 nella build release (plugin `withReleaseShrink`, da verificare che non rompa nulla);
- disegni: elementi di riga senza misura e secondo disegno, Provider di contesto solo se servono,
  `TextInherit` inline, stile delle classi statiche in cache sul telefono (`ui/classStyleCache.tsx`);
- pagine: Analitica Clienti (tabella a gruppi, righe in memo, niente ciclo), Academy (anteprime solo
  vicino allo schermo), `/dashboard` sulla tab precaricata, liste progressive senza riempimento in
  background, IntersectionObserver vero (shims/dom), guscio non ridisegnato a ogni navigazione;
- crash corretti: Academy (Svg con calc), Promoter (querySelector), blur della barra su pagina smontata.

Risultati (gara del commit c7462d8, prima di cache classi/R8): all'apertura la nativa vince su 7 pagine
su 12 (pr) e 6 su 14 (admin); avvio 5,5-8,3 s contro 3,6 s dell'originale.

Gara finale del 14/10 (run 38632126129, commit 8725082, con cache classi + R8):
- pr: la nativa vince 8/12 pagine alla prima apertura e 11/12 alla seconda; avvio 6,2 s contro 3,8 s
  (prima del JS 1,2 s, era 2,5-3 s prima di R8);
- admin: 8/14 alla prima apertura, 7/14 alla seconda; avvio 8,8 s contro 5,4 s;
- banco (rapporto con una View pura): Div 2,7× → 2,0×, Btn vuoto 4,0× → 2,3×, riga tipica 731 → 406 ms;
- R8: percorsi Maestro admin e pr tutti verdi (run 38630947065); cache classi: screenshot del telefono
  uguali a prima (differenze solo di scorrimento/ordine dei dati di prova), confronto web invariato.

Ancora da fare (in ordine):
1. Serate per admin (4,5 s contro 1 s alla prima apertura): la pagina che perde di più;
2. pagine che perdono ancora: Clienti, Promoter, Locali, Dashboard, Messaggi, Analitica (grafici);
3. avvio: ~2,5 s prima del JS (processo + bundle), 1-2 s di JS prima della prima pagina;
4. memoria: ~600-700 MB contro ~370 di Chrome (heap nativo ~370 MB);
5. scorrimento: sull'emulatore senza GPU non è misurabile (pochi fps anche per Chrome): va provato su un
   telefono vero;
6. titoli lunghi dell'header: l'originale li lascia sbordare a 11px, noi mettiamo i puntini.


Gara del 15/10 (run 38774983208, commit ed78b43: e8ae180 + audit in 3 parti, branch `ccr-962ba42f-zm78fv`):
- pr: la nativa vince 11/12 pagine alla prima apertura e 12/12 alla seconda (perde solo Clienti 1ª,
  465 contro 159 ms); avvio 5,6-6,2 s contro 0,4-0,9 s dell'originale;
- admin: 10/14 alla prima apertura e 8/14 alla seconda; avvio 7,5-15,5 s contro 0,9-4,9 s; perde Promoter
  1ª (826 contro 133), dettaglio promoter, Dashboard 1ª (1707 contro 1225), Clienti, Locali e Analitica
  alla 2ª; Serate 1ª 4518 → 1013 ms (originale 2020);
- memoria: admin 625 → 519 MB, pr 607 → 524 MB (Chrome 350-450);
- ATTENZIONE: le prime aperture variano molto tra run quasi uguali (Serate 1-5 s, anche l'originale):
  servono più run per giudicare una singola modifica. «precarica fine» ora aspetta anche i dati
  precaricati (lib/preloadData).
- Lezioni dell'audit:
  - una pagina dello stack precaricata in più (/locali, F3) faceva chiudere l'app con Indietro al 2° giro
    della gara (bisezione 38768510965 → 38771609758): non precaricarla;
  - verso le tab niente dismissTo (non cambia tab con le tab in primo piano) e niente dismissAll +
    navigate da codice (cronologia delle tab persa, Indietro chiude l'app): sidebar e /dashboard restano
    `navigate`; solo i link esterni da una pagina dello stack fanno dismissAll prima del linking
    (app/+native-intent.tsx);
  - in un file che importa l'icona `Map` da icons.generated `new Map()` costruisce l'icona: usare
    `globalThis.Map` o importarla come `MapIcon`.

Ancora da fare (in ordine):
1. avvio: 3-4 s prima del JS (processo + bundle) e la prima pagina; l'originale in Chrome già aperto parte
   in meno di 1-5 s;
2. strato ui dell'audit (F33 Text, F34 cache dei fatti di classe, F25 hover/active/disabled in cache, F26
   icone, F8 Img in cache): da misurare col banco (app/dev/bench.tsx) prima e dopo;
3. admin: Promoter e dettaglio promoter alla 1ª apertura, Dashboard 1ª, ritorni su Clienti/Locali/Analitica;
4. F11 (prefetch dei dati di rotta al tocco della sidebar, come prefetchRouteData dell'originale);
5. scorrimento e titoli lunghi dell'header (vedi sopra).
