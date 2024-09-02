import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
export class catDToValidatorPipe implements PipeTransform {
     constructor(private schema: ZodSchema) {
     }
     transform(value: any, metadata: ArgumentMetadata) {
        try {
            const parsedvalue=this.schema.parse(value);
            return parsedvalue;
        } catch(error)  {
            throw new BadRequestException(error);
        }
     }

}