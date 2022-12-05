import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { MediaGateway } from "./media.gateway";

@Module({
  imports: [RedisModule],
  providers: [MediaGateway],
})
export class MediaModule {}
