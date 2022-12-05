import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "./jwt.service";

import { Request, Response } from "express";
import { JwtError } from "src/constants/jwt-error";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtGuard implements CanActivate {
  private logger = new Logger();
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const accessToken = req.cookies["jwt-access-token"];
    const refreshToken = req.cookies["jwt-refresh-token"];

    // 1. access token을 검증한다.
    try {
      const { userId } = this.jwt.verify(accessToken);

      // 1-A. access token이 유효하므로 req에 유저 정보를 넣어주고 통과시킨다.
      const user = await this.prisma.user.findFirst({ where: { userId } });
      req.user = user;

      return true;
    } catch (err) {
      switch (err.name) {
        case JwtError.JSON_WEB_TOKEN_ERROR:
        case JwtError.NOT_BEFORE_ERROR:
          // 1-B. access token이 존재하지 않거나 유효하지 않으므로 토큰을 모두 삭제하고 block.
          await this.jwt.deleteTokens(req, res);
          throw new UnauthorizedException();
      }
    }

    // 1-C. access token이 만료되었다.

    // 2. refresh token을 검증한다.
    try {
      const payload = this.jwt.verify(refreshToken);
      const { userId } = payload;
      const user = await this.prisma.user.findFirst({ where: { userId } });

      // 2-A. refresh token이 유효하므로 다음 절차를 따른다.

      // i) refresh token이 blacklist에 존재한다면 토큰을 모두 삭제하고 사용자에게 보안 경고 메일을 보낸 뒤 block.
      if (await this.prisma.refreshTokenBlackList.findFirst({ where: { token: refreshToken } })) {
        await this.jwt.deleteTokens(req, res);
        this.logger.debug(
          `
          mock email 전송 완료
  
          To: ${user.email}
          Subject: [Japari] 보안 경고
          text: 회원님에게 발급한 로그인 토큰이 재사용 되었습니다. 보안에 유의하시기 바랍니다.
          at: ${new Date()}
          `
        );
        throw new UnauthorizedException();
      }

      // ii) access token, refresh token을 재발급한다.
      await this.jwt.deleteTokens(req, res);
      await this.jwt.issueTokens(userId, res);

      // iii) 사용자에게 로그인 알림 메일을 보낸다.
      this.logger.debug(
        `
        mock email 전송 완료

        To: ${user.email}
        Subject: [Japari] 로그인 알림
        text: 로그인 토큰이 만료되어 자동으로 갱신되었습니다. 현재 Japari 서비스 이용중이 아니라면 japari@gmail.com으로 문의 바랍니다.
        at: ${new Date()}
        `
      );
      // iv) req에 유저 정보를 넣어주고 통과시킨다.
      req.user = user;
      return true;
    } catch (err) {
      switch (err.name) {
        case JwtError.JSON_WEB_TOKEN_ERROR:
        case JwtError.NOT_BEFORE_ERROR:
        case JwtError.TOKEN_EXPIRED_ERROR:
          // 2-B. refresh token이 존재하지 않거나 유효하지 않거나 만료되었으므로 토큰을 모두 삭제하고 block.
          await this.jwt.deleteTokens(req, res);
          throw new UnauthorizedException();
      }
    }
  }
}
