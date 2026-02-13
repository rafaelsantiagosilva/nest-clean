import { left, right, type Either } from "@/core/either";
import { AnswersRepository } from "../../repositories/answers-repository";
import { NotAllowedError } from "../../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";
import { AnswerAttachment } from "../../../enterprise/entities/answer-attachement";
import { AnswerAttachmentRepository } from "../../repositories/answer-attachments-repository";
import { AnswerAttachmentList } from "../../../enterprise/entities/answer-attachment-list";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

type EditAnswerUseCaseRequest = {
  id: string;
  authorId: string;
  attachmentsIds: string[];
  content: string;
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentRepository
  ) { }

  async execute({ id, authorId, attachmentsIds, content }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(id);

    if (!answer)
      return left(new ResourceNotFoundError());

    if (answer.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(id)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments
    );

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id
      })
    });

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answersRepository.save(answer);

    return right({});
  }
}