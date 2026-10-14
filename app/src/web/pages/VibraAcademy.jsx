// Port di src/pages/VibraAcademy.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Search, BookOpen, ChevronRight, Lightbulb, X, Menu,
  LayoutGrid, UsersRound, ContactRound, Send, CalendarRange, Building2,
  Trophy, BrainCircuit, Download, Bell, ShieldCheck, Settings2, FileBarChart,
  Sprout, MessageCircle
} from '@/ui/icons.generated';

const ICON_MAP = {
  LayoutGrid, UsersRound, ContactRound, Send, CalendarRange, Building2,
  Trophy, BrainCircuit, Download, Bell, ShieldCheck, Settings2, FileBarChart,
  BookOpen, Search, Menu, Sprout, MessageCircle,
};

import { useAuth } from '@/lib/auth';
import PageTitle from '@/web/components/shared/PageTitle';
import { ACADEMY_SECTIONS } from '@/legacy/utils/academyContent';
import AcademyTile from '@/web/components/academy/AcademyTile';
import AcademySideRail from '@/web/components/academy/AcademySideRail';
import { useIsMobile } from '@/web/hooks/use-mobile';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { stickyGlassStyle } from '@/legacy/utils/stickyGlass';
import { useStickyTabFlash } from '@/web/hooks/useStickyTabFlash';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';

import { doc as webDocument } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

// Descrizioni generate da Claude Opus 5 — 3-4 frasi per sezione, pensate
// per chi non conosce l'app: cosa si fa, a cosa serve e perché è utile.
const SECTION_DESCRIPTIONS = {
  benvenuto:
    "Vibra è la tua base operativa: qui dentro vivono il tuo team, i tuoi clienti e tutte le serate dei locali. Invece di rincorrere note, chat e fogli Excel, gestisci tutto da un posto solo. Organizzi il lavoro, spingi le vendite e vedi nero su bianco cosa funziona e cosa no. Parti da qui e in pochi minuti capisci come gira.",
  ricerca:
    "La barra di ricerca è la scorciatoia per tutto. Scrivi un nome, un locale, una serata o anche solo una parola e Vibra ti porta dove devi andare. Trova clienti, promoter, materiale e perfino le impostazioni dell'app. Se non ricordi dove sta una cosa, cercala: è più veloce che navigare a mano.",
  menu:
    "Muoversi in Vibra è semplice e cambia solo in base al dispositivo. Su telefono hai il menu burger in alto e la barra in basso con le sezioni che usi di più. Su computer trovi la sidebar sempre aperta a sinistra, con tutto sotto mano. Due minuti di pratica e vai a memoria.",
  dashboard:
    "La Dashboard è il colpo d'occhio sull'andamento dell'azienda. Vedi quanto si sta fatturando, chi tra i promoter sta portando risultati e quali clienti spendono di più. È la prima cosa da aprire la mattina per capire come sta andando la settimana. Se un numero non ti torna, da qui puoi scendere nel dettaglio.",
  promoter:
    "Qui c'è tutto il tuo team, ordinato e sotto controllo. Vedi chi fa cosa, a chi risponde ogni persona e come sta performando rispetto agli obiettivi. Puoi aggiungere promoter, sistemare le gerarchie e assegnare target chiari. È il posto giusto per capire chi spinge davvero e chi va aiutato.",
  clienti:
    "Questa è la parte più importante dell'app: la tua rubrica clienti vera. Ogni persona ha punteggio, trend di spesa, badge e storico delle serate a cui è venuta. Con la mappa vedi anche da dove arriva il tuo giro. Più tieni aggiornate le schede, più l'app ti dice chi invitare e quando.",
  programmazione:
    "Il Weekend è la sala regia della tua settimana. Decidi chi invitare, in che locale, con quale messaggio e in che momento contattarlo. Vedi subito chi hai già scritto e chi ti stai dimenticando. Usalo ogni mercoledì o giovedì e arrivi al sabato con le liste già pronte.",
  semine:
    "Le Semine sono i contatti Instagram e TikTok che non sono ancora clienti. Li salvi, li segui nel tempo e li scaldi fino a farli venire in serata. Vedi a che punto è ogni contatto e cosa gli hai già scritto. È qui che si costruisce il giro di domani, non solo quello di questo weekend.",
  serate:
    "In Serate crei ogni evento e ci registri cosa è successo davvero. Segni chi è venuto, quanto ha speso e puoi caricare i dati anche in blocco se hai liste lunghe. Diventa lo storico ufficiale di ogni notte di lavoro. Tutti i numeri della Dashboard nascono da qui, quindi tienile aggiornate.",
  locali:
    "Qui gestisci tutti i venue con cui lavori. Imposti logo, colori, soglie di spesa e trovi le statistiche di ogni locale. Così capisci quale posto rende di più e con che tipo di pubblico. Se aggiungi un nuovo club, parti da questa sezione per configurarlo.",
  ilmiovibra:
    "Questa è la tua area personale, tutta su di te. Controlli quanto stai guadagnando, a che punto sei con gli obiettivi, il tuo team e i riconoscimenti che hai sbloccato. Ci trovi anche le sfide attive, le tue note e il materiale dei locali da usare. Aprila spesso: è il tuo specchio sul lavoro.",
  'ricerca-ai':
    "Vibra GPT è l'assistente AI dentro l'app. Gli scrivi una domanda normale, tipo chi non viene da un mese o quanto ha fatto il tuo team a marzo, e ti risponde sui tuoi dati reali. Niente filtri da impostare o tabelle da leggere. Chiedi e basta, poi agisci.",
  formazione:
    "Nella Formazione trovi tutto il materiale per imparare a lavorare bene. Guide, documentazione e contenuti pensati per far crescere il team in fretta. È il posto dove mandare i nuovi promoter appena entrano. Anche se sei esperto, una ripassata ogni tanto ti sistema i dettagli.",
  download:
    "Qui scarichi tutto il materiale pronto all'uso. Loghi Vibra, loghi dei locali, sfondi e contenuti promozionali per le tue storie e i tuoi post. Niente più file chiesti in chat o grafiche vecchie usate per sbaglio. Prendi quello che ti serve e pubblica.",
  notifiche:
    "Il centro notifiche ti tiene sul pezzo senza doverti ricordare tutto. Ti avvisa quando esce una nuova serata, quando ricevi un riconoscimento, quando parte una sfida o quando un cliente sparisce da un po'. Un giro veloce ogni giorno e non ti perdi niente. Le cose urgenti passano sempre da qui.",
  'admin-console':
    "La Consolle Admin è la parte riservata a chi gestisce la piattaforma. Da qui crei e gestisci gli utenti, controlli il log di tutte le modifiche fatte e metti mano alle impostazioni avanzate. Serve per tenere ordine e capire chi ha cambiato cosa. Usala con criterio: quello che tocchi qui vale per tutti.",
  impostazioni:
    "Qui configuri Vibra a immagine della tua azienda. Imposti branding, locali, promoter, riconoscimenti, notifiche e sfide, decidendo come funziona l'app per tutto il team. È la sezione che definisce le regole del gioco. Sistemala bene all'inizio e poi la tocchi solo quando cambia qualcosa.",
  report:
    "Con i Report tiri fuori i numeri in formato PDF, pronti da mostrare. Confronti due periodi, analizzi i singoli eventi e vedi il dettaglio per giorno o per tipo di serata. Perfetto per le riunioni con i titolari dei locali o per fare il punto col team. In pochi clic hai un documento presentabile.",
  messaggi:
    "I tuoi DM di Instagram arrivano direttamente dentro Vibra. Leggi le conversazioni, rispondi e lavori i contatti senza saltare da un'app all'altra. Dalla stessa chat puoi aggiungere una persona alle semine o invitarla a una serata. Meno tempo perso, più gente che entra in lista.",
};

