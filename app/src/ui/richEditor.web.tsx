// <div contentEditable> del web: il div vero, con i comandi del browser (execCommand).
import { createElement, forwardRef, useImperativeHandle, useRef } from 'react';

export type RichEditorHandle = { focus: () => void; exec: (cmd: string, value?: string) => void; setHtml: (html: string) => void; getHtml: () => string };
export type RichEditorProps = { onChange?: (html: string) => void; onBlur?: () => void; placeholder?: string; minHeight?: number };

export const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(({ onChange, onBlur, placeholder, minHeight = 100 }, ref) => {
  const el = useRef<HTMLDivElement | null>(null);
  const range = useRef<Range | null>(null);
  const save = () => { const s = window.getSelection(); if (s && s.rangeCount > 0) range.current = s.getRangeAt(0).cloneRange(); };
  useImperativeHandle(ref, () => ({
    focus: () => el.current?.focus(),
    exec: (cmd, value) => {
      el.current?.focus();
      const s = window.getSelection();
      if (range.current && s) { s.removeAllRanges(); s.addRange(range.current); }
      document.execCommand(cmd, false, value);
      onChange?.(el.current?.innerHTML ?? '');
    },
    setHtml: (html) => { if (el.current) el.current.innerHTML = html; },
    getHtml: () => el.current?.innerHTML ?? '',
  }));
  return createElement('div', {
    ref: el, contentEditable: true, suppressContentEditableWarning: true, 'data-placeholder': placeholder,
    className: 'vibra-rich-editor',
    onInput: () => onChange?.(el.current?.innerHTML ?? ''),
    onBlur: () => { save(); onBlur?.(); },
    onKeyUp: save, onMouseUp: save,
    style: { minHeight, padding: '8px 12px', fontSize: 14, lineHeight: '20px', color: '#f2f2f2', background: '#2c2c30', outline: 'none', whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' },
  });
});
RichEditor.displayName = 'RichEditor';
