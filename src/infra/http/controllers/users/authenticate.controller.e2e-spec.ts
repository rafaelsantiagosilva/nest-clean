import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { clearDatabase } from "@/test/utils/clear-database";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
  });


  test("[POST] /sessions", async () => {
    await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@email.com",
        password: await hash("123456", 8)
      }
    });

    const response = await request(app.getHttpServer())
      .post("/sessions")
      .send({
        email: "john.doe@email.com",
        password: "123456"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      access_token: expect.any(String)
    });
  });
});