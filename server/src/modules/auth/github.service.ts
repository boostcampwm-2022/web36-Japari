import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import {
  OAUTH_GITHUB_CLIENT_ID,
  OAUTH_GITHUB_CLIENT_SECRET,
  OAUTH_GITHUB_ACCESS_TOKEN_API,
  OAUTH_GITHUB_EMAIL_API,
} from "src/constants/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getGithubEmail(code: string) {
    const accessToken = await this.fetchGithubAccessToken(code);
    const email = await this.fetchGithubUserAPI(accessToken);
    return email;
  }

  async fetchGithubAccessToken(code: string): Promise<string> {
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
      const res = await lastValueFrom(
        this.httpService.post(OAUTH_GITHUB_ACCESS_TOKEN_API, accesstokenAPIData, accesstokenAPIConfig)
      );
      const { access_token: accessToken } = res.data;
      return accessToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async fetchGithubUserAPI(accessToken: string): Promise<string> {
    const githubUserAPIConfig = {
      headers: {
        Authorization: `Token ${accessToken}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await lastValueFrom(this.httpService.get(OAUTH_GITHUB_EMAIL_API, githubUserAPIConfig));
      const email = res.data[0].email;
      return email;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
