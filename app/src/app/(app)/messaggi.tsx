// Route /messaggi → pagina portata da src/pages/Messaggi.jsx.
import { memo } from 'react';
import MessaggiPage from '../../web/pages/Messaggi';
import Page from '../../web/components/layout/Page';

const Messaggi = memo(MessaggiPage);

export default function MessaggiRoute() {
  return (
    <Page>
      <Messaggi />
    </Page>
  );
}
