import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { User as PrismaStudent } from "generated/prisma/client";
import { UserUncheckedCreateInput as StudentUncheckedCreateInput } from "generated/prisma/models";

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create({
      name: raw.name,
      email: raw.email,
      password: raw.password
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(student: Student): StudentUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password
    };
  }
}