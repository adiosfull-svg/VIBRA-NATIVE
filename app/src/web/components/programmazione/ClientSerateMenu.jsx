// Port di src/components/programmazione/ClientSerateMenu.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <div> gesture/eventi web rimossi: onPointerDown
//  - <input type="date"> da sostituire con il controllo nativo
//  - <input> gesture/eventi web rimossi: onKeyDown
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarPlus, X, Plus, Sparkles, Star, Car, Check, Bell, Trash2, Users, Search, ChevronLeft, UserPlus, UserMinus, Image as ImageIcon, AlertCircle, Loader2, CheckSquare, Power, Share2, ArrowRightLeft, Copy, Undo2 } from '@/ui/icons.generated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAll } from '@/web/lib/safeData';
import { invalidateFullTables, STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/ui/dialog';
import { Switch } from '@/ui/menu';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import CachedImage from '@/web/components/shared/CachedImage';
import ClientShareCard from '@/web/components/client/ClientShareCard';
import SeminaShareCard from '@/web/components/programmazione/SeminaShareCard';
import { useToast } from '@/ui/use-toast';
import { base44 } from '@/lib/base44';
import { wasRecentScroll } from '@/web/lib/scrollGuard';
import { lockScroll } from '@/web/lib/scrollLock';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, Label } from '@/ui/elements';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';

function formatShareText(client) {
  const rating = client?.cum_rating || 0;
  const visits = client?.cum_visits || 0;
  const totalSpent = client?.cum_total_spent || 0;
  const createdDate = client?.created_date ? format(new Date(client.created_date), 'd MMM yyyy', { locale: it }) : '';
  let text = `📊 Scheda Cliente — ${client?.name || ''}\n`;
  if (rating > 0) text += `💎 Rating: ${rating.toFixed(1)}/10\n`;
  text += `🎟️ Presenze: ${visits}\n`;
  text += `💰 Spesa totale: €${totalSpent.toLocaleString('it-IT')}\n`;
  if (createdDate) text += `📅 Cliente dal: ${createdDate}\n`;
  text += `\n— Vibra`;
  return text;
}

/**
 * "Copia presenze da…": dialog a due passi.
 * 1) scegli il cliente sorgente; 2) spunta quali presenze del sorgente copiare sul cliente target.
 * Crea nuove EventAttendance (client_id = target, stesso event_id) con lo stesso metodo del resto
 * dell'app. Le serate in cui il target ha già una presenza non sono selezionabili (niente duplicati).
 * new_people_brought non viene copiato (le persone portate non sono trasferibili); table_number e
 * notes restano vuoti.
 */
