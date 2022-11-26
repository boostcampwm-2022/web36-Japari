import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubService } from "./github.service";
import { AccessTokenStrategy } from "./jwt/jwt-access-token.strategy";
import { HttpModule } from "@nestjs/axios";
import { RefreshTokenStrategy } from "./jwt/jwt-refresh-token.strategy";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import jwtConfig from "src/config/jwt.config";

@Module({
  // dynamic module: https://docs.nestjs.com/fundamentals/dynamic-modules
  imports: [PassportModule, JwtModule.registerAsync(jwtConfig), HttpModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, GithubService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