export default function VibraAcademy() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const lastTouchRef = useRef(0);
  const isMobile = useIsMobile();

  // Sticky bar: sentinel + stuck detection + glass layer + evanescence
  const tabsScrollRef = useRef(null);
  const [sentinelRef, stuck] = useStickySentinel();
  useStickyTabFlash(tabsScrollRef);
  const setStuckHeader = useSetStickyHeader();
  useEffect(() => { setStuckHeader(stuck); }, [stuck, setStuckHeader]);
  useEffect(() => () => setStuckHeader(false), [setStuckHeader]);

  const role = user?.role || 'pr';

  // Filtra le sezioni visibili in base al ruolo dell'utente
  const visibleSections = useMemo(() => {
    const device = isMobile ? 'mobile' : 'desktop';
    return ACADEMY_SECTIONS
      .filter(s => s.roles.includes(role))
      .map(s => ({
        ...s,
        lessons: s.lessons.filter(l => l.roles.includes(role) && (!l.device || l.device === device))
      }));
  }, [role, isMobile]);

  // Filtra per query di ricerca (su titolo sezione, descrizione, titolo lezione, steps, tips, callouts)
  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visibleSections;
    return visibleSections
      .map(s => ({
        ...s,
        lessons: s.lessons.filter(l =>
          l.title.toLowerCase().includes(q) ||
          l.steps.some(st => st.toLowerCase().includes(q)) ||
          (l.tips || []).some(t => t.toLowerCase().includes(q)) ||
          (l.callouts || []).some(c => c.text.toLowerCase().includes(q))
        )
      }))
      .filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.intro.toLowerCase().includes(q) ||
        (SECTION_DESCRIPTIONS[s.id] || '').toLowerCase().includes(q) ||
        s.lessons.length > 0
      );
  }, [visibleSections, query]);

  const roleLabels = {
    admin: 'Admin',
    super4: 'Super4',
    capogruppo: 'Capogruppo',
    pr: 'PR',
    ragazza_immagine: 'Ragazza Immagine'
  };

  const handleToggle = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Rotella laterale: icone per jump rapido (mobile only)
  const railItems = useMemo(
    () => filteredSections.map(s => ({
      id: s.id,
      title: s.title,
      Icon: ICON_MAP[s.icon] || BookOpen,
    })),
    [filteredSections]
  );
  // Chiude la tile espansa prima di scrollare: il layout deve essere stabile
  // (tile chiusa) così scrollIntoView allinea sempre l'header in alto, non
  // un punto qualsiasi del contenuto espanso. Doppio rAF: attende il re-render
  // di setExpandedId(null) prima di calcolare la posizione di scroll.
  const handleRailJump = (id) => {
    setExpandedId(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        webDocument.getElementById(`academy-tile-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  return (
    <Div className="space-y-4 pb-10">
      <PageTitle title="Guida all'uso dell'APP" />

      <Div className="dash-fade-up">
        <Div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-primary" />
          <P className="text-sm text-muted-foreground">
            Tutto quello che puoi fare in Vibra, sezione per sezione. Tocca un tile per approfondire.
            Ruolo: <Span className="text-foreground font-semibold">{roleLabels[role] || role}</Span>
          </P>
        </Div>
      </Div>

      {/* Sentinella per sticky detection */}
      <Div
        ref={sentinelRef}
        style={{ height: 1, marginTop: 0, padding: 0, border: 'none' }} />

      {/* Sticky bar: ricerca + pillole sezioni (con evanescenza glass) */}
      <Div
        ref={tabsScrollRef}
        className={`dash-fade-up group sticky top-[env(safe-area-inset-top)] z-20 overflow-hidden pt-2 pb-2 -mx-4 px-4 border-b ${stuck ? 'border-border is-stuck' : 'border-transparent'}`}
        style={{ marginTop: 0 }}
      >
        <Div className="sticky-glass absolute inset-0" style={stickyGlassStyle(stuck)} />
        {/* Ricerca */}
        <Div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <HtmlInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cerca una funzione o sezione..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 relative"
          />
          {query && (
            <Btn
              button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Btn>
          )}
        </Div>
        {/* Pillose sezioni (scroll orizzontale) */}
        {filteredSections.length > 0 && (
          <Div
            className="relative overflow-x-auto overflow-y-hidden"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}
          >
            <Div className="flex gap-1.5 w-max min-w-full">
              {filteredSections.map(s => {
                const isActive = expandedId === s.id;
                const ResolvedIcon = ICON_MAP[s.icon] || BookOpen;
                return (
                  <Btn
                    button
                    key={s.id}
                    {...makeTapHandlers(lastTouchRef, () => {
                      setExpandedId(s.id);
                      webDocument.getElementById(`academy-tile-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    })}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'bg-secondary/40 text-muted-foreground border border-border hover:text-foreground hover:bg-secondary/60'
                    }`}>
                    <ResolvedIcon className="w-3.5 h-3.5" />
                    {s.title}
                  </Btn>
                );
              })}
            </Div>
          </Div>
        )}
      </Div>

      {/* Tiles grid */}
      {filteredSections.length === 0 ? (
        <Div className="text-center py-16 text-sm text-muted-foreground">
          Nessun risultato per "{query}"
        </Div>
      ) : (
        <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredSections.map((section, sIdx) => {
            const ResolvedIcon = ICON_MAP[section.icon] || BookOpen;
            return (
              <Div key={section.id} className="dash-fade-up scroll-mt-24">
                <AcademyTile
                  section={section}
                  description={SECTION_DESCRIPTIONS[section.id] || section.intro}
                  Icon={ResolvedIcon}
                  isExpanded={expandedId === section.id}
                  onToggle={() => handleToggle(section.id)}
                  lastTouchRef={lastTouchRef}
                />
              </Div>
            );
          })}
        </Div>
      )}

      {/* Rotella laterale per navigazione rapida (mobile) */}
      <AcademySideRail items={railItems} onJump={handleRailJump} />
    </Div>
  );
}