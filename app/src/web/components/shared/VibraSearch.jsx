// Port di src/components/shared/VibraSearch.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';
import { useNavigate } from '@/web/router';
import { Dialog, DialogContent, DialogTitle } from '@/ui/dialog';
// Shims per rimuovere framer-motion dalla ricerca (fluidità tastiera mobile).
// motion.div/button stripano le props di animazione e renderizzano elementi nativi
// con classi CSS di animazione. AnimatePresence renderizza i children senza logica.
const motion = {
  div: ({ initial, animate, exit, transition, variants, className, style, children, ...rest }) => (
    <Div className={`${className || ''} ${variants ? 'search-slide-up' : 'search-fade-in'}`} style={style} {...rest}>{children}</Div>
  ),
  button: ({ initial, animate, exit, transition, variants, className, style, children, ...rest }) => {
    const delay = transition?.delay || 0;
    return (<Btn className={`${className || ''} search-tile-in`} style={{ ...style, animationDelay: `${delay}s` }} {...rest}>{children}</Btn>);
  },
};
const AnimatePresence = ({ children }) => <>{children}</>;
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { calcTables } from '@/legacy/utils/tables';
import SectionHeader from '@/web/components/shared/SectionHeader';
import {
  Search, Users, CalendarRange, Euro, TrendingUp, Users2, Trophy, Swords,
  BarChart2, NotebookPen, BrainCircuit, BookOpen, GraduationCap, Download,
  Building2, Settings2, Calculator, ShieldCheck, FileBarChart, Bell,
  ChevronRight, ChevronDown, SlidersHorizontal, Star, Map as MapIcon, Wine,
  FileText, Expand, Megaphone, Database, TableProperties, X, Copy, Share2,
} from '@/ui/icons.generated';
import { useToast } from '@/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import ClientAvatar from '@/web/components/client/ClientAvatar';
// Loader nominati così possiamo precaricare i chunk quando la ricerca si apre:
// il primo click su un cliente non deve attendere lo scaricamento del chunk
// (esitazione percepita al primo accesso). Vibrasearch non è una rotta e non
// rientra nel preload delle pagine (pagePreload.js) — precarichiamo qui on-open.
const eventPromoterChartLoader = () => import('@/web/components/event/EventPromoterChart');
const clientDetailDialogLoader = () => import('@/web/components/client/ClientDetailDialog');
const leadersListLoader = () => import('@/web/components/client/LeadersList');
const piantinaFullscreenLoader = () => import('@/web/components/ilmiovibra/PiantinaFullscreen');
const EventPromoterChart = React.lazy(eventPromoterChartLoader);
const ClientDetailDialog = React.lazy(clientDetailDialogLoader);
const LeadersList = React.lazy(leadersListLoader);
const PiantinaFullscreen = React.lazy(piantinaFullscreenLoader);
import { buildClientBadgesMap } from '@/legacy/utils/clientPrecomputed';
import { buildAllDownloadItems, shareText } from '@/legacy/utils/downloadMaterials';
import CachedImage from '@/web/components/shared/CachedImage';
import { lockScroll } from '@/web/lib/scrollLock';

import {
  CustomEvt as WebCustomEvent,
  doc as webDocument,
  nav as webNavigator,
  win as webWindow,
} from '@/web/shims/dom';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const ALL_ROLES = ['admin', 'super4', 'capogruppo', 'pr'];

// Sezioni dell'app (navigazione), filtrate per ruolo.
const APP_SECTIONS = [
  { label: 'I Miei Guadagni', icon: Euro, path: '/il-mio-vibra?tab=guadagni', roles: ALL_ROLES, keys: ['guadagni', 'stipendio', 'extra', 'soldi', 'percentuale'] },
  { label: 'Guadagni Dettagliati', icon: TrendingUp, path: '/il-mio-vibra?tab=guadagni-dettagli', roles: ALL_ROLES, keys: ['guadagni dettagli', 'dettagli guadagni', 'dettagli'] },
  { label: 'Le Mie Serate', icon: CalendarRange, path: '/il-mio-vibra?tab=serate', roles: ALL_ROLES, keys: ['serate', 'presenze', 'mie serate', 'le mie serate'] },
  { label: 'Il Mio Team', icon: Users2, path: '/il-mio-vibra?tab=accordi', roles: ALL_ROLES, keys: ['team', 'accordi', 'pr', 'gruppo', 'referente'] },
  { label: 'Achievement', icon: Trophy, path: '/il-mio-vibra?tab=achievements', roles: ALL_ROLES, keys: ['achievement', 'trofei', 'bacheca', 'riconoscimenti'] },
  { label: 'Vibra VS', icon: Swords, path: '/il-mio-vibra?tab=vibravs', roles: ALL_ROLES, keys: ['vibra vs', 'vs', 'sfida', 'classifica'] },
  { label: 'I Miei Progressi', icon: BarChart2, path: '/il-mio-vibra?tab=progressi', roles: ALL_ROLES, keys: ['progressi', 'avanzamento', 'rank', 'rango'] },
  { label: 'Le Mie Note', icon: NotebookPen, path: '/il-mio-vibra?tab=note', roles: ALL_ROLES, keys: ['note', 'appunti', 'promemoria'] },
  { label: 'Vibra GPT', icon: BrainCircuit, path: '/ricerca-ai', roles: ALL_ROLES, keys: ['gpt', 'vibra gpt', 'chat', 'ai', 'assistente'] },
  { label: 'Formazione', icon: BookOpen, path: '/formazione', roles: ALL_ROLES, keys: ['formazione', 'tutorial', 'lezione'] },
  { label: "Guida all'uso", icon: GraduationCap, path: '/academy', roles: ALL_ROLES, keys: ['guida', 'academy', 'aiuto', 'istruzioni', 'manuale'] },
  { label: 'Materiale & Loghi', icon: Download, path: '/download', roles: ALL_ROLES, keys: ['materiale', 'download', 'loghi', 'sfondi', 'flyer'] },
  { label: 'Tutte le Serate', icon: CalendarRange, path: '/serate', roles: ['admin', 'super4'], keys: ['serate', 'serata', 'tutte le serate', 'eventi', 'fatturato'] },
  { label: 'Locali', icon: Building2, path: '/locali', roles: ['admin', 'super4'], keys: ['locali', 'locale', 'venue', 'discoteca'] },
  { label: 'Notifiche', icon: Bell, path: '/notifiche', roles: ALL_ROLES, keys: ['notifiche', 'notifica', 'avvisi', 'avviso'] },
];

