// Link esterni (vibra://…: notifiche, gara, condivisioni). Il listener di linking di expo-router fa NAVIGATE,
// che verso una tab da una pagina dello stack accoda un SECONDO navigatore delle tab (StackClient: la route
// si riusa solo se è la corrente o con pop): la tab si apriva nel navigatore nuovo, non precaricato, e
// tutte le tab restavano due volte in memoria. Per le tab, ad app aperta da una pagina dello stack: prima
// dismissAll (si torna al navigatore delle tab esistente), poi il link segue il suo corso. All'avvio a freddo il percorso passa normalmente.
// Il listener url di lib/testDiag (misure della gara) è separato e non cambia.
import { router } from 'expo-router';
import { onStackPage } from '../web/router';

const TAB_PATHS = new Set(['/', '/clienti', '/programmazione', '/semine', '/il-mio-vibra']);

/** vibra://clienti?x=1 → /clienti?x=1 (le altre forme restano come sono). */
function toAppPath(url: string): string {
  const m = /^vibra:\/\/?(.*)$/i.exec(url);
  if (!m) return url;
  let rest = '/' + m[1].replace(/^\/+/, '');
  // /dashboard è l'indirizzo dell'originale per la tab "/"
  rest = rest.replace(/^\/dashboard(?=$|[/?#])/, '/').replace(/^\/\/+/, '/');
  return rest;
}

export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }): string | null {
  try {
    const appPath = toAppPath(path);
    if (appPath === path && !/^vibra:/i.test(path)) return path;
    if (initial) return appPath;
    const bare = appPath.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
    // Verso una tab da una pagina dello stack: prima si torna al navigatore delle tab (dismissAll), poi il
    // linking normale lo riusa perché è la route corrente. Da una tab: linking normale, come prima.
    // (Con router.navigate verso la tab la cronologia delle tab cambiava e il successivo Indietro, senza
    // nessuno che lo gestisse, chiudeva l'app: gara diagnostica 38756767101.)
    if (TAB_PATHS.has(bare) && onStackPage() && router.canDismiss()) router.dismissAll();
    return appPath;
  } catch {
    return path;
  }
}
