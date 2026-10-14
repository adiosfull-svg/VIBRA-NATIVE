// <div contentEditable> sul telefono: un contentEditable vero in una piccola WebView (stessi comandi del
// browser: grassetto, corsivo, sottolineato, inserisci testo). L'HTML torna all'app a ogni modifica.
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

export type RichEditorHandle = { focus: () => void; exec: (cmd: string, value?: string) => void; setHtml: (html: string) => void; getHtml: () => string };
export type RichEditorProps = { onChange?: (html: string) => void; onBlur?: () => void; placeholder?: string; minHeight?: number };

const page = (placeholder: string) => `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>html,body{margin:0;background:#2c2c30;color:#f2f2f2;font:14px/20px -apple-system,Roboto,sans-serif}
#e{min-height:100%;padding:8px 12px;outline:none;white-space:pre-wrap;box-sizing:border-box}
#e:empty:before{content:attr(data-placeholder);color:rgba(135,135,146,.5)}</style></head>
<body><div id="e" contenteditable="true" data-placeholder="${placeholder.replace(/"/g, '&quot;')}"></div><script>
var e=document.getElementById('e'),r=null;
function post(t){window.ReactNativeWebView.postMessage(JSON.stringify({type:t,html:e.innerHTML,h:document.body.scrollHeight}));}
function save(){var s=getSelection();if(s.rangeCount)r=s.getRangeAt(0).cloneRange();}
e.addEventListener('input',function(){post('input')});e.addEventListener('blur',function(){save();post('blur')});
document.addEventListener('selectionchange',save);
window.__cmd=function(c,v){e.focus();var s=getSelection();if(r){s.removeAllRanges();s.addRange(r);}document.execCommand(c,false,v);post('input');};
window.__set=function(h){e.innerHTML=h;post('set');};
post('ready');
</script></body></html>`;

export const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(({ onChange, onBlur, placeholder = '', minHeight = 100 }, ref) => {
  const web = useRef<WebView>(null);
  const html = useRef('');
  const [height, setHeight] = useState(minHeight);
  const source = useMemo(() => ({ html: page(placeholder) }), [placeholder]);
  const js = (code: string) => web.current?.injectJavaScript(`${code};true;`);
  useImperativeHandle(ref, () => ({
    focus: () => js('document.getElementById("e").focus()'),
    exec: (cmd, value) => js(`window.__cmd(${JSON.stringify(cmd)}, ${JSON.stringify(value ?? null)})`),
    setHtml: (h) => { html.current = h; js(`window.__set(${JSON.stringify(h)})`); },
    getHtml: () => html.current,
  }));
  const onMessage = (ev: WebViewMessageEvent) => {
    try {
      const m = JSON.parse(ev.nativeEvent.data);
      setHeight(Math.max(minHeight, Math.ceil(m.h || 0)));
      if (m.type === 'input') { html.current = m.html; onChange?.(m.html); }
      if (m.type === 'blur') onBlur?.();
    } catch { /* non nostro */ }
  };
  return (
    <WebView ref={web} originWhitelist={['*']} source={source} onMessage={onMessage} scrollEnabled={false}
      hideKeyboardAccessoryView keyboardDisplayRequiresUserAction={false}
      style={{ height, backgroundColor: '#2c2c30' }} />
  );
});
RichEditor.displayName = 'RichEditor';
