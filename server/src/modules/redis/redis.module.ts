import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import IORedis from "ioredis";
import { RedisService } from "./redis.service";

@Module({})
class RedisModuleWithoutConfig {
  static register(): DynamicModule {
    const InternalRedisService = {
      // 다른 도메인에서 RedisService 타입으로 의존 관계가 주입된다.
      provide: RedisService,

      /*
        실제로 주입되는 인스턴스는 client 이다.
        useFactory는 value가 client인 Promise를 반환하고
        config 인스턴스가 resolve 될 때까지 기다린 후 client를 반환한다.

        예를 들어, 아래 코드에서 Object.assign(client, {id: 1234}) 를 실행하고
        다른 도메인에서 console.log(this.redis)를 해보면 id: 1234 프로퍼티가 출력된다
      */
      useFactory: (config: ConfigService) => {
        console.log(config.get("REDIS_HOST"));
        const logger = new Logger("Redis Module");

        const client = new IORedis({
          host: config.get("REDIS_HOST"),
          port: config.get("REDIS_PORT"),
          password: config.get("REDIS_PASSWORD"),
        });

        client.on("connect", () => {
          logger.verbose("redis connected");
        });

        client.on("error", err => {
          logger.error(err);
        });

        return client;
      },
      // useFactory 함수에 ConfigService 타입 인스턴스를 주입한다.
      inject: [ConfigService],
    };

    return {
      module: RedisModuleWithoutConfig,
      imports: [ConfigModule],
      providers: [InternalRedisService],
      exports: [InternalRedisService],
    };
  }
}

export const RedisModule = RedisModuleWithoutConfig.register();
