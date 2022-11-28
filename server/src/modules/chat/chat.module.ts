import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [RedisModule],
  providers: [ChatGateway],
})
export class ChatModule {}
