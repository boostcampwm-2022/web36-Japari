import { Injectable } from "@nestjs/common";
import { RedisTableName } from "src/constants/redis-table-name";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class GameRoomService {
  constructor(private redis: RedisService) {}

  async getRoomInfo(roomId: string) {
    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));
    return room;
  }
}
