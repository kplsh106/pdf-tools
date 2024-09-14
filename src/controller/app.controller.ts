import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PdfService } from '../service/pdf.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PdfArrayValidatorPipe } from '../pipes/pdf-validation/PdfArray.validation.pipe'
import {Response} from 'express'
import { PdfSingleValidatorPipe } from '../pipes/pdf-validation/PdfSingle.validation.pipe';
import {QueryInteger}  from '../pipes/common/QueryInteger.transform.pipe';
import { join } from 'path';
import { unlink, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
@Controller()
export class AppController {
  constructor(private readonly pdfService: PdfService) {}


  @Post('mergePdf') 
  @UseInterceptors(FilesInterceptor('file'))
  async mergePdfs(@UploadedFiles(PdfArrayValidatorPipe) files: Express.Multer.File[],@Res() res: Response) {
    const pdfBuffer:Uint8Array[]= files.map(file=>file.buffer);
    const answer = (await this.pdfService.mergePdfs(pdfBuffer));
     res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      });

    return res.send(Buffer.from(answer))
    
  }
  @Post('splitPdf')
  @UseInterceptors(FileInterceptor('file'))
  async splitPdf(@UploadedFile(PdfSingleValidatorPipe) file:Express.Multer.File,  @Query(QueryInteger) pagesToRemove: number[], @Res() res: Response) {
    console.log("the following is the query ",typeof pagesToRemove);
    const answer = (await this.pdfService.removePages(file.buffer,pagesToRemove))

     res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      });

    return res.send(Buffer.from(answer))
  }

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertPptToPdf(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const execPromise = promisify(exec);
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Create a unique timestamp
    const timestamp = Date.now();
    const originalFilename = file.originalname.split('.')[0];
    const fileExtension = file.originalname.split('.').pop();
    const inputFileName = `${originalFilename}-${timestamp}.${fileExtension}`;
    const inputFilePath = join(__dirname, inputFileName);
    const outputFileName = `${originalFilename}-${timestamp}.pdf`;
    const outputFilePath = join(__dirname, outputFileName);

    // Save the uploaded file to the filesystem
    await writeFile(inputFilePath, file.buffer);

    // Convert the file to PDF using unoconv
    try {
      await execPromise(`unoconv -f pdf ${inputFilePath}`);
    } catch (error) {
      // Clean up if conversion fails
      await unlink(inputFilePath);
      throw new HttpException('Error converting file to PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
     res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${originalFilename}.pdf "`,
      });

    // Read and send the generated PDF
    res.sendFile(outputFilePath, {}, async (err) => {
      // Clean up files after sending
      await unlink(inputFilePath);
      await unlink(outputFilePath);
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  }
}
