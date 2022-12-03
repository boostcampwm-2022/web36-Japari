import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubService } from "./github.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { JwtService } from "@nestjs/jwt";
import { JwtModule } from "./jwt/jwt.module";
import { JWT_SECRET_KEY } from "src/constants/config";

@Module({
  imports: [JwtModule, HttpModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, GithubService],
  exports: [JwtModule],
})
export class AuthModule {}
