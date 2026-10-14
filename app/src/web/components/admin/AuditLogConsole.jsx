// Port di src/components/admin/AuditLogConsole.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useMemo, useState } from 'react';
import { useProgressiveList } from '@/web/hooks/useProgressiveList';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Search, RefreshCw, User, Calendar, Users, Wallet, TrendingUp, FileText, Filter } from '@/ui/icons.generated';

import { Btn, Div, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

// ── Mappature in italiano per lettura semplificata ──
const ENTITY_LABELS = {
  Client: 'Cliente',
  EventAttendance: 'Presenza',
  Event: 'Serata',
  Promoter: 'Promoter',
  ClientGroup: 'Gruppo',
  AppSettings: 'Impostazione',
  DownloadItem: 'Materiale',
  PromoterNote: 'Nota Promoter',
};

const FIELD_LABELS = {
  name: 'Nome',
  phone: 'Telefono',
  instagram: 'Instagram',
  instagram_profile_url: 'URL Instagram',
  tiktok: 'TikTok',
  tiktok_profile_url: 'URL TikTok',
  photo_url: 'Foto profilo',
  source_type: 'Provenienza',
  referred_by_client_id: 'Presentato da',
  is_lead: 'Lead',
  new_people_brought: 'Persone portate',
  is_leader: 'Leader',
  leader_since: 'Leader dal',
  is_driver: 'Guidatore',
  tipologia_cliente: 'Tipologia',
  data_nascita: 'Data di nascita',
  notes: 'Note',
  last_contacted_at: 'Ultimo contatto',
  residenza_key: 'Zona',
  eta: 'Età',
  provenienza: 'Provenienza',
  status: 'Stato',
  recettivita: 'Recettività',
  is_off: 'Spenta',
  platform: 'Piattaforma',
  display_order: 'Ordine',
  ai_data: 'Dati AI',
  // Presenze
  event_id: 'Serata',
  client_id: 'Cliente',
  promoter_id: 'Promoter',
  present: 'Presente',
  revenue: 'Fatturato',
  table_number: 'Tavolo',
  guadagno_pct: '% Guadagno',
  guadagno_fuori_mano: 'Guadagno fuori mano',
  // Serate
  date: 'Data',
  venue: 'Locale',
  physical_location: 'Location',
  total_revenue: 'Fatturato totale',
  total_guests: 'Ospiti totali',
  table_threshold: 'Soglia tavolo',
  is_extra: 'Serata extra',
  // Promoter
  ruolo: 'Ruolo',
  referente_id: 'Referente',
  neighborhood: 'Quartiere',
  city: 'Città',
  province_area: 'Area provincia',
  address: 'Indirizzo',
  lat: 'Latitudine',
  lng: 'Longitudine',
  promoter_from: 'Promoter dal',
  instagram_followers: 'Follower IG',
  instagram_following: 'Seguiti IG',
  ig_user_id: 'ID Instagram',
  ig_connected_at: 'IG collegato il',
  goals: 'Obiettivi',
  accordi_per_locale: 'Accordi per locale',
  show_in_stats: 'Visibile in statistiche',
  cum_total_revenue: 'Fatturato totale (cum)',
  cum_total_tables: 'Tavoli totali (cum)',
  cum_total_earnings: 'Guadagni totali (cum)',
  cum_week_revenue: 'Fatturato settimana (cum)',
  cum_month_revenue: 'Miglior fatturato mese (cum)',
  cum_total_clients: 'Clienti totali (cum)',
  cum_total_presences: 'Presenze totali (cum)',
  // Gruppo
  client_ids: 'Membri',
  // Impostazioni / Materiale
  key: 'Chiave',
  value: 'Valore',
  file_url: 'File',
  file_type: 'Tipo file',
  section_id: 'Sezione',
  section_label: 'Nome sezione',
  bg_class: 'Colore sfondo',
};

const REVENUE_FIELDS = new Set(['revenue', 'total_revenue', 'table_threshold']);
const EARNING_FIELDS = new Set([
  'guadagno_pct', 'guadagno_fuori_mano',
  'cum_total_earnings', 'cum_week_revenue', 'cum_month_revenue',
]);

const CURRENCY_FIELDS = new Set([
  'revenue', 'total_revenue', 'table_threshold',
  'guadagno_fuori_mano', 'cum_total_revenue', 'cum_week_revenue',
  'cum_month_revenue', 'cum_total_earnings', 'cum_total_spent',
]);
const DATE_FIELDS = new Set([
  'date', 'data_nascita', 'promoter_from', 'leader_since',
  'last_contacted_at', 'ig_connected_at',
]);
const BOOLEAN_FIELDS = new Set([
  'is_lead', 'is_leader', 'is_driver', 'is_off', 'is_extra',
  'present', 'show_in_stats',
]);

const OP_META = {
  create: { label: 'Creato', Icon: Plus, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  update: { label: 'Modificato', Icon: Pencil, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  delete: { label: 'Eliminato', Icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

const CATEGORY_TABS = [
  { key: 'tutto', label: 'Tutto', icon: Filter },
  { key: 'clienti', label: 'Clienti', icon: User },
  { key: 'presenze', label: 'Presenze', icon: Users },
  { key: 'importi', label: 'Importi', icon: Wallet },
  { key: 'guadagni', label: 'Guadagni', icon: TrendingUp },
  { key: 'altro', label: 'Altro', icon: FileText },
];

function categoryOf(log) {
  const e = log.entity_name;
  let fields = log.changed_fields || [];
  if (fields.length === 0 && log.operation_type === 'create' && log.new_value) {
    fields = Object.keys(log.new_value);
  }
  if (e === 'Client') return 'clienti';
  if (e === 'EventAttendance') {
    if (fields.some(f => REVENUE_FIELDS.has(f))) return 'importi';
    if (fields.some(f => EARNING_FIELDS.has(f))) return 'guadagni';
    return 'presenze';
  }
  if (e === 'Event') {
    if (fields.some(f => REVENUE_FIELDS.has(f))) return 'importi';
    return 'altro';
  }
  if (e === 'Promoter') {
    if (fields.some(f => EARNING_FIELDS.has(f))) return 'guadagni';
    return 'altro';
  }
  return 'altro';
}

export default function AuditLogConsole() {
  const [category, setCategory] = useState('tutto');
  const [search, setSearch] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => fetchAll(base44.entities.AuditLog, {}, { sort: '-created_date' }),
    staleTime: 30000,
  });
  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 60000,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ['clients-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.Client, {}, { sort: '-updated_date' }),
  });
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 60000,
  });
  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
  });

  const promotersById = useMemo(() => Object.fromEntries(promoters.map(p => [p.id, p])), [promoters]);
  const clientsById = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);
  const eventsById = useMemo(() => Object.fromEntries(events.map(e => [e.id, e])), [events]);
  const attendancesById = useMemo(() => Object.fromEntries(attendances.map(a => [a.id, a])), [attendances]);

  const formatVal = (field, v) => {
    if (v === null || v === undefined || v === '') return '—';
    if (field === 'client_id') return clientsById[v]?.name || v;
    if (field === 'event_id') return eventsById[v]?.name || (eventsById[v] ? `${eventsById[v].name} (${format(parseISO(eventsById[v].date), 'dd MMM', { locale: it })})` : v);
    if (field === 'referred_by_client_id') return clientsById[v]?.name || v;
    if (field === 'promoter_id' || field === 'referente_id') return promotersById[v]?.name || v;
    if (BOOLEAN_FIELDS.has(field)) return v ? 'Sì' : 'No';
    if (CURRENCY_FIELDS.has(field) && typeof v === 'number') return '€' + v.toLocaleString('it-IT');
    if (DATE_FIELDS.has(field) && typeof v === 'string' && v.length >= 10) {
      try { return format(parseISO(v), 'dd MMM yyyy', { locale: it }); } catch { return v; }
    }
    if (Array.isArray(v)) return v.length + ' elementi';
    if (typeof v === 'object') return 'oggetto';
    return String(v);
  };

  const recordLabel = (log) => {
    if (log.entity_name === 'Client') {
      return clientsById[log.record_id]?.name || log.record_label || 'Cliente eliminato';
    }
    if (log.entity_name === 'EventAttendance') {
      const att = attendancesById[log.record_id];
      const clientId = att?.client_id || log.new_value?.client_id || log.old_value?.client_id;
      const eventId = att?.event_id || log.new_value?.event_id || log.old_value?.event_id;
      const clientName = clientId ? clientsById[clientId]?.name : null;
      const eventName = eventId ? eventsById[eventId]?.name : null;
      if (clientName && eventName) return `${clientName} · ${eventName}`;
      if (clientName) return clientName;
      return log.record_label && log.record_label !== log.record_id ? log.record_label : 'Presenza eliminata';
    }
    if (log.entity_name === 'Event') return eventsById[log.record_id]?.name || log.record_label || 'Serata eliminata';
    if (log.entity_name === 'Promoter') return promotersById[log.record_id]?.name || log.record_label || 'Promoter';
    return log.record_label || ENTITY_LABELS[log.entity_name] || log.entity_name;
  };

  const authorOf = (log) => {
    if (log.entity_name === 'Client') {
      const pid = clientsById[log.record_id]?.promoter_id || log.new_value?.promoter_id || log.old_value?.promoter_id;
      return pid ? promotersById[pid]?.name : null;
    }
    if (log.entity_name === 'EventAttendance') {
      const pid = attendancesById[log.record_id]?.promoter_id || log.new_value?.promoter_id || log.old_value?.promoter_id;
      return pid ? promotersById[pid]?.name : null;
    }
    if (log.entity_name === 'Promoter') return promotersById[log.record_id]?.name || log.record_label;
    return null;
  };

  const enriched = useMemo(() => {
    return logs.map(log => {
      const cat = categoryOf(log);
      const author = authorOf(log);
      const label = recordLabel(log);
      return { ...log, _category: cat, _author: author, _label: label };
    });
  }, [logs, clientsById, eventsById, attendancesById, promotersById]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (category !== 'tutto') list = list.filter(l => l._category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        (l._label || '').toLowerCase().includes(q) ||
        (l._author || '').toLowerCase().includes(q) ||
        (ENTITY_LABELS[l.entity_name] || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [enriched, category, search]);
  // PORT: log lunghi: montaggio progressivo (hooks/useProgressiveList)
  const { count: shownLogs, sentinelRef: logsSentinelRef } = useProgressiveList(filtered.length);

  const counts = useMemo(() => {
    const c = { tutto: enriched.length, clienti: 0, presenze: 0, importi: 0, guadagni: 0, altro: 0 };
    enriched.forEach(l => { c[l._category] = (c[l._category] || 0) + 1; });
    return c;
  }, [enriched]);

  const diffFields = (log) => {
    if (log.operation_type === 'update') return log.changed_fields || [];
    if (log.operation_type === 'create' && log.new_value) {
      // mostra i campi più significativi (salta id e cum_*)
      return Object.keys(log.new_value).filter(f =>
        !['id', 'created_date', 'updated_date', 'created_by_id'].includes(f) &&
        !f.startsWith('cum_') && !f.startsWith('ig_')
      ).slice(0, 8);
    }
    if (log.operation_type === 'delete' && log.old_value) {
      return Object.keys(log.old_value).filter(f =>
        !['id', 'created_date', 'updated_date', 'created_by_id'].includes(f)
      ).slice(0, 8);
    }
    return [];
  };

  return (
    <Div className="space-y-3">
      {/* Ricerca */}
      <Div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <HtmlInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca per nome cliente, promoter o tipo…"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </Div>

      {/* Filtri categoria */}
      <Div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
        {CATEGORY_TABS.map(({ key, label, icon: Icon }) => (
          <Btn
            button
            key={key}
            onClick={() => setCategory(key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              category === key
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40'
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
            <Span className="text-[10px] text-muted-foreground/70">{counts[key] || 0}</Span>
          </Btn>
        ))}
      </Div>

      {/* Lista log */}
      {isLoading ? (
        <Div className="flex items-center justify-center py-12">
          <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </Div>
      ) : filtered.length === 0 ? (
        <Div className="text-center py-12 text-muted-foreground text-sm">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
          Nessun log trovato per i filtri selezionati.
        </Div>
      ) : (
        <Div className="space-y-2">
          {filtered.slice(0, shownLogs).map(log => {
            const op = OP_META[log.operation_type] || OP_META.update;
            const fields = diffFields(log);
            return (
              <Div key={log.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <Div className="flex items-start gap-2.5 px-3 py-2.5">
                  <Div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${op.bg} ${op.border} border`}>
                    <op.Icon className={`w-3.5 h-3.5 ${op.color}`} />
                  </Div>
                  <Div className="min-w-0 flex-1">
                    <Div className="flex items-center gap-2 flex-wrap">
                      <Span className="font-semibold text-sm truncate">{log._label}</Span>
                      <Span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${op.bg} ${op.color}`}>{op.label}</Span>
                      <Span className="text-[10px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                        {ENTITY_LABELS[log.entity_name] || log.entity_name}
                      </Span>
                    </Div>
                    <Div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      {log._author ? (
                        <Span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" /> {log._author}
                        </Span>
                      ) : (
                        <Span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" /> Admin
                        </Span>
                      )}
                      <Span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(log.created_date), "dd MMM yyyy · HH:mm", { locale: it })}
                      </Span>
                    </Div>
                  </Div>
                </Div>
                {fields.length > 0 && (
                  <Div className="px-3 pb-2.5 -mt-0.5 flex flex-wrap gap-1.5">
                    {fields.map(f => {
                      const oldV = log.old_value?.[f];
                      const newV = log.new_value?.[f];
                      const label = FIELD_LABELS[f] || f;
                      let chip;
                      if (log.operation_type === 'update') {
                        chip = `${label}: ${formatVal(f, oldV)} → ${formatVal(f, newV)}`;
                      } else if (log.operation_type === 'create') {
                        chip = `${label}: ${formatVal(f, newV)}`;
                      } else {
                        chip = `${label}: ${formatVal(f, oldV)}`;
                      }
                      return (
                        <Span key={f} className="text-[10px] bg-secondary/30 border border-border/60 rounded-md px-1.5 py-0.5 text-foreground/80">
                          {chip}
                        </Span>
                      );
                    })}
                  </Div>
                )}
              </Div>
            );
          })}
          {shownLogs < filtered.length && <Div ref={logsSentinelRef} />}
        </Div>
      )}
    </Div>
  );
}