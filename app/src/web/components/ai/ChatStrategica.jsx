// Port di src/components/ai/ChatStrategica.jsx (convertito da scripts/port/codemod.mjs).
// Markdown: react-markdown → ui/markdown.tsx (stesso aspetto: preflight + varianti [&>p]:...).
import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/lib/base44';
import { Send, Mic, MicOff, Plus, ChevronLeft, Loader2, MessageSquare, Trash2, Pencil, Check, X, ImagePlus, BookOpen, XCircle, ArrowLeft, Menu, PanelLeft, Sparkles } from '@/ui/icons.generated';
import VibraAvatar from '@/web/components/ai/VibraAvatar';
import ModelSelector from '@/web/components/ai/ModelSelector';
import ReactMarkdown from '@/ui/markdown';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { lockScroll } from '@/web/lib/scrollLock';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { getCachedConversations, fetchVibraGPTConversations } from '@/web/lib/vibragptConversations';

import { storage as webStorage, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput, HtmlTextarea, Img } from '@/ui/elements';

const BASE_URL = 'https://media.base44.com/images/public/69de4f1f7f53d9f187d01392/';
const SLIDES = [
  { id: 1,  file: 'bec294e5e_1.png',   module: 'Le Pubbliche Relazioni', title: 'Cosa sono? Lavoro ed Investimento' },
  { id: 2,  file: '7fef6fd22_2.png',   module: 'Le Pubbliche Relazioni', title: 'E nel By Night? Locali e Divertimento' },
  { id: 3,  file: '93e283922_3.png',   module: 'Le Pubbliche Relazioni', title: 'Cosa significa essere un PR?' },
  { id: 4,  file: '53c5af5ad_4.png',   module: 'Le Pubbliche Relazioni', title: 'Risvolti Sociali Positivi, Personali ed Economici' },
  { id: 5,  file: '68f7ead9d_5.png',   module: 'Le Pubbliche Relazioni', title: 'Obiettivi ed Ambizione — Che futuro ho?' },
  { id: 6,  file: 'acab7ae1d_6.png',   module: 'Armi per diventare Leader', title: 'Ostinazione' },
  { id: 7,  file: '67a5af0d6_7.png',   module: 'Armi per diventare Leader', title: 'Tempo (Investimento)' },
  { id: 8,  file: 'cac1bb315_8.png',   module: 'Armi per diventare Leader', title: 'Tempo (a Disposizione)' },
  { id: 9,  file: 'ab084063d_9.png',   module: 'Armi per diventare Leader', title: 'Perseveranza' },
  { id: 10, file: '79a2d4299_10.png',  module: 'Armi per diventare Leader', title: 'Costanza' },
  { id: 11, file: 'a9a7d7d7f_11.png',  module: 'Armi per diventare Leader', title: 'Pazienza' },
  { id: 12, file: '47f15e487_12.png',  module: 'Armi per diventare Leader', title: 'Serietà' },
  { id: 13, file: '11899ebcd_13.png',  module: 'Armi per diventare Leader', title: 'Empatia' },
  { id: 14, file: '212065a08_14.png',  module: 'Vibra — Chi Siamo', title: 'Chi siamo, Cosa siamo, Come nasciamo' },
  { id: 15, file: 'd92acc1ff_15.png',  module: 'Vibra — Chi Siamo', title: 'In cosa consiste il nostro progetto?' },
  { id: 16, file: '2aa22bc24_16.png',  module: 'Vibra — Chi Siamo', title: 'Perché vogliamo essere diversi?' },
  { id: 17, file: '00fcfdb28_17.png',  module: 'Vibra — Chi Siamo', title: 'Movimento unico e senso di appartenenza' },
  { id: 18, file: '495363fe8_18.png',  module: 'Vibra — Chi Siamo', title: 'Significato di Famiglia' },
  { id: 19, file: '6c9ebbca4_19.png',  module: 'Gestione ed Organizzazione Personale', title: 'Individuazione Capacità Personali' },
  { id: 20, file: 'c94aecd24_20.png',  module: 'Gestione ed Organizzazione Personale', title: 'Individuazione Metodo di Approccio' },
  { id: 21, file: 'e8f1d353f_21.png',  module: 'Gestione ed Organizzazione Personale', title: 'Organizzazione del Tempo Settimanale' },
  { id: 22, file: 'b2f22180d_22.png',  module: 'Gestione ed Organizzazione Personale', title: 'Rinnovo Stimolo ed Energie Mentali' },
  { id: 23, file: '87c250995_23.png',  module: 'Gestione ed Organizzazione Personale', title: 'Burnout e Componente Emotiva' },
  { id: 24, file: '869ed2967_24.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Le 3 Regole di Vendita' },
  { id: 25, file: 'f03cfe3e3_24b.png', module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Come convincere qualcuno?' },
  { id: 26, file: '814f76f1d_25.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Individuare Mancanze e Insoddisfazione' },
  { id: 27, file: '67c8c03d4_26.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Individuazione Opinion Leader' },
  { id: 28, file: '3e5d200d4_27.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Ricerca ed Analisi del Profilo Giusto' },
  { id: 29, file: '6ad634aca_28.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Come contattare qualcuno?' },
  { id: 30, file: 'e14316574_29.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Rompighiaccio Efficaci' },
  { id: 31, file: '0edd734b6_30.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'La Ricerca della Scintilla nella Conversazione' },
  { id: 32, file: '51162a4d4_31.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Richiesta Indiretta per una Conferma' },
  { id: 33, file: '2369676e9_32.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Prevedere Risposte ed Evitare quelle Chiuse' },
  { id: 34, file: 'c9741ae0d_33.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Riprova Sociale' },
  { id: 35, file: 'ff62ab1b8_34.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Qualità e Quantità' },
  { id: 36, file: 'a631ebf50_35.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'La Chiave? Instaurare un Rapporto' },
  { id: 37, file: 'daee3243e_36.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Infoline, Indotto, Produzione Lavorata' },
  { id: 38, file: 'b536e9415_37.png',  module: 'Vendita del Prodotto ed Approccio al Cliente', title: 'Ognuno ha i suoi Tempi' },
  { id: 39, file: '2e1f70721_38.png',  module: 'Gestione del Cliente', title: 'Il Pagante prima di tutto' },
  { id: 40, file: 'b51855f6a_39.png',  module: 'Gestione del Cliente', title: 'Osservazione del loro Comportamento' },
  { id: 41, file: '7312ca454_40.png',  module: 'Gestione del Cliente', title: 'Mantenersi in Contatto con i propri Paganti' },
  { id: 42, file: 'fa93c5715_41.png',  module: 'Gestione del Cliente', title: 'Risolvere ed Accogliere Lamentele' },
  { id: 43, file: '79220eeb3_42.png',  module: 'Gestione del Cliente', title: 'Il tuo Opinion Leader è un tuo PR Indiretto' },
  { id: 44, file: 'cc1681640_43.png',  module: 'Social Media', title: 'Il Nostro Mezzo Lavorativo più Potente' },
  { id: 45, file: '12dd00221_44.png',  module: 'Social Media', title: 'Interazioni Settimanali Costanti' },
  { id: 46, file: 'ee3619c70_45.png',  module: 'Social Media', title: 'Pubblicazione Materiale Pubblicitario' },
  { id: 47, file: '1fb1fae9b_46.png',  module: 'Social Media', title: 'La Differenza tra Instagram e Tik Tok' },
  { id: 48, file: 'b88293456_47.png',  module: 'Social Media', title: 'Dove Trovare Contatti su Instagram?' },
  { id: 49, file: '44b11aecc_48.png',  module: 'Social Media', title: 'Come Sfruttare Tik Tok?' },
  { id: 50, file: 'a470213f7_49.png',  module: 'Social Media', title: 'Pubblicazione Contenuti di Qualità' },
  { id: 51, file: 'ea90861bf_50.png',  module: 'Lato Tecnico', title: 'Come Funzionano le Serate in cui Lavoro?' },
  { id: 52, file: '1cce3a95d_51.png',  module: 'Lato Tecnico', title: 'Differenziazione Formule Ven, Sab, Dom' },
  { id: 53, file: 'c49d93464_52.png',  module: 'Lato Tecnico', title: 'Casse e Pagamenti' },
  { id: 54, file: '8815d93eb_53.png',  module: 'Lato Tecnico', title: 'Organizzazione del Proprio Lavoro' },
  { id: 55, file: '99d67d41e_54.png',  module: 'Lato Tecnico', title: 'Criteri di Selezione' },
  { id: 56, file: '565205aef_55.png',  module: 'Riassunti', title: 'Vendita del Prodotto — In Pillole (Parte 1)' },
  { id: 57, file: '953bec071_56.png',  module: 'Riassunti', title: 'Vendita del Prodotto — In Pillole (Parte 2)' },
  { id: 58, file: 'c54294d78_57.png',  module: 'Timeline Annuale', title: 'Timeline Annuale — Archi della Stagione' },
];

const HOME_SUGGESTIONS = [
  'Qual è la serata dove ho fatturato di più?',
  'Come posso fare nuovi paganti?',
  "Che armi ho a disposizione per fidelizzare una comitiva?",
  'Come crescere in questo settore?',
];

function buildFormazioneIndex() {
  const byModule = {};
  SLIDES.forEach(s => {
    if (!byModule[s.module]) byModule[s.module] = [];
    byModule[s.module].push(s.title);
  });
  return Object.entries(byModule).map(([mod, titles]) => `• ${mod}: ${titles.join(' | ')}`).join('\n');
}

function buildContextSummary(promoters, events, attendances, filteredPromoterIds = null, currentUser = null) {
  const promotersToUse = filteredPromoterIds ? promoters.filter(p => filteredPromoterIds.includes(p.id)) : promoters;
  const attendancesToUse = filteredPromoterIds ? attendances.filter(a => filteredPromoterIds.includes(a.promoter_id)) : attendances;

  const recentEvents = [...events]
    .filter(e => e.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60);

  const serateDettaglio = recentEvents.map(ev => {
    const presenze = attendancesToUse
      .filter(a => a.event_id === ev.id && !a.client_id && a.present !== false)
      .map(a => {
        const p = promotersToUse.find(pr => pr.id === a.promoter_id);
        if (!p) return null;
        return { promoter: p.name, fatturato: a.revenue || 0 };
      })
      .filter(Boolean)
      .filter(x => x.fatturato > 0)
      .sort((a, b) => b.fatturato - a.fatturato);
    return {
      data: ev.date,
      serata: ev.name,
      locale: ev.venue || '',
      fatturato_totale: ev.total_revenue || 0,
      presenze,
    };
  });

  const promoterStats = promotersToUse.map(p => {
    const pa = attendancesToUse.filter(a => a.promoter_id === p.id && !a.client_id && a.present !== false && events.find(e => e.id === a.event_id)?.date);
    const fatturato = pa.reduce((s, a) => s + (a.revenue || 0), 0);
    const tavoli = pa.reduce((s, a) => {
      const ev = events.find(e => e.id === a.event_id);
      return s + calcTables(a.revenue || 0, null, ev?.table_threshold || 300);
    }, 0);
    return { nome: p.name, stato: p.status, fatturato_totale: Math.round(fatturato), tavoli_totali: Math.round(tavoli * 10) / 10, serate: pa.length };
  }).sort((a, b) => b.fatturato_totale - a.fatturato_totale);

  let userContext = '';
  if (currentUser) {
    const userPromoterRecord = promoters.find(p => p.id === currentUser.promoter_id);
    userContext = `\n\nUTENTE LOGGATO: ${currentUser.full_name} (${currentUser.role})`;
    if (userPromoterRecord) userContext += ` — Promoter: ${userPromoterRecord.name}`;
  }

  return `DATI AGGIORNATI DEL TEAM (${new Date().toLocaleDateString('it-IT')}):
Promoter attivi: ${promoters.filter(p => p.status === 'attivo').length} | Serate totali: ${events.length}

CLASSIFICHE CUMULATIVE PROMOTER:
${JSON.stringify(promoterStats)}

DETTAGLIO ULTIME ${recentEvents.length} SERATE (fonte: dati reali app):
${JSON.stringify(serateDettaglio)}${userContext}`;
}

async function generateConvName(userMessage, promoterId, promoterName) {
  try {
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Genera un titolo brevissimo (max 5 parole, in italiano) per una conversazione che inizia con: "${userMessage}". Solo il titolo, niente altro.`,
    });
    base44.entities.CreditUsageLog.create({
      promoter_id: promoterId,
      promoter_name: promoterName,
      feature: 'vibra_gpt_title',
      credits: 1,
      detail: 'generazione titolo conversazione',
    }).catch(() => {});
    return typeof res === 'string' ? res.trim().replace(/['"]/g, '') : null;
  } catch { return userMessage.slice(0, 60) || null; }
}

// Item conversazione (sidebar desktop + drawer mobile) — rinominabile
function ConvItem({ conv, isActive, onOpen, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const startEdit = (e) => {
    e.stopPropagation();
    setDraft(conv._customName || conv.metadata?.name || '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const confirmEdit = (e) => { e?.stopPropagation(); if (draft.trim()) onRename(conv.id, draft.trim()); setEditing(false); };
  const cancelEdit = (e) => { e?.stopPropagation(); setEditing(false); };

  return (
    <Div className={`group flex items-center gap-1 rounded-lg transition-all ${isActive ? 'bg-primary/15' : 'hover:bg-secondary/40'}`}>
      {editing ? (
        <Btn className="flex-1 flex items-center gap-1 px-2 py-1.5" onClick={e => e.stopPropagation()}>
          <HtmlInput ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit(); }}
            className="flex-1 text-xs bg-secondary/40 border border-primary/40 rounded px-2 py-1 focus:outline-none" />
          <Btn
            button
            onClick={confirmEdit}
            className="text-green-400 hover:text-green-300 p-0.5"><Check className="w-3 h-3" /></Btn>
          <Btn
            button
            onClick={cancelEdit}
            className="text-muted-foreground hover:text-foreground p-0.5"><X className="w-3 h-3" /></Btn>
        </Btn>
      ) : (
        <>
          <Btn
            button
            onClick={() => onOpen(conv)}
            className={`flex-1 text-left px-3 py-2.5 text-xs min-w-0 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Div className="font-medium truncate">{conv._customName || conv.metadata?.name || 'Conversazione'}</Div>
            <Div className="text-[10px] opacity-60 mt-0.5">
              {conv.updated_date ? format(parseISO(conv.updated_date), 'd MMM, HH:mm', { locale: it }) : ''}
            </Div>
          </Btn>
          <Btn
            button
            onClick={startEdit}
            className="shrink-0 p-1.5 rounded-md text-muted-foreground/0 group-hover:text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Pencil className="w-3 h-3" />
          </Btn>
          <Btn
            button
            onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
            className="shrink-0 p-1.5 mr-1 rounded-md text-muted-foreground/0 group-hover:text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <Trash2 className="w-3 h-3" />
          </Btn>
        </>
      )}
    </Div>
  );
}

// Area messaggi — full-width centrata (stile ChatGPT), auto-scroll in fondo
function MessagesArea({ displayMessages, loading, messagesEndRef }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [displayMessages, loading]);

  return (
    <Div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto">
      <Div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        {displayMessages.map((msg, i) => (
          <Div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <VibraAvatar className="mt-0.5" />
            )}
            <Div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg._attachedImages?.length > 0 && (
                <Div className="flex flex-wrap gap-1.5 justify-end">
                  {msg._attachedImages.map((url, j) => (
                    <Img key={j} src={url} alt="allegato" className="w-20 h-20 rounded-xl object-cover border border-primary/30" />
                  ))}
                </Div>
              )}
              {msg._selectedSlides > 0 && (
                <Div className="flex items-center gap-1 text-[10px] text-primary/70 bg-primary/10 px-2 py-1 rounded-lg">
                  <BookOpen className="w-3 h-3" /> {msg._selectedSlides} slide formazione allegate
                </Div>
              )}
              <Div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-secondary/40 text-foreground rounded-bl-sm'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    className="prose prose-sm prose-invert max-w-none
                      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                      [&>p]:mb-2 [&>p]:leading-relaxed
                      [&>ul]:mb-2 [&>ul]:space-y-1 [&>ul>li]:ml-4
                      [&>ol]:mb-2 [&>ol]:space-y-1 [&>ol>li]:ml-4
                      [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2 [&>h1]:mt-3
                      [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1.5 [&>h2]:mt-3
                      [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>h3]:mt-2
                      [&>strong]:font-bold [&>strong]:text-foreground
                      [&>blockquote]:border-l-2 [&>blockquote]:border-primary/40 [&>blockquote]:pl-3 [&>blockquote]:text-muted-foreground [&>blockquote]:italic
                      [&_li]:list-disc [&_li]:leading-snug
                      [&_code]:bg-secondary/60 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs"
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : msg.content}
              </Div>
            </Div>
          </Div>
        ))}

        {loading && (
          <Div className="flex gap-3 justify-start">
            <VibraAvatar className="mt-0.5" />
            <Div className="bg-secondary/40 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <Span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <Span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <Span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </Div>
          </Div>
        )}
        <Div ref={messagesEndRef} />
      </Div>
    </Div>
  );
}

