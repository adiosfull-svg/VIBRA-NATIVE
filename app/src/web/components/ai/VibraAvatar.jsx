// Port di src/components/ai/VibraAvatar.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Brain } from '@/ui/icons.generated';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';

import { Div } from '@/ui/html';
import { Img } from '@/ui/elements';

/**
 * Avatar circolare di Vibra: mostra il logo (se caricato) altrimenti un fallback
 * con l'icona. Usato come avatar dell'assistente nei messaggi e nelle intestazioni.
 */
export default function VibraAvatar({ size = 'md', className = '' }) {
  const { logoDataUrl } = useVibraLogo();
  const container = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  return (
    <Div className={`${container} rounded-full bg-primary/15 flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
      {logoDataUrl ? (
        <Img src={logoDataUrl} alt="Vibra" className="w-full h-full object-contain p-1" />
      ) : (
        <Brain className={size === 'sm' ? 'w-3.5 h-3.5 text-primary' : 'w-4 h-4 text-primary'} />
      )}
    </Div>
  );
}