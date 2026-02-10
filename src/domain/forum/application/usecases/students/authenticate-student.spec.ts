import { FakeHasher } from "@/test/crypto/fake-hasher";
import { InMemoryStudentsRepostitory } from "@/test/repositories/in-memory-students-repository";
import { FakeEncrypter } from "@/test/crypto/fake-encrypter";
import { AuthenticateStudentUseCase } from "./authenticate-students";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { makeStudent } from "@/test/factories/make-student";

let inMemoryStudentsRepostitory: InMemoryStudentsRepostitory;
let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;

let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepostitory = new InMemoryStudentsRepostitory();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepostitory, fakeHasher, fakeEncrypter);
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "john.doe@email.com",
      password: await fakeHasher.hash("123456")
    });

    await inMemoryStudentsRepostitory.create(student);

    const result = await sut.execute({
      email: "john.doe@email.com",
      password: "123456"
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toStrictEqual({
      accessToken: expect.any(String)
    });
  });

  it("should not be able to authenticate an user with the wrong e-mail", async () => {
    const student = makeStudent({
      email: "john.doe@email.com",
      password: await fakeHasher.hash("123456")
    });

    await inMemoryStudentsRepostitory.create(student);

    const result = await sut.execute({
      email: "john.doe.wrong@email.com",
      password: "123456"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  })

  it("should not be able to authenticate an user with the wrong password", async () => {
    const student = makeStudent({
      email: "john.doe@email.com",
      password: await fakeHasher.hash("123456")
    });

    await inMemoryStudentsRepostitory.create(student);
    
    const result = await sut.execute({
      email: "john.doe@email.com",
      password: "wrong password"
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  })
});