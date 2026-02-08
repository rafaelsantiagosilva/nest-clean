import { left, right, type Either } from "@/core/either";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";
import type { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";

type GetQuestionBySlugUseCaseRequest = {
  slug: Slug
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>;

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) { }

  async execute({ slug }:
    GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question)
      return left(new ResourceNotFoundError());

    return right({ question });
  }
}