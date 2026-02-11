import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachement";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/PrismaAnswerAttachmentMapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentRepository {
  constructor(private prisma: PrismaService) { }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        answerId
      }
    });

    return attachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId
      }
    });
  }
}