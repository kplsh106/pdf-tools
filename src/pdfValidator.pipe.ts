import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class PdfValidatorPipe implements PipeTransform {
     transform(value: any, metadata: ArgumentMetadata): Express.Multer.File[] {
        try {
            const files:Express.Multer.File[] = value;
            if(!files||files.length==0) {
                throw new BadRequestException('file is required');
            }
            files.forEach(file=> {
                if(file.mimetype!=='application/pdf') {
                    throw new BadRequestException('File ${file.originalname} is not a pdf');
                }
                const extension =file.originalname.split('.').pop().toLowerCase();
                if(extension!=='pdf') {
                    throw new BadRequestException('File ${file.originalname} is not a pdf');
                }
            })
            console.log("the pdf seems to be correct")
            return files;
        } catch(error)  {
            throw new BadRequestException(error);
        }
     }

}