import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public data: AnswerComment[] = [];

  async findById(id: string): Promise<AnswerComment | null> {
    return this.data.find(comment => comment.id.toString() === id) ?? null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    const answerComments = this.data
      .filter((questionComment) => questionComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async create(comment: AnswerComment): Promise<void> {
    this.data.push(comment);
  }

  async delete(comment: AnswerComment) {
    const commentIndex = this.data.findIndex(item => item.id === comment.id);
    this.data.splice(commentIndex, 1);
  }
}