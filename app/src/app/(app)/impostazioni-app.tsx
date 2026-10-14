// Route /impostazioni-app → pagina portata da src/pages/ImpostazioniApp.jsx (RoleGate "admin-console").
import { memo } from 'react';
import ImpostazioniAppPage from '../../web/pages/ImpostazioniApp';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const ImpostazioniApp = memo(ImpostazioniAppPage);

export default function ImpostazioniAppRoute() {
  return (
    <Page>
      <RoleGate routeName="admin-console">
        <ImpostazioniApp />
      </RoleGate>
    </Page>
  );
}
