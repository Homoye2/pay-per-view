// src/types/jspdf-autotable.d.ts

import { jsPDF } from 'jspdf';

declare module 'jspdf-autotable' {
  interface AutoTableOptions {
    head: string[][];
    body: (string | undefined)[][];
    theme?: 'striped' | 'grid' | 'plain';
    startY?: number;
    margin?: { top?: number; bottom?: number; left?: number; right?: number };
    styles?: { [key: string]: any };
  }

  interface jsPDF {
    autoTable(options: AutoTableOptions): jsPDF;
  }
}
