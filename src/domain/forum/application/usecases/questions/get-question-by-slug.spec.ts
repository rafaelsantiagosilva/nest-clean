import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@/test/repositories/in-memory-questions-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug Use Case (Unit)", async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const createdQuestion = makeQuestion({
      slug: Slug.create("example-question")
    });

    await inMemoryQuestionsRepository.create(createdQuestion);

    const result = await sut.execute({
      slug: Slug.create("example-question")
    });

    expect(result.isRight()).toBe(true);
    // @ts-ignore is a success
    expect(result.value.question.slug.value).toBe("example-question");
  });

  it("should not be able to get a inexisting question by slug", async () => {
    const result = await sut.execute({
      slug: Slug.create("new-title")
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  })
});

