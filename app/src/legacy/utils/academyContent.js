// ─────────────────────────────────────────────────────────────
// GUIDA ALL'USO DELL'APP — Contenuti della guida, sezione per sezione.
// Linguaggio colloquiale, niente nomi di campi tecnici.
// Ogni lezione ha: intro (prefazione), mockup (tipo schermata),
// callouts (legenda numerata), steps (procedura), tips (consigli).
// ─────────────────────────────────────────────────────────────

export const ACADEMY_SECTIONS = [
  // ── BENVENUTO ─────────────────────────────────────────────
  {
    id: 'benvenuto',
    title: 'Benvenuto in Vibra',
    icon: 'BookOpen',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Vibra è la piattaforma che gestisce il tuo team di promoter, i clienti e le serate nei locali. Un unico strumento per organizzare, vendere e misurare i risultati.',
    lessons: [
      {
        title: 'Cosa fa Vibra',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'In breve: Vibra tiene insieme persone, clienti e serate. Ognuno vede quello che gli serve, in base al suo ruolo.',
        mockup: 'benvenuto-cosa',
        callouts: [
          { n: 1, text: 'Le sezioni principali dell\'app, raggiungibili dalla barra in basso' },
        ],
        steps: [
          'Gestisci il team di promoter: ruoli, gerarchie, obiettivi e statistiche di ciascuno.',
          'Gestisci i tuoi clienti: contatti, storico presenze, spesa e contatti rapidi (WhatsApp, Instagram).',
          'Organizza il weekend: prospetto inviti, semina Instagram, suggerimenti e clienti da ricontattare.',
          'Registra le serate e il fatturato per promoter e per locale.',
          'Tieni d\'occhio guadagni, achievement, sfide Vibra VS e progressi personali in "Il Mio Vibra".',
          'Usa la Ricerca per trovare qualsiasi cosa e Vibra GPT per chiedere consigli sui tuoi dati.',
        ],
        tips: ['Ogni ruolo vede solo il necessario: l\'admin vede tutto, il PR vede i propri clienti e le proprie serate.']
      },
      {
        title: 'Come usare questa guida (in ordine)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Ti consigliamo di leggere le sezioni nell\'ordine in cui appaiono: si parte dalla navigazione e ricerca, poi le aree operative.',
        mockup: 'benvenuto-guida',
        callouts: [
          { n: 1, text: 'Pillole in alto: salta a una sezione con un tap' },
          { n: 2, text: 'Ricerca della guida: trova una funzione specifica' },
        ],
        steps: [
          'Inizia da "Menu e Navigazione" per capire come muoverti nell\'app.',
          'Poi "Ricerca": è la scorciatoia più veloce per trovare clienti, serate e sezioni.',
          'Continua con le sezioni operative: Clienti, Weekend, Serate.',
          'Le sezioni admin (Dashboard, Promoter, Locali, Impostazioni) sono per chi gestisce tutto.',
          'Usa la ricerca dentro la guida (in alto) per trovare subito una funzione specifica.',
          'Le pillole in alto ti fanno saltare a una sezione con un tap, senza scorrere.',
        ],
        tips: ['Se hai poco tempo, leggi almeno Menu, Ricerca e la sezione del tuo ruolo principale (Clienti per i PR, Promoter per l\'admin).']
      }
    ]
  },

  // ── RICERCA (VibraSearch) ─────────────────────────────────
  {
    id: 'ricerca',
    title: 'Ricerca',
    icon: 'Search',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'La barra di ricerca universale: clienti, promoter, serate, locali, materiale, sezioni dell\'app e impostazioni, tutto in un posto. La scorciatoia più veloce per saltare dove vuoi.',
    lessons: [
      {
        title: 'Aprire la ricerca',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tocca "Cerca" nel menu (mobile o sidebar) o premi ⌘K / Ctrl+K sulla tastiera. Si apre un pannello sopra la pagina corrente.',
        mockup: 'ricerca-apri',
        callouts: [
          { n: 1, text: 'Barra di ricerca in alto' },
          { n: 2, text: 'Risultati raggruppati per tipo' },
        ],
        steps: [
          'Su mobile: tocca "Cerca" nella barra di navigazione in basso.',
          'Su computer: apri la ricerca dalla sidebar, oppure premi ⌘K (Mac) o Ctrl+K (Windows).',
          'Si apre un pannello a vetro sopra la pagina attuale, senza abbandonarla.',
          'Mentre digiti, i risultati appaiono raggruppati per tipo: Clienti, Promoter, Serate, Locali, Materiale, Sezioni, Impostazioni.',
          'Tocca la X in alto a destra (o premi Esc) per chiudere e tornare dove eri.',
        ],
        tips: ['La scorciatoia ⌘K / Ctrl+K apre e chiude la ricerca al volo: imparala, è la più veloce.']
      },
      {
        title: 'Cosa puoi cercare',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Una sola barra per trovare qualsiasi cosa nell\'app. Ecco tutto ciò che puoi digitare.',
        mockup: 'ricerca-cosa',
        callouts: [
          { n: 1, text: 'Clienti: per nome, Instagram o telefono' },
          { n: 2, text: 'Serate: per nome, locale, data o giorno della settimana' },
        ],
        steps: [
          'Clienti: cerca per nome, handle Instagram o numero di telefono. Vedi solo i tuoi contatti, a qualunque ruolo tu appartenga.',
          'Promoter (admin/super4): per nome, Instagram, telefono, quartiere o città. Tocca per aprire la scheda promoter.',
          'Serate: per nome, locale, location fisica, note, data (es. "12 lug" o "12/07/2025") o giorno della settimana ("sabato").',
          'Locali (admin/super4): per nome. Tocca per aprire la sezione Locali già espansa su quel locale.',
          'Materiale locali: digita "piantina", "listino" o "formule" (anche col nome del locale, es. "piantina Ammare") e aprilo a schermo intero.',
          'Leader: scrivi "leader" per aprire subito il box dei tuoi clienti leader.',
          'Sezioni dell\'app: guadagni, serate, team, achievement, Vibra VS, progressi, note, Vibra GPT, formazione, guida, materiale, notifiche.',
          'Impostazioni (admin): branding, materiale locali, comunicazioni, notifiche, soglie tavoli, achievement, Vibra VS, promoter, database, consolle, report.',
        ],
        tips: ['Le date si cercano in formato italiano ("12 luglio 2025", "12/07/2025") o col nome del giorno ("venerdì", "sabato").']
      },
      {
        title: 'Clienti: solo i tuoi',
        roles: ['admin', 'capogruppo', 'pr'],
        intro: 'La ricerca clienti è strettamente personale: vedi solo i contatti che hai registrato tu, a prescindere dal ruolo. Nessuno sbircia nei tuoi clienti.',
        mockup: 'ricerca-clienti',
        callouts: [
          { n: 1, text: 'Risultati clienti: solo i tuoi' },
        ],
        steps: [
          'Digita il nome (o parte) di un cliente: la lista si aggiorna mentre scrivi.',
          'Vedi solo i clienti associati a te: anche l\'admin vede solo i propri dalla ricerca.',
          'Tocca un cliente per aprire la sua scheda completa in overlay, senza lasciare la pagina attuale.',
          'La ricerca resta aperta sotto: chiudendo la scheda torni ai risultati.',
        ],
        tips: ['La scheda cliente si apre sopra la ricerca, così non perdi i risultati: chiudi la scheda e sei di nuovo in lista.']
      },
      {
        title: 'Serate e prospetto',
        roles: ['admin', 'super4'],
        intro: 'Trova una serata per nome, locale o data e, se sei admin/super4, vedi il prospetto fatturato per promoter direttamente nella ricerca.',
        mockup: 'ricerca-serate',
        callouts: [
          { n: 1, text: 'Serata con fatturato e tavoli' },
          { n: 2, text: 'Tocca per espandere il prospetto promoter' },
        ],
        steps: [
          'Cerca una serata per nome (es. "Ammare"), locale, data o giorno della settimana.',
          'Vedi logo, locale, data, fatturato totale e tavoli chiusi.',
          'Tocca la serata per espanderla: appare la tabella con il fatturato di ogni promoter e il grafico.',
          'Tocca di nuovo per richiudere.',
        ],
        tips: ['Il prospetto si calcola in tempo reale dalle presenze registrate: sempre allineato con le Serate.']
      },
      {
        title: 'Materiale locali in un tap',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Piantine, listini e formule di ogni locale, consultabili senza navigare nelle sezioni. Basta digitare la parola chiave.',
        mockup: 'ricerca-materiale',
        callouts: [
          { n: 1, text: 'Risultato "piantina Ammare" con anteprima' },
        ],
        steps: [
          'Digita "piantina" (o "listino", "formule") seguito dal nome del locale, es. "piantina Ammare".',
          'Senza nome del locale, vedi tutti i locali che hanno quel materiale caricato.',
          'Piantina e listino si aprono a schermo intero per zoomare sui dettagli.',
          'Le formule di entrata rimandano alle Note, dove risiedono i testi.',
        ],
        tips: ['Tieni il materiale a portata di mano durante la serata: rispondi subito ai clienti su prezzi e tavoli.']
      },
      {
        title: 'Navigazione rapida: sezioni e impostazioni',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Oltre ai dati, la ricerca è una mappa dell\'app: digita dove vuoi andare e ci sei. Le sezioni dell\'app e le impostazioni stanno in due gruppi separati.',
        mockup: 'ricerca-sezioni',
        callouts: [
          { n: 1, text: 'Gruppo "Sezioni": le aree dell\'app' },
          { n: 2, text: 'Gruppo "Impostazioni": solo admin' },
        ],
        steps: [
          'Digita il nome di una sezione (es. "guadagni", "achievement", "weekend") per aprirla direttamente.',
          'Il gruppo "Sezioni" raccoglie tutte le aree dell\'app: Il Mio Vibra, Serate, Locali, Notifiche, ecc.',
          'Il gruppo "Impostazioni" (solo admin) raccoglie branding, comunicazioni, soglie, database, consolle, report e gli altri pannelli di configurazione.',
          'Ogni voce apre il tab giusto via link diretto: niente tap extra per arrivare dove serve.',
          'Quando non digiti nulla, vedi dei tile di accesso rapido alle sezioni più usate.',
        ],
        tips: ['Usa la ricerca come menu universale: più veloce che scorrere la sidebar per raggiungere una sezione.']
      }
    ]
  },

  // ── MENU E NAVIGAZIONE ─────────────────────────────────────
  {
    id: 'menu',
    title: 'Menu e Navigazione',
    icon: 'Menu',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Come muoverti in Vibra: il menu burger su mobile, la sidebar su computer e la barra di navigazione in basso. Le tre vie per raggiungere ogni sezione.',
    lessons: [
      {
        title: 'Il menu burger (mobile)',
        device: 'mobile',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Su mobile, l\'icona ☰ in alto a sinistra apre il menu con tutte le sezioni dell\'app.',
        mockup: 'menu-burger',
        callouts: [
          { n: 1, text: 'Icona ☰ in alto a sinistra' },
          { n: 2, text: 'Menu laterale con tutte le sezioni' },
          { n: 3, text: 'Voci di navigazione: tocca per aprire una sezione' },
          { n: 4, text: 'Profilo in fondo: foto, nome e ruolo' },
        ],
        steps: [
          'Tocca l\'icona ☰ in alto a sinistra per aprire il menu laterale.',
          'Vedi tutte le sezioni: Dashboard, Promoter, Clienti, Weekend, Serate, Locali, Formazione, Download, Vibra GPT.',
          'Sotto Vibra GPT trovi "Cerca": apre la ricerca universale.',
          'Tocca una voce per andare alla sezione: il menu si chiude da solo.',
          'Tocca fuori dal menu o la X in alto a destra per chiuderlo senza scegliere.',
          'Il menu si chiude anche col pulsante Indietro del telefono.',
        ],
        tips: ['Il menu burger sostituisce la sidebar fissa del computer: stesse voci, ma a scomparsa.']
      },
      {
        title: 'La sidebar (computer)',
        device: 'desktop',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Su computer, la sidebar è sempre visibile a sinistra: logo, sezioni e profilo. Non devi aprirla ogni volta.',
        mockup: 'menu-sidebar',
        callouts: [
          { n: 1, text: 'Logo dell\'organizzazione in alto' },
          { n: 2, text: '"Il Mio Vibra" espande i sotto-tab' },
          { n: 3, text: '"Cerca" con scorciatoia ⌘K / Ctrl+K' },
          { n: 4, text: 'Profilo in fondo: foto e nome' },
        ],
        steps: [
          'La sidebar resta fissa a sinistra per tutto lo schermo.',
          'In alto vedi il logo della tua organizzazione (l\'admin può cambiarlo).',
          'Sotto ci sono le sezioni principali: Dashboard, Promoter, Clienti, Weekend, Serate, Locali, Formazione, Download, Vibra GPT.',
          'Sotto "Vibra GPT" trovi "Cerca", che apre la ricerca universale (o premi ⌘K / Ctrl+K).',
          'La sezione "Il Mio Vibra" ha un colore dedicato e, quando la apri, espande i sotto-tab.',
          'In fondo vedi la tua foto e il tuo nome: è il tuo profilo.',
        ],
        tips: ['Sulla sidebar, le voci di "Il Mio Vibra" si espandono solo quando sei in quella sezione.']
      },
      {
        title: 'La barra di navigazione in basso (mobile)',
        device: 'mobile',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Sul telefono, la barra fissa in basso ti dà accesso rapido alle sezioni più usate, senza aprire il menu.',
        mockup: 'menu-bottomnav',
        callouts: [
          { n: 1, text: 'Barra fissa in basso con le icone' },
          { n: 2, text: '"Cerca" apre la ricerca universale' },
        ],
        steps: [
          'La barra in basso resta sempre visibile mentre usi l\'app.',
          'Contiene le sezioni più usate (es. Home, Cerca, Clienti, Weekend, Profilo).',
          'Tocca un\'icona per andare subito a quella sezione.',
          'La voce "Cerca" apre la ricerca universale.',
          'È più veloce del menu burger per le sezioni che usi ogni giorno.',
        ],
        tips: ['Usa la barra in basso per le sezioni frequenti, il menu burger per quelle che usi meno spesso.']
      },
      {
        title: '"Il Mio Vibra" e il profilo',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il tuo spazio personale: guadagni, achievement, team e note. Lo raggiungi dalla sidebar o dalla barra in basso.',
        mockup: 'menu-profile',
        callouts: [
          { n: 1, text: 'La tua foto profilo' },
          { n: 2, text: 'Nome e ruolo' },
          { n: 3, text: 'Esci per disconnetterti' },
        ],
        steps: [
          'Apri "Il Mio Vibra" dal menu o dalla barra in bassa.',
          'Vedi i tuoi guadagni, le tue serate, il tuo team e i tuoi achievement.',
          'Quando sei in "Il Mio Vibra", nel menu si espandono i sotto-tab (Guadagni, Team, Note, ecc.).',
          'In fondo alla sidebar (o nel menu burger) trovi la tua foto e il tuo nome: tocca per gestire il profilo o uscire.',
        ],
        tips: ['Il Mio Vibra è privato: vedi solo i tuoi dati, a prescindere dal ruolo.']
      },
      {
        title: 'Fast-Scroll su mobile',
        device: 'mobile',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Sulle liste lunghe (clienti, weekend) trascina il cursore a destra per scorrere velocemente, come la rubrica del telefono.',
        mockup: 'menu-fast-scroll',
        callouts: [
          { n: 1, text: 'Cursore dragabile sul bordo destro delle liste lunghe' },
        ],
        steps: [
          'Su mobile, nelle liste lunghe (es. Clienti, Weekend) compare un cursore sottile sul bordo destro.',
          'Tieni premuto e trascinalo su e giù per scorrere la lista velocemente, come la rubrica del telefono.',
          'Utile quando hai tanti clienti e devi arrivare in fondo o tornare su in un attimo.',
          'Il cursore compare solo dove serve: sulle liste corte non appare, per non ingombrare.',
        ],
        tips: ['Usa il fast-scroll per saltare subito in cima o in fondo a liste lunghe senza swipe ripetuti.']
      }
    ]
  },

  // ── DASHBOARD ──────────────────────────────────────────────
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'LayoutGrid',
    roles: ['admin', 'super4'],
    intro: 'La bacheca con il polso dell\'azienda: quanto si fattura, chi sta lavorando, chi spende di più. È la prima schermata che vedi: ti basta un\'occhiata per capire come sta andando il periodo.',
    lessons: [
      {
        title: 'Leggere i numeri principali',
        roles: ['admin', 'super4'],
        intro: 'Le card in alto ti danno subito il polso del periodo: fatturato, promoter attivi e clienti. Pensale come il cruscotto di una macchina: ti dicono dove sei ora.',
        mockup: 'dashboard',
        callouts: [
          { n: 1, text: 'Le card in alto: fatturato del mese, promoter attivi, clienti' },
          { n: 4, text: 'La classifica dei migliori promoter del periodo' },
          { n: 5, text: 'La classifica dei clienti che spendono di più' },
        ],
        steps: [
          'Apri la Dashboard dal menu: è la schermata di partenza.',
          'Guarda la prima card in alto: ti dice quanti soldi hai fatto questo mese in totale.',
          'La card accanto ti dice quanti promoter stanno lavorando, con la freccia verde (sta salendo) o rossa (sta scendendo) rispetto alla settimana scorsa.',
          'La terza card ti mostra quanti clienti sono registrati in tutto.',
          'Tocca "Promoter Attivi" per aprire il popup e vedere, uno per uno, chi ha portato fatturato nel periodo selezionato.',
          'Questi numeri si aggiornano da soli: non serve ricaricare la pagina, sono sempre freschi.',
        ],
        tips: ['Se la freccia dei promoter attivi è rossa, significa che qualcuno ha lavorato meno della settimana scorsa: vale la pena capire chi e perché.']
      },
      {
        title: 'Usare il grafico del fatturato',
        roles: ['admin', 'super4'],
        intro: 'Il grafico mostra l\'andamento giorno per giorno del fatturato nel mese selezionato. Ti aiuta a capire se le serate stanno crescendo o se c\'è un buco da colmare.',
        mockup: 'dashboard',
        callouts: [
          { n: 2, text: 'Selettore del mese' },
          { n: 3, text: 'Grafico a barre con l\'andamento giornaliero' },
        ],
        steps: [
          'Scegli il mese toccando il selettore in alto al grafico: puoi tornare indietro nel tempo quanto vuoi.',
          'Ogni barra rappresenta una serata: più è alta, più fatturato ha generato quel giorno.',
          'Passa il mouse (o tieni premuto) su una barra per vedere esattamente quanto hai fatto quel giorno.',
          'Se vedi l\'icona di confronto, toccala per paragonare due periodi affiancati e vedere subito la differenza.',
          'Il grafico somma tutte le serate del mese, compresi gli eventi speciali ed extra.',
        ],
        tips: ['Confronta due mesi per capire se la stagione sta accelerando o rallentando, e usa il dato per decidere dove investire energie.']
      },
      {
        title: 'Classifiche: migliori promoter e clienti',
        roles: ['admin', 'super4'],
        intro: 'Due classifiche affiancate per vedere subito chi sta trainando fatturato e clienti. Utili per premiare chi lavora di più e capire chi rischia di sparire.',
        mockup: 'dashboard',
        callouts: [
          { n: 4, text: 'Top promoter del periodo' },
          { n: 5, text: 'Top clienti per spesa' },
        ],
        steps: [
          'Scorri fino alla classifica "Top Promoters": vedi i tuoi migliori in ordine di risultati.',
          'Tocca un promoter della lista per aprire la sua scheda completa con tutti i dettagli.',
          'Apri "Top Clienti" per vedere chi ha speso di più nel periodo selezionato.',
          'Un cliente alto in classifica è una rendita sicura: non perderlo di vista.',
          'La classifica usa il punteggio complessivo del cliente, non solo l\'ultima serata: premia la costanza.',
        ],
        tips: ['Un cliente che scende nella classifica Top è un segnale d\'allarme: forse sta andando altrove.']
      }
    ]
  },

  // ── PROMOTER ──────────────────────────────────────────────
  {
    id: 'promoter',
    title: 'Promoter',
    icon: 'UsersRound',
    roles: ['admin', 'super4'],
    intro: 'La rubrica del tuo team: chi fa cosa, a chi risponde, e come sta andando. Da qui gestisci persone, gerarchie e obiettivi di tutti.',
    lessons: [
      {
        title: 'Aggiungere un promoter',
        roles: ['admin'],
        intro: 'Crea la scheda di un nuovo promoter con contatti, ruolo e zona di provenienza. Bastano pochi campi per averlo attivo in tutta l\'app.',
        mockup: 'promoter',
        callouts: [
          { n: 1, text: 'Pulsante "Aggiungi" in alto a destra' },
          { n: 2, text: 'Card del promoter con foto e contatti' },
        ],
        steps: [
          'Vai su Promoter e tocca "Aggiungi" in alto a destra.',
          'Scrivi il nome completo, il telefono e l\'Instagram (senza la @).',
          'Scegli il ruolo: fondatore, super4, capogruppo, PR o ragazza immagine. Il ruolo decide cosa può vedere e fare nell\'app.',
          'Se fa capo a qualcuno del team, scegli il referente: serve a costruire l\'organigramma.',
          'Inserisci quartiere e città di provenienza: così lo vedi posizionato sulla mappa.',
          'Carica la foto profilo se vuoi: la vedrai in tutte le card e classifiche.',
          'Salva: il promoter compare subito dappertutto, pronto per le serate.',
        ],
        tips: ['L\'indirizzo viene convertito in posizione mappa in automatico, non devi inserire coordinate a mano.']
      },
      {
        title: 'Gerarchie: chi fa capo a chi',
        roles: ['admin', 'super4'],
        intro: 'Il campo referente costruisce l\'organigramma e orienta i grafici aziendali. Senza gerarchie non puoi vedere il team strutturato.',
        mockup: 'promoter',
        callouts: [
          { n: 2, text: 'Card del promoter con il campo referente' },
        ],
        steps: [
          'Apri la scheda di un promoter e vai sul campo "Referente".',
          'Scegli a chi risponde: fondatore, super4 o capogruppo. Questo crea il legame gerarchico.',
          'La gerarchia si riflette nei grafici aziendali e nel calcolo del team di ciascuno.',
          'Puoi cambiare il referente quando vuoi: i grafici si aggiornano da soli al salvataggio.',
          'Se un promoter non ha referente, resta come radice del suo ramo.',
        ],
        tips: ['I promoter inattivi restano nei grafici storici se hanno "Mostra in statistiche" attivo: utile per non perdere lo storico.']
      },
      {
        title: 'Le statistiche del promoter',
        roles: ['admin', 'super4'],
        intro: 'Nella scheda trovi fatturato, tavoli e clienti totali, sempre aggiornati in automatico. Non devi toccarli: sono già pronti.',
        mockup: 'promoter',
        callouts: [
          { n: 4, text: 'Riquadro con fatturato, tavoli e clienti totali' },
        ],
        steps: [
          'Tocca un promoter dalla lista per aprire la sua scheda.',
          'Vedi quanto ha fatturato in totale, quanti tavoli ha chiuso e quanti clienti ha.',
          'Questi numeri sono sempre aggiornati: vengono ricalcolati in automatico dopo ogni serata.',
          'Sotto le statistiche trovi la data dell\'ultimo aggiornamento, per sapere quanto sono freschi.',
          'Usa questi numeri per parlare con il promoter con dati concreti, non a sensazione.',
        ],
        tips: ['Non cambiare a mano questi numeri: vengono ricalcolati da soli. Se ne vedi uno sballato, usa il ricalcolo statistiche dalle Impostazioni.']
      },
      {
        title: 'Obiettivi personalizzati',
        roles: ['admin'],
        intro: 'Imposta traguardi su misura (fatturato, tavoli, clienti social, rango) e lascia che l\'app li monitori al posto tuo.',
        mockup: 'promoter',
        callouts: [
          { n: 4, text: 'Sezione obiettivi nella scheda promoter' },
        ],
        steps: [
          'Nella scheda del promoter, apri la sezione Obiettivi.',
          'Tocca "Aggiungi obiettivo" e scegli il tipo: fatturato, tavoli, clienti Instagram, clienti TikTok, rango o riconoscimento.',
          'Imposta il numero da raggiungere e il periodo (data di inizio e fine).',
          'Salva: il progresso si calcola da solo, confrontando i dati veri con il traguardo.',
          'Il promoter vede il suo avanzamento in "Il Mio Vibra", nella sezione Progressi.',
        ],
        tips: ['Gli obiettivi mandano notifiche e promemoria al promoter, così non se li dimentica.']
      },
      {
        title: 'Menu rapido (pressione prolungata)',
        roles: ['admin', 'super4'],
        intro: 'Tieni premuto per aprire azioni rapide: WhatsApp, Instagram, mappa e note. Il modo più veloce per contattare un promoter.',
        mockup: 'promoter',
        callouts: [
          { n: 2, text: 'Card del promoter — tieni premuto qui' },
          { n: 3, text: 'Menu con WhatsApp, Instagram, mappa e note' },
        ],
        steps: [
          'Su mobile: tieni premuto sulla card del promoter per aprire il menu rapido.',
          'Su computer: click col tasto destro sulla riga del promoter.',
          'Il menu si apre esattamente dove hai toccato, senza spostarti.',
          'Azioni disponibili: scrivi su WhatsApp, apri l\'Instagram, vedi la posizione sulla mappa, apri le note.',
          'Tocca fuori dal menu per chiuderlo senza fare nulla.',
        ],
        tips: ['Il menu è la scorciatoia più usata: imparalo, risparmi tempo ogni giorno.']
      },
      {
        title: 'Tab Confronta (grafici a confronto)',
        roles: ['admin', 'super4'],
        intro: 'Paragona due promoter affiancati per capire chi sta crescendo e chi no. Utilissimo per le valutazioni di fine stagione.',
        mockup: 'promoter-compare',
        callouts: [
          { n: 1, text: 'Tab "Confronta"' },
          { n: 2, text: 'Selettori dei due promoter da paragonare' },
          { n: 3, text: 'Grafico a linee del fatturato mensile' },
          { n: 4, text: 'Grafico a barre dei tavoli chiusi' },
        ],
        steps: [
          'Tocca il tab "Confronta" nella sezione Promoter.',
          'Scegli due promoter dai selettori in alto: uno a sinistra, uno a destra.',
          'Vedi i grafici di fatturato (linee) e tavoli (barre) affiancati, mese per mese.',
          'Confronta le pendenze: chi sale e chi scende è subito chiaro.',
          'Utile per decidere a chi dare più responsabilità o chi ha bisogno di supporto.',
        ],
        tips: ['Il confronto usa gli stessi dati delle schede promoter: nessuna differenza tra le due viste.']
      },
      {
        title: 'Tab Growth (classifica promoter)',
        roles: ['admin', 'super4'],
        intro: 'La classifica di tutti i promoter con la colonna crescita per vedere l\'andamento. Come il Growth League dei clienti, ma per il team.',
        mockup: 'promoter-growth',
        callouts: [
          { n: 1, text: 'Tab "Growth"' },
          { n: 2, text: 'Ricerca per filtrare la classifica' },
          { n: 3, text: 'Tabella con fatturato, tavoli e crescita %' },
        ],
        steps: [
          'Tocca il tab "Growth" nella sezione Promoter.',
          'Vedi la classifica dei promoter ordinata per fatturato.',
          'La colonna crescita mostra, in percentuale, chi sta andando meglio o peggio rispetto al mese scorso.',
          'Usa la ricerca in alto per trovare subito un promoter specifico nella lista.',
          'Tocca una riga per aprire la scheda completa del promoter.',
        ],
        tips: ['La classifica è la stessa del Growth League, ma qui vedi tutti i promoter, anche quelli meno attivi.']
      },
      {
        title: 'Tab Ex-PR (promoter passati)',
        roles: ['admin', 'super4'],
        intro: 'Gli ex promoter restano consultabili per lo storico, senza cancellarli. Così non perdi i dati di chi ha lavorato con te in passato.',
        mockup: 'promoter-expr',
        callouts: [
          { n: 1, text: 'Tab "Ex-PR"' },
          { n: 2, text: 'Statistiche aggregate degli ex-PR' },
          { n: 3, text: 'Lista con stato inattività' },
        ],
        steps: [
          'Tocca il tab "Ex-PR" nella sezione Promoter.',
          'Vedi i promoter che non sono più attivi, separatamente dal team attuale.',
          'Le loro statistiche restano consultabili per lo storico: fatturato, tavoli, clienti.',
          'I ex-PR restano nei grafici aziendali solo se hanno "Mostra in statistiche" attivo.',
          'Puoi riattivarli in qualsiasi momento cambiando lo stato da inattivo ad attivo.',
        ],
        tips: ['Non cancellare un ex-PR: nascondilo impostandolo inattivo. Così mantieni lo storico intatto.']
      },
      {
        title: 'Tab Obiettivi (gestione goals)',
        roles: ['admin', 'super4'],
        intro: 'Una vista dedicata a tutti gli obiettivi con le barre di progresso. Vedi a colpo d\'occhio chi è in target e chi è indietro.',
        mockup: 'promoter-obiettivi',
        callouts: [
          { n: 1, text: 'Tab "Obiettivi"' },
          { n: 2, text: 'Pulsante "Aggiungi Obiettivo"' },
          { n: 3, text: 'Barra di progresso per ogni obiettivo' },
          { n: 4, text: 'Tipi: fatturato, tavoli, clienti social, rango' },
        ],
        steps: [
          'Tocca il tab "Obiettivi" nella sezione Promoter.',
          'Vedi tutti gli obiettivi impostati per ogni promoter, con la barra di avanzamento.',
          'Tocca "Aggiungi Obiettivo" per crearne uno nuovo.',
          'Scegli il tipo: fatturato, tavoli, clienti Instagram, rango o riconoscimento.',
          'Imposta il periodo e il numero da raggiungere, poi salva.',
          'Il progresso si calcola da solo dai dati veri: la barra si riempie automaticamente.',
        ],
        tips: ['Gli obiettivi mandano notifiche e promemoria al promoter, così restano sempre motivati.']
      },
      {
        title: 'Tab Mappa (copertura territoriale)',
        roles: ['admin', 'super4'],
        intro: 'Vedi dove operano i tuoi promoter per capire la copertura territoriale. Ti dice se hai buchi in certe zone.',
        mockup: 'promoter-mappa',
        callouts: [
          { n: 1, text: 'Tab "Mappa"' },
          { n: 2, text: 'Marker posizionati per quartiere di provenienza' },
          { n: 3, text: 'Legenda con zone coperte e densità' },
        ],
        steps: [
          'Tocca il tab "Mappa" nella sezione Promoter.',
          'I marker mostrano dove operano i tuoi promoter, in base al quartiere e città impostati.',
          'Tocca un marker per vedere i dettagli del promoter.',
          'Le zone dense di marker significano copertura forte; zone vuote sono opportunità.',
          'Utile per capire dove reclutare nuovo personale o dove manca presenza.',
        ],
        tips: ['La mappa usa il quartiere e la città impostati in ogni promoter: se non lo vedi, controlla che abbia la zona compilata.']
      },
      {
        title: 'Tab Team (organigramma)',
        roles: ['admin', 'super4'],
        intro: 'L\'organigramma gerarchico del team, con i conteggi per ogni ruolo. Vedi la struttura completa a colpo d\'occhio.',
        mockup: 'promoter-team',
        callouts: [
          { n: 1, text: 'Tab "Team" — struttura gerarchica' },
          { n: 2, text: 'Albero: fondatori → capigruppo → PR → ragazze immagine' },
          { n: 3, text: 'Conteggio membri per ogni ruolo' },
        ],
        steps: [
          'Tocca il tab "Team" nella sezione Promoter.',
          'Vedi l\'organigramma completo del tuo team, strutturato ad albero.',
          'Ogni promoter è collegato al suo referente, formando i rami della gerarchia.',
          'I numeri mostrano quanti membri ha ogni ramo e ogni ruolo.',
          'Espandi i rami per vedere chi fa capo a chi, livello per livello.',
        ],
        tips: ['La struttura segue il campo "referente" impostato in ogni promoter: cambia il referente e l\'albero si aggiorna.']
      },
      {
        title: 'Tab Report (reportistica mensile)',
        roles: ['admin', 'super4'],
        intro: 'Genera il report mensile di ogni promoter ed esportalo in PDF. Perfetto per le revisioni e per condividere i risultati.',
        mockup: 'promoter-report',
        callouts: [
          { n: 1, text: 'Tab "Report" — reportistica aggregata' },
          { n: 2, text: 'Selettore mese/anno' },
          { n: 3, text: 'Tabella con fatturato e tavoli per promoter' },
          { n: 4, text: 'Pulsante esporta PDF' },
        ],
        steps: [
          'Tocca il tab "Report" nella sezione Promoter.',
          'Scegli il mese e l\'anno con il selettore in alto.',
          'Vedi il fatturato e i tavoli di ogni promoter per quel mese, in tabella.',
          'Controlla i totali in fondo per avere il quadro del mese.',
          'Esporta il report in PDF con il pulsante dedicato: pronto da condividere o stampare.',
        ],
        tips: ['Il report usa i dati pre-calcolati: si genera in pochi secondi, anche con tanti promoter.']
      }
    ]
  },

  // ── CLIENTI ───────────────────────────────────────────────
  {
    id: 'clienti',
    title: 'Clienti',
    icon: 'ContactRound',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Il cuore dell\'app: la tua rubrica clienti, con punteggi, trend, badge e mappa. Qui passi la maggior parte del tempo: ogni cliente ha la sua storia.',
    lessons: [
      {
        title: 'Aggiungere un cliente',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Crea un cliente con nome, contatti, canale di provenienza e zona di residenza. Bastano i dati essenziali per iniziare a tracciarlo.',
        mockup: 'clienti-list',
        callouts: [
          { n: 5, text: 'Pulsante "Aggiungi" in alto a destra' },
          { n: 4, text: 'Card del cliente con punteggio' },
        ],
        steps: [
          'Vai su Clienti e tocca "Aggiungi" in alto a destra.',
          'Scrivi il nome (è l\'unico campo obbligatorio).',
          'Aggiungi telefono o Instagram se li hai: servono per contattarlo in un tap.',
          'Scegli dove l\'hai conosciuto: Instagram, TikTok, di persona, presentato da qualcuno, o pagante acquisito.',
          'Se l\'ha presentato qualcuno, scegli chi: così si costruisce l\'albero delle referenze.',
          'Imposta la zona di residenza: serve per posizionarlo sulla mappa.',
          'Salva: il cliente entra subito nella tua lista con il suo punteggio iniziale.',
        ],
        tips: ['I contatti Instagram che non sono ancora venuti diventano clienti da soli alla prima serata: non devi rifarli a mano.']
      },
      {
        title: 'Box Nuovo Cliente',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il form completo per creare un cliente: contatti, zona, canale di provenienza, leader e guidatore. Tutte le opzioni in una schermata sola.',
        mockup: 'clienti-nuovo',
        callouts: [
          { n: 1, text: 'Pulsante "+" viola in alto a destra per aprire il form' },
          { n: 2, text: 'Nome (obbligatorio) + telefono e Instagram' },
          { n: 3, text: 'Zona di residenza (per la mappa)' },
          { n: 4, text: 'Dove l\'hai conosciuto (Instagram, TikTok, di persona, presentato)' },
          { n: 5, text: 'Interruttori Leader e Guidatore' },
        ],
        steps: [
          'Nel tab Clienti, tocca il pulsante "+" viola in alto a destra.',
          'Scrivi il nome (obbligatorio), poi telefono e Instagram se li hai.',
          'Scegli la zona di residenza dal menu: serve per posizionarlo sulla mappa geografica.',
          'Indica dove l\'hai conosciuto: di persona, Instagram, TikTok, o presentato da qualcuno.',
          'Se l\'ha presentato un altro cliente, scegli "Presentato" e indica chi te l\'ha portato.',
          'Se è un leader o ha la macchina, attiva gli interruttori dedicati: serviranno nel Weekend.',
          'Tocca "Aggiungi": il cliente entra subito nella tua lista, pronto da tracciare.',
        ],
        tips: ['Se lo hai conosciuto tramite un altro cliente, scegli "Presentato" e indica chi: l\'albero delle referenze si costruisce da solo.']
      },
      {
        title: 'Importa clienti',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Crea tanti clienti insieme incollando una lista di nomi, uno per riga. Perfetto quando erediti una lista da un collega.',
        mockup: 'clienti-importa',
        callouts: [
          { n: 1, text: 'Pulsante "Importa" in alto a destra (accanto a Presenze e +) per aprire il box' },
          { n: 2, text: 'Area di testo: un nome per riga' },
          { n: 3, text: 'Riepilogo dei clienti creati' },
        ],
        steps: [
          'Nel tab Clienti, tocca il pulsante "Importa" in alto a destra.',
          'Incolla la lista dei nomi nell\'area di testo, uno per riga.',
          'Vedi in tempo reale quanti clienti stai per importare: il contatore si aggiorna mentre scrivi.',
          'Tocca "Importa": ogni riga diventa una scheda cliente associata a te.',
          'Al termine vedi il riepilogo dei clienti creati e degli eventuali errori (righe vuote o duplicate).',
          'I clienti importati compaiono subito nella lista, pronti per le serate.',
        ],
        tips: ['Utile quando erediti una lista di nomi da un collega o da un vecchio foglio: evita di inserirli uno a uno.']
      },
      {
        title: 'Aggiungere presenze dal box presenze',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il box presenze registra chi c\'era a una serata, con fatturato e persone nuove, cliente per cliente. Il modo più rapido per segnare una serata intera.',
        mockup: 'clienti-presenze',
        callouts: [
          { n: 1, text: 'Pulsante "Presenze" in alto a destra (accanto a Importa e +) per aprire il box' },
          { n: 2, text: 'Selettore della serata' },
          { n: 3, text: 'Box "Aggiungi cliente o gruppo" con ricerca' },
          { n: 4, text: 'Fatturato (€), persone nuove e pulsante Salva' },
        ],
        steps: [
          'Nel tab Clienti, tocca il pulsante "Presenze" in alto a destra.',
          'Scegli la serata a cui associare le presenze dal selettore in alto.',
          'Nel tab Manuale, cerca un cliente per nome o Instagram, oppure aggiungi un intero gruppo con un tap.',
          'Per ogni cliente presente, inserisci il fatturato (€) e quante persone nuove ha portato.',
          'Tocca "Salva": la presenza si registra e il cliente si aggiorna subito, senza ricaricare.',
          'Con il tab AI puoi incollare una lista (nome, importo, persone) e l\'AI la riconosce da sola, risparmiando tempo.',
          'Se un cliente non esiste ancora, puoi crearlo al volo dal box senza chiuderlo.',
        ],
        tips: ['Il box resta aperto mentre aggiungi: segni un\'intera serata cliente per cliente in una sola sessione.']
      },
      {
        title: 'Cercare e ordinare',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La lista principale con ricerca per nome e pillole per ordinare i clienti. Trovi chiunque in due secondi.',
        mockup: 'clienti-lista-v2',
        callouts: [
          { n: 1, text: 'Tab "Clienti" — la lista principale' },
          { n: 2, text: 'Barra di ricerca per nome' },
          { n: 3, text: 'Card cliente con stellina leader e punteggio' },
        ],
        steps: [
          'Usa la barra in alto per cercare un cliente per nome o Instagram.',
          'Tocca le pillole sotto per ordinare: per punteggio, presenze, spesa, persone nuove o rating.',
          'Le pillole restano visibili mentre scorri, così cambi ordinamento senza tornare su.',
          'Tocca una card cliente per aprire la sua scheda completa.',
          'La lista si aggiorna da sola quando aggiungi o modifichi un cliente.',
        ],
        tips: ['Il punteggio (da 1 a 10) è già pronto: l\'ordinamento è istantaneo, nessun calcolo al volo.']
      },
      {
        title: 'La scheda del cliente',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tocca un cliente per aprire la sua scheda con contatti, KPI e storico. Qui vedi tutta la sua storia con te.',
        mockup: 'clienti-detail',
        callouts: [
          { n: 1, text: 'Nome, stellina leader e punteggio con gemma' },
          { n: 2, text: 'Modifica rapida: telefono, Instagram, zona, guidatore' },
          { n: 4, text: 'I tre KPI: presenze, spesa totale, media per serata' },
        ],
        steps: [
          'Tocca un cliente dalla lista per aprire la sua scheda.',
          'In alto vedi il nome, la stellina dorata se è un leader, e il punteggio con la gemma.',
          'Tocca i contatti (telefono, Instagram) per cambiarli al volo, senza chiudere la scheda.',
          'Cambia zona di residenza, dove l\'hai conosciuto, e se ha la macchina.',
          'I tre KPI sotto il nome ti dicono subito: quante volte è venuto, quanto ha speso in tutto, e la media per serata.',
          'Scorri per vedere lo storico delle serate e i dettagli del suo andamento.',
        ],
        tips: ['Le modifiche si salvano da sole: cambi un campo e resta, non devi premere "salva".']
      },
      {
        title: 'Punteggio e badge',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il punteggio da 1 a 10 e i badge sintetizzano il valore del cliente nel tempo. Ti dicono in un attimo chi vale la pena coltivare.',
        mockup: 'clienti-detail',
        callouts: [
          { n: 1, text: 'Punteggio da 1 a 10 con la gemma' },
          { n: 3, text: 'Badge dei riconoscimenti' },
        ],
        steps: [
          'Il punteggio da 1 a 10 tiene conto di quante volte viene, quanto spende e quanto spesso.',
          'La freccia vicino al punteggio ti dice se è in crescita o in calo rispetto a prima.',
          'I badge riassumono il suo stile: 🏅 Fedeltà (viene tanto), 💰 Rendita (ha speso tanto nel tempo), 💎 Spender (spende tanto a serata), 🤝 Aggregatore (porta amici).',
          'Un cliente con più badge è un cliente completo: worth mantenere stretto.',
          'I badge si aggiornano da soli man mano che il cliente accumula presenze e spesa.',
        ],
        tips: ['Le spese più alte di 50€ contano meno nel punteggio, così un big spender occasionale non brilla troppo.']
      },
      {
        title: 'Le bacheche (tab Tabelle)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Quattro bacheche pronte per individuare nuovi, top paganti, leader inattivi e clienti in calo. Ognuna ti suggerisce un\'azione diversa.',
        mockup: 'clienti-tabelle-v2',
        callouts: [
          { n: 1, text: 'Tab "Tabelle"' },
          { n: 2, text: 'Nuovi Clienti (ultimi 30 giorni, max 2 presenze)' },
          { n: 3, text: 'Top Paganti (migliori per punteggio)' },
          { n: 4, text: 'Leader Inattivi (leader che non vengono da un po\')' },
          { n: 5, text: 'Clienti in Calo (chi viene meno rispetto a prima)' },
        ],
        steps: [
          'Tocca il tab "Tabelle" in Clienti.',
          'Nuovi Clienti: entrati negli ultimi 30 giorni con al massimo 2 presenze. Vanno coccolati per farli tornare.',
          'Top Paganti: i migliori per punteggio. Sono la tua rendita, non perderli.',
          'Leader Inattivi: leader che non vengono da un po\'. Richiamali prima che spariscano.',
          'Clienti in Calo: chi sta venendo meno rispetto a prima. Intervieni prima che si perdano del tutto.',
          'Usa la ricerca per filtrare ogni bacheca per nome se la lista è lunga.',
        ],
        tips: ['Usa la ricerca per filtrare le bacheche per nome: utile quando hai tanti clienti.']
      },
      {
        title: 'Growth League (tab Growth)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La tabella ordinabile completa dei tuoi clienti: rating, presenze, spesa, frequenza, ciclo e trend. La classifica analitica per pianificare a mente.',
        mockup: 'clienti-growth-v2',
        callouts: [
          { n: 1, text: 'Tab "Growth" — barra di ricerca per filtrare' },
          { n: 2, text: 'Tabella con rating (barra), presenze, spesa, frequenza % e trend' },
        ],
        steps: [
          'Tocca il tab "Growth" in Clienti.',
          'Vedi la tabella completa: ogni riga è un cliente con tutte le sue metriche.',
          'La colonna Rating ha una barra colorata accanto al punteggio: lo confronti a colpo d\'occhio.',
          'La colonna Freq.% mostra la percentuale di presenze sulle serate disponibili, con barra di progresso.',
          'La colonna Trend indica se è in salita (verde), in calo (rosso) o stabile.',
          'Usa la ricerca in alto per filtrare la tabella e trovare un cliente specifico.',
          'Le medaglie 🥇🥈🥉 indicano i primi tre in classifica.',
        ],
        tips: ['La tabella Growth è la vista più analitica: usala quando devi fare confronti precisi tra clienti.']
      },
      {
        title: 'Mappa geografica',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Vedi i tuoi clienti posizionati sulla mappa per zona di residenza. Ti mostra dove si concentra il tuo pubblico.',
        mockup: 'clienti-mappa-v2',
        callouts: [
          { n: 1, text: 'Tab "Mappa"' },
          { n: 2, text: 'Marker posizionati per zona di residenza' },
          { n: 3, text: 'Legenda in basso: clienti, leader, gruppi' },
        ],
        steps: [
          'Tocca il tab "Mappa" in Clienti.',
          'I marker sono posizionati in base alla zona di residenza di ogni cliente.',
          'Allontanando lo zoom i marker si raggruppano: tocca un gruppo per avvicinare e vedere chi c\'è dentro.',
          'Tocca un marker singolo per aprire la scheda del cliente.',
          'La legenda in basso ti dice cosa rappresenta ogni colore (clienti, leader, gruppi).',
        ],
        tips: ['La mappa ha tema scuro per stare dietro con l\'app e non affaticare gli occhi.']
      },
      {
        title: 'Gruppi clienti',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Raggruppa clienti per zona o occasione e usali per inviti mirati. Un gruppo ti fa risparmiare tempo quando inviti.',
        mockup: 'clienti-gruppi-v2',
        callouts: [
          { n: 1, text: 'Tab "Gruppi"' },
          { n: 2, text: 'Pulsante "Crea nuovo gruppo"' },
          { n: 3, text: 'Card del gruppo con avatar dei membri e colore' },
        ],
        steps: [
          'Tocca il tab "Gruppi" in Clienti.',
          'Tocca "Crea nuovo gruppo" e dagli un nome (es. "Amici Posillipo").',
          'Aggiungi i clienti che vuoi nel gruppo, cercandoli per nome.',
          'Scegli un colore per riconoscerlo a colpo d\'occhio.',
          'Usa i gruppi dal Weekend per invitare gente mirata con un solo tap.',
        ],
        tips: ['I gruppi sono privati: ogni promoter vede solo i propri, nessuno sbircia nei tuoi.']
      },
      {
        title: 'Parco Paganti',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Un semplice quaderno di testo dove appunti liberamente la tua lista di paganti. Niente regole, scrivi come ti pare.',
        mockup: 'clienti-parco-v2',
        callouts: [
          { n: 1, text: 'Tab "Parco"' },
          { n: 2, text: 'Intestazione con il pulsante "Salva"' },
          { n: 3, text: 'Box di testo libero: scrivi nomi, gruppi, note come vuoi' },
        ],
        steps: [
          'Tocca il tab "Parco" in Clienti.',
          'Trovi un box di testo: scrivi semplicemente la tua lista di paganti, una riga per persona.',
          'Puoi aggiungere note o gruppi a mano libera (es. "Mario - gruppo 4 persone").',
          'Tocca "Salva" per conservare la lista: resta tua e non influisce sulle altre sezioni.',
          'Torna quando vuoi per aggiornare la lista: è sempre lì ad aspettarti.',
        ],
        tips: ['È solo un quaderno personale: non calcola statistiche, serve per appunti rapidi da tenere sott\'occhio.']
      },
      {
        title: 'Albero referenze',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Vedi chi ha portato chi nella struttura ad albero delle referenze. Scopri chi sono i tuoi "portatori" di gente nuova.',
        mockup: 'clienti-albero-v2',
        callouts: [
          { n: 1, text: 'Tab "Albero" — struttura delle referenze' },
          { n: 2, text: 'Cliente radice con i clienti che ha presentato' },
        ],
        steps: [
          'Tocca il tab "Albero" in Clienti.',
          'Vedi l\'albero delle referenze: chi ha presentato chi.',
          'Il cliente in alto è chi ha presentato gli altri (la radice); sotto trovi chi ha portato.',
          'Seleziona una radice specifica dal menu per concentrarti su un ramo preciso.',
          'Utile per capire chi porta più gente nuova e premiarlo di conseguenza.',
        ],
        tips: ['Solo i clienti presentati da qualcuno appaiono come figli nell\'albero: gli altri restano radici a sé.']
      },
      {
        title: 'Analitica clienti',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Statistiche aggregate dei tuoi clienti: KPI, presenze per giorno e locali preferiti. Il quadro d\'insieme della tua clientela.',
        mockup: 'clienti-analitica-v2',
        callouts: [
          { n: 1, text: 'Tab "Analitica" — statistiche aggregate' },
          { n: 2, text: 'KPI: clienti, presenze, spesa media' },
          { n: 3, text: 'Grafico presenze per giorno della settimana' },
          { n: 4, text: 'Ripartizione per locale preferito' },
        ],
        steps: [
          'Tocca il tab "Analitica" in Clienti.',
          'Vedi i KPI aggregati di tutti i tuoi clienti: quanti sono, quante presenze totali, spesa media.',
          'Il grafico mostra quando vengono di più: Ven, Sab, Dom o eventi Extra.',
          'La sezione locali preferiti mostra dove vanno abitualmente i tuoi clienti.',
          'Usa questi dati per capire quale locale punta il tuo pubblico e organizzarti di conseguenza.',
        ],
        tips: ['L\'analitica usa i dati pre-calcolati: si carica all\'istante, senza spinner.']
      },
      {
        title: 'Clienti da ricontattare',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La lista di chi non viene da un po\' o è in calo, con i dati dell\'ultima serata pronti. La tua lista di chiamate da fare.',
        mockup: 'clienti-detail',
        callouts: [
          { n: 1, text: 'Punteggio e freccia di trend' },
        ],
        steps: [
          'Apri "Da Ricontattare" dalla barra delle statistiche in Clienti.',
          'Vedi chi non viene da tanto, o chi ha un punteggio alto ma poche presenze.',
          'Scorri a destra su un cliente per segnarlo come "sentito": sparisce dalla lista delle cose da fare.',
          'Tocca un cliente per aprire la scheda con il popup dell\'ultima serata: locale, spesa, data.',
          'L\'app calcola da sola quanti giorni sono passati dall\'ultima presenza.',
        ],
        tips: ['Il popup dell\'ultima serata è pronto: lo usi come spunto per il messaggio di richiamo.']
      },
      {
        title: 'Leader e guidatori',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Imposta chi è leader e chi ha la macchina per usarli nelle strategie del weekend. Due informazioni che valgono oro nei turni.',
        mockup: 'clienti-detail',
        callouts: [
          { n: 1, text: 'Stellina dorata del leader' },
          { n: 2, text: 'Badge guidatore (macchina)' },
        ],
        steps: [
          'Un cliente leader ha la stellina dorata nella sua scheda.',
          'L\'app registra automaticamente quando l\'hai reso leader, per ordinare i più recenti.',
          'Apri il dialog Leader dalla barra delle statistiche per vederli tutti, dal più recente al più vecchio.',
          'Tieni premuto su un cliente per attivare o disattivare leader o guidatore al volo.',
          'I leader finiscono nel tab Leader del Weekend; i guidatori sono utili per organizzare gli spostamenti.',
        ],
        tips: ['I leader finiscono nel tab Leader del Weekend, dai più recenti ai più vecchi: ordine cronologico.']
      }
    ]
  },

  // ── WEEKEND / PROGRAMMAZIONE ───────────────────────────────
  {
    id: 'programmazione',
    title: 'Weekend (Programmazione)',
    icon: 'Send',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Il centro operativo per decidere chi invitare, come e quando nel prossimo weekend. Qui trasformi i tuoi dati in serate piene.',
    lessons: [
      {
        title: 'Il prospetto inviti',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Organizza chi invitare alle prossime serate, con note per ogni cliente. È la tua agenda di inviti, privata e sempre a portata.',
        mockup: 'weekend-inviti-v2',
        callouts: [
          { n: 1, text: 'Tab "Inviti"' },
          { n: 2, text: 'Prospetto con le date dei prossimi eventi' },
        ],
        steps: [
          'Tocca il tab "Inviti": è la schermata di partenza del Weekend.',
          'Vedi le date dei prossimi eventi già pronte, una per sera.',
          'Tieni premuto su una card cliente (ovunque tu sia in Clienti o Weekend) per aggiungerlo a una serata specifica.',
          'Aggiungi note per ogni cliente nel prospetto (es. "VIP, tavolo front") così ricordi come trattarlo.',
          'Rimuovi un cliente dal prospetto con la X sulla sua card se ci ripensi.',
          'Il prospetto è privato: lo vedi solo tu, nessun collega può sbirciare.',
        ],
        tips: ['Il prospetto è privato: lo vedi solo tu, è il tuo piano personale di inviti.']
      },
      {
        title: 'Il menu contestuale: aggiungere a serata',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tieni premuto su un cliente (o click col tasto destro su computer) per aprire il menu rapido. Da qui lo aggiungi a una serata in un tap, crei serate extra o le elimini.',
        mockup: 'weekend-context-menu-dates',
        callouts: [
          { n: 1, text: 'Card del cliente — tieni premuto (mobile) o click destro (computer) per aprire il menu' },
          { n: 2, text: 'Lista delle prossime serate (Ven/Sab/Dom + extra) — tocca per aggiungere il cliente' },
          { n: 3, text: 'Spunta verde: il cliente è già nel prospetto di quella serata' },
          { n: 4, text: '"Crea nuova serata extra": crea una serata personalizzata (es. Capodanno, Ferra)' },
          { n: 5, text: 'Cestino: elimina una serata extra (solo admin)' },
        ],
        steps: [
          'Su mobile: tieni premuto sulla card di un cliente per mezzo secondo. Su computer: click col tasto destro.',
          'Il menu si apre esattamente dove hai toccato, sopra un backdrop scuro che blocca il resto dello schermo.',
          'Vedi le prossime serate (Ven/Sab/Dom con i locali della stagione) e le serate extra create da te o dai colleghi.',
          'Tocca una serata per aggiungere il cliente al prospetto: la spunta verde conferma l\'aggiunta.',
          'Tocca di nuovo la stessa serata per rimuoverlo dal prospetto (la spunta sparisce).',
          'Per una serata personalizzata, tocca "Crea nuova serata extra": scrivi nome e data, poi conferma.',
          'La serata extra è condivisa con tutti i promoter: la vedi tu e i tuoi colleghi nel menu.',
          'Per eliminare una serata extra che non serve più, tocca il cestino a destra (solo admin).',
          'Chiudi il menu con la X, toccando fuori, o premendo il tasto Indietro su Android.',
        ],
        tips: ['Le serate extra create da un promoter sono visibili a tutti: utile per eventi condivisi come Capodanno o ferragosto.']
      },
      {
        title: 'Azioni rapide dal menu contestuale',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Oltre ad aggiungere a serata, il menu offre azioni rapide sul cliente: leader, guidatore, WhatsApp e promemoria. Tutto senza aprire la scheda.',
        mockup: 'weekend-context-menu-actions',
        callouts: [
          { n: 1, text: 'Rendi/Rimuovi leader (stellina dorata)' },
          { n: 2, text: 'Rendi/Rimuovi guidatore (macchina)' },
          { n: 3, text: 'Contatta: apre WhatsApp e segna come contattato' },
          { n: 4, text: 'Ricordami di ricontattarlo: imposta un promemoria con notifica push' },
        ],
        steps: [
          'Apri il menu contestuale con pressione prolungata (o click destro su computer).',
          'Sotto la lista serate trovi le azioni rapide sul cliente (solo per clienti reali, non semine).',
          'Tocca "Rendi leader" per attivare la stellina dorata, o "Rimuovi leader" per disattivarla.',
          'Tocca "Rendi guidatore" per segnare che ha la macchina, utile per organizzare gli spostamenti.',
          'Tocca "Contatta" per aprire la chat WhatsApp del cliente: l\'app lo segna anche come contattato.',
          'Se il cliente non ha il telefono, il menu mostra "Contatta (senza telefono)" e non apre WhatsApp.',
          'Tocca "Ricordami di ricontattarlo" per impostare un promemoria: riceverai una notifica push alla data scelta.',
        ],
        tips: ['Le azioni rapide sono disponibili ovunque ci sia una card cliente: in Clienti, nel Weekend, nelle bacheche e nei suggerimenti.']
      },
      {
        title: 'Suggerimenti settimanali',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il box ti propone già pronto chi invitare per il weekend, diviso per tipo. Non devi pensarci: l\'app ha già scelto per te.',
        mockup: 'weekend-ricontattare-v2',
        callouts: [
          { n: 4, text: 'Box con i clienti suggeriti per il weekend' },
        ],
        steps: [
          'Nel tab Inviti, trova il box "Suggerimenti" con i clienti già selezionati per il weekend.',
          'Tipi di suggerimento: da tempo (non viene da un po\'), top (spende tanto), da ricontattare, da recuperare, nuovo.',
          'Ogni suggerimento ha un motivo scritto, così capisci perché l\'app te lo propone.',
          'Tocca un cliente del box per aprire la sua scheda e decidere.',
          'Tocca l\'icona WhatsApp per scrivergli subito, senza copiare il numero.',
          'I suggerimenti sono pronti: l\'app li calcola in automatico ogni settimana.',
        ],
        tips: ['I suggerimenti sono pronti: l\'app li calcola in automatico, tu devi solo confermare e scrivere.']
      },
      {
        title: 'Analisi Intelligente',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il tuo consulente AI personale: analizza tutto il tuo parco clienti e ti dice chi invitare, perché e come contattarlo. Non è una lista fissa: ragiona sui tuoi dati veri e scrive i messaggi per te.',
        mockup: 'weekend-ai-console',
        callouts: [
          { n: 1, text: 'Intestazione "Analisi Intelligente" con icona cervello' },
          { n: 2, text: 'Pulsante "Ricalcola" per aggiornare l\'analisi' },
          { n: 3, text: 'Sintesi del parco paganti: quadro generale scritto dall\'AI' },
          { n: 4, text: 'Filtri: cerca per nome e filtra per categoria' },
          { n: 5, text: 'Card del cliente con categoria, priorità, trend, "perché ora" e approccio' },
        ],
        steps: [
          'Nel tab Inviti del Weekend, trova il box viola "Analisi Intelligente": è il tuo consulente AI sul parco clienti.',
          'La sintesi in alto ti dà il quadro generale: quanti clienti attivi, quanti leader, chi è in calo, le zone forti e un consiglio strategico per il weekend.',
          'Sotto trovi la lista dei tuoi clienti, ognuno con una categoria (Leader, Top, Da recuperare, Inattivo, Nuovo, Stabile), una priorità da 1 a 5 e il trend (Su, Giù, Stabile).',
          'Per ogni cliente l\'AI scrive una descrizione sintetica della sua storia: quante presenze, il locale principale, il periodo di picco e in quali giorni viene di più.',
          'Il campo "Perché ora" ti dice concretamente perché invitarlo questo weekend, incrociando i dati: il giorno giusto in base a dove viene di più, i guidatori della sua zona per un passaggio, le catene di referenze.',
          'Il campo "Approccio" è il messaggio già pronto, scritto in tono giovane e diretto come scriveresti tu su WhatsApp: copialo o usalo come spunto.',
          'Tocca le icone WhatsApp e Instagram sulla card per contattarlo subito: l\'app lo segna anche come "sentito".',
          'Usa la ricerca per filtrare per nome e il menu a tendina per vedere solo una categoria (es. solo "Da recuperare").',
        ],
        tips: ['L\'analisi si aggiorna da sola ogni settimana, ma se vuoi i dati freschi subito tocca "Ricalcola": in pochi secondi ricalcola tutto sul tuo parco clienti attuale.']
      },
      {
        title: 'Analisi: ordinamento intelligente per giorno',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La lista si ordina da sola in base al giorno della settimana: il weekend mette primi i clienti forti di quella serata, in settimana punta sui nuovi promettenti.',
        mockup: 'weekend-ai-console',
        callouts: [
          { n: 5, text: 'L\'ordine delle card cambia in base al giorno: i migliori per quella serata vengono primi' },
        ],
        steps: [
          'Apri l\'Analisi Intelligente di venerdì, sabato o domenica: l\'ordine delle card cambia da solo.',
          'Nel weekend, i clienti che vengono di più in quella serata (venerdì, sabato o domenica) finiscono ai primi posti.',
          'In settimana (lunedì-giovedì) l\'ordine punta sui clienti nuovi promettenti e su quelli col trend in risalita.',
          'L\'ordinamento usa le presenze cumulative per giorno, pre-calcolate in background: niente attese.',
          'Se modifichi un cliente (cambi zona, lo rendi leader, aggiungi il telefono), la card si aggiorna subito senza ricalcolare l\'AI.',
        ],
        tips: ['Le modifiche al profilo cliente (zona, leader, contatti) si riflettono subito nelle card, senza dover ricalcolare l\'analisi.']
      },
      {
        title: 'Semina Instagram',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Segna i contatti Instagram che stai coltivando prima che diventino clienti. Tieni traccia dei lead che stai lavorando nei DM.',
        mockup: 'weekend-semina-v2',
        callouts: [
          { n: 3, text: 'Box rosa "Semina Instagram"' },
        ],
        steps: [
          'Nel tab Inviti, trova il box rosa "Semina Instagram".',
          'Tocca "Aggiungi Semina" per registrare un nuovo contatto IG.',
          'Scrivi nome e link del profilo IG del contatto che stai coltivando.',
          'La semina resta nel prospetto come promemoria finché non la trasformi in cliente vero.',
          'Elimina una semina con il pulsante sulla sua card quando non serve più.',
          'Puoi aprire l\'app con un link precompilato per aggiungere una semina al volo dal browser.',
        ],
        tips: ['Puoi aprire l\'app con un link precompilato per aggiungere una semina al volo, senza digitare.']
      },
      {
        title: 'Da ricontattare nel Weekend',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Chi non viene da un po\' o è in calo, con il popup dell\'ultima serata pronto. La tua lista di recupero per riempire il weekend.',
        mockup: 'weekend-ricontattare-v2',
        callouts: [
          { n: 5, text: 'Sezione "Da Ricontattare"' },
        ],
        steps: [
          'Nel tab Inviti, scorri fino alla sezione "Da Ricontattare".',
          'Vedi chi non viene da tanto tempo o chi è in calo: i primi da chiamare.',
          'Scorri su un cliente per segnarlo come contattato o aprire WhatsApp direttamente.',
          'Tocca un cliente per il popup con l\'ultima serata: locale, spesa, data, pronti da usare come spunto.',
          'Il popup è pronto all\'istante: i dati dell\'ultima serata sono già calcolati.',
        ],
        tips: ['Il popup è pronto all\'istante: i dati dell\'ultima serata sono già calcolati, niente attese.']
      },
      {
        title: 'Tab Target (clienti per locale)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Scegli un locale e vedi quali clienti sono più affini a quella serata, con una barra di frequenza per ognuno. Il modo mirato per riempire un locale specifico.',
        mockup: 'weekend-target-v2',
        callouts: [
          { n: 1, text: 'Selettore locale: scegli per quale venue vedere i clienti target' },
          { n: 2, text: 'Riepilogo: clienti target totali e già confermati' },
          { n: 3, text: 'Lista clienti con barra di frequenza per quel locale, stellina leader e icona guidatore' },
          { n: 4, text: 'Anello di progresso: quanti target hai già confermato sul totale' },
        ],
        steps: [
          'Tocca il tab "Target" nel Weekend.',
          'Scegli il locale dal selettore in alto: vedi solo i clienti affini a quella serata.',
          'Ogni cliente ha una barra di frequenza: quante volte è venuto in quel locale sul totale delle serate disponibili.',
          'Le stelline dorate indicano i leader, le icone auto i guidatori: utili per organizzare i passaggi.',
          'Tocca "Invita" per aggiungere il cliente al prospetto di quella serata.',
          'L\'anello in fondo ti dice quanti target hai già confermato rispetto al totale.',
        ],
        tips: ['Usa Target quando un locale ha bisogno di essere riempito: trovi subito chi è già affezionato a quel venue.']
      },
      {
        title: 'Tab Leader',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'I tuoi clienti leader, dal più recente al più vecchio, con le stelle. I tuoi opinion maker, da trattare col guanto.',
        mockup: 'weekend-leader-v2',
        callouts: [
          { n: 1, text: 'Tab "Leader"' },
          { n: 2, text: 'Lista con bordo ambrato e conteggio leader' },
          { n: 3, text: 'Card del leader con stella (Oro, Argento, Bronzo)' },
          { n: 4, text: 'Ordinati dal più recente al più vecchio' },
        ],
        steps: [
          'Tocca il tab "Leader" nel Weekend.',
          'Vedi la lista dei clienti leader, ordinati dai più recenti ai più vecchi.',
          'Ogni leader ha una stella Oro, Argento o Bronzo in base a presenze e spesa.',
          'Il bordo ambrato e il conteggio in alto ti dicono subito quanti leader hai.',
          'Scorri per segnare un leader come "sentito"; tocca per aprire la sua scheda.',
        ],
        tips: ['La lista è la stessa che vedi nel dialog Leader in Clienti: cambiano in sincrono.']
      },
      {
        title: 'Tab Tabelle',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Le quattro bacheche rapide anche qui, per lavorare sul weekend senza cambiare sezione. Tutto a portata di tab.',
        mockup: 'weekend-tabelle-v2',
        callouts: [
          { n: 1, text: 'Tab "Tabelle"' },
          { n: 2, text: 'Nuovi Clienti' },
          { n: 3, text: 'Top Paganti' },
          { n: 4, text: 'Leader Inattivi' },
          { n: 5, text: 'Clienti in Calo' },
        ],
        steps: [
          'Tocca il tab "Tabelle" nel Weekend.',
          'Quattro bacheche pronte: Nuovi Clienti, Top Paganti, Leader Inattivi, Clienti in Calo.',
          'Scorri a destra su mobile per vederle tutte, oppure le trovi in griglia su computer.',
          'Tocca "Mostra tutti" se una bacheca ha più di 30 clienti, per caricarli tutti.',
          'Ogni bacheca ti suggerisce un\'azione: coccolare i nuovi, premiare i top, richiamare gli inattivi, recuperare i in calo.',
        ],
        tips: ['Le bacheche mostrano solo i tuoi clienti: la tua serra personale.']
      },
      {
        title: 'Growth League',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La tabella ordinabile dei tuoi clienti con presenze, spesa, punteggio e crescita. La classifica completa per pianificare a mente.',
        mockup: 'clienti-growth-v2',
        callouts: [
          { n: 1, text: 'Tab "Growth"' },
          { n: 2, text: 'Barra di ricerca per filtrare' },
          { n: 3, text: 'Tabella con presenze, spesa, punteggio, crescita e WhatsApp' },
        ],
        steps: [
          'Tocca il tab "Growth" nel Weekend.',
          'Vedi la tabella con tutti i tuoi clienti: presenze, spesa, punteggio, trend, crescita %.',
          'La colonna "Crescita" mostra quanto sono aumentate le presenze rispetto al mese scorso.',
          'Usa la ricerca per filtrare la tabella e trovare un cliente specifico.',
          'Link WhatsApp e Instagram diretti dalla riga: contatti senza uscire dalla tabella.',
        ],
        tips: ['La colonna "Crescita" mostra quanto sono aumentate le presenze rispetto al mese scorso: positiva = bene.']
      },
      {
        title: 'Trasformare il prospetto in presenze',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Dopo la serata, converti il prospetto in presenze reali associate all\'evento. Così il piano diventa dato vero.',
        mockup: 'weekend-inviti-v2',
        callouts: [
          { n: 2, text: 'Prospetto inviti con il pulsante "Converti"' },
        ],
        steps: [
          'Finita la serata, torna nel prospetto e tocca "Converti in Presenze".',
          'Scegli la serata vera a cui associare le presenze dal menu.',
          'Conferma: tutte le persone nel prospetto diventano presenze reali, collegate all\'evento.',
          'I clienti si aggiornano da soli: punteggi, badge, statistiche si ricalcolano in automatico.',
          'Dopo la conversione, le liste di Clienti e le bacheche si aggiornano da sole.',
        ],
        tips: ['Dopo la conversione, le liste si aggiornano da sole: non devi rifare nulla a mano.']
      }
    ]
  },

  // ── SEMINE ────────────────────────────────────────────────
  {
    id: 'semine',
    title: 'Semine',
    icon: 'Sprout',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'La serra dei tuoi contatti Instagram e TikTok non ancora clienti: li semini, li coltivi e li trasformi in clienti. Traccia i lead che stai lavorando nei DM prima che diventino presenze.',
    lessons: [
      {
        title: 'La lista Semine',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La agenda dei contatti che stai coltivando: ogni semina ha foto, handle, stato, recettività e data dell\'ultimo contatto. Tutto a portata di sguardo.',
        mockup: 'semine-lista-v2',
        callouts: [
          { n: 1, text: 'Statistiche rapide: totale, interessati, contattati, nuovi' },
          { n: 2, text: 'Ricerca per nome e pillole di ordinamento (recettività, stato)' },
          { n: 3, text: 'Toggle Attive / Spente: le semine spente sono nascoste dal tab Inviti' },
          { n: 4, text: 'Card della semina con bordo colorato per recettività, stato e ultimo contatto' },
        ],
        steps: [
          'Vai su Semine dal menu o dalla barra di navigazione.',
          'Vedi le statistiche rapide in alto: quante semine hai totali, quante interessate, quante contattate, quante nuove.',
          'Usa la barra di ricerca per filtrare per nome o handle.',
          'Tocca le pillole per ordinare per recettività (le più promettenti prima) o per stato.',
          'Il toggle Attive/Spente separa le semine che stai coltivando da quelle messe in pausa.',
          'Ogni card ha il bordo colorato in base alla recettività: verde (super recettiva), giallo (ottima empatia), neutro (da coltivare).',
        ],
        tips: ['Il bordo colorato della card ti dice subito quali semine sono più promettenti: le verdi vanno contattate per prime.']
      },
      {
        title: 'Long-press: il menu contestuale',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tieni premuto su una semina (o click destro su computer) per aprire il menu rapido. Da qui incolla, contatta, spegni o elimini senza aprire la scheda.',
        mockup: 'semine-long-press-v2',
        callouts: [
          { n: 1, text: 'Tieni premuto sulla card (mobile) o click destro (computer) per aprire il menu' },
          { n: 2, text: 'Menu contestuale con tutte le azioni rapide' },
          { n: 3, text: '"Incolla semina": crea una semina dal contenuto degli appunti' },
          { n: 4, text: '"Incolla foto profilo": aggiorna la foto dalla clipboard' },
        ],
        steps: [
          'Su mobile: tieni premuto sulla card di una semina per mezzo secondo. Su computer: click col tasto destro.',
          'Il menu si apre esattamente dove hai toccato, sopra un backdrop scuro.',
          'Le azioni rapide includono: incolla semina, incolla foto profilo, cattura manuale, contatta su WhatsApp, apri profilo IG, spegni o elimina.',
          'Tocca fuori dal menu o premi il tasto Indietro per chiudere senza fare nulla.',
          'Puoi anche fare long-press su un\'area vuota della pagina per aprire il menu "Incolla semina" direttamente.',
        ],
        tips: ['Il long-press su un\'area vuota apre direttamente il menu per incollare una nuova semina: la via più veloce per registrarne una nuova.']
      },
      {
        title: 'Incollare una semina dagli appunti',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Copia il testo di un profilo Instagram o TikTok e incollalo: l\'app riconosce nome, handle, URL e telefono da sola. Una semina pronta in due secondi.',
        mockup: 'semine-paste-semina-v2',
        callouts: [
          { n: 1, text: 'Contenuto degli appunti rilevato automaticamente' },
          { n: 2, text: 'Anteprima della semina con i dati già estratti (nome, handle, URL, telefono)' },
          { n: 3, text: 'Conferma con "Incolla semina" per creare il record' },
        ],
        steps: [
          'Copia il testo di un profilo Instagram o TikTok (nome, bio, link) negli appunti.',
          'Vai su Semine e fai long-press su un\'area vuota (o su una card esistente).',
          'Tocca "Incolla semina" nel menu contestuale.',
          'L\'app legge gli appunti e riconosce automaticamente: nome, handle Instagram/TikTok, URL del profilo e numero di telefono.',
          'Vedi l\'anteprima con i dati già estratti: controlla che siano corretti.',
          'Tocca "Incolla semina" per confermare: la semina entra subito nella tua lista.',
        ],
        tips: ['Non devi compilare campi a mano: l\'app estrae nome, handle, URL e telefono dal testo incollato.']
      },
      {
        title: 'Incollare la foto profilo',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Copia l\'immagine di un profilo Instagram e incollala sulla semina: la foto si aggiorna all\'istante. Riconosci i contatti a colpo d\'occhio.',
        mockup: 'semine-paste-photo-v2',
        callouts: [
          { n: 1, text: 'Card della semina con avatar vuoto (dashed border)' },
          { n: 2, text: 'Long-press sulla card → "Incolla foto profilo"' },
          { n: 3, text: 'L\'app rileva l\'immagine negli appunti e mostra l\'anteprima' },
          { n: 4, text: 'Conferma per applicare la foto' },
          { n: 5, text: 'La semina ora ha la foto profilo visibile in tutte le viste' },
        ],
        steps: [
          'Su Instagram (o TikTok), copia l\'immagine del profilo che vuoi seminare.',
          'Vai su Semine e fai long-press sulla card della semina.',
          'Tocca "Incolla foto profilo" nel menu contestuale.',
          'L\'app rileva l\'immagine negli appunti e mostra l\'anteprima.',
          'Conferma: la foto si applica all\'istante alla semina.',
          'La foto è ora visibile in tutte le viste: lista, prospetto inviti, menu contestuali.',
        ],
        tips: ['Puoi incollare la foto anche dal dialog di modifica o di cattura: il pulsante "Incolla" è sempre disponibile accanto al caricamento manuale.']
      },
      {
        title: 'Catturare una semina manualmente',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il form completo per registrare una semina a mano: piattaforma, nome, handle, URL, telefono, foto, stato e recettività. Quando non puoi incollare, lo compili tu.',
        mockup: 'semine-cattura-v2',
        callouts: [
          { n: 1, text: 'Selettore piattaforma: Instagram o TikTok' },
          { n: 2, text: 'Nome (obbligatorio, estratto dall\'handle se vuoto)' },
          { n: 3, text: 'Handle Instagram (senza @)' },
          { n: 4, text: 'URL del profilo o della chat (per i lead via DM)' },
          { n: 5, text: 'Telefono / WhatsApp (opzionale)' },
          { n: 6, text: 'Foto profilo: incolla o carica dal dispositivo' },
          { n: 7, text: 'Stato e recettività, poi "Salva semina"' },
        ],
        steps: [
          'Tocca il "+" in alto a destra o "Cattura manualmente" dal menu contestuale.',
          'Scegli la piattaforma: Instagram o TikTok.',
          'Scrivi il nome (obbligatorio). Se lo lasci vuoto, l\'app lo estrae dall\'handle automaticamente.',
          'Inserisci l\'handle (senza la @) e l\'URL del profilo o della chat.',
          'Aggiungi il telefono se lo hai: serve per il contatto rapido su WhatsApp.',
          'Incolla o carica la foto profilo se vuoi.',
          'Imposta lo stato iniziale (nuovo di default) e la recettività (1 = da coltivare).',
          'Tocca "Salva semina": entra subito nella lista.',
        ],
        tips: ['Se scrivi solo l\'handle, l\'app costruisce da sola l\'URL del profilo: non devi digitarlo a mano.']
      },
      {
        title: 'Modificare una semina',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tocca una semina per aprirla e aggiornarla: stato, recettività, ultimo contatto, note e foto. Tutti i campi in una schermata sola.',
        mockup: 'semine-modifica-v2',
        callouts: [
          { n: 1, text: 'Foto e nome modificabili, con pulsanti incolla/carica foto rapido' },
          { n: 2, text: 'Stato di avanzamento: nuovo → contattato → interessato → convertito' },
          { n: 3, text: 'Slider recettività (1-3): da coltivare → ottima empatia → super recettiva' },
          { n: 4, text: 'Data dell\'ultimo contatto (per i promemoria)' },
          { n: 5, text: 'Note libere sulla semina' },
          { n: 6, text: 'Interruttore "Semina spenta": la nasconde dal tab Inviti' },
          { n: 7, text: 'Elimina o salva' },
        ],
        steps: [
          'Tocca una semina dalla lista per aprire il dialog di modifica.',
          'Aggiorna nome e foto: i pulsanti incolla e carica sono accanto all\'avatar.',
          'Cambia stato toccando una delle pillole: nuovo, contattato, interessato o convertito.',
          'Trascina lo slider recettività per indicare quanto è promettente (1-3).',
          'Imposta la data dell\'ultimo contatto per i promemoria automatici.',
          'Scrivi note libere: cosa le hai detto, quando richiamarla, cosa le interessa.',
          'Se la semina è persa, attiva "Semina spenta": viene grigia e nascosta dal tab Inviti.',
          'Tocca "Salva" per confermare o "Elimina" per cancellarla definitivamente.',
        ],
        tips: ['Lo stato "convertito" segna che la semina è diventata cliente: puoi comunque tenerla per lo storico.']
      },
      {
        title: 'Flip card: i dati AI estratti dai DM',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Inclina o scorri la card di una semina per girarla e vedere i dati che l\'AI ha estratto dai vostri DM: età, zona, locali preferiti, inviti e una sintesi.',
        mockup: 'semine-flip-v2',
        callouts: [
          { n: 1, text: 'Card della semina (fronte): foto, nome, handle, stato e recettività' },
          { n: 2, text: 'Retro: dati AI estratti automaticamente dai messaggi Instagram' },
          { n: 3, text: 'Indicatore di flip: scorri o inclina la card per girarla' },
        ],
        steps: [
          'Sulla card di una semina, scorri orizzontalmente o inclina il telefono per girarla.',
          'Il retro mostra i dati che l\'AI ha estratto dai vostri messaggi Instagram: età stimata, zona di residenza, locali preferiti e inviti.',
          'La sintesi AI riassume in una frase il tono della conversazione e cosa le hai promesso.',
          'I dati si aggiornano da soli ogni volta che sincronizzi i DM: niente da fare a mano.',
          'Gira di nuovo la card per tornare alla vista normale.',
          'Se non ci sono ancora dati AI, il retro mostra un messaggio: sincronizza i DM per attivare l\'estrazione.',
        ],
        tips: ['L\'estrazione AI funziona solo se hai collegato Instagram e sincronizzato i DM: senza DM, niente dati sul retro.']
      },
      {
        title: 'Drag & Drop: riordinare le semine',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'In modalità riordino, trascina le card per metterle nell\'ordine che vuoi. Le semine più importanti finiscono in alto, a portata di tap.',
        mockup: 'semine-drag-v2',
        callouts: [
          { n: 1, text: 'Modalità riordino attiva: trascina le card' },
          { n: 2, text: 'Card trascinata: si solleva con ombra e rotazione, il placeholder mostra dove finirà' },
        ],
        steps: [
          'Tocca il pulsante di ordinamento e scegli "Manuale" per entrare in modalità riordino.',
          'Le card mostrano l\'icona di drag (GripVertical) sul lato sinistro.',
          'Su mobile: tieni premuto su una card e trascinala su o giù. Su computer: click e trascina.',
          'Mentre trascini, la card si solleva con un\'ombra e il placeholder mostra dove finirà.',
          'Rilascia per fissare la posizione: l\'ordine si salva automaticamente.',
          'Esci dalla modalità riordino per tornare alla visualizzazione normale.',
        ],
        tips: ['L\'ordine manuale si salva da solo: la prossima volta che apri Semine, le card sono dove le hai lasciate.']
      },
      {
        title: 'Semine spente (in pausa)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Le semine che non portano avanti finiscono nel tab "Spente": grigie e nascoste dal tab Inviti, ma non cancellate. Le riattivi quando vuoi.',
        mockup: 'semine-spente-v2',
        callouts: [
          { n: 1, text: 'Toggle "Spente": vedi le semine messe in pausa' },
          { n: 2, text: 'Banner informativo: le semine spente sono nascoste dal tab Inviti' },
          { n: 3, text: 'Card grigie con pulsante "Riattiva" per rimetterle in gioco' },
        ],
        steps: [
          'Tocca il toggle "Spente" per vedere le semine che hai messo in pausa.',
          'Le card sono grigie e opache: si distinguono subito da quelle attive.',
          'Un banner ti ricorda che le semine spente sono nascoste dal tab Inviti del Weekend.',
          'Per riattivare una semina, tocca il pulsante verde "Riattiva" sulla sua card.',
          'La semina torna subito attiva: riappare nel tab Inviti e nelle statistiche.',
          'Usa "Spenta" per le semine che non rispondono o che hai perso, senza cancellarle.',
        ],
        tips: ['Non cancellare le semine morte: spegnile. Così mantieni lo storico e le riattivi se tornano a farsi vive.']
      }
    ]
  },

  // ── MESSAGGI ──────────────────────────────────────────────
  {
    id: 'messaggi',
    title: 'Messaggi',
    icon: 'MessageCircle',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'I tuoi DM Instagram sincronizzati nell\'app: leggi le chat, rispondi, aggiungi contatti alle semine e invita gente alle serate senza uscire dalla conversazione.',
    lessons: [
      {
        title: 'La lista conversazioni',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tutti i tuoi DM Instagram in un\'unica lista, divisa per semine, clienti e non abbinati. Vedi subito chi ha scritto e cosa ha detto.',
        mockup: 'messaggi-lista-v2',
        callouts: [
          { n: 1, text: 'Header con conteggio conversazioni e pulsante "Aggiorna" per sincronizzare' },
          { n: 2, text: 'Sub-tab: Semine, Clienti, Non abbinati — filtra per stato del contatto' },
          { n: 3, text: 'Conversazione fissata (pinned) con bordo viola e icona pin' },
          { n: 4, text: 'Conversazione con badge "cliente" o "semina" e anteprima ultimo messaggio' },
        ],
        steps: [
          'Vai su Messaggi dal menu: vedi tutti i tuoi DM Instagram sincronizzati.',
          'L\'header rosa ti dice quante conversazioni hai e quanti messaggi non letti.',
          'Tocca "Aggiorna" per sincronizzare nuovi DM: l\'app scarica le ultime conversazioni da Instagram.',
          'I sub-tab dividono le chat: Semine (contatti che stai coltivando), Clienti (già venuti), Non abbinati (nuovi contatti da riconoscere).',
          'Ogni conversazione mostra foto, nome, handle, anteprima dell\'ultimo messaggio e timestamp.',
          'I messaggi non letti hanno un badge numerico; le conversazioni fissate stanno in cima con bordo viola.',
          'Usa la ricerca per filtrare per nome, handle o contenuto del messaggio.',
        ],
        tips: ['I DM si sincronizzano in automatico ogni 5 minuti, ma "Aggiorna" li scarica subito se aspetti una risposta importante.']
      },
      {
        title: 'Aprire e rispondere a una chat',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tocca una conversazione per espanderla e vedere tutti i messaggi. Puoi rispondere direttamente dall\'app, senza aprire Instagram.',
        mockup: 'messaggi-chat-v2',
        callouts: [
          { n: 1, text: 'Intestazione della conversazione con foto, nome e badge semina/cliente' },
          { n: 2, text: 'Messaggi in entrata (grigio) e in uscita (viola), con separatore di data' },
          { n: 3, text: 'Barra di risposta: scrivi e invia senza uscire dall\'app' },
        ],
        steps: [
          'Tocca una conversazione dalla lista per espanderla e vedere tutti i messaggi.',
          'I messaggi in entrata sono grigi, i tuoi messaggi in uscita sono viola.',
          'I separatori di data (Oggi, Ieri, o la data) ti orientano nella cronologia.',
          'I messaggi vocali, immagini e video mostrano un\'icona invece del testo.',
          'Scrivi la risposta nella barra in fondo e tocca invia: il messaggio parte da Instagram.',
          'La conversazione si segna come letta appena la apri.',
          'Tocca di nuovo la conversazione per richiuderla e tornare alla lista.',
        ],
        tips: ['Le risposte partono davvero da Instagram: il contatto le riceve come DM normale, non sa che stai usando Vibra.']
      },
      {
        title: 'Dal DM al contatto: menu contestuale',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tieni premuto su una conversazione per aprire il menu rapido. Da qui aggiungi il contatto alle semine, lo inviti a una serata, lo fissi o lo ignori.',
        mockup: 'messaggi-menu-v2',
        callouts: [
          { n: 1, text: 'Tieni premuto sulla conversazione (o click destro su computer) per aprire il menu' },
          { n: 2, text: 'Menu contestuale con tutte le azioni rapide' },
          { n: 3, text: '"Aggiungi alle Semine": crea una semina dall\'handle del contatto' },
          { n: 4, text: '"Aggiungi a una serata": invita il contatto a una serata del prospetto' },
        ],
        steps: [
          'Su mobile: tieni premuto su una conversazione per mezzo secondo. Su computer: click col tasto destro.',
          'Il menu si apre con le azioni rapide disponibili per quella conversazione.',
          'Tocca "Aggiungi alle Semine" per creare una semina dall\'handle Instagram del contatto: si apre il dialog di cattura precompilato.',
          'Tocca "Aggiungi a una serata" per aggiungere il contatto al prospetto inviti di una serata specifica.',
          'Tocca "Fissa in cima" per tenere la conversazione sempre in alto, o "Ignora" per nasconderla dalla lista.',
          'Le conversazioni ignorate non vengono più sincronizzate: utile per spam o contatti che non ti interessano.',
          'Puoi sempre ripristinare una conversazione ignorata dalle impostazioni.',
        ],
        tips: ['Se un contatto non è abbinato a nessuna semina o cliente, "Aggiungi alle Semine" è la via più veloce per iniziare a coltivarlo.']
      }
    ]
  },

  // ── SERATE ────────────────────────────────────────────────
  {
    id: 'serate',
    title: 'Serate',
    icon: 'CalendarRange',
    roles: ['admin', 'super4'],
    intro: 'Crea le serate, segna chi c\'era e quanto ha speso, importa dati in batch. Lo storico ufficiale di ogni notte di lavoro.',
    lessons: [
      {
        title: 'Creare una serata',
        roles: ['admin'],
        intro: 'Crea l\'evento con nome, data, locale e soglia tavolo. Il primo passo per registrare una notte di lavoro.',
        mockup: 'serate',
        callouts: [
          { n: 1, text: 'Pulsante "Nuova Serata"' },
          { n: 4, text: 'Soglia per chiudere un tavolo' },
        ],
        steps: [
          'Vai su Serate e tocca "Nuova Serata".',
          'Scrivi nome e data (sono obbligatori) e scegli il locale dal menu.',
          'Imposta la soglia per chiudere un tavolo: di default 300€ per Ven/Dom, 360€ per Sab.',
          'Spunta "Extra" se è un evento festivo o speciale (cambia la categoria della serata).',
          'Salva: la serata compare nello storico, pronta per ricevere le presenze.',
          'La soglia decide quando una presenza conta come tavolo chiuso: regolala in base all\'accordo col locale.',
        ],
        tips: ['La soglia decide quando una presenza conta come tavolo chiuso: se un cliente spende meno, non conta come tavolo.']
      },
      {
        title: 'Segnare le presenze',
        roles: ['admin', 'super4'],
        intro: 'Registra promoter, cliente, fatturato, tavolo e persone nuove per ogni serata. Il dato grezzo che alimenta tutte le statistiche.',
        mockup: 'serate',
        callouts: [
          { n: 3, text: 'Card della serata — tocca per aprire' },
        ],
        steps: [
          'Apri una serata dallo storico toccando la sua card.',
          'Aggiungi una presenza: scegli promoter, cliente, fatturato e numero tavolo.',
          'Segna quante persone nuove ha portato il cliente in quella serata.',
          'Inserisci la percentuale di guadagno del promoter e l\'eventuale extra (fuori mano).',
          'Le presenze alimentano da sole le statistiche di promoter e clienti: niente ricalcoli manuali.',
          'Puoi modificare o cancellare una presenza sbagliata in qualsiasi momento.',
        ],
        tips: ['Le presenze alimentano da sole le statistiche di promoter e clienti: segni una volta e il dato si propaga ovunque.']
      },
      {
        title: 'Import batch',
        roles: ['admin'],
        intro: 'Carica più presenze insieme incollando testo o un file, con anteprima. Risparmia tempo quando hai tanti dati da inserire.',
        mockup: 'serate',
        callouts: [
          { n: 2, text: 'Pulsante "Importa Batch"' },
        ],
        steps: [
          'Vai su Serate e tocca "Importa Batch".',
          'Incolla i dati in formato testo o carica un file: una riga per presenza.',
          'Controlla l\'anteprima prima di importare: vedi cosa verrà creato.',
          'L\'app riconosce i nomi dei promoter e li associa da sola, anche con scritture diverse.',
          'Conferma: le presenze vengono create tutte insieme in un colpo solo.',
          'L\'import è veloce: le statistiche si aggiornano al primo ricalcolo automatico.',
        ],
        tips: ['L\'import è veloce: le statistiche si aggiornano al primo ricalcolo, non devi aspettare a video.']
      },
      {
        title: 'Confronto serate',
        roles: ['admin', 'super4'],
        intro: 'Paragona due o più serate per fatturato, tavoli e presenze. Capisci quale serata ha funzionato meglio e perché.',
        mockup: 'serate',
        callouts: [
          { n: 3, text: 'Card della serata per il confronto' },
        ],
        steps: [
          'Apri il confronto tra serate dalla sezione Serate.',
          'Scegli due o più serate da paragonare: vedi fatturato, tavoli e presenze affiancati.',
          'I dati sono quelli veri delle presenze registrate, niente stime.',
          'Utile per paragonare lo stesso locale in date diverse o due locali diversi nello stesso periodo.',
        ],
        tips: ['Utile per paragonare lo stesso locale in date diverse e capire se il pubblico cambia.']
      }
    ]
  },

  // ── LOCALI ───────────────────────────────────────────────
  {
    id: 'locali',
    title: 'Locali',
    icon: 'Building2',
    roles: ['admin'],
    intro: 'Gestisci i locali: loghi, colori, soglie e statistiche per ogni venue. Da qui configuri l\'identità visiva e le regole di ogni posto.',
    lessons: [
      {
        title: 'Aggiungere un locale',
        roles: ['admin'],
        intro: 'Crea il locale con nome, giorno fisso, colore e soglia tavoli. Bastano pochi campi per averlo attivo nelle serate.',
        mockup: 'locali',
        callouts: [
          { n: 1, text: 'Pulsante "Aggiungi Locale"' },
          { n: 2, text: 'Card del locale con logo' },
        ],
        steps: [
          'Vai su Locali e tocca "Aggiungi Locale".',
          'Scrivi il nome: deve essere lo stesso che userai nelle serate, altrimenti non si collegano.',
          'Imposta il giorno fisso della settimana (es. sabato), o lascia vuoto per eventi speciali.',
          'Scegli il colore per i grafici: ti aiuta a distinguere i locali a colpo d\'occhio.',
          'Imposta la soglia default per i tavoli e l\'ordine di visualizzazione nelle liste.',
          'Salva: il locale è pronto per essere usato nelle serate.',
        ],
        tips: ['Puoi usare un nome diverso per il logo se serve: il campo logo_key te lo permette.']
      },
      {
        title: 'Caricare il logo',
        roles: ['admin'],
        intro: 'Carica il logo del locale una volta e lo vedi in tutte le card e tabelle. Un\'immagine vale mille parole nelle liste.',
        mockup: 'locali',
        callouts: [
          { n: 2, text: 'Logo del locale nella card' },
        ],
        steps: [
          'Apri il dialog del logo per il locale desiderato.',
          'Carica un\'immagine dal tuo dispositivo.',
          'Il logo compare da solo nelle card serate, nelle tabelle e nelle schede cliente.',
          'Non devi inserirlo ogni volta: una volta caricato, spunta ovunque nell\'app.',
        ],
        tips: ['I loghi si caricano una volta e spuntano ovunque nell\'app: niente ripetizioni.']
      },
      {
        title: 'Statistiche per locale',
        roles: ['admin'],
        intro: 'Apri un locale per confrontare i mesi e vedere fatturato, tavoli e presenze. Il bilancio di ogni venue a portata di tap.',
        mockup: 'locali',
        callouts: [
          { n: 3, text: 'Grafico analytics del locale' },
        ],
        steps: [
          'Apri un locale dalla lista per vedere le sue statistiche.',
          'Confronta i mesi tra loro per capire l\'andamento stagionale.',
          'Vedi fatturato, tavoli e presenze per ogni promoter in quel locale.',
          'I locali conclusi restano consultabili nello storico: non perdi i dati dei posti chiusi.',
        ],
        tips: ['I locali conclusi restano consultabili nello storico: utile per rivedere le stagioni passate.']
      }
    ]
  },

  // ── IL MIO VIBRA ──────────────────────────────────────────
  {
    id: 'ilmiovibra',
    title: 'Il Mio Vibra',
    icon: 'Trophy',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'La tua area personale: guadagni, progressi, team, note, riconoscimenti, sfide e materiale locali. Tutto ciò che riguarda te, in un posto solo.',
    lessons: [
      {
        title: 'I Miei Guadagni',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il riepilogo di quanto hai guadagnato, con il dettaglio serata per serata. Sai sempre a quanto ammonta il tuo lavoro.',
        mockup: 'ilmiovibra-guadagni',
        callouts: [
          { n: 1, text: 'Tab "Guadagni" — card con il totale' },
          { n: 2, text: 'Dettaglio serata per serata con percentuale' },
          { n: 3, text: 'Filtro mese per vedere un periodo specifico' },
        ],
        steps: [
          'Apri Il Mio Vibra e tocca "I Miei Guadagni".',
          'Vedi quanto hai guadagnato in totale, in grande.',
          'Sotto trovi il dettaglio serata per serata, con la percentuale di guadagno e l\'eventuale extra.',
          'Filtra per mese con il selettore per concentrarti su un periodo specifico.',
          'I guadagni si calcolano in base alle tue percentuali per locale: se non hai un accordo, lì risulta zero.',
        ],
        tips: ['I guadagni si calcolano in base alle tue percentuali per locale: chiedi all\'admin di impostarle se mancano.']
      },
      {
        title: 'Guadagni Dettagliati',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'L\'andamento nel tempo, le statistiche avanzate e i mesi espandibili con il dettaglio settimanale. Il bilancio completo del tuo lavoro.',
        mockup: 'ilmiovibra-guadagni-dettagli',
        callouts: [
          { n: 1, text: 'Timeline mensile dei guadagni' },
          { n: 2, text: 'Statistiche avanzate: serata migliore, mese migliore, media per giorno' },
          { n: 3, text: 'Mesi espandibili con dettaglio settimanale (% Guadagno, Extra, Totale)' },
        ],
        steps: [
          'Tocca il tab "Guadagni Dettagliati" in Il Mio Vibra.',
          'La timeline mostra l\'andamento mensile dei tuoi guadagni: vedi subito se stai crescendo.',
          'Le statistiche avanzate evidenziano la serata migliore, il mese migliore e la media per giorno (Ven, Sab, Dom, Extra).',
          'Tocca un mese per espanderlo: vedi la settimana con % Guadagno, Extra e Totale.',
          'Usa questi dati per capire quali giornate ti rendono di più e organizzarti di conseguenza.',
        ],
        tips: ['Se non hai accordi per un locale, il guadagno lì risulta zero: non è un errore, ti manca l\'accordo.']
      },
      {
        title: 'Le Mie Serate',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Lo storico delle serate in cui sei presente, con fatturato, tavoli e note personali. Il tuo diario di lavoro.',
        mockup: 'ilmiovibra-serate',
        callouts: [
          { n: 1, text: 'Tab "Serate" — righe con fatturato, tavoli e locale' },
          { n: 2, text: 'Tocca la serata per aprire i tuoi appunti' },
        ],
        steps: [
          'Tocca il tab "Le Mie Serate" in Il Mio Vibra.',
          'Vedi lo storico delle serate in cui sei presente, in ordine cronologico.',
          'Per ogni serata: locale, data, fatturato tuo e tavoli chiusi.',
          'Tocca una serata per aprire il box "I miei appunti" e scrivere note personali (es. "tavolo 12 problematico").',
          'Le serate speciali sono evidenziate con un colore dedicato per riconoscerle subito.',
        ],
        tips: ['Le serate speciali sono evidenziate con un colore dedicato: le riconosci al volo nella lista.']
      },
      {
        title: 'I Miei Progressi',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'I tuoi numeri complessivi, il rango attuale e gli obiettivi con le barre di avanzamento. Il tuo percorso di crescita in una pagina.',
        mockup: 'ilmiovibra-progressi',
        callouts: [
          { n: 1, text: 'Tab "Progressi" — KPI: clienti, presenze, fatturato, guadagni' },
          { n: 2, text: 'Card rango con barra di avanzamento' },
          { n: 3, text: 'Sezione obiettivi con barre di progresso' },
        ],
        steps: [
          'Tocca il tab "I Miei Progressi".',
          'Vedi i tuoi numeri: clienti totali, presenze, fatturato, guadagni, tutti in una vista.',
          'Confronta i tuoi numeri con il rango attuale: la card mostra quanto manca al prossimo livello.',
          'La barra di avanzamento del rango ti dice a che punto sei della classifica.',
          'La sezione obiettivi mostra le barre di progresso dei traguardi che ti hanno assegnato.',
        ],
        tips: ['I numeri sono pronti: la pagina si apre all\'istante, senza spinner.']
      },
      {
        title: 'Il Mio Team',
        roles: ['admin', 'super4', 'capogruppo'],
        intro: 'Le statistiche aggregate del tuo team e il confronto promoter a promoter. Per chi guida un gruppo, il quadro dei propri collaboratori.',
        mockup: 'ilmiovibra-team',
        callouts: [
          { n: 1, text: 'Tab "Team" — statistiche aggregate del team' },
          { n: 2, text: 'Lista dei promoter che fanno capo a te con fatturato' },
        ],
        steps: [
          'Tocca il tab "Il Mio Team".',
          'Vedi i promoter che fanno capo a te, in base alla gerarchia.',
          'Statistiche aggregate del team: fatturato, clienti, presenze totali del tuo gruppo.',
          'Grafici cumulativi e confronto promoter a promoter nel periodo che scegli.',
          'I capogruppo vedono solo il loro sottogruppo; admin e super4 vedono tutto.',
        ],
        tips: ['I capogruppo vedono solo il loro sottogruppo; admin e super4 vedono tutto il team.']
      },
      {
        title: 'Materiale Locali',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Piantine, listini e formule di ogni locale, a portata di tap, da consultare quando vuoi. Tutto l\'occorrente per la serata in tasca.',
        mockup: 'ilmiovibra-materiale-locali',
        callouts: [
          { n: 1, text: 'Riga del locale collassata con le icone dei materiali disponibili' },
          { n: 2, text: 'Riga espansa: piantina, listino e formule uno sotto l\'altro' },
        ],
        steps: [
          'Trovi il box "Materiale Locali" dentro Il Mio Vibra.',
          'Vedi una riga per ogni locale, collassata, con le icone che indicano quali materiali sono disponibili (piantina, listino, formule).',
          'Tocca un locale per espanderlo: si aprono piantina, listino e formule uno sotto l\'altro.',
          'Sulla piantina, tocca "Espandi" per vederla a schermo intero e zoomare sui dettagli.',
          'Il listino e le formule restano visibili sotto, pronti da consultare durante la serata.',
        ],
        tips: ['Tieni il materiale a portata di mano: utile per rispondere subito ai clienti sui prezzi e i tavoli.']
      },
      {
        title: 'Le Mie Note',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Il tuo quaderno privato di note colorate, con quelle fissate sempre in alto. Le cose da ricordare, organizzate come piace a te.',
        mockup: 'ilmiovibra-note',
        callouts: [
          { n: 1, text: 'Nota fissata in alto (📌) — sempre visibile' },
          { n: 2, text: 'Note con bordo colorato per categoria' },
        ],
        steps: [
          'Tocca il tab "Le Mie Note".',
          'Crea una nota con titolo, contenuto e colore per distinguerla a colpo d\'occhio.',
          'Spunta "fissata" per tenerla sempre in alto, anche se ne crei tante.',
          'Riordina le note trascinandole nell\'ordine che preferisci.',
          'Le note sono private: le vedi solo tu, nessun altro ci accede.',
        ],
        tips: ['Le note sono private: le vedi solo tu, perfette per promemoria personali.']
      },
      {
        title: 'Riconoscimenti (Achievement)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'La tua bacheca dei traguardi sbloccati, con riepilogo per rarità. La vetrina dei tuoi successi nel lavoro.',
        mockup: 'ilmiovibra-achievements',
        callouts: [
          { n: 1, text: 'Tab "Ach." — conteggio totale sbloccati' },
          { n: 2, text: 'Riepilogo per rarità (bronzo, argento, oro)' },
          { n: 3, text: 'Griglia badge: sbloccati (colorati) e da sbloccare (opachi)' },
        ],
        steps: [
          'Tocca il tab "Achievement".',
          'Vedi quanti riconoscimenti hai sbloccato e quanti ce ne sono in totale.',
          'Riepilogo per rarità: bronzo, argento, oro, platino, master, leggenda.',
          'La griglia mostra i badge sbloccati (colorati) e quelli da sbloccare (opachi).',
          'Le condizioni si verificano da sole: non devi fare nulla, si sbloccano quando li raggiungi.',
        ],
        tips: ['Quando sblocchi un riconoscimento ricevi una notifica, e se hai le push attive anche una notifica sul telefono.']
      },
      {
        title: 'Vibra VS (sfide)',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Le sfide tra promoter con classifica live e le tue statistiche di vittoria. Il lato competitivo del lavoro, in tempo reale.',
        mockup: 'ilmiovibra-vibravs',
        callouts: [
          { n: 1, text: 'Tab "VS" — sfida attiva con classifica live' },
          { n: 2, text: 'Le tue statistiche: vittorie, striscia, vittoria mensile' },
        ],
        steps: [
          'Tocca il tab "Vibra VS".',
          'Vedi le sfide attive: possono essere su fatturato, su tavoli o a punteggio manuale.',
          'La classifica si aggiorna da sola per le sfide a fatturato e tavoli, in base alle serate.',
          'Le sfide manuali usano i punteggi inseriti a mano dall\'admin.',
          'Vedi le tue vittorie settimanali, la striscia di vittorie consecutive e la vittoria mensile.',
        ],
        tips: ['Le sfide sono già calcolate: vittorie, striscia e vittoria mensile sono pronte, niente calcoli a video.']
      },
      {
        title: 'Calcolatrice',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Una calcolatrice tascabile sempre a portata di mano mentre lavori nell\'app. Per i conti rapidi senza aprire il telefono.',
        mockup: 'ilmiovibra-calcolatrice',
        callouts: [
          { n: 1, text: 'Tastierino con operazioni base (+, −, ×, ÷, %)' },
          { n: 2, text: 'Resta attiva come finestra flottante finché non la chiudi' },
        ],
        steps: [
          'In Il Mio Vibra, tocca il pulsante "Calcolatrice" in alto a destra.',
          'Si apre una calcolatrice con display e tastierino: usala per i conti rapidi.',
          'Una volta aperta resta sempre attiva come finestra flottante sopra le altre sezioni, finché non la chiudi tu con la X.',
          'Puoi trascinarla dove vuoi sullo schermo e ridimensionarla dall\'angolo in basso a destra.',
          'Resta attiva anche cambiando sezione: non perdi i conti in corso.',
        ],
        tips: ['Utile per fare conti rapidi mentre controlli guadagni e serate, senza uscire dall\'app.']
      }
    ]
  },

  // ── VIBRA GPT ─────────────────────────────────────────────
  {
    id: 'ricerca-ai',
    title: 'Vibra GPT (Ricerca AI)',
    icon: 'BrainCircuit',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Il tuo assistente AI: chiedi in linguaggio naturale e ricevi insight sui tuoi dati. Come avere un analista sempre disponibile.',
    lessons: [
      {
        title: 'Iniziare una conversazione',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Scrivi una domanda come parleresti e l\'AI ti risponde con i tuoi dati veri. Niente formule o sintassi: basta il linguaggio di tutti i giorni.',
        mockup: 'vibragpt',
        callouts: [
          { n: 2, text: 'Barra dove scrivi la domanda' },
          { n: 3, text: 'Risposta dell\'AI con i tuoi dati' },
          { n: 4, text: 'Avatar Vibra dell\'assistente' },
        ],
        steps: [
          'Vai su Vibra GPT dalla sidebar.',
          'Scrivi una domanda come parleresti (es. "Chi sono i miei clienti in calo?", "Quanto ho fatturato a sabato scorso?").',
          'L\'AI legge i tuoi dati e ti risponde con numeri veri, non generici.',
          'Puoi fare domande di approfondimento nella stessa conversazione: l\'AI ricorda il contesto.',
          'Le risposte si basano solo sui tuoi dati: niente invenzioni.',
        ],
        tips: ['L\'AI non scrive dati: può solo leggere, non creare o modificare. Le tue informazioni restano al sicuro.']
      },
      {
        title: 'Scegliere il modello',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Scegli il livello dell\'AI in base alla complessità della domanda. Standard per il quotidiano, Avanzato per le analisi profonde.',
        mockup: 'vibragpt',
        callouts: [
          { n: 1, text: 'Selettore del livello (Standard o Avanzato)' },
        ],
        steps: [
          'Usa il selettore in alto per scegliere il livello dell\'AI.',
          'Standard: costa meno, per task di tutti i giorni (ricerche rapide, conteggi semplici).',
          'Avanzato: costa di più, per insight strategici complessi (analisi di trend, confronti articolati).',
          'Il default è Standard per le nuove conversazioni: cambi solo quando ti serve.',
          'Il livello vale per tutta la conversazione, non per singola domanda.',
        ],
        tips: ['Usa Avanzato solo quando serve ragionamento profondo: costa più crediti, quindi spendilo bene.']
      },
      {
        title: 'Cosa vede l\'AI',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'L\'AI vede solo i dati che puoi vedere tu, in base al tuo ruolo. Niente fughe di informazioni: rispetta la tua visibilità.',
        mockup: 'vibragpt',
        callouts: [
          { n: 3, text: 'La risposta si basa sui dati che puoi vedere' },
        ],
        steps: [
          'Admin e Super4: l\'AI vede tutti i dati aziendali, di tutto il team.',
          'Capogruppo e PR: l\'AI vede solo i tuoi dati, quelli della tua visibilità.',
          'La modalità è automatica in base al tuo ruolo: non devi configurarla.',
          'Le risposte rispettano sempre questo confine: un PR non vede i dati altrui.',
        ],
        tips: ['Un PR che chiede "chi è il top promoter" vedrà solo se stesso: l\'AI non svela dati altrui.']
      }
    ]
  },

  // ── FORMAZIONE ────────────────────────────────────────────
  {
    id: 'formazione',
    title: 'Formazione',
    icon: 'BookOpen',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Materiale formativo e documentazione per il team. Qui trovi le risorse che l\'admin carica per tenere tutti allineati.',
    lessons: [
      {
        title: 'Consultare il materiale',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Sfoglia i materiali caricati dall\'admin e scaricali quando ti servono. Documenti, guide e risorse pronti all\'uso.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Lista dei materiali caricati dall\'admin' },
        ],
        steps: [
          'Vai su Formazione dal menu.',
          'Sfoglia i materiali caricati dall\'admin: documenti, guide, risorse utili.',
          'Tocca un materiale per leggerlo direttamente o scaricarlo sul dispositivo.',
          'I materiali restano disponibili nel tempo: torni a consultarli quando vuoi.',
          'L\'admin carica il materiale dalle Impostazioni App, sezione dedicata.',
        ],
        tips: ['L\'admin carica il materiale dalle Impostazioni App: se non vedi nulla, chiedigli di caricarlo.']
      }
    ]
  },

  // ── DOWNLOAD ──────────────────────────────────────────────
  {
    id: 'download',
    title: 'Download',
    icon: 'Download',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Materiali pronti da scaricare: loghi Vibra, loghi locali, sfondi, materiale promozionale. Tutto l\'occorrente per le tue campagne.',
    lessons: [
      {
        title: 'Scaricare un materiale',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Scegli la sezione e scarica il materiale che ti serve in formato originale. Loghi e sfondi pronti per i social.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Sezioni: loghi Vibra, loghi locali, sfondi, materiali' },
          { n: 2, text: 'Materiale scaricabile' },
        ],
        steps: [
          'Vai su Download dal menu.',
          'Sfoglia le sezioni: loghi Vibra, loghi locali, sfondi, materiali promozionali.',
          'Tocca un item per scaricarlo in formato originale o vederlo in anteprima.',
          'I file sono pronti per i social e le tue campagne: niente conversioni.',
          'L\'admin gestisce i materiali dalle Impostazioni App, sezione dedicata.',
        ],
        tips: ['L\'admin gestisce i materiali dalle Impostazioni App: se manca qualcosa, chiedi di caricarlo.']
      }
    ]
  },

  // ── NOTIFICHE ─────────────────────────────────────────────
  {
    id: 'notifiche',
    title: 'Notifiche',
    icon: 'Bell',
    roles: ['admin', 'super4', 'capogruppo', 'pr'],
    intro: 'Centro notifiche: riconoscimenti, nuove serate, sfide, clienti inattivi. Resta aggiornato su ciò che conta, senza dover controllare tutto.',
    lessons: [
      {
        title: 'Leggere le notifiche',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Tocca la campanella per vedere le notifiche non lette e saltare alla risorsa. Il modo più rapido per restare al corrente.',
        mockup: 'notifiche',
        callouts: [
          { n: 1, text: 'Campanella in alto a destra' },
          { n: 2, text: 'Lista delle notifiche non lette' },
        ],
        steps: [
          'Tocca la campanella in alto a destra.',
          'Vedi le notifiche non lette, in ordine dalle più recenti.',
          'Tocca una notifica per andare direttamente alla risorsa correlata (serata, riconoscimento, sfida).',
          'Le notifiche lette restano consultabili nella pagina Notifiche dedicate.',
          'Il badge sulla campanella ti dice quante ne hai da leggere al volo.',
        ],
        tips: ['Attiva le push dal menu account per ricevere notifiche anche a app chiusa.']
      },
      {
        title: 'Attivare le push',
        roles: ['admin', 'super4', 'capogruppo', 'pr'],
        intro: 'Abilita le notifiche push per ricevere avvisi anche con l\'app chiusa. Così non ti perdi nulla, nemmeno offline.',
        mockup: 'notifiche',
        callouts: [
          { n: 1, text: 'Menu account (icona in alto a destra)' },
          { n: 3, text: 'Interruttore "Attiva notifiche Push"' },
        ],
        steps: [
          'Apri il menu account (icona in alto a destra).',
          'Tocca "Attiva notifiche Push".',
          'Il browser chiede il permesso: consenti per ricevere gli avvisi.',
          'Il dispositivo viene registrato per le push: da ora ricevi notifiche anche a app chiusa.',
          'Se hai bloccato le notifiche nel browser, sbloccale dalle impostazioni del sito.',
        ],
        tips: ['Se hai bloccato le notifiche nel browser, sbloccale dalle impostazioni del sito per riattivarle.']
      }
    ]
  },

  // ── ADMIN CONSOLE ─────────────────────────────────────────
  {
    id: 'admin-console',
    title: 'Consolle Admin',
    icon: 'ShieldCheck',
    roles: ['admin'],
    intro: 'Pannello di amministrazione: utenti, log delle modifiche, impostazioni avanzate. Il cuore tecnico dell\'app, riservato agli admin.',
    lessons: [
      {
        title: 'Gestire gli utenti',
        roles: ['admin'],
        intro: 'Vedi gli utenti registrati, invita nuovi membri e gestisci i ruoli. Da qui controlli chi entra e cosa può fare.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Lista degli utenti registrati' },
          { n: 2, text: 'Pulsante per invitare un nuovo utente' },
        ],
        steps: [
          'Apri la Consolle Admin dal menu account.',
          'Vedi gli utenti registrati e i loro ruoli attuali.',
          'Invita un nuovo utente inserendo email e scegliendo il ruolo (admin o user).',
          'Cambia il ruolo di un utente esistente se servono più o meno permessi.',
          'Solo gli admin possono invitare utenti: gli altri ruoli non vedono questa sezione.',
        ],
        tips: ['Solo gli admin possono invitare utenti: gli altri ruoli non vedono nemmeno la Consolle.']
      },
      {
        title: 'Log delle modifiche (Audit)',
        roles: ['admin'],
        intro: 'La cronologia di tutte le operazioni, con utente, orario e prima/dopo. Per sapere chi ha fatto cosa e quando.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Lista delle operazioni con utente e orario' },
        ],
        steps: [
          'Nella Consolle, apri la sezione Audit Log.',
          'Vedi tutte le operazioni (creazione, modifica, cancellazione) con utente e orario precisi.',
          'Filtra per entità, tipo di operazione o utente per trovare velocemente quello che cerchi.',
          'I record mostrano il prima e il dopo per confrontare cosa è cambiato.',
          'Il log si popola da solo, non devi fare nulla: registra tutto in automatico.',
        ],
        tips: ['Il log si popola da solo, non devi fare nulla: registra ogni modifica in automatico.']
      }
    ]
  },

  // ── IMPOSTAZIONI APP ──────────────────────────────────────
  {
    id: 'impostazioni',
    title: 'Impostazioni App',
    icon: 'Settings2',
    roles: ['admin'],
    intro: 'Configurazione globale: branding, locali, promoter, riconoscimenti, notifiche, sfide. Il pannello di controllo centrale dell\'app.',
    lessons: [
      {
        title: 'Branding (logo e loghi locali)',
        roles: ['admin'],
        intro: 'Carica il logo Vibra e i loghi dei locali, visibili ovunque nell\'app. Una sola configurazione per l\'identità di tutto.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Sezione Branding con il logo Vibra' },
          { n: 2, text: 'Loghi per ogni locale' },
        ],
        steps: [
          'Vai su Impostazioni App e tocca Branding.',
          'Carica il logo Vibra: lo vedrai in sidebar, login e ovunque serva.',
          'Carica i loghi per ogni locale: compaiono in card, tabelle e schede.',
          'I loghi si caricano una volta sola e spuntano automaticamente in tutta l\'app.',
          'I loghi locali si possono caricare anche dalla sezione Locali del branding, per comodità.',
        ],
        tips: ['I loghi locali si caricano anche dalla sezione Locali del branding: scegli la via più comoda.']
      },
      {
        title: 'Gestione promoter',
        roles: ['admin'],
        intro: 'Configura ruoli e visibilità statistica dei promoter. Decidi chi appare nei grafici storici anche quando smette.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Sezione Promoter delle Impostazioni' },
        ],
        steps: [
          'Apri la sezione Promoter delle Impostazioni.',
          'Configura ruoli e visibilità statistica di ciascuno.',
          'Usa "Mostra in statistiche" per decidere se un promoter inattivo resta nei grafici storici.',
          'Disattivare la visibilità nasconde il promoter dai grafici senza cancellarlo.',
        ],
        tips: ['"Mostra in statistiche" controlla se i promoter inattivi restano nei grafici storici: utile per non perdere lo storico.']
      },
      {
        title: 'Riconoscimenti',
        roles: ['admin'],
        intro: 'Crea e modifica i traguardi con condizione, soglia e rarità. Progetta la bacheca achievement del tuo team.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Lista dei riconoscimenti' },
        ],
        steps: [
          'Apri la sezione Achievement delle Impostazioni.',
          'Crea o modifica un riconoscimento: titolo, cosa deve succedere, soglia da raggiungere, rarità.',
          'Imposta l\'ordine di visualizzazione e se è attivo o no.',
          'Le condizioni si verificano da sole: non devi assegnarle manualmente.',
          'Disattiva un riconoscimento per nasconderlo senza eliminarlo: resta disponibile per il futuro.',
        ],
        tips: ['Disattiva un riconoscimento per nasconderlo senza eliminarlo: così non perdi la configurazione.']
      },
      {
        title: 'Vibra Challenges (sfide)',
        roles: ['admin'],
        intro: 'Crea sfide tra promoter con metrica automatica o manuale. Innesca la competizione nel team, su misura.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Lista delle sfide create' },
        ],
        steps: [
          'Apri la sezione Vibra Challenges.',
          'Crea una sfida: titolo, descrizione, premio, tipo di metrica, date di inizio e fine.',
          'Scegli i partecipanti o lascia vuoto per aprire a tutti i promoter.',
          'Per metrica manuale, inserisci i punteggi a mano quando vuoi aggiornare la classifica.',
          'Le sfide a fatturato e tavoli si calcolano da sole dalle serate nel range di date.',
        ],
        tips: ['Le sfide a fatturato e tavoli si calcolano da sole dalle serate nel range di date: zero lavoro manuale.']
      },
      {
        title: 'Notifiche',
        roles: ['admin'],
        intro: 'Configura quali notifiche inviare e a chi. Decidi il flusso di avvisi del team.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Sezione Notifiche delle Impostazioni' },
        ],
        steps: [
          'Apri la sezione Notifiche delle Impostazioni.',
          'Configura quali notifiche inviare e a quali destinatari.',
          'Le push partono da sole se il promoter le ha attivate sul suo dispositivo.',
          'Pulisci le notifiche di test con la funzione dedicata, per non intasare le liste.',
        ],
        tips: ['Pulisci le notifiche di test con la funzione dedicata: evita di intasare le liste dei destinatari.']
      },
      {
        title: 'Database (manutenzione)',
        roles: ['admin'],
        intro: 'Funzioni di manutenzione: ricalcolo statistiche, fix duplicati, fix fatturati. Gli strumenti tecnici per tenere i dati in salute.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Funzioni di manutenzione del database' },
        ],
        steps: [
          'Apri la sezione Database delle Impostazioni.',
          'Esegui funzioni di manutenzione: ricalcolo statistiche, fix duplicati, fix fatturati sballati.',
          'Il ricalcolo statistiche aggiorna tutti i numeri di clienti e promoter in un colpo.',
          'Usa con cautela: alcune operazioni sono irreversibili, leggi la descrizione prima di confermare.',
          'Dopo un ricalcolo, le pagine mostrano i numeri aggiornati al primo ricaricamento.',
        ],
        tips: ['Il ricalcolo statistiche aggiorna tutti i numeri di clienti e promoter: usalo se vedi dati sballati.']
      }
    ]
  },

  // ── REPORT ───────────────────────────────────────────────
  {
    id: 'report',
    title: 'Report',
    icon: 'FileBarChart',
    roles: ['admin'],
    intro: 'Genera report PDF: confronto periodi, eventi e breakdown per giorno/tipo. Dati pronti da presentare o archiviare.',
    lessons: [
      {
        title: 'Costruire un report',
        roles: ['admin'],
        intro: 'Scegli il periodo, aggiungi le sezioni e stampa o esporta in PDF. Componi il report su misura per ciò che ti serve.',
        mockup: 'generic',
        callouts: [
          { n: 1, text: 'Sezioni del report (fatturato, tavoli, breakdown)' },
          { n: 2, text: 'Anteprima del report pronto da stampare' },
        ],
        steps: [
          'Vai su Report dal menu account.',
          'Apri il Report Builder per comporre il documento.',
          'Scegli il periodo, oppure confronta due periodi per vedere la differenza.',
          'Aggiungi le sezioni che ti interessano: fatturato, tavoli, breakdown per giorno/tipo, confronto eventi.',
          'Guarda l\'anteprima per verificare il risultato prima di esportare.',
          'Stampa o esporta in PDF con un tap: il file è pronto da condividere o archiviare.',
        ],
        tips: ['Il report usa un layout pulito pensato per il PDF: niente elementi di troppo, solo dati.']
      }
    ]
  }
];