// Mappa Leaflet generica sul web: la stessa pagina del telefono (leafletGeneric.ts) in un iframe.
import { useEffect, useMemo, useRef } from 'react';
import { leafletGenericHtml } from './leafletGeneric';
import type { GenericMapProps } from './genericMap';

export function GenericMap({ init, payload, onMessage }: GenericMapProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const html = useMemo(() => leafletGenericHtml(init), []); // eslint-disable-line react-hooks/exhaustive-deps
  const handler = useRef(onMessage);
  handler.current = onMessage;
  const sent = useRef(JSON.stringify(init.payload));
  useEffect(() => {
    const listen = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || !e.data?.__vibraMap) return;
      handler.current(JSON.parse(e.data.payload));
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, []);
  useEffect(() => {
    const json = JSON.stringify(payload);
    if (json === sent.current) return;
    sent.current = json;
    ref.current?.contentWindow?.postMessage({ __vibraHost: true, payload: { type: 'update', payload } }, '*');
  }, [payload]);
  return <iframe ref={ref} srcDoc={html} title="Mappa" style={{ border: 0, width: '100%', height: '100%', display: 'block', background: 'transparent' }} />;
}
