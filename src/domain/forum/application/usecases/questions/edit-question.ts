import { left, right, type Either } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "@/domain/forum/enterprise/entities/question-attachment-list";
import { NotAllowedError } from "../../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

type EditQuestionUseCaseRequest = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) { }

  async execute({ id, authorId, title, content, attachmentsIds }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(id);

    if (!question)
      return left(new ResourceNotFoundError());

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(id);
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    });

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return right({});
  }
}