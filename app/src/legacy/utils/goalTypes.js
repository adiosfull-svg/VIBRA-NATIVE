// PORT: icone dallo stesso set dell'app (ui/icons.generated, lucide 0.475 come l'originale): lucide-react-native
// caricava tutto il pacchetto (~1,6 MB, 1884 moduli) e le sue icone ignoravano className (24 px, colore sbagliato)
import { Euro, Table2, Music2, Trophy, Crown } from '@/ui/icons.generated';
import { InstagramIcon as Instagram } from '../../components/InstagramIcon';

export const GOAL_TYPES = [
  { key: 'fatturato', label: 'Fatturato (€)', icon: Euro, color: 'text-primary' },
  { key: 'tavoli', label: 'Tavoli da chiudere', icon: Table2, color: 'text-primary' },
  { key: 'clienti_instagram', label: 'Nuovi clienti Instagram', icon: Instagram, color: 'text-pink-400' },
  { key: 'clienti_tiktok', label: 'Nuovi clienti TikTok', icon: Music2, color: 'text-cyan-400' },
  { key: 'achievement', label: 'Sblocco Achievement', icon: Trophy, color: 'text-yellow-400' },
  { key: 'rank', label: 'Raggiungimento Rango', icon: Crown, color: 'text-violet-400' },
];

export function getGoalTypeMeta(key) {
  return GOAL_TYPES.find(t => t.key === key) || GOAL_TYPES[0];
}