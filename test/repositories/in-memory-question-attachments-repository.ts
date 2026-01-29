import type { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentRepository {
  public data: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    return this.data.filter(item => item.questionId.toString() === questionId);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const newData = this.data.filter(item => item.questionId.toString() !== questionId);
    this.data = newData;
  }
}