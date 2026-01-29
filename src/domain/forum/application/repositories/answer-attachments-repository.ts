import type { AnswerAttachment } from "../../enterprise/entities/answer-attachement";

export interface AnswerAttachmentRepository {
  findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(questionId: string): Promise<void>;
}