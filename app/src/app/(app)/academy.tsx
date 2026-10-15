// Route /academy → pagina portata da src/pages/VibraAcademy.jsx.
import { memo } from 'react';
import VibraAcademyPage from '../../web/pages/VibraAcademy';
import Page from '../../web/components/layout/Page';

const VibraAcademy = memo(VibraAcademyPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <VibraAcademy />
  </Page>
);

export default function VibraAcademyRoute() {
  return SCREEN;
}
