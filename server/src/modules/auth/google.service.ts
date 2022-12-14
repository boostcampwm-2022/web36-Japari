import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import {
  OAUTH_GOOGLE_CLIENT_ID,
  OAUTH_GOOGLE_CLIENT_SECRET,
  OAUTH_GOOGLE_ACCESS_TOKEN_API,
  OAUTH_GOOGLE_EMAIL_API,
  OAUTH_GOOGLE_REDIRECT_URI,
} from "src/constants/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class GoogleService {
  constructor(private readonly httpService: HttpService) {}

  async getGoogleEmail(code: string) {
    const accessToken = await this.fetchGoogleAccessToken(code);
    const email = await this.fetchGoogleUserAPI(accessToken);
    return email;
  }

  async fetchGoogleAccessToken(code: string): Promise<string> {
    const accesstokenAPIConfig = {
      headers: {
        accept: "application/json",
      },
    };

    const accesstokenAPIData = {
      client_id: OAUTH_GOOGLE_CLIENT_ID,
      client_secret: OAUTH_GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: OAUTH_GOOGLE_REDIRECT_URI,
      code,
    };

    try {
      const res = await lastValueFrom(
        this.httpService.post(OAUTH_GOOGLE_ACCESS_TOKEN_API, accesstokenAPIData, accesstokenAPIConfig)
      );
      const { access_token: accessToken } = res.data;
      return accessToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async fetchGoogleUserAPI(accessToken: string): Promise<string> {
    const googleUserAPIConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await lastValueFrom(this.httpService.get(OAUTH_GOOGLE_EMAIL_API, googleUserAPIConfig));
      const email = res.data.email;
      return email;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
