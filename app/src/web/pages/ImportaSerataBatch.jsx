// Port di src/pages/ImportaSerataBatch.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/web/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Button } from '@/ui/button';
import { toast } from '@/ui/use-toast';
import { triggerStatsRecompute, refetchEventTables, writeThroughAttendances } from '@/web/lib/eventSync';
import { ArrowLeft, AlertCircle, Loader2 } from '@/ui/icons.generated';
import BatchImportTabBar from '@/web/components/event/BatchImportTabBar';
import BatchImportDraftForm from '@/web/components/event/BatchImportDraftForm';
import BatchImportPreview from '@/web/components/event/BatchImportPreview';

import { storage as webStorage } from '@/web/shims/dom';
import { Div, H, P } from '@/ui/html';

// Alias speciali: nome nel testo -> nome nel DB
const NAME_ALIASES = {
  'alessio': 'alessio tummolillo',
  'cristiano': 'Francesco Cristiano',
  'alessia p': 'Alessia Petrungaro',
  'arini': 'Alessia Arini',
};

let tabIdCounter = 0;
function createEmptyTab() {
  tabIdCounter += 1;
  return {
    id: `tab-${Date.now()}-${tabIdCounter}`,
    step: 'text', // 'text' | 'preview'
    rawText: '',
    date: '',
    eventType: '',
    eventName: '',
    tableThreshold: '300',
    notes: '',
    physicalLocation: '',
    extractedData: [],
    loading: false,
    error: '',
  };
}

const DRAFT_STORAGE_KEY = 'batch_import_event_draft';

function loadDraft() {
  try {
    const raw = webStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.tabs) || parsed.tabs.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(tabs, activeTabId) {
  try {
    webStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ tabs, activeTabId }));
  } catch {
    // ignore
  }
}

