import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "../../enterprise/entities/question";
import type { Slug } from "../../enterprise/entities/value-objects/slug";

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: Slug): Promise<Question | null>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  create(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}