# Tap sulla barra delle tab dopo un lancio (admin)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=917 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | NO |
| 0.2s | fine | NO |
| 0.4s | inizio | NO |
| 0.4s | fine | NO |
| 0.7s | inizio | NO |
| 0.7s | fine | NO |
| 1.0s | inizio | NO |
| 1.0s | fine | NO |
| 1.5s | inizio | NO |
| 1.5s | fine | NO |
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | NO |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |

Tap arrivati: 6 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 14:06:21.205  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0
10-17 14:06:27.003  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=5161ms lancio=0
10-17 14:06:33.337  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=5462ms lancio=0
10-17 14:06:33.651  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=169ms lancio=1
10-17 14:06:36.421  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2939ms lancio=0
10-17 14:06:36.813  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=320ms lancio=1
10-17 14:06:39.520  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3027ms lancio=0
10-17 14:06:40.020  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=285ms lancio=0
10-17 14:06:42.621  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2886ms lancio=0
10-17 14:06:43.153  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=307ms lancio=0
10-17 14:06:45.754  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2908ms lancio=0
10-17 14:06:46.570  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=587ms lancio=0
10-17 14:06:49.504  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3522ms lancio=0
10-17 14:06:50.367  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=232ms lancio=0
10-17 14:06:52.970  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2835ms lancio=0
10-17 14:06:53.887  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=349ms lancio=0
10-17 14:06:56.487  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2949ms lancio=0
10-17 14:06:57.287  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=392ms lancio=0
10-17 14:06:59.870  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2976ms lancio=0
10-17 14:07:01.153  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=823ms lancio=0
10-17 14:07:03.737  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3407ms lancio=0
10-17 14:07:05.170  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1221ms lancio=0
10-17 14:07:07.837  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3889ms lancio=0
10-17 14:07:09.670  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1603ms lancio=0
10-17 14:07:12.253  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=4187ms lancio=0
10-17 14:07:13.970  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1178ms lancio=0
10-17 14:07:16.587  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3794ms lancio=0
10-17 14:07:16.980  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=174ms lancio=1
10-17 14:07:19.570  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2764ms lancio=0
10-17 14:07:20.012  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=194ms lancio=0
10-17 14:07:22.604  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2785ms lancio=0
10-17 14:07:23.192  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=415ms lancio=0
10-17 14:07:23.195  4458  4565 I ReactNativeJS: VIBRA subtab albero
10-17 14:07:25.787  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2222ms lancio=0
10-17 14:07:26.287  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=385ms lancio=0
10-17 14:07:28.938  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3037ms lancio=0
10-17 14:07:29.603  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=494ms lancio=0
10-17 14:07:32.186  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3077ms lancio=0
10-17 14:07:32.703  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=333ms lancio=0
10-17 14:07:35.304  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2934ms lancio=0
10-17 14:07:36.286  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=844ms lancio=0
10-17 14:07:36.287  4458  4565 I ReactNativeJS: VIBRA subtab albero
10-17 14:07:38.887  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3445ms lancio=0
10-17 14:07:39.736  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=743ms lancio=0
10-17 14:07:42.354  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3360ms lancio=0
10-17 14:07:43.586  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1125ms lancio=0
10-17 14:07:43.587  4458  4565 I ReactNativeJS: VIBRA subtab albero
10-17 14:07:46.170  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=3708ms lancio=0
10-17 14:07:47.403  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1124ms lancio=0
10-17 14:07:47.403  4458  4565 I ReactNativeJS: VIBRA subtab mappa
10-17 14:07:51.061  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=2789ms lancio=0
10-17 14:07:52.772  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1562ms lancio=0
10-17 14:07:52.804  4458  4565 I ReactNativeJS: VIBRA subtab tabelle
10-17 14:07:56.110  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=4900ms lancio=1
10-17 14:07:57.620  4458  4565 I ReactNativeJS: VIBRA hscroll tocco dopo=1510ms lancio=0
10-17 14:07:57.636  4458  4565 I ReactNativeJS: VIBRA subtab analitica
```
