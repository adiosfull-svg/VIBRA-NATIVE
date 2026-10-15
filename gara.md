# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 9216 ms da app chiusa (di cui 2713 ms prima della prima riga di JS) · originale 4674 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 15014⚠ | 2137 | ❌ | 245 | 388 | ✅ | 83.8% | –% |
| /clienti | errore | 1526 |  | 15005⚠ | 395 | ❌ | –% | –% |
| /promoter | 232 | 818 | ✅ | 207 | 1172 | ✅ | 83.9% | –% |
| /promoter/prom000000000000000001 | 1693 | 654 | ❌ | 1128 | 743 | ❌ | 84.4% | –% |
| /locali | 262 | 1041 | ✅ | 273 | 390 | ✅ | 84.2% | –% |
| /report | errore | 918 |  | errore | 481 |  | –% | –% |
| /messaggi | 160 | 1463 | ✅ | 182 | 679 | ✅ | 84.3% | –% |
| /importa-serata | 202 | 706 | ✅ | 144 | 688 | ✅ | 84.8% | –% |
| /impostazioni-app | 131 | 595 | ✅ | 128 | 807 | ✅ | 84.9% | –% |
| /admin-console | 401 | 1182 | ✅ | 87 | 637 | ✅ | 85% | –% |
| /clienti-analytics | 935 | 1369 | ✅ | 1063 | 575 | ❌ | 84.3% | –% |
| /academy | 766 | 505 | ❌ | 490 | 1716 | ✅ | 83.8% | –% |
| /notifiche | 189 | 1049 | ✅ | 117 | 492 | ✅ | 84.7% | –% |
| /dashboard | 15013⚠ | 1207 | ❌ | 757 | 691 | ❌ | 83.7% | –% |

Memoria (PSS): nativa 331 MB · originale (Chrome) 353 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 55 | 60,55,51 |
| view-classi | 88 | 88,87,154 |
| div | 104 | 121,102,104 |
| div-senza-classi | 67 | 67,67,67 |
| pressable-puro | 88 | 88,85,95 |
| pressable-classi | 123 | 154,123,122 |
| btn-vuoto | 136 | 138,134,136 |
| text-puro | 81 | 100,59,81 |
| text | 129 | 129,121,138 |
| span | 127 | 175,126,127 |
| btn | 192 | 191,221,192 |
| riga | 656 | 656,620,761 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    28692                          62608
         Native Heap:   156056                         159292
                Code:    45416                         168072
               Stack:     1624                           1628
            Graphics:        0                              0
       Private Other:    89276
              System:    16051
             Unknown:                                   95096
 
           TOTAL PSS:   337115            TOTAL RSS:   486696      TOTAL SWAP (KB):        0
```
