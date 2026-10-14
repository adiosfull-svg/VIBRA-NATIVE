// Port di src/components/promoter/NapoliCoverageMap.jsx (convertito da scripts/port/codemod.mjs).
// PORT: react-leaflet/leaflet → web/shims (Leaflet vero in WebView/iframe); lo stile .dark-osm è nella pagina della mappa.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Maximize2, Minimize2 } from '@/ui/icons.generated';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from '@/web/shims/react-leaflet';
import L from '@/web/shims/leaflet';
import { NAPOLI_QUARTIERI_GEOJSON, NEIGHBORHOOD_KEYWORD_MAP } from './napoliQuartieriData';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const AREA_COLORS = {
  'Napoli Centro': '#8b5cf6',
  'Napoli Nord':   '#6366f1',
  'Napoli Est':    '#0ea5e9',
  'Napoli Ovest':  '#14b8a6',
  'Napoli Sud':    '#ec4899',
  'Campi Flegrei': '#f97316',
  'Vesuviano':     '#ef4444',
  'Nolano':        '#eab308',
  'Casertano':     '#22c55e',
  'Salernitano':   '#06b6d4',
  'Beneventano':   '#84cc16',
};

// Centroidi di riserva per macro-area, usati quando il fetch remoto dei confini
// comunali non è disponibile (es. rete mobile lenta/bloccata): senza questi, un
// promoter senza lat/lng precisi e senza match di quartiere resterebbe senza pin.
const AREA_FALLBACK_CENTROIDS = {
  'Napoli Centro': [40.8518, 14.2681],
  'Napoli Nord':   [40.9300, 14.2200],
  'Napoli Est':    [40.8380, 14.3500],
  'Napoli Ovest':  [40.8280, 14.1850],
  'Napoli Sud':    [40.8000, 14.1900],
  'Campi Flegrei': [40.8226, 14.1194],
  'Vesuviano':     [40.7869, 14.3720],
  'Nolano':        [40.9280, 14.5340],
  'Casertano':     [41.0672, 14.3327],
  'Salernitano':   [40.6824, 14.7681],
  'Beneventano':   [41.1298, 14.7826],
};

const PROMOTER_COLORS = [
  '#8b5cf6', '#ec4899', '#0ea5e9', '#f97316',
  '#14b8a6', '#ef4444', '#eab308', '#22c55e',
  '#06b6d4', '#84cc16', '#6366f1', '#a855f7',
];

