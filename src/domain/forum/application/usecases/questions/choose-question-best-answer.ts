import { left, right, type Either } from "@/core/either";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "../../../enterprise/entities/question";
import { NotAllowedError } from "../../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";

type ChooseQuestionBestAnswerUseCaseRequest = {
  authorId: string;
  answerId: string;
};

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { question: Question }>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository) { }

  async execute({
    authorId,
    answerId
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer)
      return left(new ResourceNotFoundError());

    const question = await this.questionsRepository.findById(answer.questionId.toString());

    if (!question)
      return left(new ResourceNotFoundError());

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    return right({ question });
  }
}