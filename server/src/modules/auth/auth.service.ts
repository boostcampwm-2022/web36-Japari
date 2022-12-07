import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "./jwt/jwt.service";
import { Request, Response } from "express";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { GithubService } from "./github.service";
import { GoogleService } from "./google.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private github: GithubService,
    private google: GoogleService
  ) {}

  async login(site: string, code: string, res: Response) {
    let email: string;
    switch (site) {
      case "github":
        email = await this.github.getGithubEmail(code);
        break;
      case "kakao":
        return;
      case "naver":
        return;
      case "google":
        email = await this.google.getGoogleEmail(code);
        return;
      default:
        throw new BadRequestException(`${site} 로그인 기능은 제공하지 않습니다.`);
    }

    let user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await this.signup(email);
    }

    return this.jwt.issueTokens(user.userId, res);
  }

  async signup(email: string) {
    return this.prisma.user.create({
      data: {
        email,
      },
    });
  }

  async logout(req: Request, res: Response) {
    return this.jwt.deleteTokens(req, res);
  }
}
