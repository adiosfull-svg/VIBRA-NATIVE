# Gara — utente admin

Tempi in ms (più basso = meglio). «pronta» = la pagina ha finito di cambiare; ⚠ = non si ferma entro 15 s.

Avvio: nativa 11399 ms da app chiusa (di cui 3989 ms prima della prima riga di JS) · originale 2809 ms (pagina in Chrome già aperto)

| pagina | nativa 1ª | originale 1ª | | nativa 2ª | originale 2ª | | frame persi nativa | frame persi originale |
|---|---|---|---|---|---|---|---|---|
| /serate | 611 | 1273 | ✅ | 288 | 379 | ✅ | 85.9% | –% |
| /clienti | 709 | 1302 | ✅ | 750 | 942 | ✅ | 83.7% | 92.1% |
| /promoter | 1412 | 2309 | ✅ | 561 | 881 | ✅ | 89.5% | –% |
| /promoter/prom000000000000000001 | 1474 | 145 | ❌ | 1233 | 1037 | ❌ | 90.3% | –% |
| /locali | 1273 | 1223 | ❌ | 325 | 523 | ✅ | 90% | –% |
| /report | 334 | 442 | ✅ | 267 | 152 | ❌ | 89% | –% |
| /messaggi | 660 | 686 | ✅ | 265 | 406 | ✅ | 88.3% | –% |
| /importa-serata | 182 | 515 | ✅ | 359 | 777 | ✅ | 88.8% | 93.1% |
| /impostazioni-app | 148 | 885 | ✅ | 202 | 367 | ✅ | 88.1% | –% |
| /admin-console | 804 | 889 | ✅ | 201 | 546 | ✅ | 87.5% | –% |
| /clienti-analytics | 973 | 1262 | ✅ | 787 | 958 | ✅ | 87.2% | –% |
| /academy | 415 | 3910 | ✅ | 522 | 1735 | ✅ | 87.1% | –% |
| /notifiche | 126 | 488 | ✅ | 79 | 625 | ✅ | 87% | –% |
| /dashboard | 918 | 102 | ❌ | 435 | 869 | ✅ | 90.8% | –% |

Memoria (PSS): nativa 584 MB · originale (Chrome) 383 MB

## Costo per elemento (nativa, 300 elementi, ms dal montaggio al layout)

| caso | ms | ripetizioni |
|---|---|---|
| view-puro | 51 | 51,57,49 |
| view-classi | 89 | 89,104,87 |
| div | 117 | 120,117,104 |
| div-senza-classi | 69 | 84,69,67 |
| pressable-puro | 105 | 104,105,108 |
| pressable-classi | 221 | 136,221,221 |
| btn-vuoto | 137 | 137,138,121 |
| text-puro | 78 | 78,58,98 |
| text | 125 | 124,128,125 |
| span | 128 | 143,128,124 |
| btn | 225 | 240,225,208 |
| riga | 720 | 571,772,720 |

```
Memoria nativa per categoria:
Pss(KB)                        Rss(KB)
                        ------                         ------
           Java Heap:    51840                          85728
         Native Heap:   285672                         288892
                Code:    23288                         146816
               Stack:     1560                           1568
            Graphics:        0                              0
       Private Other:   219772
              System:    16329
             Unknown:                                  225640
 
           TOTAL PSS:   598461            TOTAL RSS:   748644      TOTAL SWAP (KB):        0
```
