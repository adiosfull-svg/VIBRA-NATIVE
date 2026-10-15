// Route /clienti → pagina portata da src/pages/Clienti.jsx dentro la cornice di AppLayout.
import { memo } from 'react';
import ClientiPage from '../../../web/pages/Clienti';
import Page from '../../../web/components/layout/Page';

// memo: al focus della tab (anche precaricata) react-navigation ridisegna lo schermo; la pagina, senza
// props, non va ridisegnata per questo (era l'intera pagina a ogni cambio tab)
const Clienti = memo(ClientiPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <Clienti />
  </Page>
);

export default function ClientiRoute() {
  return SCREEN;
}
