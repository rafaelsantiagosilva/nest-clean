import { Env } from "@/infra/env";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get<string>("JWT_PRIVATE_KEY");
        const publicKey = config.get<string>("JWT_PUBLIC_KEY");

        return {
          signOptions: { algorithm: "RS256" },
          privateKey: Buffer.from(privateKey, 'base64').toString(),
          publicKey: Buffer.from(publicKey, 'base64').toString()
        };
      }
    })
  ],
  providers: [JwtStrategy]
})
export class AuthModule { }