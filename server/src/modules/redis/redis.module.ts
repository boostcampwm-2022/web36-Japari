// https://www.youtube.com/watch?v=vGkInLFL0kg&list=PLnrGn4P6C4P5J2rSSyiAyxZegws4SS8ey&index=4&ab_channel=JacoboCode

import { DynamicModule, FactoryProvider, Logger, Module, ModuleMetadata } from "@nestjs/common";

import IORedis, { RedisOptions } from "ioredis";

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
};

type RedisRegisterAsyncParam = {
  useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, "imports"> &
  Pick<FactoryProvider, "inject">;

@Module({})
export class RedisModule {
  static async registerAsync({ imports, useFactory, inject }: RedisRegisterAsyncParam): Promise<DynamicModule> {
    const redisProvider = {
      provide: "RedisProvider",
      useFactory: async (...args) => {
        const logger = new Logger("RedisModule");

        const { connectionOptions } = await useFactory(...args);

        const client = new IORedis(connectionOptions);

        client.on("connect", () => {
          logger.log("redis connected");
        });

        client.on("error", err => {
          logger.error(err);
        });

        return client;
      },
      inject,
    };

    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
