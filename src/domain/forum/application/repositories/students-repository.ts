import { Student } from "../../enterprise/entities/student";

export abstract class StudentsRepository {
  abstract findByEmail(): Promise<Student | null>;
  abstract create(student: Student): Promise<void>;
}