import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { DomainEvent } from "@/core/events/domain-event";
import type { Question } from "../entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  ocurredAt: Date;

  constructor(
    public question: Question,
    public bestAnswerId: UniqueEntityId
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id;
  }
}