// Port di src/components/instagram/InstagramProfileCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from '@/ui/motion';
import { base44 } from '@/lib/base44';
import { Instagram, Users, UserCheck, RefreshCw, ChevronDown, BarChart3 } from '@/ui/icons.generated';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/ui/cn';
import InstagramGrowthCharts from '@/web/components/instagram/InstagramGrowthCharts';
import CachedImage from '@/web/components/shared/CachedImage';
import { preloadImages } from '@/legacy/utils/imageCache';

import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Bacheca profilo Instagram del promoter: foto profilo, follower, seguiti.
 * Tappando la card si espande un pannello con i grafici di crescita nel tempo
 * (follower, following, semine aggiunte per giorno).
 */
export default function InstagramProfileCard({ promoterId }) {
  const [expanded, setExpanded] = useState(false);

  const { data: promoter, isLoading } = useQuery({
    queryKey: ['promoter', promoterId],
    queryFn: () => base44.entities.Promoter.get(promoterId),
    enabled: !!promoterId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const profile = promoter ? {
    profile_pic_url: promoter.ig_profile_pic_url,
    username: promoter.ig_username_synced,
    name: promoter.ig_name_synced,
    followers_count: promoter.ig_followers_synced,
    follows_count: promoter.ig_following_synced,
    updated_at: promoter.ig_profile_synced_at,
  } : null;

  // Cold-start: precarica la foto profilo IG del promoter (CDN Instagram) così non
  // flasha al primo caricamento della bacheca Messaggi. ig_profile_pic_url è diverso
  // da photo_url (gestito da PromoterPhotosPreloader): qui è la foto sincronizzata dalla Graph API.
  useEffect(() => {
    if (profile?.profile_pic_url) preloadImages([profile.profile_pic_url]);
  }, [profile?.profile_pic_url]);

  if (isLoading) {
    return (
      <Div className="rounded-2xl border border-pink-500/15 bg-card p-4 flex items-center gap-4" style={{ boxShadow: '0 4px 24px -6px rgba(236,72,153,0.10)' }}>
        <Div className="w-16 h-16 rounded-full bg-secondary animate-pulse shrink-0" />
        <Div className="flex-1 space-y-2">
          <Div className="h-4 w-32 bg-secondary rounded animate-pulse" />
          <Div className="h-3 w-48 bg-secondary rounded animate-pulse" />
        </Div>
      </Div>
    );
  }

  if (!profile) {
    return (
      <Div className="rounded-2xl border border-pink-500/15 bg-card p-4 flex items-center gap-3 text-sm text-muted-foreground" style={{ boxShadow: '0 4px 24px -6px rgba(236,72,153,0.10)' }}>
        <Instagram className="w-5 h-5 text-pink-400 shrink-0" />
        <Span>Profilo Instagram non ancora sincronizzato. Premi "Aggiorna" per recuperare i dati.</Span>
      </Div>
    );
  }

  return (
    <Div className="relative overflow-hidden rounded-2xl border border-pink-500/15 bg-card" style={{ boxShadow: '0 4px 24px -6px rgba(236,72,153,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #ec4899, transparent)' }} />
      {/* Tappable header */}
      <Btn
        button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
        {/* Profile pic */}
        <Div className="shrink-0">
          {profile.profile_pic_url ? (
            <CachedImage src={profile.profile_pic_url} alt={profile.username || 'Instagram'} className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500/30" />
          ) : (
            <Div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-violet-500/30 flex items-center justify-center ring-2 ring-pink-500/30">
              <Instagram className="w-7 h-7 text-pink-400" />
            </Div>
          )}
        </Div>
        {/* Info */}
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
            <P className="text-sm font-semibold truncate">
              {profile.name || profile.username || 'Profilo Instagram'}
            </P>
            {profile.username && (
              <Span className="text-xs text-muted-foreground truncate">@{profile.username}</Span>
            )}
          </Div>
          <Div className="flex items-center gap-4 mt-2">
            <Div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-pink-400" />
              <Span className="text-sm font-semibold">{(profile.followers_count || 0).toLocaleString('it-IT')}</Span>
              <Span className="text-xs text-muted-foreground">follower</Span>
            </Div>
            <Div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-violet-400" />
              <Span className="text-sm font-semibold">{(profile.follows_count || 0).toLocaleString('it-IT')}</Span>
              <Span className="text-xs text-muted-foreground">seguiti</Span>
            </Div>
          </Div>
          {profile.updated_at && (
            <Div className="flex items-center gap-1 mt-1.5">
              <RefreshCw className="w-2.5 h-2.5 text-muted-foreground/50" />
              <Span className="text-[10px] text-muted-foreground/60">
                Aggiornato {formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true, locale: it })} · auto ogni 5 min
              </Span>
            </Div>
          )}
        </Div>
        {/* Expand indicator */}
        <Div className="shrink-0 flex flex-col items-center gap-0.5">
          <BarChart3 className={cn('w-4 h-4 transition-colors', expanded ? 'text-pink-400' : 'text-muted-foreground/40')} />
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-300', expanded && 'rotate-180')} />
        </Div>
      </Btn>

      {/* Expandable charts panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Div className="px-4 pb-4 border-t border-pink-500/10">
              <InstagramGrowthCharts promoterId={promoterId} />
            </Div>
          </motion.div>
        )}
      </AnimatePresence>
    </Div>
  );
}