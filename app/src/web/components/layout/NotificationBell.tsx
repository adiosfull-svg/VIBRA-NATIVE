// Port di src/components/layout/NotificationBell.jsx.
// Pannello ancorato sotto la campanella: su telefono largo quanto lo schermo meno 1rem per lato.
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { useRef, useState } from 'react';
import { Animated, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { usePresence } from '../../../ui/anim';
import { Btn, Div, P, Span } from '../../../ui/html';
import { HtmlText } from '../../../ui/htmlText';
import { Bell, CheckCheck, Trash2, X } from '../../../ui/icons.generated';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from '../../router';

const TYPE_COLORS: Record<string, string> = {
  new_event: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  achievement: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
  vibra_vs: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
  inactive_client: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  new_goal: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  weekly_reminder: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  system: 'bg-secondary/40 border-border text-muted-foreground',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAll } = useNotifications();
  const navigate = useNavigate();
  const bellRef = useRef<View>(null);
  const { progress, mounted } = usePresence(open);

  const handleNotificationClick = (n: any) => {
    if (!n.is_read) markAsRead(n.id);
    const url = n.action_url || '/notifiche';
    setOpen(false);
    if (/^https?:\/\//i.test(url) || url.startsWith('wa.me')) Linking.openURL(url.startsWith('wa.me') ? `https://${url}` : url);
    else navigate(url);
  };

  const openPanel = () => {
    bellRef.current?.measureInWindow((_x, y, _w, h) => {
      setTop(y + h + 8);
      setOpen(true);
    });
  };

  return (
    <Div className="relative">
      <View ref={bellRef} collapsable={false}>
        <Btn
          onClick={() => (open ? setOpen(false) : openPanel())}
          className="relative w-10 h-10 flex items-center justify-center rounded-full active:bg-secondary/50"
          accessibilityLabel="Notifiche"
        >
          <Bell className="w-7 h-7 text-foreground" />
          {unreadCount > 0 && (
            <Div className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 flex items-center justify-center px-1">
              <Span className="text-white text-[10px] font-bold leading-none">{unreadCount > 9 ? '9+' : unreadCount}</Span>
            </Div>
          )}
        </Btn>
      </View>

      <Modal visible={mounted} transparent animationType="none" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} className="bg-black/40" onPress={() => setOpen(false)} accessibilityLabel="Chiudi notifiche" />
        </Animated.View>
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={{
            position: 'absolute', top, left: 16, right: 16,
            opacity: progress,
            transform: [
              { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) },
            ],
          }}
        >
          <Div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <Div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <Btn onClick={() => { setOpen(false); navigate('/notifiche'); }} className="font-semibold text-sm">
                Notifiche
              </Btn>
              <Div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Btn onClick={() => markAllAsRead()} className="flex items-center gap-1 text-[11px] text-primary">
                    <CheckCheck className="w-3.5 h-3.5" />
                    Lette
                  </Btn>
                )}
                {notifications.length > 0 && (
                  <Btn onClick={() => deleteAll()} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Trash2 className="w-3.5 h-3.5" />
                    Cancella tutte
                  </Btn>
                )}
                <Btn onClick={() => setOpen(false)} className="text-muted-foreground" accessibilityLabel="Chiudi">
                  <X className="w-4 h-4" />
                </Btn>
              </Div>
            </Div>

            {/* Lista notifiche */}
            <ScrollView style={{ maxHeight: 384 }} bounces={false}>
              {notifications.length === 0 && (
                <Div className="px-4 py-8 items-center">
                  <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
                  <P className="text-xs text-muted-foreground">Nessuna notifica</P>
                </Div>
              )}
              {notifications.map((n: any, i: number) => (
                <Div
                  key={n.id}
                  className={`relative flex items-start gap-3 px-4 py-3 ${i < notifications.length - 1 ? 'border-b border-border/40' : ''} ${!n.is_read ? 'bg-primary/5' : ''}`}
                >
                  <Btn className="flex items-start gap-3 flex-1 min-w-0" onClick={() => handleNotificationClick(n)}>
                    <Div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 border ${TYPE_COLORS[n.type] || TYPE_COLORS.system}`}>
                      {n.icon || '🔔'}
                    </Div>
                    <Div className="flex-1 min-w-0">
                      <Div className="flex items-center gap-1.5">
                        {!n.is_read && <Div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        <P className="text-xs font-semibold truncate flex-1">{n.title}</P>
                      </Div>
                      <HtmlText html={n.message} className="text-[11px] text-muted-foreground mt-0.5" numberOfLines={2} />
                      <P className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(new Date(n.created_date.endsWith('Z') || n.created_date.includes('+') ? n.created_date : n.created_date + 'Z'), { locale: it, addSuffix: true })}
                      </P>
                    </Div>
                  </Btn>
                  <Btn onClick={() => deleteNotification(n.id)} className="shrink-0 mt-0.5 text-muted-foreground/40" accessibilityLabel="Elimina notifica">
                    <X className="w-3.5 h-3.5" />
                  </Btn>
                </Div>
              ))}
            </ScrollView>
          </Div>
        </Animated.View>
      </Modal>
    </Div>
  );
}
