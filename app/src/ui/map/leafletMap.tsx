// Mappa Leaflet sul telefono: la pagina di leafletHtml.ts in una WebView (Leaflet incluso nella
// pagina; servono solo le tile di OpenStreetMap). Sul web: leafletMap.web.tsx (iframe).
import { useMemo, useRef } from 'react';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { leafletHtml } from './leafletHtml';
import { useMapHandlers, useMarkerUpdates, type LeafletMapProps } from './leafletShared';

export type { LeafletMapProps } from './leafletShared';

export function LeafletMap({ center, zoom, markers, onVisibleChange, onClientClick }: LeafletMapProps) {
  const ref = useRef<WebView>(null);
  // centro/zoom/marker iniziali: la mappa si ricrea quando cambia la key (come MapContainer nell'originale)
  const html = useMemo(() => leafletHtml({ center, zoom, markers }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const handle = useMapHandlers({ onVisibleChange, onClientClick });
  useMarkerUpdates(markers, (m) => {
    const msg = JSON.stringify({ type: 'markers', markers: m });
    ref.current?.injectJavaScript(`window.__vibraHostMessage && window.__vibraHostMessage(${msg});true;`);
  });
  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      // baseUrl https: le tile di OpenStreetMap ricevono un Referer valido
      source={{ html, baseUrl: 'https://vibrayourparty.com/' }}
      onMessage={(e: WebViewMessageEvent) => { try { handle(JSON.parse(e.nativeEvent.data)); } catch { /* messaggio non nostro */ } }}
      style={{ flex: 1, backgroundColor: 'transparent' }}
      javaScriptEnabled
      domStorageEnabled
      nestedScrollEnabled
      setSupportMultipleWindows={false}
      overScrollMode="never"
      bounces={false}
    />
  );
}
