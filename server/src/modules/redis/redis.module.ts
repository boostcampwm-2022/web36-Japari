import { DynamicModule, Logger, Module } from "@nestjs/common";

import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "src/constants/config";
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

    client.on("connect", () => {
      logger.verbose("redis connected");
    });

    client.on("error", err => {
      logger.error(err);
    });

    const InternalRedisService = {
      provide: RedisService,
      useValue: client,
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
