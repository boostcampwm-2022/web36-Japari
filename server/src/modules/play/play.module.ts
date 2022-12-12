import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";

import { RedisModule } from "../redis/redis.module";
import { CatchMindGateway } from "./catch-mind.gateway";
import { CatchMindService } from "./catch-mind.service";

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [],
  providers: [CatchMindGateway, CatchMindService],
  exports: [CatchMindGateway, CatchMindService],
})
export class PlayModule {}
