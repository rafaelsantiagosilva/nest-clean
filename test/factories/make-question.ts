import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question, type QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId
) {
  const question = Question.create({
    authorId: new UniqueEntityId(),
    title: faker.word.words(3).toUpperCase(),
    content: faker.lorem.text(),
    ...override
  }, id);

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaQuestion(data: Partial<QuestionProps> = {}) {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: {
        id: question.id.toString(),
        authorId: question.authorId.toString(),
        title: question.title,
        content: question.content,
        slug: question.slug.value,
      },
    });

    return question;
  }
}