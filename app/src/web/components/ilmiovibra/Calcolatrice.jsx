// Port di src/components/ilmiovibra/Calcolatrice.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from '@/ui/icons.generated';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, Span } from '@/ui/html';
import { Path, Svg } from '@/ui/elements';

const MIN_W = 220;
const MIN_H = 300;
const DEFAULT_W = 288;

export default function Calcolatrice({ onClose }) {
  useOverlay(true, onClose);
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: 'auto' });
  const [initialized, setInitialized] = useState(false);

  // Drag state (mouse + touch)
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Resize state (mouse only via corner handle)
  const resizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: DEFAULT_W, h: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    const h = containerRef.current?.offsetHeight || 380;
    setPos({
      x: Math.max(0, webWindow.innerWidth / 2 - DEFAULT_W / 2),
      y: Math.max(0, webWindow.innerHeight / 2 - h / 2),
    });
    setSize({ w: DEFAULT_W, h: h });
    setInitialized(true);
  }, []);

  // ── DRAG (mouse) ──────────────────────────────────────────────
  const onMouseDownHeader = (e) => {
    if (e.target.closest?.('.close-btn')) return; // PORT: sul telefono il target non è un elemento DOM
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  const onMouseMove = useCallback((e) => {
    if (dragging.current) {
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    }
    if (resizing.current) {
      const newW = Math.max(MIN_W, resizeStart.current.w + (e.clientX - resizeStart.current.x));
      const newH = Math.max(MIN_H, resizeStart.current.h + (e.clientY - resizeStart.current.y));
      setSize({ w: newW, h: newH });
    }
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    resizing.current = false;
  }, []);

  useEffect(() => {
    webWindow.addEventListener('mousemove', onMouseMove);
    webWindow.addEventListener('mouseup', onMouseUp);
    return () => {
      webWindow.removeEventListener('mousemove', onMouseMove);
      webWindow.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── DRAG (touch) ──────────────────────────────────────────────
  const onTouchStartHeader = (e) => {
    if (e.target.closest?.('.close-btn')) return; // PORT: sul telefono il target non è un elemento DOM
    const t = e.touches[0];
    dragging.current = true;
    dragOffset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
  };

  const onTouchMove = (e) => {
    if (!dragging.current) return;
    const t = e.touches[0];
    setPos({ x: t.clientX - dragOffset.current.x, y: t.clientY - dragOffset.current.y });
    e.preventDefault();
  };

  const onTouchEnd = () => { dragging.current = false; };

  // ── RESIZE handle (mouse) ─────────────────────────────────────
  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.w,
      h: typeof size.h === 'number' ? size.h : containerRef.current?.offsetHeight || 380,
    };
    e.preventDefault();
  };

  // ── RESIZE handle (touch) ────────────────────────────────────
  const onResizeTouchStart = (e) => {
    e.stopPropagation();
    const t = e.touches[0];
    resizing.current = true;
    resizeStart.current = {
      x: t.clientX,
      y: t.clientY,
      w: size.w,
      h: typeof size.h === 'number' ? size.h : containerRef.current?.offsetHeight || 380,
    };
  };

  const onResizeTouchMove = (e) => {
    if (!resizing.current) return;
    const t = e.touches[0];
    const newW = Math.max(MIN_W, resizeStart.current.w + (t.clientX - resizeStart.current.x));
    const newH = Math.max(MIN_H, resizeStart.current.h + (t.clientY - resizeStart.current.y));
    setSize({ w: newW, h: newH });
    e.preventDefault();
  };

  const onResizeTouchEnd = () => { resizing.current = false; };

  // ── CALCULATOR LOGIC ─────────────────────────────────────────
  const handleNumber = (num) => setDisplay(d => d === '0' ? String(num) : d + num);
  const handleDecimal = () => setDisplay(d => d.includes('.') ? d : d + '.');

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '*': return prev * current;
      case '/': return prev / current;
      default: return current;
    }
  };

  const handleOperation = (op) => {
    const cur = parseFloat(display);
    if (prevValue !== null && operation) {
      const res = calculate(prevValue, cur, operation);
      setDisplay(String(res));
      setPrevValue(res);
    } else {
      setPrevValue(cur);
    }
    setOperation(op);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const res = calculate(prevValue, parseFloat(display), operation);
      setDisplay(String(res));
      setPrevValue(null);
      setOperation(null);
    }
  };

  const handleClear = () => { setDisplay('0'); setPrevValue(null); setOperation(null); };

  const handlePercent = () => {
    const cur = parseFloat(display);
    if (prevValue !== null && operation) {
      // es. 200 + 15% → 200 + (200 * 15/100)
      setDisplay(String((prevValue * cur) / 100));
    } else {
      setDisplay(String(cur / 100));
    }
  };

  const buttonClass = (extra = '') =>
    `py-2 rounded-lg font-medium text-sm select-none touch-manipulation transition-colors ${extra}`;

  return (
    <Div
      ref={containerRef}
      className="fixed z-40 rounded-xl bg-card border border-border shadow-2xl overflow-hidden"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: typeof size.h === 'number' ? size.h : undefined,
        display: initialized ? 'flex' : 'none',
        flexDirection: 'column',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Header draggabile */}
      <Div
        onMouseDown={onMouseDownHeader}
        onTouchStart={onTouchStartHeader}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="px-4 py-3 border-b border-border bg-secondary/30 cursor-move flex items-center justify-between shrink-0"
      >
        <Span className="text-xs font-semibold uppercase tracking-wider">Calcolatrice</Span>
        <Btn
          button
          onClick={onClose}
          className="close-btn text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </Btn>
      </Div>

      {/* Display */}
      <Div className="bg-secondary/50 p-4 shrink-0">
        <Div className="text-right text-3xl font-bold text-primary break-words truncate">{display}</Div>
        {operation && <Div className="text-right text-xs text-muted-foreground mt-0.5">{prevValue} {operation}</Div>}
      </Div>

      {/* Bottoni */}
      <Div className="p-3 flex-1 overflow-hidden">
        <Div className="grid grid-cols-4 gap-2 h-full" style={{ gridTemplateRows: 'repeat(5, 1fr)' }}>
          <Btn
            button
            onClick={handleClear}
            className={buttonClass('bg-destructive/20 text-destructive hover:bg-destructive/30 text-xs')}>C</Btn>
          <Btn
            button
            onClick={handlePercent}
            className={buttonClass('bg-secondary hover:bg-secondary/80')}>%</Btn>
          <Btn
            button
            onClick={() => handleOperation('/')}
            className={buttonClass('bg-primary/20 text-primary hover:bg-primary/30')}>÷</Btn>
          <Btn
            button
            onClick={() => handleOperation('*')}
            className={buttonClass('bg-primary/20 text-primary hover:bg-primary/30')}>×</Btn>

          {[7, 8, 9].map(n => (
            <Btn
              button
              key={n}
              onClick={() => handleNumber(n)}
              className={buttonClass('bg-secondary hover:bg-secondary/80')}>{n}</Btn>
          ))}
          <Btn
            button
            onClick={() => handleOperation('-')}
            className={buttonClass('bg-primary/20 text-primary hover:bg-primary/30')}>−</Btn>

          {[4, 5, 6].map(n => (
            <Btn
              button
              key={n}
              onClick={() => handleNumber(n)}
              className={buttonClass('bg-secondary hover:bg-secondary/80')}>{n}</Btn>
          ))}
          <Btn
            button
            onClick={() => handleOperation('+')}
            className={buttonClass('bg-primary/20 text-primary hover:bg-primary/30')}>+</Btn>

          {[1, 2, 3].map(n => (
            <Btn
              button
              key={n}
              onClick={() => handleNumber(n)}
              className={buttonClass('bg-secondary hover:bg-secondary/80')}>{n}</Btn>
          ))}
          <Btn
            button
            onClick={handleEquals}
            className={buttonClass('row-span-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 font-bold')}>=</Btn>

          <Btn
            button
            onClick={() => handleNumber(0)}
            className={buttonClass('col-span-2 bg-secondary hover:bg-secondary/80')}>0</Btn>
          <Btn
            button
            onClick={handleDecimal}
            className={buttonClass('bg-secondary hover:bg-secondary/80')}>.</Btn>
        </Div>
      </Div>

      {/* Resize handle (angolo in basso a destra) */}
      <Div
        onMouseDown={onResizeMouseDown}
        onTouchStart={onResizeTouchStart}
        onTouchMove={onResizeTouchMove}
        onTouchEnd={onResizeTouchEnd}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end pr-1 pb-1"
        style={{ touchAction: 'none' }}
      >
        <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <Path d="M2 9 L9 2 M6 9 L9 6" stroke="hsl(240 5% 55% / 0.6)" strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      </Div>
    </Div>
  );
}