import { EditQuestionUseCase } from "@/domain/forum/application/usecases/questions/edit-question";
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string()).optional(),
});

const editQuestionBodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const editQuestionParamsSchema = z.uuid();


@Controller("/questions")
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) { }

  @Patch("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param("id") id: string,
    @Body(editQuestionBodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.editQuestion.execute({
      id,
      title: body.title,
      content: body.content,
      attachmentsIds: [],
      authorId: user.sub
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return;
  }
}