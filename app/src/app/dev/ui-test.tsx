// Schermata di verifica dello strato di compatibilità (classi Tailwind, font, icone).
import { Div, Span, Btn } from '../../ui/html';
import { Star, Gem, UserPlus, MoreVertical } from '../../ui/icons.generated';

export default function UiTest() {
  return (
    <Div className="flex-1 bg-background p-4 gap-3">
      <Div className="text-sm text-muted-foreground">Testo ereditato dal contenitore</Div>
      <Div className="flex flex-row items-center gap-1">
        <Span className="font-semibold text-sm">Sofia Colombo</Span>
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <Span className="inline-flex items-center gap-0.5 text-xs font-bold text-cyan-300">
          <Gem className="w-3 h-3" />10.0
        </Span>
      </Div>
      <Btn className="h-7 px-2 text-green-400 text-xs flex-row items-center gap-1" onClick={() => {}}>
        <UserPlus className="w-3.5 h-3.5" />
      </Btn>
      <Div className="rounded-xl border border-border bg-card p-4 text-primary font-bold text-2xl">€6.878</Div>
      <MoreVertical className="w-4 h-4 text-muted-foreground" />
    </Div>
  );
}
