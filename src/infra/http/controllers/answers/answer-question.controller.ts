import { AnswerQuestionUseCase } from "@/domain/forum/application/usecases/answers/answer-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.uuid())
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

const answerQuestionValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller("/questions/:questionId")
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) { }

  @Post("/answers")
  async handle(
    @Param("questionId") questionId: string,
    @CurrentUser() user: UserPayload,
    @Body(answerQuestionValidationPipe) body: AnswerQuestionBodySchema
  ) {
    const result = await this.answerQuestion.execute({
      answerContent: body.content,
      questionId,
      instructorId: user.sub.toString(),
      attachmentsIds: body.attachmentsIds
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }

    return { answer: result.value.answer }
  }
}