const COMUNE_TO_AREA = {
  'Napoli': 'Napoli Centro',
  'Marano di Napoli': 'Napoli Nord', 'Calvizzano': 'Napoli Nord', 'Qualiano': 'Napoli Nord',
  'Mugnano di Napoli': 'Napoli Nord', 'Melito di Napoli': 'Napoli Nord',
  'Giugliano in Campania': 'Napoli Nord', 'Villaricca': 'Napoli Nord', 'Arzano': 'Napoli Nord',
  'Casavatore': 'Napoli Nord', 'Casoria': 'Napoli Nord', 'Afragola': 'Napoli Nord',
  'Caivano': 'Napoli Nord', 'Cardito': 'Napoli Nord', 'Crispano': 'Napoli Nord',
  'Frattamaggiore': 'Napoli Nord', 'Frattaminore': 'Napoli Nord', "Sant'Antimo": 'Napoli Nord',
  'Grumo Nevano': 'Napoli Nord', 'Grumo': 'Napoli Nord',
  'San Giorgio a Cremano': 'Napoli Est', 'Portici': 'Napoli Est', 'Cercola': 'Napoli Est', 'Volla': 'Napoli Est',
  'Quarto': 'Napoli Ovest',
  'Pozzuoli': 'Campi Flegrei', 'Licola': 'Campi Flegrei', 'Bacoli': 'Campi Flegrei', 'Monte di Procida': 'Campi Flegrei',
  'Ischia': 'Campi Flegrei', 'Forio': 'Campi Flegrei', 'Casamicciola Terme': 'Campi Flegrei',
  'Lacco Ameno': 'Campi Flegrei', 'Procida': 'Campi Flegrei', 'Serrara Fontana': 'Campi Flegrei',
  "Barano d'Ischia": 'Campi Flegrei',
  'Ercolano': 'Vesuviano', 'Torre del Greco': 'Vesuviano', 'Torre Annunziata': 'Vesuviano',
  'Boscoreale': 'Vesuviano', 'Boscotrecase': 'Vesuviano', 'Trecase': 'Vesuviano',
  'Terzigno': 'Vesuviano', 'Pompei': 'Vesuviano', 'Scafati': 'Vesuviano',
  "Sant'Antonio Abate": 'Vesuviano',   'Castellammare di Stabia': 'Vesuviano', 'Castellammare': 'Vesuviano', 'Gragnano': 'Vesuviano',
  'Pimonte': 'Vesuviano', 'Lettere': 'Vesuviano', "Sant'Agnello": 'Vesuviano',
  'Piano di Sorrento': 'Vesuviano', 'Meta': 'Vesuviano', 'Sorrento': 'Vesuviano',
  'Massa Lubrense': 'Vesuviano', 'Vico Equense': 'Vesuviano', 'Capri': 'Vesuviano', 'Anacapri': 'Vesuviano',
  'Nola': 'Nolano', 'Marigliano': 'Nolano', 'Mariglianella': 'Nolano',
  "Pomigliano d'Arco": 'Nolano', 'Acerra': 'Nolano', 'Brusciano': 'Nolano',
  'Castello di Cisterna': 'Nolano', 'Cicciano': 'Nolano', 'Cimitile': 'Nolano',
  'Camposano': 'Nolano', 'Casamarciano': 'Nolano', 'Comiziano': 'Nolano', 'Liveri': 'Nolano',
  'Palma Campania': 'Nolano', 'Roccarainola': 'Nolano', 'San Gennaro Vesuviano': 'Nolano',
  'San Paolo Bel Sito': 'Nolano', 'San Vitaliano': 'Nolano', 'Saviano': 'Nolano',
  'Scisciano': 'Nolano', 'Somma Vesuviana': 'Nolano', 'Sperone': 'Nolano',
  'Tufino': 'Nolano', 'Ottaviano': 'Nolano', 'San Giuseppe Vesuviano': 'Nolano',
  'Poggiomarino': 'Nolano', 'Striano': 'Nolano', 'Sarno': 'Nolano', 'Baiano': 'Nolano',
  // Casertano
  'Caserta': 'Casertano', 'Santa Maria Capua Vetere': 'Casertano', 'Aversa': 'Casertano',
  'Marcianise': 'Casertano', 'Maddaloni': 'Casertano', 'Capua': 'Casertano',
  'San Nicola la Strada': 'Casertano', 'Casagiove': 'Casertano', 'Succivo': 'Casertano',
  'Orta di Atella': 'Casertano', 'Casal di Principe': 'Casertano', 'Villa Literno': 'Casertano',
  'San Cipriano di Aversa': 'Casertano', 'Gricignano di Aversa': 'Casertano',
  'Teverola': 'Casertano', 'Carinaro': 'Casertano', 'Lusciano': 'Casertano',
  'Parete': 'Casertano', 'Trentola-Ducenta': 'Casertano', 'Frignano': 'Casertano',
  'San Marcellino': 'Casertano', 'Cesa': 'Casertano', 'Recale': 'Casertano',
  'Santa Maria la Fossa': 'Casertano', 'San Tammaro': 'Casertano', 'Curti': 'Casertano',
  'Portico di Caserta': 'Casertano', 'San Prisco': 'Casertano', 'Macerata Campania': 'Casertano',
  "Sant'Angelo in Formis": 'Casertano', 'Castel Volturno': 'Casertano', 'Mondragone': 'Casertano',
  'Cellole': 'Casertano', 'Sessa Aurunca': 'Casertano', 'Teano': 'Casertano',
  'Sparanise': 'Casertano', 'Pietramelara': 'Casertano', 'Vitulazio': 'Casertano',
  'Calvi Risorta': 'Casertano', 'Caianello': 'Casertano', 'Vairano Patenora': 'Casertano',
  'Arienzo': 'Casertano', 'Cervino': 'Casertano', 'San Felice a Cancello': 'Casertano',
  'Cancello ed Arnone': 'Casertano', 'Santa Maria la Bruna': 'Casertano',
};

// Alias nomi città comuni → nome GeoJSON ufficiale (per illuminare il comune corretto)
const CITY_ALIASES = {
  'Castellammare': 'Castellammare di Stabia',
};

// Mapping frazioni/zone → comune GeoJSON (per illuminare il comune corretto)
const FRAZIONE_TO_COMUNE = {
  'licola': 'Pozzuoli',
  'licola mare': 'Pozzuoli',
  'cuma': 'Pozzuoli',
  'arco felice': 'Pozzuoli',
  'lucrino': 'Pozzuoli',
  'monterusciello': 'Pozzuoli',
};

// Coordinate fisse per frazioni note (usate se non c'è geocodifica)
const FRAZIONE_COORDS = {
  'licola': [40.9183, 13.9978],
  'licola mare': [40.9190, 13.9950],
};

