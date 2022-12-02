import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubService } from "./github.service";
import { AccessTokenStrategy } from "../jwt/jwt-access-token.strategy";
import { HttpModule } from "@nestjs/axios";
import { RefreshTokenStrategy } from "../jwt/jwt-refresh-token.strategy";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { JwtModule } from "../jwt/jwt.module";

@Module({
  imports: [PassportModule, JwtModule, HttpModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, GithubService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
