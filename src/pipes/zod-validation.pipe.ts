import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodObject } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) { }

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