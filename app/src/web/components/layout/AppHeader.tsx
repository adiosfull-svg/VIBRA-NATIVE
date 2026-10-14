// Port di AppHeader (src/components/layout/AppLayout.jsx): intestazione in linea che scorre con
// la pagina. burger · [titolo sezione | logo Vibra] · campanella · impostazioni.
import { Image } from 'expo-image';
import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../lib/auth';
import { Btn, Div } from '../../../ui/html';
import { Menu } from '../../../ui/icons.generated';
import { Text } from '../../../ui/text';
import { useVibraLogo } from '../../hooks/useVibraLogo';
import { useLayoutUIActions } from '../../lib/layoutUI';
import { useLocation } from '../../router';
import AccountMenu from './AccountMenu';
import { IMAGE_CACHE } from '../../../ui/imageCache';
import NotificationBell from './NotificationBell';

const ROUTE_TITLES: Record<string, string> = {
  '/promoter': 'Promoter',
  '/dashboard': 'Dashboard',
  '/clienti': 'Clienti',
  '/clienti-analytics': 'Analitica Clienti',
  '/serate': 'Serate',
  '/importa-serata': 'Importa Serata',
  '/programmazione': 'Weekend',
  '/semine': 'Semine',
  '/formazione': 'Formazione',
  '/download': 'Download',
  '/ricerca-ai': 'Ricerca AI',
  '/vibra-gpt': 'VibraGPT',
  '/locali': 'Locali',
  '/il-mio-vibra': 'Il Mio Vibra',
  '/admin-console': 'Console Admin',
  '/impostazioni-app': 'Impostazioni App',
  '/notifiche': 'Notifiche',
  '/report': 'Report',
  '/messaggi': 'Messaggi',
  '/academy': "Guida all'uso dell'APP",
};

export function routeTitleFor(pathname: string, role?: string) {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (p === '/') return role === 'admin' || role === 'super4' ? 'Dashboard' : 'Il Mio Vibra';
  if (ROUTE_TITLES[p]) return ROUTE_TITLES[p];
  if (p.startsWith('/promoter/')) return 'Promoter';
  return '';
}

// memo: si ridisegna solo se cambia il titolo (o il percorso proprio / l'utente)
export default memo(function AppHeader({ title: titleOverride }: { title?: string }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  // solo azioni: aprire un menu non ridisegna gli header di tutte le pagine montate
  const { setSidebarOpen } = useLayoutUIActions();
  const { logoDataUrl } = useVibraLogo();
  const title = titleOverride ?? routeTitleFor(pathname, user?.role);

  // sul web adjustsFontSizeToFit non esiste: stesso ciclo di FitTitle (−0.5px finché il testo non entra)
  // (Text non inoltra il ref: il nodo DOM arriva dall'evento onLayout di react-native-web)
  const titleRef = useRef<HTMLElement | null>(null);
  const fitWebTitle = useCallback(() => {
    const el = titleRef.current;
    if (Platform.OS !== 'web' || !el) return;
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    // scrollWidth/clientWidth sono interi: con numberOfLines anche un overflow sotto il pixel mette
    // i puntini, quindi la larghezza vera del testo (Range) contro quella del box
    const range = document.createRange();
    range.selectNodeContents(el);
    const overflows = () => range.getBoundingClientRect().width > el.getBoundingClientRect().width;
    while (overflows() && size > 11) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }, []);
  const onTitleLayout = useCallback((e: { nativeEvent: { target?: unknown } }) => {
    if (Platform.OS !== 'web') return;
    titleRef.current = e.nativeEvent.target as HTMLElement;
    fitWebTitle();
    // il font (Inter) può arrivare dopo il primo layout e allargare il testo, come in FitTitle
    (globalThis as { document?: { fonts?: { ready?: Promise<unknown> } } }).document?.fonts?.ready?.then(fitWebTitle).catch(() => {});
  }, [fitWebTitle]);
  useLayoutEffect(fitWebTitle, [title, fitWebTitle]);

  return (
    <Div className="px-3" style={{ paddingTop: insets.top + 8 }}>
      <Div className="flex items-center gap-1 min-h-[3.25rem]">
        <Btn onClick={() => setSidebarOpen(true)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full active:bg-secondary/50" accessibilityLabel="Menu">
          <Menu className="w-7 h-7 text-foreground" />
        </Btn>
        <Div className="flex-1 min-w-0 grid grid-cols-2 items-center gap-2">
          {/* Titolo su una riga: si rimpicciolisce (fino a 11px) invece di andare a capo, come FitTitle */}
          <Text
            onLayout={onTitleLayout as never}
            accessibilityRole="header"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={11 / 21}
            className="min-w-0 text-[21px] font-bold text-foreground text-center leading-tight py-1 translate-x-[10px]"
          >
            {title}
          </Text>
          <Div className="flex items-center justify-center min-w-0 h-11 translate-x-[10px]">
            {logoDataUrl ? (
              <Image source={{ uri: logoDataUrl }} style={{ height: 44, width: '100%' }} contentFit="contain" accessibilityLabel="Vibra" cachePolicy={IMAGE_CACHE} transition={0} />
            ) : null}
          </Div>
        </Div>
        <Div className="flex items-center shrink-0">
          <NotificationBell />
          <AccountMenu />
        </Div>
      </Div>
    </Div>
  );
});
