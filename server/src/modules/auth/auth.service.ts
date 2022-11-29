import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { GithubService } from "./github.service";

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
      default:
        throw new BadRequestException(`${site} 로그인 기능은 제공하지 않습니다.`);
    }

    let user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await this.signup(email);
    }

    // jwt
    const { jwtAccessToken, jwtRefreshToken } = await this.createTokens(user);
    this.saveRefreshTokenToDB(user, jwtRefreshToken);
    return { jwtAccessToken, jwtRefreshToken };
  }

  async signup(email: string) {
    return this.prisma.user.create({
      data: {
        email,
      },
    });
  }

  async logout(user: User) {
    return this.saveRefreshTokenToDB(user, null);
  }

  async createTokens(user: User) {
    const { userId } = user;
    const payload = { userId };
    const jwtAccessToken = this.jwtService.sign(payload, { expiresIn: "3h" });
    const jwtRefreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

    return { jwtAccessToken, jwtRefreshToken };
  }

  async saveRefreshTokenToDB(user: User, jwtRefreshToken: string) {
    await this.prisma.user.update({
      where: { userId: user.userId },
      data: { jwtRefreshToken },
    });
  }

  async refreshJwtTokens(user: User, jwtRefreshToken: string) {
    if (!user.jwtRefreshToken) throw new UnauthorizedException();
    if (user.jwtRefreshToken != jwtRefreshToken) throw new UnauthorizedException();

    const { jwtAccessToken, jwtRefreshToken: newJwtRefreshToken } = await this.createTokens(user);
    return { jwtAccessToken, jwtRefreshToken: newJwtRefreshToken };
  }
}
