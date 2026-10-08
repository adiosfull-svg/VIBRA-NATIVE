import { Stack, useLocalSearchParams } from 'expo-router';
import { ComingSoon } from '../../../components/ComingSoon';

// Pagina generica per le sezioni del menu non ancora portate.
export default function Sezione() {
  const { name, title } = useLocalSearchParams<{ name: string; title?: string }>();
  return (
    <>
      <Stack.Screen options={{ title: title ?? name }} />
      <ComingSoon title={title ?? name} source={`route /${name}`} />
    </>
  );
}
