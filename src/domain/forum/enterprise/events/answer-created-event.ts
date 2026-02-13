import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { DomainEvent } from "@/core/events/domain-event";

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public answerId: UniqueEntityId) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answerId;
  }
}