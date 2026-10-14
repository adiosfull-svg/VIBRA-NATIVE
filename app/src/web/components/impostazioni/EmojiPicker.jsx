// Port di src/components/impostazioni/EmojiPicker.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useRef, useEffect } from 'react';

import { doc as webDocument } from '@/web/shims/dom';
import { Btn, Div } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const EMOJI_CATEGORIES = [
  { label: 'Smileys', emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'] },
  { label: 'Gesti', emojis: ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','🦷','🦴','👀','👁','👅','👄','💋','🩸'] },
  { label: 'Persone', emojis: ['👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🤱','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','💆','💇','🚶','🧍','🧎','🏃','💃','🕺','🕴️','👯','🧖','🧗','🏌️','🏇','🧘','🛀','🛌'] },
  { label: 'Animali', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿','🦔'] },
  { label: 'Cibo', emojis: ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🫒','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🧄','🧅','🥔','🍠','🫘','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🌮','🌯','🫔','🥙','🧆','🥚','🍲','🫕','🍜','🍝','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🧃','🥤','🧋','🍵','☕','🫖','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🫗'] },
  { label: 'Viaggi', emojis: ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍','🛵','🚲','🛴','🛹','🛼','🚏','🛣','🛤','⛽','🚨','🚥','🚦','🛑','🚧','⚓','⛵','🚤','🛥','🛳','⛴','🚢','✈️','🛩','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🛰','🚀','🛸','🌍','🌎','🌏','🧭','🗺','🏔','⛰','🌋','🗻','🏕','🏖','🏜','🏝','🏞','🏟','🏛','🏗','🧱','🏘','🏚','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩','🕋','⛲','⛺','🌁','🌃','🏙','🌄','🌅','🌆','🌇','🌉','♨️','🎠','🎡','🎢','💈','🎪'] },
  { label: 'Attività', emojis: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🥊','🥋','🎽','🛹','🛼','🛷','⛸','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🎿','🛷','🥌','🪃','🪄','🎮','🕹','🎲','🧩','♟️','🧸','🪅','🎭','🖼','🎨','🧵','🪡','🧶','🪢','👓','🕶','🥽','🦺','👔','👕','👖','🧣','🧤','🧥','🧦','👗','👘','🥻','🩱','🩲','🩳','👙','👚','👛','👜','👝','🛍','🎒','🩴','👞','👟','🥾','🥿','👠','👡','🩰','👢','👑','👒','🎩','🎓','🪖','⛑','💄','💍','💎'] },
  { label: 'Oggetti', emojis: ['📱','💻','⌨️','🖥','🖨','🖱','🖲','💾','💿','📀','📷','📸','📹','🎥','📽','🎞','📞','☎️','📟','📠','📺','📻','🧭','⏱','⏲','⏰','🕰','⌚','📡','🔋','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','🪙','💰','💳','💎','⚖️','🧲','🪜','🔧','🔨','⚒️','🛠','⛏','🪚','🔩','🪛','🔗','🧰','🪤','🧱','💣','🔫','🪃','🏹','🛡','🪝','🔪','🗡','⚔️','🛒','🎁','🎀','🎊','🎉','🎈','🎏','🎐','🧧','🎑','🎍','🎎','🎃','🎄','🎆','🎇','🧨','✨','🎋','🎁','🛍'] },
  { label: 'Simboli', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔱','📛','🔰','♻️','✅','❇️','✳️','❎'] },
];

// Mappa emoji → parole chiave italiane per la ricerca semantica
const EMOJI_KEYWORDS = {
  '❤️': 'cuore amore rosso', '🧡': 'cuore arancione', '💛': 'cuore giallo',
  '💚': 'cuore verde', '💙': 'cuore blu', '💜': 'cuore viola',
  '🖤': 'cuore nero', '🤍': 'cuore bianco', '🤎': 'cuore marrone',
  '💔': 'cuore spezzato rotto amore', '❣️': 'cuore esclamazione',
  '💕': 'cuori doppi amore', '💞': 'cuori rotanti', '💓': 'cuore battente',
  '💗': 'cuore rosa', '💖': 'cuore brillante', '💘': 'cuore freccia',
  '💝': 'cuore fiocco regalo', '😀': 'sorriso felice contento',
  '😂': 'risata lacrime divertente', '🤣': 'risata rotolante',
  '😍': 'innamorato amore occhi cuore', '🥰': 'amore cuori sorriso',
  '😎': 'occhiali da sole figo', '😭': 'pianto tristezza',
  '😡': 'arrabbiato rabbia', '🤬': 'rabbia parolaccia',
  '👍': 'pollice su ok bene', '👎': 'pollice giù no male',
  '💪': 'muscolo forza braccio', '🙏': 'preghiera grazie mani',
  '👏': 'applauso bravo mani', '🤝': 'stretta mano accordo',
  '🎉': 'festa celebrazione coriandoli', '🎊': 'festa palloncini',
  '🎈': 'palloncino festa', '🎁': 'regalo dono',
  '🏆': 'trofeo vincitore primo', '🥇': 'medaglia oro primo',
  '⭐': 'stella', '✨': 'stelle scintillio magico',
  '🔥': 'fuoco fiamma caldo', '💥': 'esplosione boom',
  '🌟': 'stella lucente', '💫': 'stella girante',
  '🍕': 'pizza cibo', '🍔': 'hamburger cibo',
  '🍺': 'birra alcol', '🍷': 'vino rosso',
  '🥂': 'brindisi champagne spumante', '🍾': 'bottiglia champagne',
  '🚗': 'macchina auto', '✈️': 'aereo volo viaggio',
  '🏖️': 'spiaggia mare vacanza', '🌍': 'mondo terra',
  '📱': 'telefono cellulare smartphone', '💻': 'computer laptop',
  '💰': 'soldi denaro ricco', '💵': 'banconota dollaro',
  '🏠': 'casa home', '🏢': 'palazzo ufficio',
  '👶': 'bambino neonato', '👨': 'uomo persona',
  '👩': 'donna persona', '👴': 'anziano nonno',
  '🐶': 'cane animale', '🐱': 'gatto animale',
  '🌹': 'rosa fiore', '🌸': 'fiori primavera',
  '🌙': 'luna notte', '☀️': 'sole giorno',
  '⚡': 'fulmine energia elettrico', '❄️': 'neve freddo inverno',
  '🎵': 'musica nota', '🎶': 'musica note',
  '👑': 'corona re regina', '💎': 'diamante gioiello prezioso',
  '🔑': 'chiave', '🔒': 'lucchetto chiuso',
  '📸': 'foto fotografia camera', '🎬': 'cinema film',
  '⚽': 'calcio pallone sport', '🏀': 'basket sport',
  '🎯': 'bersaglio obiettivo', '🏆': 'trofeo premio',
};

const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(c => c.emojis);

export default function EmojiPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  // Chiudi cliccando fuori dal picker
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    webDocument.addEventListener('mousedown', handler);
    webDocument.addEventListener('touchstart', handler);
    return () => {
      webDocument.removeEventListener('mousedown', handler);
      webDocument.removeEventListener('touchstart', handler);
    };
  }, [onClose]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return null;
    // Cerca prima nelle parole chiave italiane, poi mostra tutte come fallback
    const matched = ALL_EMOJIS.filter(em => {
      const kw = EMOJI_KEYWORDS[em] || '';
      return kw.toLowerCase().includes(term);
    });
    return matched.length > 0 ? matched : ALL_EMOJIS;
  }, [search]);

  const displayEmojis = filtered || EMOJI_CATEGORIES[activeCategory]?.emojis || [];

  return (
    <Div ref={containerRef} className="rounded-xl border border-border bg-card shadow-xl overflow-hidden w-72">
      {/* Search */}
      <Div className="px-3 pt-3 pb-2 border-b border-border">
        <HtmlInput
          ref={searchRef}
          type="text"
          placeholder="Cerca emoji... (es. cuore, fuoco)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-secondary/40 text-sm rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </Div>

      {/* Category tabs */}
      {!search && (
        <Div
          className="flex px-2 py-1.5 gap-1 border-b border-border overflow-x-auto"
          style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
        >
          {EMOJI_CATEGORIES.map((cat, i) => (
            <Btn
              button
              key={i}
              onClick={() => setActiveCategory(i)}
              className={`shrink-0 text-[10px] px-2 py-1 rounded-lg transition-colors ${activeCategory === i ? 'bg-primary/20 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary/50'}`}
            >
              {cat.label}
            </Btn>
          ))}
        </Div>
      )}

      {/* Emoji grid */}
      <Div className="grid grid-cols-8 gap-0.5 p-2 max-h-48 overflow-y-auto">
        {displayEmojis.map((em, i) => (
          <Btn
            button
            key={i}
            onClick={() => { onSelect(em); onClose(); }}
            className="w-8 h-8 text-lg flex items-center justify-center rounded-lg hover:bg-secondary/60 transition-colors"
            accessibilityLabel={EMOJI_KEYWORDS[em] || em}
          >
            {em}
          </Btn>
        ))}
        {filtered && filtered.length === 0 && (
          <Div className="col-span-8 py-4 text-center text-xs text-muted-foreground">
            Nessun risultato
          </Div>
        )}
      </Div>
    </Div>
  );
}