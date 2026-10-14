// Port di src/components/impostazioni/SettingsDatabase.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { base44 } from '@/lib/base44';
import { Database, ChevronDown, ChevronRight, Trash2, Search, AlertTriangle, RefreshCw, Trophy } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/dialog';

import { Btn, Div, P, Span } from '@/ui/html';

// ─── Categoria: EventAttendance ─────────────────────────────────────────────

function AttendanceCategory({ events, promoters }) {
  const [search, setSearch] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [attendances, setAttendances] = useState({});
  const [loadingEvent, setLoadingEvent] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const filteredEvents = events.filter(e =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.date?.includes(search)
  );

  const loadAttendances = async (eventId) => {
    if (attendances[eventId]) return;
    setLoadingEvent(eventId);
    const rows = await base44.entities.EventAttendance.filter({ event_id: eventId });
    setAttendances(prev => ({ ...prev, [eventId]: rows }));
    setLoadingEvent(null);
  };

  const toggleEvent = (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
      loadAttendances(eventId);
    }
  };

  const handleDelete = async () => {
    await base44.entities.EventAttendance.delete(toDelete.id);
    setAttendances(prev => ({
      ...prev,
      [toDelete.event_id]: prev[toDelete.event_id].filter(a => a.id !== toDelete.id),
    }));
    setToDelete(null);
  };

  const getPromoterName = (id) => promoters.find(p => p.id === id)?.name || id || '—';

  return (
    <Div>
      <Div className="relative mb-3">
        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
        <Input placeholder="Cerca serata..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
      </Div>
      <Div className="space-y-1">
        {filteredEvents.map(ev => {
          const isOpen = expandedEvent === ev.id;
          const rows = attendances[ev.id] || [];
          return (
            <Div key={ev.id} className="rounded-lg border border-border/50 overflow-hidden">
              <Btn
                button
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-secondary/30 transition-colors text-left"
                onClick={() => toggleEvent(ev.id)}>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <Span className="text-xs font-medium flex-1">{ev.date} — {ev.name}</Span>
                <Span className="text-[10px] text-muted-foreground">{ev.venue}</Span>
                {isOpen && rows.length > 0 && <Span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">{rows.length} record</Span>}
              </Btn>
              {isOpen && (
                <Div className="border-t border-border/30 bg-secondary/10">
                  {loadingEvent === ev.id ? (
                    <Div className="flex justify-center py-3"><Div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>
                  ) : rows.length === 0 ? (
                    <P className="text-[11px] text-muted-foreground text-center py-3">Nessuna presenza registrata</P>
                  ) : (
                    <Div className="divide-y divide-border/20">
                      {rows.map(a => (
                        <Div key={a.id} className="flex items-center gap-2 px-3 py-2">
                          <Div className="flex-1 min-w-0">
                            <P className="text-[11px] font-medium">{a.client_id ? `Cliente: ${a.client_id.slice(-6)}` : getPromoterName(a.promoter_id)}</P>
                            <P className="text-[10px] text-muted-foreground font-mono">{a.id}</P>
                          </Div>
                          <Div className="flex items-center gap-3 shrink-0">
                            {a.revenue != null && <Span className="text-[11px] text-green-400">€{a.revenue}</Span>}
                            {a.present != null && <Span className={`text-[10px] px-1.5 py-0.5 rounded ${a.present ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{a.present ? 'Presente' : 'Assente'}</Span>}
                            <Btn
                              button
                              onClick={() => setToDelete(a)}
                              className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Btn>
                          </Div>
                        </Div>
                      ))}
                    </Div>
                  )}
                </Div>
              )}
            </Div>
          );
        })}
      </Div>
      <DeleteConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={handleDelete}
        label={`presenza di ${toDelete ? getPromoterName(toDelete.promoter_id) : ''}`} />
    </Div>
  );
}

// ─── Categoria: Events ───────────────────────────────────────────────────────

function EventsCategory({ events, onEventsChange }) {
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const filteredEvents = events.filter(e =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.date?.includes(search) || e.venue?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    await base44.entities.Event.delete(toDelete.id);
    onEventsChange(events.filter(e => e.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <Div>
      <Div className="relative mb-3">
        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
        <Input placeholder="Cerca evento..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
      </Div>
      <Div className="space-y-1">
        {filteredEvents.map(ev => (
          <Div key={ev.id} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/50 hover:bg-secondary/20">
            <Div className="flex-1 min-w-0">
              <P className="text-xs font-medium">{ev.date} — {ev.name}</P>
              <P className="text-[10px] text-muted-foreground font-mono">{ev.id} · {ev.venue}</P>
            </Div>
            <Div className="flex items-center gap-2 shrink-0">
              {ev.total_revenue != null && <Span className="text-[11px] text-green-400">€{ev.total_revenue?.toLocaleString('it-IT')}</Span>}
              <Btn
                button
                onClick={() => setToDelete(ev)}
                className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </Btn>
            </Div>
          </Div>
        ))}
        {filteredEvents.length === 0 && <P className="text-[11px] text-muted-foreground text-center py-4">Nessun risultato</P>}
      </Div>
      <DeleteConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={handleDelete}
        label={`evento "${toDelete?.name}"`} />
    </Div>
  );
}

// ─── Categoria: Clients ──────────────────────────────────────────────────────

function ClientsCategory({ promoters }) {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const loadClients = async () => {
    setLoading(true);
    const rows = await base44.entities.Client.list('-created_date', 2000);
    setClients(rows);
    setLoaded(true);
    setLoading(false);
  };

  const handleDelete = async () => {
    await base44.entities.Client.delete(toDelete.id);
    setClients(prev => prev.filter(c => c.id !== toDelete.id));
    setToDelete(null);
  };

  const getPromoterName = (id) => promoters.find(p => p.id === id)?.name || id || '—';

  const filtered = clients.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.instagram?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Div>
      {!loaded ? (
        <Button size="sm" variant="outline" onClick={loadClients} disabled={loading} className="w-full text-xs h-8 gap-1.5">
          {loading ? <><Div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />Caricamento...</> : 'Carica clienti'}
        </Button>
      ) : (
        <>
          <Div className="flex items-center gap-2 mb-3">
            <Div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Cerca cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </Div>
            <Btn
              button
              onClick={loadClients}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground"><RefreshCw className="w-3.5 h-3.5" /></Btn>
          </Div>
          <P className="text-[10px] text-muted-foreground mb-2">{filtered.length} clienti</P>
          <Div className="space-y-1 max-h-96 overflow-y-auto">
            {filtered.map(c => (
              <Div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:bg-secondary/20">
                <Div className="flex-1 min-w-0">
                  <P className="text-xs font-medium">{c.name}</P>
                  <P className="text-[10px] text-muted-foreground font-mono">{c.id} · PR: {getPromoterName(c.promoter_id)}</P>
                </Div>
                <Div className="flex items-center gap-2 shrink-0">
                  {c.phone && <Span className="text-[10px] text-muted-foreground">{c.phone}</Span>}
                  <Btn
                    button
                    onClick={() => setToDelete(c)}
                    className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Btn>
                </Div>
              </Div>
            ))}
          </Div>
        </>
      )}
      <DeleteConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={handleDelete}
        label={`cliente "${toDelete?.name}"`} />
    </Div>
  );
}

// ─── Shared delete dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({ open, onCancel, onConfirm, label }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Elimina record
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare {label}? L'operazione è irreversibile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">Elimina</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Accordion section wrapper ───────────────────────────────────────────────

function AccordionSection({ title, subtitle, icon: Icon, color, children }) {
  const [open, setOpen] = useState(false);
  return (
    <Div className="rounded-xl border border-border overflow-hidden">
      <Btn
        button
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/20 transition-colors text-left"
        onClick={() => setOpen(v => !v)}>
        <Icon className={`w-4 h-4 ${color} shrink-0`} />
        <Div className="flex-1">
          <P className="text-sm font-semibold">{title}</P>
          {subtitle && <P className="text-[11px] text-muted-foreground">{subtitle}</P>}
        </Div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </Btn>
      {open && <Div className="border-t border-border/50 p-4">{children}</Div>}
    </Div>
  );
}

// ─── Categoria: PromoterAchievements ────────────────────────────────────────

function AchievementsCategory({ promoters }) {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    const [pas, achs] = await Promise.all([
      base44.entities.PromoterAchievement.list('-unlocked_at', 2000),
      base44.entities.Achievement.list(),
    ]);
    setRecords(pas);
    setAchievements(achs);
    setLoaded(true);
    setLoading(false);
  };

  const handleDelete = async () => {
    await base44.entities.PromoterAchievement.delete(toDelete.id);
    setRecords(prev => prev.filter(r => r.id !== toDelete.id));
    setToDelete(null);
  };

  const getPromoterName = (id) => promoters.find(p => p.id === id)?.name || id || '—';
  const getAchievementTitle = (id) => achievements.find(a => a.id === id)?.title || id || '—';

  const filtered = records.filter(r =>
    !search ||
    getPromoterName(r.promoter_id).toLowerCase().includes(search.toLowerCase()) ||
    getAchievementTitle(r.achievement_id).toLowerCase().includes(search.toLowerCase()) ||
    r.achievement_key?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Div>
      {!loaded ? (
        <Button size="sm" variant="outline" onClick={load} disabled={loading} className="w-full text-xs h-8 gap-1.5">
          {loading ? <><Div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />Caricamento...</> : 'Carica achievement sbloccati'}
        </Button>
      ) : (
        <>
          <Div className="flex items-center gap-2 mb-3">
            <Div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Cerca promoter o achievement..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </Div>
            <Btn
              button
              onClick={load}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground"><RefreshCw className="w-3.5 h-3.5" /></Btn>
          </Div>
          <P className="text-[10px] text-muted-foreground mb-2">{filtered.length} record</P>
          <Div className="space-y-1 max-h-96 overflow-y-auto">
            {filtered.map(r => (
              <Div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:bg-secondary/20">
                <Div className="flex-1 min-w-0">
                  <P className="text-xs font-medium">{getPromoterName(r.promoter_id)}</P>
                  <P className="text-[10px] text-muted-foreground">🏆 {getAchievementTitle(r.achievement_id)} · {r.achievement_key}</P>
                  <P className="text-[10px] text-muted-foreground/50 font-mono">{r.id} · {r.unlocked_at?.slice(0, 10)}</P>
                </Div>
                <Btn
                  button
                  onClick={() => setToDelete(r)}
                  className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </Btn>
              </Div>
            ))}
            {filtered.length === 0 && <P className="text-[11px] text-muted-foreground text-center py-4">Nessun risultato</P>}
          </Div>
        </>
      )}
      <DeleteConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={handleDelete}
        label={`achievement "${toDelete ? getAchievementTitle(toDelete.achievement_id) : ''}" di ${toDelete ? getPromoterName(toDelete.promoter_id) : ''}`} />
    </Div>
  );
}

// ─── Categoria: PromoterRank ─────────────────────────────────────────────────

function RankCategory({ promoters }) {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    const rows = await base44.entities.PromoterRank.list('-updated_date', 500);
    setRecords(rows);
    setLoaded(true);
    setLoading(false);
  };

  const handleDelete = async () => {
    await base44.entities.PromoterRank.delete(toDelete.id);
    setRecords(prev => prev.filter(r => r.id !== toDelete.id));
    setToDelete(null);
  };

  const getPromoterName = (id) => promoters.find(p => p.id === id)?.name || id || '—';

  const filtered = records.filter(r =>
    !search ||
    getPromoterName(r.promoter_id).toLowerCase().includes(search.toLowerCase()) ||
    r.rank_key?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Div>
      {!loaded ? (
        <Button size="sm" variant="outline" onClick={load} disabled={loading} className="w-full text-xs h-8 gap-1.5">
          {loading ? <><Div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />Caricamento...</> : 'Carica rank promoter'}
        </Button>
      ) : (
        <>
          <Div className="flex items-center gap-2 mb-3">
            <Div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Cerca promoter o rank..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </Div>
            <Btn
              button
              onClick={load}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground"><RefreshCw className="w-3.5 h-3.5" /></Btn>
          </Div>
          <P className="text-[10px] text-muted-foreground mb-2">{filtered.length} record</P>
          <Div className="space-y-1 max-h-96 overflow-y-auto">
            {filtered.map(r => (
              <Div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:bg-secondary/20">
                <Div className="flex-1 min-w-0">
                  <P className="text-xs font-medium">{getPromoterName(r.promoter_id)}</P>
                  <P className="text-[10px] text-muted-foreground">🏅 {r.rank_key}</P>
                  <P className="text-[10px] text-muted-foreground/50 font-mono">{r.id} · {r.updated_date?.slice(0, 10)}</P>
                </Div>
                <Btn
                  button
                  onClick={() => setToDelete(r)}
                  className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </Btn>
              </Div>
            ))}
            {filtered.length === 0 && <P className="text-[11px] text-muted-foreground text-center py-4">Nessun risultato</P>}
          </Div>
        </>
      )}
      <DeleteConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={handleDelete}
        label={`rank di ${toDelete ? getPromoterName(toDelete.promoter_id) : ''}`} />
    </Div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function SettingsDatabase() {
  const [events, setEvents] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Event.list('-date', 500),
      base44.entities.Promoter.list(),
    ]).then(([evs, pros]) => {
      setEvents(evs);
      setPromoters(pros);
      setLoading(false);
    });
  }, []);

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/20">
        <SectionHeader icon={Database} title="Gestione Database" color="#f87171" />
        <Span className="ml-auto text-[10px] text-muted-foreground bg-destructive/10 text-destructive px-2 py-0.5 rounded">
          Area Rischiosa
        </Span>
      </Div>
      <Div className="p-4">
        <Div className="flex items-start gap-2 mb-5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <P className="text-[11px] text-amber-300">Le eliminazioni sono irreversibili. Usa questa sezione solo per rimuovere doppioni o record errati.</P>
        </Div>

        {loading ? (
          <Div className="flex justify-center py-6"><Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>
        ) : (
          <Div className="space-y-3">
            <AccordionSection
              title="Presenze / Revenue"
              subtitle="Visualizza ed elimina record di EventAttendance per serata"
              icon={Database}
              color="text-blue-400"
            >
              <AttendanceCategory events={events} promoters={promoters} />
            </AccordionSection>

            <AccordionSection
              title="Serate (Eventi)"
              subtitle="Elimina singole serate dal database"
              icon={Database}
              color="text-purple-400"
            >
              <EventsCategory events={events} onEventsChange={setEvents} />
            </AccordionSection>

            <AccordionSection
              title="Clienti"
              subtitle="Cerca ed elimina singoli clienti"
              icon={Database}
              color="text-orange-400"
            >
              <ClientsCategory promoters={promoters} />
            </AccordionSection>

            <AccordionSection
              title="Achievement Sbloccati"
              subtitle="Visualizza ed elimina record PromoterAchievement (sblocchi individuali)"
              icon={Trophy}
              color="text-yellow-400"
            >
              <AchievementsCategory promoters={promoters} />
            </AccordionSection>

            <AccordionSection
              title="Rank Promoter"
              subtitle="Visualizza ed elimina record PromoterRank (rank attuale di ogni promoter)"
              icon={Trophy}
              color="text-cyan-400"
            >
              <RankCategory promoters={promoters} />
            </AccordionSection>
          </Div>
        )}
      </Div>
    </Div>
  );
}