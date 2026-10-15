# Gara — utente pr

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 8283 ms da app chiusa (di cui 3530 ms prima della prima riga di JS) · originale 4820 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /programmazione | 5847 | 3127 | ❌ | 345 | 893 | ✅ | 87.8% | –% |
| /clienti | 100 | 767 | ✅ | 110 | 1234 | ✅ | 83.3% | –% |
| /semine | 527 | 362 | ❌ | 221 | 1249 | ✅ | 80.8% | –% |
| /notifiche | 185 | 69 | ❌ | 80 | 410 | ✅ | 86% | –% |
| /formazione | 333 | 375 | ✅ | 434 | 164 | ❌ | –% | –% |
| /download | 525 | 884 | ✅ | 332 | 1050 | ✅ | 86.8% | –% |
| /vibra-gpt | 463 | 816 | ✅ | 338 | 788 | ✅ | 86.9% | –% |
| /ricerca-ai | 392 | 894 | ✅ | 433 | 387 | ❌ | 87.4% | –% |
| /messaggi | 786 | 473 | ❌ | 480 | 1028 | ✅ | –% | –% |
| /clienti-analytics | 2792 | 508 | ❌ | 953 | 1011 | ✅ | 89.8% | –% |
| /academy | 874 | 2213 | ✅ | 772 | 1456 | ✅ | 85.4% | –% |
| /il-mio-vibra | 1074 | 1770 | ✅ | 111 | 1328 | ✅ | 80.8% | –% |

Memoria (PSS): nativa 496 MB · originale (Chrome) 435 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 58 | 97,57,58 |
| view-classi | 103 | 103,89,103 |
| div | 119 | 119,120,103 |
| div-senza-classi | 84 | 84,84,84 |
| pressable-puro | 89 | 89,103,89 |
| pressable-classi | 136 | 136,136,136 |
| btn-vuoto | 139 | 173,137,139 |
| text-puro | 91 | 91,80,94 |
| text | 139 | 139,124,141 |
| span | 138 | 138,137,138 |
| btn | 208 | 208,206,224 |
| riga | 676 | 751,676,643 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    53932                          87744
         Native Heap:   250580                         253824
                Code:    24168                         149252
               Stack:     1992                           2000
            Graphics:        0                              0
       Private Other:   160756
              System:    16826
             Unknown:                                  166532
 
           TOTAL PSS:   508254            TOTAL RSS:   659352      TOTAL SWAP (KB):        0
```
