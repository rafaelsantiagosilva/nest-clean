import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Answer as PrismaAnswer } from "generated/prisma/client";
import { AnswerUncheckedCreateInput } from "generated/prisma/models";

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create({
      authorId: new UniqueEntityId(raw.authorId),
      content: raw.content,
      questionId: new UniqueEntityId(raw.questionId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(answer: Answer): AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      questionId: answer.questionId.toString(),
      bestAnswerOn: {
        connect: {
          id: answer.questionId.toString()
        }
      },
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt
    }
  }
}