// Tabelle con righe montate a blocchi (useProgressiveList) e colonne a layout automatico (ui/elements Table):
// senza `measureKey` ogni blocco nuovo cambia il contenuto, la tabella rimisura TUTTE le righe (due render
// dell'intera tabella, colonne che saltano) mentre si scorre. Con `measureKey` le larghezze si misurano una
// volta su righe nascoste alte 0 con i testi più lunghi (REGOLE-PRESTAZIONI §3).

/** Stile della riga nascosta che serve solo a misurare le colonne. */
export const HIDDEN_ROW = { height: 0, overflow: 'hidden', opacity: 0, borderBottomWidth: 0 };

/** Righe dopo le prime `skip` con il testo più lungo per colonna (le 2 più lunghe di ognuna): bastano a
 *  dare alla tabella le larghezze che avrebbe con tutte le righe montate. */
export function widestRows(rows, cols, skip) {
  const picked = new Set();
  for (const col of cols) {
    let a = -1, b = -1, la = -1, lb = -1;
    for (let i = skip; i < rows.length; i++) {
      const len = String(col(rows[i]) ?? '').length;
      if (len > la) { b = a; lb = la; a = i; la = len; } else if (len > lb) { b = i; lb = len; }
    }
    if (a >= 0) picked.add(a);
    if (b >= 0) picked.add(b);
  }
  return [...picked].sort((x, y) => x - y).map((i) => rows[i]);
}
