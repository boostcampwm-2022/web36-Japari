import { Module } from "@nestjs/common";
import { JwtModule } from "../jwt/jwt.module";
import { PrismaModule } from "../prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [JwtModule, PrismaModule, RedisModule],
  providers: [ChatGateway],
})
export class ChatModule {}
