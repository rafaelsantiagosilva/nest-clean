import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/usecases/questions/fetch-question-comments";
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

@Controller("/questions")
export class FetchQuestionCommentsControllers {
  constructor(
    private fetchQuestionComments: FetchQuestionCommentsUseCase
  ) { }

  @Get("/:questionId/comments")
  async handle(
    @Param("questionId") questionId: string,
    @Query("page", queryValidationPipe) page: number
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      comments: result.value.questionComments
    }
  }
}