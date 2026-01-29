import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { InMemoryAnswerAttachmentsRepository } from "./in-memory-answer-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryAnswersRepository implements AnswersRepository {
  public data: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  ) { }

  async findById(id: string): Promise<Answer | null> {
    return this.data.find((answer) => answer.id.toString() === id) ?? null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
    const answers = this.data
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async create(answer: Answer): Promise<void> {
    this.data.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.data.findIndex((item) => item.id === answer.id);
    this.data[answerIndex] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.data.findIndex((item) => item.id === answer.id);
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
    this.data.splice(answerIndex, 1);
  }
}