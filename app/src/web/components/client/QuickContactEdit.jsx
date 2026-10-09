// Port di src/components/client/QuickContactEdit.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - <input> gesture/eventi web rimossi: onPaste
import React, { useState, useEffect, useCallback } from 'react';
import { Phone, Instagram, Check, X, Pencil } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';

// ─── Icone ufficiali brand ───
function WhatsAppBrandIcon({ className }) {
  return (
    <Svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </Svg>
  );
}

function InstagramBrandIcon({ className }) {
  return (
    <Svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </Svg>
  );
}

import { parseIgHandle } from '@/legacy/utils/seminaParse';

import { Btn, Div, Span } from '@/ui/html';
import { A, HtmlInput, Path, Svg } from '@/ui/elements';

export default function QuickContactEdit({ client, onSaved }) {
  const qc = useQueryClient();
  const [editingField, setEditingField] = useState(null); // 'phone' | 'ig' | null
  const [editValue, setEditValue] = useState('');
  const [localPhone, setLocalPhone] = useState(null);
  const [localIg, setLocalIg] = useState(null);
  const [savedField, setSavedField] = useState(null); // mostra check verde dopo save

  useEffect(() => {
    setLocalPhone(null);
    setLocalIg(null);
  }, [client?.phone, client?.instagram]);

  const displayPhone = localPhone ?? client?.phone;
  const displayIg = localIg ?? client?.instagram;

  const phoneClean = displayPhone?.replace(/\s/g, '') || '';
  const igHandle = displayIg?.replace('@', '') || '';

  const startEdit = (field, current) => {
    setEditingField(field);
    setEditValue(current || '');
  };

  const saveEdit = useCallback(async () => {
    const field = editingField;
    if (!field) return;
    const clean = field === 'ig' ? parseIgHandle(editValue.trim()) : editValue.trim();
    setEditingField(null);
    const current = field === 'phone' ? (displayPhone || '') : (displayIg || '');
    if (clean === current) return;

    const updateData = field === 'phone' ? { phone: clean } : { instagram: clean };
    await base44.entities.Client.update(client.id, updateData);

    if (field === 'phone') setLocalPhone(clean);
    else setLocalIg(clean);

    setSavedField(field);
    setTimeout(() => setSavedField(null), 2000);
    onSaved?.(updateData);
    qc.setQueriesData({ queryKey: ['clients'] }, (old) =>
      Array.isArray(old) ? old.map(c => c.id === client.id ? { ...c, ...updateData } : c) : old
    );
  }, [editingField, editValue, displayPhone, displayIg, client?.id, onSaved, qc]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditingField(null);
  };

  const hasPhone = !!phoneClean;
  const hasIg = !!igHandle;
  const isPhoneSaved = savedField === 'phone';
  const isIgSaved = savedField === 'ig';

  return (
    <Btn className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
      {/* ── Telefono: pill brand WhatsApp ── */}
      {editingField === 'phone' ? (
        <Div className="flex items-center gap-1">
          <HtmlInput
            autoFocus
            type="tel"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            className="w-[105px] h-6 text-[10px] px-2 rounded-full border border-primary bg-transparent text-foreground outline-none"
            placeholder="+39..."
            onKeyDown={handleKeyDown} />
          <Btn onClick={saveEdit} className="p-0.5 rounded text-emerald-400 hover:bg-emerald-400/10" accessibilityLabel="Salva"><Check className="w-3 h-3" /></Btn>
          <Btn onClick={() => setEditingField(null)} className="p-0.5 rounded text-muted-foreground hover:text-foreground" accessibilityLabel="Annulla"><X className="w-3 h-3" /></Btn>
        </Div>
      ) : (
        <Div className="flex items-center rounded-full overflow-hidden shrink-0 bg-emerald-500/10">
          {hasPhone && (
            <A
              href={`https://wa.me/${phoneClean}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 pl-2 pr-1 py-1 hover:bg-emerald-500/20 transition-colors"
              onClick={e => e.stopPropagation()}
              accessibilityLabel="Apri WhatsApp"
            >
              <WhatsAppBrandIcon className="w-3 h-3 text-emerald-400" />
              <Span className="text-[10px] font-semibold text-emerald-400">WhatsApp</Span>
            </A>
          )}
          <Btn
            onClick={() => startEdit('phone', displayPhone)}
            className="flex items-center gap-1 px-2 py-1 hover:bg-emerald-500/60 transition-colors"
            accessibilityLabel="Clicca per modificare il telefono"
          >
            {displayPhone ? (
              <Span className="text-[10px] text-emerald-400/90">{displayPhone}</Span>
            ) : (
              <Span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <WhatsAppBrandIcon className="w-2.5 h-2.5" /> Aggiungi Whatsapp
              </Span>
            )}
            {isPhoneSaved && <Check className="w-3 h-3 text-emerald-300 shrink-0" />}
          </Btn>
        </Div>
      )}

      {/* ── Instagram: pill brand Instagram ── */}
      {editingField === 'ig' ? (
        <Div className="flex items-center gap-1">
          <HtmlInput
            autoFocus
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={() => {
              const parsed = parseIgHandle(editValue.trim());
              if (parsed && parsed !== editValue.trim()) setEditValue(parsed);
            }}
            className="w-[100px] h-6 text-[10px] px-2 rounded-full bg-transparent text-pink-400 outline-none"
            placeholder="@handle"
            onKeyDown={handleKeyDown} />
          <Btn onClick={saveEdit} className="p-0.5 rounded text-emerald-400 hover:bg-emerald-400/10" accessibilityLabel="Salva"><Check className="w-3 h-3" /></Btn>
          <Btn onClick={() => setEditingField(null)} className="p-0.5 rounded text-muted-foreground hover:text-foreground" accessibilityLabel="Annulla"><X className="w-3 h-3" /></Btn>
        </Div>
      ) : (
        <Div className="flex items-center rounded-full overflow-hidden shrink-0 bg-pink-500/10">
          {hasIg && (
            <A
              href={`https://instagram.com/${igHandle}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 pl-2 pr-1 py-1 hover:bg-pink-500/20 transition-colors"
              onClick={e => e.stopPropagation()}
              accessibilityLabel="Apri Instagram"
            >
              <InstagramBrandIcon className="w-3 h-3 text-pink-400" />
              <Span className="text-[10px] font-semibold text-pink-400">Instagram</Span>
            </A>
          )}
          <Btn
            onClick={() => startEdit('ig', displayIg)}
            className="flex items-center gap-1 px-2 py-1 hover:bg-pink-500/60 transition-colors"
            accessibilityLabel="Clicca per modificare Instagram"
          >
            {displayIg ? (
              <Span className="text-[10px] text-pink-400/90">{displayIg}</Span>
            ) : (
              <Span className="text-[10px] text-pink-400 flex items-center gap-0.5">
                <Instagram className="w-2.5 h-2.5" /> Aggiungi IG
              </Span>
            )}
            {isIgSaved && <Check className="w-3 h-3 text-emerald-300 shrink-0" />}
          </Btn>
        </Div>
      )}
    </Btn>
  );
}