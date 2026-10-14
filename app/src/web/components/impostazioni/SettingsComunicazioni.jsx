// Port di src/components/impostazioni/SettingsComunicazioni.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef } from 'react';
import { useAppSetting } from '@/web/hooks/useAppSetting';
import { base44 } from '@/lib/base44';
import { useQuery } from '@tanstack/react-query';
import { Megaphone, Check, X, Plus, Trash2, Users, User, ChevronDown, ChevronUp } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Button } from '@/ui/button';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, HtmlTextarea, Img } from '@/ui/elements';

// ─── Blocco avviso globale (tutti) ────────────────────────────────────────────

function GlobalAnnouncement() {
  const [stored, setStored, loading] = useAppSetting('global_announcement');
  const [local, setLocal] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) setLocal(stored || '');
  }, [loading, stored]);

  const handleSave = async () => {
    await setStored(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    setLocal('');
    await setStored('');
  };

  return (
    <Div className="rounded-xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
      <Div className="flex items-center gap-2 px-4 py-3 border-b border-amber-500/20">
        <SectionHeader icon={Users} title="Per tutti i promoter" color="#fbbf24" />
        {stored && (
          <Span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Attivo</Span>
        )}
      </Div>
      <Div className="p-4 space-y-3">
        <P className="text-[11px] text-muted-foreground">
          Mostrato in cima a Dashboard e Il Mio Vibra per tutti. Lascia vuoto per nasconderlo.
        </P>

        {stored && (
          <Div className="rounded-lg bg-amber-900/20 border border-amber-700/40 px-3 py-2 flex items-start gap-2">
            <Megaphone className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <P className="text-xs text-amber-200 flex-1">{stored}</P>
          </Div>
        )}

        <HtmlTextarea
          value={local}
          onChange={e => setLocal(e.target.value)}
          placeholder="es. Avviso: il locale Frontemare chiude alle 03:00 questo sabato..."
          className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary/50 transition-colors"
          rows={3}
        />

        <Div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="h-7 text-xs gap-1.5">
            {saved ? <><Check className="w-3 h-3" /> Salvato</> : 'Pubblica avviso'}
          </Button>
          {stored && (
            <Button size="sm" variant="ghost" onClick={handleClear} className="h-7 text-xs gap-1.5 text-muted-foreground">
              <X className="w-3 h-3" /> Rimuovi avviso
            </Button>
          )}
        </Div>
      </Div>
    </Div>
  );
}

// ─── Riga avviso per singolo PR ───────────────────────────────────────────────

