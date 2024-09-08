import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class PdfSingleValidatorPipe implements PipeTransform {
     transform(value: any, metadata: ArgumentMetadata): Express.Multer.File {
        try {
            const file:Express.Multer.File = value;
            if(!file) {
                throw new BadRequestException('file is required');
            }
            if (file.mimetype !== 'application/pdf') {
                throw new BadRequestException('File ${file.originalname} is not a pdf');
            }
            const extension = file.originalname.split('.').pop().toLowerCase();
            if (extension !== 'pdf') {
                throw new BadRequestException('File ${file.originalname} is not a pdf');
            }
            console.log("the pdf seems to be correct")
            return file;
        } catch(error)  {
            throw new BadRequestException(error);
        }
     }

}