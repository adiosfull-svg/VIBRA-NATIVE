// Mappa Leaflet generica sul telefono (WebView). Sul web: genericMap.web.tsx (iframe).
import { useEffect, useMemo, useRef } from 'react';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { leafletGenericHtml, type GenericMapInit, type GenericMapPayload } from './leafletGeneric';

export type GenericMapProps = { init: GenericMapInit; payload: GenericMapPayload; onMessage: (msg: { type: string; layer?: number; index?: number }) => void };

export function GenericMap({ init, payload, onMessage }: GenericMapProps) {
  const ref = useRef<WebView>(null);
  const html = useMemo(() => leafletGenericHtml(init), []); // eslint-disable-line react-hooks/exhaustive-deps
  const sent = useRef(JSON.stringify(init.payload));
  useEffect(() => {
    const json = JSON.stringify(payload);
    if (json === sent.current) return;
    sent.current = json;
    ref.current?.injectJavaScript(`window.__vibraHostMessage && window.__vibraHostMessage(${JSON.stringify({ type: 'update', payload })});true;`);
  }, [payload]);
  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={{ html, baseUrl: 'https://vibrayourparty.com/' }}
      onMessage={(e: WebViewMessageEvent) => { try { onMessage(JSON.parse(e.nativeEvent.data)); } catch { /* non nostro */ } }}
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
