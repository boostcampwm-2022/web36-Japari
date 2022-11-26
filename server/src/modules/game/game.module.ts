import { Module } from "@nestjs/common";

import { GameController } from "./game.controller";

import { GameService } from "./game.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";
import redisConfig from "src/config/redis.config";

@Module({
  imports: [PrismaModule, RedisModule.registerAsync(redisConfig)],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
