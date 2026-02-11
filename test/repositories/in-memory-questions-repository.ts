import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import type { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public data: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  ) { }

  async findById(id: string): Promise<Question | null> {
    return this.data.find((question) => question.id.toString() === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.data.find((question) => question.slug.value === slug) ?? null;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.data
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question): Promise<void> {
    this.data.push(question);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.data.findIndex((item) => item.id === question.id);
    this.data[questionIndex] = question;
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.data.findIndex((item) => item.id === question.id);
    this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
    this.data.splice(questionIndex, 1);
  }
}