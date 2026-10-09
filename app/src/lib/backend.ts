/** Quale backend usa l'app: 'base44' (vero, predefinito) o 'local' (stack di prova, EXPO_PUBLIC_BACKEND=local). */
export const BACKEND: 'base44' | 'local' = process.env.EXPO_PUBLIC_BACKEND === 'local' ? 'local' : 'base44';
