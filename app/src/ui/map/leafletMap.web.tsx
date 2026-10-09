// Mappa Leaflet sul web: la stessa pagina del telefono (leafletHtml.ts) in un iframe.
import { useEffect, useMemo, useRef } from 'react';
import { leafletHtml } from './leafletHtml';
import { useMapHandlers, useMarkerUpdates, type LeafletMapProps } from './leafletShared';

export type { LeafletMapProps } from './leafletShared';

export function LeafletMap({ center, zoom, markers, onVisibleChange, onClientClick }: LeafletMapProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const html = useMemo(() => leafletHtml({ center, zoom, markers }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const handle = useMapHandlers({ onVisibleChange, onClientClick });
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || !e.data?.__vibraMap) return;
      handle(JSON.parse(e.data.payload));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useMarkerUpdates(markers, (m) => ref.current?.contentWindow?.postMessage({ __vibraHost: true, payload: { type: 'markers', markers: m } }, '*'));
  return <iframe ref={ref} srcDoc={html} title="Mappa clienti" style={{ border: 0, width: '100%', height: '100%', display: 'block', background: 'transparent' }} />;
}
