/** `data-[state=active]:x` / `data-[state=inactive]:x` dell'originale: `x` se lo stato combacia, altrimenti via. */
const DATA_STATE = /(^|\s)data-\[state=(active|inactive)\]:(\S+)/g;
export function resolveDataState(className: string | undefined, on: boolean): string | undefined {
  if (!className || !className.includes('data-[state=')) return className;
  return className.replace(DATA_STATE, (_, sp: string, st: string, cls: string) => ((st === 'active') === on ? sp + cls : sp)).replace(/\s+/g, ' ').trim();
}
