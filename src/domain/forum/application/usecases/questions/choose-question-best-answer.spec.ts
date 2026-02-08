import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "@/test/factories/make-answer";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryAnswersRepository } from "@/test/repositories/in-memory-answers-repository";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@/test/repositories/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer (Unit)", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    );
  });

  it("should be able to choose a best answer", async () => {
    const createdQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(createdQuestion);

    const createdAnswer = makeAnswer({
      questionId: createdQuestion.id
    });

    await inMemoryAnswersRepository.create(createdAnswer);

    const result = await sut.execute({
      authorId: createdQuestion.authorId.toString(),
      answerId: createdAnswer.id.toString()
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.data[0]?.bestAnswerId).toBe(createdAnswer.id);
  });

  it("should not be able to choose another user question best answer", async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId("author-1")
    });

    const answer = makeAnswer({
      questionId: question.id
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "author-2"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});