// Port di src/components/layout/Sidebar.jsx (versione mobile: pannello sinistro w-64 a comparsa).
import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoleAccess, type RouteName } from '../../../lib/useRoleAccess';
import { cn } from '../../../ui/cn';
import { Btn, Div } from '../../../ui/html';
import { IMAGE_CACHE } from '../../../ui/imageCache';
import { SideDrawer } from '../../../ui/sideDrawer';
import {
  BarChart2, BookOpen, BrainCircuit, Building2, CalendarDays, CalendarRange, ContactRound, Download, Euro, GraduationCap,
  LayoutGrid, NotebookPen, Search, Send, Sprout, Swords, TrendingUp, Trophy, Users2, UsersRound, X,
} from '../../../ui/icons.generated';
import { useAppSetting } from '../../hooks/useAppSetting';
import { useVibraLogo } from '../../hooks/useVibraLogo';
import { useLayoutUI, useLayoutUIActions } from '../../lib/layoutUI';
import { useCurrentLocation, useNavigate } from '../../router';

type Item = { label: string; icon: React.ComponentType<any>; path: string; routeName?: RouteName };

const navItems: Item[] = [
  { label: 'Dashboard', icon: LayoutGrid, path: '/', routeName: 'dashboard' },
  { label: 'Promoter', icon: UsersRound, path: '/promoter', routeName: 'promoter' },
  { label: 'Clienti', icon: ContactRound, path: '/clienti', routeName: 'clienti' },
  { label: 'Weekend', icon: CalendarDays, path: '/programmazione', routeName: 'programmazione' },
  { label: 'Semine', icon: Sprout, path: '/semine' },
  { label: 'Messaggi', icon: Send, path: '/messaggi' },
  { label: 'Serate', icon: CalendarRange, path: '/serate', routeName: 'serate' },
  { label: 'Locali', icon: Building2, path: '/locali', routeName: 'locali' },
  { label: 'Formazione', icon: BookOpen, path: '/formazione', routeName: 'formazione' },
  { label: 'Download', icon: Download, path: '/download', routeName: 'download' },
  { label: 'Vibra GPT', icon: BrainCircuit, path: '/ricerca-ai', routeName: 'ricerca-ai' },
];

const myVibraSubItems = [
  { key: 'guadagni', label: 'I Miei Guadagni', icon: Euro },
  { key: 'guadagni-dettagli', label: 'Guadagni Dettagliati', icon: TrendingUp },
  { key: 'serate', label: 'Le Mie Serate', icon: CalendarRange },
  { key: 'progressi', label: 'I Miei Progressi', icon: BarChart2 },
  { key: 'accordi', label: 'Il Mio Team', icon: Users2 },
  { key: 'note', label: 'Le Mie Note', icon: NotebookPen },
  { key: 'achievements', label: 'Achievement', icon: Trophy },
  { key: 'vibravs', label: 'Vibra VS', icon: Swords },
];

const WIDTH = 256; // w-64

// Pannello unico nel layout (ui/sideDrawer): il contenuto è in memo e non dipende da `open`, così
// aprire e chiudere non lo ridisegna (docs/REGOLE-PRESTAZIONI.md §5).
export default function Sidebar() {
  const { sidebarOpen: open, setSidebarOpen } = useLayoutUI();
  const close = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);
  return (
    <SideDrawer name="sidebar" open={open} onClose={close} side="left" width={WIDTH} backdropOpacity={0.6}>
      <SidebarBody />
    </SideDrawer>
  );
}

const SidebarBody = memo(function SidebarBody() {
  const { setSidebarOpen, setSearchOpen } = useLayoutUIActions();
  const location = useCurrentLocation(); // layout: segue tutti i percorsi
  const navigate = useNavigate();
  const insets = useSafeAreaInsets();
  const { logoDataUrl: vibraLogoUrl } = useVibraLogo();
  const { canAccessRoute } = useRoleAccess();
  const [logoUrl] = useAppSetting('org_logo');
  const visibleNavItems = navItems.filter((item) => !item.routeName || canAccessRoute(item.routeName));

  const close = () => setSidebarOpen(false);
  const go = (path: string) => { close(); navigate(path, { replace: true }); };
  const linkClass = (active: boolean) => cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
    active ? 'bg-primary/15 text-primary shadow-sm' : 'text-muted-foreground',
  );

  const myActive = location.pathname === '/il-mio-vibra';
  const activeTab = new URLSearchParams(location.search).get('tab') || 'progressi';

  return (
        <Div className="flex-1 bg-sidebar border-r border-sidebar-border flex flex-col" style={{ paddingTop: insets.top }}>
          {/* Logo area */}
          <Div className="px-4 pt-3 pb-2 flex flex-col items-center relative">
            <Btn onClick={close} className="text-muted-foreground absolute top-4 right-4 z-10" accessibilityLabel="Chiudi">
              <X className="w-5 h-5" />
            </Btn>
            {logoUrl ? (
              <Image source={{ uri: logoUrl }} style={{ width: 208, height: 208 }} contentFit="contain" accessibilityLabel="logo" cachePolicy={IMAGE_CACHE} transition={0} />
            ) : <Div className="w-52 h-52" />}
          </Div>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 + insets.bottom }}>
            <Div className="space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Btn key={item.label} onClick={() => go(item.path)} className={linkClass(isActive)}>
                    <Icon className={cn('w-6 h-6 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} strokeWidth={isActive ? 2.2 : 1.8} />
                    {item.label}
                  </Btn>
                );
              })}

              {/* Cerca (command palette globale) — sotto Vibra GPT */}
              <Btn onClick={() => { close(); setSearchOpen(true); }} className={linkClass(false)}>
                <Search className="w-6 h-6 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                Cerca
              </Btn>

              {/* Guida all'uso — sotto Cerca */}
              <Btn onClick={() => go('/academy')} className={linkClass(location.pathname === '/academy')}>
                <GraduationCap className={cn('w-6 h-6 shrink-0', location.pathname === '/academy' ? 'text-primary' : 'text-muted-foreground')} strokeWidth={location.pathname === '/academy' ? 2.2 : 1.8} />
                Guida all'uso
              </Btn>

              {/* Separatore Il Mio Vibra */}
              <Div className="pt-3 mt-3 border-t border-sidebar-border">
                <Btn
                  onClick={() => go('/il-mio-vibra')}
                  className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#551a8e]', myActive && 'shadow-sm bg-[#551a8e]/[0.13]')}
                >
                  {vibraLogoUrl
                    ? <Image source={{ uri: vibraLogoUrl }} style={{ width: 32, height: 32 }} contentFit="contain" accessibilityLabel="Vibra" cachePolicy={IMAGE_CACHE} transition={0} />
                    : <Div className="w-4 h-4 rounded bg-primary/30 shrink-0" />}
                  Il Mio Vibra
                </Btn>

                {/* Sotto-menu visibili solo quando si è su /il-mio-vibra */}
                {myActive && (
                  <Div className="mt-1 ml-3 pl-3 border-l border-primary/20 space-y-0.5">
                    {myVibraSubItems.map(({ key, label, icon: SubIcon }) => {
                      const isSubActive = activeTab === key;
                      return (
                        <Btn
                          key={key}
                          onClick={() => go(`/il-mio-vibra?tab=${key}`)}
                          className={cn('flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium', isSubActive ? 'text-primary bg-primary/10' : 'text-muted-foreground')}
                        >
                          <SubIcon className="w-3 h-3 flex-shrink-0" />
                          {label}
                        </Btn>
                      );
                    })}
                  </Div>
                )}
              </Div>
            </Div>
          </ScrollView>
        </Div>
  );
});
