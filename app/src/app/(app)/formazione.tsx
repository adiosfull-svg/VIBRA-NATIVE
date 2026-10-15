// Route /formazione → pagina portata da src/pages/Formazione.jsx.
import { memo } from 'react';
import FormazionePage from '../../web/pages/Formazione';
import Page from '../../web/components/layout/Page';

const Formazione = memo(FormazionePage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <Formazione />
  </Page>
);

export default function FormazioneRoute() {
  return SCREEN;
}