// Trova il nome del quartiere GeoJSON corrispondente a un neighborhood o address libero
function matchNeighborhood(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  // Match diretto
  if (NEIGHBORHOOD_KEYWORD_MAP[lower]) return NEIGHBORHOOD_KEYWORD_MAP[lower];

  // Match per keyword: ordina per lunghezza decrescente per preferire match più specifici
  const sortedKeys = Object.keys(NEIGHBORHOOD_KEYWORD_MAP).sort((a, b) => b.length - a.length);
  for (const kw of sortedKeys) {
    // Usa word-boundary-like: la keyword deve essere una parola intera (non solo sottostringa di un'altra parola)
    const regex = new RegExp(`(^|\\s|,)${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|,|$|\\d)`, 'i');
    if (regex.test(lower)) return NEIGHBORHOOD_KEYWORD_MAP[kw];
  }
  // Fallback: match semplice se la keyword è contenuta nel testo
  for (const kw of sortedKeys) {
    if (lower.includes(kw)) return NEIGHBORHOOD_KEYWORD_MAP[kw];
  }
  return null;
}

function getCentroid(geometry) {
  try {
    const coords = geometry.type === 'MultiPolygon' ? geometry.coordinates[0][0] : geometry.coordinates[0];
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    return [lats.reduce((a, b) => a + b, 0) / lats.length, lngs.reduce((a, b) => a + b, 0) / lngs.length];
  } catch { return null; }
}

// Icona promoter: usa sempre la foto se disponibile, altrimenti iniziale
function makePromoterIcon(promoter, color) {
  const size = 32;
  const zoom = promoter.photo_zoom || 1;
  const ox = promoter.photo_offset_x || 0;
  const oy = promoter.photo_offset_y || 0;
  // Wrap in un div outer con pointer-events:none per evitare hover su Leaflet
  const inner = promoter.photo_url
    ? `<div style="width:${size}px;height:${size}px;border-radius:50%;border:3px solid ${color};overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.8);background:#111;position:relative">` +
      `<img src="${promoter.photo_url}" style="position:absolute;width:${zoom*100}%;height:${zoom*100}%;object-fit:cover;left:calc(50% + ${ox}px);top:calc(50% + ${oy}px);transform:translate(-50%,-50%);pointer-events:none;user-select:none" />` +
      `</div>`
    : `<div style="width:${size}px;height:${size}px;border-radius:50%;border:3px solid ${color};background:${color}44;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:${color};box-shadow:0 2px 12px rgba(0,0,0,0.8);font-family:sans-serif">${promoter.name?.charAt(0)?.toUpperCase() || '?'}</div>`;
  const html = `<div style="width:${size}px;height:${size}px;position:relative;cursor:pointer">${inner}</div>`;
  return L.divIcon({
    className: 'leaflet-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html,
  });
}

// Componente interno che chiama invalidateSize quando il container cambia dimensione
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 50);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Geocodifica via Nominatim (OSM) — gratuito, no API key
async function geocode(address, city) {
  // 1. Indirizzo esatto + città (se disponibile) → più preciso
  if (city) {
    const q0 = encodeURIComponent(address + ', ' + city + ', Italia');
    const res0 = await fetch(`https://nominatim.openstreetmap.org/search?q=${q0}&format=json&limit=1&countrycodes=it`, {
      headers: { 'Accept-Language': 'it' }
    });
    const data0 = await res0.json();
    if (data0 && data0[0]) return { lat: parseFloat(data0[0].lat), lng: parseFloat(data0[0].lon) };
  }
  // 2. Indirizzo esatto senza specificare città
  const q1 = encodeURIComponent(address + ', Italia');
  const res1 = await fetch(`https://nominatim.openstreetmap.org/search?q=${q1}&format=json&limit=1&countrycodes=it`, {
    headers: { 'Accept-Language': 'it' }
  });
  const data1 = await res1.json();
  if (data1 && data1[0]) return { lat: parseFloat(data1[0].lat), lng: parseFloat(data1[0].lon) };
  // 3. Fallback: città da sola (per posizionare almeno sul comune giusto)
  if (city) {
    const q2 = encodeURIComponent(city + ', Italia');
    const res2 = await fetch(`https://nominatim.openstreetmap.org/search?q=${q2}&format=json&limit=1&countrycodes=it`, {
      headers: { 'Accept-Language': 'it' }
    });
    const data2 = await res2.json();
    if (data2 && data2[0]) return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) };
  }
  return null;
}

