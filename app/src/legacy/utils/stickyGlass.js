/**
 * Stile vetro per le sticky bar.
 *
 * Il backdrop-filter (blur) è condizionale allo stato stuck: quando la barra
 * NON è incollata, restituisce solo un backgroundColor solido opaco (nessun
 * blur = nessun re-campionamento del compositor ad ogni frame di scroll).
 * Quando la barra è incollata, attiva blur+saturate per l'effetto vetro.
 *
 * @param {boolean} stuck - se la sticky bar è incollata al top
 * @returns {React.CSSProperties} style object per il layer glass
 */
export function stickyGlassStyle(stuck) {
  if (!stuck) {
    // Sfondo OPACO (alpha 1) = esattamente il colore della pagina (#09090b). Con 0.95 la barra veniva
    // composta sopra la pagina e, per l'arrotondamento a 8 bit della miscela, risultava di un livello
    // più scura (#08080b / #09090a): la differenza di nero visibile sopra e sotto la sticky bar.
    // Da non incollata la barra non ha nulla dietro, quindi l'opacità piena è visivamente identica.
    return { backgroundColor: 'hsl(var(--background))' };
  }
  const filter = 'blur(6px) saturate(160%)';
  return {
    backgroundColor: 'hsl(var(--background) / 0.30)',
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
  };
}