import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/usecases/questions/choose-question-best-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";

@Controller("/questions")
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) { }

  @Patch("/answers/:bestAnswerId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param("bestAnswerId") bestAnswerId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.chooseQuestionBestAnswer.execute({
      answerId: bestAnswerId,
      authorId: user.sub.toString()
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }
  }
}
