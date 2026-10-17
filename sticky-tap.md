# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=996 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | NO |
| 1.0s | inizio | NO |
| 1.0s | fine | sì |
| 1.5s | inizio | NO |
| 1.5s | fine | sì |
| 0s | inizio | sì |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | NO |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |

Tap arrivati: 17 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 15:42:35.453  9511  9535 I ReactNativeJS: VIBRA subtab premuto clienti
10-17 15:42:35.453  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0 page=49,151 loc=28,16 target=4480
10-17 15:42:35.487  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:35.585  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 15:42:41.303  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=4901ms lancio=0 x=0 page=362,151 loc=9,8 target=4514
10-17 15:42:41.319  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:47.657  9758  9758 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 15:42:47.686  9511  9535 I ReactNativeJS: VIBRA subtab premuto parco
10-17 15:42:47.686  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=5537ms lancio=0 x=265 page=49,151 loc=120,16 target=4504
10-17 15:42:47.703  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:48.064  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 15:42:48.222  9511  9535 I ReactNativeJS: VIBRA subtab premuto gruppi
10-17 15:42:48.223  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=159ms lancio=0 x=22 page=157,151 loc=74,16 target=4492
10-17 15:42:48.224  9511  9535 I ReactNativeJS: VIBRA subtab gruppi
10-17 15:42:48.229  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:42:48.490  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 15:42:50.778  9781  9781 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 15:42:50.802  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1377ms lancio=0 x=0 page=362,151 loc=9,8 target=4514
10-17 15:42:50.820  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:50.983  9511  9535 I ReactNativeJS: VIBRA subtab premuto growth
10-17 15:42:50.983  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=104ms lancio=0 x=294 page=379,151 loc=77,16 target=4552
10-17 15:42:50.983  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:51.245  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 15:42:53.697  9801  9801 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 15:42:53.718  9511  9535 I ReactNativeJS: VIBRA subtab premuto albero
10-17 15:42:53.719  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=2840ms lancio=0 x=294 page=49,151 loc=9,7 target=4510
10-17 15:42:53.737  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:53.890  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 15:42:54.304  9511  9535 I ReactNativeJS: VIBRA subtab premuto gruppi
10-17 15:42:54.304  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=414ms lancio=0 x=21 page=157,151 loc=72,16 target=4492
10-17 15:42:54.304  9511  9535 I ReactNativeJS: VIBRA subtab gruppi
10-17 15:42:54.304  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:42:54.452  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato gruppi
10-17 15:42:56.862  9822  9822 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 15:42:56.885  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=2995ms lancio=0 x=21 page=362,151 loc=30,8 target=4514
10-17 15:42:56.903  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:42:57.468  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:42:57.468  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=135ms lancio=0 x=480 page=379,151 loc=73,16 target=4576
10-17 15:42:57.468  9511  9535 I ReactNativeJS: VIBRA subtab mappa
10-17 15:42:57.468  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:42:57.881  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:00.366  9959  9959 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 15:43:00.897  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:43:00.898  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3566ms lancio=0 x=480 page=49,151 loc=9,7 target=4534
10-17 15:43:00.898  9511  9535 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:43:00.902  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:01.148  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:43:01.784  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=4452ms lancio=0 x=480 page=157,151 loc=7,8 target=4550
10-17 15:43:01.786  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:04.580  9983  9983 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 15:43:07.292  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=9959ms lancio=0 x=480 page=362,151 loc=24,8 target=4574
10-17 15:43:07.292  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:07.293  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:43:07.294  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=480 page=379,151 loc=73,16 target=4576
10-17 15:43:07.294  9511  9535 I ReactNativeJS: VIBRA subtab mappa
10-17 15:43:07.294  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:08.010  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:08.368 10005 10005 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 15:43:09.359  9511  9535 I ReactNativeJS: VIBRA subtab premuto albero
10-17 15:43:09.360  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=951ms lancio=0 x=344 page=49,151 loc=71,16 target=4516
10-17 15:43:09.362  9511  9535 I ReactNativeJS: VIBRA subtab albero
10-17 15:43:09.362  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:09.663  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 15:43:10.035  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=268ms lancio=0 x=480 page=157,151 loc=7,8 target=4550
10-17 15:43:10.039  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:12.608 10048 10048 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 15:43:12.636  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:43:12.636  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=2213ms lancio=0 x=157 page=362,151 loc=0,7 target=4534
10-17 15:43:12.653  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:12.818  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:43:13.602  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=784ms lancio=0 x=404 page=379,151 loc=768,20 target=4578
10-17 15:43:13.602  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:16.151 10069 10069 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 15:43:16.187  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3368ms lancio=0 x=404 page=49,151 loc=13,8 target=4526
10-17 15:43:16.187  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:17.569  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1196ms lancio=0 x=81 page=157,151 loc=13,8 target=4502
10-17 15:43:17.569  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:20.133 10091 10091 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 15:43:20.153  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3781ms lancio=0 x=81 page=362,151 loc=4,8 target=4526
10-17 15:43:20.170  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:21.369  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:43:21.369  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1041ms lancio=0 x=409 page=379,151 loc=2,16 target=4576
10-17 15:43:21.370  9511  9535 I ReactNativeJS: VIBRA subtab mappa
10-17 15:43:21.370  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:21.565  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:24.058 10135 10135 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 15:43:24.332  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:43:24.332  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=2308ms lancio=0 x=480 page=49,151 loc=9,7 target=4534
10-17 15:43:24.502  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:43:24.503  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:26.444  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=4420ms lancio=0 x=480 page=157,151 loc=7,8 target=4550
10-17 15:43:26.456  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:29.123 10156 10156 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 15:43:29.172  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=7147ms lancio=0 x=480 page=362,151 loc=24,8 target=4574
10-17 15:43:29.175  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:31.002  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:43:31.002  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=804ms lancio=0 x=480 page=379,151 loc=73,16 target=4576
10-17 15:43:31.002  9511  9535 I ReactNativeJS: VIBRA subtab mappa
10-17 15:43:31.003  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:31.395  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:33.710 10177 10177 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 15:43:33.873  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:43:33.881  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3682ms lancio=0 x=480 page=49,151 loc=9,7 target=4534
10-17 15:43:33.905  9511  9535 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:43:33.905  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:34.039  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3841ms lancio=0 x=480 page=157,151 loc=7,8 target=4550
10-17 15:43:34.044  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:34.045  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:43:36.858 10197 10197 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 15:43:39.406  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=9207ms lancio=0 x=480 page=362,151 loc=24,8 target=4574
10-17 15:43:39.407  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:39.414  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:43:39.414  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=9216ms lancio=0 x=480 page=379,151 loc=73,16 target=4576
10-17 15:43:39.414  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:40.391  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:40.883 10234 10234 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 15:43:41.203  9511  9535 I ReactNativeJS: VIBRA subtab premuto albero
10-17 15:43:41.204  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=494ms lancio=0 x=344 page=49,151 loc=71,16 target=4516
10-17 15:43:41.220  9511  9535 I ReactNativeJS: VIBRA subtab albero
10-17 15:43:41.220  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:41.858  9511  9535 I ReactNativeJS: VIBRA subtab premuto comitive
10-17 15:43:41.862  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1152ms lancio=0 x=344 page=157,151 loc=93,16 target=4528
10-17 15:43:41.864  9511  9535 I ReactNativeJS: VIBRA subtab comitive
10-17 15:43:41.866  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:41.907  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 15:43:42.389  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 15:43:44.408 10257 10257 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 15:43:44.436  9511  9535 I ReactNativeJS: VIBRA subtab premuto growth
10-17 15:43:44.436  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=909ms lancio=0 x=250 page=362,151 loc=3,7 target=4546
10-17 15:43:44.436  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:44.714  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 15:43:45.078  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:43:45.079  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=365ms lancio=0 x=480 page=379,151 loc=73,16 target=4576
10-17 15:43:45.098  9511  9535 I ReactNativeJS: VIBRA subtab mappa
10-17 15:43:45.098  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:45.232  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:48.091 10301 10301 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 15:43:48.576  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:43:48.577  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3864ms lancio=0 x=480 page=49,151 loc=9,7 target=4534
10-17 15:43:48.715  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:43:48.719  9511  9535 I ReactNativeJS: VIBRA subtab tabelle
10-17 15:43:48.729  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:49.385  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=4672ms lancio=0 x=480 page=157,151 loc=7,8 target=4550
10-17 15:43:49.836  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:52.788 10322 10322 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 15:43:54.463  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=9750ms lancio=0 x=480 page=362,151 loc=24,8 target=4574
10-17 15:43:54.464  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:54.464  9511  9535 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 15:43:54.465  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=480 page=379,151 loc=73,16 target=4576
10-17 15:43:54.465  9511  9535 I ReactNativeJS: VIBRA subtab mappa
10-17 15:43:54.466  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:43:55.212  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 15:43:57.192 10366 10366 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 15:43:57.283  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:43:57.294  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=567ms lancio=0 x=480 page=49,151 loc=9,7 target=4534
10-17 15:43:57.328  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:43:57.593  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:43:58.873  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1462ms lancio=0 x=334 page=157,151 loc=51,8 target=4526
10-17 15:43:58.874  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:01.538 10387 10387 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 15:44:01.681  9511  9535 I ReactNativeJS: VIBRA subtab premuto analitica
10-17 15:44:01.681  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=4271ms lancio=0 x=334 page=362,151 loc=8,16 target=4564
10-17 15:44:01.682  9511  9535 I ReactNativeJS: VIBRA subtab analitica
10-17 15:44:01.686  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:02.018  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 15:44:02.935  9511  9535 I ReactNativeJS: VIBRA subtab premuto analitica
10-17 15:44:02.935  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=5525ms lancio=0 x=334 page=379,151 loc=14,7 target=4558
10-17 15:44:03.064  9511  9535 I ReactNativeJS: VIBRA subtab analitica
10-17 15:44:03.064  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:03.488  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 15:44:05.519 10407 10407 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 15:44:05.553  9511  9535 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 15:44:05.553  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=2488ms lancio=0 x=480 page=49,151 loc=9,7 target=4534
10-17 15:44:05.553  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:44:05.781  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 15:44:07.035  9511  9535 I ReactNativeJS: VIBRA subtab premuto parco
10-17 15:44:07.035  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1255ms lancio=0 x=152 page=157,151 loc=116,16 target=4504
10-17 15:44:07.036  9511  9535 I ReactNativeJS: VIBRA subtab parco
10-17 15:44:07.036  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:07.280  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 15:44:09.587 10429 10429 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 15:44:09.619  9511  9535 I ReactNativeJS: VIBRA subtab premuto comitive
10-17 15:44:09.619  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1969ms lancio=0 x=50 page=362,151 loc=5,16 target=4528
10-17 15:44:09.636  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:44:09.825  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 15:44:10.885  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1060ms lancio=0 x=277 page=379,151 loc=27,8 target=4550
10-17 15:44:10.886  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:13.436 10450 10450 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 15:44:13.469  9511  9535 I ReactNativeJS: VIBRA subtab premuto albero
10-17 15:44:13.469  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=3644ms lancio=0 x=277 page=49,151 loc=3,16 target=4516
10-17 15:44:13.486  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:44:13.678  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 15:44:15.335  9511  9535 I ReactNativeJS: VIBRA subtab premuto parco
10-17 15:44:15.335  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1657ms lancio=0 x=52 page=157,151 loc=4,7 target=4498
10-17 15:44:15.335  9511  9535 I ReactNativeJS: VIBRA subtab parco
10-17 15:44:15.336  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:15.468  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 15:44:17.884 10471 10471 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 15:44:17.903  9511  9535 I ReactNativeJS: VIBRA subtab premuto comitive
10-17 15:44:17.903  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=4225ms lancio=0 x=52 page=362,151 loc=7,16 target=4528
10-17 15:44:17.922  9511  9535 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 15:44:18.133  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 15:44:19.802  9511  9535 I ReactNativeJS: VIBRA subtab premuto growth
10-17 15:44:19.802  9511  9535 I ReactNativeJS: VIBRA hscroll tocco dopo=1669ms lancio=0 x=297 page=379,151 loc=80,16 target=4552
10-17 15:44:19.802  9511  9535 I ReactNativeJS: VIBRA subtab growth
10-17 15:44:19.802  9511  9535 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 15:44:20.449  9511  9535 I ReactNativeJS: VIBRA subtab rilasciato growth
```