export default function NapoliCoverageMap({ promoters: allPromoters }) {
   // Solo promoter attivi sulla mappa (gli inattivi restano visibili nelle tabelle di confronto)
   const promoters = allPromoters.filter(p => p.status !== 'inattivo');
   const [geoData, setGeoData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeArea, setActiveArea] = useState(null);
   const [fullscreen, setFullscreen] = useState(false);
   // Cache delle coordinate geocodificate per promoter con address ma senza lat/lng
   const [geocodedCoords, setGeocodedCoords] = useState({});
   const geocodingRef = useRef(new Set());
   const mapContainerRef = useRef(null);

  // Carica GeoJSON comuni provincia Napoli + Caserta
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson')
      .then(r => r.json())
      .then(data => {
        setGeoData({
          ...data,
          // 63 = Napoli, 61 = Caserta
          features: data.features.filter(f => f.properties?.prov_istat_code_num === 63 || f.properties?.prov_istat_code_num === 61),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Geocodifica lazy: per promoter con address ma senza lat/lng salvati
  useEffect(() => {
    promoters.forEach(p => {
      if (!p.address) return;
      if (p.lat && p.lng) return; // già geocodificato e salvato
      // Salta la geocodifica se la città ha un alias noto: usa il centroide
      // del comune (es. "Castellammare" → centroide "Castellammare di Stabia")
      // per evitare match ambigui su Nominatim (es. Castellammare del Golfo in Sicilia)
      if (p.city && CITY_ALIASES[p.city]) return;
      if (geocodingRef.current.has(p.id)) return;
      if (geocodedCoords[p.id]) return;
      geocodingRef.current.add(p.id);
      geocode(p.address, p.city).then(coords => {
        if (coords) {
          setGeocodedCoords(prev => ({ ...prev, [p.id]: coords }));
        }
      }).catch(() => {});
    });
  }, [promoters]);

  // Calcola centroidi comuni (per fallback posizione)
  const cityCentroids = {};
  const areaCentroids = {};
  if (geoData) {
    const areaCoords = {};
    geoData.features.forEach(f => {
      const name = f.properties?.name;
      if (!name) return;
      const c = getCentroid(f.geometry);
      if (!c) return;
      cityCentroids[name] = c;
      const area = COMUNE_TO_AREA[name];
      if (area) {
        if (!areaCoords[area]) areaCoords[area] = [];
        areaCoords[area].push(c);
      }
    });
    Object.entries(areaCoords).forEach(([area, coords]) => {
      areaCentroids[area] = [
        coords.reduce((s, c) => s + c[0], 0) / coords.length,
        coords.reduce((s, c) => s + c[1], 0) / coords.length,
      ];
    });
  }
  // Centroidi quartieri GeoJSON inline
  const quartieriCentroids = {};
  NAPOLI_QUARTIERI_GEOJSON.features.forEach(f => {
    const c = getCentroid(f.geometry);
    if (c) {
      quartieriCentroids[f.properties.name] = c;
      const area = f.properties.area;
      if (area && !areaCentroids[area]) areaCentroids[area] = c;
    }
  });

  // Posizione finale di ogni promoter
  // Priorità: lat/lng salvato > geocodifica lazy da address > centroide quartiere (neighborhood match) > centroide comune > centroide area
  const promoterMarkers = promoters
    .map((p, i) => {
      let position = null;
      let precise = false;

      if (p.lat && p.lng) {
        // Valida che le coordinate siano nel raggio Campania: se il promoter ha
        // coordinate salvate fuori regione (es. geocodifica ambigua precedente che
        // ha restituito un omonimo come Castellammare del Golfo in Sicilia invece
        // di Castellammare di Stabia), scarta le coordinate e ricade sul centroide
        // del comune/area.
        const inCampania = p.lat >= 40.0 && p.lat <= 41.5 && p.lng >= 13.5 && p.lng <= 15.1;
        if (inCampania) {
          position = [p.lat, p.lng];
          precise = true;
        }
      } else if (geocodedCoords[p.id]) {
        position = [geocodedCoords[p.id].lat, geocodedCoords[p.id].lng];
        precise = true;
      } else if (p.neighborhood) {
        const matchedQuartiere = matchNeighborhood(p.neighborhood);
        if (matchedQuartiere && quartieriCentroids[matchedQuartiere]) {
          position = quartieriCentroids[matchedQuartiere];
        }
      }

      // Fallback: coordinate fisse per frazioni note (es. Licola)
      if (!position) {
        const neighLower = (p.neighborhood || '').toLowerCase();
        const cityLower = (p.city || '').toLowerCase();
        for (const [frazione, coords] of Object.entries(FRAZIONE_COORDS)) {
          if (cityLower === frazione || neighLower === frazione) {
            position = coords;
            break;
          }
        }
      }

      if (!position && p.city) {
        const cityName = CITY_ALIASES[p.city] || p.city;
        if (cityCentroids[cityName]) position = cityCentroids[cityName];
      }
      if (!position && p.province_area && areaCentroids[p.province_area]) {
        position = areaCentroids[p.province_area];
      }
      if (!position && p.city && COMUNE_TO_AREA[p.city] && areaCentroids[COMUNE_TO_AREA[p.city]]) {
        position = areaCentroids[COMUNE_TO_AREA[p.city]];
      }

      // Fallback finale indipendente dal fetch remoto (garantisce un pin anche se
      // i confini comunali non sono ancora/mai arrivati, es. rete mobile)
      if (!position) {
        let areaKey = null;
        if (p.province_area) {
          areaKey = AREA_FALLBACK_CENTROIDS[p.province_area]
            ? p.province_area
            : Object.keys(AREA_FALLBACK_CENTROIDS).find(k => p.province_area.startsWith(k) || k.startsWith(p.province_area)) || null;
        }
        if (!areaKey && p.city && COMUNE_TO_AREA[p.city]) areaKey = COMUNE_TO_AREA[p.city];
        if (areaKey && AREA_FALLBACK_CENTROIDS[areaKey]) position = AREA_FALLBACK_CENTROIDS[areaKey];
      }

      if (!position) return null;
      const color = PROMOTER_COLORS[i % PROMOTER_COLORS.length];
      return { promoter: p, position, color, precise };
    })
    .filter(Boolean);

  // Offset per marker sovrapposti (stessa posizione arrotondata)
  const positionGroups = {};
  promoterMarkers.forEach(m => {
    const key = `${m.position[0].toFixed(3)},${m.position[1].toFixed(3)}`;
    if (!positionGroups[key]) positionGroups[key] = [];
    positionGroups[key].push(m);
  });
  const markersWithOffset = promoterMarkers.map(m => {
    const key = `${m.position[0].toFixed(3)},${m.position[1].toFixed(3)}`;
    const group = positionGroups[key];
    const idx = group.indexOf(m);
    const total = group.length;
    if (total === 1 || m.precise) return { ...m, finalPos: m.position };
    const angle = (2 * Math.PI * idx) / total;
    return {
      ...m,
      finalPos: [
        m.position[0] + Math.cos(angle) * 0.009,
        m.position[1] + Math.sin(angle) * 0.014,
      ],
    };
  });

  // Set per illuminazione mappe — include anche frazioni mappate al comune e neighborhood che sono comuni noti
  const litCities = new Set(
    promoters.flatMap(p => {
      const results = [];
      if (p.city) {
        results.push(p.city);
        // Aggiungi anche il nome GeoJSON canonico se la città ha un alias (es. "Castellammare" → "Castellammare di Stabia")
        if (CITY_ALIASES[p.city]) results.push(CITY_ALIASES[p.city]);
      }
      // Se neighborhood è un comune noto (es. "Pozzuoli"), illuminalo
      if (p.neighborhood && Object.keys(COMUNE_TO_AREA).includes(p.neighborhood)) {
        results.push(p.neighborhood);
      }
      // Se city o neighborhood è una frazione nota, aggiungi anche il comune
      const cityLower = (p.city || '').toLowerCase();
      const neighLower = (p.neighborhood || '').toLowerCase();
      const addrLower = (p.address || '').toLowerCase();
      for (const [frazione, comune] of Object.entries(FRAZIONE_TO_COMUNE)) {
        if (cityLower.includes(frazione) || neighLower.includes(frazione) || addrLower.includes(frazione)) {
          results.push(comune);
        }
      }
      return results;
    }).filter(Boolean)
  );
  // Quartieri GeoJSON illuminati per neighborhood o address
  const litQuartieriNames = new Set(
    promoters
      .map(p => matchNeighborhood(p.neighborhood) || matchNeighborhood(p.address))
      .filter(Boolean)
  );

  // Pannello laterale: raggruppa per quartiere (se napoli) o comune
  // Quartieri napoli con promoter
  const quartiereToPromoters = {}; // quartiereGeoName → [promoters]
  // Comuni fuori napoli con promoter
  const cityToPromoters = {}; // cityName → [promoters]

  // Lista comuni noti (per riconoscere neighborhood che è in realtà un comune)
  const KNOWN_COMUNI = new Set(Object.keys(COMUNE_TO_AREA));

  promoters.forEach(p => {
    const neighLower = (p.neighborhood || '').toLowerCase();
    const cityLower = (p.city || '').toLowerCase();

    // Se neighborhood è un comune noto (es. "Pozzuoli"), usalo come città
    const neighAsComune = p.neighborhood && KNOWN_COMUNI.has(p.neighborhood) ? p.neighborhood : null;

    // Se neighborhood o city è una frazione nota, mappa al comune
    let frazioneDisplayName = null;
    let frazioneComune = null;
    for (const [frazione, comune] of Object.entries(FRAZIONE_TO_COMUNE)) {
      if (cityLower === frazione || neighLower === frazione) {
        frazioneDisplayName = p.neighborhood || p.city;
        frazioneComune = comune;
        break;
      }
    }

    const matchedQ = !neighAsComune && !frazioneDisplayName
      ? (matchNeighborhood(p.neighborhood) || matchNeighborhood(p.address))
      : null;

    if (matchedQ) {
      if (!quartiereToPromoters[matchedQ]) quartiereToPromoters[matchedQ] = [];
      if (!quartiereToPromoters[matchedQ].find(x => x.id === p.id)) quartiereToPromoters[matchedQ].push(p);
    } else {
      // Determina città da mostrare nel pannello
      let displayCity = neighAsComune || frazioneDisplayName || p.city || null;

      if (displayCity && displayCity !== 'Napoli') {
        if (!cityToPromoters[displayCity]) cityToPromoters[displayCity] = [];
        if (!cityToPromoters[displayCity].find(x => x.id === p.id)) cityToPromoters[displayCity].push(p);
      } else if (!displayCity || displayCity === 'Napoli') {
        const key = 'Napoli (generica)';
        if (!quartiereToPromoters[key]) quartiereToPromoters[key] = [];
        if (!quartiereToPromoters[key].find(x => x.id === p.id)) quartiereToPromoters[key].push(p);
      }
    }
  });

  // Mappa area → promoters e per-zona
  const areaToPromoters = {};
  const areaToZones = {};
  promoters.forEach(p => {
    // Determina la macroarea: prima da province_area (match esatto o parziale), poi da city
    let area = null;
    if (p.province_area) {
      // match esatto
      if (AREA_COLORS[p.province_area]) {
        area = p.province_area;
      } else {
        // match parziale (es. "Napoli Sud (Posillipo / Fuorigrotta)" → "Napoli Sud")
        area = Object.keys(AREA_COLORS).find(k => p.province_area.startsWith(k) || k.startsWith(p.province_area)) || null;
      }
    }
    if (!area && p.city) area = COMUNE_TO_AREA[p.city] || null;
    if (!area) return;

    if (!areaToPromoters[area]) areaToPromoters[area] = [];
    if (!areaToPromoters[area].find(x => x.id === p.id)) areaToPromoters[area].push(p);

    // Zona di dettaglio: quartiere > comune > province_area
    const zoneName = p.neighborhood || p.city || p.province_area || 'Altro';
    if (!areaToZones[area]) areaToZones[area] = {};
    if (!areaToZones[area][zoneName]) areaToZones[area][zoneName] = [];
    if (!areaToZones[area][zoneName].find(x => x.id === p.id)) areaToZones[area][zoneName].push(p);
  });

  // Stile GeoJSON feature
  const getFeatureStyle = (feature) => {
    const isQuartiere = !!feature?.properties?.quartiere;
    const name = feature?.properties?.name || '';
    const ACTIVE_COLOR = '#ef4444'; // rosso per zone con promoter attivi

    if (isQuartiere) {
      const hasPromoter = litQuartieriNames.has(name);
      return {
        fillColor: hasPromoter ? ACTIVE_COLOR : '#1a1f3a',
        fillOpacity: hasPromoter ? 0.55 : 0.10,
        color: hasPromoter ? ACTIVE_COLOR : '#2a3060',
        weight: hasPromoter ? 2 : 0.8,
        opacity: hasPromoter ? 1 : 0.35,
        dashArray: !hasPromoter ? '4 4' : null,
      };
    } else {
      // Comune della provincia: Napoli città quasi invisibile (coperta dai quartieri),
      // altri comuni illuminati in rosso se hanno promoter
      const isNapoli = name === 'Napoli';
      if (isNapoli) {
        return { fillColor: 'transparent', fillOpacity: 0, color: '#2a3060', weight: 0.5, opacity: 0.2 };
      }
      const hasPromoter = litCities.has(name);
      return {
        fillColor: hasPromoter ? ACTIVE_COLOR : 'hsl(240, 5%, 13%)',
        fillOpacity: hasPromoter ? 0.50 : 0.06,
        color: hasPromoter ? ACTIVE_COLOR : 'hsl(240, 5%, 20%)',
        weight: hasPromoter ? 1.5 : 0.4,
        opacity: hasPromoter ? 0.9 : 0.25,
      };
    }
  };

  const onEachFeature = (feature, layer) => {
    const name = feature?.properties?.name;
    const isQuartiere = !!feature?.properties?.quartiere;
    const area = isQuartiere ? feature.properties.area : COMUNE_TO_AREA[name];

    const promsInZone = isQuartiere
      ? (quartiereToPromoters[name] || [])
      : (cityToPromoters[name] || []);

    if (name) {
      const subLabel = isQuartiere ? '📍 Quartiere di Napoli' : (area ? `🗺 ${area}` : '');
      const promoterRows = promsInZone.slice(0, 3).map(p => `<div style="font-size:10px;color:#ccc;padding-left:8px">· ${p.name}</div>`).join('');
      const moreRow = promsInZone.length > 3 ? `<div style="font-size:10px;color:#888;padding-left:8px">+${promsInZone.length - 3} altri</div>` : '';
      const countRow = promsInZone.length > 0
        ? `<div style="font-size:11px;color:#a78bfa;font-weight:600;margin-top:4px">👤 ${promsInZone.length} promoter</div>${promoterRows}${moreRow}`
        : '';

      const html = `<div style="font-family:sans-serif;min-width:130px">
        <div style="font-weight:700;font-size:13px;margin-bottom:4px">${name}</div>
        ${subLabel ? `<div style="font-size:11px;color:#aaa;margin-bottom:3px">${subLabel}</div>` : ''}
        ${countRow}
      </div>`;

      layer.bindTooltip(html, { sticky: true, direction: 'auto', offset: [0, 10], opacity: 1, className: 'napoli-map-tooltip' });
    }

    const isLit = !!feature?.properties?.quartiere
      ? litQuartieriNames.has(name)
      : (name !== 'Napoli' && litCities.has(name));

    layer.on({
      mouseover: (e) => {
        if (!isLit) e.target.setStyle({ fillOpacity: 0.22, weight: 1.5 });
      },
      mouseout: (e) => { e.target.setStyle(getFeatureStyle(feature)); },
      click: () => setActiveArea(prev => prev === area ? null : area),
    });
  };


  const totalCovered = Object.values(areaToPromoters).filter(ps => ps.length > 0).length;
  const totalWithPin = promoters.filter(p => p.lat || p.lng || geocodedCoords[p.id]).length;

  const mapHeight = fullscreen ? '100%' : 540;

  return (
    <Div 
      ref={mapContainerRef}
      className={fullscreen
        ? 'fixed inset-0 z-50 bg-background flex flex-col p-4 gap-3'
        : 'rounded-2xl bg-card border border-border p-6 space-y-4'
      }>
      {null}
      <Div className="flex items-center justify-between flex-wrap gap-3">
        <Div>
          <H className="text-base font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Copertura Territoriale — Provincia di Napoli
          </H>
          <P className="text-xs text-muted-foreground mt-0.5">
            Comune/quartiere illuminato = zona coperta · Pallino = promoter sulla mappa
          </P>
        </Div>
        <Div className="flex items-center gap-2">
          <Div className="flex gap-2 text-center">
            <Div className="bg-secondary/30 rounded-lg px-3 py-1.5">
              <P className="text-lg font-bold text-primary">{totalCovered}</P>
              <P className="text-[10px] text-muted-foreground">Aree</P>
            </Div>
            <Div className="bg-secondary/30 rounded-lg px-3 py-1.5">
              <P className="text-lg font-bold text-green-400">{totalWithPin}</P>
              <P className="text-[10px] text-muted-foreground">Pin precisi</P>
            </Div>
          </Div>
          <Btn
            button
            onClick={() => setFullscreen(f => !f)}
            className="p-2 rounded-lg border border-border hover:bg-secondary/40 transition-all"
            accessibilityLabel={fullscreen ? 'Esci da schermo intero' : 'Schermo intero'}>
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Btn>
        </Div>
      </Div>

      <Div className={`flex flex-col lg:flex-row gap-4 ${fullscreen ? 'flex-1 min-h-0 overflow-hidden' : ''}`}>
           <Div className="w-full lg:flex-1 rounded-xl border border-border relative" style={{ height: fullscreen ? '100%' : 540, minWidth: 0, overflow: 'hidden' }}>
             <MapContainer
               key={fullscreen ? 'fullscreen' : 'normal'}
               center={[40.855, 14.28]}
               zoom={10}
               className="dark-osm"
               style={{ height: '100%', width: '100%' }}
               scrollWheelZoom={true}
               tap={false}
               bounceAtZoomLimits={false}
             >
               <MapResizer />
               <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Quartieri di Napoli — renderizzati subito, senza attendere il fetch remoto */}
                <GeoJSON
                  key={`q-${JSON.stringify({ qn: [...litQuartieriNames], active: activeArea })}`}
                  data={NAPOLI_QUARTIERI_GEOJSON}
                  style={getFeatureStyle}
                  onEachFeature={onEachFeature}
                />
                {/* Comuni della provincia — si aggiungono appena il GeoJSON remoto è pronto */}
                {geoData && (
                  <GeoJSON
                    key={`c-${JSON.stringify({ cities: [...litCities], active: activeArea })}`}
                    data={geoData}
                    style={getFeatureStyle}
                    onEachFeature={onEachFeature}
                  />
                )}

                {markersWithOffset.map(({ promoter, color, finalPos, precise }) => (
                  <Marker
                    key={`${promoter.id}-${promoter.lat || ''}-${promoter.lng || ''}-${promoter.address || ''}-${geocodedCoords[promoter.id]?.lat || ''}`}
                    position={finalPos}
                    icon={makePromoterIcon(promoter, color)}
                    zIndexOffset={precise ? 2000 : 1000}
                  >
                    <Popup
                      autoPan={true}
                      autoPanPadding={[20, 20]}
                      keepInView={true}
                      className="promoter-popup"
                    >
                      <Div style={{ minWidth: 170, fontFamily: 'sans-serif' }}>
                        {promoter.photo_url && (
                          <Img
                            src={promoter.photo_url}
                            alt={promoter.name}
                            style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                          />
                        )}
                        <P style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{promoter.name}</P>
                        {promoter.address && <P style={{ fontSize: 11, color: '#333', marginBottom: 2 }}>📍 {promoter.address}</P>}
                        {!promoter.address && promoter.neighborhood && <P style={{ fontSize: 11, color: '#333', marginBottom: 2 }}>🏘 {promoter.neighborhood}</P>}
                        {promoter.city && <P style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>🏙 {promoter.city}</P>}
                        {promoter.province_area && <P style={{ fontSize: 11, color: '#777' }}>🗺 {promoter.province_area}</P>}
                        {precise && <P style={{ fontSize: 10, color: '#16a34a', marginTop: 6, fontWeight: 600 }}>✓ Posizione precisa</P>}
                      </Div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              {loading && (
                <Div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-card/80 backdrop-blur px-2.5 py-1.5 rounded-full border border-border pointer-events-none">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Zone in caricamento…
                </Div>
              )}
          </Div>

          {/* Pannello laterale: quartieri e province */}
          <Div className={`lg:w-72 space-y-1 overflow-y-auto pr-1 ${fullscreen ? 'max-h-full' : 'max-h-[540px]'}`}>

            {/* Quartieri di Napoli */}
            {Object.keys(quartiereToPromoters).length > 0 && (
              <>
                <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 sticky top-0 bg-card pt-1 pb-1 z-10">
                  Quartieri Napoli
                </P>
                {Object.entries(quartiereToPromoters).map(([quartiere, ps]) => {
                  const isOpen = activeArea === quartiere;
                  return (
                    <Div key={quartiere}>
                      <Btn
                        button
                        onClick={() => setActiveArea(prev => prev === quartiere ? null : quartiere)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${isOpen ? 'bg-secondary/60' : 'hover:bg-secondary/30'}`}>
                        <Div className="w-2 h-2 rounded-full shrink-0 bg-red-500" />
                        <Span className="text-xs flex-1 font-medium text-foreground truncate">{quartiere}</Span>
                        <Span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">{ps.length}</Span>
                      </Btn>
                      {isOpen && (
                        <Div className="ml-4 mt-0.5 mb-1.5 border-l border-border pl-2 space-y-1">
                          {ps.map(p => (
                            <Div key={p.id} className="flex items-center gap-2 px-1.5 py-1 rounded-md bg-secondary/20">
                              <Div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary overflow-hidden shrink-0">
                                {p.photo_url
                                  ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                                  : p.name?.charAt(0)?.toUpperCase()
                                }
                              </Div>
                              <Span className="text-[10px] text-foreground/80 truncate">{p.name}</Span>
                            </Div>
                          ))}
                        </Div>
                      )}
                    </Div>
                  );
                })}
              </>
            )}

            {/* Comuni / Province fuori Napoli */}
            {Object.keys(cityToPromoters).length > 0 && (
              <>
                <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-3 sticky top-0 bg-card pt-1 pb-1 z-10">
                  Comuni / Province
                </P>
                {Object.entries(cityToPromoters).sort((a, b) => a[0].localeCompare(b[0])).map(([city, ps]) => {
                  const isOpen = activeArea === city;
                  return (
                    <Div key={city}>
                      <Btn
                        button
                        onClick={() => setActiveArea(prev => prev === city ? null : city)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${isOpen ? 'bg-secondary/60' : 'hover:bg-secondary/30'}`}>
                        <Div className="w-2 h-2 rounded-full shrink-0 bg-blue-400" />
                        <Span className="text-xs flex-1 font-medium text-foreground truncate">{city}</Span>
                        <Span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-400/20 text-blue-400">{ps.length}</Span>
                      </Btn>
                      {isOpen && (
                        <Div className="ml-4 mt-0.5 mb-1.5 border-l border-border pl-2 space-y-1">
                          {ps.map(p => (
                            <Div key={p.id} className="flex items-center gap-2 px-1.5 py-1 rounded-md bg-secondary/20">
                              <Div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary overflow-hidden shrink-0">
                                {p.photo_url
                                  ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                                  : p.name?.charAt(0)?.toUpperCase()
                                }
                              </Div>
                              <Span className="text-[10px] text-foreground/80 truncate">{p.name}</Span>
                            </Div>
                          ))}
                        </Div>
                      )}
                    </Div>
                  );
                })}
              </>
            )}

            {/* Senza zona */}
            {promoters.filter(p => !p.city && !p.neighborhood && !p.address).length > 0 && (
              <Div className="mt-3 pt-3 border-t border-border">
                <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                  Senza zona ({promoters.filter(p => !p.city && !p.neighborhood && !p.address).length})
                </P>
                <Div className="flex flex-wrap gap-1">
                  {promoters.filter(p => !p.city && !p.neighborhood && !p.address).map(p => (
                    <Span key={p.id} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">{p.name}</Span>
                  ))}
                </Div>
              </Div>
            )}
          </Div>
        </Div>
    </Div>
  );
}