// Port di src/components/impostazioni/SettingsNotifiche.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useMemo, useEffect } from 'react';import { base44 } from '@/lib/base44';
import { RichEditor } from '@/ui/richEditor';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow, format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Send, CheckCircle2, Loader2, Bell, ChevronDown, ChevronUp,
  Calendar, Trophy, Users, Zap, Trash2, Clock, AlertCircle, Smile, Check, Settings2
} from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import EmojiPicker from './EmojiPicker';
import { parseUTC, toRome } from '@/legacy/utils/dateUtils';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlLabel } from '@/ui/elements';
import { HtmlText } from '@/ui/htmlText';

// Converte una data UTC in ora di Roma (stessa logica di pages/Notifiche)


// ─── Dati statici delle 4 notifiche automatiche ─────────────────────────────

const AUTO_NOTIFICATIONS = [
  {
    id: '6a3ab7a4b655ae6c2f845dd9',
    key: 'new_event',
    icon: '🎉',
    label: 'Nuova Serata',
    description: 'Inviata a tutti i promoter quando viene creata una nuova serata.',
    trigger: 'Automatica · alla creazione di un evento',
    triggerIcon: Calendar,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    defaultTitle: '🎉 Nuova serata aggiunta',
    defaultMessage: '"[nome]" · [data] @ [locale] è stata programmata!',
    editable: false, // template dinamico, non editabile liberamente
    note: 'Il messaggio viene generato automaticamente con i dati della serata.',
  },
  {
    id: '6a3ab7a4b655ae6c2f845dda',
    key: 'achievement',
    icon: '🏆',
    label: 'Achievement Sbloccato',
    description: 'Notifica personale al promoter quando sblocca un nuovo achievement.',
    trigger: 'Automatica · allo sblocco achievement',
    triggerIcon: Trophy,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    defaultTitle: '🏆 Achievement sbloccato!',
    defaultMessage: 'Hai sbloccato "[nome achievement]". Continua così! 💪',
    editable: false,
    note: 'Il messaggio include il nome dell\'achievement sbloccato automaticamente.',
  },
  {
    id: '6a3ab7a4b655ae6c2f845ddb',
    key: 'vibra_vs',
    icon: '⚔️',
    label: 'Vibra VS Settimanale',
    description: 'Broadcast con il vincitore della settimana ogni lunedì alle 17:00.',
    trigger: 'Automatica · ogni lunedì alle 17:00',
    triggerIcon: Zap,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    defaultTitle: '⚔️ Classifica Vibra VS aggiornata!',
    defaultMessage: 'Settimana [date]: 🥇 [nome] ha vinto con €[importo]! Controlla la classifica.',
    editable: false,
    note: 'Il messaggio include automaticamente il vincitore e il suo fatturato settimanale.',
    scheduleLabel: 'Ogni lunedì 17:00',
  },
  {
    id: '6a3ab7a4b655ae6c2f845ddc',
    key: 'inactive_client',
    icon: '👤',
    label: 'Clienti da Ricontattare',
    description: 'Notifica giornaliera (mar–ven) con 2 clienti inattivi diversi per promoter. Frequenza e soglia configurabili qui sotto.',
    trigger: 'Automatica · martedì–venerdì alle 10:00',
    triggerIcon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    defaultTitle: '👤 Cliente da ricontattare',
    defaultMessage: '[nome cliente] non viene a una serata da [N] giorni. Potresti ricontattarlo!',
    editable: false,
    note: 'Ogni giorno vengono segnalati clienti diversi (rotazione). Configura soglia e numero qui sotto.',
    scheduleLabel: 'Mar–Ven 10:00',
  },
  {
    id: 'rank_up_notif',
    key: 'rank_up',
    icon: '🏅',
    label: 'Avanzamento di Rank',
    description: 'Notifica personale quando un promoter avanza al rank successivo nel sistema PR.',
    trigger: 'Automatica · allo sblocco achievement → cambio rank',
    triggerIcon: Trophy,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    defaultTitle: '🏅 Rank avanzato!',
    defaultMessage: 'Sei avanzato al rank [nome rank] con [N] PR. Continua così! 💪',
    editable: false,
    note: 'Inviata automaticamente dal sistema quando si avanza di rank. Puoi personalizzare icona e titolo.',
  },
  {
    id: '6a42b29e9a81d38f096b807b',
    key: 'weekly_reminder',
    icon: '⏰',
    label: 'Promemoria Settimanale',
    description: 'Inviata a tutti i promoter attivi ogni martedì per ricordare di aggiornare presenze e guadagni.',
    trigger: 'Automatica · ogni martedì alle 17:00',
    triggerIcon: Clock,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    defaultTitle: '⏰ Promemoria aggiornamento',
    defaultMessage: 'Non dimenticare di aggiornare le presenze e i guadagni della settimana!',
    editable: false,
    note: 'Inviata automaticamente ogni martedì alle 17:00.',
    scheduleLabel: 'Ogni martedì 17:00',
  },
];

