import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { clearDatabase } from "@/test/utils/clear-database";
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

  beforeEach(async () => {
    await clearDatabase(prisma);
  });


  test("[GET] /questions/:slug", async () => {
      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john.doe@email.com",
          password: await hash("123456", 8)
        }
      });

      const accessToken = jwt.sign({ sub: user.id });
      const slug = "find-by-slug-test";

      await prisma.question.create({
        data: {
          title: "Find By Slug Test",
          slug,
          content: "A random content",
          authorId: user.id
        }
      });

      const response = await request(app.getHttpServer())
        .get(`/questions/${slug}`)
        .set("Authorization", `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200);
      expect(response.body.question).toBeTruthy();
  });
});