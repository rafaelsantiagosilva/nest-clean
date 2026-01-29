import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment, type AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachement";

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: id ?? new UniqueEntityId(),
      ...override
    }
  );

  return answerAttachment;
}