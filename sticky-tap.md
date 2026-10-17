# Tap sulla barra delle tab dopo un lancio (pr)

Barra a y=397; tab Gruppi a x=412 (barra all'inizio), Growth a x=1015 (barra alla fine).
Attesa = pausa nello script tra la fine del lancio e il tap (più ~0,2-0,5 s di avvio di `input`).

| attesa | verso | tap arrivato |
|---|---|---|
| 0s | inizio | NO |
| 0s | fine | NO |
| 0.2s | inizio | sì |
| 0.2s | fine | sì |
| 0.4s | inizio | sì |
| 0.4s | fine | sì |
| 0.7s | inizio | sì |
| 0.7s | fine | sì |
| 1.0s | inizio | sì |
| 1.0s | fine | sì |
| 1.5s | inizio | NO |
| 1.5s | fine | NO |
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

Tap arrivati: 8 su 24

Righe dell'app (tocchi sulla barra e tab scelte):

```
10-17 14:15:14.404  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 14:15:14.405  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:15:43.814  4657  4690 I ReactNativeJS: VIBRA subtab premuto clienti
10-17 14:15:43.814  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=-1ms lancio=0 x=0
10-17 14:15:43.850  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:15:43.949  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato clienti
10-17 14:15:44.430  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=0
10-17 14:15:44.431  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:15:49.481  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=5024ms lancio=0 x=0
10-17 14:15:49.498  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:15:50.120  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=250
10-17 14:15:50.298  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=250
10-17 14:15:55.218  5365  5365 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 14:15:55.231  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=5110ms lancio=0 x=250
10-17 14:15:55.264  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:15:55.472  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=26
10-17 14:15:55.551  4657  4690 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:15:55.551  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=234ms lancio=1 x=26
10-17 14:15:55.551  4657  4690 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 14:15:55.551  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:15:55.740  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=26
10-17 14:15:55.848  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=26
10-17 14:15:58.288  5401  5401 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 14:15:58.314  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=2998ms lancio=0 x=26
10-17 14:15:58.331  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:15:58.387  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=266
10-17 14:15:58.534  4657  4690 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:15:58.534  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=147ms lancio=1 x=266
10-17 14:15:58.534  4657  4690 I ReactNativeJS: VIBRA hscroll perde-il-tocco
10-17 14:15:58.534  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:15:58.535  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=266
10-17 14:15:58.699  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=266
10-17 14:16:01.081  5422  5422 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 14:16:01.097  4657  4690 I ReactNativeJS: VIBRA subtab premuto parco
10-17 14:16:01.097  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=2710ms lancio=0 x=266
10-17 14:16:01.134  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:01.306  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=89
10-17 14:16:01.307  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato parco
10-17 14:16:01.609  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=0
10-17 14:16:01.610  4657  4690 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:16:01.610  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1ms lancio=0 x=0
10-17 14:16:01.762  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:04.392  5508  5508 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 14:16:04.448  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=2839ms lancio=0 x=0
10-17 14:16:04.449  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:04.862  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=303
10-17 14:16:04.935  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=303
10-17 14:16:05.097  4657  4690 I ReactNativeJS: VIBRA subtab premuto analitica
10-17 14:16:05.098  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=403ms lancio=0 x=303
10-17 14:16:05.098  4657  4690 I ReactNativeJS: VIBRA subtab analitica
10-17 14:16:05.098  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:06.464  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato analitica
10-17 14:16:06.705  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=303
10-17 14:16:06.710  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:16:07.700  5545  5545 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 14:16:07.731  4657  4690 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:16:07.731  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1021ms lancio=0 x=480
10-17 14:16:07.748  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:07.896  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:16:07.989  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=204
10-17 14:16:08.274  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=204
10-17 14:16:08.514  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=618ms lancio=0 x=204
10-17 14:16:08.531  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:11.150  5730  5730 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 14:16:11.198  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=3303ms lancio=0 x=204
10-17 14:16:11.215  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:11.397  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=449
10-17 14:16:11.705  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:16:11.897  4657  4690 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 14:16:11.898  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=192ms lancio=0 x=480
10-17 14:16:11.898  4657  4690 I ReactNativeJS: VIBRA subtab mappa
10-17 14:16:11.898  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:12.340  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 14:16:12.921  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:16:12.921  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:16:14.639  5927  5927 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 14:16:14.817  4657  4690 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:16:14.817  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=3112ms lancio=0 x=480
10-17 14:16:14.820  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:15.097  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=291
10-17 14:16:15.115  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:16:16.141  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=291
10-17 14:16:16.141  4657  4690 I ReactNativeJS: VIBRA hscroll prende-il-tocco
10-17 14:16:16.141  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1117ms lancio=0 x=291
10-17 14:16:16.149  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:19.116  5988  5988 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 14:16:19.223  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=4199ms lancio=0 x=291
10-17 14:16:19.253  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:19.688  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:16:19.688  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:16:20.532  4657  4690 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 14:16:20.532  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1125ms lancio=0 x=480
10-17 14:16:20.624  4657  4690 I ReactNativeJS: VIBRA subtab mappa
10-17 14:16:20.627  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:20.754  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 14:16:23.329  6044  6044 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 14:16:23.555  4657  4690 I ReactNativeJS: VIBRA subtab premuto tabelle
10-17 14:16:23.557  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=4151ms lancio=0 x=480
10-17 14:16:23.560  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:23.740  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato tabelle
10-17 14:16:24.016  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=338
10-17 14:16:24.698  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=338
10-17 14:16:25.167  4657  4690 I ReactNativeJS: VIBRA subtab premuto comitive
10-17 14:16:25.167  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1428ms lancio=0 x=338
10-17 14:16:25.168  4657  4690 I ReactNativeJS: VIBRA subtab comitive
10-17 14:16:25.171  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:25.555  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato comitive
10-17 14:16:25.840  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=338
10-17 14:16:26.040  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=250
10-17 14:16:27.802  6087  6087 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 14:16:27.831  4657  4690 I ReactNativeJS: VIBRA subtab premuto growth
10-17 14:16:27.831  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1791ms lancio=0 x=250
10-17 14:16:27.848  4657  4690 I ReactNativeJS: VIBRA hscroll tocco-annullato
10-17 14:16:28.014  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:16:28.014  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:16:28.014  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato growth
10-17 14:16:29.064  4657  4690 I ReactNativeJS: VIBRA subtab premuto mappa
10-17 14:16:29.064  4657  4690 I ReactNativeJS: VIBRA hscroll tocco dopo=1153ms lancio=0 x=480
10-17 14:16:29.064  4657  4690 I ReactNativeJS: VIBRA subtab mappa
10-17 14:16:29.064  4657  4690 I ReactNativeJS: VIBRA hscroll fine-tocco
10-17 14:16:29.326  4657  4690 I ReactNativeJS: VIBRA subtab rilasciato mappa
10-17 14:16:29.342  4657  4690 I ReactNativeJS: VIBRA hscroll lancio x=480
10-17 14:16:29.342  4657  4690 I ReactNativeJS: VIBRA hscroll ferma x=480
10-17 14:16:31.719  6354  6354 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 14:16:35.996  6554  6554 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
10-17 14:16:40.243  6636  6636 I ReactNativeJS: VIBRA prova attesa=0 verso=inizio
10-17 14:16:42.976  6656  6656 I ReactNativeJS: VIBRA prova attesa=0 verso=fine
10-17 14:16:45.836  6676  6676 I ReactNativeJS: VIBRA prova attesa=0.2 verso=inizio
10-17 14:16:48.817  6703  6703 I ReactNativeJS: VIBRA prova attesa=0.2 verso=fine
10-17 14:16:51.883  6723  6723 I ReactNativeJS: VIBRA prova attesa=0.4 verso=inizio
10-17 14:16:55.017  6748  6748 I ReactNativeJS: VIBRA prova attesa=0.4 verso=fine
10-17 14:16:58.147  6768  6768 I ReactNativeJS: VIBRA prova attesa=0.7 verso=inizio
10-17 14:17:01.602  6788  6788 I ReactNativeJS: VIBRA prova attesa=0.7 verso=fine
10-17 14:17:05.058  6843  6843 I ReactNativeJS: VIBRA prova attesa=1.0 verso=inizio
10-17 14:17:08.784  6863  6863 I ReactNativeJS: VIBRA prova attesa=1.0 verso=fine
10-17 14:17:12.513  6890  6890 I ReactNativeJS: VIBRA prova attesa=1.5 verso=inizio
10-17 14:17:16.745  6910  6910 I ReactNativeJS: VIBRA prova attesa=1.5 verso=fine
```
