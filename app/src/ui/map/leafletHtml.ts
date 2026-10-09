// Pagina HTML della mappa clienti: lo stesso codice Leaflet dell'app web originale
// (src/components/client/ClientMap.jsx: buildMarkerIcon, MarkerClusterGroup, ViewportTracker,
// MapGestureSync, stili .dark-osm/.marker-cluster e regole leaflet di index.css), eseguito in una
// pagina a sé: iframe sul web (leafletMap.web.tsx), WebView sul telefono (leafletMap.tsx).
// Messaggi pagina → app: { type: 'visible', ids } (clienti inquadrati), { type: 'client', id } (nome nel
//   popup toccato). App → pagina: { type: 'markers', markers } (window.__vibraHostMessage o postMessage).
import { LEAFLET_CSS, LEAFLET_JS, MARKERCLUSTER_CSS, MARKERCLUSTER_JS } from './leafletAssets.generated';

export type MapMarker = {
  lat: number; lng: number; color: string; initials: string; name: string; photoUrl: string;
  popupContent: string; clientId: string; isDriver: boolean;
};

export type MapInit = { center: [number, number]; zoom: number; markers: MapMarker[] };

// Regole globali dell'originale che toccano la mappa (preflight di Tailwind + index.css)
const PAGE_CSS = `
*, ::before, ::after { box-sizing: border-box; border: 0 solid #e5e7eb; }
html, body { margin: 0; padding: 0; height: 100%; background: transparent; color-scheme: dark; }
img, svg { display: block; vertical-align: middle; }
img { max-width: 100%; height: auto; }
#map { position: absolute; inset: 0; }
.leaflet-tooltip { z-index: 9999 !important; }
.promoter-popup { z-index: 9998 !important; }
.promoter-popup .leaflet-popup-content-wrapper { z-index: 9998 !important; }
.leaflet-popup-pane { z-index: 9998 !important; }
.leaflet-container { z-index: 0 !important; }
.leaflet-top, .leaflet-bottom { z-index: auto !important; }
.leaflet-marker-pane { z-index: 600 !important; }
.leaflet-overlay-pane { z-index: 400 !important; }
.leaflet-tile-pane { z-index: 200 !important; }
.leaflet-shadow-pane { z-index: 500 !important; }
.leaflet-div-icon { background: transparent !important; border: none !important; outline: none !important; box-shadow: none !important; }
.dark-osm .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9) saturate(0.4); }
.marker-cluster { background-clip: padding-box; border-radius: 50%; overflow: visible !important; }
.marker-cluster div:not(.cluster-car-strip) {
  width: 30px; height: 30px; margin-left: 5px; margin-top: 5px; text-align: center; border-radius: 50%;
  font-weight: 700; font-size: 12px; line-height: 30px; color: #fff; font-family: sans-serif;
}
.cluster-car-strip {
  position: absolute; top: 38px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 1px;
  pointer-events: none; white-space: nowrap; background: transparent !important; border: none !important;
  border-radius: 0 !important; box-shadow: none !important; width: auto !important; height: auto !important;
  margin: 0 !important; line-height: 1 !important;
}
.marker-cluster-small { background: rgba(139, 92, 246, 0.4); }
.marker-cluster-small div:not(.cluster-car-strip) { background: rgba(139, 92, 246, 0.7); }
.marker-cluster-medium { background: rgba(139, 92, 246, 0.5); }
.marker-cluster-medium div:not(.cluster-car-strip) { background: rgba(109, 40, 217, 0.8); }
.marker-cluster-large { background: rgba(139, 92, 246, 0.6); }
.marker-cluster-large div:not(.cluster-car-strip) { background: rgba(76, 29, 149, 0.9); }
`;

