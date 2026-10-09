// Port di src/components/client/ParcoPaganti.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Users, Loader2, UserCheck } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { base44 } from '@/lib/base44';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Div, P, Span } from '@/ui/html';
import { HtmlTextarea } from '@/ui/elements';

// Soglia oltre la quale il testo del parco paganti viene salvato come file
// privato invece che direttamente nel campo `value` di AppSettings (che ha
// un limite massimo di bytes imposto dalla piattaforma).
const MAX_DIRECT_SIZE = 8000;
const FILE_PREFIX = 'file:';

// Calcola quante persone ci sono in una singola riga del parco paganti.
function parseLineCount(line) {
  const plusMatch = line.match(/(.+?)\s*\+\s*(\d+)/);
  if (plusMatch && !plusMatch[1].trim().match(/^\d+$/)) {
    return 1 + parseInt(plusMatch[2]);
  }

  const parenMatch = line.match(/\((\d+)\)/);
  if (parenMatch) return parseInt(parenMatch[1]);

  const numStartMatch = line.match(/^(\d+)\s+/);
  if (numStartMatch) return parseInt(numStartMatch[1]);

  const groupMatch = line.match(/(?:gruppo|comitiva)\s*(?:di\s*)?(\d+)/i);
  if (groupMatch) return parseInt(groupMatch[1]);

  const countWordMatch = line.match(
    /(\d+)\s*(?:persone|amici|amico|ragazzi|ragazze|amiche|comitiva)/i
  );
  if (countWordMatch) return parseInt(countWordMatch[1]);

  return 1;
}

