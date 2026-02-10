import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/students/register-student";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Body, Controller, InternalServerErrorException, Post, UsePipes } from "@nestjs/common";
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
      throw new InternalServerErrorException();
    }
  }
}