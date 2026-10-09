// Port di src/lib/query-client.js: stessa istanza/opzioni condivise da tutta l'app.
import { queryClient } from '../../lib/queryClient';

export const queryClientInstance = queryClient;
export const STALE_FULL_TABLE = 10 * 60000;
export const GC_FULL_TABLE = 30 * 60000;

export function invalidateFullTables(qc: typeof queryClient) {
  qc.invalidateQueries({ queryKey: ['attendances-all'], refetchType: 'none' });
  qc.invalidateQueries({ queryKey: ['clients-all'], refetchType: 'none' });
}
