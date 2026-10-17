# Gara barra in basso e menu — utente pr

Stesso emulatore, stessi tocchi (adb), video con «Mostra tocchi»: tempi in ms dal frame in cui compare il tocco (più basso = meglio). Mediana, tra parentesi il peggiore.

| misura | nativa | originale |
|---|---|---|
| tocco → la pillola parte (tocchi lenti) | 602 (2480) | – |
| tocco → la pillola arriva (tocchi lenti) | 602 (2480) | – |
| tocco → la pagina cambia (tocchi lenti) | 2124 (2637) | – |
| frame al secondo della pillola in corsa | – | – |
| tocco → la pillola parte (tocchi veloci di fila) | 604 (1054) | – |
| tocco → la pillola arriva (tocchi veloci di fila) | 604 (1054) | – |
| tocco → la pagina cambia (tocchi veloci di fila) | 334 (669) | – |
| trascinamento: pillola dietro al dito | – | – |
| trascinamento: spostamenti della pillola al secondo | – | – |
| menu, 1ª apertura: tocco → il menu si muove | – | – |
| menu, 1ª apertura: tocco → menu completo | – | – |
| menu, 1ª apertura: tocco → logo del menu fermo e visibile | – | – |
| menu, 2ª apertura: tocco → il menu si muove | – | – |
| menu, 2ª apertura: tocco → menu completo | – | – |
| menu, 2ª apertura: tocco → logo del menu fermo e visibile | – | – |

nativa: 592 frame nel video (11.6 al secondo in media), scostamento orologio 2.75 s
- frame disegnati dal sistema: 73 (1.4 al secondo) nel livello com.vibra.mobile/com.vibra.mobile.MainActivity#133
- frame disegnati dal sistema: 14 (0.3 al secondo) nel livello StatusBar#91
- tocchi non visti: 3 (trascina, menu, menu)

## Note
- originale: pillola non trovata sullo schermo (vedi navbar-originale-inizio.png)

Righe complete in navbar.json; video in video/.
