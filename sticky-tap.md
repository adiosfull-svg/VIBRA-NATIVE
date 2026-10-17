# Tap sulla barra delle tab dopo un lancio (admin)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=1037 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | NO |
| 0.4s | inizio | sì |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| controllo | fermo | sì |
| controllo | fermo | NO |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |
| controllo | fermo | sì |

Tap arrivati: 19 su 32

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 20:48:00.289  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata inviti dopo=91048ms
10-17 20:48:00.301  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata clienti dopo=91060ms
10-17 20:48:00.303  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata progressi dopo=91062ms
10-17 20:48:00.945  4664  4702 I ReactNativeJS: VIBRA subtab disegnata inviti dopo=91703ms
10-17 20:48:00.945  4664  4702 I ReactNativeJS: VIBRA subtab disegnata clienti dopo=91704ms
10-17 20:48:00.945  4664  4702 I ReactNativeJS: VIBRA subtab disegnata progressi dopo=91704ms
10-17 20:48:32.960  4664  4702 I ReactNativeJS: VIBRA subtab premuto clienti dopo=123719ms
10-17 20:48:32.960  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=2634
10-17 20:48:32.978  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:48:33.093  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 20:48:33.577  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:48:33.577  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:48:40.094  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=130853ms
10-17 20:48:40.094  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=6517ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:48:40.115  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:48:40.550  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:48:41.316  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=224
10-17 20:48:41.395  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=224
10-17 20:48:47.448  5781  5781 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 20:48:47.493  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=138251ms
10-17 20:48:47.493  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=6608ms lancio=0 x=224 page=49,151 loc=48,8 target=2656
10-17 20:48:47.511  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:48:47.853  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=11
10-17 20:48:47.854  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:48:48.095  4664  4702 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:48:48.095  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=479ms lancio=1 x=11 page=157,151 loc=30,8 target=2644
10-17 20:48:48.110  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=15ms
10-17 20:48:48.144  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=11
10-17 20:48:48.176  4664  4702 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:48:48.179  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=69ms
10-17 20:48:48.298  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=188ms
10-17 20:48:48.316  4664  4702 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=206ms
10-17 20:48:48.316  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=206ms
10-17 20:48:50.993  6061  6061 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 20:48:51.044  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2933ms
10-17 20:48:51.044  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1897ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:48:51.044  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:48:51.253  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:48:51.428  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=305
10-17 20:48:51.843  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=305
10-17 20:48:54.312  6151  6151 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 20:48:54.344  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=6233ms
10-17 20:48:54.344  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3091ms lancio=0 x=305 page=49,151 loc=32,16 target=2670
10-17 20:48:54.345  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:48:54.546  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:48:54.791  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=15
10-17 20:48:54.961  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=15
10-17 20:48:55.109  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=6999ms
10-17 20:48:55.110  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=564ms lancio=0 x=15 page=157,151 loc=35,8 target=2644
10-17 20:48:55.110  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=7000ms
10-17 20:48:55.110  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:48:55.170  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=60ms
10-17 20:48:55.259  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:48:57.849  6284  6284 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 20:48:57.893  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2784ms
10-17 20:48:57.894  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3348ms lancio=0 x=15 page=362,151 loc=24,8 target=2668
10-17 20:48:57.914  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:48:58.141  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:48:58.269  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=256
10-17 20:48:58.528  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=256
10-17 20:49:01.360  6322  6322 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 20:49:01.426  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=6316ms
10-17 20:49:01.426  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3286ms lancio=0 x=256 page=49,151 loc=79,8 target=2656
10-17 20:49:01.445  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:01.642  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=15
10-17 20:49:01.643  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:49:02.045  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:49:02.401  4664  4702 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:49:02.402  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=357ms lancio=0 x=0 page=157,151 loc=20,8 target=2644
10-17 20:49:02.403  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:49:02.460  4664  4702 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:49:02.460  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=57ms
10-17 20:49:02.542  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=139ms
10-17 20:49:05.060  6401  6401 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 20:49:05.094  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2691ms
10-17 20:49:05.094  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3049ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:49:05.094  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:05.260  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=242
10-17 20:49:05.261  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:05.396  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=242
10-17 20:49:08.635  6425  6425 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 20:49:08.659  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=6256ms
10-17 20:49:08.660  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3475ms lancio=0 x=242 page=49,151 loc=66,8 target=2656
10-17 20:49:08.678  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:08.843  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:49:09.069  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:49:09.069  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:49:09.826  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=7423ms
10-17 20:49:09.826  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=984ms lancio=0 x=0 page=157,151 loc=20,8 target=2644
10-17 20:49:09.826  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=7423ms
10-17 20:49:09.826  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:49:09.859  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 20:49:09.959  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:49:12.610  6472  6472 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 20:49:12.677  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2850ms
10-17 20:49:12.677  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3834ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:49:12.677  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:12.887  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:13.095  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=296
10-17 20:49:13.362  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=296
10-17 20:49:16.620  6515  6515 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 20:49:16.677  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=6850ms
10-17 20:49:16.677  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3790ms lancio=0 x=296 page=49,151 loc=23,16 target=2670
10-17 20:49:16.699  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:16.815  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:17.109  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=59
10-17 20:49:17.404  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=59
10-17 20:49:18.176  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=8350ms
10-17 20:49:18.177  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1362ms lancio=0 x=59 page=157,151 loc=23,16 target=2658
10-17 20:49:18.177  4664  4702 I ReactNativeJS: VIBRA subtab parco dopo=8350ms
10-17 20:49:18.177  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:49:18.194  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=17ms
10-17 20:49:18.211  4664  4702 I ReactNativeJS: VIBRA subtab disegnata parco dopo=34ms
10-17 20:49:18.211  4664  4702 I ReactNativeJS: VIBRA subtab cambio parco dopo=34ms
10-17 20:49:18.436  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:49:20.796  6548  6548 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 20:49:20.826  4664  4702 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2649ms
10-17 20:49:20.826  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=2014ms lancio=0 x=50 page=362,151 loc=5,16 target=2682
10-17 20:49:20.844  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:21.032  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:49:21.195  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=333
10-17 20:49:21.513  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=333
10-17 20:49:24.861  6569  6569 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 20:49:24.894  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=6717ms
10-17 20:49:24.894  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3862ms lancio=0 x=333 page=49,151 loc=27,8 target=2668
10-17 20:49:24.895  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:25.115  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:25.285  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=23
10-17 20:49:25.495  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=23
10-17 20:49:26.859  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=8682ms
10-17 20:49:26.860  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1758ms lancio=0 x=23 page=157,151 loc=74,16 target=2646
10-17 20:49:26.860  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=8683ms
10-17 20:49:26.860  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:49:26.874  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata gruppi dopo=14ms
10-17 20:49:26.877  4664  4702 I ReactNativeJS: VIBRA subtab disegnata gruppi dopo=17ms
10-17 20:49:26.893  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 20:49:27.046  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:49:29.564  6609  6609 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 20:49:29.593  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2733ms
10-17 20:49:29.594  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=2217ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:49:29.612  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:29.757  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:29.953  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=238
10-17 20:49:30.076  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=238
10-17 20:49:34.111  6630  6630 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 20:49:34.143  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=7283ms
10-17 20:49:34.143  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=4387ms lancio=0 x=238 page=49,151 loc=62,8 target=2656
10-17 20:49:34.163  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:34.305  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:49:34.375  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=2
10-17 20:49:34.708  4664  4702 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 20:49:34.711  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=406ms lancio=1 x=2 page=157,151 loc=22,8 target=2644
10-17 20:49:34.711  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:49:34.762  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=2
10-17 20:49:34.781  4664  4702 I ReactNativeJS: VIBRA hscroll tap-di-riserva
10-17 20:49:34.781  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=70ms
10-17 20:49:34.826  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=115ms
10-17 20:49:38.191  6669  6669 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 20:49:38.211  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=3500ms
10-17 20:49:38.211  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3907ms lancio=0 x=2 page=362,151 loc=11,8 target=2668
10-17 20:49:38.227  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:38.402  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=249
10-17 20:49:38.402  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:38.959  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=249
10-17 20:49:41.354  6690  6690 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 20:49:41.376  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=6665ms
10-17 20:49:41.376  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=2974ms lancio=0 x=249 page=49,151 loc=73,8 target=2656
10-17 20:49:41.394  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:41.549  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:49:41.730  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:49:41.730  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:49:41.993  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=7282ms
10-17 20:49:41.993  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=445ms lancio=0 x=0 page=157,151 loc=20,8 target=2644
10-17 20:49:41.993  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=7282ms
10-17 20:49:41.993  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:49:42.106  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=53ms
10-17 20:49:42.126  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:49:44.654  6711  6711 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 20:49:44.676  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2683ms
10-17 20:49:44.676  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3128ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:49:44.694  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:44.838  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:45.033  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=260
10-17 20:49:45.194  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=260
10-17 20:49:47.948  6732  6732 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 20:49:47.977  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=5984ms
10-17 20:49:47.977  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3139ms lancio=0 x=260 page=49,151 loc=116,16 target=2658
10-17 20:49:47.977  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:48.206  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:49:48.282  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:49:48.283  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:49:48.727  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=6734ms
10-17 20:49:48.727  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=521ms lancio=0 x=0 page=157,151 loc=20,8 target=2644
10-17 20:49:48.727  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=6734ms
10-17 20:49:48.727  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:49:48.760  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=32ms
10-17 20:49:48.859  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:49:51.356  6754  6754 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 20:49:51.394  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2666ms
10-17 20:49:51.394  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3188ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:49:51.394  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:51.456  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=238
10-17 20:49:51.549  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:51.729  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:49:54.618  6775  6775 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 20:49:54.643  4664  4702 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=5915ms
10-17 20:49:54.643  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=2914ms lancio=0 x=480 page=49,151 loc=21,16 target=2694
10-17 20:49:54.680  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:54.716  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=287
10-17 20:49:54.796  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:49:55.016  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:49:55.443  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=6716ms
10-17 20:49:55.443  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=427ms lancio=0 x=0 page=157,151 loc=20,8 target=2644
10-17 20:49:55.444  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=6716ms
10-17 20:49:55.444  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:49:55.478  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=32ms
10-17 20:49:55.576  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:49:58.106  6819  6819 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 20:49:58.127  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2684ms
10-17 20:49:58.128  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3112ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:49:58.144  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:49:58.287  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:49:58.438  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=260
10-17 20:49:58.643  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=260
10-17 20:50:01.830  6842  6842 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 20:50:01.860  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=6416ms
10-17 20:50:01.861  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3574ms lancio=0 x=260 page=49,151 loc=116,16 target=2658
10-17 20:50:01.861  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:50:02.025  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:50:02.219  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 20:50:02.219  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 20:50:03.243  4664  4702 I ReactNativeJS: VIBRA subtab premuto gruppi dopo=7799ms
10-17 20:50:03.243  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1218ms lancio=0 x=0 page=157,151 loc=20,8 target=2644
10-17 20:50:03.259  4664  4702 I ReactNativeJS: VIBRA subtab gruppi dopo=7816ms
10-17 20:50:03.259  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=16ms
10-17 20:50:03.293  4664  4702 I ReactNativeJS: VIBRA subtab cambio gruppi dopo=33ms
10-17 20:50:03.376  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 20:50:05.873  6863  6863 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 20:50:05.910  4664  4702 I ReactNativeJS: VIBRA subtab premuto albero dopo=2651ms
10-17 20:50:05.910  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3885ms lancio=0 x=0 page=362,151 loc=9,8 target=2668
10-17 20:50:05.927  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:50:05.981  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=162
10-17 20:50:06.067  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 20:50:06.277  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:50:09.678  6885  6885 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 20:50:09.710  4664  4702 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6451ms
10-17 20:50:09.711  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3433ms lancio=0 x=480 page=49,151 loc=21,16 target=2694
10-17 20:50:09.711  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:50:09.866  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:50:09.994  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=152
10-17 20:50:10.159  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=152
10-17 20:50:11.543  4664  4702 I ReactNativeJS: VIBRA subtab premuto parco dopo=8283ms
10-17 20:50:11.543  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1677ms lancio=0 x=152 page=157,151 loc=116,16 target=2658
10-17 20:50:11.543  4664  4702 I ReactNativeJS: VIBRA subtab parco dopo=8284ms
10-17 20:50:11.543  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:11.559  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata parco dopo=15ms
10-17 20:50:11.577  4664  4702 I ReactNativeJS: VIBRA subtab disegnata parco dopo=33ms
10-17 20:50:11.577  4664  4702 I ReactNativeJS: VIBRA subtab cambio parco dopo=33ms
10-17 20:50:11.748  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 20:50:14.172  6907  6907 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 20:50:14.193  4664  4702 I ReactNativeJS: VIBRA subtab premuto comitive dopo=2649ms
10-17 20:50:14.193  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=2215ms lancio=0 x=50 page=362,151 loc=5,16 target=2682
10-17 20:50:14.228  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:50:14.381  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=200
10-17 20:50:14.382  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:50:14.734  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 20:50:18.510  4664  4702 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=6967ms
10-17 20:50:18.510  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3776ms lancio=0 x=480 page=49,151 loc=21,16 target=2694
10-17 20:50:18.544  4664  4702 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 20:50:18.716  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:50:19.303  4664  4702 I ReactNativeJS: VIBRA hscroll lancio x=225
10-17 20:50:19.409  4664  4702 I ReactNativeJS: VIBRA hscroll ferma x=225
10-17 20:50:22.321  6928  6928 I ReactNativeJS: VIBRA prova controllo senza-lancio
10-17 20:50:22.410  4664  4702 I ReactNativeJS: VIBRA subtab premuto comitive dopo=10866ms
10-17 20:50:22.410  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=3158ms lancio=0 x=225 page=265,151 loc=50,8 target=2680
10-17 20:50:22.410  4664  4702 I ReactNativeJS: VIBRA subtab comitive dopo=10867ms
10-17 20:50:22.410  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:22.429  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=19ms
10-17 20:50:22.443  4664  4702 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-17 20:50:22.443  4664  4702 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-17 20:50:22.669  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:50:25.043  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1885ms lancio=0 x=250 page=157,151 loc=391,20 target=2732
10-17 20:50:25.043  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:27.676  4664  4702 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2633ms
10-17 20:50:27.676  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=4518ms lancio=0 x=250 page=265,151 loc=8,16 target=2694
10-17 20:50:27.677  4664  4702 I ReactNativeJS: VIBRA subtab tabelle dopo=2634ms
10-17 20:50:27.677  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:50:27.691  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=14ms
10-17 20:50:27.693  4664  4702 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=16ms
10-17 20:50:27.709  4664  4702 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-17 20:50:28.826  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:50:30.962  4664  4702 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3286ms
10-17 20:50:30.963  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1026ms lancio=0 x=344 page=157,151 loc=93,16 target=2682
10-17 20:50:30.963  4664  4702 I ReactNativeJS: VIBRA subtab comitive dopo=3286ms
10-17 20:50:30.963  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:30.995  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=32ms
10-17 20:50:31.011  4664  4702 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=48ms
10-17 20:50:31.016  4664  4702 I ReactNativeJS: VIBRA subtab cambio comitive dopo=53ms
10-17 20:50:31.180  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:50:33.626  4664  4702 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2663ms
10-17 20:50:33.626  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1946ms lancio=0 x=250 page=265,151 loc=8,16 target=2694
10-17 20:50:33.627  4664  4702 I ReactNativeJS: VIBRA subtab tabelle dopo=2664ms
10-17 20:50:33.627  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:33.644  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=17ms
10-17 20:50:33.660  4664  4702 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=33ms
10-17 20:50:33.660  4664  4702 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-17 20:50:34.755  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:50:37.076  4664  4702 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3449ms
10-17 20:50:37.076  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1302ms lancio=0 x=344 page=157,151 loc=93,16 target=2682
10-17 20:50:37.077  4664  4702 I ReactNativeJS: VIBRA subtab comitive dopo=3450ms
10-17 20:50:37.077  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=1ms
10-17 20:50:37.096  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=19ms
10-17 20:50:37.110  4664  4702 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=33ms
10-17 20:50:37.110  4664  4702 I ReactNativeJS: VIBRA subtab cambio comitive dopo=33ms
10-17 20:50:37.266  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 20:50:39.710  4664  4702 I ReactNativeJS: VIBRA subtab premuto tabelle dopo=2633ms
10-17 20:50:39.710  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1912ms lancio=0 x=250 page=265,151 loc=8,16 target=2694
10-17 20:50:39.710  4664  4702 I ReactNativeJS: VIBRA subtab tabelle dopo=2633ms
10-17 20:50:39.710  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:39.728  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata tabelle dopo=17ms
10-17 20:50:39.743  4664  4702 I ReactNativeJS: VIBRA subtab disegnata tabelle dopo=33ms
10-17 20:50:39.743  4664  4702 I ReactNativeJS: VIBRA subtab cambio tabelle dopo=33ms
10-17 20:50:40.845  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 20:50:43.143  4664  4702 I ReactNativeJS: VIBRA subtab premuto comitive dopo=3432ms
10-17 20:50:43.143  4664  4702 I ReactNativeJS: VIBRA hscroll tocco dopo=1189ms lancio=0 x=344 page=157,151 loc=93,16 target=2682
10-17 20:50:43.143  4664  4702 I ReactNativeJS: VIBRA subtab comitive dopo=3433ms
10-17 20:50:43.143  4664  4702 I ReactNativeJS: VIBRA hscroll fine-tocco durata=0ms
10-17 20:50:43.159  4664  4702 I ReactNativeJS: VIBRA subtab evidenziata comitive dopo=16ms
10-17 20:50:43.177  4664  4702 I ReactNativeJS: VIBRA subtab disegnata comitive dopo=34ms
10-17 20:50:43.177  4664  4702 I ReactNativeJS: VIBRA subtab cambio comitive dopo=34ms
10-17 20:50:43.427  4664  4702 I ReactNativeJS: VIBRA subtab rilasciato comitive
```
