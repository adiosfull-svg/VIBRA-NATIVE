// Port di src/components/client/ClientAvatar.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import CachedImage from '@/web/components/shared/CachedImage';

import { Div } from '@/ui/html';

/**
 * Avatar cliente con iniziali (o foto profilo se presente).
 * Sostituisce i vecchi badge viola piatti a basso contrasto con uno stile
 * a gradiente + ring per maggiore leggibilità e coerenza visiva.
 */
const SIZE_STYLES = {
  xs: 'w-5 h-5 text-[8px]',
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-8 h-8 text-[10px]',
  lg: 'w-10 h-10 text-sm',
};

export default function ClientAvatar({ client, initials, size = 'sm', className = '', loading = 'eager' }) {
  const sizeCls = SIZE_STYLES[size] || SIZE_STYLES.sm;
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [client?.photo_url]);
  return (
    <Div
      className={`${sizeCls} rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/15 ring-1 ring-violet-400/40 flex items-center justify-center font-bold leading-none text-violet-100 shrink-0 overflow-hidden ${className}`}
    >
      {client?.photo_url && !imgError
        ? <CachedImage src={client.photo_url} alt={client?.name} className="w-full h-full object-cover" loading={loading} decoding="async" onError={() => setImgError(true)} />
        : initials}
    </Div>
  );
}