import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
// import axios from "axios";
import { HttpService } from "@nestjs/axios";
import axios from "axios";
import { map } from "rxjs";

const {
  OAUTH_GITHUB_CLIENT_ID,
  OAUTH_GITHUB_CLIENT_SECRET,
  OAUTH_GITHUB_ACCESS_TOKEN_API,
  OAUTH_GITHUB_USER_API,
  OAUTH_GITHUB_EMAIL_API,
} = process.env;

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly httpService: HttpService
  ) {}

  async githubLogin(code: string) {
    const { accessToken } = await this.fetchGithubAccessToken(code);
    const { email } = await this.fetchGithubUserAPI(accessToken);
    return email;
  }

  async fetchGithubAccessToken(code: string) {
    // http://localhost:3000/auth/login/github
    // http://123.215.../api/auth/login/github

    const accesstokenAPIConfig = {
      headers: {
        accept: "application/json",
      },
    };

    const accesstokenAPIData = {
      client_id: OAUTH_GITHUB_CLIENT_ID,
      client_secret: OAUTH_GITHUB_CLIENT_SECRET,
      code,
    };

    try {
      const res = await this.httpService
        .post(OAUTH_GITHUB_ACCESS_TOKEN_API, accesstokenAPIData, accesstokenAPIConfig)
        .toPromise();
      const { access_token: accessToken } = res.data;
      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async fetchGithubUserAPI(accessToken: string) {
    const githubUserAPIConfig = {
      headers: {
        Authorization: `Token ${accessToken}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await this.httpService.get(OAUTH_GITHUB_USER_API, githubUserAPIConfig).toPromise();
      const { email } = res.data;
      return { email };
    } catch (err) {
      // console.log(err);
      throw new UnauthorizedException();
    }
  }
}
