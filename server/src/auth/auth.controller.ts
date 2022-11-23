import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/login/:site")
  async login(@Param("site") site: string, @Query("code") code: string) {
    switch (site) {
      case "github":
        return this.authService.githubLogin(code);
      case "kakao":
        return;
      case "naver":
        return;
      case "google":
        break;
    }
  }
}
