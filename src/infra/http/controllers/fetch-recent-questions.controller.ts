import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/fetch-recent-questions";
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Controller, Get, InternalServerErrorException, Query, UseGuards } from "@nestjs/common";
import z from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z.string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(
    z.number().min(1)
  );

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/recent")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) { }

  @Get()
  async handle(@Query("page", queryValidationPipe) page: number) {
    const result = await this.fetchRecentQuestions.execute({
      page
    });

    if (result.isLeft())
      throw new InternalServerErrorException();

    const questions = result.value.questions;

    return { 
      questions: questions.map((question) => QuestionPresenter.toHTTP(question)) 
    };
  }
}