function CopyAttendancesDialog({ target, onClose, allClients = [], getClient }) {
  const open = !!target;
  const { toast } = useToast();
  const qc = useQueryClient();
  const [source, setSource] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [copyRevenue, setCopyRevenue] = useState(true);
  const [saving, setSaving] = useState(false);
  // Elemento del DialogContent (ref a callback: Radix lo monta un commit dopo `open`).
  const [dlgEl, setDlgEl] = useState(null);

  // Tastiera software (mobile): il popup è centrato nel layout viewport, quindi la tastiera ne copre la
  // parte bassa e l'elenco dei contatti finisce SOTTO la tastiera. Finché la tastiera è aperta lo
  // adattiamo all'area realmente visibile (visualViewport): altezza massima = area sopra la tastiera,
  // centro = centro di quell'area. Stili scritti via ref (niente re-render, niente transizioni) e
  // --vv-h esposto alle liste interne per limitarne l'altezza (vedi max-h più sotto).
  useEffect(() => {
    const el = dlgEl;
    const vv = webWindow.visualViewport;
    if (!el || !vv) return;
    const clear = () => {
      el.style.removeProperty('top');
      el.style.removeProperty('max-height');
      el.style.removeProperty('--vv-h');
      el.style.removeProperty('transition');
    };
    const apply = () => {
      const keyboardOpen = webWindow.innerHeight - vv.height > 120;
      if (keyboardOpen) {
        const h = Math.max(200, vv.height - 16);
        el.style.transition = 'none';
        el.style.top = (vv.offsetTop + vv.height / 2) + 'px';
        el.style.maxHeight = h + 'px';
        el.style.setProperty('--vv-h', h + 'px');
      } else {
        clear();
      }
    };
    apply();
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      clear();
    };
  }, [dlgEl]);

  useEffect(() => {
    if (open) {
      setSource(null);
      setSearch('');
      setSelected(new Set());
      setCopyRevenue(true);
      setSaving(false);
    }
  }, [open, target?.id]);

  // Elenco clienti: quello già in memoria della pagina; se la pagina non lo passa (es. Programmazione)
  // usa la tabella completa ['clients-all'] (stessa queryKey/queryFn di Miei Progressi), solo ad apertura.
  const hasPropClients = Array.isArray(allClients) && allClients.length > 0;
  const { data: fetchedClients = [] } = useQuery({
    queryKey: ['clients-all'],
    queryFn: () => fetchAll(base44.entities.Client, {}, { sort: '-created_date' }),
    enabled: open && !hasPropClients,
    staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE, refetchOnWindowFocus: false, retry: 0,
  });
  const clientList = hasPropClients ? allClients : fetchedClients;

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: open,
    staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0,
  });
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  // Presenze del cliente sorgente e del target (sempre fresche: servono per evitare i duplicati)
  const { data: sourceAtts = [], isLoading: loadingSource } = useQuery({
    queryKey: ['copy-att-source', source?.id],
    queryFn: () => fetchAll(base44.entities.EventAttendance, { client_id: source.id }, { sort: '-created_date' }),
    enabled: open && !!source,
    staleTime: 0, gcTime: 60000, refetchOnWindowFocus: false, retry: 0,
  });
  const { data: targetAtts = [], isLoading: loadingTarget } = useQuery({
    queryKey: ['copy-att-target', target?.id],
    queryFn: () => fetchAll(base44.entities.EventAttendance, { client_id: target.id }, { sort: '-created_date' }),
    enabled: open && !!source,
    staleTime: 0, gcTime: 60000, refetchOnWindowFocus: false, retry: 0,
  });
  const targetEventIds = useMemo(() => new Set(targetAtts.map(a => a.event_id)), [targetAtts]);

  const rows = useMemo(() => sourceAtts
    .map(att => ({ att, ev: eventsById.get(att.event_id) }))
    .filter(r => r.ev && r.ev.date)
    .sort((x, y) => y.ev.date.localeCompare(x.ev.date)),
  [sourceAtts, eventsById]);
  const selectableIds = useMemo(() => rows.filter(r => !targetEventIds.has(r.att.event_id)).map(r => r.att.id), [rows, targetEventIds]);
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => selected.has(id));

  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clientList
      .filter(c => c.id !== target?.id && (!q || (c.name || '').toLowerCase().includes(q)))
      .slice(0, 40);
  }, [clientList, search, target?.id]);

  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(selectableIds));

  const handleCopy = async () => {
    const chosen = rows.filter(r => selected.has(r.att.id) && !targetEventIds.has(r.att.event_id));
    if (chosen.length === 0 || saving) return;
    setSaving(true);
    const targetClient = getClient?.(target.id);
    let done = 0;
    try {
      for (const { att } of chosen) {
        const pid = targetClient?.promoter_id || att.promoter_id || '';
        const created = await base44.entities.EventAttendance.create({
          event_id: att.event_id,
          client_id: target.id,
          promoter_id: pid,
          revenue: copyRevenue ? (att.revenue || 0) : 0,
          new_people_brought: 0,
        });
        done++;
        // Aggiunge subito la presenza alla cache del promoter (solo se già caricata, per non creare liste parziali)
        qc.setQueryData(['attendances', pid], (old) => (Array.isArray(old) ? [...old, created] : old));
      }
      invalidateFullTables(qc);
      toast({ title: `${done} ${done === 1 ? 'presenza copiata' : 'presenze copiate'} su ${target.name}` });
      onClose();
    } catch (e) {
      invalidateFullTables(qc);
      toast({ title: 'Copia interrotta', description: `${done} presenze copiate prima dell\u2019errore. ${e?.message || ''}`, variant: 'destructive' });
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !saving) onClose(); }}>
      <DialogContent ref={setDlgEl} popup className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pr-6 leading-tight">Copia presenze su {target?.name}</DialogTitle>
          <DialogDescription>
            {source ? `Da: ${source.name}. Spunta le presenze da copiare.` : 'Scegli il cliente da cui copiare le presenze.'}
          </DialogDescription>
        </DialogHeader>

        {!source ? (
          <Div className="space-y-2">
            <Div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <HtmlInput
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca cliente..."
                className="w-full pl-8 pr-2 py-1.5 rounded-md bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Div>
            <Div className="max-h-[min(50vh,calc(var(--vv-h,100vh)_-_13rem))] overflow-y-auto space-y-1 pr-0.5">
              {candidates.length === 0 ? (
                <P className="text-xs text-muted-foreground text-center py-6">Nessun cliente trovato</P>
              ) : candidates.map(c => (
                <Btn
                  key={c.id}
                  onClick={() => { setSource(c); setSelected(new Set()); }}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border border-white/[0.06] hover:bg-secondary/40 text-left transition-colors">
                  <Span className="text-sm font-medium break-words leading-tight min-w-0 flex-1">{c.name}</Span>
                  <Span className="text-[10px] text-muted-foreground shrink-0">{c.cum_visits || 0} presenze</Span>
                </Btn>
              ))}
            </Div>
          </Div>
        ) : (
          <Div className="space-y-3">
            <Div className="flex items-center justify-between gap-2">
              <Btn
                onClick={() => { setSource(null); setSelected(new Set()); }}
                disabled={saving}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4" />Cambia cliente
              </Btn>
              {selectableIds.length > 0 && (
                <Btn
                  onClick={toggleAll}
                  disabled={saving}
                  className="text-xs font-medium text-violet-300 hover:text-violet-200">
                  {allSelected ? 'Deseleziona tutte' : 'Seleziona tutte'}
                </Btn>
              )}
            </Div>

            <Label className="flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg bg-secondary/30">
              <Span className="text-xs font-medium">Copia anche il fatturato</Span>
              <Switch checked={copyRevenue} onCheckedChange={setCopyRevenue} disabled={saving} />
            </Label>

            <Div className="max-h-[min(45vh,calc(var(--vv-h,100vh)_-_19rem))] overflow-y-auto space-y-1.5 pr-0.5">
              {(loadingSource || loadingTarget) ? (
                <Div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />Caricamento presenze…
                </Div>
              ) : rows.length === 0 ? (
                <P className="text-xs text-muted-foreground text-center py-8">{source.name} non ha presenze registrate.</P>
              ) : rows.map(({ att, ev }) => {
                const dup = targetEventIds.has(att.event_id);
                const on = selected.has(att.id);
                return (
                  <Btn
                    key={att.id}
                    disabled={dup || saving}
                    onClick={() => toggle(att.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border text-left transition-colors ${dup ? 'opacity-45 border-white/[0.04] cursor-not-allowed' : on ? 'border-violet-400/50 bg-violet-500/10' : 'border-white/[0.06] hover:bg-secondary/40'}`}>
                    <Span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${on ? 'bg-violet-500 border-violet-500' : 'border-white/30'}`}>
                      {on && <Check className="w-3 h-3 text-white" />}
                    </Span>
                    <Span className="min-w-0 flex-1">
                      <Span className="block text-xs font-medium break-words leading-tight">{ev.name}</Span>
                      <Span className="block text-[10px] text-muted-foreground">
                        {format(parseISO(ev.date), 'd MMM yyyy', { locale: it })}{ev.venue ? ` · ${ev.venue}` : ''}{dup ? ' · già presente' : ''}
                      </Span>
                    </Span>
                    <Span className="text-xs font-semibold text-primary shrink-0">€{Number(att.revenue || 0).toLocaleString('it-IT')}</Span>
                  </Btn>
                );
              })}
            </Div>

            <Btn
              onClick={handleCopy}
              disabled={selected.size === 0 || saving}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-violet-500/90 text-white hover:bg-violet-500 disabled:opacity-40 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
              {saving ? 'Copia in corso…' : selected.size > 0 ? `Copia ${selected.size} ${selected.size === 1 ? 'presenza' : 'presenze'}` : 'Seleziona le presenze'}
            </Btn>
          </Div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Controller globale del menu "Aggiungi a serata".
 * - Desktop: tasto destro su un qualsiasi elemento con [data-client-id].
 * - Mobile: pressione prolungata (0,3s) sul cliente.
 * Il menu NON si chiude allo scroll (richiesto su desktop), solo su click
 * esterno / ESC. Include la creazione rapida di una serata extra.
 */
export default function ClientSerateMenu({ upcomingDates, onAdd, onRemove, onAddCustom, onDeleteFittizia, getClient, onToggleLeader, onToggleDriver, onMarkContacted, onMarkSeminaContacted, onSetReminder, onToggleSeminaOff, plan, groups = [], onAddToGroup, onRemoveFromGroup, onCreateGroup, selectMode, onLongPressSelect, onPasteSeminaPhoto, onPasteClientPhoto, allClients = [], onConvertSemina, getSemina }) {
  const [menu, setMenu] = useState(null); // { client, x, y }
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDate, setCustomDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [closing, setClosing] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [pastingPhoto, setPastingPhoto] = useState(false);
  const [pastePhotoMsg, setPastePhotoMsg] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [copyTarget, setCopyTarget] = useState(null); // { id, name } → dialog "Copia presenze da…"
  // Dopo "Incolla foto profilo": { id, isSemina, prev } per poter annullare e ripristinare la foto precedente
  const [photoUndo, setPhotoUndo] = useState(null);
  const photoCloseTimer = useRef(null);
  const qc = useQueryClient();
  // Foto attuale di una semina letta dalla cache React Query (funziona in ogni pagina, anche senza getSemina)
  const findSeminaPhoto = (id) => {
    for (const [, data] of qc.getQueriesData({ queryKey: ['semine'] })) {
      if (Array.isArray(data)) {
        const s = data.find(x => x.id === id);
        if (s) return s.photo_url || '';
      }
    }
    return '';
  };
  const shareCardRef = useRef(null);
  const { toast } = useToast();
  const ref = useRef(null);
  const closeTimer = useRef(null);
  const groupSearchRef = useRef(null);
  // Refs per accedere ai valori più recenti dentro l'effect touch (deps []):
  // selectMode blocca il menu singolo; onLongPressSelect entra in selezione.
  const selectModeRef = useRef(!!selectMode);
  const onLongPressSelectRef = useRef(onLongPressSelect);
  // True quando il menu serate si è aperto via long-press touch (500ms).
  // Usato per distinguere un touchcancel volontario (dito alzato) da uno
  // involontario emesso da iOS quando lo scroll-lock setta overflow:hidden.
  const menuOpenedViaTouchRef = useRef(false);
  // True quando il menu sta chiudendo per entrare in selezione multipla (longTimer
  // 1s). In questo caso il cleanup del back-button effect NON deve chiamare
  // history.back() (che genererebbe un popstate intercettato da useOverlay in
  // Clienti.jsx → clearSelection → selezione spazzata via subito dopo).
  const skipHistoryBackRef = useRef(false);
  useEffect(() => { selectModeRef.current = !!selectMode; }, [selectMode]);
  useEffect(() => { onLongPressSelectRef.current = onLongPressSelect; }, [onLongPressSelect]);

  // Stato live del cliente: letto dal getter più recente a OGNI render (non
  // snapshottato all'apertura). Così, dopo aver toggolato leader/guidatore
  // (refetch della query clients), riaprendo il menu si vede subito lo stato
  // aggiornato senza dover ricaricare la pagina.
  const live = menu && !menu.client.isSemina && getClient ? getClient(menu.client.id) : undefined;
  const isLeader = !!live?.is_leader;
  const isDriver = !!live?.is_driver;

  // Posizione in classifica: usa DIRETTAMENTE l'ordine di allClients (già
  // ordinato dal parent con lo stesso sortBy della lista). Niente ri-sort qui:
  // se riordinassimo per cum_rating la posizione non matcherebbe la lista quando
  // è ordinata per presenze/spesa/ecc. Il parent (Clienti.jsx) passa sortedAllClients.
  const clientRank = useMemo(() => {
    if (!live || !allClients || allClients.length === 0) return null;
    const idx = allClients.findIndex(c => c.id === live.id);
    return idx >= 0 ? idx + 1 : null;
  }, [live, allClients]);

  // Serate in cui il cliente è già inserito (per il tasto "Sposta")
  const clientSerateDates = menu ? upcomingDates
    .filter(d => plan?.[d.dateStr]?.clients?.some(c => c.id === menu.client.id))
    .map(d => d.dateStr) : [];
  const clientInAnySerata = clientSerateDates.length > 0;

  // Sposta: rimuove il cliente da tutte le serate in cui è già inserito
  // e lo aggiunge alla serata target.
  const handleMoveToSerata = (targetDate) => {
    if (!menu) return;
    clientSerateDates.forEach(dateStr => onRemove?.(menu.client, dateStr));
    onAdd?.(menu.client, targetDate);
    closeMenu();
  };

  // Ruba il focus alla ricerca della pagina sottostante quando si apre la
  // vista "Aggiungi a gruppo": senza questo, l'input della pagina clienti
  // resta focalizzato e i tasti finiscono lì invece che nel campo del menu.
  useEffect(() => {
    if (groupOpen) groupSearchRef.current?.focus();
  }, [groupOpen]);

  // Chiude con animazione di uscita: mantiene il DOM montato durante la
  // transizione (140ms) prima di smontare davvero, così l'exit non è netto.
  const closeMenu = () => {
    if (closing || !menu) return;
    setClosing(true);
    clearTimeout(photoCloseTimer.current);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setMenu(null);
      setClosing(false);
      setPastePhotoMsg(null);
      setPastingPhoto(false);
      setPhotoUndo(null);
    }, 140);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openMenu = (el, x, y) => {
    const id = el.getAttribute('data-client-id');
    if (!id) return;
    const name = el.getAttribute('data-client-name') || '';
    const isSemina = el.getAttribute('data-semina') === '1';
    const igHandle = el.getAttribute('data-ig') || '';
    const phone = el.getAttribute('data-phone') || '';
    const isOff = el.getAttribute('data-is-off') === '1';
    // Non snapshottiamo isLeader/isDriver/live: li leggiamo live a ogni render
    // dal getter aggiornato, così il menu riflette subito le modifiche esterne.
    setMenu({ client: { id, name, isSemina, igHandle, is_off: isOff, phone }, x, y });
    setCustomOpen(false);
    setCustomName('');
    setCustomDate(format(new Date(), 'yyyy-MM-dd'));
    setGroupOpen(false);
    setGroupSearch('');
    setCreateMode(false);
    setNewGroupName('');
  };

  // Filtra i gruppi per nome gruppo o nome membro (ricerca live).
  const filteredGroups = (groups || []).filter(g => {
    if (!groupSearch.trim()) return true;
    const q = groupSearch.toLowerCase();
    if (g.name?.toLowerCase().includes(q)) return true;
    return (g.client_ids || []).some(cid => {
      const c = getClient?.(cid);
      return c?.name?.toLowerCase().includes(q);
    });
  }).sort((a, b) => {
    // Se non c'è ricerca attiva, porta in cima i gruppi di cui il cliente fa
    // già parte, così al tasto destro vede subito il suo gruppo come primo.
    if (groupSearch.trim()) return 0;
    const cid = live?.id || menu?.client.id;
    if (!cid) return 0;
    const aMember = (a.client_ids || []).includes(cid) ? 0 : 1;
    const bMember = (b.client_ids || []).includes(cid) ? 0 : 1;
    return aMember - bMember;
  });

  const handleToggleGroup = (group) => {
    const liveClient = live || menu.client;
    const ids = group.client_ids || [];
    if (ids.includes(liveClient.id)) {
      if (!onRemoveFromGroup) return; // già membro, rimozione non abilitata
      onRemoveFromGroup(group, liveClient);
    } else {
      onAddToGroup?.(group, liveClient);
    }
    closeMenu();
  };

  const submitCreateGroup = () => {
    if (!newGroupName.trim() || !onCreateGroup) return;
    onCreateGroup(newGroupName.trim(), live || menu.client);
    closeMenu();
  };

  // Esegue un'azione sul cliente poi chiude il menu con l'animazione di uscita.
  const runAction = (fn) => {
    if (!menu) return;
    fn?.(live || menu.client);
    closeMenu();
  };

  // Condivisione scheda cliente: renderizza la card nascosta, la cattura con
  // html2canvas e apre il share sheet nativo (navigator.share) con l'immagine.
  // Fallback: share testuale o download se il browser non supporta i file.
  const handleShareClient = async () => {
    if (!live) return;
    setSharing(true);
    // Attendi che ClientShareCard sia montata (render condizionato a sharing)
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!shareCardRef.current) { setSharing(false); return; }
    try {
      // Attendi che tutte le immagini della card (foto profilo, logo Vibra,
      // logo locale) siano caricate prima del capture html2canvas.
      const imgs = [...(shareCardRef.current?.querySelectorAll('img') || [])];
      await Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 2500);
        });
      }));
      await new Promise(r => setTimeout(r, 100));

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('capture failed');

      const fileName = `${(live.name || 'cliente').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (webNavigator.canShare && webNavigator.canShare({ files: [file] })) {
        // Mobile: share sheet nativo (WhatsApp, Telegram, ecc.)
        await webNavigator.share({
          files: [file],
          title: live.name || 'Cliente',
          text: `Scheda di ${live.name}`,
        });
      } else {
        // Desktop: copia l'immagine negli appunti
        let copied = false;
        try {
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await webNavigator.clipboard.write([clipboardItem]);
          copied = true;
        } catch (e) {
          // Fallback: download
          const url = URL.createObjectURL(blob);
          const a = webDocument.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
        toast({
          title: copied ? 'Scheda copiata negli appunti' : 'Scheda scaricata',
          description: copied ? 'Incollala dove vuoi (Ctrl+V)' : undefined,
        });
      }
    } catch (e) {
      if (e?.name !== 'AbortError') {
        try {
          if (webNavigator.share) {
            await webNavigator.share({ title: live?.name || 'Cliente', text: formatShareText(live) });
          }
        } catch {}
      }
    } finally {
      setSharing(false);
      closeMenu();
    }
  };

  // Condivisione scheda semina: renderizza la card nascosta, la cattura con
  // html2canvas e apre il share sheet nativo (navigator.share) con l'immagine.
  const handleShareSemina = async () => {
    if (!menu) return;
    const semina = getSemina?.(menu.client.id);
    if (!semina) return;
    setSharing(true);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!shareCardRef.current) { setSharing(false); return; }
    try {
      const imgs = [...(shareCardRef.current?.querySelectorAll('img') || [])];
      await Promise.all(imgs.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 2500);
        });
      }));
      await new Promise(r => setTimeout(r, 100));

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('capture failed');

      const fileName = `${(semina.name || 'semina').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (webNavigator.canShare && webNavigator.canShare({ files: [file] })) {
        await webNavigator.share({
          files: [file],
          title: semina.name || 'Semina',
          text: `Scheda di ${semina.name}`,
        });
      } else {
        let copied = false;
        try {
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await webNavigator.clipboard.write([clipboardItem]);
          copied = true;
        } catch (e) {
          const url = URL.createObjectURL(blob);
          const a = webDocument.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
        toast({
          title: copied ? 'Scheda copiata negli appunti' : 'Scheda scaricata',
          description: copied ? 'Incollala dove vuoi (Ctrl+V)' : undefined,
        });
      }
    } catch (e) {
      if (e?.name !== 'AbortError') {
        try {
          if (webNavigator.share) {
            await webNavigator.share({ title: semina?.name || 'Semina', text: `Scheda di ${semina?.name}` });
          }
        } catch {}
      }
    } finally {
      setSharing(false);
      closeMenu();
    }
  };

  // Semina: legge gli appunti. Prima cerca un'IMMAGINE (come il Ctrl+V interno
  // alla modifica card: navigator.clipboard.read() → blob → UploadFile), poi
  // fallback a URL di testo se negli appunti c'è un link immagine.
  const handlePastePhoto = async () => {
    if (!menu) return;
    // Foto attuale (prima dell'incolla): serve per "Annulla caricamento"
    const prevPhoto = menu.client.isSemina
      ? (getSemina?.(menu.client.id)?.photo_url ?? findSeminaPhoto(menu.client.id))
      : (getClient?.(menu.client.id)?.photo_url || '');
    const finishPasteSuccess = () => {
      setPhotoUndo({ id: menu.client.id, isSemina: !!menu.client.isSemina, prev: prevPhoto || '' });
      setPastePhotoMsg({ type: 'success', text: 'Foto profilo aggiornata' });
      setPastingPhoto(false);
      // Il menu resta aperto qualche secondo per dare il tempo di annullare
      clearTimeout(photoCloseTimer.current);
      photoCloseTimer.current = setTimeout(() => closeMenu(), 6000);
    };
    setPastingPhoto(true);
    setPastePhotoMsg(null);
    try {
      // 1. Tenta la lettura di un'immagine dagli appunti (Chrome/Edge)
      let imageBlob = null;
      if (webNavigator.clipboard && webNavigator.clipboard.read) {
        try {
          const items = await webNavigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find(t => t.startsWith('image/'));
            if (imageType) { imageBlob = await item.getType(imageType); break; }
          }
        } catch { /* permesso negato o nessuna immagine → fallback URL */ }
      }
      if (imageBlob) {
        const ext = (imageBlob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
        const file = new File([imageBlob], `semina-profile.${ext}`, { type: imageBlob.type });
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        // Fire-and-forget: l'entity update è ottimistico (cache aggiornata
        // istantaneamente dal callback), non bloccare l'UI aspettando la API.
        if (menu.client.isSemina) onPasteSeminaPhoto(menu.client.id, file_url);
        else onPasteClientPhoto?.(menu.client.id, file_url);
        finishPasteSuccess();
        return;
      }
      // 2. Fallback: URL di testo negli appunti
      const text = await webNavigator.clipboard.readText();
      if (!text || !text.trim()) {
        setPastePhotoMsg({ type: 'error', text: 'Appunti vuoti — copia un\u2019immagine o un URL' });
        setPastingPhoto(false);
        setTimeout(() => setPastePhotoMsg(null), 3000);
        return;
      }
      const url = text.trim();
      if (!/^https?:\/\/.+/i.test(url)) {
        setPastePhotoMsg({ type: 'error', text: 'Nessun URL negli appunti — copia il link di un\u2019immagine' });
        setPastingPhoto(false);
        setTimeout(() => setPastePhotoMsg(null), 3000);
        return;
      }
      if (menu.client.isSemina) onPasteSeminaPhoto(menu.client.id, url);
      else onPasteClientPhoto?.(menu.client.id, url);
      finishPasteSuccess();
    } catch (err) {
      setPastePhotoMsg({
        type: 'error',
        text: err?.name === 'NotAllowedError' ? 'Permesso appunti negato' : 'Impossibile leggere gli appunti',
      });
      setPastingPhoto(false);
      setTimeout(() => setPastePhotoMsg(null), 3000);
    }
  };

  // Annulla l'ultimo incolla foto: ripristina la foto precedente (o nessuna, se non c'era).
  const handleUndoPhoto = () => {
    if (!photoUndo) return;
    clearTimeout(photoCloseTimer.current);
    if (photoUndo.isSemina) onPasteSeminaPhoto?.(photoUndo.id, photoUndo.prev);
    else onPasteClientPhoto?.(photoUndo.id, photoUndo.prev);
    setPhotoUndo(null);
    setPastePhotoMsg({ type: 'success', text: 'Foto precedente ripristinata' });
    photoCloseTimer.current = setTimeout(() => closeMenu(), 900);
  };

  // Al rilascio del dito dopo il long-press, il browser emette un click sul
  // bottone che si trova sotto il dito (ora nel menu appena aperto). Lo
  // ignoriamo per i primi 450ms: l'utente deve rialzare il dito e premere
  // volontariamente l'azione che vuole eseguire.
  const guarded = (fn) => () => {
    if (Date.now() - touchOpenedRef.current < 450) return;
    fn();
  };

  // "Contatta": apre la chat WhatsApp del cliente (wa.me) e lo segna come
  // contattato (last_contacted_at), così la lista "da ricontattare" si aggiorna.
  const openWhatsApp = () => {
    if (!menu) return;
    const phone = (live?.phone || menu.client.phone || '').replace(/[^\d]/g, '');
    if (phone) webWindow.open(`https://wa.me/${phone}`, '_blank');
    if (menu.client.isSemina) {
      onMarkSeminaContacted?.(menu.client);
    } else {
      onMarkContacted?.(live || menu.client);
    }
    closeMenu();
  };

  // Desktop: tasto destro → contextmenu nativo.
  // Mobile (iOS/Android): pressione prolungata manuale via touch. Su iOS il
  // contextmenu nativo non è affidabile quando callout/selezione sono spenti,
  // quindi gestiamo il long-press noi (500ms, niente spostamento > 10px).
  // Le card disabilitano -webkit-touch-callout (no "Cerca su Safari"/Look Up)
  // e la selezione testo, così il menu di sistema non compare durante l'attesa.
  const touchOpenedRef = useRef(0);
  useEffect(() => {
    let timer = null;
    let longTimer = null;
    let startX = 0, startY = 0;
    const clear = () => { if (timer) { clearTimeout(timer); timer = null; } if (longTimer) { clearTimeout(longTimer); longTimer = null; } };

    const onCtx = (e) => {
      const clientEl = e.target.closest && e.target.closest('[data-client-id]');
      const promoterEl = e.target.closest && e.target.closest('[data-promoter-id]');
      // Su promoter: lascia che il PromoterContextMenu gestisca il suo menu
      if (promoterEl && !clientEl) return;
      if (clientEl) {
        // Cancel the native menu even when the custom menu is already open.
        e.preventDefault();
        if (Date.now() - touchOpenedRef.current < 800) return;
        openMenu(clientEl, e.clientX, e.clientY);
        return;
      }
      // Non bloccare su input/textarea/link (copy/paste, apri link)
      if (e.target.closest('input, textarea, a[href], [contenteditable]')) return;
      // Su tutto il resto dell'app: previeni il menu contestuale nativo del
      // browser (e il feedback aptico associato su Android/iOS). Il long-press
      // custom esiste solo su clienti e promoter — altrove non serve.
      e.preventDefault();
    };

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const el = t.target.closest && t.target.closest('[data-client-id]');
      if (!el) return;
      // Post-scroll: se il dito è ancora giù dopo uno scroll e iOS emette un
      // nuovo touchstart, ignoralo — non è un tocco volontario. Soglia a 150ms
      // (non 300): abbastanza per catturare il touchstart spurio iOS post-scroll
      // (che avviene entro pochi ms), ma non blocca long-press legittimi.
      if (wasRecentScroll(150)) return;
      // In modalità selezione multipla non aprire il menu singolo: i tap
      // selezionano/deselezionano (gestito dall'onClick della riga).
      if (selectModeRef.current) return;
      // Le semine NON supportano la selezione multipla: solo il menu serate (500ms).
      const isSemina = el.getAttribute('data-semina') === '1';
      startX = t.clientX; startY = t.clientY;
      // Snapshot della posizione dell'elemento al touchstart. Su iOS lo scroll
      // nativo coalescesce i touchmove (non arrivano al JS), quindi il threshold
      // di 10px in onTouchMove può non scattare. Verifichiamo qui se l'elemento
      // si è spostato (page scroll o container scroll) quando il timer fires.
      const startRect = el.getBoundingClientRect();
      const hasScrolled = () => {
        const r = el.getBoundingClientRect();
        return Math.abs(r.top - startRect.top) > 2 || Math.abs(r.left - startRect.left) > 2;
      };
      clear();
      timer = setTimeout(() => {
        if (hasScrolled()) { clear(); return; }
        timer = null;
        touchOpenedRef.current = Date.now();
        menuOpenedViaTouchRef.current = true;
        openMenu(el, startX, startY);
      }, 500);
      // Long-press prolungato (1s): entra in modalità selezione multipla e
      // seleziona il cliente. Solo per clienti reali (non semine).
      if (!isSemina) {
        longTimer = setTimeout(() => {
          if (hasScrolled()) { clear(); return; }
          clear();
          menuOpenedViaTouchRef.current = false;
          // Segnala al cleanup del back-button effect di NON fare history.back():
          // il popstate risultante verrebbe intercettato da useOverlay in
          // Clienti.jsx che chiamerebbe clearSelection(), azzerando la selezione
          // appena attivata. Il sentinel viene rimosso silenziosamente con
          // replaceState (non genera popstate).
          skipHistoryBackRef.current = true;
          setMenu(null);
          setClosing(false);
          // Imposta touchOpenedRef così l'onClickGuard blocca il click spurio
          // che iOS emette al rilascio dopo la pressione prolungata: senza
          // questo, il click passerebbe all'onClick della riga che toggola
          // via il primo cliente appena selezionato (bug: prima selezione
          // non si illuminava).
          touchOpenedRef.current = Date.now();
          selectModeRef.current = true;
          const id = el.getAttribute('data-client-id');
          const name = el.getAttribute('data-client-name') || '';
          if (id) {
            onLongPressSelectRef.current?.({ id, name });
          }
        }, 1000);
      }
    };

    const onTouchMove = (e) => {
      if (!timer && !longTimer) return;
      const t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) clear();
    };

    // Scroll (anche momentum): cancella il long-press. Su iOS i touchmove possono
    // essere coalesced durante lo scroll nativo e non arrivare in tempo per
    // cancellare il timer. Lo scroll event (capture: true per intercettare
    // anche i container scrollabili interni) è affidabile e fires non appena
    // il browser inizia a scorrere, anche se il dito è fermo a fine scroll.
    const onScroll = () => {
      if (timer || longTimer) clear();
    };
    webWindow.addEventListener('scroll', onScroll, { passive: true, capture: true });

    // Blocca il click che iOS emette al rilascio dopo la pressione prolungata,
    // per non aprire anche il dettaglio cliente sopra il menu serate. Scope:
    // solo click sulla card, mai sui bottoni del menu (che sono in portal).
    const onClickGuard = (e) => {
      if (Date.now() - touchOpenedRef.current > 600) return;
      // Blocca il click spurio che iOS emette al rilascio dopo una pressione
      // prolungata (menu serate o attivazione selezione multipla). Senza questo,
      // il click passerebbe all'onClick della riga: nel caso della selezione
      // multipla, toggolerebbe via il primo cliente appena selezionato.
      if (e.target.closest && e.target.closest('[data-client-id]')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    webDocument.addEventListener('contextmenu', onCtx);
    webDocument.addEventListener('touchstart', onTouchStart, { passive: true });
    webDocument.addEventListener('touchmove', onTouchMove, { passive: true });
    // touchend = dito alzato volontariamente: cancella entrambi i timer.
    // touchcancel = evento di sistema (iOS emette touchcancel quando lo
    // scroll-lock setta overflow:hidden su html a 500ms): NON cancellare il
    // longTimer se il menu si è appena aperto via touch, altrimenti il
    // long-press prolungato a 1s per la selezione multipla non parte mai.
    const onTouchEnd = () => { menuOpenedViaTouchRef.current = false; clear(); };
    const onTouchCancel = () => {
      if (menuOpenedViaTouchRef.current) return;
      clear();
    };
    webDocument.addEventListener('touchend', onTouchEnd, { passive: true });
    webDocument.addEventListener('touchcancel', onTouchCancel, { passive: true });
    webDocument.addEventListener('click', onClickGuard, true);
    return () => {
      clear();
      webWindow.removeEventListener('scroll', onScroll, { capture: true });
      webDocument.removeEventListener('contextmenu', onCtx);
      webDocument.removeEventListener('touchstart', onTouchStart);
      webDocument.removeEventListener('touchmove', onTouchMove);
      webDocument.removeEventListener('touchend', onTouchEnd);
      webDocument.removeEventListener('touchcancel', onTouchCancel);
      webDocument.removeEventListener('click', onClickGuard, true);
    };
  }, []);

  // Chiusura: ESC (il tocco esterno è gestito dal backdrop in overlay).
  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    webWindow.addEventListener('keydown', onKey);
    return () => webWindow.removeEventListener('keydown', onKey);
  }, [menu, closing]);

  // Tasto back (Android/browser): chiude il menu long-press invece di uscire
  // dall'app. Pusha uno stato sentinel ({ clientSerateMenu }) all'apertura; il
  // popstate lo chiude. Al cleanup (chiusura via backdrop/ESC/azione) rimuove il
  // sentinel con history.back() se è ancora in cima. Pattern identico al cerca
  // in app (VibraSearch): non interferisce con i dialog della pagina perché il
  // loro popstate ignora uno stato che non sia il loro sentinel.
  useEffect(() => {
    if (!menu) return;
    if (!(webWindow.history.state && webWindow.history.state.clientSerateMenu)) {
      webWindow.history.pushState({ clientSerateMenu: true }, '');
    }
    const onPop = () => {
      // Il sentinel del menu è ancora in cima: il popstate ha chiuso altro, ignoriamo.
      if (webWindow.history.state?.clientSerateMenu) return;
      closeMenu();
    };
    webWindow.addEventListener('popstate', onPop);
    return () => {
      webWindow.removeEventListener('popstate', onPop);
      if (webWindow.history.state?.clientSerateMenu) {
        if (skipHistoryBackRef.current) {
          // Chiusura per entrare in selezione multipla: rimuove il sentinel
          // silenziosamente (replaceState non genera popstate) invece di
          // history.back() che spazzerebbe via la selezione appena attivata.
          skipHistoryBackRef.current = false;
          webWindow.history.replaceState({}, '');
        } else {
          webWindow.history.back();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  // Scroll lock ref-counted + flag menu aperto (per ESC handler dell'hub).
  useEffect(() => {
    if (!menu) return;
    const unlock = lockScroll();
    webDocument.body.dataset.clientSerateMenu = '1';
    return () => {
      unlock();
      delete webDocument.body.dataset.clientSerateMenu;
    };
  }, [menu]);

  const w = 248;
  const visibleDates = Math.min(upcomingDates.length, 3);
  const h = menu ? (groupOpen
    ? (createMode
        ? Math.min(190, 560)
        : Math.min(136 + Math.min(Math.max(filteredGroups.length, 1), 7) * 44 + 16, 560))
    : Math.min(
        visibleDates * 42 + (onToggleLeader && !menu.client.isSemina ? 318 : 120) + (customOpen ? 60 : 0) + (onSetReminder && onToggleLeader && !menu.client.isSemina ? 42 : 0),
        560
      )) : 0;
  const x = menu ? Math.max(8, Math.min(menu.x, webWindow.innerWidth - w - 8)) : 0;
  const y = menu ? Math.max(8, Math.min(menu.y, webWindow.innerHeight - h - 8)) : 0;
  // Origine trasformazione = punto di tocco rispetto al popup (scale-in dal tap).
  const ox = menu ? Math.max(0, Math.min(menu.x - x, w)) : 0;
  const oy = menu ? Math.max(0, Math.min(menu.y - y, h)) : 0;

  const submitCustom = () => {
    if (!customName.trim() || !customDate) return;
    onAddCustom?.(menu.client, customName.trim(), customDate);
    closeMenu();
  };

  return createPortal(
    <>
      <CopyAttendancesDialog target={copyTarget} onClose={() => setCopyTarget(null)} allClients={allClients} getClient={getClient} />
      {/* Preload persistente: loghi locali sempre nel DOM così non flashano
          ad ogni apertura del menu (l'immagine decodificata resta in cache). */}
      <Div className="fixed pointer-events-none opacity-0 size-0 overflow-hidden">
        {upcomingDates.map(d => d.logoUrl ? <CachedImage key={d.dateStr + d.logoUrl} src={d.logoUrl} loading="eager" decoding="async" alt="" /> : null)}
      </Div>
      {/* Scheda cliente per la condivisione: montata SOLO durante lo share
          (non ad ogni apertura di menu) per evitare che useQuery/errore
          crashi il ClientSerateMenu e rimuova i touch handler del long-press */}
      {sharing && menu && !menu.client.isSemina && live && (
        <Div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }}>
          <ClientShareCard client={live} cardRef={shareCardRef} rank={clientRank} />
        </Div>
      )}
      {sharing && menu && menu.client.isSemina && getSemina && (() => {
        const s = getSemina(menu.client.id);
        return s ? (
          <Div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }}>
            <SeminaShareCard semina={s} cardRef={shareCardRef} />
          </Div>
        ) : null;
      })()}
      {menu && (
      <>
      {/* Backdrop: blocca il tocco sull'UI sottostante e chiude al primo tap esterno */}
      <Btn
        className={`fixed inset-0 z-[10000] bg-black/30 ${closing ? 'backdrop-fade-out' : 'backdrop-fade-in'}`}
        style={{ touchAction: 'none' }}
        onClick={(e) => e.stopPropagation()} />
      <Btn
        ref={ref}
        className={`fixed z-[10001] w-[248px] rounded-xl border border-white/10 bg-popover shadow-2xl overflow-y-auto overflow-x-hidden ${closing ? 'menu-pop-out' : 'menu-pop-in'}`}
        style={{ left: x, top: y, maxHeight: webWindow.innerHeight - y - 8, transformOrigin: `${ox}px ${oy}px` }}
        onClick={(e) => e.stopPropagation()}>
      <Div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-secondary/40">
        <P className="text-[11px] font-semibold text-foreground truncate">
          {menu.client.name ? `Aggiungi ${menu.client.name}` : 'Aggiungi a serata'}
        </P>
        <Btn onClick={closeMenu} className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="w-3.5 h-3.5" />
        </Btn>
      </Div>

      {!groupOpen ? (<>
      <Div className="max-h-36 overflow-y-auto recontact-scrollbar py-1">
        {upcomingDates.map(d => {
          const isAdded = plan?.[d.dateStr]?.clients?.some(c => c.id === menu.client.id);
          const canMove = clientInAnySerata && !isAdded;
          return (
            <Div
              key={d.dateStr}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/60 transition-colors"
            >
              <Btn
                onClick={guarded(() => {
                  const root = webDocument.querySelector('[data-prospetto-root]');
                  const prospettoBottom = root ? root.getBoundingClientRect().bottom + webWindow.scrollY : 0;
                  const prevY = webWindow.scrollY;
                  const prevH = webDocument.documentElement.scrollHeight;
                  const below = prevY >= prospettoBottom - 24;
                  if (isAdded) onRemove?.(menu.client, d.dateStr);
                  else onAdd?.(menu.client, d);
                  closeMenu();
                  requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (!below) return;
                    const delta = webDocument.documentElement.scrollHeight - prevH;
                    if (delta !== 0) webWindow.scrollTo(0, prevY + delta);
                  }));
                })}
                className="flex items-center gap-2 min-w-0 flex-1 text-left"
              >
                {d.logoUrl
                  ? <CachedImage src={d.logoUrl} alt="" decoding="sync" className="w-4 h-4 rounded object-contain shrink-0 bg-secondary/40" />
                  : <CalendarPlus className="w-4 h-4 text-blue-400 shrink-0" />}
                <Div className="min-w-0 flex-1">
                  <P className="text-xs font-medium truncate">{d.dayLabel}{d.venueName ? ` · ${d.venueName}` : ''}</P>
                  <P className="text-[10px] text-muted-foreground">{format(d.dateObj, 'd MMM yyyy', { locale: it })}</P>
                </Div>
              </Btn>
              {isAdded && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              {canMove && (
                <Btn
                  onClick={guarded(() => handleMoveToSerata(d))}
                  className="flex items-center gap-1 text-[10px] font-semibold text-violet-300 hover:text-violet-200 shrink-0 px-1.5 py-0.5 rounded bg-violet-500/15 hover:bg-violet-500/25 transition-colors"
                  accessibilityLabel="Sposta qui"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  Sposta
                </Btn>
              )}
              {onDeleteFittizia && d.dow === null && (
                <Span
                  onPress={(e) => { e.preventDefault(); e.stopPropagation(); if (Date.now() - touchOpenedRef.current < 450) return; onDeleteFittizia(d.id); }}
                  className="text-muted-foreground hover:text-destructive shrink-0 ml-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </Span>
              )}
            </Div>
          );
        })}
      </Div>

      <Div className="border-t border-border/40">
        {!customOpen ? (
          <Btn
            onClick={guarded(() => setCustomOpen(true))}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-secondary/60 transition-colors text-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <Span className="text-xs font-medium">Crea nuova serata extra</Span>
          </Btn>
        ) : (
          <Div className="px-3 py-2.5 space-y-2">
            <HtmlInput
              autoFocus
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="Nome serata (es. Capodanno)"
              className="w-full px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <HtmlInput
              type="date"
              value={customDate}
              onChange={e => setCustomDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <Div className="flex gap-2">
              <Btn onClick={() => setCustomOpen(false)} className="flex-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">Annulla</Btn>
              <Btn
                onClick={submitCustom}
                disabled={!customName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/90 text-black disabled:opacity-40 hover:bg-amber-500"
              >
                <Plus className="w-3 h-3" />Aggiungi
              </Btn>
            </Div>
          </Div>
        )}
      </Div>

      {/* Incolla foto profilo dagli appunti (immagine o URL) — semina e clienti */}
      {((menu.client.isSemina && onPasteSeminaPhoto) || (!menu.client.isSemina && onPasteClientPhoto)) && (
        <Div className="border-t border-border/40">
          {pastePhotoMsg ? (
            <Div className={`px-3 py-2.5 text-xs font-medium ${pastePhotoMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              <Div className="flex items-center gap-2">
                {pastePhotoMsg.type === 'success'
                  ? <Check className="w-3.5 h-3.5 shrink-0" />
                  : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                <Span className="truncate">{pastePhotoMsg.text}</Span>
              </Div>
              {pastePhotoMsg.type === 'success' && photoUndo && (
                <Btn
                  onClick={handleUndoPhoto}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />Annulla caricamento
                </Btn>
              )}
            </Div>
          ) : (
            <Btn
              onClick={guarded(handlePastePhoto)}
              disabled={pastingPhoto}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-secondary/60 transition-colors text-pink-400 disabled:opacity-50"
            >
              {pastingPhoto
                ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                : <ImageIcon className="w-3.5 h-3.5 shrink-0" />}
              <Span className="text-xs font-medium">{pastingPhoto ? 'Caricamento…' : 'Incolla foto profilo'}</Span>
            </Btn>
          )}
        </Div>
      )}

      {/* Shortcut sul cliente — separati dalla sezione serate da un divisore,
          stile menu contestuale Windows. Solo per clienti reali (non semine). */}
      {onToggleLeader && !menu.client.isSemina && (
        <Div className="border-t border-border/40">
          <Btn
            onClick={guarded(() => runAction(onToggleLeader))}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
          >
            {isLeader
              ? <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
              : <Star className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
            <Span className="text-xs font-medium">{isLeader ? 'Rimuovi leader' : 'Rendi leader'}</Span>
          </Btn>
          <Btn
            onClick={guarded(() => runAction(onToggleDriver))}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
          >
            <Car className={`w-3.5 h-3.5 shrink-0 ${isDriver ? 'text-sky-400' : 'text-muted-foreground'}`} />
            <Span className="text-xs font-medium">{isDriver ? 'Rimuovi guidatore' : 'Rendi guidatore'}</Span>
          </Btn>
          <Btn
            onClick={guarded(openWhatsApp)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <Span className="text-xs font-medium">{live?.phone ? 'Contatta' : 'Contatta (senza telefono)'}</Span>
          </Btn>
          {onSetReminder && (
            <Btn
              onClick={guarded(() => runAction(onSetReminder))}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <Span className="text-xs font-medium">Ricordami di ricontattarlo</Span>
            </Btn>
          )}
          <Btn
            onClick={guarded(() => setGroupOpen(true))}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <Span className="text-xs font-medium">Aggiungi a gruppo</Span>
          </Btn>
          <Btn
            onClick={guarded(() => {
              const t = live || menu.client;
              closeMenu();
              // Apre il dialog dopo la chiusura animata del menu (evita conflitti col tasto indietro)
              setTimeout(() => setCopyTarget({ id: t.id, name: t.name }), 220);
            })}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <Span className="text-xs font-medium">Copia presenze da…</Span>
          </Btn>
          <Btn
            onClick={guarded(handleShareClient)}
            disabled={sharing}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors disabled:opacity-50"
          >
            {sharing
              ? <Loader2 className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-spin" />
              : <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
            <Span className="text-xs font-medium">{sharing ? 'Preparazione…' : 'Condividi su…'}</Span>
          </Btn>
          {onLongPressSelect && (
            <Btn
              onClick={guarded(() => {
                onLongPressSelectRef.current?.(menu.client);
                closeMenu();
              })}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <Span className="text-xs font-medium">Selezione multipla</Span>
            </Btn>
          )}
        </Div>
      )}

      {/* Shortcut per semine — converti in cliente + contatta WhatsApp + promemaria ricontatto + spegni/riattiva */}
      {menu.client.isSemina && (onConvertSemina || onMarkSeminaContacted || onSetReminder || onToggleSeminaOff) && (
        <Div className="border-t border-border/40">
          {onConvertSemina && (
            <Btn
              onClick={guarded(() => { onConvertSemina(menu.client.id); closeMenu(); })}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left bg-gradient-to-r from-violet-500/15 to-amber-500/10 hover:from-violet-500/25 hover:to-amber-500/20 transition-colors border-b border-border/40"
            >
              <UserPlus className="w-3.5 h-3.5 text-violet-300 shrink-0" />
              <Span className="text-xs font-semibold text-violet-100">Converti in cliente</Span>
            </Btn>
          )}
          {onMarkSeminaContacted && (
            <Btn
              onClick={guarded(openWhatsApp)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <Span className="text-xs font-medium">{menu.client.phone ? 'Contatta' : 'Contatta (senza telefono)'}</Span>
            </Btn>
          )}
          {onSetReminder && (
            <Btn
              onClick={guarded(() => runAction(onSetReminder))}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <Span className="text-xs font-medium">Ricordami di ricontattarlo</Span>
            </Btn>
          )}
          {onToggleSeminaOff && (
            <Btn
              onClick={guarded(() => runAction(onToggleSeminaOff))}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
            >
              <Power className={`w-3.5 h-3.5 shrink-0 ${menu.client.is_off ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <Span className="text-xs font-medium">{menu.client.is_off ? 'Riattiva semina' : 'Spegni semina'}</Span>
            </Btn>
          )}
          {getSemina && (
            <Btn
              onClick={guarded(handleShareSemina)}
              disabled={sharing}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors disabled:opacity-50"
            >
              {sharing
                ? <Loader2 className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-spin" />
                : <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              <Span className="text-xs font-medium">{sharing ? 'Preparazione…' : 'Condividi su…'}</Span>
            </Btn>
          )}
        </Div>
      )}
      </>) : (
        <Div className="flex flex-col">
          <Div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-secondary/40">
            <Btn onClick={() => setGroupOpen(false)} className="text-muted-foreground hover:text-foreground shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </Btn>
            <P className="text-[11px] font-semibold text-foreground">Aggiungi a gruppo</P>
          </Div>
          <Div className="p-2 space-y-2">
            <Div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <HtmlInput
                ref={groupSearchRef}
                value={groupSearch}
                onChange={e => setGroupSearch(e.target.value)}
                placeholder="Cerca gruppo o membro..."
                className="w-full pl-7 pr-2 py-1.5 rounded-md bg-secondary/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </Div>
            {onCreateGroup && !createMode && (
              <Btn
                onClick={guarded(() => { setCreateMode(true); setGroupSearch(''); })}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 transition-colors text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />Crea nuovo gruppo
              </Btn>
            )}
            {createMode && (
              <Div className="space-y-2">
                <HtmlInput
                  autoFocus
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Nome nuovo gruppo..."
                  className="w-full px-2.5 py-1.5 rounded-md bg-secondary/40 border border-violet-500/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-400" />
                <Div className="flex gap-2">
                  <Btn onClick={() => { setCreateMode(false); setNewGroupName(''); }} className="flex-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground">Annulla</Btn>
                  <Btn
                    onClick={guarded(submitCreateGroup)}
                    disabled={!newGroupName.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold bg-violet-500/90 text-white disabled:opacity-40 hover:bg-violet-500"
                  >
                    <Plus className="w-3 h-3" />Crea e aggiungi
                  </Btn>
                </Div>
              </Div>
            )}
          </Div>
          {!createMode && (
          <Div className="max-h-64 overflow-y-auto recontact-scrollbar pb-1">
            {groups.length === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-6 px-2">
                Nessun gruppo. Creane uno qui sopra.
              </P>
            ) : filteredGroups.length === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-6 px-2">Nessun risultato</P>
            ) : filteredGroups.map(g => {
              const liveClient = live || menu.client;
              const isMember = (g.client_ids || []).includes(liveClient.id);
              const memberCount = (g.client_ids || []).length;
              return (
                <Btn
                  key={g.id}
                  onClick={guarded(() => handleToggleGroup(g))}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-secondary/60 transition-colors"
                >
                  <Div className="min-w-0 flex-1">
                    <P className="text-xs font-medium truncate">{g.name}</P>
                    <P className="text-[10px] text-muted-foreground">{memberCount} membri</P>
                  </Div>
                  {isMember ? (
                    <Span className="flex items-center gap-1 text-[10px] text-red-400 shrink-0">
                      <UserMinus className="w-3.5 h-3.5" />Rimuovi
                    </Span>
                  ) : (
                    <UserPlus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  )}
                </Btn>
              );
            })}
          </Div>
          )}
        </Div>
      )}
    </Btn>
    </>
    )}
    </>,
    webDocument.body
  );
}