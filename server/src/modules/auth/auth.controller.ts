import { Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { RequestWithUser, RequestWithUserAndRefreshToken, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./jwt/jwt.guard";
import { REDIRECT_URI } from "src/constants/config";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/login/:site")
  async login(@Param("site") site: string, @Query("code") code: string, @Res() res: Response) {
    const { jwtAccessToken, jwtRefreshToken } = await this.authService.login(site, code);
    res.cookie("jwt-access-token", jwtAccessToken, { httpOnly: true, maxAge: 6 * 60 * 1000 });
    res.cookie("jwt-refresh-token", jwtRefreshToken, { httpOnly: true, maxAge: 14 * 60 * 60 * 1000 });
    console.log("whoo");
    res.redirect(REDIRECT_URI);
  }

  @UseGuards(JwtGuard)
  @Post("/logout")
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user);
    res.clearCookie("jwt-access-token");
    res.clearCookie("jwt-refresh-token");
    return res.json();
  }

  @UseGuards(JwtGuard)
  @Get("/is-login")
  async isLogin() {
    console.log("herer");
    return { isLogin: true };
  }
}
