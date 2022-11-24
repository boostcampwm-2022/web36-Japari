import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { user } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { GithubService } from "./github.service";

const { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } = process.env;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private githubService: GithubService) {}

  async login(site: string, code: string) {
    let email: string;
    switch (site) {
      case "github":
        email = await this.githubService.getGithubEmail(code);
        break;
      case "kakao":
        return;
      case "naver":
        return;
      case "google":
        break;
    }

    let user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await this.signup(email);
    }

    // jwt
    const { user_id } = user;
    const payload = { user_id };
    const jwtAccessToken = await this.jwtService.sign(payload, { expiresIn: "1h" });
    const jwtRefreshToken = await this.jwtService.sign(payload, { expiresIn: "7d" });
    await this.updateRefreshToken(user_id, jwtRefreshToken);
    // 일단 refresh token 클라이언트 쪽에서는 localStorage에 저장하는 걸로~
    // 로그인 상태 유지를 어떻게 할 것인가? validate 함수?
    return { jwtAccessToken, jwtRefreshToken };
  }

  async githubLogin(code: string) {}

  async kakaoLogin(code: string) {}

  async naverLogin(code: string) {}

  async googleLogin(code: string) {}

  async signup(email: string) {
    return this.prisma.user.create({
      data: {
        email,
      },
    });
  }

  async updateRefreshToken(user_id: number, jwtRefreshToken: string) {
    return this.prisma.user.update({
      where: { user_id },
      data: { jwt_refresh_token: jwtRefreshToken },
    });
  }
}
