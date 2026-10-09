// Equivalenti nativi degli elementi HTML usati nel JSX dell'app web, così i componenti si
// portano riga per riga mantenendo className e struttura:
//   <div> → Div   <span>/<p>/<h*> → Span/P/H   <button> → Btn (onClick come sul web)
import { Children, Fragment, isValidElement, useContext, type ReactNode } from 'react';
import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';
import { cn } from './cn';
import { splitTextClasses, Text, TextClassContext, type AppTextProps } from './text';

/** Avvolge in <Text> le stringhe/numeri figli diretti (in RN il testo nudo in una View è un errore). */
function wrapText(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') return <Text>{child}</Text>;
    if (isValidElement(child) && child.type === Fragment) {
      return <Fragment key={child.key}>{wrapText((child.props as { children?: ReactNode }).children)}</Fragment>;
    }
    return child;
  });
}

type DivProps = ViewProps & { className?: string; children?: ReactNode };

export function Div({ className, children, ...props }: DivProps) {
  const inherited = useContext(TextClassContext);
  const [text, box] = splitTextClasses(className);
  const content = wrapText(children);
  return (
    <View {...props} className={box}>
      {text ? <TextClassContext.Provider value={cn(inherited, text)}>{content}</TextClassContext.Provider> : content}
    </View>
  );
}

export const Span = Text;
export const P = Text;
export function H({ className, ...props }: AppTextProps) {
  return <Text accessibilityRole="header" className={className} {...props} />;
}

type BtnProps = Omit<PressableProps, 'children'> & {
  className?: string;
  children?: ReactNode;
  onClick?: PressableProps['onPress'];
};

/** <button>: cliccabile, eredita/propaga le classi di testo come Div. */
export function Btn({ className, children, onClick, onPress, disabled, ...props }: BtnProps) {
  const inherited = useContext(TextClassContext);
  const [text, box] = splitTextClasses(className);
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      onPress={onPress ?? onClick}
      className={cn(box, disabled && 'opacity-50')}
    >
      <TextClassContext.Provider value={cn(inherited, text)}>{wrapText(children)}</TextClassContext.Provider>
    </Pressable>
  );
}
