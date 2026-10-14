// Port di src/components/impostazioni/SettingsTavoli.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { TableProperties, Check } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

import { Div, P, Span } from '@/ui/html';

function VenueThresholdRow({ label, sublabel, venueId, defaultThreshold, onSaved }) {
  const [local, setLocal] = useState(String(defaultThreshold || 300));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocal(String(defaultThreshold || 300));
  }, [defaultThreshold]);

  const handleSave = async () => {
    await base44.entities.Venue.update(venueId, { default_threshold: Number(local) });
    onSaved();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Div className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
      <Div className="flex-1 min-w-0">
        <P className="text-xs font-medium">{label}</P>
        <P className="text-[10px] text-muted-foreground">{sublabel}</P>
      </Div>
      <Div className="flex items-center gap-2 shrink-0">
        <Span className="text-xs text-muted-foreground">€</Span>
        <Input
          type="number"
          value={local}
          onChange={e => setLocal(e.target.value)}
          className="h-7 text-xs w-20 text-right"
        />
        <Button
          size="sm"
          variant={saved ? 'secondary' : 'outline'}
          onClick={handleSave}
          className="h-7 text-xs px-2 gap-1"
        >
          {saved ? <><Check className="w-3 h-3 text-green-400" /> Salvato</> : 'Salva'}
        </Button>
      </Div>
    </Div>
  );
}

export default function SettingsTavoli() {
  const qc = useQueryClient();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
  });

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Div className="px-4 py-3 border-b border-border bg-secondary/20">
        <SectionHeader icon={TableProperties} title="Soglie Chiusura Tavoli per Locale" color="#4ade80" />
      </Div>
      <Div className="p-4">
        <P className="text-[11px] text-muted-foreground mb-4">
          Soglia default di fatturato (€) per contare un tavolo per ciascun locale. Usata quando una serata non ha una soglia personalizzata impostata.
        </P>
        {isLoading ? (
          <Div className="flex justify-center py-4">
            <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </Div>
        ) : (
          venues.map(v => {
            const sublabel = v.is_extra ? 'Speciali' : [v.season_label, v.is_active ? null : 'Concluso'].filter(Boolean).join(' · ');
            return (
              <VenueThresholdRow
                key={v.id}
                label={v.name}
                sublabel={sublabel}
                venueId={v.id}
                defaultThreshold={v.default_threshold}
                onSaved={() => qc.invalidateQueries({ queryKey: ['venues'] })}
              />
            );
          })
        )}
      </Div>
    </Div>
  );
}