function clearDraft() {
  try {
    webStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Assegna il miglior promoter corrispondente a un nome estratto, con fuzzy matching.
function matchPromoterForName(rawName, promoters) {
  const aliasResolved = NAME_ALIASES[rawName.toLowerCase().trim()];
  const extractedName = aliasResolved ? aliasResolved.toLowerCase().trim() : rawName.toLowerCase().trim();

  const scoreName = (dbName, inputName) => {
    const db = dbName.toLowerCase();
    const inp = inputName.toLowerCase();

    if (db === inp) return 100;
    if (db.includes(inp)) return 90;
    if (inp.includes(db)) return 85;

    const dbWords = db.split(/\s+/).filter(w => w.length > 1);
    const inpWords = inp.split(/\s+/).filter(w => w.length > 1);

    let wordMatches = 0;
    // Per i match parziali (includes) richiedi parole di almeno 4 caratteri,
    // altrimenti preposizioni brevi come "di" matchano dentro parole più lunghe
    // (es. "nadia" contiene "di" → falso positivo su "Di Tota").
    const MIN_WORD_LEN = 4;
    inpWords.forEach(inpWord => {
      if (dbWords.some(dbWord => dbWord === inpWord ||
        (dbWord.length >= MIN_WORD_LEN && inpWord.length >= MIN_WORD_LEN &&
          (dbWord.includes(inpWord) || inpWord.includes(dbWord))))) {
        wordMatches++;
      }
    });

    if (wordMatches === inpWords.length && inpWords.length > 0) return 88;
    if (wordMatches > 0) return 55 + (wordMatches * 10);

    const dbStart = db.slice(0, 3);
    const inpStart = inp.slice(0, 3);
    if (dbStart === inpStart) return 70;

    return 0;
  };

  let bestPromoter = null;
  let bestScore = 0;

  promoters.forEach(p => {
    const score = scoreName(p.name, extractedName);
    if (score > bestScore) {
      bestScore = score;
      bestPromoter = p;
    }
  });

  return { promoter_id: bestScore >= 50 ? bestPromoter?.id || null : null, matched: bestScore >= 50 };
}

// Mappa una lista { name, revenue } ai promoter reali del database.
function mapExtractedToPromoters(extracted, promoters) {
  return extracted
    .map(item => {
      const { promoter_id, matched } = matchPromoterForName(item.name, promoters);
      return { name: item.name, revenue: item.revenue, promoter_id, matched };
    })
    .filter(item => item.revenue > 0);
}

// Parser locale istantaneo (senza IA) per i formati di testo piu comuni:
// "Nome 150", "Nome: 200", "Nome - 150,50", "Nome 300 euro", con eventuale bullet iniziale.
// Se anche una sola riga non rispetta il formato, ritorna null: si usera l'IA come fallback.
function tryLocalParse(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const lineRegex = new RegExp(
    '^[\\u2022.\\-*]?\\s*([A-Za-z\u00C0-\u00FF.\\s]+?)\\s*[:\\-\u2013]?\\s*(\\d+(?:[.,]\\d{1,2})?)\\s*(?:\u20AC|euro)?\\s*$',
    'i'
  );
  const results = [];

  for (const line of lines) {
    const m = line.match(lineRegex);
    if (!m) return null;
    const name = m[1].trim();
    const revenue = parseFloat(m[2].replace(',', '.'));
    if (!name || isNaN(revenue) || revenue <= 0) return null;
    results.push({ name, revenue });
  }

  return results.length > 0 ? results : null;
}

async function createEventWithAttendances(eventData, promoterRevenues) {
  const created = await base44.entities.Event.create(eventData);
  const eventId = created.id;
  const ops = [];
  for (const [pid, data] of Object.entries(promoterRevenues)) {
    const numRev = typeof data === 'number' ? Number(data) : Number(data.revenue);
    if (!numRev || numRev <= 0) continue;
    ops.push(base44.entities.EventAttendance.create({ event_id: eventId, promoter_id: pid, revenue: numRev }));
  }
  const attendances = await Promise.all(ops);
  return { created, attendances };
}

export default function ImportaSerataBatch() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [tabs, setTabs] = useState(() => loadDraft()?.tabs || [createEmptyTab()]);
  const [activeTabId, setActiveTabId] = useState(() => {
    const draft = loadDraft();
    return draft?.activeTabId || draft?.tabs?.[0]?.id || tabs[0].id;
  });
  const [importing, setImporting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    saveDraft(tabs, activeTabId);
  }, [tabs, activeTabId]);

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
  });

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTab = (id, patch) => {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addTab = () => {
    const newTab = createEmptyTab();
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const removeTab = (id) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (filtered.length === 0) {
        const fresh = createEmptyTab();
        setActiveTabId(fresh.id);
        return [fresh];
      }
      if (id === activeTabId) {
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  };

  // Estrazione automatica istantanea (regex, nessuna IA): quando testo, data e
  // locale sono compilati, riconosce subito le coppie nome+fatturato. Se il
  // formato non è riconoscibile mostra un messaggio d'aiuto.
  useEffect(() => {
    if (!activeTab.rawText.trim()) {
      if (activeTab.extractedData.length > 0) updateTab(activeTab.id, { extractedData: [] });
      return;
    }
    if (!activeTab.date || !activeTab.eventType) return;

    const localResult = tryLocalParse(activeTab.rawText);
    if (localResult) {
      const mapped = mapExtractedToPromoters(localResult, promoters);
      if (mapped.length > 0) {
        updateTab(activeTab.id, { extractedData: mapped, loading: false, error: '' });
        return;
      }
    }

    updateTab(activeTab.id, {
      extractedData: [],
      loading: false,
      error: 'Formato non riconosciuto. Usa una riga per ogni promoter nel formato "Nome 150" o "Nome: 150€".',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab.id, activeTab.rawText, activeTab.date, activeTab.eventType]);

  const readyTabs = tabs.filter(t => t.extractedData.length > 0);

  const handleImportAll = async () => {
    if (readyTabs.length === 0) return;
    setImporting(true);
    setGlobalError('');

    const failedTabs = [];
    try {
      for (const tab of readyTabs) {
        try {
          const isExtra = venues.find(v => v.name === tab.eventType)?.is_extra || false;
          const eventData = {
            name: isExtra && tab.eventName ? tab.eventName : tab.eventType,
            date: tab.date,
            venue: tab.eventType,
            total_revenue: 0,
            notes: tab.notes || '',
            is_extra: isExtra,
            table_threshold: Number(tab.tableThreshold),
            physical_location: tab.physicalLocation || '',
          };

          const promoterRevenues = {};
          const exPrItems = [];

          tab.extractedData.forEach(item => {
            if (item.promoter_id) {
              promoterRevenues[item.promoter_id] = { revenue: item.revenue, present: true };
            } else {
              exPrItems.push({ name: item.name, revenue: item.revenue || 0 });
            }
          });

          const totalFromImport = tab.extractedData.reduce((sum, item) => sum + (item.revenue || 0), 0);
          eventData.total_revenue = totalFromImport;

          const { created, attendances } = await createEventWithAttendances(eventData, promoterRevenues);
          const eventId = created.id;

          // Solo dopo la create riuscita la serata entra in cache: niente fantasmi
          qc.setQueryData(['events'], (old = []) => [created, ...old]);
          writeThroughAttendances(qc, { created: attendances });

          if (exPrItems.length > 0) {
            await Promise.all(exPrItems.map(exPr =>
              base44.entities.EventAttendance.create({
                event_id: eventId,
                revenue: exPr.revenue,
                present: true,
                notes: `__ex_pr__:${exPr.name}`,
              })
            ));
          }
        } catch (err) {
          // Errore su questa tab: non bloccare le altre, registra e continua
          failedTabs.push(tab.eventType || tab.date || 'serata');
        }
      }

      // Refetch immediato (disaccoppiato dal ricalcolo 15s): riconcilia cache con DB
      refetchEventTables(qc);
      clearDraft();
      navigate('/serate');
      // Ricalcolo statistiche in background, refetch promoter al termine
      triggerStatsRecompute(qc);

      if (failedTabs.length > 0) {
        toast({
          title: `${failedTabs.length} serata non importata`,
          description: 'Alcune serate non sono state salvate. Controlla e riprova.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      setGlobalError(`Errore salvataggio: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Div className="space-y-5 pb-8 max-w-4xl mx-auto">
      <Div className="flex items-center gap-3">
        <Link to="/serate">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Div>
          <H className="text-xl font-bold">Importa Serata da Testo</H>
          <P className="text-xs text-muted-foreground">Incolla il testo con i fatturati, il riconoscimento è istantaneo</P>
        </Div>
      </Div>

      <Div className="rounded-2xl border border-white/[0.06] bg-card p-5 space-y-5">
        <BatchImportTabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={setActiveTabId}
          onAdd={addTab}
          onRemove={removeTab}
        />

        <BatchImportDraftForm tab={activeTab} onChange={(patch) => updateTab(activeTab.id, patch)} venues={venues} />

        {activeTab.extractedData.length > 0 && (
          <Div className="pt-4 border-t border-border">
            <BatchImportPreview tab={activeTab} />
          </Div>
        )}

        {globalError && (
          <Div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <P className="text-sm text-destructive">{globalError}</P>
          </Div>
        )}

        <Div className="flex items-center justify-between gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate('/serate')} disabled={importing}>
            Torna alle Serate
          </Button>
          <Div className="flex items-center gap-2">
            <Button type="button" onClick={handleImportAll} disabled={importing || readyTabs.length === 0}>
              {importing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Importa{readyTabs.length > 0 ? ` (${readyTabs.length})` : ''}
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}