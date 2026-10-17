# Gara barra in basso e menu — utente admin

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 0 (0) | – |
| tocco → la pillola arriva (tocchi lenti) | 605 (605) | – |
| tocco → la pagina cambia (tocchi lenti) | – | – |
| frame al secondo della pillola in corsa | 12 (12) | – |
| tocco → la pillola parte (tocchi veloci di fila) | – | – |
| tocco → la pillola arriva (tocchi veloci di fila) | – | – |
| tocco → la pagina cambia (tocchi veloci di fila) | – | – |
| trascinamento: pillola dietro al dito | – | – |
| trascinamento: spostamenti della pillola al secondo | – | – |
| menu, 1ª apertura: tocco → il menu si muove | 288 (288) | – |
| menu, 1ª apertura: tocco → menu completo | 1118 (1118) | – |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | 1118 (1118) | – |
| menu, 2ª apertura: tocco → il menu si muove | 200 (200) | – |
| menu, 2ª apertura: tocco → menu completo | 780 (780) | – |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | 780 (780) | – |

nativa: 678 frame nel video (13.4 al secondo in media), scostamento orologio 0.459 s
- frame disegnati dal sistema: 80 (1.6 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#130
- frame disegnati dal sistema: 12 (0.2 al secondo) nel livello StatusBar#92
- tocchi non visti: 10 (lento, lento, lento, lento, lento, lento, veloce, veloce, veloce, trascina)

## Note
- originale: pillola non trovata sullo schermo (vedi navbar-originale-inizio.png)

Righe complete in navbar.json; video in video/.
