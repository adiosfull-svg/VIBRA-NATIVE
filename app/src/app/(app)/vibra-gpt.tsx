// Route /vibra-gpt → pagina portata da src/pages/VibraGPT.jsx.
import { memo } from 'react';
import VibraGPTPage from '../../web/pages/VibraGPT';
import Page from '../../web/components/layout/Page';

const VibraGPT = memo(VibraGPTPage);

// Elemento della schermata costruito una volta: a ogni navigazione expo-router ridisegna le route montate
// (anche le tab precaricate) e un elemento nuovo faceva ridisegnare Page (e il suo header) in ognuna; con
// lo stesso elemento React salta Page e tutta la pagina (docs/REGOLE-PRESTAZIONI.md §4).
const SCREEN = (
  <Page>
    <VibraGPT />
  </Page>
);

export default function VibraGPTRoute() {
  return SCREEN;
}
