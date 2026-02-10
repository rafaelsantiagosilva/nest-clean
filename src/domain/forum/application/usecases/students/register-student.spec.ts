import { FakeHasher } from "@/test/crypto/fake-hasher";
import { InMemoryStudentsRepostitory } from "@/test/repositories/in-memory-students-repository";
import { RegisterStudentUseCase } from "./register-student";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { StudentAlreadyExistsError } from "../errors/student-already-exists-error";

let inMemoryStudentsRepostitory: InMemoryStudentsRepostitory;
let fakeHasher: FakeHasher;

let sut: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepostitory = new InMemoryStudentsRepostitory();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepostitory, fakeHasher);
  });

  it("should be able to create a new student", async () => {
    const result = await sut.execute({
      email: "john.doe@email.com",
      name: "John Doe",
      password: "123456"
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual({
      student: inMemoryStudentsRepostitory.data[0]
    });
    expect(inMemoryStudentsRepostitory.data[0].id).toBeInstanceOf(UniqueEntityId);
  });

   it("should hash the password on the student account creation", async () => {
    const result = await sut.execute({
      email: "john.doe@email.com",
      name: "John Doe",
      password: "123456"
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepostitory.data[0].password).toBe("123456-hashed");
  });

  it("should not be able to create students with the same e-mail", async () => {
    await sut.execute({
      email: "john.doe@email.com",
      name: "John Doe",
      password: "123456"
    });

    const result = await sut.execute({
      email: "john.doe@email.com",
      name: "John Doe Again",
      password: "123456"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  })
});