import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubService } from "./github.service";
import { JwtStrategy } from "./jwt.strategy";
import { HttpModule } from "@nestjs/axios";

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
  providers: [AuthService, PrismaService, JwtStrategy, GithubService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
