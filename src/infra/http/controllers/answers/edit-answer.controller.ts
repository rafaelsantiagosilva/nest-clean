import { EditAnswerUseCase } from "@/domain/forum/application/usecases/answers/edit-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.uuid()).optional()
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const editAnswerValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

@Controller("/answers")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) { }

  @Patch("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(editAnswerValidationPipe) body: EditAnswerBodySchema,
    @Param("id") id: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.editAnswer.execute({
      id,
      content: body.content,
      attachmentsIds: body.attachmentsIds ?? [],
      authorId: user.sub.toString()
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }

    return;
  }
}