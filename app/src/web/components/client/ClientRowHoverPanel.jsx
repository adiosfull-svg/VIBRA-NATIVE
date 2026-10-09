// Port di src/components/client/ClientRowHoverPanel.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Instagram, MapPin, Navigation, Car, ArrowRightLeft } from '@/ui/icons.generated';
import { ClientSourceBadge } from '@/web/components/client/ClientSourceDisplay';
import { useMarkClientContacted } from '@/web/hooks/useMarkClientContacted';
import ClientTipologiaBadge from '@/web/components/client/ClientTipologiaBadge';

import { Div, Span } from '@/ui/html';
import { A, Path, Svg } from '@/ui/elements';

/** Icona WhatsApp ufficiale (bubble verde con cornetta bianca) */
function WhatsAppIcon({ className }) {
  return (
    <Svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </Svg>
  );
}

/**
 * Popup sovraelevato che appare al passaggio del mouse sulla riga desktop.
 * Fluttua SOPRA la riga (assoluto, sfondo solido + ombra) così può mostrare
 * tutti i contatti e il nome completo del "conosciuto tramite" senza tagliare,
 * coprendo le colonne statistiche sottostanti come un tooltip elevato.
 * Animazione compositor-only (opacity + transform) a 150ms, niente lag.
 */
export default function ClientRowHoverPanel({ client, referredName, interactive }) {
  const markContacted = useMarkClientContacted();
  const phone = client.phone;
  const igHandle = client.instagram;
  const igUrl = client.instagram_profile_url || (igHandle ? `https://instagram.com/${igHandle.replace(/^@/, '')}` : null);
  const zone = client.residenza_key ? client.residenza_key.replace(/_/g, ' ').replace(/^[A-Z]{2}\s*/, '') : null;
  const address = client.address;
  const isDriver = client.is_driver;
  const sourceType = client.source_type;

  if (!phone && !igHandle && !igUrl && !zone && !address && !isDriver && !sourceType) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <Div
      className={`absolute left-[450px] top-0.5 bottom-0.5 z-30
                 flex items-center gap-2 pl-2.5 pr-3
                 bg-card border border-border/70 rounded-lg
                 shadow-xl shadow-black/50
                 opacity-0 translate-y-1
                 group-hover:opacity-100 group-hover:translate-y-0
                 transition-[opacity,transform] duration-150 ease-out delay-250
                 [will-change:opacity,transform]
                 ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Conosciuto tramite — nome completo (no truncate) */}
      {sourceType === 'referred' && referredName && (
        <Span
          className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-400/30 shrink-0"
          accessibilityLabel={`Conosciuto via ${referredName}`}
        >
          <ArrowRightLeft className="w-3 h-3 shrink-0" />
          <Span className="whitespace-nowrap">Via {referredName}</Span>
        </Span>
      )}
      {sourceType && sourceType !== 'referred' && (
        <ClientSourceBadge sourceType={sourceType} size="xs" />
      )}

      {/* WhatsApp — apre la chat e segna automaticamente il contatto come sentito */}
      {phone && (
        <A
          href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { stop(e); markContacted(client.id); }}
          className="flex items-center gap-1.5 text-[11px] text-foreground/80 hover:text-green-400 transition-colors shrink-0"
          accessibilityLabel={`Contatta ${phone} su WhatsApp`}
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          <Span className="font-medium tabular-nums">{phone}</Span>
        </A>
      )}

      {/* Instagram */}
      {igHandle && (
        <A
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={stop}
          className="flex items-center gap-1.5 text-[11px] text-foreground/80 hover:text-pink-400 transition-colors shrink-0"
          accessibilityLabel={`Apri ${igHandle} su Instagram`}
        >
          <Span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shrink-0">
            <Instagram className="w-3 h-3 text-white" />
          </Span>
          <Span className="font-medium">{igHandle}</Span>
        </A>
      )}

      {/* Zona di residenza */}
      {zone && (
        <Div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
          <MapPin className="w-3.5 h-3.5 text-purple-400" />
          <Span className="font-medium">{zone}</Span>
        </Div>
      )}

      {/* Indirizzo (badge mappe) */}
      {address && (
        <A
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={stop}
          className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 border border-amber-500/40 rounded-full px-2.5 py-1 hover:bg-amber-500/10 transition-colors shrink-0"
          accessibilityLabel="Apri in Google Maps"
        >
          <Navigation className="w-3 h-3" />
          <Span className="uppercase tracking-wide truncate max-w-[180px]">{address}</Span>
        </A>
      )}

      {/* Badge Guidatore (icona only) */}
      {isDriver && (
        <Div
          className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center shrink-0"
          accessibilityLabel="Guidatore"
        >
          <Car className="w-3 h-3 text-blue-400" />
        </Div>
      )}

      {/* Tipologia caratteriale */}
      <ClientTipologiaBadge tipologia={client.tipologia_cliente} />
    </Div>
  );
}