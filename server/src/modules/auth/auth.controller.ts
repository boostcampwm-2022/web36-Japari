import { Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./jwt/jwt.guard";
import { REDIRECT_URI } from "src/constants/config";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/login/:site")
  async login(@Param("site") site: string, @Query("code") code: string, @Res() res: Response) {
    await this.authService.login(site, code, res);
    return res.redirect(REDIRECT_URI);
  }

  @UseGuards(JwtGuard)
  @Post("/logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);
    return res.json();
  }

  @UseGuards(JwtGuard)
  @Get("/is-login")
  async isLogin() {
    return { isLogin: true };
  }
}
