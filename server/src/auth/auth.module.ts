import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubService } from "./github.service";
import { AccessTokenStrategy } from "./jwtAccessToken.strategy";
import { HttpModule } from "@nestjs/axios";
import { RefreshTokenStrategy } from "./jwtRefreshToken.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: 3600 },
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, GithubService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
