import { Module } from "@nestjs/common";
import { JwtModule } from "../auth/jwt/jwt.module";
import { RedisModule } from "../redis/redis.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [RedisModule],
  providers: [ChatGateway],
})
export class ChatModule {}
