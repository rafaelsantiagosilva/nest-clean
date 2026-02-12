import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment, type AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/PrismaAnswerCommentMapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  const answer = AnswerComment.create({
    authorId: new UniqueEntityId(),
    answerId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override
  }, id);

  return answer;
}

export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}) {
    const comment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}