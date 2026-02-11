import { left, right,  Either } from "@/core/either";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import  { Question } from "@/domain/forum/enterprise/entities/question";
import  { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

type GetQuestionBySlugUseCaseRequest = {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>;

@Injectable()
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