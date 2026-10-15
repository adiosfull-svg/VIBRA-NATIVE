// Route /ricerca-ai → pagina portata da src/pages/RicercaAI.jsx.
import { memo } from 'react';
import RicercaAIPage from '../../web/pages/RicercaAI';
import Page from '../../web/components/layout/Page';

const RicercaAI = memo(RicercaAIPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <RicercaAI />
  </Page>
);

export default function RicercaAIRoute() {
  return SCREEN;
}
