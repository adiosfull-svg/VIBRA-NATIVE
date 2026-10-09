// Port di src/components/client/ClientMap.jsx (convertito da scripts/port/codemod.mjs).
// La mappa Leaflet (MapContainer, MarkerClusterGroup, ViewportTracker, MapGestureSync, MapResizer, buildMarkerIcon
// e il blocco <style>) gira identica in una pagina a sé: @/ui/map (iframe sul web, WebView sul telefono).
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Maximize2, Minimize2, Star, Filter, Users, Layers, X } from '@/ui/icons.generated';
import { LOCATION_BY_KEY, AREA_COLORS, AREA_CLUSTER_COLORS, CAMPANIA_LOCATIONS, AREA_LIST } from '@/web/lib/campaniaLocations';
import MapBottomBar from '@/web/components/client/MapBottomBar';
import { LeafletMap } from '@/ui/map/leafletMap';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { Circle, Path, Rect, Svg } from '@/ui/elements';

// escapeHtml, buildMarkerIcon, MarkerClusterGroup, ViewportTracker, MapGestureSync, MapResizer: in @/ui/map/leafletHtml.ts

// ── Legenda flottante zone in vista ──
function ZoneLegend({ visibleZones }) {
  const [open, setOpen] = useState(false);

  return (
    <Div className="relative">
      <Btn
        button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
          open
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30'
        }`}>
        <Layers className="w-3.5 h-3.5" />
        Zone in vista ({visibleZones.length})
      </Btn>
      {open && (
        <Div className="absolute bottom-full left-0 mb-2 w-52 rounded-xl border border-border bg-popover shadow-xl p-3 z-40">
          <Div className="flex items-center justify-between mb-2">
            <Span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Zone inquadrate</Span>
            <Btn
              button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </Btn>
          </Div>
          <Div className="space-y-1 max-h-48 overflow-y-auto recontact-scrollbar">
            {visibleZones.map(({ key, label, area, count }) => (
              <Div key={key} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/30">
                <Div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: AREA_COLORS[area] || '#666' }} />
                <Span className="text-[11px] flex-1">{label}</Span>
                <Span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary" style={{ color: AREA_COLORS[area] || '#888' }}>
                  {count}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ── Pannello Zone Conquistate ──
function ZoneRanking({ clientsWithLocation, onZoneClick }) {
  // Raggruppa per area macro + zona specifica
  const areaZones = useMemo(() => {
    const map = {};
    clientsWithLocation.forEach(c => {
      const loc = LOCATION_BY_KEY[c.residenza_key];
      if (!loc) return;
      if (!map[loc.area]) map[loc.area] = { zones: {}, total: 0 };
      if (!map[loc.area].zones[loc.key]) map[loc.area].zones[loc.key] = { ...loc, clients: [] };
      map[loc.area].zones[loc.key].clients.push(c);
      map[loc.area].total++;
    });
    return map;
  }, [clientsWithLocation]);

  // Ordina aree per numero clienti
  const sortedAreas = Object.entries(areaZones).sort((a, b) => b[1].total - a[1].total);

  return (
    <Div className="space-y-2">
      <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Zone Conquistate</P>
      {sortedAreas.map(([area, data]) => {
        const zoneEntries = Object.entries(data.zones).sort((a, b) => b[1].clients.length - a[1].clients.length);
        return (
          <Div key={area}>
            <Div className="flex items-center gap-2 mb-1">
              <Div className="w-2 h-2 rounded-full shrink-0" style={{ background: AREA_COLORS[area] || '#666' }} />
              <Span className="text-xs font-semibold">{area}</Span>
              <Span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary ml-auto" style={{ color: AREA_COLORS[area] }}>
                {data.total}
              </Span>
            </Div>
            <Div className="ml-3 space-y-0.5">
              {zoneEntries.map(([key, zone]) => {
                const drivers = zone.clients.filter(c => c.is_driver).length;
                return (
                  <Btn
                    button
                    key={key}
                    onClick={() => onZoneClick(key)}
                    className="w-full flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-secondary/30 transition-colors">
                    <Span className="text-[10px] text-muted-foreground truncate flex-1">{zone.label}</Span>
                    {drivers > 0 && (
                      <Span className="text-[9px] text-blue-400 font-semibold flex items-center gap-0.5 shrink-0">
                        <Svg viewBox="0 0 24 12" width="18" height="9" fill="none"><Rect x="1" y="5" width="22" height="6" rx="2" fill="#3b82f6"/><Path d="M4 5 L6.5 1.5 L17.5 1.5 L20 5 Z" fill="#60a5fa"/><Circle cx="6" cy="11" r="1.8" fill="#1e3a5f" stroke="#93c5fd" strokeWidth="0.8"/><Circle cx="18" cy="11" r="1.8" fill="#1e3a5f" stroke="#93c5fd" strokeWidth="0.8"/></Svg>
                        {drivers}
                      </Span>
                    )}
                    <Span className="text-[10px] font-semibold shrink-0">{zone.clients.length}</Span>
                  </Btn>
                );
              })}
            </Div>
          </Div>
        );
      })}
    </Div>
  );
}

// ── Componente principale ──
export default function ClientMap({ clients, onClientClick, clientStatsMap = {}, events = [] }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [showLeadersOnly, setShowLeadersOnly] = useState(false);
  const [focusZone, setFocusZone] = useState(null);
  const [visibleIds, setVisibleIds] = useState([]);

  const handleVisibleChange = useCallback((ids) => setVisibleIds(ids), []);

  // ─── Popup click: nome cliente cliccabile → apre dettaglio ───
  const onClientClickRef = useRef(onClientClick);
  onClientClickRef.current = onClientClick;

  // window.__vibraClientClick è nella pagina della mappa, che lo inoltra a onClientClick
  const handleMapClientClick = useCallback((clientId) => onClientClickRef.current?.(clientId), []);

  // Filtra clienti con residenza_key
  const clientsWithLocation = useMemo(() => {
    let list = clients.filter(c => c.residenza_key && LOCATION_BY_KEY[c.residenza_key]);
    if (showLeadersOnly) list = list.filter(c => c.is_leader);
    return list;
  }, [clients, showLeadersOnly]);

  const totalMapped = clientsWithLocation.length;
  const unmapped = clients.length - totalMapped;

  // Hash stabile da stringa → numero in [0, 1)
  const stableHash = (seed) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    }
    return ((h % 100000) + 100000) % 100000 / 100000;
  };

  // Prepara markers per ogni cliente — distribuzione circolare uniforme per zona
  const markers = useMemo(() => {
    // Raggruppa clienti per zona per distribuirli in cerchio
    const byZone = {};
    clientsWithLocation.forEach(c => {
      const zk = c.residenza_key;
      if (!byZone[zk]) byZone[zk] = [];
      byZone[zk].push(c);
    });

    // Raggio del cerchio in gradi (~0.003 = ~330m)
    const CIRCLE_RADIUS = 0.003;

    return clientsWithLocation.map(c => {
      const loc = LOCATION_BY_KEY[c.residenza_key];
      const color = AREA_CLUSTER_COLORS?.[loc.area] || AREA_COLORS[loc.area] || '#8b5cf6';
      
      const escapedId = c.id.replace(/'/g, "\\'");
      const popupContent = `
        <div style="font-family:sans-serif;min-width:140px">
          <p style="font-weight:700;font-size:13px;margin-bottom:2px;cursor:pointer;color:#111827;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px" onclick="window.__vibraClientClick('${escapedId}');return false;" title="Apri dettaglio cliente">${c.name}</p>
          ${c.is_leader ? '<p style="font-size:10px;color:#eab308;margin-bottom:4px">⭐ Leader</p>' : ''}
          <p style="font-size:10px;color:#aaa;margin-bottom:2px">📍 ${loc.label}</p>
          <p style="font-size:10px;color:#888">🗺 ${loc.area}</p>
        </div>
      `;

      // Iniziali nome+cognome (es. "Mario Rossi" → "MR")
      const nameParts = (c.name || '').trim().split(/\s+/).filter(Boolean);
      const initials = nameParts.length >= 2
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : (nameParts[0]?.[0] || '?').toUpperCase();

      // Distribuzione circolare: ogni cliente della stessa zona riceve un angolo equamente spaziato
      const zoneClients = byZone[loc.key] || [];
      const totalInZone = zoneClients.length;
      
      // Hash stabile per ordinare i clienti nella zona (deterministico)
      const sorted = [...zoneClients].sort((a, b) => {
        const ha = stableHash(a.id + loc.key);
        const hb = stableHash(b.id + loc.key);
        return ha - hb;
      });
      const idx = sorted.findIndex(x => x.id === c.id);
      
      // Angolo distribuito uniformemente attorno al cerchio
      const angle = totalInZone > 1 
        ? (idx / totalInZone) * Math.PI * 2 
        : stableHash(c.id + 'angle') * Math.PI * 2;
      
      const jitterLat = Math.cos(angle) * CIRCLE_RADIUS;
      const jitterLng = Math.sin(angle) * CIRCLE_RADIUS * 0.75; // compensa lat/lng ratio

      return {
        lat: loc.lat + jitterLat,
        lng: loc.lng + jitterLng,
        color,
        initials,
        name: c.name,
        photoUrl: c.photo_url || '',
        popupContent,
        clientId: c.id,
        isDriver: !!c.is_driver,
      };
    });
  }, [clientsWithLocation]);

  // Rating per cliente (pre-calcolato in backend come cum_rating)
  const ratingById = useMemo(() => {
    const m = {};
    clientsWithLocation.forEach(c => { m[c.id] = c.cum_rating || null; });
    return m;
  }, [clientsWithLocation]);

  const clientsById = useMemo(
    () => Object.fromEntries(clientsWithLocation.map(c => [c.id, c])),
    [clientsWithLocation]
  );

  // Clienti visibili nella porzione di mappa, ordinati per rating decrescente
  const visibleClients = useMemo(() => {
    return visibleIds
      .map(id => ({ client: clientsById[id], rating: ratingById[id] }))
      .filter(x => x.client)
      .sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  }, [visibleIds, clientsById, ratingById]);

  // Zone visibili nella porzione di mappa (aggregate per residenza_key unica)
  const visibleZones = useMemo(() => {
    const zoneMap = {};
    visibleIds.forEach(id => {
      const c = clientsById[id];
      if (!c?.residenza_key) return;
      const loc = LOCATION_BY_KEY[c.residenza_key];
      if (!loc) return;
      if (!zoneMap[loc.key]) zoneMap[loc.key] = { ...loc, count: 0 };
      zoneMap[loc.key].count++;
    });
    return Object.values(zoneMap).sort((a, b) => b.count - a.count);
  }, [visibleIds, clientsById]);

  // Centra su zona focus — default: Napoli centro (dove ci sono più contatti)
  const focusCoords = focusZone ? LOCATION_BY_KEY[focusZone] : null;
  const mapCenter = focusCoords ? [focusCoords.lat, focusCoords.lng] : [40.835, 14.250];
  const mapZoom = focusCoords ? 14 : 11;

  // ── Layout mappa: collapse usa height fissa, fullscreen usa catena flex ──
  const isFull = fullscreen;

  return (
    <Div className={isFull
      ? 'fixed inset-0 z-50 bg-background flex flex-col p-4 gap-3'
      : 'rounded-2xl bg-card border border-border p-4 space-y-3'
    }>
      {/* Header */}
      <Div className="flex items-center justify-between flex-wrap gap-3">
        <Div>
          <H className="text-base font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Mappa Clienti — Campania
          </H>
          <P className="text-[10px] text-muted-foreground">
            {totalMapped} clienti geolocalizzati{unmapped > 0 ? ` · ${unmapped} senza zona` : ''}
          </P>
        </Div>
        <Div className="flex items-center gap-2">
          <Div className="flex gap-2 text-center">
            <Div className="bg-secondary/30 rounded-lg px-3 py-1.5">
              <P className="text-lg font-bold text-primary">{totalMapped}</P>
              <P className="text-[10px] text-muted-foreground">Mappati</P>
            </Div>
          </Div>
          <Btn
            button
            onClick={() => setShowLeadersOnly(!showLeadersOnly)}
            className={`p-2 rounded-lg border transition-all ${showLeadersOnly ? 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400' : 'border-border hover:bg-secondary/40 text-muted-foreground'}`}
            accessibilityLabel="Filtra solo Leader">
            <Star className="w-4 h-4" />
          </Btn>
          <Btn
            button
            onClick={() => setFullscreen(f => !f)}
            className="p-2 rounded-lg border border-border hover:bg-secondary/40 transition-all"
            accessibilityLabel={fullscreen ? 'Esci da schermo intero' : 'Schermo intero'}>
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Btn>
        </Div>
      </Div>

      {/* Layout mappa + pannello */}
      {isFull ? (
        /* FULLSCREEN: catena flex — funziona perché fixed inset-0 dà altezza certa */
        <Div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">
          <Div className="rounded-xl border border-border flex-1" style={{ minHeight: 280 }}>
            <LeafletMap
              key={`fs-${focusZone || 'def'}-${showLeadersOnly ? 'ld' : 'all'}`}
              center={mapCenter}
              zoom={mapZoom}
              markers={markers}
              onVisibleChange={handleVisibleChange}
              onClientClick={handleMapClientClick}
            />
          </Div>
          <Div className="lg:w-64 space-y-3 overflow-y-auto max-h-full">
            {focusZone && (
              <Btn
                button
                onClick={() => setFocusZone(null)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-colors">
                <Filter className="w-3 h-3" /> Mostra tutta la Campania
              </Btn>
            )}
            <ZoneRanking clientsWithLocation={clientsWithLocation} onZoneClick={(key) => setFocusZone(key)} />
            {unmapped > 0 && (
              <Div className="pt-2 border-t border-border">
                <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1"><Users className="w-3 h-3 inline mr-1" />Senza zona ({unmapped})</P>
                <Div className="flex flex-wrap gap-1">
                  {clients.filter(c => !c.residenza_key).slice(0, 15).map(c => (
                    <Span key={c.id} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">{c.name}</Span>
                  ))}
                  {unmapped > 15 && <Span className="text-[10px] text-muted-foreground">+{unmapped - 15} altri</Span>}
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      ) : (
        /* COLLAPSE: height fissa esplicita — nessuna catena flex, Leaflet legge px subito */
        <Div className="flex flex-col lg:flex-row gap-3">
          <Div className="rounded-xl border border-border lg:flex-1" style={{ height: 420 }}>
            <LeafletMap
              key={`nr-${focusZone || 'def'}-${showLeadersOnly ? 'ld' : 'all'}`}
              center={mapCenter}
              zoom={mapZoom}
              markers={markers}
              onVisibleChange={handleVisibleChange}
              onClientClick={handleMapClientClick}
            />
          </Div>
          <Div className="lg:w-64 space-y-3 overflow-y-auto" style={{ maxHeight: 420 }}>
            {focusZone && (
              <Btn
                button
                onClick={() => setFocusZone(null)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-colors">
                <Filter className="w-3 h-3" /> Mostra tutta la Campania
              </Btn>
            )}
            <ZoneRanking clientsWithLocation={clientsWithLocation} onZoneClick={(key) => setFocusZone(key)} />
            {unmapped > 0 && (
              <Div className="pt-2 border-t border-border">
                <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1"><Users className="w-3 h-3 inline mr-1" />Senza zona ({unmapped})</P>
                <Div className="flex flex-wrap gap-1">
                  {clients.filter(c => !c.residenza_key).slice(0, 15).map(c => (
                    <Span key={c.id} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">{c.name}</Span>
                  ))}
                  {unmapped > 15 && <Span className="text-[10px] text-muted-foreground">+{unmapped - 15} altri</Span>}
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      )}

      {/* Bottom bar dinamica: clienti nella porzione di mappa inquadrata */}
      <MapBottomBar visibleClients={visibleClients} onClientClick={onClientClick} />

      {/* Legenda flottante zone visibili — toggle on/off */}
      {visibleZones.length > 0 && <ZoneLegend visibleZones={visibleZones} />}

      {/* Stili custom per marker cluster — cerchio nativo Leaflet invariato */}
      {null}
    </Div>
  );
}

// Export anche helper per altri usi
export { AREA_CLUSTER_COLORS } from '@/web/lib/campaniaLocations';
