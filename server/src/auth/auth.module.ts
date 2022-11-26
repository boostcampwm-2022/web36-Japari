import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubService } from "./github.service";
import { AccessTokenStrategy } from "./jwt-access-token.strategy";
import { HttpModule } from "@nestjs/axios";
import { RefreshTokenStrategy } from "./jwt-refresh-token.strategy";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    HttpModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
