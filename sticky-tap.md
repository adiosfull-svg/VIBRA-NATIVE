# Tap sulla barra delle tab dopo un lancio (admin)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=984 (barra alla fine).
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
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | sì |
| 1.5s | fine | NO |
| 0s | inizio | sì |
| 0s | fine | sì |
| 0.2s | inizio | NO |
| 0.2s | fine | sì |
| 0.4s | inizio | NO |
| 0.4s | fine | NO |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | NO |
| 1.5s | inizio | sì |
| 1.5s | fine | sì |

Tap arrivati: 17 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 14:16:03.806  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 14:16:03.807  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:16:34.035  4374  4442 I ReactNativeJS: VIBRA subtab premuto clienti
10-17 14:16:34.035  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0
10-17 14:16:34.075  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:34.182  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 14:16:34.649  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 14:16:34.649  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:16:40.149  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=5484ms lancio=0 x=0
10-17 14:16:40.167  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:41.251  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=274
10-17 14:16:41.400  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=274
10-17 14:16:46.710  5949  5949 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 14:16:46.749  4374  4442 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:16:46.749  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=5826ms lancio=0 x=274
10-17 14:16:46.773  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:47.022  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:16:47.431  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=20
10-17 14:16:47.633  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:16:47.633  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=611ms lancio=1 x=20
10-17 14:16:47.634  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:47.748  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=20
10-17 14:16:50.284  6175  6175 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 14:16:50.316  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3294ms lancio=0 x=20
10-17 14:16:50.333  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:50.932  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=346
10-17 14:16:51.082  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=346
10-17 14:16:51.082  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:16:51.082  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=479ms lancio=0 x=346
10-17 14:16:51.082  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:53.889  6212  6212 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 14:16:53.933  4374  4442 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:16:53.933  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3330ms lancio=0 x=346
10-17 14:16:53.958  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:54.212  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:16:54.436  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=96
10-17 14:16:54.735  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=96
10-17 14:16:54.852  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=640ms lancio=0 x=96
10-17 14:16:54.855  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:57.882  6323  6323 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 14:16:57.933  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3721ms lancio=0 x=96
10-17 14:16:57.933  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:58.609  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=402
10-17 14:16:58.705  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=402
10-17 14:16:58.867  4374  4442 I ReactNativeJS: VIBRA subtab premuto analitica
10-17 14:16:58.867  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=649ms lancio=0 x=402
10-17 14:16:58.886  4374  4442 I ReactNativeJS: VIBRA subtab analitica
10-17 14:16:58.886  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:59.109  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 14:17:00.133  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=402
10-17 14:17:00.133  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:01.502  6354  6354 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 14:17:01.533  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:01.533  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1400ms lancio=0 x=480
10-17 14:17:01.551  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:01.768  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=251
10-17 14:17:01.768  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:02.232  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=251
10-17 14:17:02.232  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:17:02.232  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=464ms lancio=0 x=251
10-17 14:17:02.232  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:05.144  6402  6402 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 14:17:05.200  4374  4442 I ReactNativeJS: VIBRA subtab premuto growth
10-17 14:17:05.200  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3432ms lancio=0 x=251
10-17 14:17:05.200  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:05.462  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 14:17:05.615  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:17:05.615  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:06.066  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=604ms lancio=0 x=480
10-17 14:17:06.066  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:08.923  6466  6466 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 14:17:08.983  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:08.983  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3521ms lancio=0 x=480
10-17 14:17:08.983  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:09.217  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=233
10-17 14:17:09.217  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:09.559  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:17:10.033  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=474ms lancio=0 x=0
10-17 14:17:10.034  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:12.668  6492  6492 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 14:17:12.700  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3141ms lancio=0 x=0
10-17 14:17:12.717  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:12.779  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=231
10-17 14:17:13.064  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:13.500  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=436ms lancio=0 x=480
10-17 14:17:13.516  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:16.124  6514  6514 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 14:17:16.150  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:16.150  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3086ms lancio=0 x=480
10-17 14:17:16.151  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:16.362  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:16.508  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=193
10-17 14:17:16.750  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=193
10-17 14:17:17.615  4374  4442 I ReactNativeJS: VIBRA subtab premuto albero
10-17 14:17:17.615  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1254ms lancio=0 x=193
10-17 14:17:17.616  4374  4442 I ReactNativeJS: VIBRA subtab albero
10-17 14:17:17.616  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:17.761  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato albero
10-17 14:17:17.799  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=193
10-17 14:17:17.819  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=157
10-17 14:17:20.299  6539  6539 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 14:17:20.333  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:20.333  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=2515ms lancio=0 x=157
10-17 14:17:20.333  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:20.574  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:17:20.574  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:20.575  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:21.649  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1179ms lancio=0 x=480
10-17 14:17:21.649  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:24.262  6578  6578 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 14:17:24.282  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:24.282  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3812ms lancio=0 x=480
10-17 14:17:24.317  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:24.412  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=327
10-17 14:17:24.503  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:24.658  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:17:25.949  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1291ms lancio=0 x=0
10-17 14:17:25.949  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:28.576  6599  6599 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 14:17:28.599  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3941ms lancio=0 x=0
10-17 14:17:28.616  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:28.674  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=274
10-17 14:17:28.859  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:30.216  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1357ms lancio=0 x=480
10-17 14:17:30.216  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:32.819  6620  6620 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 14:17:32.849  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:32.849  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3991ms lancio=0 x=480
10-17 14:17:32.850  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:32.988  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=148
10-17 14:17:33.081  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:17:33.082  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=94ms lancio=1 x=148
10-17 14:17:33.085  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:33.088  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:33.294  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=148
10-17 14:17:35.731  6640  6640 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 14:17:35.750  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:35.750  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=2762ms lancio=0 x=148
10-17 14:17:35.767  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:36.046  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=406
10-17 14:17:36.047  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:36.118  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:17:36.118  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=234ms lancio=1 x=406
10-17 14:17:36.118  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:36.149  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=406
10-17 14:17:38.735  6661  6661 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 14:17:38.766  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=2882ms lancio=0 x=406
10-17 14:17:38.783  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:38.905  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=157
10-17 14:17:39.126  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:17:39.267  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:17:39.267  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=140ms lancio=0 x=0
10-17 14:17:39.267  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:41.904  6681  6681 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 14:17:41.933  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=2806ms lancio=0 x=0
10-17 14:17:41.933  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:42.169  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=301
10-17 14:17:42.282  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=301
10-17 14:17:42.515  4374  4442 I ReactNativeJS: VIBRA subtab premuto growth
10-17 14:17:42.516  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=454ms lancio=0 x=301
10-17 14:17:42.516  4374  4442 I ReactNativeJS: VIBRA subtab growth
10-17 14:17:42.516  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:43.004  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 14:17:44.022  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=301
10-17 14:17:44.023  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=435
10-17 14:17:45.168  6703  6703 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 14:17:45.200  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1177ms lancio=0 x=435
10-17 14:17:45.200  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:45.543  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=117
10-17 14:17:45.800  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=117
10-17 14:17:46.003  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=460ms lancio=0 x=117
10-17 14:17:46.017  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:48.982  6805  6805 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 14:17:49.033  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3490ms lancio=0 x=117
10-17 14:17:49.033  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:49.366  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=366
10-17 14:17:49.900  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:50.271  4374  4442 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:17:50.271  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=371ms lancio=0 x=480
10-17 14:17:50.271  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:52.899  6846  6846 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 14:17:52.916  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:52.917  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3017ms lancio=0 x=480
10-17 14:17:52.933  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:53.255  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:53.364  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=226
10-17 14:17:53.701  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=226
10-17 14:17:54.132  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=877ms lancio=0 x=226
10-17 14:17:54.132  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:17:56.785  6868  6868 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 14:17:56.816  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:17:56.816  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3561ms lancio=0 x=226
10-17 14:17:56.840  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:17:56.885  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=374
10-17 14:17:57.147  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:17:57.413  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:17:57.642  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=229ms lancio=0 x=480
10-17 14:17:57.642  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:18:00.276  6891  6891 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 14:18:00.299  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:18:00.299  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=2887ms lancio=0 x=480
10-17 14:18:00.300  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:18:00.636  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:18:00.834  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=197
10-17 14:18:01.099  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=197
10-17 14:18:01.900  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1264ms lancio=0 x=197
10-17 14:18:01.916  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:18:04.544  6933  6933 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 14:18:04.565  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3930ms lancio=0 x=197
10-17 14:18:04.583  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:18:04.925  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=462
10-17 14:18:05.339  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:18:05.965  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=626ms lancio=0 x=480
10-17 14:18:05.965  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:18:08.629  6954  6954 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 14:18:08.649  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:18:08.649  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=3310ms lancio=0 x=480
10-17 14:18:08.674  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:18:08.995  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:18:09.102  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=220
10-17 14:18:09.402  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=220
10-17 14:18:10.649  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1654ms lancio=0 x=220
10-17 14:18:10.649  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:18:13.266  6978  6978 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 14:18:13.300  4374  4442 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:18:13.300  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=4304ms lancio=0 x=220
10-17 14:18:13.320  4374  4442 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:18:13.360  4374  4442 I ReactNativeJS: VIBRA hscroll lancio x=373
10-17 14:18:13.538  4374  4442 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:18:13.878  4374  4442 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:18:14.883  4374  4442 I ReactNativeJS: VIBRA hscroll tocco dopo=1005ms lancio=0 x=480
10-17 14:18:14.899  4374  4442 I ReactNativeJS: VIBRA hscroll fine-tocco
```
