// Port di src/components/client/ClientScrollSearch.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - createPortal: usare Modal/Portal nativi
//  - <input> gesture/eventi web rimossi: onKeyDown
//  - document.body
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@/ui/motion';
import { Search, X, ArrowDownToLine } from '@/ui/icons.generated';
import ClientAvatar from './ClientAvatar';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';

import { Btn, Div, P } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

/**
 * Pulsante flottante "Cerca cliente" (viola, affianco al ScrollToTopButton).
 * Apre un overlay animato con input di ricerca; selezionando un cliente
 * chiama onScrollToClient(clientId) per scrollare la lista virtualizzata.
 */
export default function ClientScrollSearch({ clients, onScrollToClient }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const bulk = useBulkSelection();
  const bulkActive = !!(bulk?.selectedIds?.size > 0);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return clients.
    filter((c) => c.name?.toLowerCase().includes(q) || c.instagram?.toLowerCase().includes(q)).
    slice(0, 6);
  }, [query, clients]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 220);
    } else {
      setQuery('');
    }
  }, [open]);

  const handleSelect = (client) => {
    onScrollToClient(client.id);
    setOpen(false);
  };

  // Portal a document.body: il rubber-band scroll su Android applica un transform
  // a .main-content, che rompe position:fixed sui discendenti. Renderizzato fuori
  // da .main-content resta veramente fixed rispetto al viewport.
  return createPortal(
    <>
      <Btn
        onClick={() => setOpen((v) => !v)}
        className={`fixed right-16 w-10 h-10 rounded-full text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 hover:bg-primary/90 transition-all duration-200 bg-[#551a8e] ${bulkActive ? 'bottom-40 z-50' : 'bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-40'} sm:bottom-6 sm:right-16 sm:z-30`}
        accessibilityLabel="Cerca cliente">
        
        <Search className="w-5 h-5" />
      </Btn>

      <AnimatePresence>
        {open &&
        <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50" />
          
            <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[calc(env(safe-area-inset-top)+84px)] left-2 right-2 z-50 sm:left-auto sm:w-80 sm:right-6 sm:top-auto sm:bottom-36 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            
              <Div className="relative p-3 border-b border-border/40">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <HtmlInput
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cerca cliente..."
                  className="w-full pl-7 pr-9 py-2 rounded-lg bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              
                <Btn
                onClick={() => setOpen(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                
                  <X className="w-4 h-4" />
                </Btn>
              </Div>
              <Div className="max-h-[40vh] sm:max-h-[260px] overflow-y-auto">
                {query.trim() === '' ?
              <P className="text-center text-xs text-muted-foreground py-8">
                    Digita un nome per cercare e scrollare alla riga
                  </P> :
              matches.length === 0 ?
              <P className="text-center text-xs text-muted-foreground py-8">
                    Nessun cliente trovato
                  </P> :

              matches.map((c) =>
              <Btn
                key={c.id}
                onClick={() => handleSelect(c)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 active:bg-secondary/70 transition-colors text-left border-b border-border/20 last:border-0">
                
                      <ClientAvatar
                  client={c}
                  initials={(c.name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  size="sm" />
                
                      <Div className="flex-1 min-w-0">
                        <P className="text-sm text-foreground font-medium truncate">{c.name}</P>
                        {c.instagram &&
                  <P className="text-[10px] text-muted-foreground truncate">@{c.instagram}</P>
                  }
                      </Div>
                      <ArrowDownToLine className="w-4 h-4 text-primary shrink-0" />
                    </Btn>
              )
              }
              </Div>
            </motion.div>
          </>
        }
      </AnimatePresence>
      </>,
      document.body
      );
      }