import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { makeQuestion } from "@/test/factories/make-question";
import { makeQuestionAttachment } from "@/test/factories/make-question-attachment";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@/test/repositories/in-memory-questions-repository";
import { NotAllowedError } from "../../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../../core/errors/resource-not-found-error";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question Use Case (Unit)", async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository);
  });

  it("should be able to edit a question", async () => {
    const createdQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(createdQuestion);

    inMemoryQuestionAttachmentsRepository.data.push(makeQuestionAttachment({
      questionId: createdQuestion.id,
      attachmentId: new UniqueEntityId("1")
    }));

    inMemoryQuestionAttachmentsRepository.data.push(makeQuestionAttachment({
      questionId: createdQuestion.id,
      attachmentId: new UniqueEntityId("2")
    }));

    const result = await sut.execute({
      id: createdQuestion.id.toString(),
      authorId: createdQuestion.authorId.toString(),
      title: "New Title",
      content: "New content to this question...",
      attachmentsIds: ["1", "3"]
    });


    const editedQuestion = await inMemoryQuestionsRepository.findBySlug(createdQuestion.slug.value);

    expect(result.isRight()).toBe(true);
    expect(editedQuestion).toBeTruthy();
    expect(editedQuestion!.content).toBe("New content to this question...");

    expect(inMemoryQuestionsRepository.data[0]?.attachments.currentItems).toHaveLength(2);
    expect(inMemoryQuestionsRepository.data[0]?.attachments.currentItems).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("should not be able to edit a question from another user", async () => {
    const createdQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(createdQuestion);

    const result = await sut.execute({
      id: createdQuestion.id.toString(),
      authorId: "inexisting-author-id",
      title: "New Title",
      content: "New content to this question...",
      attachmentsIds: []
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to edit a inexisting question", async () => {
    const result = await sut.execute({
      id: "inexisting-id",
      authorId: "inexisting-author-id",
      title: "New Title",
      content: "New content to this question...",
      attachmentsIds: []
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});

