import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { user } from "@prisma/client";
import { Request } from "express";

interface JwtPayload {
  user_id: number;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access-token") {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies["jwt-access-token"];
        },
      ]),
    });
  }

  async validate(payload: JwtPayload): Promise<user> {
    const { user_id } = payload;
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
