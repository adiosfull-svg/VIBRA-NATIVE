# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=1037 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | NO |
| 0.2s | fine | NO |
| 0.4s | inizio | NO |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | NO |
| 1.0s | fine | NO |
| 1.5s | inizio | NO |
| 1.5s | fine | NO |
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | NO |
| 1.5s | fine | NO |

Tap arrivati: 5 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 16:48:29.857  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0
10-17 16:48:35.740  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=5250ms lancio=0
10-17 16:48:41.924  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=5256ms lancio=0
10-17 16:48:42.524  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=229ms lancio=0
10-17 16:48:45.090  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2795ms lancio=0
10-17 16:48:48.356  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2901ms lancio=0
10-17 16:48:49.276  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=648ms lancio=1
10-17 16:48:51.858  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3230ms lancio=0
10-17 16:48:55.057  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2929ms lancio=0
10-17 16:48:55.900  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0
10-17 16:48:58.589  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2689ms lancio=0
10-17 16:49:02.273  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2916ms lancio=0
10-17 16:49:03.606  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=1066ms lancio=0
10-17 16:49:03.606  9677  9700 I ReactNativeJS: VIBRA subtab parco
10-17 16:49:06.174  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2120ms lancio=0
10-17 16:49:09.674  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3304ms lancio=0
10-17 16:49:11.123  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=1248ms lancio=0
10-17 16:49:13.690  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3815ms lancio=0
10-17 16:49:17.539  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3304ms lancio=0
10-17 16:49:19.139  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=1245ms lancio=0
10-17 16:49:21.706  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3812ms lancio=0
10-17 16:49:25.890  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3957ms lancio=0
10-17 16:49:26.404  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=322ms lancio=1
10-17 16:49:28.990  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2908ms lancio=0
10-17 16:49:32.040  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2857ms lancio=0
10-17 16:49:32.690  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=459ms lancio=0
10-17 16:49:32.691  9677  9700 I ReactNativeJS: VIBRA subtab albero
10-17 16:49:35.256  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2182ms lancio=0
10-17 16:49:38.407  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2742ms lancio=0
10-17 16:49:39.173  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=610ms lancio=0
10-17 16:49:39.173  9677  9700 I ReactNativeJS: VIBRA subtab albero
10-17 16:49:41.740  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3177ms lancio=0
10-17 16:49:44.891  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=2997ms lancio=0
10-17 16:49:45.923  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=880ms lancio=0
10-17 16:49:45.923  9677  9700 I ReactNativeJS: VIBRA subtab albero
10-17 16:49:48.489  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3447ms lancio=0
10-17 16:49:51.957  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3054ms lancio=0
10-17 16:49:53.289  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=1179ms lancio=0
10-17 16:49:53.290  9677  9700 I ReactNativeJS: VIBRA subtab albero
10-17 16:49:55.857  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3747ms lancio=0
10-17 16:49:59.623  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3606ms lancio=0
10-17 16:50:01.223  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=1288ms lancio=0
10-17 16:50:03.790  9677  9700 I ReactNativeJS: VIBRA hscroll tocco dopo=3855ms lancio=0
```
