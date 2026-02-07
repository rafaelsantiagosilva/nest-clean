import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "@/test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question Use Case (Unit)", async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it("should be able to answer a question / create a new answer", async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      answerContent: "New answer",
      attachmentsIds: ['1', '2']
    });

    const { value } = result;

    expect(result.isRight()).toBe(true);
    expect(value?.answer.content).toBe("New answer");
    expect(inMemoryAnswersRepository.data[0]).toBe(value?.answer);
    expect(inMemoryAnswersRepository.data[0]?.attachments.currentItems).toHaveLength(2);
    expect(inMemoryAnswersRepository.data[0]?.attachments.currentItems).toStrictEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') })
    ]);
  })
});

