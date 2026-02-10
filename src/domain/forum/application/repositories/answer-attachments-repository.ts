import type { AnswerAttachment } from "../../enterprise/entities/answer-attachement";

export abstract class AnswerAttachmentRepository {
  abstract findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyByAnswerId(questionId: string): Promise<void>;
}