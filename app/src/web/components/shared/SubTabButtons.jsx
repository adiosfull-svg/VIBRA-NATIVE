// PORT (solo RN): pulsanti della barra delle sotto-tab (Clienti, Weekend, Il mio VIBRA, Locali).
// Prima la tab toccata si evidenziava solo a pagina ridisegnata (100-500 ms col contenuto nuovo):
// ora la barra, componente a sé, si evidenzia subito e il cambio tab parte due frame dopo
// (usePendingSelection, docs/REGOLE-PRESTAZIONI.md §4). Aspetto identico ai pulsanti originali.
import { memo, useLayoutEffect } from 'react';
import { usePendingSelection } from '@/web/hooks/usePendingSelection';
import { Btn, Div, hscrollDiag } from '@/ui/html';
import { TEST_DIAG } from '@/lib/testDiag';

const ACTIVE = 'bg-card text-foreground shadow-sm';
const IDLE = 'text-muted-foreground hover:text-foreground';
// build di test: ms dal rilascio del dito sulla barra (hscrollDiag.end)
const dt = () => `${Math.round(performance.now() - hscrollDiag.end)}ms`;
const diagSelect = (onSelect) => (key) => { console.log(`VIBRA subtab cambio ${key} dopo=${dt()}`); onSelect?.(key); };

function SubTabButtons({
  tabs,
  active,
  onSelect,
  activeRef,
  onPointerDownFor,
  className = 'relative flex gap-1 bg-secondary/30 p-1 rounded-xl w-max min-w-full',
  buttonClassName = 'px-3 py-2 text-xs whitespace-nowrap',
  iconClassName = 'w-3.5 h-3.5 flex-shrink-0',
}) {
  const [shown, select] = usePendingSelection(active, TEST_DIAG ? diagSelect(onSelect) : onSelect);
  useLayoutEffect(() => {
    if (!TEST_DIAG) return;
    console.log(`VIBRA subtab evidenziata ${shown} dopo=${dt()}`);
    requestAnimationFrame(() => console.log(`VIBRA subtab disegnata ${shown} dopo=${dt()}`));
  }, [shown]);
  return (
    <Div className={className}>
      {tabs.map(({ key, label, icon: TabIcon }) => (
        <Btn
          button
          key={key}
          ref={active === key ? activeRef : null}
          onClick={() => { if (TEST_DIAG) console.log(`VIBRA subtab ${key} dopo=${dt()}`); select(key); }}
          onPointerDown={onPointerDownFor?.(key)}
          {...(TEST_DIAG ? { onPressIn: () => console.log(`VIBRA subtab premuto ${key} dopo=${dt()}`), onPressOut: () => console.log(`VIBRA subtab rilasciato ${key}`) } : null)}
          className={`cursor-pointer flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 ${buttonClassName} ${shown === key ? ACTIVE : IDLE}`}>
          {TabIcon && <TabIcon className={iconClassName} />}
          {label}
        </Btn>
      ))}
    </Div>
  );
}

// memo semplice: le pagine passano onSelect/onPointerDownFor stabili (useStableHandler / useCallback),
// così la barra non si ridisegna col resto della pagina
export default memo(SubTabButtons);
