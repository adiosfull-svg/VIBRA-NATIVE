# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 10446 ms da app chiusa (di cui 3239 ms prima della prima riga di JS) · originale 3646 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 974 | 1689 | ✅ | 558 | 357 | ❌ | 90.3% | –% |
| /clienti | 455 | 639 | ✅ | 110 | 245 | ✅ | 80.8% | –% |
| /promoter | 533 | 1132 | ✅ | 915 | 1098 | ✅ | 85.4% | –% |
| /promoter/prom000000000000000001 | 502 | 2332 | ✅ | 1796 | 1020 | ❌ | 88.5% | –% |
| /locali | 455 | 1459 | ✅ | 321 | 755 | ✅ | 89.8% | –% |
| /report | 579 | 615 | ✅ | 270 | 550 | ✅ | 87.6% | –% |
| /messaggi | 449 | 1191 | ✅ | 415 | 808 | ✅ | –% | –% |
| /importa-serata | 208 | 699 | ✅ | 324 | 673 | ✅ | 90% | –% |
| /impostazioni-app | 198 | 670 | ✅ | 206 | 514 | ✅ | 89.6% | –% |
| /admin-console | 368 | 771 | ✅ | 320 | 707 | ✅ | 90% | –% |
| /clienti-analytics | 774 | 1151 | ✅ | 1176 | 735 | ❌ | 89.7% | –% |
| /academy | 644 | 2974 | ✅ | 597 | 1257 | ✅ | 87.5% | –% |
| /notifiche | 83 | 642 | ✅ | 55 | 120 | ✅ | 89.3% | –% |
| /dashboard | 308 | 1690 | ✅ | errore | 612 |  | 88.1% | –% |

Memoria (PSS): nativa 481 MB · originale (Chrome) 365 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 55 | 55,55,57 |
| view-classi | 87 | 89,87,87 |
| div | 120 | 103,122,120 |
| div-senza-classi | 67 | 67,100,67 |
| pressable-puro | 104 | 104,140,88 |
| pressable-classi | 123 | 133,123,122 |
| btn-vuoto | 136 | 121,136,136 |
| text-puro | 75 | 75,76,75 |
| text | 120 | 114,120,123 |
| span | 126 | 126,200,104 |
| btn | 205 | 189,218,205 |
| riga | 648 | 590,762,648 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    47564                          81444
         Native Heap:   225832                         229064
                Code:    23020                         147352
               Stack:     1800                           1808
            Graphics:        0                              0
       Private Other:   178348
              System:    16080
             Unknown:                                  184164
 
           TOTAL PSS:   492644            TOTAL RSS:   643832      TOTAL SWAP (KB):        0
```
