import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Comment as PrismaComment } from "generated/prisma/client";
import { CommentUncheckedCreateInput } from "generated/prisma/models";

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId)
      throw new Error("Invalid comment type");

    return QuestionComment.create({
      questionId: new UniqueEntityId(raw.questionId),
      authorId: new UniqueEntityId(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(comment: QuestionComment): CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      questionId: comment.questionId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }
  }
}