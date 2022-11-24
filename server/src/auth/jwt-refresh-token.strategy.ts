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
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { user_id } = payload;
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) throw new UnauthorizedException();

    const refreshToken = req.get("Authorization").replace("Bearer", "").trim();

    return {
      user,
      refreshToken,
    };
  }
}
