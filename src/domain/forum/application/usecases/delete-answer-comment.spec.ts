import { makeAnswerComment } from "@/test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "@/test/repositories/in-memory-answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case (Unit)", async () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to delete a answer comment", async () => {
    const createdAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(createdAnswerComment);

    const result = await sut.execute({
      id: createdAnswerComment.id.toString(),
      authorId: createdAnswerComment.authorId.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerCommentsRepository.data).toHaveLength(0);
  });

  it("should not be able to delete a answer comment from another user", async () => {
    const createdAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(createdAnswerComment);

    const result = await sut.execute({
      id: createdAnswerComment.id.toString(),
      authorId: "inexisting-author-id"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to delete a inexisting answer comment", async () => {
    const result = await sut.execute({
      id: "inexisting-id",
      authorId: "inexisting-author-id"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});

