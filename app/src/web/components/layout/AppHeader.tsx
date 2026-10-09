// Port di AppHeader (src/components/layout/AppLayout.jsx): intestazione in linea che scorre con
// la pagina. burger · [titolo sezione | logo Vibra] · campanella · impostazioni.
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../lib/auth';
import { Btn, Div } from '../../../ui/html';
import { Menu } from '../../../ui/icons.generated';
import { Text } from '../../../ui/text';
import { useVibraLogo } from '../../hooks/useVibraLogo';
import { useLayoutUI } from '../../lib/layoutUI';
import { useLocation } from '../../router';
import AccountMenu from './AccountMenu';
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

export default function AppHeader({ title: titleOverride }: { title?: string }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { setSidebarOpen } = useLayoutUI();
  const { logoDataUrl } = useVibraLogo();
  const title = titleOverride ?? routeTitleFor(pathname, user?.role);

  return (
    <Div className="px-3" style={{ paddingTop: insets.top + 8 }}>
      <Div className="flex items-center gap-1 min-h-[3.25rem]">
        <Btn onClick={() => setSidebarOpen(true)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full active:bg-secondary/50" accessibilityLabel="Menu">
          <Menu className="w-7 h-7 text-foreground" />
        </Btn>
        <Div className="flex-1 min-w-0 grid grid-cols-2 items-center gap-2">
          {/* Titolo su una riga: si rimpicciolisce (fino a 11px) invece di andare a capo, come FitTitle */}
          <Text
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
              <Image source={{ uri: logoDataUrl }} style={{ height: 44, width: '100%' }} contentFit="contain" accessibilityLabel="Vibra" cachePolicy="disk" />
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
}
