import { HashComparer } from "@/domain/forum/application/crypto/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/crypto/hash-generator";
import { Injectable } from "@nestjs/common";
import {hash, compare} from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return await hash(plain, 8);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}