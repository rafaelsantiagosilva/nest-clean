import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "@/test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "@/test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments (Unit)", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    const questionId = new UniqueEntityId("question-id");

    for (let i = 0; i < 4; i++)
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId
        })
      );

    const result = await sut.execute({
      page: 1,
      questionId: questionId.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(4);
  });

  it("should be able to fetch paginated question comments", async () => {
    const questionId = new UniqueEntityId("question-id");

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId
        })
      );
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(2);
  });
});