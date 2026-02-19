import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/usecases/questions/delete-question-comment";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/questions")
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionComment: DeleteQuestionCommentUseCase
  ) {}

  @Delete("/comment/:commentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param("commentId") commentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteQuestionComment.execute({
      authorId: user.sub.toString(),
      id: commentId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}