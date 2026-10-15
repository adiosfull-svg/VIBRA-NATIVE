// Link esterni (vibra://…: notifiche, gara, condivisioni). Il listener di linking di expo-router fa NAVIGATE,
// che verso una tab da una pagina dello stack accoda un SECONDO navigatore delle tab (StackClient: la route
// si riusa solo se è la corrente o con pop): la tab si apriva nel navigatore nuovo, non precaricato, e
// tutte le tab restavano due volte in memoria. Per le tab, ad app aperta: goToTab (web/router) torna al
// navigatore delle tab esistente e cambia tab. All'avvio a freddo il percorso passa normalmente.
// Il listener url di lib/testDiag (misure della gara) è separato e non cambia.
import { goToTab } from '../web/router';

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
    if (TAB_PATHS.has(bare)) {
      goToTab(appPath);
      return null;
    }
    return appPath;
  } catch {
    return path;
  }
}
