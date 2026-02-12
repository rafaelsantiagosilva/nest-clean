import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { clearDatabase } from "@/test/utils/clear-database";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "@/test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "@/test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

describe("Get Question By Slug (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
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


  test("[GET] /questions/:slug", async () => {
      const user = await studentFactory.makePrismaStudent();

      const accessToken = jwt.sign({ sub: user.id.toString() });
      const slug = "find-by-slug-test";

      await questionFactory.makePrismaQuestion({
        authorId: user.id,
        slug: Slug.create(slug)
      });

      const response = await request(app.getHttpServer())
        .get(`/questions/${slug}`)
        .set("Authorization", `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200);
      expect(response.body.question).toBeTruthy();
  });
});