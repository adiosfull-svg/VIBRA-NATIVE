// jsPDF con doc.save() che sul telefono salva il PDF e apre la condivisione (sul web: jspdf.web.ts).
// La libreria si carica solo al primo `new jsPDF(...)` (cioè quando si esporta): all'avvio della
// Dashboard non serve, e i suoi moduli usano API del browser (es. TextDecoder('latin1') in fast-png).
import type { jsPDF as JsPDFType } from 'jspdf';
import { saveBase64File } from './files';

type Ctor = typeof JsPDFType;

function loadJsPDF(): Ctor {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require('jspdf') as { jsPDF: Ctor }).jsPDF;
}

/** Usato con `new jsPDF(options)` come la libreria: il costruttore restituisce il documento vero. */
export const jsPDF = function jsPDF(...args: ConstructorParameters<Ctor>) {
  const Base = loadJsPDF();
  const doc = new Base(...args);
  doc.save = ((filename = 'documento.pdf') => {
    const base64 = String(doc.output('datauristring')).replace(/^data:[^,]*,/, '');
    void saveBase64File(filename, base64, 'application/pdf');
    return doc;
  }) as typeof doc.save;
  return doc;
} as unknown as Ctor;

export default jsPDF;
