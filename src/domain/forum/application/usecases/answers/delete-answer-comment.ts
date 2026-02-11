import { left, right, type Either } from "@/core/either";
import type { AnswerCommentsRepository } from "../../repositories/answer-comments-repository";
import { NotAllowedError } from "../../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

type DeleteAnswerCommentUseCaseRequest = {
  id: string;
  authorId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository
  ) { }

  async execute({
    id,
    authorId
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(id);

    if (!answerComment)
      return left(new ResourceNotFoundError());

    if (answerComment.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    await this.answerCommentsRepository.delete(answerComment);

    return right({});
  }
}