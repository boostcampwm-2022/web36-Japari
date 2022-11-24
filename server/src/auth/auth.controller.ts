import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { user } from "@prisma/client";
import { AuthService } from "./auth.service";
import { GetRefreshToken, GetUser } from "./get-from-request.decorator";
import { AccessTokenGuard } from "./jwt-access-token.guard";
import { RefreshTokenGuard } from "./jwt-refresh-token.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/login/:site")
  async login(@Param("site") site: string, @Query("code") code: string) {
    return this.authService.login(site, code);
  }

  @UseGuards(AccessTokenGuard)
  @Post("/logout")
  async logout(@GetUser() user: user) {
    return this.authService.logout(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("/refresh-token")
  async refreshToken(@GetUser() user: user, @GetRefreshToken() refreshToken: string) {
    return this.authService.refreshJwtTokens(user, refreshToken);
  }
}
