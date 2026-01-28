import { PrismaPg } from "@prisma/adapter-pg";
import { execSync } from "child_process";
import "dotenv/config";
import { PrismaClient } from "generated/prisma/client";
import crypto from "node:crypto";

const schemaId = crypto.randomUUID();

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL)
    throw new Error("Please, provide a env variable named \"DATABASE_URL\"");

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);

  return url.toString();
}

let prisma: PrismaClient;

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId);
  process.env.DATABASE_URL = databaseUrl;

  prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl
    })
  });

  execSync("pnpx prisma migrate deploy");
});

beforeEach(async () => {
  const tables = [
    "users",
    "questions"
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`
    );
  }
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});