const ICONS = ['📢', '🎉', '⚡', '🔥', '💎', '⚔️', '🏆', '👑', '🎯', '💬', '🆕', '📣'];

// ─── Impostazioni frequenza notifiche clienti inattivi ──────────────────────

function InactiveClientFreqSettings() {
  const { data: allSettings = [], refetch } = useQuery({
    queryKey: ['notif-icon-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 60000,
  });

  const getSetting = (key, def) => allSettings.find(s => s.key === key)?.value ?? def;
  const [days, setDays] = useState('');
  const [maxPerDay, setMaxPerDay] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Inizializza dai settings quando caricati
  useEffect(() => {
    if (allSettings.length > 0) {
      setDays(getSetting('notif_inactive_days', '30'));
      setMaxPerDay(getSetting('notif_inactive_max', '2'));
    }
  }, [allSettings.length]);

  const saveSetting = async (key, value) => {
    const existing = allSettings.find(s => s.key === key);
    if (existing) await base44.entities.AppSettings.update(existing.id, { value: String(value) });
    else await base44.entities.AppSettings.create({ key, value: String(value) });
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      saveSetting('notif_inactive_days', days || '30'),
      saveSetting('notif_inactive_max', maxPerDay || '2'),
    ]);
    await refetch();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Div className="rounded-lg bg-secondary/20 border border-white/[0.06] p-3 space-y-3">
      <P className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Settings2 className="w-3 h-3" /> Configurazione frequenza
      </P>
      <Div className="grid grid-cols-2 gap-3">
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground">Soglia inattività (giorni)</HtmlLabel>
          <Input
            type="number"
            min={7} max={180}
            value={days}
            onChange={e => setDays(e.target.value)}
            className="h-7 text-xs"
            placeholder="30"
          />
          <P className="text-[9px] text-muted-foreground/60">Cliente segnalato se assente da N giorni</P>
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground">Clienti per giorno (per promoter)</HtmlLabel>
          <Input
            type="number"
            min={1} max={10}
            value={maxPerDay}
            onChange={e => setMaxPerDay(e.target.value)}
            className="h-7 text-xs"
            placeholder="2"
          />
          <P className="text-[9px] text-muted-foreground/60">Clienti diversi segnalati ogni giorno</P>
        </Div>
      </Div>
      <P className="text-[9px] text-muted-foreground/60 italic">
        Attivo: martedì–venerdì alle 10:00. Ogni giorno vengono segnalati clienti diversi (rotazione automatica).
      </P>
      <Button size="sm" variant="outline" onClick={handleSave} disabled={saving} className="h-7 text-xs gap-1.5">
        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? <Check className="w-3 h-3 text-green-400" /> : <Settings2 className="w-3 h-3" />}
        {saved ? 'Salvato!' : 'Salva configurazione'}
      </Button>
    </Div>
  );
}

// ─── Componente card notifica automatica ─────────────────────────────────────

const ICON_PICKER_OPTIONS = ['🗓️','🎉','⚡','🔥','💎','⚔️','🏆','👑','🎯','💬','🆕','📣','👤','🌟','✨','🔔','📢','⭐','🎊','🚀'];

