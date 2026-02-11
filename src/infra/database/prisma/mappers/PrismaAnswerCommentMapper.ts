import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Comment as PrismaComment } from "generated/prisma/client";
import { CommentUncheckedCreateInput } from "generated/prisma/models";

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId)
      throw new Error("Invalid comment type");

    return AnswerComment.create({
      answerId: new UniqueEntityId(raw.answerId),
      authorId: new UniqueEntityId(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(comment: AnswerComment): CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      answerId: comment.answerId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }
  }
}