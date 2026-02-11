import { GetQuestionBySlugUseCase } from "@/domain/forum/application/usecases/questions/get-question-by-slug";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { QuestionPresenter } from "../../presenters/question-presenter";

@Controller("/questions")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) { }

  @Get("/:slug")
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug
    });

    if (result.isLeft())
      throw new BadRequestException();

    const question = result.value.question;
    return { question: QuestionPresenter.toHTTP(question) };
  }
}