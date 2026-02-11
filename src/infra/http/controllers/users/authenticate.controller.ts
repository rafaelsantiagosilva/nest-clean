import { WrongCredentialsError } from "@/domain/forum/application/usecases/errors/wrong-credentials-error";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/usecases/students/authenticate-students";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import z from "zod";

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string()
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const result = await this.authenticateStudent.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch(error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}