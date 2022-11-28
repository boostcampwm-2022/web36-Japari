import { Controller, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { RequestWithAccessToken, RequestWithRefreshToken, Response } from "express";
import { AuthService } from "./auth.service";
import { AccessTokenGuard } from "../jwt/jwt-access-token.guard";
import { RefreshTokenGuard } from "../jwt/jwt-refresh-token.guard";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  @Get("/login/:site")
  async login(@Param("site") site: string, @Query("code") code: string, @Res() res: Response) {
    const { jwtAccessToken, jwtRefreshToken } = await this.authService.login(site, code);
    res.cookie("jwt-access-token", jwtAccessToken, { httpOnly: true });
    res.cookie("jwt-refresh-token", jwtRefreshToken, { httpOnly: true });
    res.redirect(this.config.get<string>("REDIRECT_URI"));
  }

  @UseGuards(AccessTokenGuard)
  @Post("/logout")
  async logout(@Req() req: RequestWithAccessToken, @Res() res: Response) {
    await this.authService.logout(req.user);
    res.clearCookie("jwt-access-token");
    res.clearCookie("jwt-refresh-token");
    return res.json();
  }

  @UseGuards(AccessTokenGuard)
  @Get("/is-login")
  async isLogin() {
    return { isLogin: true };
  }

  @UseGuards(RefreshTokenGuard)
  @Get("/refresh-token")
  async refreshToken(@Req() req: RequestWithRefreshToken) {
    return this.authService.refreshJwtTokens(req.user, req.oldRefreshToken);
  }
}
