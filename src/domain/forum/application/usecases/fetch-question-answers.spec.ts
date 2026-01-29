import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "@/test/factories/make-answer";
import { InMemoryAnswersRepository } from "@/test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers (Unit)", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it("should be able to fetch question answers", async () => {
    const questionId = new UniqueEntityId("question-id");

    for (let i = 0; i < 4; i++)
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId
        })
      );

    const result = await sut.execute({
      page: 1,
      questionId: questionId.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(4);
  });

  it("should be able to fetch paginated question answers", async () => {
    const questionId = new UniqueEntityId("question-id");

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId
        })
      );
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});