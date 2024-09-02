import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreateCatDto, CreateCatDtoSchema } from './create-cat.dto';
import { catDToValidatorPipe } from './catDTOValidator.pipe';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PdfValidatorPipe } from './pdfValidator.pipe';
import {Response} from 'express'
import { createReadStream } from 'fs';
import { join } from 'path';
@Controller('first')
export class AppController {
  constructor(private readonly pdfService: PdfService) {}


  @Post('upload') 
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@UploadedFiles(PdfValidatorPipe) files: Express.Multer.File[],@Res() res: Response) {
    const pdfBuffer:Uint8Array[]= files.map(file=>file.buffer);
    const answer = (await this.pdfService.mergePdfs(pdfBuffer));
     res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      });

    return res.send(Buffer.from(answer))
    
  }
}
