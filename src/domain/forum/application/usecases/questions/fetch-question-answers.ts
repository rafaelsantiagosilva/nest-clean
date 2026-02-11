import { right, type Either } from "@/core/either";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";

type FetchQuestionAnswersUseCaseRequest = {
  page: number;
  questionId: string;
};

type FetchQuestionAnswersUseCaseResponse = Either<null, { answers: Answer[] }>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({ questionId, page }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });

    return right({ answers });
  }
}