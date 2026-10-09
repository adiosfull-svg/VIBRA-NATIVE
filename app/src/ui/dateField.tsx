// Campo data/ora sul telefono (<input type="date|time|datetime-local"> del web): il riquadro
// apre il selettore di sistema; il valore resta nel formato del browser (dateValue.ts).
//  - Android: finestre native (data, poi ora per datetime-local) con "Cancella" per svuotarlo
//  - iOS: selettore in un pannello in basso con Annulla / Cancella / OK
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { DateBox, type DateFieldProps } from './dateBox';
import { formatInputValue, limitDate, parseInputValue } from './dateValue';
import { useFormField } from './formContext';
import { Btn } from './html';
import { Text } from './text';

export type DateFieldHandle = { focus: () => void; blur: () => void; click: () => void; showPicker: () => void };

export const DateField = forwardRef<DateFieldHandle, DateFieldProps>((props, ref) => {
  const { type, value, onChange, onBlur, min, max, disabled, required } = props;
  const [iosDraft, setIosDraft] = useState<Date | null>(null);
  const current = parseInputValue(type, value == null ? '' : String(value));
  const minimumDate = type === 'time' ? undefined : limitDate(type, min);
  const maximumDate = type === 'time' ? undefined : limitDate(type, max);
  const emit = (v: string) => { onChange?.({ target: { value: v } }); onBlur?.(); };

  const openAndroid = (mode: 'date' | 'time', start: Date, then?: (d: Date) => void) => {
    DateTimePickerAndroid.open({
      value: start, mode, is24Hour: true, minimumDate, maximumDate,
      neutralButton: { label: 'Cancella' },
      onChange: (e: DateTimePickerEvent, d?: Date) => {
        if (e.type === 'neutralButtonPressed') emit('');
        else if (e.type === 'set' && d) {
          if (then) then(d);
          else emit(formatInputValue(type, d));
        }
      },
    });
  };

  const open = () => {
    if (disabled) return;
    const start = current ?? new Date();
    if (Platform.OS === 'android') {
      if (type === 'datetime-local') {
        openAndroid('date', start, (day) => openAndroid('time', day, (t) => {
          const d = new Date(day);
          d.setHours(t.getHours(), t.getMinutes(), 0, 0);
          emit(formatInputValue(type, d));
        }));
      } else openAndroid(type === 'time' ? 'time' : 'date', start);
    } else setIosDraft(start);
  };

  useImperativeHandle(ref, () => ({ focus: open, blur: () => setIosDraft(null), click: open, showPicker: open }));
  useFormField({ required: !!required, isEmpty: () => !value, focus: open });

  const closeIos = (v?: string) => {
    setIosDraft(null);
    if (v != null) emit(v);
  };

  return (
    <>
      <DateBox {...props} onPress={open} />
      {Platform.OS === 'ios' && iosDraft ? (
        <Modal transparent animationType="slide" onRequestClose={() => closeIos()}>
          <Pressable style={{ flex: 1 }} onPress={() => closeIos()} />
          <View className="bg-card border-t border-border pb-8">
            <View className="flex-row items-center justify-between px-4 py-3">
              <Btn onClick={() => closeIos()}><Text className="text-muted-foreground">Annulla</Text></Btn>
              <Btn onClick={() => closeIos('')}><Text className="text-muted-foreground">Cancella</Text></Btn>
              <Btn onClick={() => closeIos(formatInputValue(type, iosDraft))}><Text className="text-primary font-semibold">OK</Text></Btn>
            </View>
            <DateTimePicker
              value={iosDraft}
              mode={type === 'datetime-local' ? 'datetime' : type}
              display={type === 'time' ? 'spinner' : 'inline'}
              themeVariant="dark"
              locale="it-IT"
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={(_e: DateTimePickerEvent, d?: Date) => { if (d) setIosDraft(d); }}
            />
          </View>
        </Modal>
      ) : null}
    </>
  );
});
DateField.displayName = 'DateField';
