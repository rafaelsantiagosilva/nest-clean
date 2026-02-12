import { DeleteQuestionUseCase } from "@/domain/forum/application/usecases/questions/delete-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { Controller, Delete, HttpCode, HttpException, HttpStatus, Param } from "@nestjs/common";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/questions")
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) { }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    const result = await this.deleteQuestion.execute({ id, authorId: user.sub.toString() });

    if (result.isLeft()) {
      throw new HttpException(result.value, HttpStatus.BAD_REQUEST);
    }

    return;
  }
}