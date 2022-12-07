import { DynamicModule, Logger, Module } from "@nestjs/common";

import Redis from "ioredis";
import { async } from "rxjs";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "src/constants/config";
import { RedisTableName } from "src/constants/enum";
import { RedisService } from "./redis.service";

@Module({})
class RedisModuleWithoutConfig {
  static register(): DynamicModule {
    const logger = new Logger("Redis Module");

    const client = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    });

    const getFrom = async (tableName: RedisTableName, key: string) => {
      return JSON.parse(await client.hget(tableName, key));
    };

    const setTo = async (tableName: RedisTableName, key: string, value: any) => {
      return client.hset(tableName, key, JSON.stringify(value));
    };

    const updateTo = async (tableName: RedisTableName, key: string, value: any) => {
      const oldValue = JSON.parse(await client.hget(tableName, key));
      return client.hset(tableName, key, JSON.stringify(Object.assign(oldValue, value)));
    };

    client.on("connect", () => {
      logger.verbose("redis connected");
    });

    client.on("error", err => {
      logger.error(err);
    });

    const InternalRedisService = {
      provide: RedisService,
      useValue: Object.assign(client, {
        getFrom,
        setTo,
        updateTo,
      }),
    };

    return {
      module: RedisModuleWithoutConfig,
      imports: [],
      providers: [InternalRedisService],
      exports: [InternalRedisService],
    };
  }
}

export const RedisModule = RedisModuleWithoutConfig.register();
