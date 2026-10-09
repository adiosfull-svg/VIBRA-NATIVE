// Port di src/components/layout/AccountMenu.jsx: pannello laterale destro (w-72) con social,
// voci account/admin, "Visualizza come", Instagram, esci, elimina account.
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Alert, Animated, Linking, Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { base44 } from '../../../lib/base44';
import { useAuth } from '../../../lib/auth';
import { useViewAsPromoter } from '../../../lib/viewAs';
import { usePresence } from '../../../ui/anim';
import { Btn, Div, P, Span } from '../../../ui/html';
import { BookOpen, Eye, FileBarChart, Instagram, Loader2, LogOut, Settings, Settings2, ShieldCheck, Trash2, Unlink, X } from '../../../ui/icons.generated';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/menu';
import { useLayoutUI } from '../../lib/layoutUI';
import { useNavigate } from '../../router';
import DeleteAccountDialog from '../shared/DeleteAccountDialog';

const IG_PATH = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z';
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
const TT_PATH = 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.23 8.23 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z';

function Brand({ d }: { d: string }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24"><Path d={d} fill="#ffffff" /></Svg>;
}

function SocialLink({ href, d, title, subtitle, className, gradient }: {
  href: string; d: string; title: string; subtitle: string; className?: string; gradient?: boolean;
}) {
  return (
    <Pressable onPress={() => Linking.openURL(href)} accessibilityRole="link" style={({ pressed }) => pressed && { transform: [{ scale: 0.95 }] }}>
      <Div className={`flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden ${className ?? ''}`}>
        {gradient && (
          // linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)
          <LinearGradient colors={['#833ab4', '#fd1d1d', '#fcb045']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        )}
        <Brand d={d} />
        <Div>
          <P className="text-white text-sm font-semibold leading-none">{title}</P>
          <P className="text-white/80 text-[11px] mt-0.5">{subtitle}</P>
        </Div>
      </Div>
    </Pressable>
  );
}

const ITEM = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium';

export default function AccountMenu() {
  const { accountMenuOpen: open, setAccountMenuOpen: setOpen } = useLayoutUI();
  const [showDelete, setShowDelete] = useState(false);
  const [igDisconnecting, setIgDisconnecting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(288, width);
  const { progress, mounted } = usePresence(open, 300, 300);
  const { viewAsPromoterId, setViewAs, clearViewAs, isViewingAs, isAdmin } = useViewAsPromoter();
  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list('-name', 5000),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: isAdmin,
  });
  const sortedPromoters = useMemo(
    () => [...promoters].sort((a: any, b: any) => (a.name || '').localeCompare(b.name || '')),
    [promoters],
  );

  const go = (path: string) => { setOpen(false); navigate(path); };
  const handleLogout = () => base44.auth.logout('/');

  const effectivePromoterId = viewAsPromoterId || user?.promoter_id;
  const { data: igStatus } = useQuery({
    queryKey: ['my-ig-connection', effectivePromoterId],
    queryFn: async () => (await base44.functions.invoke('getMyIGConnectionStatus', { promoter_id: effectivePromoterId })).data,
    enabled: !!user && !!effectivePromoterId && open,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleIgConnect = async () => {
    if (!igStatus?.authUrl) return;
    await Linking.openURL(igStatus.authUrl);
    qc.invalidateQueries({ queryKey: ['my-ig-connection'] });
  };

  const handleIgDisconnect = () => {
    Alert.alert('Scollega Instagram', 'Sicuro di voler scollegare Instagram? I DM non verranno più sincronizzati.', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Scollega', style: 'destructive', onPress: async () => {
          setIgDisconnecting(true);
          try {
            await base44.functions.invoke('disconnectInstagram', { promoter_id: effectivePromoterId });
            qc.invalidateQueries({ queryKey: ['my-ig-connection'] });
            qc.invalidateQueries({ queryKey: ['promoter'] });
            qc.invalidateQueries({ queryKey: ['instagram-messages'] });
          } catch (e) {
            console.error('Disconnect failed:', e);
          } finally {
            setIgDisconnecting(false);
          }
        },
      },
    ]);
  };

  return (
    <>
      <Btn onClick={() => setOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-secondary/50" accessibilityLabel="Menu account">
        <Settings className="w-7 h-7 text-foreground" />
      </Btn>

      <Modal visible={mounted} transparent animationType="none" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} className="bg-black/50" onPress={() => setOpen(false)} accessibilityLabel="Chiudi menu" />
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: panelWidth,
            transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [panelWidth, 0] }) }],
          }}
        >
          <Div className="flex-1 bg-card border-l border-border shadow-2xl" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <Div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Span className="font-semibold text-sm">Account</Span>
              <Btn onClick={() => setOpen(false)} className="p-1 rounded-lg" accessibilityLabel="Chiudi">
                <X className="w-5 h-5 text-muted-foreground" />
              </Btn>
            </Div>

            <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
              {/* Social */}
              <Div className="px-4 pt-5 pb-2">
                <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Seguici</P>
                <Div className="space-y-2">
                  <SocialLink href="https://instagram.com/vibrayourparty" d={IG_PATH} title="Instagram" subtitle="@vibrayourparty" gradient />
                  <SocialLink href="https://wa.me/393445933262" d={WA_PATH} title="WhatsApp" subtitle="+39 344 593 3262" className="bg-[#25D366]" />
                  <SocialLink href="https://tiktok.com/@vibrayourparty" d={TT_PATH} title="TikTok" subtitle="@vibrayourparty" className="bg-[#010101] border border-[#333333]" />
                </Div>
              </Div>

              {/* Actions */}
              <Div className="flex-1 px-4 py-4 space-y-2">
                <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Account</P>

                <Btn onClick={() => go('/academy')} className={`${ITEM} text-primary active:bg-primary/10`}>
                  <BookOpen className="w-4 h-4" />Guida all'uso dell'APP
                </Btn>

                {user?.role === 'admin' && (
                  <>
                    <Btn onClick={() => go('/admin-console')} className={`${ITEM} text-primary active:bg-primary/10`}>
                      <ShieldCheck className="w-4 h-4" />Consolle Admin
                    </Btn>
                    <Btn onClick={() => go('/impostazioni-app')} className={`${ITEM} text-primary active:bg-primary/10`}>
                      <Settings2 className="w-4 h-4" />Impostazioni App
                    </Btn>
                    <Btn onClick={() => go('/report')} className={`${ITEM} text-primary active:bg-primary/10`}>
                      <FileBarChart className="w-4 h-4" />Report
                    </Btn>

                    {/* Visualizza come promoter */}
                    <Div className="space-y-2 px-4 py-1">
                      <Div className="flex items-center gap-3 text-sm font-medium text-primary">
                        <Eye className="w-4 h-4" />
                        <Span>Visualizza come</Span>
                      </Div>
                      <Select value={viewAsPromoterId || ''} onValueChange={(v) => setViewAs(v || null)}>
                        <SelectTrigger className="w-full text-xs font-medium rounded-lg bg-secondary/40 border border-border text-foreground px-3 py-2 h-auto">
                          <SelectValue placeholder="Io stesso (admin)" className="text-xs font-medium" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Io stesso (admin)</SelectItem>
                          {sortedPromoters.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {isViewingAs && (
                        <Btn onClick={clearViewAs} className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 bg-amber-500/10">
                          <X className="w-3 h-3" />
                          Esci dalla visualizzazione
                        </Btn>
                      )}
                    </Div>
                  </>
                )}

                {/* Instagram connect/disconnect */}
                {effectivePromoterId && (
                  <Div className="space-y-1">
                    <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 px-1">Instagram</P>
                    {igStatus?.connected ? (
                      <Btn onClick={handleIgDisconnect} disabled={igDisconnecting} className={`${ITEM} text-destructive active:bg-destructive/10`}>
                        {igDisconnecting ? <Loader2 className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                        Scollega Instagram
                      </Btn>
                    ) : igStatus?.authUrl ? (
                      <Btn onClick={handleIgConnect} className={`${ITEM} text-pink-400 active:bg-pink-500/10`}>
                        <Instagram className="w-4 h-4" />
                        Collega Instagram
                      </Btn>
                    ) : (
                      <Div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground/60">
                        <Instagram className="w-4 h-4" />
                        Nessun promoter associato
                      </Div>
                    )}
                  </Div>
                )}

                <Btn onClick={handleLogout} className={`${ITEM} active:bg-secondary/60`}>
                  <LogOut className="w-4 h-4 text-muted-foreground" />Esci dall'app
                </Btn>

                <Btn onClick={() => { setOpen(false); setShowDelete(true); }} className={`${ITEM} text-destructive active:bg-destructive/10`}>
                  <Trash2 className="w-4 h-4" />Elimina Account
                </Btn>
              </Div>

              <Div className="px-5 py-4 border-t border-border" style={{ paddingBottom: 16 + insets.bottom }}>
                <P className="text-[11px] text-muted-foreground leading-relaxed">
                  La richiesta di eliminazione account verrà processata entro 30 giorni.
                </P>
              </Div>
            </ScrollView>
          </Div>
        </Animated.View>
      </Modal>

      <DeleteAccountDialog open={showDelete} onOpenChange={setShowDelete} />
    </>
  );
}
