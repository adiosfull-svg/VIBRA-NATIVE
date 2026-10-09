// Port di src/components/shared/PageTitle.jsx (convertito da scripts/port/codemod.mjs).
import { useLayoutEffect } from 'react';
import { useSetPageTitle } from '@/web/lib/stickyHeaderContext';

/**
 * Non disegna più il titolone nella pagina: registra il nome della sezione, che viene
 * mostrato al centro dell'intestazione compatta in AppLayout (stile Instagram).
 * Le pagine continuano a usare <PageTitle title="..." /> esattamente come prima.
 * useLayoutEffect + cleanup: al cambio rotta il titolo vecchio viene sostituito dal nuovo
 * nello stesso commit, senza flash.
 */
export default function PageTitle({ title }) {
  const setTitle = useSetPageTitle();
  useLayoutEffect(() => {
    setTitle(title);
    return () => setTitle('');
  }, [title, setTitle]);
  return null;
}