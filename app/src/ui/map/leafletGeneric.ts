// Pagina HTML di una mappa Leaflet "dichiarativa" (shim di react-leaflet, web/shims/react-leaflet.tsx):
// tile, livelli GeoJSON con stile/tooltip/hover già calcolati dall'app, segnaposto con icona HTML.
// Gira in una WebView (telefono) o in un iframe (web), come la mappa clienti (leafletHtml.ts).
// Pagina → app: { type: 'feature', layer, index } (tocco su un'area), { type: 'marker', index }, { type: 'map' }.
// App → pagina: { type: 'update', payload } (window.__vibraHostMessage o postMessage dall'iframe padre).
import { LEAFLET_CSS, LEAFLET_JS } from './leafletAssets.generated';

export type GenericFeature = { geometry: unknown; properties?: unknown; style?: object; hover?: object | null; tooltip?: { html: string; options?: object } | null; clickable?: boolean };
export type GenericMarker = { lat: number; lng: number; icon?: { html?: string; iconSize?: number[]; iconAnchor?: number[]; className?: string } | null; zIndexOffset?: number };
export type GenericMapPayload = { tileUrl?: string; layers: GenericFeature[][]; markers: GenericMarker[] };
export type GenericMapInit = { center: [number, number]; zoom: number; className?: string; options?: object; payload: GenericMapPayload };

const PAGE_CSS = `
*, ::before, ::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; background: transparent; color-scheme: dark; }
#map { position: absolute; inset: 0; }
.leaflet-div-icon { background: transparent !important; border: none !important; outline: none !important; box-shadow: none !important; }
.leaflet-tooltip { z-index: 9999 !important; }
.dark-osm .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9) saturate(0.4); }
`;

const SCRIPT = `
(function () {
  var init = window.__VIBRA_MAP_INIT__;
  function post(o) {
    var s = JSON.stringify(o);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
    else window.parent.postMessage({ __vibraMap: true, payload: s }, '*');
  }
  var opts = Object.assign({ zoomControl: true }, init.options || {});
  var map = L.map('map', opts).setView(init.center, init.zoom);
  map.on('click', function () { post({ type: 'map' }); });
  var tiles = null, layers = [], markers = [];
  function render(p) {
    if (p.tileUrl && (!tiles || tiles._url !== p.tileUrl)) {
      if (tiles) map.removeLayer(tiles);
      tiles = L.tileLayer(p.tileUrl, { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    }
    layers.forEach(function (l) { map.removeLayer(l); }); layers = [];
    (p.layers || []).forEach(function (features, li) {
      var fc = { type: 'FeatureCollection', features: features.map(function (f, i) { return { type: 'Feature', geometry: f.geometry, properties: { __i: i } }; }) };
      var layer = L.geoJSON(fc, {
        style: function (feat) { return features[feat.properties.__i].style || {}; },
        onEachFeature: function (feat, l) {
          var f = features[feat.properties.__i];
          if (f.tooltip) l.bindTooltip(f.tooltip.html, f.tooltip.options || {});
          l.on('mouseover', function (e) { if (f.hover) e.target.setStyle(f.hover); });
          l.on('mouseout', function (e) { e.target.setStyle(f.style || {}); });
          if (f.clickable) l.on('click', function (e) { L.DomEvent.stopPropagation(e); post({ type: 'feature', layer: li, index: feat.properties.__i }); });
        },
      }).addTo(map);
      layers.push(layer);
    });
    markers.forEach(function (m) { map.removeLayer(m); }); markers = [];
    (p.markers || []).forEach(function (m, i) {
      var o = { zIndexOffset: m.zIndexOffset || 0 };
      if (m.icon) o.icon = L.divIcon(m.icon);
      var mk = L.marker([m.lat, m.lng], o).addTo(map);
      mk.on('click', function (e) { L.DomEvent.stopPropagation(e); post({ type: 'marker', index: i }); });
      markers.push(mk);
    });
  }
  render(init.payload);
  setTimeout(function () { map.invalidateSize(); }, 50);
  window.__vibraHostMessage = function (msg) { if (msg && msg.type === 'update') render(msg.payload); };
  window.addEventListener('message', function (e) { if (e.data && e.data.__vibraHost) window.__vibraHostMessage(e.data.payload); });
})();
`;

export function leafletGenericHtml(init: GenericMapInit): string {
  const data = JSON.stringify(init).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${LEAFLET_CSS}</style><style>${PAGE_CSS}</style>
</head><body><div id="map" class="${init.className ?? ''}"></div>
<script>${LEAFLET_JS}</script>
<script>window.__VIBRA_MAP_INIT__ = ${data};</script><script>${SCRIPT}</script>
</body></html>`;
}
