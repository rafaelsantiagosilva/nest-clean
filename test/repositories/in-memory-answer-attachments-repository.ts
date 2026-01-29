import type { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachement";

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentRepository {
  public data: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.data.filter(item => item.answerId.toString() === answerId);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const newData = this.data.filter(item => item.answerId.toString() !== answerId);
    this.data = newData;
  }
}