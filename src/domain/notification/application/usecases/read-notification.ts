import { left, right, type Either } from "@/core/either";
import { NotAllowedError } from "@/domain/forum/application/usecases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/application/usecases/errors/resource-not-found-error";
import type { NotificationRepository } from "../repositories/notification-repository";

type ReadNotificationUseCaseRequest = {
  notificationId: string;
  recipientId: string;
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationRepository) { }

  async execute({
    notificationId,
    recipientId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);

    if (!notification)
      return left(new ResourceNotFoundError());

    if (notification.recipientId.toString() !== recipientId)
      return left(new NotAllowedError());

    notification.read();
    await this.notificationsRepository.save(notification);

    return right({});
  }
}