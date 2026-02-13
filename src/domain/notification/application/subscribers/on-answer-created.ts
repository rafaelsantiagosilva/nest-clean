import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import type { SendNotificationUseCase } from "../usecases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name
    );
  }

  private async sendNewAnswerNotification({ answerId }: AnswerCreatedEvent) {
    const answer = await this.answersRepository.findById(answerId.toString());

    if (!answer) {
      throw new ResourceNotFoundError();
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question?.title.substring(0, 40).concat("...")}"`,
        content: answer.excerpt
      });
    }
  }
}