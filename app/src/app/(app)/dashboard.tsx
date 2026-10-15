// Route /dashboard (link esterni; nell'app la Dashboard è la tab "/"): porta alla tab, già montata e
// precaricata, invece di costruire una seconda Dashboard da zero. Non <Redirect>: usa `replace`, che da
// questa pagina dello stack creava un SECONDO navigatore delle tab sulla pila (Dashboard rimontata da zero
// in 1,2-1,9 s, e tutte le tab precaricate due volte in memoria).
// Anche `navigate` ne accoda un secondo (StackClient riusa la route solo se è la corrente o con pop): resta
// solo per chi arriva qui da dentro l'app.
// Avvio a freddo dal link (nessuna pagina sotto): replace, come prima. La tab fa lo stesso controllo di
// accesso di HomepageRouter.jsx (chi non vede la Dashboard va a Il Mio Vibra).
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function DashboardRoute() {
  useEffect(() => {
    // navigate (come prima dell'audit): dismissAll + navigate poteva far chiudere l'app al successivo
    // Indietro. I link esterni a /dashboard non arrivano qui: +native-intent li manda alla tab "/".
    if (router.canGoBack()) router.navigate('/');
    else router.replace('/');
  }, []);
  return null;
}
