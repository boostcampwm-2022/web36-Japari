import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "./jwt.service";

import { Request, Response } from "express";
import { JwtError } from "src/constants/jwt-error";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const accessToken = req.cookies["jwt-access-token"];
    const refreshToken = req.cookies["jwt-refresh-token"];

    // 1. access token이 없다면 Unauthorized.
    if (!accessToken) throw new UnauthorizedException();

    // 2. access token을 검증한다.
    try {
      const payload = this.jwt.verify(accessToken);
      const { userId } = payload;

      // 2-A. access token이 유효하므로 req에 유저 정보를 넣어주고 통과시킨다.
      const user = await this.prisma.user.findFirst({ where: { userId } });
      req.user = user;

      return true;
    } catch (err) {
      switch (err.name) {
        case JwtError.JSON_WEB_TOKEN_ERROR:
        case JwtError.NOT_BEFORE_ERROR:
          // 2-B. access token이 유효하지 않으므로 토큰을 모두 삭제하고 사용자에게 경고 메일을 보낸다.
          /* 경고 메일 */
          res.clearCookie("jwt-access-token");
          res.clearCookie("jwt-refresh-token");
          throw new UnauthorizedException();
      }
    }

    /* access token이 만료 되었다. */

    // 3. refresh token이 없다면 Unauthorized.
    if (!refreshToken) {
      res.clearCookie("jwt-access-token");
      res.clearCookie("jwt-refresh-token");
      throw new UnauthorizedException();
    }

    // 4. refresh token이 black list에 존재한다면 토큰을 모두 삭제하고 사용자에게 경고 메일을 보낸다.
    if (await this.prisma.refreshTokenBlackList.findFirst({ where: { token: refreshToken } })) {
      /* 경고 메일 */
      res.clearCookie("jwt-access-token");
      res.clearCookie("jwt-refresh-token");
      throw new UnauthorizedException();
    }

    // 5. refresh token을 검증한다.
    try {
      const payload = this.jwt.verify(refreshToken);
      const { userId } = payload;

      // 6-A. refresh token이 유효하므로 다음 절차를 따른다.
      // i) access token, refresh token을 재발급한다.
      const newAccessToken = this.jwt.sign(payload, { expiresIn: "3h" });
      const newRefreshToken = this.jwt.sign(payload, { expiresIn: "14d" });
      res.cookie("jwt-access-token", newAccessToken, { httpOnly: true, maxAge: 6 * 60 * 1000 });
      res.cookie("jwt-refresh-token", newRefreshToken, { httpOnly: true, maxAge: 14 * 60 * 60 * 1000 });
      await this.prisma.user.update({
        where: { userId },
        data: { jwtRefreshToken: refreshToken },
      });
      // ii) blacklist에 기존에 사용한 refresh 토큰을 등록한다.
      await this.prisma.refreshTokenBlackList.create({ data: { token: refreshToken } });
      // iii) 유저 이메일로 다시 로그인 되었다는 사실을 알려준다.
      /* 알림 메일 */
      // iv) req에 유저 정보를 넣어주고 통과시킨다.
      const user = await this.prisma.user.findUnique({ where: userId });
      req.user = user;
      return true;
    } catch (err) {
      switch (err.name) {
        case JwtError.JSON_WEB_TOKEN_ERROR:
        case JwtError.NOT_BEFORE_ERROR:
          // 6-B. refresh token이 유효하지 않으므로 토큰을 모두 삭제하고 사용자에게 경고 메일을 보낸다.
          /* 경고 메일 */
          res.clearCookie("jwt-access-token");
          res.clearCookie("jwt-refresh-token");
          throw new UnauthorizedException();
        case JwtError.TOKEN_EXPIRED_ERROR:
          // 6-C. refresh token이 만료되었으므로 토큰을 모두 삭제한다.
          res.clearCookie("jwt-access-token");
          res.clearCookie("jwt-refresh-token");
          throw new UnauthorizedException();
        default:
          throw new UnauthorizedException();
      }
    }
  }
}
