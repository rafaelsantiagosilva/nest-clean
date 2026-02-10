import { StudentAlreadyExistsError } from "@/domain/forum/application/usecases/errors/student-already-exists-error";
import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/students/register-student";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, ConflictException, Controller, InternalServerErrorException, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string().min(5),
  email: z.email(),
  password: z.string().min(6),
});

type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() data: CreateAccountBody) {
    const { name, email, password } = createAccountBodySchema.parse(data);

    const result = await this.registerStudent.execute({
      name,
      email,
      password
    });

    if (result.isLeft()) {
      const error = result.value;

      switch(error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}