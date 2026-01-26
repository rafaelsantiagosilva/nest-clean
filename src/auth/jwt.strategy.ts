import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "src/env";
import z from "zod";

const tokenSchema = z.object({
  sub: z.cuid()
});

type TokenSchema = z.infer<typeof tokenSchema>;

@Injectable() // pois é um provider
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get<string>("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"]
    });
  }

  validate(payload: TokenSchema) {
    const { success, data } = tokenSchema.safeParse(payload);

    if (!success)
      throw new UnauthorizedException();

    return data;
  }
}