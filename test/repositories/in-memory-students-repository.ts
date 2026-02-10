import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepostitory implements StudentsRepository {
  public data: Student[] = [];

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.data.find(item => item.email === email);
    return student ?? null;
  }

  async create(student: Student): Promise<void> {
    this.data.push(student);
  }
}