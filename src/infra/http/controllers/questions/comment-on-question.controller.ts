import { CommentOnQuestionUseCase } from "@/domain/forum/application/usecases/questions/comment-on-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const commentOnQuestionBodySchema = z.object({
  content: z.string()
});

type CommentOnQuestionBody= z.infer<typeof commentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

@Controller("/questions")
export class CommentOnQuestionController {
  constructor(
    private commentOnQuestion: CommentOnQuestionUseCase
  ) {}

  @Post("/comment/:questionId")
  async handle(
    @Param("questionId") questionId: string,
    @Body(bodyValidationPipe) body: CommentOnQuestionBody,
    @CurrentUser() user: UserPayload
  ){
    const result = await this.commentOnQuestion.execute({
      authorId: user.sub.toString(),
      content: body.content,
      questionId: questionId
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}