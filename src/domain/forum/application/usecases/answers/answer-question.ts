import { right, type Either } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerAttachment } from "../../../enterprise/entities/answer-attachement";
import { AnswerAttachmentList } from "../../../enterprise/entities/answer-attachment-list";

type AnswerQuestionUseCaseRequest = {
  instructorId: string;
  questionId: string;
  attachmentsIds: string[];
  answerContent: string;
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(
    private answerRepository: AnswersRepository
  ) { }

  async execute({
    instructorId,
    questionId,
    attachmentsIds,
    answerContent
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content: answerContent,
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(instructorId)
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id
      })
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({ answer });
  }
}