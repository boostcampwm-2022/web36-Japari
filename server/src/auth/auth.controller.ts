import { Controller, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { user } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AccessTokenGuard } from "./jwt-access-token.guard";
import { RefreshTokenGuard } from "./jwt-refresh-token.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Redirect("http://localhost:3001/lobby")
  @Get("/login/:site")
  async login(@Res() res: Response, @Param("site") site: string, @Query("code") code: string) {
    const { jwtAccessToken, jwtRefreshToken } = await this.authService.login(site, code);
    res.cookie("jwt-access-token", jwtAccessToken);
    res.cookie("jwt-refresh-token", jwtRefreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post("/logout")
  async logout(@Req() req, @Res() res: Response) {
    res.clearCookie("jwt-access-token");
    return this.authService.logout(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("/refresh-token")
  async refreshToken(@Req() req) {
    return this.authService.refreshJwtTokens(req.user, req.refreshToken);
  }
}
