import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { Body, ConflictException, Controller, Post, UsePipes } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string().min(5),
  email: z.email(),
  password: z.string().min(6),
});

type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() data: CreateAccountBody) {
    const { name, email, password } = createAccountBodySchema.parse(data);

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail)
      throw new ConflictException("User already exists.");

    const hashedPassword = await bcrypt.hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}