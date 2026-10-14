// Shim di react-leaflet: MapContainer raccoglie i figli dichiarati (TileLayer, GeoJSON con style/onEachFeature,
// Marker con icona L.divIcon e <Popup>) e li disegna con Leaflet vero in una WebView/iframe
// (ui/map/genericMap). Gli handler dell'originale restano nell'app:
//  - onEachFeature riceve un layer finto: bindTooltip → tooltip nella pagina, on({...}) → click richiamato
//    al tocco sull'area, mouseover/mouseout → stile di hover calcolato in anticipo (setStyle catturato);
//  - il contenuto di <Popup> si apre come scheda sopra la mappa al tocco del segnaposto.
import { Children, Fragment, createContext, isValidElement, useContext, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { View } from 'react-native';
import { GenericMap } from '@/ui/map/genericMap';
import type { GenericFeature, GenericMapPayload } from '@/ui/map/leafletGeneric';
import { Btn, Div } from '@/ui/html';
import { X } from '@/ui/icons.generated';

type AnyProps = Record<string, any>;
const MapContext = createContext({ invalidateSize() {}, setView() {}, fitBounds() {} });
export const useMap = () => useContext(MapContext);

export function TileLayer(_: AnyProps) { return null; }
export function GeoJSON(_: AnyProps) { return null; }
export function Marker(_: AnyProps) { return null; }
export function Popup(_: AnyProps) { return null; }
export function Tooltip(_: AnyProps) { return null; }

function flat(children: ReactNode, out: ReactElement[] = []): ReactElement[] {
  Children.forEach(children, (c) => {
    if (!isValidElement(c)) return;
    if (c.type === Fragment) flat((c.props as AnyProps).children, out);
    else out.push(c);
  });
  return out;
}

function featuresOf(data: any): any[] {
  if (!data) return [];
  if (data.type === 'FeatureCollection') return data.features ?? [];
  if (data.type === 'Feature') return [data];
  return Array.isArray(data) ? data : [];
}

export function MapContainer({ center, zoom, className, style, children, scrollWheelZoom, tap, bounceAtZoomLimits }: AnyProps) {
  const kids = flat(children);
  const clicks = useRef<(() => void)[][]>([]);
  const popups: ReactNode[] = [];
  const handlers: ((() => void) | undefined)[][] = [];
  const payload: GenericMapPayload = { layers: [], markers: [] };
  const others: ReactElement[] = [];
  for (const k of kids) {
    const p = k.props as AnyProps;
    if (k.type === TileLayer) payload.tileUrl = p.url;
    else if (k.type === GeoJSON) {
      const layerClicks: ((() => void) | undefined)[] = [];
      payload.layers.push(featuresOf(p.data).map((feature) => {
        const st = typeof p.style === 'function' ? p.style(feature) : p.style;
        let tooltip: GenericFeature['tooltip'] = null;
        let on: AnyProps = {};
        p.onEachFeature?.(feature, {
          bindTooltip: (html: string, options?: object) => { tooltip = { html: String(html), options }; },
          bindPopup: () => {},
          on: (h: AnyProps) => { on = { ...on, ...h }; },
          setStyle: () => {},
        });
        let hover: object | null = null;
        if (on.mouseover) on.mouseover({ target: { setStyle: (s: object) => { hover = { ...(st ?? {}), ...s }; } } });
        layerClicks.push(on.click);
        return { geometry: feature.geometry, style: st ?? {}, hover, tooltip, clickable: !!on.click };
      }));
      handlers.push(layerClicks);
    } else if (k.type === Marker) {
      const pos = Array.isArray(p.position) ? p.position : [p.position?.lat, p.position?.lng];
      const icon = p.icon?.__divIcon ? { html: p.icon.html, iconSize: p.icon.iconSize, iconAnchor: p.icon.iconAnchor, className: p.icon.className } : null;
      payload.markers.push({ lat: Number(pos[0]), lng: Number(pos[1]), icon, zIndexOffset: p.zIndexOffset });
      const popup = flat(p.children).find((c) => c.type === Popup);
      popups.push(popup ? (popup.props as AnyProps).children : null);
    } else others.push(k);
  }
  clicks.current = handlers as (() => void)[][];
  const [open, setOpen] = useState<number | null>(null);
  // centro/zoom/opzioni iniziali: come MapContainer la mappa si ricrea solo cambiando key
  const init = useMemo(() => ({
    center, zoom, className,
    options: { scrollWheelZoom: scrollWheelZoom ?? true, tap: tap ?? true, bounceAtZoomLimits: bounceAtZoomLimits ?? true },
    payload,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const onMessage = (m: { type: string; layer?: number; index?: number }) => {
    if (m.type === 'feature' && m.layer != null && m.index != null) clicks.current[m.layer]?.[m.index]?.();
    else if (m.type === 'marker' && m.index != null) setOpen(popups[m.index] != null ? m.index : null);
    else if (m.type === 'map') setOpen(null);
  };
  const popup = open != null ? popups[open] : null;
  return (
    <View style={[{ flex: 1 }, style]}>
      <GenericMap init={init} payload={payload} onMessage={onMessage} />
      <MapContext.Provider value={useMap()}>{others}</MapContext.Provider>
      {popup ? (
        <Div className="absolute left-2 right-2 bottom-2 rounded-xl bg-white p-3 shadow-xl" style={{ zIndex: 20 }}>
          <Btn className="absolute top-1 right-1 p-1" onClick={() => setOpen(null)} accessibilityLabel="Chiudi"><X className="w-4 h-4 text-gray-500" /></Btn>
          {popup}
        </Div>
      ) : null}
    </View>
  );
}