function AutoNotifCard({ notif, isActive, customIcon, customText, onIconSave, onTextSave, onToggle, toggling }) {
  const [expanded, setExpanded] = useState(false);
  const [localIcon, setLocalIcon] = useState(customIcon || notif.icon);
  const [localText, setLocalText] = useState(customText || notif.defaultTitle.replace(/^\S+\s/, ''));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const TriggerIcon = notif.triggerIcon;
  const displayIcon = localIcon || notif.icon;

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      onIconSave(notif.key, localIcon),
      onTextSave(notif.key, localText),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Div className={`rounded-xl border transition-all ${notif.bg}`}>
      <Btn
        button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <Span className="text-2xl shrink-0">{displayIcon}</Span>
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2">
            <Span className="text-sm font-semibold">{notif.label}</Span>
            <Span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
              {isActive ? 'Attiva' : 'Disattiva'}
            </Span>
          </Div>
          <P className="text-[11px] text-muted-foreground mt-0.5 truncate">{notif.trigger}</P>
        </Div>
        <Div className="flex items-center gap-2 shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </Div>
      </Btn>

      {expanded && (
        <Div className="border-t border-white/10 px-4 py-3 space-y-3">
          <P className="text-xs text-muted-foreground">{notif.description}</P>

          {/* Selettore icona */}
          <Div className="space-y-2">
            <P className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Icona notifica</P>
            <Div className="flex flex-wrap gap-1.5">
              {ICON_PICKER_OPTIONS.map(em => (
                <Btn
                  button
                  key={em}
                  onClick={() => setLocalIcon(em)}
                  className={`w-8 h-8 text-lg rounded-lg border transition-all ${localIcon === em ? 'border-primary bg-primary/15 scale-110' : 'border-border/40 bg-background/30 hover:border-primary/50'}`}
                >
                  {em}
                </Btn>
              ))}
            </Div>
          </Div>

          {/* Testo titolo notifica */}
          <Div className="space-y-1.5">
            <P className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Titolo notifica</P>
            <Input
              value={localText}
              onChange={e => setLocalText(e.target.value)}
              maxLength={80}
              className="h-8 text-xs"
              placeholder={notif.defaultTitle.replace(/^\S+\s/, '')}
            />
          </Div>

          <Button size="sm" variant="outline" onClick={handleSave} disabled={saving} className="h-7 text-xs gap-1.5">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? <Check className="w-3 h-3 text-green-400" /> : null}
            {saved ? 'Salvato!' : 'Salva'}
          </Button>

          {/* Preview messaggio */}
          <Div className="rounded-lg bg-background/50 border border-border px-3 py-2.5 space-y-1.5">
            <P className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Anteprima</P>
            <Div className="flex items-start gap-2">
              <Span className="text-base shrink-0">{displayIcon}</Span>
              <Div>
                <P className="text-xs font-semibold">{displayIcon} {localText || notif.defaultTitle.replace(/^\S+\s/, '')}</P>
                <P className="text-[11px] text-muted-foreground mt-0.5">{notif.defaultMessage}</P>
              </Div>
            </Div>
          </Div>

          {notif.note && (
            <P className="text-[11px] text-muted-foreground/70 italic">{notif.note}</P>
          )}

          {/* Impostazioni frequenza per clienti inattivi */}
          {notif.key === 'inactive_client' && (
            <InactiveClientFreqSettings />
          )}

          {/* Stato attività + toggle */}
          <Div className="flex items-center justify-between pt-1 border-t border-white/10">
            <Div className="flex items-center gap-2">
              <Div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-muted-foreground'}`} />
              <Span className="text-xs font-medium text-muted-foreground">
                {isActive ? 'Automazione attiva' : 'Automazione disattivata'}
              </Span>
            </Div>
            {onToggle && (
              <Btn
                button
                onClick={() => onToggle(isActive)}
                disabled={toggling}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${isActive ? 'bg-green-500' : 'bg-muted'}`}
              >
                {toggling
                  ? <Span className="mx-auto w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                }
              </Btn>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

// ─── Cronologia notifiche manuali ────────────────────────────────────────────

function CronologiaNotifiche() {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(null);

  // Carica tutte le notifiche system broadcast (una per promoter + le vecchie single-record)
  const { data: allSystemNotifs = [], isLoading } = useQuery({
    queryKey: ['sent-notifications'],
    queryFn: () => base44.entities.Notification.filter({ type: 'system' }, '-created_date', 200),
    staleTime: 0,
  });

  // Ogni notifica broadcast è ora un singolo record
  const grouped = useMemo(() => {
    return allSystemNotifs
      .map(n => ({ representative: n, copies: [n] }))
      .sort((a, b) => new Date(b.representative.created_date) - new Date(a.representative.created_date));
  }, [allSystemNotifs]);

  const handleDelete = async (group) => {
    setDeleting(group.representative.id);
    await base44.entities.Notification.delete(group.representative.id);
    queryClient.invalidateQueries({ queryKey: ['sent-notifications'] });
    setDeleting(null);
  };

  const handleDeleteAll = async () => {
    if (!webWindow.confirm('Eliminare tutte le notifiche broadcast dalla cronologia? Spariranno dal pannello dei promoter.')) return;
    await Promise.all(allSystemNotifs.map(n => base44.entities.Notification.delete(n.id)));
    queryClient.invalidateQueries({ queryKey: ['sent-notifications'] });
  };

  return (
    <Div className="space-y-3">
      <Div className="flex items-center justify-between">
        <SectionHeader icon={Clock} title="Cronologia inviate" color="#a78bfa" />
        {grouped.length > 0 && (
          <Button size="sm" variant="ghost" onClick={handleDeleteAll} className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3 h-3" /> Elimina tutte
          </Button>
        )}
      </Div>
      <P className="text-xs text-muted-foreground">
        Notifiche broadcast inviate manualmente. La colonna "Lette" mostra quanti promoter le hanno visualizzate.
      </P>

      {isLoading && (
        <Div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </Div>
      )}

      {!isLoading && grouped.length === 0 && (
        <Div className="flex flex-col items-center gap-2 py-8 text-center border border-dashed border-border rounded-xl">
          <AlertCircle className="w-6 h-6 text-muted-foreground/40" />
          <P className="text-xs text-muted-foreground">Nessuna notifica broadcast inviata.</P>
        </Div>
      )}

      <Div className="space-y-2">
        {grouped.map(({ representative: n, copies }) => {
          const total = copies.length;
          const readCount = copies.filter(c => c.is_read).length;
          const isBroadcast = total > 1;
          const allRead = readCount === total;
          const noneRead = readCount === 0;

          return (
            <Div key={n.id} className="flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
              <Div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-base shrink-0">{n.icon || '📢'}</Div>
              <Div className="flex-1 min-w-0">
                <P className="text-xs font-semibold truncate">{n.title}</P>
                <HtmlText
                  className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2"
                  html={n.message} />
                <Div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <P className="text-[10px] text-muted-foreground/50">
                    {format(toRome(n.created_date), "d MMM yyyy 'alle' HH:mm", { locale: it })}
                  </P>
                  <P className="text-[10px] text-muted-foreground/40">
                    · {formatDistanceToNow(parseUTC(n.created_date), { locale: it, addSuffix: true })}
                  </P>
                </Div>
              </Div>
              <Btn
                button
                onClick={() => handleDelete({ representative: n, copies })}
                disabled={deleting === n.id}
                className="shrink-0 mt-0.5 text-muted-foreground/40 hover:text-destructive transition-colors disabled:opacity-50">
                {deleting === n.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </Btn>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

// ID reali delle automazioni
const AUTOMATION_IDS = {
  new_event:       '6a3ab7a4b655ae6c2f845dd9',
  achievement:     '6a3ab7a4b655ae6c2f845dda',
  vibra_vs:        '6a3ab7a4b655ae6c2f845ddb',
  inactive_client: '6a3ab7a4b655ae6c2f845ddc',
  rank_up:         '6a3dbd2dad4877c68339c4aa',
  weekly_reminder: '6a42b29e9a81d38f096b807b',
};

// ─── Main component ──────────────────────────────────────────────────────────

export default function SettingsNotifiche() {
  // Stato attivo/inattivo caricato dalle automazioni reali
  const [activeMap, setActiveMap] = useState({});
  const [togglingMap, setTogglingMap] = useState({});

  // Icone personalizzate + stato automazioni (stessa query)
  const { data: allSettings = [], refetch: refetchSettings } = useQuery({
    queryKey: ['notif-icon-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 60000,
  });

  // Inizializza activeMap dagli AppSettings (chiave: automation_active_<key>)
  useEffect(() => {
    if (allSettings.length === 0) return;
    const map = {};
    Object.entries(AUTOMATION_IDS).forEach(([key, id]) => {
      const setting = allSettings.find(s => s.key === `automation_active_${key}`);
      map[id] = setting ? setting.value === 'true' : true;
    });
    setActiveMap(map);
  }, [allSettings.length]);

  const handleToggle = async (automationId, currentActive) => {
    setTogglingMap(prev => ({ ...prev, [automationId]: true }));
    const key = Object.entries(AUTOMATION_IDS).find(([, id]) => id === automationId)?.[0];
    const settingKey = `automation_active_${key}`;
    // Rilegge sempre lo stato attuale dal DB (non dalla cache locale) per evitare di creare duplicati
    const freshMatches = await base44.entities.AppSettings.filter({ key: settingKey });
    const newVal = String(!currentActive);
    if (freshMatches.length > 0) {
      await base44.entities.AppSettings.update(freshMatches[0].id, { value: newVal });
      // Rimuove eventuali duplicati residui della stessa chiave
      await Promise.all(freshMatches.slice(1).map(s => base44.entities.AppSettings.delete(s.id)));
    } else {
      await base44.entities.AppSettings.create({ key: settingKey, value: newVal });
    }
    setActiveMap(prev => ({ ...prev, [automationId]: !currentActive }));
    refetchSettings();
    setTogglingMap(prev => ({ ...prev, [automationId]: false }));
  };
  const customIcons = Object.fromEntries(
    AUTO_NOTIFICATIONS.map(n => {
      const setting = allSettings.find(s => s.key === `notif_icon_${n.key}`);
      return [n.key, setting?.value || null];
    })
  );
  const customTexts = Object.fromEntries(
    AUTO_NOTIFICATIONS.map(n => {
      const setting = allSettings.find(s => s.key === `notif_text_${n.key}`);
      return [n.key, setting?.value || null];
    })
  );

  const saveSetting = async (key, value) => {
    // Rilegge sempre lo stato attuale dal DB (non dalla cache locale) per evitare di creare duplicati
    const freshMatches = await base44.entities.AppSettings.filter({ key });
    if (freshMatches.length > 0) {
      await base44.entities.AppSettings.update(freshMatches[0].id, { value });
      await Promise.all(freshMatches.slice(1).map(s => base44.entities.AppSettings.delete(s.id)));
    } else {
      await base44.entities.AppSettings.create({ key, value });
    }
  };

  const handleIconSave = async (notifKey, icon) => {
    await saveSetting(`notif_icon_${notifKey}`, icon);
    refetchSettings();
  };

  const handleTextSave = async (notifKey, text) => {
    await saveSetting(`notif_text_${notifKey}`, text);
    refetchSettings();
  };

  // Manuale broadcast
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState('📢');
  const [actionUrl, setActionUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const queryClient = useQueryClient();

  const MAX_MSG = 400;

  // PORT: editor contentEditable → ui/richEditor (div vero sul web, contentEditable in WebView sul telefono);
  // i comandi del browser passano dall'editor (selezione salvata dall'editor stesso)
  const applyFormat = (cmd) => {
    editorRef.current?.exec(cmd);
  };

  const saveRange = () => {};

  const insertEmoji = (emoji) => {
    editorRef.current?.exec('insertText', emoji);
  };

  const syncMessage = () => {
    if (editorRef.current) setMessage(editorRef.current.getHtml());
  };

  const handleEditorInput = (html) => {
    if (html.length > MAX_MSG) {
      // Ripristina al valore precedente
      editorRef.current?.setHtml(message);
    } else {
      setMessage(html);
    }
  };

  // Reset editor dopo invio
  const resetEditor = () => {
    editorRef.current?.setHtml('');
    setMessage('');
  };


  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    await base44.entities.Notification.create({
      type: 'system',
      title: title.trim(),
      message: message.trim(),
      icon,
      action_url: actionUrl.trim() || null,
      is_read: false,
      recipient_promoter_id: null,
    });
    setSending(false);
    setSent(true);
    setTitle('');
    resetEditor();
    setActionUrl('');
    setIcon('📢');
    queryClient.invalidateQueries({ queryKey: ['sent-notifications'] });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Div className="space-y-8 max-w-lg">

      {/* ── Sezione 1: Notifiche automatiche ── */}
      <Div className="space-y-3">
        <Div>
          <SectionHeader icon={Bell} title="Notifiche automatiche" color="#a78bfa" />
          <P className="text-xs text-muted-foreground mt-0.5">
            Queste notifiche vengono inviate dall'app automaticamente. Puoi attivarle o disattivarle.
          </P>
        </Div>

        <Div className="space-y-2">
          {AUTO_NOTIFICATIONS.map(notif => {
            const automationId = AUTOMATION_IDS[notif.key];
            return (
              <AutoNotifCard
                key={notif.id}
                notif={notif}
                isActive={activeMap[automationId] ?? true}
                customIcon={customIcons[notif.key]}
                customText={customTexts[notif.key]}
                onIconSave={handleIconSave}
                onTextSave={handleTextSave}
                onToggle={automationId ? (cur) => handleToggle(automationId, cur) : null}
                toggling={togglingMap[automationId] ?? false}
              />
            );
          })}
        </Div>
      </Div>

      <Div className="border-t border-border" />

      {/* ── Sezione 2: Invio manuale ── */}
      <Div className="space-y-4">
        <Div>
          <SectionHeader icon={Send} title="Invia notifica manuale" color="#a78bfa" />
          <P className="text-xs text-muted-foreground mt-0.5">
            Invia subito un messaggio a tutti i promoter.
          </P>
        </Div>

        {/* Icona */}
        <Div>
          <P className="text-xs font-semibold text-muted-foreground mb-2">Icona</P>
          <Div className="flex gap-2 flex-wrap">
            {ICONS.map(em => (
              <Btn
                button
                key={em}
                onClick={() => setIcon(em)}
                className={`w-9 h-9 text-xl rounded-xl border transition-all ${icon === em ? 'border-primary bg-primary/15 scale-110' : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                {em}
              </Btn>
            ))}
          </Div>
        </Div>

        <Div className="space-y-1">
          <HtmlLabel className="text-xs font-semibold text-muted-foreground">Titolo *</HtmlLabel>
          <Input placeholder="Es: Aggiornamento importante!" value={title} onChange={e => setTitle(e.target.value)} maxLength={80} />
        </Div>

        <Div className="space-y-1">
          <HtmlLabel className="text-xs font-semibold text-muted-foreground">Messaggio *</HtmlLabel>
          {/* Toolbar + editor */}
          <Div className="relative">
            <Div className="rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
              {/* Toolbar */}
              <Div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-secondary/20">
                <Btn button onMouseDown={e => { e.preventDefault(); applyFormat('bold'); }}
                  className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors font-bold text-xs w-7 h-7 flex items-center justify-center" accessibilityLabel="Grassetto">
                  B
                </Btn>
                <Btn button onMouseDown={e => { e.preventDefault(); applyFormat('italic'); }}
                  className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors italic text-xs w-7 h-7 flex items-center justify-center" accessibilityLabel="Corsivo">
                  I
                </Btn>
                <Btn button onMouseDown={e => { e.preventDefault(); applyFormat('underline'); }}
                  className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors underline text-xs w-7 h-7 flex items-center justify-center" accessibilityLabel="Sottolineato">
                  U
                </Btn>
                <Div className="w-px h-4 bg-border mx-1" />
                <Btn
                  button
                  onMouseDown={e => { e.preventDefault(); saveRange(); setShowEmojiPicker(v => !v); }}
                  className={`p-1.5 rounded-lg transition-colors w-7 h-7 flex items-center justify-center ${showEmojiPicker ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/60 text-muted-foreground'}`}
                  accessibilityLabel="Inserisci emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                </Btn>
              </Div>
              {/* Editor contenteditable */}
              <RichEditor
                ref={editorRef}
                onChange={handleEditorInput}
                onBlur={() => { syncMessage(); saveRange(); }}
                placeholder="Scrivi il contenuto della notifica..."
                minHeight={100} />
            </Div>
            {/* Emoji picker floating */}
            {showEmojiPicker && (
              <Div className="absolute left-0 top-full mt-1 z-50">
                <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmojiPicker(false)} />
              </Div>
            )}
          </Div>
          <P className={`text-[10px] text-right ${message.length >= MAX_MSG ? 'text-destructive' : 'text-muted-foreground'}`}>{message.length}/{MAX_MSG}</P>
        </Div>

        <Div className="space-y-1">
          <HtmlLabel className="text-xs font-semibold text-muted-foreground">Link al click (opzionale)</HtmlLabel>
          <Input placeholder="Es: /il-mio-vibra o /serate" value={actionUrl} onChange={e => setActionUrl(e.target.value)} />
        </Div>

        {(title || message) && (
          <Div className="rounded-xl border border-border bg-secondary/20 px-4 py-3 flex items-start gap-3">
            <Div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">{icon}</Div>
            <Div className="flex-1 min-w-0">
              <P className="text-sm font-semibold">{title || '—'}</P>
              <HtmlText
                className="text-xs text-muted-foreground mt-0.5 line-clamp-2"
                html={message || '—'} />
            </Div>
          </Div>
        )}

        <Button onClick={handleSend} disabled={!title.trim() || !message.trim() || sending} className="w-full">
          {sending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Invio in corso...</>
          ) : sent ? (
            <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />Notifica inviata!</>
          ) : (
            <><Send className="w-4 h-4 mr-2" />Invia a tutti i promoter</>
          )}
        </Button>
      </Div>

      <Div className="border-t border-border" />

      {/* ── Sezione 3: Cronologia ── */}
      <CronologiaNotifiche />
    </Div>
  );
}