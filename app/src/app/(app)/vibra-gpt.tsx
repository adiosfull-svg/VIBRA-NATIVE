// Route /vibra-gpt → pagina portata da src/pages/VibraGPT.jsx.
import { memo } from 'react';
import VibraGPTPage from '../../web/pages/VibraGPT';
import Page from '../../web/components/layout/Page';

const VibraGPT = memo(VibraGPTPage);

export default function VibraGPTRoute() {
  return (
    <Page>
      <VibraGPT />
    </Page>
  );
}
