# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=939 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | NO |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | NO |
| 0.7s | fine | NO |
| 1.0s | inizio | NO |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | NO |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | NO |
| 1.5s | fine | NO |

Tap arrivati: 6 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro guadagni 4,4 134x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro guadagni-dettagli 142,4 162x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro serate 309,4 124x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro progressi 437,4 133x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro accordi 574,4 110x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro note 689,4 114x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro achievements 806,4 120x32
10-17 14:25:14.189  4492  4531 I ReactNativeJS: VIBRA subtab riquadro vibravs 931,4 94x32
10-17 14:25:24.304  4492  4531 I ReactNativeJS: VIBRA subtab riquadro inviti 4,4 72x32
10-17 14:25:24.306  4492  4531 I ReactNativeJS: VIBRA subtab riquadro ricontattare 80,4 131x32
10-17 14:25:24.307  4492  4531 I ReactNativeJS: VIBRA subtab riquadro semina 215,4 87x32
10-17 14:25:24.309  4492  4531 I ReactNativeJS: VIBRA subtab riquadro target 306,4 81x32
10-17 14:25:24.309  4492  4531 I ReactNativeJS: VIBRA subtab riquadro leader 392,4 85x32
10-17 14:25:24.309  4492  4531 I ReactNativeJS: VIBRA subtab riquadro tabelle 480,4 86x32
10-17 14:25:24.309  4492  4531 I ReactNativeJS: VIBRA subtab riquadro clienti 4,4 81x32
10-17 14:25:24.310  4492  4531 I ReactNativeJS: VIBRA subtab riquadro gruppi 89,4 83x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro parco 177,4 125x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro albero 306,4 82x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro comitive 392,4 95x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro tabelle 491,4 86x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro growth 582,4 86x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro analitica 672,4 94x32
10-17 14:25:24.311  4492  4531 I ReactNativeJS: VIBRA subtab riquadro mappa 771,4 84x32
10-17 14:25:53.261  4492  4531 I ReactNativeJS: VIBRA subtab premuto clienti
10-17 14:25:53.261  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=3340
10-17 14:25:53.281  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:25:53.397  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 14:25:53.877  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 14:25:53.877  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:25:59.276  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=5400ms lancio=0 x=0 page=362,151 loc=9,8 target=3374
10-17 14:25:59.311  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:00.328  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=293
10-17 14:26:00.428  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=293
10-17 14:26:05.812  6141  6141 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 14:26:05.860  4492  4531 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:26:05.860  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=5775ms lancio=0 x=293 page=49,151 loc=7,7 target=3370
10-17 14:26:05.878  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:06.258  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=102
10-17 14:26:06.262  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:26:06.397  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:26:06.397  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=467ms lancio=1 x=102 page=157,151 loc=34,8 target=3362
10-17 14:26:06.397  4492  4531 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 14:26:06.397  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:06.717  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=102
10-17 14:26:06.859  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=102
10-17 14:26:09.544  6206  6206 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 14:26:09.594  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3664ms lancio=0 x=102 page=362,151 loc=24,8 target=3386
10-17 14:26:09.594  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:09.930  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=339
10-17 14:26:10.142  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:26:10.142  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=471ms lancio=1 x=339 page=358,151 loc=9,16 target=3424
10-17 14:26:10.142  4492  4531 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 14:26:10.142  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:10.342  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=339
10-17 14:26:10.443  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=339
10-17 14:26:12.971  6255  6255 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 14:26:12.993  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3322ms lancio=0 x=339 page=49,151 loc=34,8 target=3374
10-17 14:26:13.027  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:13.067  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=155
10-17 14:26:13.310  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:26:13.547  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:26:13.547  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=237ms lancio=0 x=0 page=157,151 loc=20,8 target=3350
10-17 14:26:13.547  4492  4531 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 14:26:13.547  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:13.799  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 14:26:13.799  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:26:16.429  6275  6275 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 14:26:16.461  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3151ms lancio=0 x=0 page=362,151 loc=9,8 target=3374
10-17 14:26:16.461  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:16.754  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=251
10-17 14:26:17.167  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:26:17.167  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:26:17.167  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=0ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:26:17.355  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:19.966  6309  6309 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 14:26:19.994  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:19.995  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2828ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:26:19.995  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:20.214  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:20.480  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=181
10-17 14:26:20.676  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=181
10-17 14:26:20.910  4492  4531 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:26:20.910  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=696ms lancio=0 x=181 page=157,151 loc=4,7 target=3370
10-17 14:26:20.910  4492  4531 I ReactNativeJS: VIBRA subtab albero
10-17 14:26:20.910  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:21.177  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:26:21.206  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=181
10-17 14:26:21.264  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=157
10-17 14:26:23.567  6342  6342 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 14:26:23.593  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:23.593  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2329ms lancio=0 x=157 page=362,151 loc=0,7 target=3394
10-17 14:26:23.610  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:23.722  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=402
10-17 14:26:23.912  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:24.014  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=402
10-17 14:26:24.161  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=439ms lancio=0 x=402 page=358,151 loc=40,8 target=3422
10-17 14:26:24.162  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:26.782  6363  6363 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 14:26:26.810  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3089ms lancio=0 x=402 page=49,151 loc=11,8 target=3386
10-17 14:26:26.827  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:26.952  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=169
10-17 14:26:27.177  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:26:27.693  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=516ms lancio=0 x=0 page=157,151 loc=20,8 target=3350
10-17 14:26:27.693  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:30.304  6385  6385 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 14:26:30.326  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3149ms lancio=0 x=0 page=362,151 loc=9,8 target=3374
10-17 14:26:30.344  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:30.474  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=278
10-17 14:26:30.697  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:26:31.210  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=513ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:26:31.210  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:33.821  6406  6406 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 14:26:33.843  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:33.843  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3146ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:26:33.862  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:34.066  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=231
10-17 14:26:34.069  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:34.210  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=231
10-17 14:26:35.126  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1154ms lancio=0 x=231 page=157,151 loc=34,8 target=3374
10-17 14:26:35.127  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:37.730  6427  6427 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 14:26:37.760  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3788ms lancio=0 x=231 page=362,151 loc=578,20 target=3438
10-17 14:26:37.761  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:38.004  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:26:38.004  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:26:39.076  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1173ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:26:39.077  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:41.687  6449  6449 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 14:26:41.710  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:41.710  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3806ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:26:41.729  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:41.893  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=235
10-17 14:26:41.947  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:42.112  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=235
10-17 14:26:43.410  4492  4531 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:26:43.410  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1516ms lancio=0 x=235 page=157,151 loc=71,16 target=3376
10-17 14:26:43.410  4492  4531 I ReactNativeJS: VIBRA subtab albero
10-17 14:26:43.410  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:43.543  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:26:46.105  6528  6528 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 14:26:46.126  4492  4531 I ReactNativeJS: VIBRA subtab premuto growth
10-17 14:26:46.126  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=4233ms lancio=0 x=235 page=362,151 loc=0,16 target=3412
10-17 14:26:46.161  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:46.205  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=393
10-17 14:26:46.383  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:26:46.383  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 14:26:47.726  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1344ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:26:47.727  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:50.346  6549  6549 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 14:26:50.377  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:50.377  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3994ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:26:50.396  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:50.605  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=253
10-17 14:26:50.605  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:50.746  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:26:50.746  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=237ms lancio=1 x=253 page=157,151 loc=2,16 target=3388
10-17 14:26:50.747  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:50.747  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=253
10-17 14:26:53.370  6570  6570 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 14:26:53.393  4492  4531 I ReactNativeJS: VIBRA subtab premuto growth
10-17 14:26:53.394  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2884ms lancio=0 x=253 page=362,151 loc=6,7 target=3406
10-17 14:26:53.410  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:53.536  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:26:53.536  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:26:53.698  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:26:53.699  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=164ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:26:53.700  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:53.701  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 14:26:56.318  6607  6607 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 14:26:56.344  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:56.344  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2808ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:26:56.344  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:56.482  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=175
10-17 14:26:56.579  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:56.704  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=175
10-17 14:26:56.754  4492  4531 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:26:56.754  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=272ms lancio=0 x=175 page=157,151 loc=10,16 target=3376
10-17 14:26:56.754  4492  4531 I ReactNativeJS: VIBRA subtab albero
10-17 14:26:56.762  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:26:56.893  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:26:59.371  6630  6630 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 14:26:59.393  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:26:59.393  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2912ms lancio=0 x=175 page=362,151 loc=30,16 target=3400
10-17 14:26:59.416  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:26:59.527  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=433
10-17 14:26:59.623  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:26:59.746  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=433
10-17 14:26:59.810  4492  4531 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 14:26:59.812  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=285ms lancio=0 x=433 page=358,151 loc=4,16 target=3436
10-17 14:26:59.812  4492  4531 I ReactNativeJS: VIBRA subtab mappa
10-17 14:26:59.813  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:00.172  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 14:27:00.392  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=433
10-17 14:27:00.582  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:27:03.149  6758  6758 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 14:27:03.417  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:27:03.417  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2836ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:27:03.418  4492  4531 I ReactNativeJS: VIBRA subtab tabelle
10-17 14:27:03.423  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:07.006  6779  6779 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 14:27:07.175  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:27:07.176  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=6594ms lancio=0 x=480 page=157,151 loc=7,8 target=3410
10-17 14:27:07.177  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:07.185  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=6603ms lancio=0 x=480 page=362,151 loc=24,8 target=3434
10-17 14:27:07.186  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:07.186  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:27:07.187  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:27:07.567  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:27:07.567  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:27:08.018  4492  4531 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:27:08.022  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=7440ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:27:08.022  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:10.598  6823  6823 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 14:27:10.627  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:27:10.627  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2605ms lancio=0 x=480 page=49,151 loc=9,7 target=3394
10-17 14:27:10.628  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:11.150  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:27:11.456  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=161
10-17 14:27:11.559  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=161
10-17 14:27:12.177  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1027ms lancio=0 x=161 page=157,151 loc=302,20 target=3438
10-17 14:27:12.177  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:14.798  6848  6848 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 14:27:14.827  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:27:14.827  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3677ms lancio=0 x=161 page=362,151 loc=4,7 target=3394
10-17 14:27:14.827  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:15.327  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:27:15.436  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=471
10-17 14:27:15.943  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=471
10-17 14:27:16.183  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=856ms lancio=0 x=471 page=358,151 loc=10,8 target=3434
10-17 14:27:16.200  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:18.830  6875  6875 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 14:27:18.860  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:27:18.860  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3534ms lancio=0 x=471 page=49,151 loc=12,16 target=3400
10-17 14:27:18.877  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:19.359  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:27:19.465  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=237
10-17 14:27:19.861  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=237
10-17 14:27:20.526  4492  4531 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:27:20.527  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1171ms lancio=0 x=237 page=157,151 loc=73,16 target=3376
10-17 14:27:20.527  4492  4531 I ReactNativeJS: VIBRA subtab albero
10-17 14:27:20.527  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:20.710  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:27:20.845  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=237
10-17 14:27:20.866  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=157
10-17 14:27:23.148  6896  6896 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 14:27:23.177  4492  4531 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:27:23.177  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=2311ms lancio=0 x=157 page=362,151 loc=0,7 target=3394
10-17 14:27:23.194  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:23.319  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=389
10-17 14:27:23.405  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:27:23.573  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=389
10-17 14:27:24.360  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1041ms lancio=0 x=389 page=358,151 loc=27,8 target=3422
10-17 14:27:24.360  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:26.976  6917  6917 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 14:27:26.993  4492  4531 I ReactNativeJS: VIBRA subtab premuto comitive
10-17 14:27:26.993  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=3674ms lancio=0 x=389 page=49,151 loc=29,16 target=3388
10-17 14:27:27.028  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:27.072  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=240
10-17 14:27:27.255  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:27:27.259  4492  4531 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 14:27:28.626  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1372ms lancio=0 x=0 page=157,151 loc=20,8 target=3350
10-17 14:27:28.626  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:27:31.261  6942  6942 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 14:27:31.293  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=4039ms lancio=0 x=0 page=362,151 loc=9,8 target=3374
10-17 14:27:31.310  4492  4531 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:27:31.437  4492  4531 I ReactNativeJS: VIBRA hscroll lancio x=206
10-17 14:27:31.653  4492  4531 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:27:32.976  4492  4531 I ReactNativeJS: VIBRA hscroll tocco dopo=1323ms lancio=0 x=480 page=358,151 loc=19,8 target=3434
10-17 14:27:32.977  4492  4531 I ReactNativeJS: VIBRA hscroll fine-tocco
```
