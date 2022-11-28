import { Module } from "@nestjs/common";

import { GameRoomController } from "./game-room.controller";

import { GameRoomService } from "./game-room.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";
import { GameroomGateway } from "./game-room.gateway";

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [GameRoomController],
  providers: [GameRoomService, GameroomGateway],
  exports: [GameroomGateway],
})
export class GameRoomModule {}
