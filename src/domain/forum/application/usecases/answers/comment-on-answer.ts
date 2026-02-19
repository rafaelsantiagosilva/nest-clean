import { left, right, type Either } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../../repositories/answer-comments-repository";
import { AnswersRepository } from "../../repositories/answers-repository";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

type CommentOnAnswerUseCaseRequest = {
  content: string;
  authorId: string;
  answerId: string;
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, { answerComment: AnswerComment }>;

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) { }

  async execute({
    answerId,
    authorId,
    content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer)
      return left(new ResourceNotFoundError());

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      answerId: new UniqueEntityId(answerId),

    });

    await this.answerCommentsRepository.create(answerComment);

    return right({ answerComment });
  }
}