function PRAnnouncementRow({ promoter, storedValue, onDelete }) {
  const settingKey = `announcement_pr_${promoter.id}`;
  const [, setStored] = useAppSetting(settingKey);
  const [local, setLocal] = useState(storedValue || '');
  const [expanded, setExpanded] = useState(!!storedValue);
  const [saved, setSaved] = useState(false);

  // Sincronizza il textarea quando il valore nel DB cambia dall'esterno
  const prevStoredRef = useRef(storedValue);
  useEffect(() => {
    if (storedValue !== prevStoredRef.current) {
      prevStoredRef.current = storedValue;
      setLocal(storedValue || '');
      if (storedValue) setExpanded(true);
    }
  }, [storedValue]);

  const handleSave = async () => {
    await setStored(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    setLocal('');
    await setStored('');
    onDelete(promoter.id);
  };

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Btn
        button
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <Div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0 overflow-hidden">
          {promoter.photo_url
            ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
            : promoter.name?.charAt(0)?.toUpperCase()
          }
        </Div>
        <Span className="flex-1 text-sm font-medium truncate">{promoter.name}</Span>
        {storedValue && (
          <Span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 shrink-0">Attivo</Span>
        )}
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
      </Btn>

      {expanded && (
        <Div className="border-t border-border px-3 pb-3 pt-2.5 space-y-2.5">
          {storedValue && (
            <Div className="rounded-lg bg-blue-900/20 border border-blue-700/30 px-3 py-2 flex items-start gap-2">
              <Megaphone className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
              <P className="text-xs text-blue-200 flex-1">{storedValue}</P>
            </Div>
          )}
          <HtmlTextarea
            value={local}
            onChange={e => setLocal(e.target.value)}
            placeholder={`Messaggio visibile solo a ${promoter.name}...`}
            className="w-full bg-secondary/20 border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:border-primary/50 transition-colors"
            rows={2}
          />
          <Div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="h-7 text-xs gap-1.5">
              {saved ? <><Check className="w-3 h-3" /> Salvato</> : 'Salva'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClear} className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3 h-3" /> Rimuovi
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SettingsComunicazioni() {
  const { data: promoters = [], isLoading } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.filter({ status: 'attivo' }),
    staleTime: 10 * 60000,
  });

  // Carica dal DB tutti gli avvisi PR attivi (chiave announcement_pr_*), aggiornati ogni 5s
  const { data: allSettings = [] } = useQuery({
    queryKey: ['all-app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 0,
    refetchInterval: 5000,
  });

  // PR con avviso attivo nel DB
  const activePRIds = allSettings
    .filter(s => s.key?.startsWith('announcement_pr_') && s.value)
    .map(s => s.key.replace('announcement_pr_', ''));

  // PR aggiunti manualmente ma senza avviso ancora salvato
  const [manualPRIds, setManualPRIds] = useState([]);

  const selectedPRIds = [...new Set([...activePRIds, ...manualPRIds])];

  const [showPRPicker, setShowPRPicker] = useState(false);
  const [prSearch, setPrSearch] = useState('');

  const addPR = (id) => {
    setManualPRIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setShowPRPicker(false);
    setPrSearch('');
  };

  const removePR = (id) => {
    setManualPRIds(prev => prev.filter(x => x !== id));
  };

  const availablePromoters = promoters.filter(p =>
    !selectedPRIds.includes(p.id) &&
    (prSearch === '' || p.name?.toLowerCase().includes(prSearch.toLowerCase()))
  );

  return (
    <Div className="space-y-6 max-w-lg">
      <Div>
        <SectionHeader icon={Megaphone} title="Comunicazioni di Servizio" color="#fbbf24" />
        <P className="text-xs text-muted-foreground mt-0.5">
          Avvisi mostrati in cima all'app. Puoi mandare uno a tutti e/o messaggi specifici per singolo PR.
        </P>
      </Div>

      {/* Globale */}
      <GlobalAnnouncement />

      {/* Per singolo PR */}
      <Div className="space-y-3">
        <Div className="flex items-center justify-between">
          <SectionHeader icon={User} title="Per singolo PR" color="#60a5fa" />
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5"
            onClick={() => setShowPRPicker(p => !p)}
          >
            <Plus className="w-3 h-3" /> Aggiungi PR
          </Button>
        </Div>

        {/* Picker PR */}
        {showPRPicker && (
          <Div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
            <HtmlInput
              autoFocus
              placeholder="Cerca promoter..."
              value={prSearch}
              onChange={e => setPrSearch(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
            />
            <Div className="max-h-40 overflow-y-auto space-y-0.5">
              {isLoading && <P className="text-xs text-muted-foreground text-center py-2">Caricamento...</P>}
              {!isLoading && availablePromoters.length === 0 && (
                <P className="text-xs text-muted-foreground text-center py-2">Nessun promoter disponibile</P>
              )}
              {availablePromoters.map(p => (
                <Btn
                  button
                  key={p.id}
                  onClick={() => addPR(p.id)}
                  className="w-full flex items-center gap-2 text-left px-2.5 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-xs"
                >
                  <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 overflow-hidden">
                    {p.photo_url
                      ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                      : p.name?.charAt(0)?.toUpperCase()
                    }
                  </Div>
                  <Span className="flex-1 truncate">{p.name}</Span>
                </Btn>
              ))}
            </Div>
          </Div>
        )}

        {selectedPRIds.length === 0 && (
          <P className="text-xs text-muted-foreground text-center py-3 border border-dashed border-border rounded-xl">
            Nessun avviso specifico attivo. Clicca "Aggiungi PR" per iniziare.
          </P>
        )}

        {selectedPRIds.map(id => {
          const promoter = promoters.find(p => p.id === id);
          if (!promoter) return null;
          const setting = allSettings.find(s => s.key === `announcement_pr_${id}`);
          return (
            <PRAnnouncementRow
              key={id}
              promoter={promoter}
              storedValue={setting?.value || ''}
              onDelete={removePR}
            />
          );
        })}
      </Div>
    </Div>
  );
}