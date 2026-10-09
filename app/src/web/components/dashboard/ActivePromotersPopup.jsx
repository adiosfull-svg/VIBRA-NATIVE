// Port di src/components/dashboard/ActivePromotersPopup.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { useNavigate } from '@/web/router';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

export default function ActivePromotersPopup({ open, onClose, promoters }) {
  useOverlay(open, onClose);
  const navigate = useNavigate();
  const active = promoters.filter(p => p.status === 'attivo');

  const handleClick = (id) => {
    onClose();
    navigate(`/promoter/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Promoter Attivi ({active.length})</DialogTitle>
        </DialogHeader>
        <Div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-2">
          {active.map(p => (
            <Btn
              key={p.id}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => handleClick(p.id)}>
              <Div className="w-14 h-14 rounded-full bg-secondary border border-border overflow-hidden shrink-0">
                {p.photo_url ? (
                  <Img
                    src={p.photo_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${p.photo_zoom || 1}) translate(${p.photo_offset_x || 0}px, ${p.photo_offset_y || 0}px)`,
                      transformOrigin: 'center',
                    }}
                  />
                ) : (
                  <Div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                    {p.name?.charAt(0)?.toUpperCase()}
                  </Div>
                )}
              </Div>
              <Span className="text-[11px] text-center leading-tight text-foreground font-medium line-clamp-2">{p.name}</Span>
            </Btn>
          ))}
        </Div>
      </DialogContent>
    </Dialog>
  );
}
