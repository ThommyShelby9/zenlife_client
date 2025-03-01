// Créer un fichier types/jspdf-autotable.d.ts dans votre projet avec ce contenu:

import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    internal: jsPDFInternal;
  }

  interface jsPDFInternal {
    getNumberOfPages: () => number;
    pageSize: {
      width: number;
      height: number;
      getWidth: () => number;
      getHeight: () => number;
    };
    pages: any[];
    events: any;
    scaleFactor: number;
    getEncryptor: (objectId: number) => (data: string) => string;
  }
}
