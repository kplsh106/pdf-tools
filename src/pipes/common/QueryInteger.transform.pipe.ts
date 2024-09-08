import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryInteger implements PipeTransform {
  transform(value: Record<string, string>): number[] {
    const transformedValue: number[]=[];
    console.log("entering the query pipe")

    for (const [key, val] of Object.entries(value)) {
      const parsedValue:number= parseInt(val, 10);
      if (isNaN(parsedValue)) {
        throw new BadRequestException(`Query parameter '${key}' must be an integer.`);
      }
      transformedValue.push(parsedValue);
      console.log("the array is ",transformedValue)
    }

    return transformedValue;
  }
}
