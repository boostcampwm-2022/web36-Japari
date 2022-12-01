import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import { RedisTableName } from "src/constants/redis-table-name";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class GameRoomService {
  constructor(@Inject("RedisProvider") private redis: Redis) {}

  async getRoomInfo(roomId: string) {
    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));
    return room;
  }
}
