# Consumo token (Claude Code)

Dati della dashboard "Consumo token VIBRA" (artifact privato su claude.ai).

- `collect.py` legge i log delle sessioni Claude Code (`~/.claude/projects`) e aggiunge allo
  storico `usage.json` ogni prompt con le sue chiamate automatiche e i token riportati dall'API.
  Lo storico è nel repo perché il container della sessione viene eliminato.
- `export.py` trasforma lo storico in `calls.json` (una riga per chiamata), il file caricato sulla dashboard.
- `prices.json`: listino API per milione di token. `efforts.json`: moltiplicatori di sforzo
  (stime, non valori ufficiali) usati per la tabella comparativa.

Aggiornare: `python3 tools/token-usage/collect.py && python3 tools/token-usage/export.py`,
poi chiedere a Claude di ricaricare `calls.json` sulla dashboard.
