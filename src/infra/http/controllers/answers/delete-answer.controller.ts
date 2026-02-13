import { DeleteAnswerUseCase } from "@/domain/forum/application/usecases/answers/delete-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from "@nestjs/common";

@Controller("/answers")
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) { }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param("id") id: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteAnswer.execute({
      id,
      authorId: user.sub.toString()
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }

    return;
  }
}