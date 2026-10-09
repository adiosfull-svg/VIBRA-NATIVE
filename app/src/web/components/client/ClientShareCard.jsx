// Port di src/components/client/ClientShareCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useState } from 'react';
import useCachedImage from '@/web/hooks/useCachedImage';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

import { Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

/**
 * Scheda riepilogativa cliente per la condivisione (html2canvas → navigator.share).
 * Usa inline style con hex (non variabili CSS Tailwind) perché html2canvas non
 * risolve sempre le variabili HSL. Il ref viene passato dal parent per il capture.
 */
export default function ClientShareCard({ client, cardRef, rank }) {
  const photoUrl = useCachedImage(client?.photo_url || '');
  const { logoDataUrl: vibraLogo } = useVibraLogo();
  const { getVenueLogo } = useAllVenueLogos();

  // Top venue dal cum_venue_counts
  const venueCounts = client?.cum_venue_counts || {};
  const topVenueEntry = Object.entries(venueCounts).sort((a, b) => b[1] - a[1])[0];
  const topVenueName = topVenueEntry?.[0] || '';
  const topVenueCount = topVenueEntry?.[1] || 0;
  const { logoUrl: venueLogoUrl } = getVenueLogo(topVenueName);
  const venueLogo = useCachedImage(venueLogoUrl || '');

  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => { setImgLoaded(false); }, [photoUrl]);

  const rating = client?.cum_rating || 0;
  const visits = client?.cum_visits || 0;
  const totalSpent = client?.cum_total_spent || 0;
  const peopleBrought = client?.new_people_brought || 0;
  const initials = (client?.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Giorno preferito
  const days = [
    { label: 'Ven', val: client?.cum_fri || 0 },
    { label: 'Sab', val: client?.cum_sat || 0 },
    { label: 'Dom', val: client?.cum_sun || 0 },
    { label: 'Extra', val: client?.cum_extra || 0 },
  ];
  const topDay = days.reduce((a, b) => (b.val > a.val ? b : a), days[0]);

  return (
    <Div ref={cardRef} style={{
      width: 380,
      background: 'linear-gradient(135deg, #140a26 0%, #2a1551 45%, #1a0e36 100%)',
      borderRadius: 20,
      padding: 24,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Cerchi decorativi */}
      <Div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: '50%', background: 'rgba(167,139,250,0.10)' }} />
      <Div style={{ position: 'absolute', bottom: -40, left: -40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(167,139,250,0.07)' }} />

      {/* Profilo — foto sempre renderizzata sopra le iniziali (fallback) */}
      <Div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, position: 'relative' }}>
        <Div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(196,181,253,0.15))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 700, color: '#c4b5fd', flexShrink: 0,
          position: 'relative', overflow: 'hidden',
          border: '3px solid rgba(167,139,250,0.45)',
        }}>
          <Span style={{ position: 'relative', zIndex: 1 }}>{initials}</Span>
          {photoUrl && (
            <Img
              src={photoUrl}
              onLoad={() => setImgLoaded(true)}
              style={{
                position: 'absolute', inset: -3, width: 'calc(100% + 6px)', height: 'calc(100% + 6px)',
                objectFit: 'cover', borderRadius: '50%',
                opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.15s',
                zIndex: 2,
              }} />
          )}
        </Div>
        <Div style={{ flex: 1, minWidth: 0 }}>
          <Div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <P style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>{client?.name || 'Cliente'}</P>
            {client?.is_leader && <Span style={{ fontSize: 18 }}>⭐</Span>}
          </Div>
          {rating > 0 && (
            <Div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
              <Span style={{ fontSize: 15 }}>💎</Span>
              <Span style={{ fontSize: 17, fontWeight: 700, color: '#c4b5fd' }}>{rating.toFixed(1)}</Span>
              <Span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/ 10</Span>
            </Div>
          )}
        </Div>
      </Div>

      {/* Stats grid — 3 colonne, etichette e valori allineati su baseline uguale */}
      <Div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
        <Div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 6px', textAlign: 'center' }}>
          <Div style={{ height: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 6 }}>
            <Span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>Presenze</Span>
          </Div>
          <P style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#ffffff', textAlign: 'center' }}>{visits}</P>
        </Div>
        <Div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 6px', textAlign: 'center' }}>
          <Div style={{ height: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 6 }}>
            <Span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>Posizione</Span>
          </Div>
          <P style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#ffffff', textAlign: 'center' }}>{rank ? `#${rank}` : '—'}</P>
        </Div>
        <Div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 6px', textAlign: 'center' }}>
          <Div style={{ height: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 6 }}>
            <Span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>Persone portate</Span>
          </Div>
          <P style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#ffffff', textAlign: 'center' }}>{peopleBrought}</P>
        </Div>
      </Div>

      {/* Locale top + giorno top */}
      <Div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {topVenueName && (
          <Div style={{ flex: 1, background: 'rgba(167,139,250,0.12)', borderRadius: 14, padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <Div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {venueLogo ? (
                <Img
                  src={venueLogo}
                  style={{ width: 46, height: 46, borderRadius: 8, objectFit: 'contain' }} />
              ) : (
                <Span style={{ fontSize: 32 }}>🏟️</Span>
              )}
            </Div>
            <Div style={{ minWidth: 0, textAlign: 'center' }}>
              <P style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, textAlign: 'center' }}>Locale top</P>
              <P style={{ fontSize: 12, fontWeight: 700, margin: 0, color: '#c4b5fd', textAlign: 'center', lineHeight: 1.2 }}>{topVenueName} ({topVenueCount})</P>
            </Div>
          </Div>
        )}
        {topDay.val > 0 && (
          <Div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Span style={{ fontSize: 32 }}>🔥</Span>
            </Div>
            <Div style={{ textAlign: 'center' }}>
              <P style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, textAlign: 'center' }}>Giorno top</P>
              <P style={{ fontSize: 12, fontWeight: 700, margin: 0, color: '#c4b5fd', textAlign: 'center' }}>{topDay.label} ({topDay.val})</P>
            </Div>
          </Div>
        )}
      </Div>

      {/* Data di condivisione */}
      <Div style={{ textAlign: 'center', marginBottom: 14 }}>
        <Span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
          {format(new Date(), 'd MMM yyyy', { locale: it })}
        </Span>
      </Div>

      {/* Vibra logo */}
      {vibraLogo && (
        <Div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, paddingBottom: 0 }}>
          <Img
            src={vibraLogo}
            style={{ height: 60, objectFit: 'contain', display: 'block', margin: '0 auto' }}
            alt="Vibra" />
        </Div>
      )}
    </Div>
  );
}