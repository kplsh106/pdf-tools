import { Injectable } from '@nestjs/common';
import {PDFDocument, PDFImage } from 'pdf-lib';
import sharp from 'sharp';
@Injectable()
export class PdfService {
  public async mergePdfs(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
    const mergePdf = await PDFDocument.create();
    for (const pdfBuffer of pdfBuffers) {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pdfPages = await mergePdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pdfPages.forEach((page) => mergePdf.addPage(page));

    }
    const mergedPdfBytes = await mergePdf.save();
    return mergedPdfBytes;
  }



  public async removePages(pdfBuffer: Uint8Array, pagesToRemove: number[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    // Get all the pages
    const totalPages = pdfDoc.getPageCount();
    const pagesToKeep = [];

    // Collect the pages to keep
    for (let i = 0; i < totalPages; i++) {
      if (!pagesToRemove.includes(i + 1)) { // Pages are 1-indexed for user clarity
        pagesToKeep.push(i);
      }
    }

    // Create a new PDF and add the pages to keep
    const newPdfDoc = await PDFDocument.create();
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToKeep);
    copiedPages.forEach((page) => {
      newPdfDoc.addPage(page);
    });

    // return the new PDF
    const newPdfBytes = await newPdfDoc.save();
    return newPdfBytes;
 

  }
 


}
