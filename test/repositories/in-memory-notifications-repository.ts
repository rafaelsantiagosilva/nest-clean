import type { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import type { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository implements NotificationRepository {
  public data: Notification[] = [];

  async findById(id: string): Promise<Notification | null> {
    const notification = this.data.find(item => item.id.toString() === id);
    return notification ?? null;
  }

  async create(notification: Notification): Promise<void> {
    this.data.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.data.findIndex(item => item.id === notification.id);
    this.data[itemIndex] = notification;
  }
}