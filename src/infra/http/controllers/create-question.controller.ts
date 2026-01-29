import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard";
import { TokenSchema as UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import z from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string()
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBody,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const userId = user.sub;

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: title.toLocaleLowerCase().replaceAll(' ', '-').replaceAll('_', '- '),
        authorId: userId
      }
    });
  }
}