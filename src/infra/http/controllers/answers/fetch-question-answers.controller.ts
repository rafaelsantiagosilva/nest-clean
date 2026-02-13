import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/usecases/answers/fetch-question-answers";
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
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase
  ) { }

  @Get("/:questionId/answers")
  async handle(
    @Param("questionId") questionId: string,
    @Query("page", queryValidationPipe) page: number
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      questionId,
      page
    });

    if (result.isLeft())
      throw new BadRequestException();

    return {
      answers: result.value.answers
    }
  }
}