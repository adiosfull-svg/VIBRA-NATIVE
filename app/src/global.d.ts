// Import del CSS globale di NativeWind (gestito dal bundler).
declare module '*.css';

// recharts-scale (stesso calcolo dei tick di recharts 2.x), senza tipi propri
declare module 'recharts-scale' {
  export function getNiceTickValues(domain: [number, number], tickCount?: number, allowDecimals?: boolean): number[];
  export function getTickValuesFixedDomain(domain: [number, number], tickCount?: number, allowDecimals?: boolean): number[];
}
