import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "@/test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "@/test/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments (Unit)", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const answerId = new UniqueEntityId("answer-id");

    for (let i = 0; i < 4; i++)
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId
        })
      );


    const result = await sut.execute({
      page: 1,
      answerId: answerId.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(4);
  });

  it("should be able to fetch paginated answer comments", async () => {
    const answerId = new UniqueEntityId("answer-id");

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId
        })
      );
    }

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 2
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(2);
  });
});