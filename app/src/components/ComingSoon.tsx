// Segnaposto per le sezioni non ancora portate dall'app web: stessa cornice (intestazione,
// contenuto) delle pagine vere.
import Page from '../web/components/layout/Page';
import { Div, P } from '../ui/html';
import { Clock } from '../ui/icons.generated';

export function ComingSoon({ title, source }: { title?: string; source?: string }) {
  return (
    <Page title={title}>
      <Div className="items-center justify-center py-24 px-6">
        <Clock className="w-8 h-8 text-muted-foreground" />
        <P className="text-sm text-muted-foreground text-center mt-3">Sezione in fase di porting dall'app web.</P>
        {source ? <P className="text-[11px] text-muted-foreground/60 mt-2">{source}</P> : null}
      </Div>
    </Page>
  );
}
