import { Module } from "@nestjs/common";

import { GameController } from "./game.controller";

import { GameService } from "./game.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
