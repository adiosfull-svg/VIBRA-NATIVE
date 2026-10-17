# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 0 (0) | – |
| tocco → la pillola arriva (tocchi lenti) | 0 (334) | – |
| tocco → la pagina cambia (tocchi lenti) | 276 (812) | – |
| frame al secondo della pillola in corsa | 9 (9) | – |
| tocco → la pillola parte (tocchi veloci di fila) | 0 (0) | – |
| tocco → la pillola arriva (tocchi veloci di fila) | 0 (285) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 481 (621) | – |
| trascinamento: pillola dietro al dito | 95 (95) | – |
| trascinamento: spostamenti della pillola al secondo | 3 (3) | – |
| menu, 1ª apertura: tocco → il menu si muove | – | – |
| menu, 1ª apertura: tocco → menu completo | – | – |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | – | – |
| menu, 2ª apertura: tocco → il menu si muove | – | – |
| menu, 2ª apertura: tocco → menu completo | – | – |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | – | – |

nativa: 132 frame nel video (3.1 al secondo in media), scostamento orologio 0.735 s
- tocchi non visti: 3 (lento, menu, menu)

## Note
- originale: pillola non trovata sullo schermo

Righe complete in navbar.json; video in video/.
