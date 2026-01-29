import { makeAnswer } from "@/test/factories/make-answer";
import { InMemoryAnswersRepository } from "@/test/repositories/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "@/test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer Use Case (Unit)", async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer", async () => {
    const createdAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(createdAnswer);

    inMemoryAnswerAttachmentsRepository.data.push(
      makeAnswerAttachment({
        answerId: createdAnswer.id
      })
    );

    inMemoryAnswerAttachmentsRepository.data.push(
      makeAnswerAttachment({
        answerId: createdAnswer.id
      })
    );

    const result = await sut.execute({
      id: createdAnswer.id.toString(),
      authorId: createdAnswer.authorId.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.data).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.data).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const createdAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(createdAnswer);

    const result = await sut.execute({
      id: createdAnswer.id.toString(),
      authorId: "inexisting-author-id"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to delete a inexisting answer", async () => {
    const result = await sut.execute({
      id: "inexisting-id",
      authorId: "inexisting-author-id"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});

