import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { Request } from "express";
import { JWT_SECRET_KEY } from "src/constants/config";

interface JwtPayload {
  userId: number;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies["jwt-refresh-token"];
        },
      ]),
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { userId } = payload;
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) throw new UnauthorizedException();

    const oldRefreshToken = req.get("Authorization").replace("Bearer", "").trim();

    return {
      user,
      oldRefreshToken,
    };
  }
}
