// Port di src/components/instagram/InstagramConnectScreen.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { Instagram, Loader2, MessageCircle, Sparkles, Link2 } from '@/ui/icons.generated';
import { useQueryClient } from '@tanstack/react-query';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P } from '@/ui/html';

/**
 * Schermata minimale per promoter non collegati a Instagram.
 * Mostra solo il bottone "Collega Instagram" con una breve descrizione
 * dei vantaggi (sync DM, analisi AI, abbinamento semine).
 */
export default function InstagramConnectScreen({ authUrl }) {
  const [connecting, setConnecting] = useState(false);
  const pollRef = useRef(null);
  const qc = useQueryClient();

  const handleConnect = () => {
    if (!authUrl) return;
    setConnecting(true);
    const popup = webWindow.open(authUrl, 'ig_oauth', 'width=600,height=700,scrollbars=yes');

    pollRef.current = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(pollRef.current);
        pollRef.current = null;
        setConnecting(false);
        qc.invalidateQueries({ queryKey: ['my-ig-connection'] });
      }
    }, 500);
  };

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  return (
    <Div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <Div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center ring-2 ring-pink-500/20 mb-6">
        <Instagram className="w-10 h-10 text-pink-400" />
      </Div>
      <H className="text-xl font-bold mb-3">Collega il tuo Instagram</H>
      <P className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        Collega il tuo account Instagram Business per scaricare automaticamente
        i messaggi dei DM, analizzarli con l'intelligenza artificiale e
        abbinarli alle tue semine.
      </P>
      <Btn
        button
        onClick={handleConnect}
        disabled={connecting || !authUrl}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>
        {connecting ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Collegamento…</>
        ) : (
          <><Instagram className="w-4 h-4" />Collega Instagram</>
        )}
      </Btn>
      {!authUrl && (
        <P className="text-xs text-muted-foreground/60 mt-4">
          Impossibile generare il link di collegamento. Riprova più tardi.
        </P>
      )}
    </Div>
  );
}