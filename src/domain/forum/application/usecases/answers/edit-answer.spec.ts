import { makeAnswer } from "@/test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "@/test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { makeAnswerAttachment } from "@/test/factories/make-answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer Use Case (Unit)", async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
  });

  it("should be able to edit a answer", async () => {
    const createdAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(createdAnswer);

    inMemoryAnswerAttachmentsRepository.data.push(
      makeAnswerAttachment({
        answerId: createdAnswer.id,
        attachmentId: new UniqueEntityId('1')
      })
    );

    inMemoryAnswerAttachmentsRepository.data.push(
      makeAnswerAttachment({
        answerId: createdAnswer.id,
        attachmentId: new UniqueEntityId('2')
      })
    );

    const result = await sut.execute({
      id: createdAnswer.id.toString(),
      authorId: createdAnswer.authorId.toString(),
      content: "New content to this answer...",
      attachmentsIds: ['1', '3']
    });

    const editedAnswer = await inMemoryAnswersRepository.findById(createdAnswer.id.toString());

    expect(result.isRight()).toBe(true);
    expect(editedAnswer).toBeTruthy();
    expect(editedAnswer!.content).toBe("New content to this answer...");
    expect(inMemoryAnswersRepository.data[0]?.attachments.currentItems).toHaveLength(2);
    expect(inMemoryAnswersRepository.data[0]?.attachments.currentItems).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') })
    ]);
  });

  it("should not be able to edit a answer from another user", async () => {
    const createdAnswer = makeAnswer();

    await inMemoryAnswersRepository.create(createdAnswer);

    const result = await sut.execute({
      id: createdAnswer.id.toString(),
      authorId: "inexisting-author-id",
      content: "New content to this answer...",
      attachmentsIds: []
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to edit a inexisting answer", async () => {
    const result = await sut.execute({
      id: "inexisting-id",
      authorId: "inexisting-author-id",
      content: "New content to this answer...",
      attachmentsIds: []
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});

