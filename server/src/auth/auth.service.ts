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
    const { jwtAccessToken, jwtRefreshToken } = await this.createTokens(user);
    this.saveNewJwtRefreshTokenToDB(user, jwtRefreshToken);
    return { jwtAccessToken, jwtRefreshToken };
  }

  async signup(email: string) {
    return this.prisma.user.create({
      data: {
        email,
      },
    });
  }

  async logout(user: user) {
    await this.saveNewJwtRefreshTokenToDB(user, null);
    return { message: "로그아웃 성공" };
  }

  async createTokens(user: user) {
    const { user_id } = user;
    const payload = { user_id };
    const jwtAccessToken = await this.jwtService.sign(payload, { expiresIn: "1h" });
    const jwtRefreshToken = await this.jwtService.sign(payload, { expiresIn: "7d" });

    return { jwtAccessToken, jwtRefreshToken };
  }

  async saveNewJwtRefreshTokenToDB(user: user, jwtRefreshToken) {
    await this.prisma.user.update({
      where: { user_id: user.user_id },
      data: { jwt_refresh_token: jwtRefreshToken },
    });
  }

  async refreshJwtTokens(user: user, refreshToken: string) {
    if (!user.jwt_refresh_token) throw new UnauthorizedException();
    if (user.jwt_refresh_token != refreshToken) throw new UnauthorizedException();

    const { jwtAccessToken, jwtRefreshToken } = await this.createTokens(user);
    return { jwtAccessToken, jwtRefreshToken };
  }
}
