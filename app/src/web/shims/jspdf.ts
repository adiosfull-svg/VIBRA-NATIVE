// jsPDF con doc.save() che sul telefono salva il PDF e apre la condivisione (sul web: jspdf.web.ts).
import { jsPDF as BaseJsPDF } from 'jspdf';
import { saveBase64File } from './files';

export class jsPDF extends BaseJsPDF {
  save(filename = 'documento.pdf'): any {
    const base64 = String(this.output('datauristring')).replace(/^data:[^,]*,/, '');
    void saveBase64File(filename, base64, 'application/pdf');
    return this;
  }
}
export default jsPDF;
