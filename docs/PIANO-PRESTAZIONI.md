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
