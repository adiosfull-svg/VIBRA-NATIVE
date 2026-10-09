// Parti comuni di leafletMap.tsx (WebView) e leafletMap.web.tsx (iframe).
import { useEffect, useRef } from 'react';
import type { MapInit, MapMarker } from './leafletHtml';

export type LeafletMapProps = MapInit & {
  onVisibleChange?: (ids: string[]) => void;
  onClientClick?: (id: string) => void;
};

export type MapMessage = { type: 'visible'; ids: string[] } | { type: 'client'; id: string };

export function useMapHandlers({ onVisibleChange, onClientClick }: Pick<LeafletMapProps, 'onVisibleChange' | 'onClientClick'>) {
  const latest = useRef({ onVisibleChange, onClientClick });
  latest.current = { onVisibleChange, onClientClick };
  return (msg: MapMessage) => {
    if (msg.type === 'visible') latest.current.onVisibleChange?.(msg.ids);
    else if (msg.type === 'client') latest.current.onClientClick?.(msg.id);
  };
}

/** I marker nuovi vanno alla pagina già aperta (la posizione della mappa resta), non al primo render. */
export function useMarkerUpdates(markers: MapMarker[], send: (markers: MapMarker[]) => void) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    send(markers);
  }, [markers]); // eslint-disable-line react-hooks/exhaustive-deps
}

