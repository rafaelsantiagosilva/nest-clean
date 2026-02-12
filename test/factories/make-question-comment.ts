import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment, type QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/PrismaQuestionCommentMapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  const question = QuestionComment.create({
    authorId: new UniqueEntityId(),
    questionId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override
  }, id);

  return question;
}


export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(data: Partial<QuestionCommentProps> = {}) {
    const comment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}
