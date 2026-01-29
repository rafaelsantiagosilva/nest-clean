import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { left, right, type Either } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type CommentOnQuestionUseCaseRequest = {
  content: string;
  authorId: string;
  questionId: string;
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, { questionComment: QuestionComment }>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) { }

  async execute({
    questionId,
    authorId,
    content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question)
      return left(new ResourceNotFoundError());

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      questionId: new UniqueEntityId(questionId),

    });

    await this.questionCommentsRepository.create(questionComment);

    return right({ questionComment });
  }
}