// Codice della pagina (JavaScript del browser, non passa da Babel): copia di ClientMap.jsx originale.
const MAP_SCRIPT = String.raw`
(function () {
  function post(msg) {
    var s = JSON.stringify(msg);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
    else window.parent.postMessage({ __vibraMap: true, payload: s }, '*');
  }
  // nome nel popup → dettaglio cliente (window.__vibraClientClick come nell'originale)
  window.__vibraClientClick = function (id) { post({ type: 'client', id: id }); };

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (s) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s];
    });
  }
  var NAME_ZOOM_THRESHOLD = 14;
  var CAR_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" width="20" height="10">'
    + '<rect x="1" y="7" width="30" height="7" rx="2" fill="#3b82f6"/>'
    + '<path d="M6 7 L9 2 L23 2 L26 7 Z" fill="#60a5fa"/>'
    + '<circle cx="8" cy="14" r="2.2" fill="#1e293b" stroke="#94a3b8" stroke-width="0.8"/>'
    + '<circle cx="24" cy="14" r="2.2" fill="#1e293b" stroke="#94a3b8" stroke-width="0.8"/>'
    + '<rect x="2" y="8" width="4" height="3" rx="0.5" fill="#fde68a" opacity="0.9"/>'
    + '<rect x="26" y="8" width="4" height="3" rx="0.5" fill="#fca5a5" opacity="0.9"/></svg>';

  function buildMarkerIcon(m, showName) {
    var circle = m.photoUrl
      ? '<div style="width:28px;height:28px;border-radius:50%;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.6);border:2px solid rgba(255,255,255,0.3);"><img src="' + m.photoUrl + '" style="width:100%;height:100%;object-fit:cover;" /></div>'
      : '<div style="width:28px;height:28px;border-radius:50%;background:' + m.color + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.6);border:2px solid rgba(255,255,255,0.3);">' + (m.initials || '?') + '</div>';
    var carBadge = m.isDriver
      ? '<div style="position:absolute;top:30px;left:50%;transform:translateX(-50%);pointer-events:none;line-height:1;">' + CAR_SVG + '</div>'
      : '';
    var label = showName
      ? '<div style="position:absolute;top:' + (m.isDriver ? 44 : 31) + 'px;left:50%;transform:translateX(-50%);background:rgba(10,10,15,0.82);color:#fff;font-size:9px;line-height:1.25;padding:1px 5px;border-radius:5px;white-space:nowrap;font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,0.5);pointer-events:none;">' + escapeHtml(m.name) + '</div>'
      : '';
    var totalHeight = m.isDriver ? 44 : 28;
    return L.divIcon({
      html: '<div style="position:relative;width:28px;height:' + totalHeight + 'px">' + circle + carBadge + label + '</div>',
      className: 'leaflet-div-icon',
      iconSize: [28, totalHeight],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  }

  var init = window.__VIBRA_MAP_INIT__;
  var markers = init.markers;
  var map = L.map('map', { center: init.center, zoom: init.zoom, scrollWheelZoom: true, tap: false, bounceAtZoomLimits: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // ── MarkerClusterGroup ──
  var mcg = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 25,
    disableClusteringAtZoom: 15,
    spiderfyOnMaxZoom: true,
    spiderfyDistanceMultiplier: 4.0,
    showCoverageOnHover: false,
    iconCreateFunction: function (cluster) {
      var count = cluster.getChildCount();
      var size = 'small';
      if (count >= 20) size = 'large';
      else if (count >= 8) size = 'medium';
      var driverCount = cluster.getAllChildMarkers().filter(function (m) { return m.options && m.options.isDriver; }).length;
      var carSvg = CAR_SVG.replace('<svg ', '<svg style="display:block;flex-shrink:0" ');
      var carStrip = driverCount > 0
        ? '<div class="cluster-car-strip">' + carSvg + (driverCount > 1 ? '<span style="font-size:8px;color:#93c5fd;font-weight:700;line-height:10px;align-self:center;margin-left:2px">x' + driverCount + '</span>' : '') + '</div>'
        : '';
      return L.divIcon({ html: '<div>' + count + '</div>' + carStrip, className: 'marker-cluster marker-cluster-' + size, iconSize: L.point(40, 40) });
    },
  });
  map.addLayer(mcg);

  var zoom = map.getZoom();
  var bounds = map.getBounds().pad(0.6);
  function renderMarkers() {
    mcg.clearLayers();
    var showNames = zoom >= NAME_ZOOM_THRESHOLD;
    markers.filter(function (m) { return bounds.contains([m.lat, m.lng]); }).forEach(function (m) {
      var marker = L.marker([m.lat, m.lng], { icon: buildMarkerIcon(m, showNames), isDriver: m.isDriver });
      marker.bindPopup(m.popupContent, { className: 'promoter-popup', maxWidth: 200 });
      mcg.addLayer(marker);
    });
  }
  // ── ViewportTracker: clienti nella porzione inquadrata (debounce 120ms + rAF) ──
  var raf = 0, visTimer = null;
  function reportVisible() {
    clearTimeout(visTimer);
    visTimer = setTimeout(function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var b = map.getBounds();
        post({ type: 'visible', ids: markers.filter(function (m) { return b.contains([m.lat, m.lng]); }).map(function (m) { return m.clientId; }) });
      });
    }, 120);
  }
  var moveTimer = null;
  map.on('zoomend moveend', function () {
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function () { zoom = map.getZoom(); bounds = map.getBounds().pad(0.6); renderMarkers(); }, 120);
    reportVisible();
  });
  renderMarkers();
  reportVisible();

  function onHostMessage(raw) {
    var msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (msg && msg.type === 'markers') { markers = msg.markers; renderMarkers(); reportVisible(); }
  }
  // telefono: la WebView chiama window.__vibraHostMessage (injectJavaScript); web: postMessage dall'iframe padre
  window.__vibraHostMessage = onHostMessage;
  window.addEventListener('message', function (e) {
    if (e.data && e.data.__vibraHost) onHostMessage(e.data.payload);
  });

  // ── MapGestureSync: pan immediato dopo il pinch (2 dita → 1 dito) ──
  (function () {
    var prevTouches = 0, panning = false, panPos = null;
    var container = map.getContainer();
    container.addEventListener('touchstart', function () { panning = false; panPos = null; }, true);
    container.addEventListener('touchmove', function (e) {
      var n = e.touches ? e.touches.length : 0;
      if (panning && n === 1) {
        var t = e.touches[0];
        map.panBy([-(t.clientX - panPos.x), -(t.clientY - panPos.y)], { animate: false });
        panPos = { x: t.clientX, y: t.clientY };
        e.preventDefault(); e.stopPropagation(); prevTouches = n; return;
      }
      if (n === 1 && prevTouches >= 2 && !panning) {
        panning = true;
        panPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        e.preventDefault(); e.stopPropagation(); prevTouches = n; return;
      }
      prevTouches = n;
    }, true);
    container.addEventListener('touchend', function (e) {
      var n = e.touches ? e.touches.length : 0;
      if (panning && n === 0) { panning = false; panPos = null; }
      prevTouches = n;
    }, true);
  })();

  // ── MapResizer: dimensioni giuste a ogni cambio di layout ──
  window.addEventListener('resize', function () { map.invalidateSize(); });
})();
`;

/** Documento completo; i dati iniziali sono nel documento (la mappa si ricrea quando cambia la key, come l'originale). */
export function leafletHtml(init: MapInit): string {
  // </script> dentro i dati non deve chiudere lo script
  const data = JSON.stringify(init).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${LEAFLET_CSS}</style><style>${MARKERCLUSTER_CSS}</style><style>${PAGE_CSS}</style>
</head><body><div id="map" class="dark-osm"></div>
<script>${LEAFLET_JS}</script><script>${MARKERCLUSTER_JS}</script>
<script>window.__VIBRA_MAP_INIT__ = ${data};</script><script>${MAP_SCRIPT}</script>
</body></html>`;
}
