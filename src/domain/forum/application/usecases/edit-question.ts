import { left, right, type Either } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import type { QuestionAttachmentRepository } from "../repositories/question-attachments-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type EditQuestionUseCaseRequest = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

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