import { CommentOnAnswerUseCase } from "@/domain/forum/application/usecases/answers/comment-on-answer";
import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";

const commentOnAnswerBodySchema = z.object({
  content: z.string()
});

type CommentOnAnswerBody = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller("/answers")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) { }

  @Post("/comment/:answerId")
  async handle(
    @Param("answerId") answerId: string,
    @Body(bodyValidationPipe) body: CommentOnAnswerBody,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.commentOnAnswer.execute({
      content: body.content,
      answerId: answerId,
      authorId: user.sub.toString()
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}