const AGENT_AVANZATO = 'consulente_strategico';
const AGENT_STANDARD = 'consulente_strategico_lite';
const agentForTier = (t) => t === 'standard' ? AGENT_STANDARD : AGENT_AVANZATO;

export default function ChatStrategica({ promoters, events, attendances, onExit }) {
  const { user, ricercaAIMode } = useRoleAccess();
  const { logoDataUrl: vibraLogo } = useVibraLogo();
  // GPT avanzato riservato ad admin, super4 e capogruppo. I PR usano solo Standard.
  const canUseAvanzato = ['admin', 'super4', 'capogruppo'].includes(user?.role);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [attachedImages, setAttachedImages] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [showFormazionePanel, setShowFormazionePanel] = useState(false);
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false); // drawer conversazioni mobile (ChatGPT-like)
  const [kbH, setKbH] = useState(0); // altezza tastiera software (mobile) per tenere l'input sopra
  const [tier, setTier] = useState(() => {
    if (!canUseAvanzato) return 'standard';
    try { return webStorage.getItem('vibragpt_tier') || 'standard'; } catch { return 'standard'; }
  });
  useEffect(() => { try { webStorage.setItem('vibragpt_tier', tier); } catch {} }, [tier]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const activeConvIdRef = useRef(null);
  const imageInputRef = useRef(null);
  const inputRef = useRef(null);
  const isFirstMessageRef = useRef(false);
  const pendingUserMsgRef = useRef(null);
  const titleGeneratedRef = useRef(false);

  const mode = ricercaAIMode();
  const userPromoterTeam = mode === 'limited' && user?.promoter_id ? [user.promoter_id] : null;

  useEffect(() => { activeConvIdRef.current = activeConvId; }, [activeConvId]);
  useEffect(() => { initLoad(); }, []);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  // Tastiera software (mobile): tiene l'input sopra la tastiera
  useEffect(() => {
    const vv = webWindow.visualViewport;
    if (!vv) return;
    const onResize = () => {
      const h = webWindow.innerHeight - vv.height - vv.offsetTop;
      setKbH(h > 0 ? h : 0);
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    return () => { vv.removeEventListener('resize', onResize); vv.removeEventListener('scroll', onResize); };
  }, []);

  // Scroll lock ref-counted: blocca body+html finché il componente è montato.
  useEffect(() => lockScroll(), []);

  const initLoad = async () => {
    // Istantaneo: se le conversazioni sono già precaricate a idle (AppLayout),
    // mostrale subito senza spinner, poi ricalcola in background per freschezza.
    const cached = getCachedConversations();
    if (cached) {
      setConversations(cached);
      setLoadingConvs(false);
    }
    try {
      const fresh = await fetchVibraGPTConversations();
      setConversations(fresh);
    } catch { if (!cached) setConversations([]); }
    if (!cached) setLoadingConvs(false);
  };

  const openConversation = async (conv) => {
    activeConvIdRef.current = conv.id;
    setActiveConvId(conv.id);
    setDrawerOpen(false);
    try {
      const full = await base44.agents.getConversation(conv.id);
      const msgs = (full.messages || [])
        .filter(m => m.role !== 'system' && m.role !== 'tool')
        .filter(m => !(m.role === 'assistant' && (!m.content || m.content.trim() === '')))
        .map(m => ({
          ...m,
          content: m.role === 'user' && m.content?.includes('[MESSAGGIO UTENTE]')
            ? m.content.split('[MESSAGGIO UTENTE]\n').pop()
            : m.content,
        }));
      setMessages(msgs);
      isFirstMessageRef.current = msgs.filter(m => m.role === 'user').length === 0;
      titleGeneratedRef.current = true; // conversazione esistente: titolo già presente
    } catch { setMessages([]); }
  };

  const startNewChat = () => {
    // Nuova chat "draft": nessuna conversazione viene creata finché l'utente
    // non invia il primo messaggio (verrà creata in sendMessage al primo invio).
    activeConvIdRef.current = null;
    setActiveConvId(null);
    setMessages([]);
    setAttachedImages([]);
    setSelectedSlides([]);
    setShowFormazionePanel(false);
    setDrawerOpen(false);
    isFirstMessageRef.current = true;
    titleGeneratedRef.current = false;
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const HIDDEN_KEY = 'hidden_conv_ids';
  const NAMES_KEY = 'conv_custom_names';
  const getHiddenIds = () => { try { return JSON.parse(webStorage.getItem(HIDDEN_KEY)) || []; } catch { return []; } };

  const deleteConversation = (convId) => {
    const hidden = [...getHiddenIds(), convId];
    webStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden));
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConvIdRef.current === convId) {
      setActiveConvId(null);
      setMessages([]);
    }
    setDeleteConfirm(null);
  };

  const renameConversation = (convId, newName) => {
    const names = JSON.parse(webStorage.getItem(NAMES_KEY) || '{}');
    names[convId] = newName;
    webStorage.setItem(NAMES_KEY, JSON.stringify(names));
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, _customName: newName } : c));
    base44.functions.invoke('setConversationName', { conversationId: convId, name: newName }).catch(() => {});
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImg(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAttachedImages(prev => [...prev, { url: file_url, name: file.name }]);
    }
    setUploadingImg(false);
    e.target.value = '';
  };

  const toggleSlide = (id) => {
    setSelectedSlides(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const sendMessage = async (overrideText) => {
    const userText = overrideText ?? input;
    if ((!userText.trim() && attachedImages.length === 0 && selectedSlides.length === 0) || loading) return;

    // Cattura gli allegati attuali PRIMA di pulire l'input (sync, nessun await)
    const capturedImages = attachedImages.map(i => i.url);
    const capturedSlideIds = [...selectedSlides];

    // UI ottimistica: mostra subito il messaggio utente e svuota l'input
    // PRIMA di qualsiasi chiamata di rete, così il tap risulta immediato
    // (come l'app nativa di ChatGPT).
    const userMsg = {
      role: 'user',
      content: userText || '(vedi immagini allegate)',
      _attachedImages: capturedImages,
      _selectedSlides: capturedSlideIds.length,
    };
    setMessages(prev => [...prev, userMsg]);
    pendingUserMsgRef.current = userMsg;
    setInput('');
    setAttachedImages([]);
    setSelectedSlides([]);
    setShowFormazionePanel(false);
    setLoading(true);

    // Ora il lavoro di rete (creazione conversazione) senza bloccare la UI
    let convId = activeConvId;
    let conv = conversations.find(c => c.id === convId) || null;

    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: agentForTier(tier),
        metadata: { name: userText.slice(0, 60) },
      });
      convId = conv.id;
      activeConvIdRef.current = convId;
      setConversations(prev => [conv, ...prev]);
      setActiveConvId(convId);
      isFirstMessageRef.current = true;
    }

    const isFirst = isFirstMessageRef.current;
    isFirstMessageRef.current = false;

    const contextSummary = buildContextSummary(promoters, events, attendances, userPromoterTeam, user);
    let formazioneCtx = '';
    if (capturedSlideIds.length > 0) {
      const sel = SLIDES.filter(s => capturedSlideIds.includes(s.id));
      formazioneCtx = `\n\n[SLIDE FORMAZIONE ALLEGATE]\n${sel.map(s => `- Modulo "${s.module}" → Slide "${s.title}"`).join('\n')}`;
    }
    const formazioneIndex = isFirst ? `\n\nMATERIALE FORMATIVO VIBRA (${SLIDES.length} slide totali):\n${buildFormazioneIndex()}` : '';
    const msgContent = `[DATI AGGIORNATI]\n${contextSummary}${formazioneIndex}${formazioneCtx}\n\n[MESSAGGIO UTENTE]\n${userText || '(vedi immagini allegate)'}`;
    const slideUrls = SLIDES.filter(s => capturedSlideIds.includes(s.id)).map(s => BASE_URL + s.file);
    const allFileUrls = [...capturedImages, ...slideUrls];

    let done = false;
    let lastAssistantContent = '';
    let stableTimer = null;
    let safetyTimer = null;

    const finish = (finalMsgs) => {
      if (done) return;
      done = true;
      clearTimeout(stableTimer);
      clearTimeout(safetyTimer);
      unsubscribe();
      const cleaned = (finalMsgs || [])
        .filter(m => m.role !== 'system' && m.role !== 'tool')
        .map(m => ({
          ...m,
          content: m.role === 'user' && m.content?.includes('[MESSAGGIO UTENTE]')
            ? m.content.split('[MESSAGGIO UTENTE]\n').pop()
            : m.content,
          ...(m.role === 'user' ? {
            _attachedImages: pendingUserMsgRef.current?._attachedImages || [],
            _selectedSlides: pendingUserMsgRef.current?._selectedSlides || 0,
          } : {}),
        }))
        .filter(m => !(m.role === 'assistant' && (!m.content || m.content.trim() === '')));
      setMessages(cleaned);
      setLoading(false);
      pendingUserMsgRef.current = null;
      // Log credit usage for VibraGPT / Consulente Strategico agent response
      const promoterRecord = promoters.find(p => p.id === user?.promoter_id);
      const promoterName = promoterRecord?.name || '';
      const promoterId = user?.promoter_id || user?.id || 'unknown';
      base44.entities.CreditUsageLog.create({
        promoter_id: promoterId,
        promoter_name: promoterName,
        feature: 'vibra_gpt',
        credits: tier === 'avanzato' ? 15 : 1,
        detail: tier === 'avanzato' ? 'Consulente Strategico (gpt_5_5)' : 'Consulente Strategico (automatic)',
      }).catch(() => {});
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, updated_date: new Date().toISOString() } : c));
      // Genera il titolo AI solo dal SECONDO scambio (non al primo), così le
      // chat "usa e getta" con un solo messaggio non consumano 1 credito.
      if (!isFirst && !titleGeneratedRef.current) {
        titleGeneratedRef.current = true;
        generateConvName(userText, promoterId, promoterName).then(name => {
          if (name) {
            const names = JSON.parse(webStorage.getItem(NAMES_KEY) || '{}');
            names[convId] = name;
            webStorage.setItem(NAMES_KEY, JSON.stringify(names));
            setConversations(prev => prev.map(c => c.id === convId ? { ...c, _customName: name } : c));
            base44.functions.invoke('setConversationName', { conversationId: convId, name }).catch(() => {});
          }
        });
      }
    };

    const unsubscribe = base44.agents.subscribeToConversation(convId, (data) => {
      if (done || activeConvIdRef.current !== convId) return;

      const msgs = data.messages || [];
      const pending = pendingUserMsgRef.current;
      const norm = (s) => String(s ?? '').trim();
      const serverHasUser = pending && msgs.some(m => {
        if (m.role !== 'user') return false;
        const clean = m.content?.split('[MESSAGGIO UTENTE]\n').pop();
        return norm(clean) === norm(pending.content);
      });
      const displayMsgs = msgs
        .filter(m => m.role !== 'system' && m.role !== 'tool')
        .filter(m => !(m.role === 'assistant' && (!m.content || m.content.trim() === '')))
        .map(m => ({
          ...m,
          content: m.role === 'user' && m.content?.includes('[MESSAGGIO UTENTE]')
            ? m.content.split('[MESSAGGIO UTENTE]\n').pop()
            : m.content,
          ...(m.role === 'user' && pending ? {
            _attachedImages: pending._attachedImages || [],
            _selectedSlides: pending._selectedSlides || 0,
          } : {}),
        }));
      if (pending && !serverHasUser) {
        // Il messaggio utente non è ancora riflesso dal server: inseriscilo SEMPRE
        // prima del primo messaggio assistant (se presente), così resta fisso sopra
        // la risposta di GPT e non "salta" in fondo durante lo streaming.
        const firstAssistantIdx = displayMsgs.findIndex(m => m.role === 'assistant');
        if (firstAssistantIdx === -1) {
          setMessages([...displayMsgs, pending]);
        } else {
          const withUser = [...displayMsgs];
          withUser.splice(firstAssistantIdx, 0, pending);
          setMessages(withUser);
        }
      } else {
        setMessages(displayMsgs);
      }

      const lastMsg = msgs[msgs.length - 1];
      const assistantContent = lastMsg?.role === 'assistant' ? (lastMsg.content || '') : '';
      if (assistantContent !== lastAssistantContent) {
        lastAssistantContent = assistantContent;
        clearTimeout(stableTimer);
        stableTimer = setTimeout(() => finish(msgs), 2000);
      }
    });

    safetyTimer = setTimeout(() => finish(null), 60000);

    try {
      await base44.agents.addMessage({ id: convId }, {
        role: 'user',
        content: msgContent,
        ...(allFileUrls.length > 0 ? { file_urls: allFileUrls } : {}),
      });
    } catch (err) {
      done = true;
      clearTimeout(stableTimer);
      clearTimeout(safetyTimer);
      unsubscribe();
      setMessages(prev => [...prev, { role: 'assistant', content: 'Errore durante l\'invio. Riprova.' }]);
      setLoading(false);
      pendingUserMsgRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Riconoscimento vocale non supportato. Usa Chrome.');
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = webWindow.SpeechRecognition || webWindow.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'it-IT'; rec.continuous = false; rec.interimResults = false;
    rec.onresult = (e) => { setInput(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const displayMessages = messages;
  const hasMessages = displayMessages.length > 0;
  const activeConv = conversations.find(c => c.id === activeConvId) || null;

  // ── INPUT AREA (stile ChatGPT: pillola centrata in basso) ──
  const InputArea = (
    <Div className="shrink-0 px-3 pt-2 pb-2" style={{ paddingBottom: `max(env(safe-area-inset-bottom), ${kbH}px)` }}>
      <Div className="max-w-3xl mx-auto">
        {(attachedImages.length > 0 || selectedSlides.length > 0) && (
          <Div className="flex flex-wrap gap-2 mb-2 px-1">
            {attachedImages.map((img, i) => (
              <Div key={i} className="relative group">
                <Img src={img.url} alt={img.name} className="w-14 h-14 rounded-lg object-cover border border-border" />
                <Btn
                  button
                  onClick={() => setAttachedImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <XCircle className="w-3.5 h-3.5" />
                </Btn>
              </Div>
            ))}
            {selectedSlides.length > 0 && (
              <Div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
                <BookOpen className="w-3.5 h-3.5" />
                {selectedSlides.length} slide
                <Btn
                  button
                  onClick={() => setSelectedSlides([])}
                  className="ml-1 hover:text-destructive"><X className="w-3 h-3" /></Btn>
              </Div>
            )}
          </Div>
        )}

        {showFormazionePanel && (
          <Div className="rounded-2xl border border-border bg-card p-3 mb-2 max-h-44 overflow-y-auto space-y-2">
            <P className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Seleziona slide</P>
            {[...new Set(SLIDES.map(s => s.module))].map(mod => (
              <Div key={mod}>
                <P className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider mb-1">{mod}</P>
                <Div className="flex flex-wrap gap-1.5">
                  {SLIDES.filter(s => s.module === mod).map(slide => (
                    <Btn
                      button
                      key={slide.id}
                      onClick={() => toggleSlide(slide.id)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${selectedSlides.includes(slide.id) ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                      {slide.title}
                    </Btn>
                  ))}
                </Div>
              </Div>
            ))}
          </Div>
        )}

        <Div className="relative flex items-end gap-1.5 rounded-[1.6rem] border border-border bg-card px-2.5 py-1.5 shadow-lg shadow-black/20 focus-within:border-primary/40 transition-colors">
          <HtmlInput ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <Btn
            button
            onClick={() => imageInputRef.current?.click()}
            disabled={uploadingImg}
            className="shrink-0 p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40"
            accessibilityLabel="Allega immagine">
            {uploadingImg ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
          </Btn>
          <Btn
            button
            onClick={() => setShowFormazionePanel(p => !p)}
            className={`shrink-0 p-2 rounded-full transition-colors ${showFormazionePanel ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
            accessibilityLabel="Allega slide formazione">
            <BookOpen className="w-5 h-5" />
          </Btn>
          <HtmlTextarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chiedi a Vibra..."
            ref={inputRef}
            className="flex-1 bg-transparent resize-none text-[15px] leading-6 py-1.5 px-1 placeholder:text-muted-foreground focus:outline-none max-h-40 overflow-y-auto"
            rows={1}
          />
          <Btn
            button
            onClick={toggleVoice}
            className={`shrink-0 p-2 rounded-full transition-colors ${isListening ? 'text-red-400 animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
            accessibilityLabel={isListening ? 'Ferma' : 'Vocale'}>
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Btn>
          <Btn
            button
            onClick={() => sendMessage()}
            disabled={loading || (!input.trim() && attachedImages.length === 0 && selectedSlides.length === 0)}
            className="shrink-0 p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <Send className="w-5 h-5" />
          </Btn>
        </Div>
        <P className="text-[11px] text-muted-foreground text-center mt-1.5">VibraGPT analizza i dati del team in tempo reale</P>
      </Div>
    </Div>
  );

  const SidebarContent = (
    <>
      <Div className="flex items-center gap-2 px-4 h-14 border-b border-border shrink-0">
        <VibraAvatar />
        <Div className="flex-1 min-w-0">
          <P className="font-semibold text-sm leading-tight">VibraGPT</P>
          <P className="text-[10px] text-muted-foreground truncate">Consulente strategico</P>
        </Div>
      </Div>
      <Div className="p-2 shrink-0">
        <Btn
          button
          onClick={startNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:bg-secondary/40 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nuova chat
        </Btn>
      </Div>
      <Div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {loadingConvs ? (
          <Div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></Div>
        ) : conversations.length === 0 ? (
          <Div className="px-4 py-6 text-center"><MessageSquare className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" /><P className="text-xs text-muted-foreground">Nessuna conversazione</P></Div>
        ) : (
          conversations.map(conv => (
            <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onOpen={openConversation} onDelete={(id) => setDeleteConfirm(id)} onRename={renameConversation} />
          ))
        )}
      </Div>
    </>
  );

  return (
    <>
      {/* Dialog conferma eliminazione */}
      {deleteConfirm && (
        <Div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4">
          <Div className="bg-card border border-border rounded-2xl p-5 shadow-2xl max-w-xs w-full">
            <P className="text-sm font-semibold mb-1">Eliminare la conversazione?</P>
            <P className="text-xs text-muted-foreground mb-4">Questa azione non può essere annullata.</P>
            <Div className="flex gap-2 justify-end">
              <Btn
                button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary/40 transition-all">Annulla</Btn>
              <Btn
                button
                onClick={() => deleteConversation(deleteConfirm)}
                className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs hover:bg-destructive/80 transition-all">Elimina</Btn>
            </Div>
          </Div>
        </Div>
      )}

      {/* Shell ChatGPT-like: fissa nell'area contenuto (sotto il top chrome, sopra la
          mobile nav su mobile; a destra della sidebar app su desktop). La mobile nav
          resta sempre visibile e cliccabile per cambiare sezione. */}
      <Div
        className="fixed top-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-0 left-0 lg:left-64 right-0 z-[55] flex bg-background">
        {/* ── SIDEBAR DESKTOP ── */}
        <Div className={`hidden lg:flex flex-col border-r border-border bg-sidebar/40 transition-[width] duration-200 overflow-hidden ${showSidebar ? 'w-72' : 'w-0'}`}>
          {showSidebar && SidebarContent}
        </Div>

        {/* ── MAIN ── */}
        <Div className="flex-1 flex flex-col min-w-0 relative">
          {/* Top bar */}
          <Div className="shrink-0 flex items-center gap-1 px-2 pt-[calc(env(safe-area-inset-top)+0.25rem)] pb-1 min-h-[3.5rem] border-b border-border bg-background/80 backdrop-blur-sm">
            <Btn
              button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary/40 transition-colors"
              accessibilityLabel="Conversazioni">
              <Menu className="w-5 h-5" />
            </Btn>
            <Btn
              button
              onClick={() => setShowSidebar(s => !s)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-secondary/40 transition-colors"
              accessibilityLabel="Sidebar">
              {showSidebar ? <PanelLeft className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 rotate-180" />}
            </Btn>
            {onExit && (
              <Btn
                button
                onClick={onExit}
                className="p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                accessibilityLabel="Indietro">
                <ArrowLeft className="w-5 h-5" />
              </Btn>
            )}
            <Div className="flex-1 min-w-0 flex items-center gap-2 justify-center">
              <VibraAvatar size="sm" />
              <P className="text-sm font-semibold truncate max-w-[60%]">
                {activeConv ? (activeConv._customName || activeConv.metadata?.name || 'VibraGPT') : 'VibraGPT'}
              </P>
            </Div>
            <ModelSelector tier={tier} onTierChange={setTier} canUseAvanzato={canUseAvanzato} />
            <Btn
              button
              onClick={startNewChat}
              className="p-2 rounded-lg hover:bg-secondary/40 transition-colors"
              accessibilityLabel="Nuova chat">
              <Plus className="w-5 h-5" />
            </Btn>
          </Div>

          {/* Messages / Home */}
          {hasMessages ? (
            <MessagesArea displayMessages={displayMessages} loading={loading} messagesEndRef={messagesEndRef} />
          ) : (
            <Div className="flex-1 overflow-y-auto">
              <Div className="h-full flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto py-10">
                <Div className="flex items-center gap-3 mb-4">
                  {vibraLogo && (
                    <Img src={vibraLogo} alt="Vibra" className="h-14 sm:h-16 w-auto object-contain" />
                  )}
                  <Div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </Div>
                </Div>
                <H className="text-2xl font-semibold mb-2">Da dove iniziamo?</H>
                <P className="text-sm text-muted-foreground mb-6 max-w-md">
                  Ti aiuterò a costruire strategie, fidelizzare paganti e crescere nelle pubbliche relazioni.
                </P>
                <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {HOME_SUGGESTIONS.map((s) => (
                    <Btn
                      button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-sm px-3.5 py-3 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 text-muted-foreground hover:text-foreground transition-colors">
                      {s}
                    </Btn>
                  ))}
                </Div>
              </Div>
            </Div>
          )}

          {InputArea}
        </Div>

        {/* ── DRAWER MOBILE ── */}
        {drawerOpen && (
          <Div className="fixed inset-0 z-[70] lg:hidden">
            <Btn className="absolute inset-0 bg-black/50 backdrop-fade-in" onClick={() => setDrawerOpen(false)} />
            <Div className="absolute left-0 top-0 bottom-0 w-[84%] max-w-xs bg-card border-r border-border flex flex-col menu-pop-in">
              <Div className="flex items-center gap-2 px-3 h-14 border-b border-border shrink-0">
                <Div className="flex items-center gap-2 flex-1 min-w-0">
                  <VibraAvatar />
                  <Div className="flex-1 min-w-0"><P className="font-semibold text-sm leading-tight">VibraGPT</P><P className="text-[10px] text-muted-foreground truncate">Consulente strategico</P></Div>
                </Div>
                <Btn
                  button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary/40"><X className="w-5 h-5" /></Btn>
              </Div>
              <Div className="p-2 shrink-0">
                <Btn
                  button
                  onClick={startNewChat}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border hover:bg-secondary/40 text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Nuova chat
                </Btn>
              </Div>
              <Div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
                {loadingConvs ? (
                  <Div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></Div>
                ) : conversations.length === 0 ? (
                  <Div className="px-4 py-6 text-center"><MessageSquare className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" /><P className="text-xs text-muted-foreground">Nessuna conversazione</P></Div>
                ) : (
                  conversations.map(conv => (
                    <ConvItem key={conv.id} conv={conv} isActive={activeConvId === conv.id} onOpen={openConversation} onDelete={(id) => setDeleteConfirm(id)} onRename={renameConversation} />
                  ))
                )}
              </Div>
            </Div>
          </Div>
        )}
      </Div>
    </>
  );
}