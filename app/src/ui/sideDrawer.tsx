// Pannello laterale a comparsa (Sidebar a sinistra, AccountMenu a destra), come il
// `transition-transform duration-300` dell'originale.
//
// PRESTAZIONI (docs/REGOLE-PRESTAZIONI.md §5): prima era un <Modal> montato all'apertura: a ogni tocco
// Android creava una finestra nuova e React montava tutto il contenuto nello stesso istante in cui
// doveva partire l'animazione (scatti, e con un AccountMenu per pagina se ne aprivano 5 insieme).
// Ora: un solo pannello nel layout, montato in anticipo a app ferma e poi tenuto montato; aprire e
// chiudere muove solo una shared value di Reanimated (thread UI), il contenuto non si ridisegna.
// Da chiuso il pannello resta MONTATO fuori dallo schermo (translateX = ±larghezza, velo a opacità 0),
// senza tocchi e nascosto all'accessibilità (e quindi a Maestro). Prima era `display: none`: in Fabric
// un nodo `display: none` non ha viste native, quindi a ogni apertura Android ricreava tutte le viste
// del menu e le immagini (logo VIBRA della sidebar) ripartivano da vuote: l'«esitazione» del logo.
import { memo, useEffect, useRef, useState, type ReactNode } from 'react';
import { BackHandler, InteractionManager, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { registerDrawerAnimator, type DrawerName } from '../web/lib/layoutUI';

// stesse curve di ui/anim.ts (cubic-bezier dell'originale)
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_IN = Easing.bezier(0.4, 0, 1, 1);
const OPEN_MS = 280;
const CLOSE_MS = 220;
/** montaggio anticipato del contenuto: dopo l'avvio, a app ferma (vedi REGOLE §1) */
const PREMOUNT_DELAY_MS = 1800;

type Props = {
  name: DrawerName;
  open: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  width: number;
  /** colore del velo (bg-black/60 della sidebar, bg-black/50 del menu account) */
  backdropOpacity: number;
  closeLabel?: string;
  children: ReactNode;
};

function SideDrawerImpl({ name, open, onClose, side, width, backdropOpacity, closeLabel = 'Chiudi menu', children }: Props) {
  const progress = useSharedValue(open ? 1 : 0);
  const target = useRef(open ? 1 : 0);
  // contenuto montato in anticipo (o subito, se lo si apre prima)
  const [ready, setReady] = useState(open);
  // visibile = aperto o in chiusura; a fine chiusura → nascosto (fuori schermo, senza tocchi)
  const [shown, setShown] = useState(open);

  useEffect(() => {
    if (ready) return;
    let task: { cancel: () => void } | null = null;
    const t = setTimeout(() => { task = InteractionManager.runAfterInteractions(() => setReady(true)); }, PREMOUNT_DELAY_MS);
    return () => { clearTimeout(t); task?.cancel(); };
  }, [ready]);

  useEffect(() => {
    const animate = (to: boolean) => {
      const v = to ? 1 : 0;
      if (target.current === v) return;
      target.current = v;
      progress.value = withTiming(v, { duration: to ? OPEN_MS : CLOSE_MS, easing: to ? EASE_OUT : EASE_IN }, (finished) => {
        'worklet';
        if (finished && v === 0) scheduleOnRN(setShown, false);
      });
    };
    return registerDrawerAnimator(name, animate);
  }, [name, progress]);

  // stato React (anche se l'animazione è già partita dall'azione): monta/mostra e, se l'azione non
  // aveva un animatore registrato, anima da qui
  useEffect(() => {
    if (open) { setReady(true); setShown(true); }
    const v = open ? 1 : 0;
    if (target.current !== v) {
      target.current = v;
      progress.value = withTiming(v, { duration: open ? OPEN_MS : CLOSE_MS, easing: open ? EASE_OUT : EASE_IN }, (finished) => {
        'worklet';
        if (finished && v === 0) scheduleOnRN(setShown, false);
      });
    }
  }, [open, progress]);

  // tasto Indietro di Android (prima lo dava onRequestClose del Modal)
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
    return () => sub.remove();
  }, [open, onClose]);

  const sign = side === 'left' ? -1 : 1;
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value * backdropOpacity }));
  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - progress.value) * sign * width }] }));

  if (!ready) return null;
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.root]}
      pointerEvents={open ? 'box-none' : 'none'}
      importantForAccessibility={shown ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!shown}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={closeLabel} />
      </Animated.View>
      <Animated.View style={[styles.panel, side === 'left' ? styles.left : styles.right, { width }, panelStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // sopra a tutto il layout: su Android l'elevation (ombre della nav bar, pulsante Cerca) scavalca
  // l'ordine dei fratelli, quindi serve un'elevation più alta (§7 delle regole)
  root: { zIndex: 1000, elevation: 1000 },
  backdrop: { backgroundColor: '#000000' },
  panel: { position: 'absolute', top: 0, bottom: 0 },
  left: { left: 0 },
  right: { right: 0 },
});

/** Il contenuto va passato già memoizzato (componente in memo senza prop che cambiano all'apertura). */
export const SideDrawer = memo(SideDrawerImpl);
