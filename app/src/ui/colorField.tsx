// <input type="color"> sul telefono: non esiste un selettore di colore nativo; il riquadro (classi della
// pagina, sfondo = valore) apre una tavolozza (colori Tailwind 500 come quelli usati nell'app).
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Btn, Div } from './html';

export type ColorFieldProps = { value?: string; onChange?: (e: { target: { value: string } }) => void; className?: string; disabled?: boolean };

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#ffffff', '#000000',
];

export function ColorField({ value, onChange, className, disabled }: ColorFieldProps) {
  const [open, setOpen] = useState(false);
  const pick = (c: string) => { setOpen(false); onChange?.({ target: { value: c } }); };
  return (
    <>
      <Btn className={className} style={{ backgroundColor: value || '#000000' }} disabled={disabled} onClick={() => setOpen(true)} accessibilityLabel="Colore" />
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }} onPress={() => setOpen(false)}>
          <Div className="rounded-xl border border-border bg-background p-4">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 5 * 44, gap: 8 }}>
              {COLORS.map((c) => (
                <Pressable key={c} onPress={() => pick(c)} accessibilityLabel={c}
                  style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: c, borderWidth: c === value ? 3 : 1, borderColor: c === value ? '#ffffff' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </View>
          </Div>
        </Pressable>
      </Modal>
    </>
  );
}
