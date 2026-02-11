import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Fetch Recent Questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions/recent", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe3@email.com",
        password: await hash("123456", 8)
      }
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          title: "Question 1",
          slug: "question-1",
          content: "New Question"
        },
        {
          authorId: user.id,
          title: "Question 2",
          slug: "question-2",
          content: "New Question"
        },
        {
          authorId: user.id,
          title: "Question 3",
          slug: "question-3",
          content: "New Question"
        },
      ]
    });

    const response = await request(app.getHttpServer())
      .get("/questions/recent")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(3);
  });
});