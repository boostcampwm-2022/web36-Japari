// https://www.youtube.com/watch?v=vGkInLFL0kg&list=PLnrGn4P6C4P5J2rSSyiAyxZegws4SS8ey&index=4&ab_channel=JacoboCode

import { DynamicModule, FactoryProvider, Logger, Module, ModuleMetadata } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import IORedis, { RedisOptions } from "ioredis";

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
};

type RedisRegisterAsyncParam = {
  useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, "imports"> &
  Pick<FactoryProvider, "inject">;

@Module({})
class RedisModuleWithoutConfig {
  static async registerAsync({ imports, useFactory, inject }: RedisRegisterAsyncParam): Promise<DynamicModule> {
    const redisProvider = {
      provide: "RedisProvider",
      useFactory: async (...args) => {
        const logger = new Logger("Redis Module");

        const { connectionOptions } = await useFactory(...args);

        const client = new IORedis(connectionOptions);

        client.on("connect", () => {
          logger.verbose("redis connected");
        });

        client.on("error", err => {
          logger.error(err);
        });

        return client;
      },
      inject,
    };

    return {
      module: RedisModuleWithoutConfig,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}

export const RedisModule = RedisModuleWithoutConfig.registerAsync({
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    return {
      connectionOptions: {
        host: config.get("REDIS_HOST"),
        port: config.get("REDIS_PORT"),
        password: config.get("REDIS_PASSWORD"),
      },
    };
  },
  inject: [ConfigService],
});
