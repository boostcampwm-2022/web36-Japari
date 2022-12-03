import { Module } from "@nestjs/common";
import { JWT_SECRET_KEY } from "src/constants/config";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtGuard } from "./jwt.guard";
import { JwtService } from "./jwt.service";

@Module({
  providers: [JwtService, JwtGuard, PrismaService],
  exports: [JwtService, JwtGuard],
})
export class JwtModule {}