// Impostazioni (solo admin) — ogni voce apre il pannello corretto via ?tab=
const SETTINGS_SECTIONS = [
  { label: 'Branding', icon: Settings2, path: '/impostazioni-app?tab=branding', roles: ['admin'], keys: ['branding', 'impostazioni app', 'settings app'] },
  { label: 'Materiale Locali (gestione)', icon: MapIcon, path: '/impostazioni-app?tab=materiale', roles: ['admin'], keys: ['materiale locali', 'gestione materiale', 'carica piantina'] },
  { label: 'Comunicazioni', icon: Megaphone, path: '/impostazioni-app?tab=comunicazioni', roles: ['admin'], keys: ['comunicazioni', 'annunci', 'announcement'] },
  { label: 'Impostazioni Notifiche', icon: Bell, path: '/impostazioni-app?tab=notifiche', roles: ['admin'], keys: ['impostazioni notifiche', 'config notifiche'] },
  { label: 'Soglie Tavoli', icon: TableProperties, path: '/impostazioni-app?tab=tavoli', roles: ['admin'], keys: ['tavoli', 'soglia', 'soglie', 'calcolo tavoli', 'soglia tavoli'] },
  { label: 'Gestione Achievement', icon: Trophy, path: '/impostazioni-app?tab=achievement', roles: ['admin'], keys: ['gestione achievement', 'config achievement', 'crea achievement'] },
  { label: 'Gestione Vibra VS', icon: Swords, path: '/impostazioni-app?tab=vibravs', roles: ['admin'], keys: ['gestione vibra vs', 'config sfide', 'crea sfida'] },
  { label: 'Gestione Promoter', icon: Users2, path: '/impostazioni-app?tab=promoter', roles: ['admin'], keys: ['gestione promoter', 'config promoter'] },
  { label: 'Database', icon: Database, path: '/impostazioni-app?tab=database', roles: ['admin'], keys: ['database', 'backup', 'reset'] },
  { label: 'Consolle Admin', icon: ShieldCheck, path: '/admin-console', roles: ['admin'], keys: ['admin', 'console', 'consolle', 'gestione'] },
  { label: 'Report', icon: FileBarChart, path: '/report', roles: ['admin'], keys: ['report', 'export', 'pdf', 'stampa'] },
];

// Tile di accesso rapido mostrate a vuoto: set curato e compatto (le altre sezioni
// restano cercabili digitando, ma non come tile).
const QUICK_TILES = [
  { label: 'Guadagni', icon: Euro, path: '/il-mio-vibra?tab=guadagni', roles: ALL_ROLES },
  { label: 'Le Mie Serate', icon: CalendarRange, path: '/il-mio-vibra?tab=serate', roles: ALL_ROLES },
  { label: 'Il Mio Team', icon: Users2, path: '/il-mio-vibra?tab=accordi', roles: ALL_ROLES },
  { label: 'Achievement', icon: Trophy, path: '/il-mio-vibra?tab=achievements', roles: ALL_ROLES },
  { label: 'Vibra GPT', icon: BrainCircuit, path: '/ricerca-ai', roles: ALL_ROLES },
  { label: 'Formazione', icon: BookOpen, path: '/formazione', roles: ALL_ROLES },
  { label: "Guida all'uso", icon: GraduationCap, path: '/academy', roles: ALL_ROLES },
  { label: 'Materiale', icon: MapIcon, path: '/il-mio-vibra?tab=note', roles: ALL_ROLES },
];

const DOW_NAMES = {
  5: ['venerdì', 'venerdi', 'ven'], 6: ['sabato', 'sab'], 0: ['domenica', 'dom'],
  1: ['lunedì', 'lunedi', 'lun'], 2: ['martedì', 'martedi', 'mar'], 3: ['mercoledì', 'mercoledi', 'mer'],
  4: ['giovedì', 'giovedi', 'gio'],
};

