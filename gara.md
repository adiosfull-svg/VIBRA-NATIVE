# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 6754 ms da app chiusa (di cui 1611 ms prima della prima riga di JS) · originale 446 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 2057 | 3615 | ✅ | 347 | 525 | ✅ | 81.6% | –% |
| /clienti | 1184 | 375 | ❌ | 253 | 1428 | ✅ | 72.4% | –% |
| /semine | 173 | 2313 | ✅ | 108 | 1211 | ✅ | 81.6% | –% |
| /notifiche | 307 | 221 | ❌ | 40 | 208 | ✅ | 86.2% | –% |
| /formazione | 654 | 709 | ✅ | 1421 | 580 | ❌ | –% | –% |
| /download | 494 | 785 | ✅ | 651 | 691 | ✅ | 79.3% | –% |
| /vibra-gpt | 270 | 787 | ✅ | 431 | 178 | ❌ | 85.7% | –% |
| /ricerca-ai | 256 | 550 | ✅ | 498 | 513 | ✅ | 84.6% | 92.4% |
| /messaggi | 685 | 713 | ✅ | 443 | 520 | ✅ | –% | –% |
| /clienti-analytics | 981 | 1809 | ✅ | 2071 | 1929 | ❌ | 90.7% | –% |
| /academy | 787 | 1170 | ✅ | 701 | 1360 | ✅ | 86.2% | –% |
| /il-mio-vibra | 1443 | 1756 | ✅ | 1079 | 1060 | ❌ | 83.3% | –% |

Memoria (PSS): nativa 551 MB · originale (Chrome) 434 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 38 | 94,38,38 |
| view-classi | 56 | 69,51,56 |
| div | 136 | 136,136,124 |
| div-senza-classi | 84 | 100,84,84 |
| pressable-puro | 56 | 56,69,55 |
| pressable-classi | 85 | 77,86,85 |
| btn-vuoto | 160 | 152,160,207 |
| text-puro | 52 | 49,52,55 |
| text | 164 | 129,164,180 |
| span | 152 | 153,152,146 |
| btn | 281 | 281,234,298 |
| riga | 1018 | 907,1241,1018 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    56396                          90248
         Native Heap:   261496                         264684
                Code:    46856                         171584
               Stack:     1916                           1928
            Graphics:        0                              0
       Private Other:   180332
              System:    16882
             Unknown:                                  186152
 
           TOTAL PSS:   563878            TOTAL RSS:   714596      TOTAL SWAP (KB):        0
```
