import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { GithubService } from "./github.service";

const { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } = process.env;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private githubService: GithubService) {}

  async login(site: string, code: string) {
    switch (site) {
      case "github":
        return this.githubService.githubLogin(code);
      case "kakao":
        return;
      case "naver":
        return;
      case "google":
        break;
    }
  }

  async githubLogin(code: string) {}

  async kakaoLogin(code: string) {}

  async naverLogin(code: string) {}

  async googleLogin(code: string) {}

  async signup() {}
}