function getDow(dateStr) {
  if (!dateStr) return -1;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

// Match intelligente: oltre al includes esatto, splitta il termine in parole
// e verifica che TUTTE siano presenti nel testo (in qualsiasi ordine). Così
// "logo frontemare" matcha "Frontemare — Logo Black" e "logo a mare" matcha
// "Frontemare" (fronte-mare). Parole di 1 char vengono ignorate (rumore).
function smartMatch(text, term) {
  if (!text) return false;
  const t = text.toLowerCase();
  const termLower = term.toLowerCase();
  if (t.includes(termLower)) return true;
  const words = termLower.split(/\s+/).filter(w => w.length >= 2);
  if (words.length <= 1) return false;
  return words.every(w => t.includes(w));
}

function dateSearchStrings(dateStr) {
  if (!dateStr) return [];
  try {
    const d = parseISO(dateStr);
    return [
      format(d, 'd MMM yyyy', { locale: it }).toLowerCase(),
      format(d, 'd MMMM yyyy', { locale: it }).toLowerCase(),
      format(d, 'dd/MM/yyyy', { locale: it }),
      format(d, 'MMM yyyy', { locale: it }).toLowerCase(),
      format(d, 'd MMM', { locale: it }).toLowerCase(),
      format(d, 'd MMMM', { locale: it }).toLowerCase(),
      dateStr,
    ];
  } catch { return []; }
}

function VenueLogo({ venueKey, size = 26 }) {
  const { getVenueLogo } = useAllVenueLogos();
  const { logoUrl, zoom } = getVenueLogo(venueKey);
  if (!logoUrl) return null;
  return (
    <Div style={{ width: size, height: size, overflow: 'hidden', flexShrink: 0 }} className="rounded flex items-center justify-center bg-secondary/30">
      <CachedImage src={logoUrl} alt={venueKey} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${zoom})`, transformOrigin: 'center' }} />
    </Div>
  );
}

export default function VibraSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  // Notifica lo stato aperto/chiuso: la MobileNavBar tiene il pill sull'icona
  // Cerca finché la ricerca è aperta.
  useEffect(() => {
    webWindow.dispatchEvent(new WebCustomEvent('vibra:search-state', { detail: { open } }));
  }, [open]);
  // useDeferredValue: l'input risponde istantaneamente, i risultati pesanti
  // (filter su centinaia di record) sono calcolati quando React ha respiro.
  const deferredQ = useDeferredValue(q);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [detailClient, setDetailClient] = useState(null);
  const [leadersOpen, setLeadersOpen] = useState(false);
  const [fullscreenImg, setFullscreenImg] = useState(null); // { src, label }
  const [formulaView, setFormulaView] = useState(null); // { label, text }
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);
  const dialogRef = useRef(null); // ref al DialogContent per aggiornare lo stile senza re-render
  const inputRef = useRef(null);
  const { toast } = useToast();

  // ── REGOLA FONDAMENTALE (vale in tutta l'app, per sempre) ──
  // Il tasto back di Android e il tasto X chiudono SEMPRE un solo popup alla
  // volta, mai tutto insieme. Qui tracciamo quale overlay annidato è aperto
  // sopra la ricerca (dettaglio cliente, box leader, piantina fullscreen,
  // formule). Il back chiude prima quello, poi la ricerca. La X di ogni
  // overlay annidato chiude solo se stesso (onClose → set*(null)), non la
  // ricerca. PiantinaFullscreen usa useOverlay (OverlayStackContext con
  // cleanup automatico centralizzato) e stopPropagation sul root: il Dialog di ricerca non rileva
  // outside-click dalla piantina. Gli altri overlay (detail, leaders,
  // formula) usano closeNestedRef + pushState di fallback.
  const nestedRef = useRef(null);
  nestedRef.current = detailClient ? 'detail' : leadersOpen ? 'leaders' : fullscreenImg ? 'img' : formulaView ? 'formula' : null;
  // Ref allo stato open: il listener keydown (useEffect []) ha deps vuote e non
  // vede il valore corrente di `open`. Tramite questo ref può leggerlo senza
  // re-registrare il listener ad ogni apertura/chiusura.
  const openRef = useRef(false);
  openRef.current = open;
  // Snapshot dello stato nested al pointerdown: previene che onInteractOutside
  // (che su Android può fireare dopo il click che setta fullscreenImg=null) veda
  // nestedRef.current=null e non blocchi la chiusura del dialog di ricerca.
  const nestedAtPointerDownRef = useRef(null);
  const closeNestedRef = useRef(() => {});
  closeNestedRef.current = () => {
    if (detailClient) setDetailClient(null);
    else if (leadersOpen) setLeadersOpen(false);
    else if (fullscreenImg) setFullscreenImg(null);
    else if (formulaView) setFormulaView(null);
  };
  const navigate = useNavigate();
  const { user, isAdmin, isSuper4 } = useRoleAccess();
  const { logoDataUrl } = useVibraLogo();
  // La ricerca clienti è ESCLUSIVAMENTE personale: ogni ruolo (admin incluso) vede
  // solo i propri contatti.
  const canSeeProspetto = isAdmin || isSuper4;

  useEffect(() => {
    const onKey = (e) => {
      // Cmd/Ctrl+K — toggle ricerca
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (openRef.current && nestedRef.current) {
          closeNestedRef.current();
          return;
        }
        setOpen(o => !o);
        return;
      }
      // Tasto "F" — shortcut globale su tutte le schermate.
      // Disattivato quando un campo di testo è evidenziato (conflitto con la
      // digitazione), tranne un caso: se la ricerca è già aperta e il suo campo
      // è vuoto, F la chiude (toggle istantaneo appena aperta). Se c'è già testo
      // nel campo di ricerca, F digita normalmente "f".
      if (e.key === 'f' || e.key === 'F') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const ae = webDocument.activeElement;
        const isText = ae && (
          ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' ||
          ae.tagName === 'SELECT' || ae.isContentEditable
        );
        if (isText) {
          return;
        }
        e.preventDefault();
        // Se la ricerca è aperta con un overlay annidato (detail/leader/piantina/
        // formula), 'F' chiude l'overlay annidato invece di toggolare la ricerca:
        // altrimenti la ricerca si chiuderebbe lasciando l'overlay figlio fluttuante
        // senza il suo backdrop genitore (bug: detail visibile su pagina vuota).
        if (openRef.current && nestedRef.current) {
          closeNestedRef.current();
          return;
        }
        setOpen(o => !o);
      }
    };
    const onCustom = () => setOpen(true);
    webWindow.addEventListener('keydown', onKey);
    webWindow.addEventListener('vibra:search-open', onCustom);
    return () => {
      webWindow.removeEventListener('keydown', onKey);
      webWindow.removeEventListener('vibra:search-open', onCustom);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setExpandedEventId(null);
      setTimeout(() => inputRef.current?.focus(), 60);
      // Pre-carica i chunk degli overlay annidati (detail cliente, leader,
      // piantina, grafico serata) così il primo tap non attende lo scaricamento.
      clientDetailDialogLoader();
      leadersListLoader();
      piantinaFullscreenLoader();
      eventPromoterChartLoader();
    }
  }, [open]);

  // Con la ricerca aperta la pagina sotto NON deve scorrere. Il Dialog è `modal={false}` (serve per
  // gli overlay annidati), quindi Radix non blocca nulla: lo facciamo noi.
  // - lockScroll(): overflow:hidden su html (contatore condiviso con gli altri overlay, quindi
  //   i dettagli annidati che lo acquisiscono a loro volta non si pestano i piedi);
  // - touchmove: su iOS l'overflow:hidden non basta, il gesto va annullato. Si blocca SOLO se il
  //   tocco nasce sul contenuto della pagina (#root). La ricerca e tutti i suoi popup annidati sono
  //   portali su body, fuori da #root: la loro lista risultati continua a scorrere normalmente.
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const blockPageTouch = (e) => {
      if (e.target instanceof Element && e.target.closest('#root')) e.preventDefault();
    };
    webDocument.addEventListener('touchmove', blockPageTouch, { passive: false });
    return () => {
      webDocument.removeEventListener('touchmove', blockPageTouch);
      unlock();
    };
  }, [open]);

  // Tasto back (Android/browser): chiude la ricerca invece di uscire dall'app.
  // Se un overlay annidato è aperto, il back chiude quello e re-inserisce il
  // sentinel così il back successivo chiude la ricerca.
  useEffect(() => {
    if (!open) return;
    // Se apre dalla sidebar mobile, il sentinel della sidebar è già stato
    // convertito in {vibraSearch}: non ne pushiamo un secondo (evita race/back fantasma).
    if (!(webWindow.history.state && webWindow.history.state.vibraSearch)) {
      webWindow.history.pushState({ vibraSearch: true }, '');
    }
    const onPop = () => {
      // Se il sentinel della ricerca è ancora in cima, il popstate ha chiuso un
      // dialog annidato che gestisce il proprio sentinel (es. piantina via back):
      // non facciamo nulla (il dialog si è chiuso da solo).
      if (webWindow.history.state?.vibraSearch) return;
      if (nestedRef.current) {
        closeNestedRef.current();
        webWindow.history.pushState({ vibraSearch: true }, '');
      } else {
        setOpen(false);
      }
    };
    webWindow.addEventListener('popstate', onPop);
    return () => {
      webWindow.removeEventListener('popstate', onPop);
      if (webWindow.history.state?.vibraSearch) webWindow.history.back();
    };
  }, [open]);

  // Fallback nativo per Android: su alcuni WebView pointerdown non firea, quindi
  // onPointerDownOutside (Radix) non imposta nestedAtPointerDownRef. Usiamo
  // touchstart nativo su window (capture) come fonte alternativa: se il tocco è
  // fuori dal DialogContent e un overlay annidato è aperto, snapshotiamo lo
  // stato. Così l'onOpenChange guard blocca sempre la chiusura del dialog di
  // ricerca quando si chiude un overlay annidato (es. X della piantina).
  useEffect(() => {
    if (!open) return;
    const onTouchStart = (e) => {
      const target = e.target;
      if (dialogRef.current && !dialogRef.current.contains(target) && nestedRef.current) {
        nestedAtPointerDownRef.current = nestedRef.current;
      }
    };
    webWindow.addEventListener('touchstart', onTouchStart, { capture: true });
    return () => webWindow.removeEventListener('touchstart', onTouchStart, { capture: true });
  }, [open]);

  // Mobile (Android): quando la tastiera si apre, il dialog fisso a 88vh del layout
  // viewport viene coperto dalla tastiera. Aggiorniamo lo stile del dialog via ref
  // (senza re-render) così l'animazione è fluida e i tile non re-animano.
  useEffect(() => {
    if (!open) return;
    const vv = webWindow.visualViewport;
    if (!vv) return;
    let rafId = null;
    const apply = () => {
      const el = dialogRef.current;
      if (!el) return;
      const keyboardOpen = webWindow.innerHeight - vv.height > 120;
      if (keyboardOpen) {
        // Disabilita le transizioni CSS (duration-200 del Dialog Radix) durante
        // il resize della tastiera: senza questo, ogni cambio di top/height
        // anima a 200ms creando uno scatto dietro l'altro (effetto scattoso).
        el.style.transition = 'none';
        el.style.height = vv.height + 'px';
        el.style.top = (vv.offsetTop + vv.height / 2) + 'px';
        el.style.maxHeight = vv.height + 'px';
      } else if (el.style.height) {
        // Tastiera chiusa: rimuove gli stili personalizzati senza transizione
        // (lo scatto di ritorno era causato dal duration-200 su top/height).
        el.style.transition = 'none';
        el.style.height = '';
        el.style.top = '';
        el.style.maxHeight = '';
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = requestAnimationFrame(() => {
            if (el) el.style.transition = '';
          });
        });
      }
    };
    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      if (rafId) cancelAnimationFrame(rafId);
      const el = dialogRef.current;
      if (el) { el.style.height = ''; el.style.top = ''; el.style.maxHeight = ''; el.style.transition = ''; }
    };
  }, [open]);

  // Clienti: ESCLUSIVAMENTE personali (propri contatti). Se il promoter non è
  // collegato (promoter_id mancante) non carica nulla: nessun cliente altrui viene
  // mai mostrato, a nessun ruolo.
  const myPid = user?.promoter_id;
  const { data: clients = [] } = useQuery({
    queryKey: ['clients', myPid],
    queryFn: () => base44.entities.Client.filter({ promoter_id: myPid }),
    enabled: open && !!user && !!myPid,
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    enabled: open,
    staleTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: open,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Presenze per i propri clienti (usate dal detail dialog aperto dalla ricerca).
  const { data: detailAttendances = [] } = useQuery({
    queryKey: ['attendances', myPid],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: myPid }, '-created_date', 5000),
    enabled: (open || !!detailClient) && !!myPid,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Presenze proprie (PR/capogruppo): per mostrare il fatturato personale nelle serate
  // trovate dalla ricerca (non vedono il totale serata, solo il proprio).
  const { data: myAttendances = [] } = useQuery({
    queryKey: ['attendances', myPid],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: myPid }, '-created_date', 5000),
    enabled: open && !!user && !!myPid && !canSeeProspetto,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Venue + settings per la ricerca materiale locale (piantine/listini/formule).
  const { data: venuesRaw = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
    enabled: open,
    staleTime: 10 * 60000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { data: materialeSettings = [] } = useQuery({
    queryKey: ['all-app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    enabled: open,
    staleTime: 10 * 60000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Materiali & loghi della sezione Download (statici + DB) — cercabili da qui.
  const { data: dbDownloadItems = [] } = useQuery({
    queryKey: ['download-items'],
    queryFn: () => base44.entities.DownloadItem.list(),
    enabled: open,
    staleTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const downloadItems = useMemo(() => buildAllDownloadItems(dbDownloadItems), [dbDownloadItems]);

  // Arricchisce ogni download item con i nomi dei locali che condividono il
  // logo_key: così "logo ammare" trova "Frontemare — Logo Black" perché il
  // locale "Ammare Frontemare" ha logo_key "Frontemare" e il suo nome viene
  // aggiunto al testo di ricerca del logo.
  const downloadItemsEnriched = useMemo(() => {
    return downloadItems.map(it => {
      const nameLower = it.name?.toLowerCase() || '';
      const matchedVenues = venuesRaw.filter(v => {
        const key = (v.logo_key || v.name).toLowerCase();
        return key && nameLower.includes(key);
      });
      const venueNames = matchedVenues.map(v => v.name).join(' ');
      // "loghi" non contiene "logo" come sottostringa (loghi≠logo), quindi
      // aggiungiamo esplicitamente "logo" per le sezioni loghi: così "logo ammare"
      // matcha l'item "ammare png" nella sezione "Loghi Locali".
      const isLogoSection = it.sectionId === 'vibra-loghi' || it.sectionId === 'loghi-locali'
        || (it.sectionLabel?.toLowerCase().includes('loghi'));
      const logoKeyword = isLogoSection ? 'logo' : '';
      return { ...it, _searchText: `${it.name || ''} ${it.sectionLabel || ''} ${venueNames} ${logoKeyword}` };
    });
  }, [downloadItems, venuesRaw]);

  const promotersById = useMemo(() => {
    const m = {};
    promoters.forEach(p => { m[p.id] = p; });
    return m;
  }, [promoters]);

  // Lookup venue → materiali (piantina/listino/formule) da AppSettings.
  const venueRows = useMemo(() => {
    const settingsMap = new Map(materialeSettings.map(s => [s.key, s.value || '']));
    return venuesRaw
      .map(v => {
        const key = v.logo_key || v.name;
        const label = v.is_extra ? 'Extra / Festivi' : v.name;
        return {
          key,
          label,
          piantina: settingsMap.get('venue_piantina_' + key) || '',
          listino: settingsMap.get('venue_listino_' + key) || '',
          formule: settingsMap.get('venue_formule_' + key) || '',
        };
      });
  }, [venuesRaw, materialeSettings]);

  const results = useMemo(() => {
    const term = deferredQ.trim().toLowerCase();
    if (!term) return { clients: [], promoters: [], events: [], venues: [], appSections: [], settingsSections: [], materiale: [], downloadLoghi: [], isLeaderSearch: false };

    // Match giorno della settimana (es. "sabato")
    const dowNum = (() => {
      for (const [num, names] of Object.entries(DOW_NAMES)) {
        if (names.some(n => n === term || n.startsWith(term))) return Number(num);
      }
      return undefined;
    })();

    // ── Ricerca materiale locale: piantina/listino/formule + nome locale ──
    // Parole chiave rimaste dopo aver tolto la categoria identificano il locale.
    const MAT_KEYWORDS = {
      piantina: ['piantina', 'piantine', 'mappa', 'mappe'],
      listino: ['listino', 'listini', 'bottiglie', 'menu'],
      formule: ['formula', 'formule', 'entrata', 'ingresso', 'prezzi'],
    };
    const materiale = (() => {
      const words = term.split(/\s+/).filter(Boolean);
      let type = null;
      const matchedKwWords = new Set();
      for (const [t, kws] of Object.entries(MAT_KEYWORDS)) {
        for (const w of words) {
          if (kws.some(kw => w === kw || kw.startsWith(w) || w.startsWith(kw))) {
            type = t; matchedKwWords.add(w); break;
          }
        }
        if (type) break;
      }
      const venueMatches = (vt) => venueRows.filter(v => {
        const label = v.label.toLowerCase();
        const key = v.key.toLowerCase();
        return label.includes(vt) || vt.includes(label) || key.includes(vt);
      });

      // Categoria esplicita (piantina/listino/formule): mostra solo quel tipo
      // per i locali che ce l'hanno e che matchano l'eventuale nome locale.
      if (type) {
        const venueWords = words.filter(w => !matchedKwWords.has(w));
        const venueTerm = venueWords.join(' ').trim();
        const candidates = venueTerm ? venueMatches(venueTerm) : venueRows;
        return candidates
          .filter(v => {
            const has = type === 'piantina' ? v.piantina : type === 'listino' ? v.listino : v.formule;
            return !!has;
          })
          .map(v => ({
            venueLabel: v.label,
            type,
            value: type === 'piantina' ? v.piantina : type === 'listino' ? v.listino : v.formule,
          }));
      }

      // Nessuna keyword: se il termine (>=2 char) matcha un nome locale, mostra
      // tutti i materiali disponibili (piantina, listino, formule) di quel locale.
      if (term.length < 2) return [];
      return venueMatches(term).flatMap(v => {
        const items = [];
        if (v.piantina) items.push({ venueLabel: v.label, type: 'piantina', value: v.piantina });
        if (v.listino) items.push({ venueLabel: v.label, type: 'listino', value: v.listino });
        if (v.formule) items.push({ venueLabel: v.label, type: 'formule', value: v.formule });
        return items;
      });
    })();

    const isLeaderSearch = ['leader', 'stelle', 'stella'].some(w => w.startsWith(term) || term.includes(w)) && clients.some(c => c.is_leader);

    return {
      clients: clients
        .filter(c => smartMatch(c.name, term) || smartMatch(c.instagram, term) || c.phone?.includes(term))
        .slice(0, 30),
      events: events
        .filter(e => {
          if (smartMatch(e.name, term)) return true;
          if (smartMatch(e.venue, term)) return true;
          if (smartMatch(e.physical_location, term)) return true;
          if (smartMatch(e.notes, term)) return true;
          if (dowNum !== undefined && getDow(e.date) === dowNum) return true;
          return dateSearchStrings(e.date).some(s => s.includes(term));
        })
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        .slice(0, 8),
      promoters: (isAdmin || isSuper4)
        ? promoters
            .filter(p => smartMatch(p.name, term) || smartMatch(p.instagram, term) || p.phone?.includes(term) || smartMatch(p.neighborhood, term) || smartMatch(p.city, term))
            .slice(0, 8)
        : [],
      venues: (isAdmin || isSuper4)
        ? venuesRaw.filter(v => !v.is_extra && smartMatch(v.name, term)).slice(0, 8)
        : [],
      appSections: APP_SECTIONS
        .filter(s => s.roles.includes(user?.role) && s.keys.some(k => k.includes(term) || term.includes(k)))
        .slice(0, 8),
      settingsSections: SETTINGS_SECTIONS
        .filter(s => s.roles.includes(user?.role) && s.keys.some(k => k.includes(term) || term.includes(k)))
        .slice(0, 8),
      materiale,
      downloadLoghi: downloadItemsEnriched.filter(it => smartMatch(it._searchText, term)).slice(0, 12),
      isLeaderSearch,
    };
  }, [deferredQ, clients, promoters, events, venuesRaw, user?.role, isAdmin, isSuper4, venueRows, downloadItemsEnriched]);

  const hasAny = results.clients.length + results.promoters.length + results.events.length + results.venues.length + results.appSections.length + results.settingsSections.length + results.materiale.length + results.downloadLoghi.length + (results.isLeaderSearch ? 1 : 0) > 0;
  const goNavigate = (path) => { setOpen(false); navigate(path, { replace: true }); };

  // Apri il detail cliente: chiude VibraSearch per evitare conflitto di
  // layering. VibraSearch è un Dialog Radix modal (z-9999) con focus-trap
  // attivo; se resta aperto sotto il ClientDetailDialog (portal custom
  // z-10000), il focus-trap di Radix intercetta i click sul dettaglio e lo
  // rende non chiudibile. Chiudendo la ricerca il dialog Radix si smonta e
  // il dettaglio cliente resta l'unico overlay attivo.
  const handleClientClick = (c) => {
    setDetailClient(c);
  };
  const clientBadges = useMemo(() => buildClientBadgesMap(clients), [clients]);
  const leaders = useMemo(() => clients.filter(c => c.is_leader), [clients]);

  // Prospetto personale (PR/capogruppo): solo il proprio fatturato/tavoli per la serata.
  const myProspettoFor = (event) => {
    const myAtt = myAttendances.filter(a => a.event_id === event.id && a.promoter_id === myPid && !a.client_id);
    const revenue = myAtt.reduce((s, a) => s + (a.revenue || 0), 0);
    const dow = getDow(event.date);
    const customThreshold = event.table_threshold || null;
    const tables = calcTables(revenue, dow, customThreshold);
    return { revenue, tables };
  };

  const handleEventClick = (event) => {
    setExpandedEventId(id => (id === event.id ? null : event.id));
  };

  const handleCopyFormula = async () => {
    if (!formulaView) return;
    try {
      await webNavigator.clipboard.writeText(formulaView.text);
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 500);
    } catch {}
  };
  const handleDownloadFormula = () => {
    if (!formulaView) return;
    const blob = new Blob([formulaView.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = webDocument.createElement('a');
    a.href = url;
    a.download = (formulaView.label || 'formule').replace(/[^a-z0-9]/gi, '_') + '.txt';
    webDocument.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const glassPanelStyle = {
    backgroundColor: 'hsl(var(--background) / 0.30)',
    backdropFilter: 'blur(14px) saturate(160%)',
    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  };

  return (
    <>
      <Dialog
        open={open}
        modal={false}
        onOpenChange={(v) => {
        // Blocca la chiusura del dialog di ricerca se un overlay annidato era
        // aperto al momento del pointerdown (su Android l'outside interaction
        // può fireare dopo che il click ha già chiuso l'overlay annidato).
        if (!v && (nestedRef.current || nestedAtPointerDownRef.current)) {
          nestedAtPointerDownRef.current = null;
          return;
        }
        nestedAtPointerDownRef.current = null;
        setOpen(v);
      }}>
        <DialogContent
          ref={dialogRef}
          className="sm:max-w-4xl p-0 gap-0 overflow-hidden border-white/10 flex flex-col !rounded-2xl h-[88vh] max-h-[88vh]"
          style={glassPanelStyle}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => { nestedAtPointerDownRef.current = nestedRef.current; if (nestedRef.current) e.preventDefault(); }}
          onInteractOutside={(e) => { if (nestedRef.current || nestedAtPointerDownRef.current) e.preventDefault(); }}
          hideCloseButton
        >
          <DialogTitle className="sr-only">Cerca in VIBRA</DialogTitle>

          {/* Header fisso in vetro (stile dashboard) */}
          <Div className="shrink-0">
            <Div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
            <Div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
              <Div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/15 shrink-0">
                <Search className="w-4 h-4 text-primary" />
              </Div>
              <H className="text-lg font-bold text-foreground flex-1 leading-none">Cerca</H>
              <Btn
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                accessibilityLabel="Chiudi"
              >
                <X className="w-4 h-4" />
              </Btn>
            </Div>
            <Div className="px-4 pb-3">
              <Div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <HtmlInput
                  ref={inputRef}
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Cerca clienti, promoter, serate, locali, impostazioni, formule…"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {q && (
                  <Btn
                    onClick={() => setQ('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0"
                    accessibilityLabel="Pulisci"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Btn>
                )}
              </Div>
            </Div>
            <Div className="h-px w-full bg-white/10" />
          </Div>

          {/* Risultati — area fissa, scroll interno (l'intestazione resta ferma) */}
          <Div className="flex-1 min-h-0 overflow-y-auto p-3">
            <AnimatePresence mode="wait">
              {!deferredQ.trim() ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="min-h-full flex flex-col"
                >
                  {/* Hero */}
                  <Div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <Div
                      className="relative w-16 h-16 rounded-2xl bg-primary/12 flex items-center justify-center mb-4"
                      style={{ boxShadow: '0 0 44px -10px rgba(167,139,250,0.45)' }}
                    >
                      <Search className="w-7 h-7 text-primary" />
                    </Div>
                    <H className="text-lg font-semibold text-foreground flex items-center justify-center gap-1.5">
                      Cerca in
                      {logoDataUrl
                        ? <CachedImage src={logoDataUrl} alt="Vibra" className="h-[4.05em] object-contain align-middle" />
                        : <Span>Vibra</Span>}
                    </H>
                    <P className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                      Trova clienti, serate, locali o impostazioni in un tap.
                    </P>
                  </Div>
                  {/* Accessi rapidi */}
                  <Div className="pb-2">
                    <P className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2 px-1">Accessi rapidi</P>
                    <SectionsGrid sections={QUICK_TILES.filter(s => s.roles.includes(user?.role))} onPick={s => goNavigate(s.path)} />
                  </Div>
                </motion.div>
              ) : hasAny ? (
                <motion.div
                  key="results"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="space-y-3"
                >
            {/* LEADER */}
            {results.isLeaderSearch && (
              <Group title="Leader" icon={Star} color="#f59e0b" count={leaders.length}>
                <Btn
                  onClick={() => setLeadersOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                >
                  <Div className="w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </Div>
                  <Span className="min-w-0 flex-1">
                    <Span className="text-sm text-foreground truncate block">Apri box Leader</Span>
                    <Span className="text-[10px] text-muted-foreground truncate block">{leaders.length} leader · ordinati dal più recente</Span>
                  </Span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Btn>
              </Group>
            )}

            {/* MATERIALE LOCALI (piantine/listini/formule) */}
            {results.materiale.length > 0 && (
              <Group title="Materiale Locali" icon={MapIcon} color="#4ade80" count={results.materiale.length}>
                {results.materiale.map((m, i) => (
                  <Btn
                    key={i}
                    onClick={() => {
                      if (m.type === 'formule') {
                        // formule: testo — apre un overlay con il contenuto sopra la ricerca
                        setFormulaView({ label: m.venueLabel, text: m.value });
                      } else {
                        // piantina/listino: fullscreen sopra la ricerca (non chiude il box)
                        setFullscreenImg({ src: m.value, label: `${m.venueLabel} — ${m.type === 'piantina' ? 'Piantina' : 'Listino'}` });
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <Div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary/40 flex items-center justify-center shrink-0">
                      {m.type === 'formule'
                        ? <FileText className="w-4 h-4 text-orange-400" />
                        : m.type === 'listino'
                          ? <Wine className="w-4 h-4 text-purple-400" />
                          : <MapIcon className="w-4 h-4 text-emerald-400" />}
                    </Div>
                    <Span className="min-w-0 flex-1">
                      <Span className="text-sm text-foreground truncate block">{m.venueLabel}</Span>
                      <Span className="text-[10px] text-muted-foreground truncate block">
                        {m.type === 'piantina' ? 'Piantina' : m.type === 'listino' ? 'Listino bottiglie' : 'Formule di entrata'}
                      </Span>
                    </Span>
                    {m.type !== 'formule' && <Expand className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Btn>
                ))}
              </Group>
            )}

            {/* LOGHI & MATERIALE (sezione Download) */}
            {results.downloadLoghi.length > 0 && (
              <Group title="Loghi & Materiale" icon={Download} color="#8b5cf6" count={results.downloadLoghi.length}>
                {results.downloadLoghi.map((m, i) => (
                  <Btn
                    key={i}
                    onClick={() => {
                      if (m.isImage && m.preview) {
                        setFullscreenImg({ src: m.preview, label: m.name });
                      } else {
                        webWindow.open(m.url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <Div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary/40 flex items-center justify-center shrink-0">
                      {m.isImage && m.preview
                        ? <CachedImage src={m.preview} alt={m.name} className="w-full h-full object-contain" />
                        : <FileText className="w-4 h-4 text-muted-foreground" />}
                    </Div>
                    <Span className="min-w-0 flex-1">
                      <Span className="text-sm text-foreground truncate block">{m.name}</Span>
                      <Span className="text-[10px] text-muted-foreground truncate block">{m.isImage ? 'Logo / immagine' : 'File'}</Span>
                    </Span>
                    {m.isImage && <Expand className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Btn>
                ))}
              </Group>
            )}

            {/* CLIENTI */}
            {results.clients.length > 0 && (
              <Group title="Clienti" icon={Users} color="#a78bfa" count={results.clients.length}>
                <Div className="grid grid-cols-[1fr_auto] gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 border-b border-white/[0.06]">
                  <Span>Cliente</Span>
                  <Span className="text-right">Contatto</Span>
                </Div>
                {results.clients.map(c => (
                  <Btn
                    key={c.id}
                    onClick={() => handleClientClick(c)}
                    className="w-full grid grid-cols-[1fr_auto] gap-2 items-center px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <Span className="flex items-center gap-2.5 min-w-0">
                      <ClientAvatar client={c} initials={c.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="sm" />
                      <Span className="min-w-0">
                        <Span className="text-sm text-foreground truncate block">{c.name}</Span>
                        {c.instagram && <Span className="text-[10px] text-muted-foreground truncate block">@{c.instagram.replace('@', '')}</Span>}
                      </Span>
                    </Span>
                    <Span className="text-[11px] text-muted-foreground truncate max-w-[120px] text-right">
                      {c.phone || '—'}
                    </Span>
                  </Btn>
                ))}
              </Group>
            )}

            {/* PROMOTER */}
            {results.promoters.length > 0 && (
              <Group title="Promoter" icon={Users2} color="#f472b6" count={results.promoters.length}>
                {results.promoters.map(p => (
                  <Btn
                    key={p.id}
                    onClick={() => goNavigate('/promoter/' + p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <Span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary overflow-hidden shrink-0">
                      {p.photo_url
                        ? <CachedImage src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                        : p.name?.charAt(0)?.toUpperCase()}
                    </Span>
                    <Span className="min-w-0 flex-1">
                      <Span className="text-sm text-foreground truncate block">{p.name}</Span>
                      <Span className="text-[10px] text-muted-foreground truncate block">{p.ruolo}{p.neighborhood ? ` · ${p.neighborhood}` : ''}</Span>
                    </Span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Btn>
                ))}
              </Group>
            )}

            {/* SERATE */}
            {results.events.length > 0 && (
              <Group title="Serate" icon={CalendarRange} color="#60a5fa" count={results.events.length}>
                <Div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 border-b border-white/[0.06]">
                  <Span></Span>
                  <Span>Serata</Span>
                  <Span className="text-right">Fatturato</Span>
                  <Span className="text-right"></Span>
                </Div>
                {results.events.map(e => {
                  const dateLabel = e.date ? format(parseISO(e.date), 'd MMM yy', { locale: it }) : '';
                  const isExpanded = expandedEventId === e.id;
                  const dow = getDow(e.date);
                  const customThreshold = e.table_threshold || null;
                  let totalRevenue, totalTables;
                  let prProspetto = null;
                  if (canSeeProspetto) {
                    // Admin/super4 — riga collassata: usa total_revenue dell'evento
                    // (nessuna query presenze). Il prospetto espanso viene caricato
                    // on-demand da EventProspettoLoader (filter per event_id).
                    totalRevenue = e.total_revenue || 0;
                    totalTables = calcTables(totalRevenue, dow, customThreshold);
                  } else {
                    const my = myProspettoFor(e);
                    totalRevenue = my.revenue;
                    totalTables = my.tables;
                    prProspetto = {
                      promoterRows: promotersById[myPid]
                        ? [{ promoter: promotersById[myPid], revenue: my.revenue, tables: my.tables }]
                        : [],
                      exPrRows: [],
                      totalRevenue: my.revenue,
                      totalTables: my.tables,
                    };
                  }
                  return (
                    <Div key={e.id} className="border-b border-white/[0.04] last:border-0">
                      <Btn
                        onClick={() => handleEventClick(e)}
                        className="w-full grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left"
                      >
                        <VenueLogo venueKey={e.venue} size={28} />
                        <Span className="min-w-0">
                          <Span className="text-sm text-foreground truncate block">{e.name}</Span>
                          <Span className="text-[10px] text-muted-foreground truncate block">{e.venue || '—'}{dateLabel ? ` · ${dateLabel}` : ''}{e.physical_location ? ` → ${e.physical_location}` : ''}</Span>
                        </Span>
                        <Span className="text-right">
                          <Span className="text-xs font-bold text-primary block">€{(totalRevenue || 0).toLocaleString('it-IT')}</Span>
                          <Span className="text-[10px] text-muted-foreground block">{totalTables}t</Span>
                        </Span>
                        <Span className="flex items-center justify-end">
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Span>
                      </Btn>

                      {isExpanded && (canSeeProspetto
                        ? <EventProspettoLoader event={e} promotersById={promotersById} />
                        : <EventProspetto event={e} prospetto={prProspetto} />)}
                    </Div>
                  );
                })}
              </Group>
            )}

            {/* LOCALI */}
            {results.venues.length > 0 && (
              <Group title="Locali" icon={Building2} color="#34d399" count={results.venues.length}>
                {results.venues.map(v => (
                  <Btn
                    key={v.id}
                    onClick={() => goNavigate('/locali?venue=' + encodeURIComponent(v.name))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <VenueLogo venueKey={v.logo_key || v.name} size={28} />
                    <Span className="min-w-0 flex-1">
                      <Span className="text-sm text-foreground truncate block">{v.name}</Span>
                      <Span className="text-[10px] text-muted-foreground truncate block">Locale · tocca per aprire espanso</Span>
                    </Span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Btn>
                ))}
              </Group>
            )}

            {/* SEZIONI APP */}
            {results.appSections.length > 0 && (
              <Group title="Sezioni" icon={SlidersHorizontal} color="#60a5fa" count={results.appSections.length}>
                {results.appSections.map(s => (
                  <Btn
                    key={s.label}
                    onClick={() => goNavigate(s.path)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <Div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="w-3.5 h-3.5 text-primary" />
                    </Div>
                    <Span className="text-sm text-foreground truncate flex-1">{s.label}</Span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Btn>
                ))}
              </Group>
            )}

            {/* IMPOSTAZIONI */}
            {results.settingsSections.length > 0 && (
              <Group title="Impostazioni" icon={Settings2} color="#f59e0b" count={results.settingsSections.length}>
                {results.settingsSections.map(s => (
                  <Btn
                    key={s.label}
                    onClick={() => goNavigate(s.path)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
                  >
                    <Div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="w-3.5 h-3.5 text-primary" />
                    </Div>
                    <Span className="text-sm text-foreground truncate flex-1">{s.label}</Span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Btn>
                ))}
              </Group>
            )}
                </motion.div>
              ) : (
                <motion.div
                  key="noresults"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center text-center py-16"
                >
                  <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
                  <P className="text-sm text-muted-foreground">Nessun risultato per “{deferredQ}”.</P>
                </motion.div>
              )}
            </AnimatePresence>
          </Div>

        </DialogContent>
      </Dialog>

      {/* ── Overlay annidati: resi fratelli del Dialog di ricerca (non più   */}
      {/* figli del suo DialogContent) così il loro portal a body non viene   */}
      {/* ri-ordinato quando modal={!detailClient} toggla. Prima erano dentro  */}
      {/* DialogContent: al secondo dettaglio il portal del detail finiva    */}
      {/* dietro quello della ricerca (stesso z-9999, ordine DOM sbagliato).  */}
      {/* Detail cliente aperto in overlay sulla pagina corrente (no navigazione) */}
      {detailClient && (
        <React.Suspense fallback={<Div
          className="fixed inset-0 z-[10000] bg-black/80"
          accessibilityLabel="Caricamento cliente" />}>
        <ClientDetailDialog
          open={!!detailClient}
          onOpenChange={(v) => { if (!v) setDetailClient(null); }}
          client={detailClient}
          attendances={detailAttendances}
          events={events}
          badges={clientBadges[detailClient.id] || []}
          allClients={clients}
          onClientUpdated={(updated) => setDetailClient(updated)}
        />
        </React.Suspense>
      )}

      {/* Box Leader */}
      {leadersOpen && (
        <Dialog open={leadersOpen} onOpenChange={setLeadersOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Leader
            </DialogTitle>
            <P className="text-[11px] text-muted-foreground mb-3">Ordinati dall'ultimo diventato leader al più storico.</P>
            <React.Suspense fallback={<P>Caricamento leader…</P>}>
            <LeadersList
              leaders={leaders}
              events={events}
              sortBy="recent"
              onClientClick={(c) => { setLeadersOpen(false); setOpen(false); setDetailClient(c); }}
            />
            </React.Suspense>
          </DialogContent>
        </Dialog>
      )}

      {fullscreenImg && (
        <React.Suspense fallback={<Div
          className="fixed inset-0 z-[10001] bg-background/90 flex items-center justify-center">Caricamento immagine…</Div>}>
        <PiantinaFullscreen
          src={fullscreenImg.src}
          label={fullscreenImg.label}
          onClose={() => setFullscreenImg(null)}
        />
        </React.Suspense>
      )}

      {formulaView && (
        <Dialog open={!!formulaView} onOpenChange={(v) => { if (!v) setFormulaView(null); }}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-orange-400" />
              {formulaView.label} — Formule di entrata
            </DialogTitle>
            <Div className="flex items-center gap-2 pb-1">
              <Div className="relative">
                <Btn
                  onClick={handleCopyFormula}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/60 text-foreground transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copia
                </Btn>
                {copied && (
                  <Span className="absolute left-0 top-full mt-1.5 z-10 text-[10px] font-medium px-2 py-1 rounded-md bg-emerald-500 text-white shadow-lg whitespace-nowrap">
                    Testo copiato
                  </Span>
                )}
              </Div>
              <Btn
                onClick={handleDownloadFormula}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/60 text-foreground transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Scarica
              </Btn>
              <Btn
                onClick={() => shareText(formulaView.text, `${formulaView.label} — Formule di entrata`)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/60 text-foreground transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Condividi
              </Btn>
            </Div>
            <Span className='font-mono whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/90 bg-secondary/30 rounded-lg p-3 border border-border'>{formulaView.text}</Span>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Gruppo con intestazione classica (SectionHeader + linea colorata superiore stile
// sticky) e body glass che sfoca il dietro. Si anima in entrata con un leggero
// fade+slide (stagger ereditato dal container motion padre) per ammorbidire il
// passaggio tra stato vuoto e risultati.
const groupVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

function Group({ title, icon: Icon, color, count, children }) {
  return (
    <motion.div variants={groupVariants} className="rounded-xl overflow-hidden border border-white/[0.08]">
      <Div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <Div className="flex items-center px-3 py-2 border-b border-white/[0.06]">
        <SectionHeader icon={Icon} title={title} color={color} />
        <Span className="text-[10px] text-muted-foreground ml-auto bg-white/5 rounded px-1.5 py-0.5">{count}</Span>
      </Div>
      <Div
        className="p-1"
        style={{ backgroundColor: 'hsl(var(--background) / 0.12)', backdropFilter: 'blur(4px) saturate(160%)', WebkitBackdropFilter: 'blur(4px) saturate(160%)' }}
      >
        {children}
      </Div>
    </motion.div>
  );
}

function SectionsGrid({ sections, onPick }) {
  return (
    <Div className="grid grid-cols-2 gap-2">
      {sections.map((s, i) => (
        <motion.button
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: i * 0.035, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onPick(s)}
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-primary/10 hover:border-primary/25 transition-all duration-200 text-left group"
        >
          <Div
            className="w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors"
            style={{ boxShadow: '0 0 18px -6px rgba(167,139,250,0.25)' }}
          >
            <s.icon className="w-4 h-4 text-primary/85 group-hover:text-primary" />
          </Div>
          <Span className="text-sm font-medium text-foreground/85 group-hover:text-foreground truncate">{s.label}</Span>
        </motion.button>
      ))}
    </Div>
  );
}

// Carica le presenze di UNA serata on-demand (solo quando l'admin la espande).
// Sostituisce la vecchia query globale EventAttendance.list() che scaricava
// 5000+ record all'apertura della ricerca. Ora: filter({ event_id }) → ~50-200
// record per serata, zero payload finché l'admin non espande.
function EventProspettoLoader({ event, promotersById }) {
  const { data: attendances = [], isLoading } = useQuery({
    queryKey: ['event-attendances', event.id],
    queryFn: () => base44.entities.EventAttendance.filter({ event_id: event.id }),
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading || !attendances) {
    return (
      <Div className="px-3 pb-3 pt-1">
        <Div
          className="h-32 vibra-skeleton rounded-lg"
          accessibilityLabel="Caricamento prospetto" />
      </Div>
    );
  }

  const promoterDirectAtts = attendances.filter(a => a.promoter_id && !a.client_id);
  const exPrAtts = attendances.filter(a => !a.promoter_id && a.notes && a.notes.startsWith('__ex_pr__'));
  const exPrRows = exPrAtts.map(a => ({
    name: a.notes.startsWith('__ex_pr__:') ? a.notes.slice('__ex_pr__:'.length) : 'Ex PR',
    revenue: a.revenue || 0,
  }));
  const exPrTotal = exPrRows.reduce((s, r) => s + r.revenue, 0);
  const dow = getDow(event.date);
  const customThreshold = event.table_threshold || null;
  const totalRevenue = event.total_revenue || (promoterDirectAtts.reduce((s, a) => s + (a.revenue || 0), 0) + exPrTotal);
  const totalTables = calcTables(totalRevenue, dow, customThreshold);
  const promoterRows = promoterDirectAtts
    .map(a => ({
      promoter: promotersById[a.promoter_id],
      revenue: a.revenue || 0,
      tables: calcTables(a.revenue || 0, dow, customThreshold),
    }))
    .filter(r => r.promoter)
    .sort((a, b) => b.revenue - a.revenue);

  return <EventProspetto event={event} prospetto={{ promoterRows, exPrRows, totalRevenue, totalTables }} />;
}

function EventProspetto({ event, prospetto }) {
  const { promoterRows, exPrRows, totalRevenue, totalTables } = prospetto;
  if (promoterRows.length === 0 && exPrRows.length === 0) {
    return (
      <Div className="px-3 pb-3 pt-1">
        <P className="text-xs text-muted-foreground text-center py-3">Nessun fatturato promoter registrato per questa serata.</P>
      </Div>
    );
  }
  return (
    <Div className="px-3 pb-3 pt-1 space-y-2">
      {/* Header del prospetto */}
      <Div className="flex items-center gap-2 px-1 py-1">
        <VenueLogo venueKey={event.venue} size={34} />
        <Div className="min-w-0 flex-1">
          <P className="text-sm font-semibold truncate">{event.name}</P>
          <P className="text-[10px] text-muted-foreground truncate">{event.venue}{event.date ? ` · ${format(parseISO(event.date), 'd MMMM yyyy', { locale: it })}` : ''}</P>
        </Div>
        <Div className="text-right">
          <P className="text-sm font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
          <P className="text-[10px] text-muted-foreground">{totalTables} tavoli</P>
        </Div>
      </Div>

      {/* Tabella fatturato per promoter */}
      <Div className="rounded-lg border border-white/[0.06] overflow-hidden">
        <Div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-white/[0.02] border-b border-white/[0.06]">
          <Span>Promoter</Span>
          <Span className="text-right">%</Span>
          <Span className="text-right">Tav</Span>
          <Span className="text-right">Fatturato</Span>
        </Div>
        {promoterRows.map(({ promoter, revenue, tables }) => {
          const pct = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0;
          return (
            <Div key={promoter.id} className="px-2.5 py-2 border-b border-white/[0.03] last:border-0">
              <Div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                <Span className="flex items-center gap-2 min-w-0">
                  <Span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shrink-0">
                    {promoter.photo_url
                      ? <CachedImage src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
                      : promoter.name?.charAt(0)?.toUpperCase()}
                  </Span>
                  <Span className="text-xs font-medium truncate">{promoter.name}</Span>
                </Span>
                <Span className="text-[11px] text-muted-foreground text-right">{pct}%</Span>
                <Span className="text-[11px] text-muted-foreground text-right">{tables}</Span>
                <Span className="text-xs font-bold text-primary text-right">€{revenue.toLocaleString('it-IT')}</Span>
              </Div>
              <Div className="w-full bg-secondary rounded-full h-1 mt-1.5">
                <Div className="bg-primary h-1 rounded-full" style={{ width: `${pct}%` }} />
              </Div>
            </Div>
          );
        })}
        {exPrRows.map((row, i) => {
          const pct = totalRevenue > 0 ? Math.round((row.revenue / totalRevenue) * 100) : 0;
          return (
            <Div key={`ex-${i}`} className="px-2.5 py-2 border-b border-white/[0.03] last:border-0">
              <Div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                <Span className="flex items-center gap-2 min-w-0">
                  <Span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">×</Span>
                  <Span className="text-xs font-medium text-muted-foreground truncate">{row.name}</Span>
                </Span>
                <Span className="text-[11px] text-muted-foreground text-right">{pct}%</Span>
                <Span className="text-[11px] text-muted-foreground text-right">—</Span>
                <Span className="text-xs font-bold text-muted-foreground text-right">€{row.revenue.toLocaleString('it-IT')}</Span>
              </Div>
            </Div>
          );
        })}
      </Div>

      <React.Suspense fallback={<Div
        className="h-32 vibra-skeleton rounded-lg"
        accessibilityLabel="Caricamento grafico" />}><EventPromoterChart promoterRows={promoterRows} /></React.Suspense>
    </Div>
  );
}
