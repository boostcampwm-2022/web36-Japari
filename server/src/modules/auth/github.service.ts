import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

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
      client_id: this.configService.get<string>("OAUTH_GITHUB_CLIENT_ID"),
      client_secret: this.configService.get<string>("OAUTH_GITHUB_CLIENT_SECRET"),
      code,
    };

    try {
      const res = await this.httpService
        .post(this.configService.get<string>("OAUTH_GITHUB_ACCESS_TOKEN_API"), accesstokenAPIData, accesstokenAPIConfig)
        .toPromise();
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
      const res = await this.httpService
        .get(this.configService.get<string>("OAUTH_GITHUB_EMAIL_API"), githubUserAPIConfig)
        .toPromise();
      const email = res.data[0].email;
      return email;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
