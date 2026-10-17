# Gara barra in basso e menu — utente pr

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 0 (0) | – |
| tocco → la pillola arriva (tocchi lenti) | 220 (439) | – |
| tocco → la pagina cambia (tocchi lenti) | 756 (1177) | – |
| frame al secondo della pillola in corsa | 9 (9) | – |
| tocco → la pillola parte (tocchi veloci di fila) | – | – |
| tocco → la pillola arriva (tocchi veloci di fila) | – | – |
| tocco → la pagina cambia (tocchi veloci di fila) | – | – |
| trascinamento: pillola dietro al dito | – | – |
| trascinamento: spostamenti della pillola al secondo | – | – |
| menu, 1ª apertura: tocco → il menu si muove | – | – |
| menu, 1ª apertura: tocco → menu completo | – | – |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | – | – |
| menu, 2ª apertura: tocco → il menu si muove | 0 (0) | – |
| menu, 2ª apertura: tocco → menu completo | 935 (935) | – |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 935 (935) | – |

nativa: 617 frame nel video (11.8 al secondo in media), scostamento orologio 1.074 s
- frame disegnati dal sistema: 70 (1.3 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#136
- frame disegnati dal sistema: 0 (0 al secondo) nel livello none
- tocchi non visti: 10 (lento, lento, lento, lento, lento, veloce, veloce, veloce, trascina, menu)

## Note
- originale: pillola non trovata sullo schermo (vedi navbar-originale-inizio.png)

Righe complete in navbar.json; video in video/.