export default function ParcoPaganti({ promoterId }) {
  const [text, setText] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const qc = useQueryClient();

  const saveTimer = useRef(null);
  const latestTextRef = useRef('');
  const settingRef = useRef(null);
  const saveQueueRef = useRef(Promise.resolve());

  const storageKey = `parco_paganti_${promoterId || 'global'}`;
  const queryKey = ['app-setting', storageKey];

  const { data: setting, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const results = await base44.entities.AppSettings.filter({
        key: storageKey,
      });

      let record = results?.[0] || null;

      // Se il valore è un riferimento a file (testo troppo grande per il
      // campo entity), risolviamo l'URI firmato e leggiamo il contenuto.
      if (record?.value?.startsWith(FILE_PREFIX)) {
        try {
          const file_uri = record.value.slice(FILE_PREFIX.length);
          const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri });
          const response = await fetch(signed_url);
          const text = await response.text();
          record = { ...record, value: text };
        } catch (e) {
          console.error('Errore lettura file parco paganti:', e);
        }
      }

      return record;
    },
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });

  // Mantiene sempre disponibile l'ultimo record conosciuto.
  // In questo modo le mutation non dipendono da una closure stale.
  useEffect(() => {
    if (setting !== undefined) {
      settingRef.current = setting;
    }

    // Non sovrascriviamo la textarea se il valore è ancora un riferimento
    // a file non risolto (difensivo — la queryFn dovrebbe averlo già risolto).
    if (setting && !setting.value?.startsWith(FILE_PREFIX)) {
      setText(setting.value || '');
      latestTextRef.current = setting.value || '';
    }
  }, [setting]);

  const saveMut = useMutation({
    mutationFn: async (value) => {
      /*
       * IMPORTANTE:
       * Non utilizziamo direttamente `setting` qui.
       *
       * `setting` appartiene al render che ha creato la mutation
       * e può quindi essere stale.
       *
       * Leggiamo invece il record più aggiornato disponibile dalla
       * cache/ref al momento esatto del salvataggio.
       */
      const cachedSetting = qc.getQueryData(queryKey);
      const currentSetting = cachedSetting ?? settingRef.current;

      // Se il testo supera la soglia, lo carichiamo come file privato e
      // memorizziamo solo il riferimento nel campo `value`.
      let valueToStore = value;
      if (value.length > MAX_DIRECT_SIZE) {
        const blob = new Blob([value], { type: 'text/plain' });
        const file = new File([blob], `${storageKey}.txt`, { type: 'text/plain' });
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
        valueToStore = FILE_PREFIX + file_uri;
      }

      if (currentSetting?.id) {
        return base44.entities.AppSettings.update(
          currentSetting.id,
          { value: valueToStore }
        );
      }

      /*
       * Prima di creare un nuovo record, facciamo un controllo diretto
       * sul database. Questo protegge anche dal caso in cui la cache
       * non abbia ancora ricevuto il risultato del primo create.
       */
      const existing = await base44.entities.AppSettings.filter({
        key: storageKey,
      });

      if (existing?.[0]?.id) {
        return base44.entities.AppSettings.update(
          existing[0].id,
          { value: valueToStore }
        );
      }

      return base44.entities.AppSettings.create({
        key: storageKey,
        value: valueToStore,
      });
    },

    onSuccess: (data) => {
      if (data) {
        /*
         * Se il valore salvato è un riferimento a file, manteniamo nella
         * cache il testo originale (latestTextRef) così la textarea non
         * viene sovrascritta con l'URI. Altrimenti aggiorniamo normalmente.
         */
        if (data.value?.startsWith(FILE_PREFIX)) {
          const resolved = { ...data, value: latestTextRef.current };
          qc.setQueryData(queryKey, resolved);
          settingRef.current = resolved;
        } else {
          qc.setQueryData(queryKey, data);
          settingRef.current = data;
        }
      }

      setIsSaving(false);
      setSavedFeedback(true);

      setTimeout(() => {
        setSavedFeedback(false);
      }, 2000);
    },

    onError: () => {
      setIsSaving(false);
    },
  });

  /*
   * Accoda i salvataggi invece di permettere che più mutation
   * vengano eseguite contemporaneamente.
   *
   * Questo evita:
   *
   * SAVE A → create
   * SAVE B → create
   *
   * prima che il primo create abbia restituito l'id.
   */
  const queueSave = (value) => {
    saveQueueRef.current = saveQueueRef.current
      .catch(() => {
        // Permette alla coda di continuare anche se un salvataggio precedente fallisce.
      })
      .then(async () => {
        setIsSaving(true);

        try {
          await saveMut.mutateAsync(value);
        } catch (error) {
          console.error('Errore salvataggio Parco Paganti:', error);
          throw error;
        }
      });
  };

  // Salvataggio automatico con debounce 800ms.
  const handleChange = (e) => {
    const value = e.target.value;

    setText(value);
    latestTextRef.current = value;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    setIsSaving(true);

    saveTimer.current = setTimeout(() => {
      /*
       * Usiamo latestTextRef invece di affidarti allo stato catturato
       * dal render precedente.
       */
      queueSave(latestTextRef.current);
    }, 800);
  };

  // Cleanup timer al unmount.
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  const { totalPaganti, lineDetails } = useMemo(() => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let total = 0;

    const details = lines.map((line) => {
      const count = parseLineCount(line);
      total += count;

      return {
        line,
        count,
      };
    });

    return {
      totalPaganti: total,
      lineDetails: details,
    };
  }, [text]);

  return (
    <Div className="space-y-4">
      <Div className="rounded-xl bg-card border border-border p-4 space-y-3">

        <Div className="flex items-center justify-between">
          <SectionHeader
            icon={Users}
            title="Parco Paganti"
            color="#a78bfa"
          />

          {/* Indicatore salvataggio automatico */}
          <Div className="flex items-center gap-1.5 text-xs">
            {isSaving ? (
              <Span className="flex items-center gap-1 text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Salvataggio...
              </Span>
            ) : savedFeedback ? (
              <Span className="flex items-center gap-1 text-green-400">
                <Check className="w-3.5 h-3.5" />
                Salvato
              </Span>
            ) : (
              <Span className="text-[10px] text-muted-foreground/60">
                Salvataggio automatico
              </Span>
            )}
          </Div>
        </Div>

        {/* Paganti totali — calcolati automaticamente dal testo */}
        <Div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
          <Div className="p-1.5 rounded-lg bg-emerald-500/15 shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </Div>

          <Div className="flex-1">
            <P className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
              Paganti totali
            </P>

            <P className="text-2xl font-bold text-emerald-300 tabular-nums leading-tight">
              {totalPaganti}
            </P>
          </Div>

          <P className="text-[10px] text-muted-foreground text-right max-w-[140px]">
            Calcolato da:
            {'\n'}
            <Span className="text-emerald-400/70">
              "nome +3 amici" = 4
            </Span>
            {'\n'}
            <Span className="text-emerald-400/70">
              "4 amici di tizio" = 4
            </Span>
          </P>
        </Div>

        <P className="text-xs text-muted-foreground">
          Lista personale libera — inserisci nomi, note, gruppi. Non ha effetti sulle altre sezioni.
        </P>

        {isLoading ? (
          <Div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </Div>
        ) : (
          <HtmlTextarea
            value={text}
            onChange={handleChange}
            placeholder={
              "Mario Rossi\nLuca Bianchi - gruppo 4 persone\nGruppo Pozzuoli (5)\n..."
            }
            rows={16}
            className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono parco-scrollbar"
          />
        )}

        <Div className="flex items-center justify-between">
          <P className="text-[10px] text-muted-foreground">
            {lineDetails.length} righe · {totalPaganti} paganti
          </P>

          {lineDetails.length > 0 && (
            <Div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
              {lineDetails.map((d, i) => (
                <Span
                  key={i}
                  className="text-[9px] text-muted-foreground/70 bg-secondary/30 rounded px-1 py-0.5"
                  accessibilityLabel={d.line}
                >
                  {d.count}
                </Span>
              ))}
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}