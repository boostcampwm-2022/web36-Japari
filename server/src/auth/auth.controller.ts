import { Controller, Get } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  @Get()
  async login() {
    return {
      message: "로그인 성공",
    };
  }
}
