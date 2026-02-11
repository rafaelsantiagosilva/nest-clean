import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { clearDatabase } from "@/test/utils/clear-database";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Account (E2E)", () => {
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


  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer())
      .post("/accounts")
      .send({
        name: "John Doe",
        email: "john.doe@email.com",
        password: "123456"
      });

    expect(response.status).toBe(201);
  });
});