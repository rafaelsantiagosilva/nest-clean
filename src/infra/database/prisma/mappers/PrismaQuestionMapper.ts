import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion } from "generated/prisma/client";

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create({
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      authorId: new UniqueEntityId(raw.authorId)
    }, new UniqueEntityId(raw.id));
  }
}