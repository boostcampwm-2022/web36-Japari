import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { SignOptions, VerifyOptions, DecodeOptions, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "src/constants/config";
import { PrismaService } from "src/modules/prisma/prisma.service";
import ms from "ms";

@Injectable()
export class JwtService {
  constructor(private prisma: PrismaService) {}

  sign(payload: any, options?: SignOptions) {
    return jwt.sign(payload, JWT_SECRET_KEY, options);
  }

  verify(token: string, options?: VerifyOptions) {
    return jwt.verify(token, JWT_SECRET_KEY, options) as JwtPayload;
  }

  decode(token: string, options?: DecodeOptions) {
    return jwt.decode(token, options) as JwtPayload;
  }

  async deleteTokens(req: Request, res: Response) {
    const refreshToken = req.cookies["jwt-refresh-token"];

    // 삭제한 refresh 토큰은 블랙리스트에 등록한다.
    if (refreshToken) {
      await this.prisma.refreshTokenBlackList.create({ data: { token: refreshToken } });
    }

    res.clearCookie("jwt-access-token");
    res.clearCookie("jwt-refresh-token");
  }

  async issueTokens(userId: number, res: Response) {
    const payload = { userId };
    const jwtAccessToken = this.sign(payload, { expiresIn: "3h" });
    const jwtRefreshToken = this.sign(payload, { expiresIn: "14d" });

    // 쿠키는 14일간 보관한다.
    res.cookie("jwt-access-token", jwtAccessToken, { httpOnly: true, maxAge: ms("14d") });
    res.cookie("jwt-refresh-token", jwtRefreshToken, { httpOnly: true, maxAge: ms("14d") });

    return { jwtAccessToken, jwtRefreshToken };
  }
}
