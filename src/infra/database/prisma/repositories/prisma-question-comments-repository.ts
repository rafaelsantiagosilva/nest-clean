import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/PrismaQuestionCommentMapper";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id
      }
    });

    if (!comment)
      return null;

    return PrismaQuestionCommentMapper.toDomain(comment);
  }

  async findManyByQuestionId(questionId: string, {page}: PaginationParams): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        questionId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (page - 1) * 20
    });

    return comments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async create(comment: QuestionComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(comment)
    }
    );
  }

  async delete(comment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString()
      }
    });
  }
}