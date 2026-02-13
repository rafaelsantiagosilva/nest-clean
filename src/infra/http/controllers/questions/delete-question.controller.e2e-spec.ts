import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { QuestionFactory } from "@/test/factories/make-question";
import { StudentFactory } from "@/test/factories/make-student";
import { clearDatabase } from "@/test/utils/clear-database";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Edit Question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  test("[DELETE] /questions/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: "New question"
      }
    });

    expect(questionOnDatabase).toBeNull();
  });
});