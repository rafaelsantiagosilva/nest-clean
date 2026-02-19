import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/usecases/answers/delete-answer-comment";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/answers")
export class DeleteAnswerCommentController {
  constructor(
    private deleteAnswerComment: DeleteAnswerCommentUseCase
  ) {}

  @Delete("/comment/:commentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param("commentId") commentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteAnswerComment.execute({
      id: commentId,
      authorId: user.sub.toString()
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}