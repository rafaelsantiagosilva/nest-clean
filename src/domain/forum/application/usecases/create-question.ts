import { right, type Either } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { Question } from "../../enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

type CreateQuestionUseCaseRequest = {
  title: string;
  content: string;
  authorId: string;
  attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<null, { question: Question }>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository
  ) { }

  async execute({
    authorId,
    title,
    content,
    attachmentsIds
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content
    });

    question.attachments = new QuestionAttachmentList(
      attachmentsIds.map((attachmentId) => {
        return QuestionAttachment.create({
          attachmentId: new UniqueEntityId(attachmentId),
          questionId: question.id
        })
      })
    );

    await this.questionsRepository.create(question);

    return right({ question });
  }
}