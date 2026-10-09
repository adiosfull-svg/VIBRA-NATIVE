// Port di src/components/dashboard/MonthPicker.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { ChevronLeft, ChevronRight } from '@/ui/icons.generated';
import { format, startOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, Span } from '@/ui/html';

export default function MonthPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) setOpen(false);
    };
    webDocument.addEventListener('mousedown', handler);
    return () => webDocument.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + webWindow.scrollY + 4, left: rect.left + webWindow.scrollX });
    }
    setOpen(o => !o);
  };

  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  const handleSelect = (monthIndex) => {
    onChange(startOfMonth(new Date(viewYear, monthIndex, 1)));
    setOpen(false);
  };

  const label = format(value, 'MMMM yyyy', { locale: it });

  return (
    <>
      <Btn
        ref={buttonRef}
        onClick={handleOpen}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors capitalize"
      >
        <Span>{label}</Span>
        <ChevronRight className={`w-3 h-3 transition-transform text-primary ${open ? 'rotate-90' : ''}`} />
      </Btn>

      {open && createPortal(
        <Div
          ref={dropdownRef}
          style={{ position: 'absolute', top: dropdownPos.top, left: dropdownPos.left - 95, zIndex: 9999 }}
          className="bg-card border border-border rounded-xl shadow-xl p-3 w-52"
        >
          <Div className="flex items-center justify-between mb-2">
            <Btn onClick={() => setViewYear(y => y - 1)} className="p-1 rounded hover:bg-secondary/50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </Btn>
            <Span className="text-xs font-semibold">{viewYear}</Span>
            <Btn onClick={() => setViewYear(y => y + 1)} className="p-1 rounded hover:bg-secondary/50">
              <ChevronRight className="w-3.5 h-3.5" />
            </Btn>
          </Div>
          <Div className="grid grid-cols-3 gap-1">
            {months.map((m, i) => {
              const isSelected = value.getMonth() === i && value.getFullYear() === viewYear;
              return (
                <Btn
                  key={m}
                  onClick={() => handleSelect(i)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m}
                </Btn>
              );
            })}
          </Div>
        </Div>,
        webDocument.body
      )}
    </>
  );
}
