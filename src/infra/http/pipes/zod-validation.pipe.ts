import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodObject, ZodPipe } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any> | ZodPipe) { }

  transform(value: unknown) {
    const { data, success, error } = this.schema.safeParse(value);

    if (!success)
      throw new BadRequestException({
        errors: fromZodError(error),
        message: error.message
      });

    return data;
  }
}