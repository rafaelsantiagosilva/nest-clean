import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion } from "generated/prisma/client";
import { QuestionUncheckedCreateInput } from "generated/prisma/models";

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create({
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      authorId: new UniqueEntityId(raw.authorId),
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(question: Question): QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      content: question.content,
      slug: question.slug.value,
      title: question.title,
    };
  }
}