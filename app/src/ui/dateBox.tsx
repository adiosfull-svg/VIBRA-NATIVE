// Parte visibile dei campi data/ora (comune a telefono e web): il testo come lo mostra Chrome
// e l'icona del calendario/orologio a destra.
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { cn } from './cn';
import { displayValue, type DateInputType } from './dateValue';
import { Btn } from './html';
import { Calendar, Clock } from './icons.generated';
import { inputFontSize, Text } from './text';

export type DateFieldProps = {
  type: DateInputType;
  value?: string | number | null;
  onChange?: (e: { target: { value: string } }) => void;
  onBlur?: () => void;
  min?: string | number; max?: string | number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  required?: boolean;
  accessibilityLabel?: string;
};

export function DateBox({ type, value, className, style, disabled, onPress, children, accessibilityLabel }: DateFieldProps & {
  onPress?: () => void; children?: ReactNode;
}) {
  const { text, empty } = displayValue(type, value == null ? '' : String(value));
  const Icon = type === 'time' ? Clock : Calendar;
  return (
    <Btn
      className={cn('relative flex-row items-center justify-between', className)}
      style={style}
      disabled={disabled}
      onClick={onPress}
      accessibilityLabel={accessibilityLabel ?? text}
    >
      <Text className={cn('flex-shrink', empty && 'opacity-70')} style={inputFontSize(className)} numberOfLines={1}>{text}</Text>
      <Icon className="w-4 h-4 ml-2 opacity-70" />
      {children}
    </Btn>
  );
}
