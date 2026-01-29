import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public data: QuestionComment[] = [];

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
    const questionComments = this.data
      .filter((questionComment) => questionComment.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findById(id: string): Promise<QuestionComment | null> {
    return this.data.find(comment => comment.id.toString() === id) ?? null;
  }

  async create(comment: QuestionComment): Promise<void> {
    this.data.push(comment);
  }

  async delete(comment: QuestionComment): Promise<void> {
    const commentIndex = this.data.findIndex(item => item.id === comment.id);
    this.data.splice(commentIndex, 1);
  }
}