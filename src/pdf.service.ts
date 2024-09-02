import { Injectable } from '@nestjs/common';
import {PDFDocument } from 'pdf-lib';

@Injectable()
export class PdfService {
        public async  mergePdfs(pdfBuffers:Uint8Array[]): Promise<Uint8Array> {
            const mergePdf =await PDFDocument.create();
            for(const pdfBuffer of pdfBuffers) {
                const pdfDoc = await PDFDocument.load(pdfBuffer);
                const pdfPages =await mergePdf.copyPages(pdfDoc,pdfDoc.getPageIndices());
                pdfPages.forEach((page)=>mergePdf.addPage(page));

            }
            const mergedPdfBytes = await mergePdf.save();
            return mergedPdfBytes;
        }
}
