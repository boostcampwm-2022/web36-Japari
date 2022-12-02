import { Module } from "@nestjs/common";
import { JwtModule as JwtModuleBeforeRegister, JwtService } from "@nestjs/jwt";
import { JWT_SECRET_KEY } from "src/constants/config";
import { PrismaService } from "../prisma/prisma.service";
import { JwtGuard } from "./jwt.guard";

@Module({
  imports: [
    JwtModuleBeforeRegister.register({
      secret: JWT_SECRET_KEY,
    }),
  ],
  providers: [JwtService, JwtGuard, PrismaService],
  exports: [JwtService, JwtGuard],
})
export class JwtModule {}
