import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/login/:site")
  async login(@Param("site") site: string, @Query("code") code: string) {
    return this.authService.login(site, code);
  }
}
