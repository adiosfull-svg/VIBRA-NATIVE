// Port di src/components/impostazioni/SettingsChatInstagram.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { useViewAsPromoter } from '@/lib/viewAs';
import { MessageCircle, Ban, RotateCcw, ExternalLink, Sparkles, Loader2, Check, Users, Cpu } from '@/ui/icons.generated';
import InstagramConnectionAdmin from '@/web/components/instagram/InstagramConnectionAdmin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { A, HtmlLabel } from '@/ui/elements';

export default function SettingsChatInstagram() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isAdmin = user?.role === 'admin';
  const { effectivePromoterId: promoterId } = useViewAsPromoter();
  const [recalcing, setRecalcing] = useState(false);
  const [recalcResult, setRecalcResult] = useState(null);
  const [selectedPromoterId, setSelectedPromoterId] = useState('all');
  const [selectedModel, setSelectedModel] = useState('gemini_3_flash');

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters-list-ig-settings'],
    queryFn: () => base44.entities.Promoter.list(),
    enabled: isAdmin,
    staleTime: 120000,
    refetchOnWindowFocus: false,
  });
  const connectedPromoters = promoters.filter(p => p.ig_connected_at || p.ig_user_id);

  const { data: ignored = [], isLoading } = useQuery({
    queryKey: ['ignored-ig-chats', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.IgnoredInstagramChat.list()
      : base44.entities.IgnoredInstagramChat.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleUnignore = async (chat) => {
    await base44.entities.IgnoredInstagramChat.delete(chat.id);
    qc.invalidateQueries({ queryKey: ['ignored-ig-chats'] });
    qc.invalidateQueries({ queryKey: ['instagram-messages'] });
  };

  const handleForceRecalc = async () => {
    setRecalcing(true);
    setRecalcResult(null);
    try {
      const payload = { force_recalc: true, model: selectedModel };
      if (selectedPromoterId !== 'all') {
        payload.force_promoter_id = selectedPromoterId;
      }
      const res = await base44.functions.invoke('syncInstagramDMs', payload);
      setRecalcResult({ ok: true, data: res });
      qc.invalidateQueries({ queryKey: ['semine'] });
    } catch (err) {
      setRecalcResult({ ok: false, error: err?.message || 'Errore' });
    } finally {
      setRecalcing(false);
    }
  };

  return (
    <Div className="space-y-4">
      <Div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-pink-400" />
        <H className="text-lg font-semibold">Chat Instagram</H>
      </Div>

      {/* Admin: stato collegamenti IG dei promoter */}
      {isAdmin && <InstagramConnectionAdmin />}

      {/* Force recalculation */}
      <Div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
        <Div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <Div>
            <H className="text-sm font-medium">Ricalcolo dati AI semine</H>
            <P className="text-xs text-muted-foreground mt-1">
              Forza la riesrazione delle conversazioni Instagram per aggiornare età, zona, lavoro, studio, locali, inviti e riassunti in prima persona. Scegli un promoter specifico e il modello AI per testare senza ricalcolare tutto.
            </P>
          </Div>
        </Div>
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Selettore promoter */}
          <Div className="space-y-1.5">
            <HtmlLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3 h-3" />Promoter
            </HtmlLabel>
            <Select value={selectedPromoterId} onValueChange={setSelectedPromoterId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i promoter</SelectItem>
                {connectedPromoters.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
          {/* Selettore modello AI */}
          <Div className="space-y-1.5">
            <HtmlLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />Modello AI
            </HtmlLabel>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini_3_flash">Gemini 3 Flash (economico)</SelectItem>
                <SelectItem value="gemini_3_1_pro">Gemini 3.1 Pro</SelectItem>
                <SelectItem value="claude-sonnet-5">Claude Sonnet 5</SelectItem>
                <SelectItem value="claude_opus_5">Claude Opus 5 (migliore)</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </Div>
        <Btn
          button
          onClick={handleForceRecalc}
          disabled={recalcing}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 transition-colors disabled:opacity-50">
          {recalcing ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" />Ricalcolo in corso…</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5" />Forza ricalcolo dati</>
          )}
        </Btn>
        {recalcResult?.ok && (
          <Div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            Ricalcolo completato: {recalcResult.data?.aiExtracted || 0} semine aggiornate
          </Div>
        )}
        {recalcResult && !recalcResult.ok && (
          <Div className="text-xs text-red-400">Errore: {recalcResult.error}</Div>
        )}
      </Div>

      <Div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Div>
          <H className="text-sm font-medium flex items-center gap-1.5">
            <Ban className="w-4 h-4 text-red-400" />
            Contatti ignorati ({ignored.length})
          </H>
          <P className="text-xs text-muted-foreground mt-1">
            Le chat ignorate non vengono più sincronizzate. Puoi ripristinarle in qualsiasi momento.
          </P>
        </Div>

        {isLoading ? (
          <Div className="flex items-center justify-center h-20">
            <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </Div>
        ) : ignored.length === 0 ? (
          <Div className="flex flex-col items-center justify-center py-8 text-center">
            <Ban className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <P className="text-sm text-muted-foreground">Nessun contatto ignorato</P>
          </Div>
        ) : (
          <Div className="space-y-2">
            {ignored.map(chat => (
              <Div key={chat.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-2.5">
                <Div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Span className="text-sm font-semibold text-muted-foreground">
                    {chat.handle?.[0]?.toUpperCase() || '?'}
                  </Span>
                </Div>
                <Div className="flex-1 min-w-0">
                  <P className="text-sm font-medium truncate">@{chat.handle || 'sconosciuto'}</P>
                  {chat.username && chat.username !== chat.handle && (
                    <P className="text-xs text-muted-foreground truncate">{chat.username}</P>
                  )}
                  {chat.ignored_at && (
                    <P className="text-[10px] text-muted-foreground/70">
                      Ignorato il {format(new Date(chat.ignored_at), 'd MMM yyyy', { locale: it })}
                    </P>
                  )}
                </Div>
                <Div className="flex items-center gap-1.5 shrink-0">
                  {chat.handle && (
                    <A
                      href={`https://instagram.com/${chat.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      accessibilityLabel="Apri profilo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </A>
                  )}
                  <Btn
                    button
                    onClick={() => handleUnignore(chat)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Ripristina
                  </Btn>
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}