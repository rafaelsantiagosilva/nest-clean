import { right, type Either } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";
import type { NotificationRepository } from "../repositories/notification-repository";
import { Injectable } from "@nestjs/common";

export type SendNotificationUseCaseRequest = {
  content: string;
  recipientId: string;
  title: string;
}

export type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) { }

  async execute({
    content,
    recipientId,
    title
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityId(recipientId),
      title
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}