// Port di src/components/shared/SectionHeader.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Div, H, Span } from '@/ui/html';

/**
 * Intestazione sezione in stile Growth League:
 * icona in contenitore arrotondato colorato + titolo uppercase con tracking.
 * Usata in tutti i tab di Il Mio Vibra per uniformità visiva.
 *
 * @param {string} icon  - componente icona lucide-react
 * @param {string} title - testo titolo
 * @param {string} color - colore esadecimale (default viola primario)
 * @param {string} className - classi extra per il wrapper flex
 * @param {boolean} as  - semantica: 'h4' (default) o 'h3' per titoli più grandi
 */
export default function SectionHeader({ icon: Icon, title, color = '#a78bfa', className = '', size = 'sm' }) {
  const iconWrap = size === 'lg' ? 'p-2 rounded-xl' : 'p-1.5 rounded-lg';
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const titleSize = size === 'lg' ? 'text-sm' : 'text-xs';
  const emojiSize = size === 'lg' ? 'text-base' : 'text-sm';
  return (
    <Div className={`flex items-center gap-2 ${className}`}>
      <Div className={`flex items-center justify-center ${iconWrap}`} style={{ background: `${color}1a` }}>
        {typeof Icon === 'string'
          ? <Span className={`${emojiSize} leading-none`}>{Icon}</Span>
          : <Icon className={iconSize} style={{ color }} />}
      </Div>
      <H className={`${titleSize} font-semibold uppercase tracking-wider`} style={{ color }}>{title}</H>
    </Div>
  );
}