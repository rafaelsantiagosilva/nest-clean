import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/usecases/answers/fetch-answer-comments";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const pageQueryParamSchema = z.string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(
    z.number().min(1)
  );

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/answer")
export class FetchAnswerCommentsController {
  constructor(
    private fetchAnswerComments: FetchAnswerCommentsUseCase
  ) { }

  @Get("/:answerId/comments")
  async handle(
    @Param("answerId") answerId: string,
    @Query("page", queryValidationPipe) page: number
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      page
    });

    if (result.isLeft())
      throw new BadRequestException();

    return {
      comments: result.value.answerComments
    }
  }
}