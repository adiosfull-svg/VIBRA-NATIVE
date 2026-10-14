// Pagine precaricate dopo l'avvio (docs/REGOLE-PRESTAZIONI.md §1). Una pagina precaricata è montata
// in background a app ferma: al tocco compare subito, con dati e immagini già pronti.
//
// QUANDO SI CONVERTE UNA PAGINA: se si apre spesso (sidebar, nav bar, link frequenti) va aggiunta
// qui. Le tab sono sempre precaricate; le pagine dello stack con parsimonia (ognuna resta in memoria).

/** Tab della nav bar (la Dashboard '/' si aggiunge solo per chi può vederla: altrimenti è un Redirect). */
export const PRELOAD_TABS: string[] = ['/programmazione', '/clienti', '/il-mio-vibra', '/semine'];

/** Pagine dello stack da precaricare dopo le tab: Notifiche (campanella, tutti i ruoli, leggera).
 *  Serate/Messaggi no: pesanti o per ruolo, resterebbero in memoria per tutti. */
export const PRELOAD_STACK: string[] = ['/notifiche'];

/** Attesa dopo l'avvio e pausa tra una pagina e l'altra: una alla volta, mai durante un'interazione. */
export const PRELOAD_FIRST_DELAY_MS = 2500;
export const PRELOAD_GAP_MS = 1200;
