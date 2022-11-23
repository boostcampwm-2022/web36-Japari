import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

const { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } = process.env;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async githubLogin(code: string) {
    console.log(OAUTH_GITHUB_CLIENT_ID);
    /* 
      1. 
    */
    // const {user_id} = authCredentialsDto;
    // const user = await this.prisma.user.findUnique({
    //   // where: {user_id},
    // });
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // const payload = { user_id };
    // const accessToken = await this.jwtService.sign(payload);
    return code;
  }

  async kakaoLogin(code: string) {}

  async naverLogin(code: string) {}

  async googleLogin(code: string) {}

  async signup() {}
}
