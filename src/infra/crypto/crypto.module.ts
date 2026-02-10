import { Encrypter } from "@/domain/forum/application/crypto/encrypter";
import { HashComparer } from "@/domain/forum/application/crypto/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/crypto/hash-generator";
import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter }
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator
  ]
})
export class CryptoModule { }