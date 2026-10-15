// Route /messaggi → pagina portata da src/pages/Messaggi.jsx.
import { memo } from 'react';
import MessaggiPage from '../../web/pages/Messaggi';
import Page from '../../web/components/layout/Page';

const Messaggi = memo(MessaggiPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <Messaggi />
  </Page>
);

export default function MessaggiRoute() {
  return SCREEN;
}
