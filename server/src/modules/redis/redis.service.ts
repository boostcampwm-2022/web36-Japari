import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisTableName } from "src/constants/enum";

@Injectable()
export class RedisService extends Redis {
  async getFrom(tableName: RedisTableName, key: string) {
    return JSON.parse(await this.hget(tableName, key));
  }

  async setTo(tableName: RedisTableName, key: string, value: any) {
    return this.hset(tableName, key, JSON.stringify(value));
  }

  async updateTo(tableName: RedisTableName, key: string, value: any) {
    const oldValue = await this.getFrom(tableName, key);
    return this.hset(tableName, key, JSON.stringify({ ...oldValue, value }));
  }
}
