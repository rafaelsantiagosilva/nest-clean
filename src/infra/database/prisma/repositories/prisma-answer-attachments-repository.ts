import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachement";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentRepository {
  findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]> {
    throw new Error("Method not implemented.");
  }

  deleteManyByAnswerId(questionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}