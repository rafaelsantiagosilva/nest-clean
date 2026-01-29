import { left, right, type Either } from "@/core/either";
import type { Question } from "../../enterprise/entities/question";
import type { Slug } from "../../enterprise/entities/value-objects/slug";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

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