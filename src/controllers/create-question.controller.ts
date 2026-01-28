import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user.decorator";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { TokenSchema as UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
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

    console.log("> Create Question Controller: ");
    console.log(userId);
    console.log(body);

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