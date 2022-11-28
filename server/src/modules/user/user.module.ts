import { Module } from "@nestjs/common";
import { JwtModule } from "../jwt/jwt.module";
import { PrismaModule } from "../prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";
import { UserGateway } from "./user.gateway";

@Module({
  imports: [JwtModule, PrismaModule, RedisModule],
  providers: [UserGateway],
})
export class UserModule {}
