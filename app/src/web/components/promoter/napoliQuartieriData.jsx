// Port di src/components/promoter/napoliQuartieriData.jsx (convertito da scripts/port/codemod.mjs).
// GeoJSON approssimativo dei quartieri/municipalità di Napoli città
// Coordinate basate sui confini reali delle 10 Municipalità

export const NAPOLI_QUARTIERI_GEOJSON = {
  type: "FeatureCollection",
  features: [
    // Municipalità 1 – Chiaia, Posillipo, San Ferdinando
    {
      type: "Feature",
      properties: { name: "Chiaia / Posillipo", quartiere: true, area: "Napoli Sud",
        keywords: ["chiaia", "posillipo", "san ferdinando", "mergellina", "riviera di chiaia", "lungomare", "villa comunale"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.190, 40.835], [14.210, 40.837], [14.235, 40.832], [14.245, 40.825],
          [14.248, 40.818], [14.240, 40.812], [14.228, 40.808], [14.215, 40.810],
          [14.200, 40.815], [14.190, 40.822], [14.190, 40.835]
        ]]
      }
    },
    // Municipalità 2 – Avvocata, Montecalvario, Porto, Mercato, Pendino, San Giuseppe
    {
      type: "Feature",
      properties: { name: "Centro Storico", quartiere: true, area: "Napoli Centro",
        keywords: ["centro storico", "avvocata", "montecalvario", "porto", "mercato", "pendino", "san giuseppe", "quartieri spagnoli", "toledo", "spaccanapoli", "decumani", "piazza dante", "via tribunali", "via dei tribunali"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.240, 40.852], [14.258, 40.850], [14.270, 40.845], [14.272, 40.838],
          [14.265, 40.832], [14.250, 40.830], [14.240, 40.832], [14.235, 40.838],
          [14.238, 40.845], [14.240, 40.852]
        ]]
      }
    },
    // Municipalità 3 – San Carlo all'Arena, Stella
    {
      type: "Feature",
      properties: { name: "San Carlo all'Arena / Stella", quartiere: true, area: "Napoli Centro",
        keywords: ["san carlo all'arena", "stella", "capodimonte", "sanità", "sanitá", "materdei", "miracoli", "museo", "piazza cavour", "via foria"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.242, 40.862], [14.262, 40.860], [14.272, 40.855], [14.272, 40.845],
          [14.258, 40.850], [14.245, 40.852], [14.240, 40.856], [14.242, 40.862]
        ]]
      }
    },
    // Municipalità 4 – Poggioreale, Zona Industriale, Vicaria, San Lorenzo
    {
      type: "Feature",
      properties: { name: "Poggioreale / Vicaria", quartiere: true, area: "Napoli Est",
        keywords: ["poggioreale", "vicaria", "san lorenzo", "zona industriale", "gianturco", "foria", "piazza garibaldi", "stazione centrale", "corso garibaldi"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.268, 40.870], [14.290, 40.868], [14.305, 40.862], [14.305, 40.850],
          [14.290, 40.845], [14.272, 40.845], [14.272, 40.855], [14.268, 40.862],
          [14.268, 40.870]
        ]]
      }
    },
    // Municipalità 5 – Vomero, Arenella
    {
      type: "Feature",
      properties: { name: "Vomero / Arenella", quartiere: true, area: "Napoli Centro",
        keywords: ["vomero", "arenella", "antignano", "medaglie d'oro", "salvator rosa", "piazza vanvitelli", "via luca giordano", "via scarlatti"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.215, 40.858], [14.235, 40.858], [14.245, 40.856], [14.242, 40.862],
          [14.240, 40.845], [14.235, 40.838], [14.220, 40.840], [14.210, 40.845],
          [14.208, 40.852], [14.215, 40.858]
        ]]
      }
    },
    // Municipalità 6 – Bagnoli, Fuorigrotta
    {
      type: "Feature",
      properties: { name: "Fuorigrotta / Bagnoli", quartiere: true, area: "Napoli Ovest",
        keywords: ["fuorigrotta", "bagnoli", "agnano", "solfatara", "stadio", "cumana", "via campegna", "via terracina", "mostra"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.160, 40.845], [14.185, 40.848], [14.200, 40.845], [14.208, 40.838],
          [14.210, 40.828], [14.205, 40.820], [14.190, 40.815], [14.175, 40.818],
          [14.160, 40.828], [14.155, 40.838], [14.160, 40.845]
        ]]
      }
    },
    // Municipalità 7 – Miano, Secondigliano, San Pietro a Patierno
    {
      type: "Feature",
      properties: { name: "Secondigliano / Miano", quartiere: true, area: "Napoli Nord",
        keywords: [
          "secondigliano", "miano", "san pietro a patierno",
          "via miano", "corso secondigliano", "piazza secondigliano",
          "via secondigliano", "via don bosco", "rione don bosco",
          "via vittorio emanuele iii", "via vittorio emanuele 3", "vittorio emanuele iii miano"
        ] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.228, 40.892], [14.255, 40.893], [14.278, 40.888], [14.285, 40.880],
          [14.280, 40.870], [14.268, 40.870], [14.262, 40.876], [14.245, 40.878],
          [14.228, 40.878], [14.224, 40.885], [14.228, 40.892]
        ]]
      }
    },
    // Municipalità 8 – Piscinola, Marianella, Chiaiano, Scampia
    {
      type: "Feature",
      properties: { name: "Scampia / Chiaiano", quartiere: true, area: "Napoli Nord",
        keywords: [
          "scampia", "chiaiano", "piscinola", "marianella",
          "le vele", "vela", "rione scampia", "via ghisleri",
          "via limitone d'arzano", "parco verde"
        ] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.193, 40.896], [14.225, 40.897], [14.228, 40.892], [14.224, 40.885],
          [14.210, 40.882], [14.194, 40.882], [14.184, 40.887], [14.189, 40.893],
          [14.193, 40.896]
        ]]
      }
    },
    // Municipalità 9 – Soccavo, Pianura
    {
      type: "Feature",
      properties: { name: "Pianura / Soccavo", quartiere: true, area: "Napoli Ovest",
        keywords: ["pianura", "soccavo", "traiano", "rione traiano", "via circumvallazione esterna", "via panoramica"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.138, 40.870], [14.165, 40.872], [14.185, 40.870], [14.196, 40.862],
          [14.200, 40.850], [14.185, 40.848], [14.168, 40.848], [14.150, 40.852],
          [14.136, 40.860], [14.138, 40.870]
        ]]
      }
    },
    // Municipalità 10 – Barra, Ponticelli, San Giovanni a Teduccio
    {
      type: "Feature",
      properties: { name: "Barra / Ponticelli", quartiere: true, area: "Napoli Est",
        keywords: ["barra", "ponticelli", "san giovanni a teduccio", "san giovanni", "teduccio", "costa est", "via nuova barra", "via argine"] },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [14.295, 40.862], [14.322, 40.860], [14.342, 40.855], [14.346, 40.845],
          [14.330, 40.838], [14.310, 40.835], [14.295, 40.838], [14.285, 40.845],
          [14.290, 40.855], [14.295, 40.862]
        ]]
      }
    },
  ]
};

// Tutti i keyword → nome quartiere GeoJSON (per match rapido)
export const NEIGHBORHOOD_KEYWORD_MAP = {};
NAPOLI_QUARTIERI_GEOJSON.features.forEach(f => {
  (f.properties.keywords || []).forEach(kw => {
    NEIGHBORHOOD_KEYWORD_MAP[kw] = f.properties.name;
  });
});